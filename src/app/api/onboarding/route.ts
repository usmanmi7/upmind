import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const {
      name,
      phone,
      country,
      startupName,
      industry,
      teamSize,
      businessStage,
      website,
      vision,
      goals,
      plan,
    } = body

    // Update user profile
    await db.user.update({
      where: { id: session.user.id },
      data: {
        name: name || session.user.name,
        phone,
        country,
      },
    })

    // Create startup if name provided
    if (startupName) {
      const existingStartup = await db.startup.findUnique({
        where: { userId: session.user.id },
      })

      if (!existingStartup) {
        const startup = await db.startup.create({
          data: {
            userId: session.user.id,
            name: startupName,
            industry,
            teamSize,
            businessStage,
            website,
            vision,
            goals: goals ? JSON.stringify(goals) : null,
          },
        })

        // Create default roadmap tasks for the new startup
        const defaultTasks = [
          // Research phase
          { phase: "research", title: "Identify the problem you're solving", description: "Define the core pain point your target audience faces and why existing solutions fall short", order: 1 },
          { phase: "research", title: "Research your target market", description: "Estimate market size (TAM/SAM/SOM), identify customer segments, and validate demand exists", order: 2 },
          { phase: "research", title: "Analyze your competitors", description: "Map direct and indirect competitors, study their strengths, weaknesses, pricing, and positioning", order: 3 },
          { phase: "research", title: "Define your unique value proposition", description: "Articulate what makes your solution different and why customers would choose you over alternatives", order: 4 },
          { phase: "research", title: "Interview 10-20 potential customers", description: "Have real conversations with people in your target market to validate the problem and learn their language", order: 5 },
          { phase: "research", title: "Create customer personas", description: "Build 2-3 detailed profiles of your ideal customers including their goals, frustrations, and buying behavior", order: 6 },
          { phase: "research", title: "Validate willingness to pay", description: "Test whether people would actually pay for your solution through pre-sales, surveys, or landing page signups", order: 7 },
          // Build phase
          { phase: "build", title: "Define your MVP feature set", description: "List the absolute minimum features needed to solve the core problem, everything else can wait", order: 1 },
          { phase: "build", title: "Create wireframes and user flow", description: "Sketch the key screens and map the user journey from signup to achieving their first 'aha moment'", order: 2 },
          { phase: "build", title: "Choose your tech stack", description: "Select frameworks, hosting, database, and third-party services that balance speed and scalability", order: 3 },
          { phase: "build", title: "Build the MVP", description: "Develop the minimum viable product focused on the core use case, speed matters more than perfection", order: 4 },
          { phase: "build", title: "Set up analytics and tracking", description: "Implement event tracking (Mixpanel, Amplitude, or PostHog) to measure user behavior from day one", order: 5 },
          { phase: "build", title: "Test with 5-10 beta users", description: "Get real people to use your product, observe where they struggle, and collect honest feedback", order: 6 },
          { phase: "build", title: "Fix critical bugs and UX issues", description: "Address the top friction points found in beta testing before opening to a wider audience", order: 7 },
          // Launch phase
          { phase: "launch", title: "Create a landing page with clear messaging", description: "Build a conversion-focused page that explains the problem, your solution, and includes a strong call to action", order: 1 },
          { phase: "launch", title: "Set up pricing and billing", description: "Choose your pricing model (freemium, subscription, one-time), set price points, and integrate payment processing", order: 2 },
          { phase: "launch", title: "Prepare launch marketing assets", description: "Create product screenshots, demo video, social media graphics, and email announcements", order: 3 },
          { phase: "launch", title: "Launch on Product Hunt", description: "Plan your PH launch day: prepare your listing, line up supporters, and engage with comments throughout the day", order: 4 },
          { phase: "launch", title: "Share in relevant communities", description: "Post in startup subreddits, Indie Hackers, Twitter/X, LinkedIn groups, and industry-specific forums", order: 5 },
          { phase: "launch", title: "Set up customer support channels", description: "Create a help email, live chat, or support portal so early users can reach you when they need help", order: 6 },
          { phase: "launch", title: "Get your first 10 paying customers", description: "Focus on converting early signups, personally onboard users and offer founding-member pricing if needed", order: 7 },
          // Grow phase
          { phase: "grow", title: "Analyze user behavior and retention data", description: "Review analytics to understand where users drop off, what features they love, and what keeps them coming back", order: 1 },
          { phase: "grow", title: "Improve onboarding experience", description: "Reduce time-to-value by simplifying signup, adding tooltips, and guiding users to their first success", order: 2 },
          { phase: "grow", title: "Set up a content marketing strategy", description: "Create blog posts, guides, or videos that address your audience's questions and drive organic traffic", order: 3 },
          { phase: "grow", title: "Build a referral program", description: "Incentivize existing users to invite others, word of mouth is the highest-converting growth channel", order: 4 },
          { phase: "grow", title: "Optimize conversion funnel", description: "A/B test landing pages, pricing pages, and signup flows to improve visitor-to-customer conversion rates", order: 5 },
          { phase: "grow", title: "Experiment with paid acquisition", description: "Test Google Ads, Meta Ads, or LinkedIn Ads with small budgets to find profitable acquisition channels", order: 6 },
          { phase: "grow", title: "Establish key metrics and monthly targets", description: "Track MRR, churn rate, CAC, LTV, and activation rate, set monthly improvement goals for each", order: 7 },
        ]

        await db.roadmapItem.createMany({
          data: defaultTasks.map((task) => ({
            startupId: startup.id,
            phase: task.phase,
            title: task.title,
            description: task.description,
            order: task.order,
            isCompleted: false,
          })),
        })
      }
    }

    // Update subscription plan if Growth Pro selected
    if (plan === "GROWTH_PRO") {
      await db.subscription.upsert({
        where: { userId: session.user.id },
        update: {
          plan: "GROWTH_PRO",
          status: "ACTIVE",
          startDate: new Date(),
        },
        create: {
          userId: session.user.id,
          plan: "GROWTH_PRO",
          status: "ACTIVE",
          startDate: new Date(),
        },
      })

      await db.user.update({
        where: { id: session.user.id },
        data: { role: "PAID_USER" },
      })
    }

    // Create welcome notification
    await db.notification.create({
      data: {
        userId: session.user.id,
        title: "Welcome to Enginest! 🎉",
        message: "Your account is set up and ready to go. Explore your dashboard to get started.",
        type: "SYSTEM",
      },
    })

    return NextResponse.json(
      { message: "Onboarding completed successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Onboarding error:", error)
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    )
  }
}
