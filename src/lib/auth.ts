import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { db } from "@/lib/db"
import { compare } from "bcryptjs"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required")
        }

        const user = await db.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user || !user.password) {
          throw new Error("Invalid email or password")
        }

        // Check if user is banned
        if (user.banned) {
          throw new Error("Your account has been suspended. Please contact support for assistance.")
        }

        const isPasswordValid = await compare(credentials.password, user.password)

        if (!isPasswordValid) {
          throw new Error("Invalid email or password")
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
          banned: user.banned,
        }
      },
    }),
    // Only register Google provider if credentials are configured.
    // This keeps local dev working without env vars set.
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            // Request these scopes so we can populate the user's profile.
            authorization: {
              params: {
                prompt: "select_account",
                access_type: "offline",
                response_type: "code",
              },
            },
          }),
        ]
      : []),
  ],
  callbacks: {
    /**
     * Called on every sign-in. For OAuth providers (e.g. Google), we use this
     * to upsert the user into our database by email, since OAuth users do not
     * go through the credentials `authorize` flow. This is what makes
     * "Continue with Google" create an account on first use and link
     * returning users to their existing record.
     */
    async signIn({ user, account }) {
      // Only handle OAuth providers — credentials flow is already validated
      // by `authorize` above and doesn't need DB upsert here.
      if (account?.provider && account.provider !== "credentials" && user?.email) {
        const existingUser = await db.user.findUnique({
          where: { email: user.email },
          include: { accounts: true },
        })

        // Block banned users from signing in via OAuth
        if (existingUser?.banned) {
          return false
        }

        // Create the user if this is their first OAuth sign-in
        if (!existingUser) {
          await db.user.create({
            data: {
              email: user.email,
              name: user.name ?? user.email.split("@")[0],
              image: user.image,
              emailVerified: true,
              // OAuth users have no password — they sign in via Google going forward
              password: null,
              accounts: {
                create: {
                  type: account.type,
                  provider: account.provider,
                  providerAccountId: account.providerAccountId,
                  refresh_token: account.refresh_token ?? null,
                  access_token: account.access_token ?? null,
                  expires_at: account.expires_at ?? null,
                  token_type: account.token_type ?? null,
                  scope: account.scope ?? null,
                  id_token: account.id_token ?? null,
                },
              },
            },
          })
        } else if (!existingUser.accounts.some((a) => a.provider === account.provider)) {
          // User exists (e.g. signed up with email/password) — link the Google account
          await db.account.create({
            data: {
              userId: existingUser.id,
              type: account.type,
              provider: account.provider,
              providerAccountId: account.providerAccountId,
              refresh_token: account.refresh_token ?? null,
              access_token: account.access_token ?? null,
              expires_at: account.expires_at ?? null,
              token_type: account.token_type ?? null,
              scope: account.scope ?? null,
              id_token: account.id_token ?? null,
            },
          })
        }
      }
      return true
    },
    async jwt({ token, user, trigger }) {
      // On initial sign-in, `user` is the profile returned by the provider.
      // For credentials, it has { role, banned, id } from authorize().
      // For OAuth (Google), it only has { id, name, email, image } — so we
      // need to fetch role/banned/id from our DB using the email.
      if (user) {
        const email = (user as { email?: string }).email
        const dbUser = email
          ? await db.user.findUnique({
              where: { email },
              select: { id: true, role: true, banned: true },
            })
          : null

        if (dbUser) {
          token.id = dbUser.id
          token.role = dbUser.role
          token.banned = dbUser.banned
        } else {
          // Fallback for credentials flow — user object already carries the fields
          token.id = (user as { id?: string }).id ?? token.id
          token.role = (user as { role?: string }).role ?? token.role
          token.banned = (user as { banned?: boolean }).banned ?? token.banned
        }
      }
      // When session is updated (e.g., after plan change), refresh role from DB
      if (trigger === "update") {
        const dbUser = await db.user.findUnique({
          where: { id: token.id as string },
          select: { role: true, banned: true },
        })
        if (dbUser) {
          token.role = dbUser.role
          token.banned = dbUser.banned
        }
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { role: string }).role = token.role as string
        session.user.id = token.id as string
        ;(session.user as { banned: boolean }).banned = token.banned as boolean
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET || "enginest-secret-key-change-in-production",
  debug: process.env.NODE_ENV === "development",
}
