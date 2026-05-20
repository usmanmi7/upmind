# Upmind — Startup Consulting SaaS Platform

A full-stack SaaS startup consulting platform built with **Next.js 16**, **TypeScript**, **Tailwind CSS 4**, **Prisma**, **shadcn/ui**, and **Socket.io**.

![Upmind](public/images/hero.jpg)

## Features

### Public Website
- Landing page with hero, stats, features, testimonials, pricing
- About Us, Services, Pricing, Resources, Success Stories pages
- FAQ, Contact, Careers pages
- Privacy Policy & Terms pages
- Dark/Light mode support

### Authentication System
- Email/Password sign-up & login (NextAuth.js v4)
- Google OAuth placeholder
- Forgot Password flow
- Onboarding wizard (4-step)
- Role-based access (Free User, Paid User, Consultant, Admin, Super Admin)

### Customer Dashboard
- **Dashboard Home** — Stats, quick actions, getting started checklist, notifications
- **My Startup** — Startup profile, progress tracking, stage indicator
- **Resources Library** — Search, filter, bookmark, free/premium access
- **Appointments** — Book, reschedule, cancel meetings with consultants
- **Messages** — Real-time chat with Socket.io, typing indicators, online status
- **Roadmap** — Visual startup roadmap with phases, milestones, progress tracking
- **Documents** — Drag & drop upload, folder organization
- **Analytics** — Progress charts, resource usage, startup health score
- **AI Assistant** — Startup advice, business plan generator, pitch feedback, startup score
- **Community** — Discussion forums, founder directory
- **Subscription** — Plan management, billing history, upgrade/downgrade
- **Notifications** — Real-time notification center
- **Profile & Settings** — Personal info, company profile, security, preferences
- **Achievements** — Gamification badges, XP tracking, milestone celebrations

### Admin Dashboard
- **Overview** — Revenue, users, growth charts, subscription stats
- **User Management** — Search, filter, role management, ban/unban
- **Consultant Management** — Add, edit, schedule, performance metrics
- **Resource Management** — CRUD operations, premium/free toggles
- **Appointment Management** — Calendar view, assign consultants
- **Chat Management** — Monitor conversations, support tickets
- **Payments & Billing** — Revenue reports, refunds, transaction history
- **Analytics** — User, revenue, resource, engagement analytics
- **CMS** — Blog posts, FAQs, testimonials management
- **Settings** — Platform configuration, email templates, pricing

### AI Features (z-ai-web-dev-sdk)
- AI Startup Consultant chat
- Business Plan Generator
- Pitch Feedback Analyzer
- Startup Score Calculator

### Real-time Features
- Socket.io chat service with typing indicators
- Online/offline status
- Message delivery receipts
- Real-time notifications

## Tech Stack

| Technology | Purpose |
|-----------|---------|
| **Next.js 16** | React framework with App Router |
| **TypeScript 5** | Type-safe development |
| **Tailwind CSS 4** | Utility-first styling |
| **shadcn/ui** | UI component library (New York style) |
| **Prisma** | ORM with SQLite database |
| **NextAuth.js v4** | Authentication & session management |
| **Socket.io** | Real-time chat & notifications |
| **Framer Motion** | Animations & transitions |
| **Recharts** | Data visualization & charts |
| **Zustand** | Client state management |
| **Lucide React** | Icon library |
| **z-ai-web-dev-sdk** | AI features (chat, business plan, pitch feedback, startup score) |

## Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Super Admin | superadmin@upmind.io | password123 |
| Admin | admin@upmind.io | password123 |
| Paid User | demo@upmind.io | password123 |
| Consultant | sarah@upmind.io | password123 |
| Consultant | marcus@upmind.io | password123 |

## Quick Start

### Prerequisites
- Node.js 18+ or Bun
- npm, yarn, or bun

### Install & Run

```bash
# Clone the repository
git clone https://github.com/usmanmi7/upmind.git
cd upmind

# Install dependencies
bun install

# Set up the database
bun run db:push

# Seed the database (optional, for demo data)
bunx prisma db seed

# Run development server
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Chat Service (Optional - for real-time messaging)

```bash
cd mini-services/chat-service
bun install
bun run dev
```

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout with fonts & ThemeProvider
│   ├── page.tsx                # Landing page
│   ├── globals.css             # Global styles, brand colors, glassmorphism
│   ├── error.tsx               # Error boundary
│   ├── not-found.tsx           # 404 page
│   ├── auth/                   # Authentication pages
│   │   ├── signup/             # Sign up
│   │   ├── login/              # Login
│   │   ├── forgot-password/    # Password reset
│   │   └── onboarding/         # 4-step onboarding wizard
│   ├── dashboard/              # Customer dashboard
│   │   ├── layout.tsx          # Dashboard layout with sidebar
│   │   ├── page.tsx            # Dashboard home
│   │   ├── profile/            # Profile & account
│   │   ├── startup/            # Startup management
│   │   ├── resources/          # Resource library
│   │   ├── appointments/       # Appointment booking
│   │   ├── messages/           # Real-time chat
│   │   ├── roadmap/            # Startup roadmap & milestones
│   │   ├── documents/          # Document management
│   │   ├── analytics/          # User analytics
│   │   ├── ai-assistant/       # AI features
│   │   ├── community/          # Forums & founder directory
│   │   ├── subscription/       # Plan & billing management
│   │   ├── notifications/      # Notification center
│   │   └── settings/           # User settings
│   ├── admin/                  # Admin dashboard
│   │   ├── layout.tsx          # Admin layout with purple theme
│   │   ├── page.tsx            # Admin overview
│   │   ├── users/              # User management
│   │   ├── consultants/        # Consultant management
│   │   ├── resources/          # Resource management
│   │   ├── appointments/       # Appointment management
│   │   ├── chats/              # Chat monitoring
│   │   ├── payments/           # Revenue & billing
│   │   ├── analytics/          # Platform analytics
│   │   ├── cms/                # Content management
│   │   └── settings/           # Platform settings
│   ├── about/                  # Public: About page
│   ├── services/               # Public: Services page
│   ├── pricing/                # Public: Pricing page
│   ├── resources/              # Public: Resources page
│   ├── success-stories/        # Public: Success stories
│   ├── faq/                    # Public: FAQ
│   ├── contact/                # Public: Contact
│   ├── careers/                # Public: Careers
│   ├── privacy/                # Public: Privacy Policy
│   ├── terms/                  # Public: Terms & Conditions
│   └── api/                    # API routes
│       ├── auth/               # Auth endpoints
│       ├── admin/              # Admin endpoints
│       ├── ai/                 # AI endpoints
│       ├── profile/            # Profile endpoints
│       ├── startup/            # Startup endpoints
│       ├── resources/          # Resource endpoints
│       ├── appointments/       # Appointment endpoints
│       ├── messages/           # Message endpoints
│       ├── roadmap/            # Roadmap endpoints
│       ├── tasks/              # Task endpoints
│       ├── documents/          # Document endpoints
│       ├── analytics/          # Analytics endpoints
│       ├── subscription/       # Subscription endpoints
│       ├── notifications/      # Notification endpoints
│       └── achievements/       # Achievement endpoints
├── components/
│   ├── ui/                     # shadcn/ui components
│   ├── dashboard/              # Dashboard layout & shared components
│   ├── admin/                  # Admin-specific components
│   ├── PublicNavbar.tsx        # Public site navigation
│   ├── PublicFooter.tsx        # Public site footer
│   ├── ThemeProvider.tsx       # Dark/light mode provider
│   ├── AuthProvider.tsx        # Auth state provider
│   └── PageHero.tsx            # Reusable page hero component
├── hooks/
│   └── useSocket.ts            # Socket.io connection hook
├── lib/
│   ├── auth.ts                 # NextAuth configuration
│   ├── db.ts                   # Prisma client
│   ├── utils.ts                # Utility functions
│   └── access-control.ts       # Free vs Paid access logic
├── types/
│   └── next-auth.d.ts          # NextAuth type extensions
├── middleware.ts                # Route protection & role-based access
└── prisma/
    ├── schema.prisma           # Database schema (18 models)
    └── seed.ts                 # Demo data seed
```

## Design System

### Colors
- **Primary**: Deep Navy (#0F172A)
- **Accent**: Electric Blue (#3B82F6), Purple (#8B5CF6)
- **Highlights**: Cyan (#06B6D4), Green (#10B981)
- **Background**: White / Light Gray (dark mode: #0F172A)
- **Admin Theme**: Purple gradient accent

### Typography
- **Headings**: Plus Jakarta Sans (400-800 weights)
- **Body**: Inter (300-700 weights)

### UI Style
- Clean SaaS layout with sidebar dashboard
- Glassmorphism cards with blur effects
- Smooth Framer Motion animations
- Responsive mobile-first design
- Dark/Light mode support

## User Roles & Access

| Feature | Free User | Paid User | Consultant | Admin |
|---------|-----------|-----------|------------|-------|
| Public pages | Yes | Yes | Yes | Yes |
| Dashboard | Limited | Full | Full | Full |
| Resources | Free only | All | All | All |
| Appointments | 1/month | Unlimited | - | Manage |
| Direct Chat | No | Yes | Yes | Monitor |
| AI Features | Limited | Full | - | Full |
| Advanced Analytics | No | Yes | - | Full |
| Premium Resources | No | Yes | Yes | Manage |
| Admin Dashboard | No | No | No | Full |

## Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → Sign in with GitHub
3. Click **"New Project"** → Import your repo
4. Vercel auto-detects Next.js → Click **Deploy**
5. Your site is live! 🎉

## License

This project is open source and available under the [MIT License](LICENSE).
