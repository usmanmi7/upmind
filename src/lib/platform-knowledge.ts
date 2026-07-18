/**
 * Upmind Platform Knowledge
 *
 * This is the single source of truth for static platform information that
 * the AI assistant should know about. Every value here is pulled from the
 * actual website content (Hero, About, Services, Pricing, HowWeWork, Stats,
 * dashboard layout, FAQ) so the AI gives accurate, on-brand answers.
 *
 * Update this file whenever the website content changes. The AI route reads
 * it on every request via buildPlatformContext().
 *
 * NOTE: This file is server-side only (no "use client"). It's imported by
 * /src/app/api/ai/chat/route.ts.
 */

export const PLATFORM_KNOWLEDGE = `
ABOUT UPMIND
Upmind is a business consulting SaaS platform for founders and startups. Tagline: "Strategy that scales with you." Subtagline: "From validation to growth, get the tools, insights, and expert guidance your startup needs, all in one platform."

Founded by a team of entrepreneurs, consultants, and technologists who experienced firsthand the challenges of building and scaling startups. Upmind was built to bridge the gap between raw ambition and structured execution by combining human consultant expertise with AI-powered tools.

Track record: 500+ startups helped across 20+ industries. 49% average client growth rate within the first 6 months of partnership. 95% customer satisfaction. $5M+ in efficient strategies delivered.

Free trial: 14 days, no credit card required, cancel anytime.

WHAT UPMIND OFFERS (6 core service categories)
1. Startup Strategy & Validation - validate ideas before investing time and money. Includes: Market Research & Analysis, Idea Validation Sprints, Business Model Canvas, Competitive Landscape Mapping.
2. Product Development & Growth - from MVP to scale. Includes: MVP Roadmap Planning, Product-Market Fit Analysis, Growth Hacking Strategies, User Retention Optimization.
3. Marketing & Brand Building - brand and marketing engine that scales. Includes: Brand Identity & Positioning, Content Marketing Strategy, Paid Acquisition Playbook, Social Media Growth.
4. Fundraising & Investor Relations - prepare, pitch, and close rounds. Includes: Pitch Deck Optimization, Financial Model Building, Investor Introduction, Due Diligence Prep.
5. Team Building & Culture - hire, retain, and build culture that scales. Includes: Hiring Frameworks, Culture Playbook, Compensation Strategy, Remote Team Management.
6. AI & Digital Transformation - leverage AI to automate, optimize, innovate. Includes: AI Strategy Assessment, Automation Roadmap, AI-Powered Product Features, Data Infrastructure.

HOW WE WORK (5-step process)
1. Initial Diagnosis - deep-dive assessment of current business landscape, identify key challenges and untapped opportunities, build a clear roadmap forward.
2. Strategic Planning - tailored strategic plan that aligns with the vision and sets measurable milestones for growth and innovation.
3. Implementation - work alongside the team to execute the strategy with precision and alignment with core objectives.
4. Optimization - continuous monitoring and data analysis to refine strategies and adapt to evolving market conditions.
5. Scale & Grow - scale sustainably, expand reach, deepen impact, build long-term competitive advantage.

PRICING (3 plans, monthly and annual billing, annual saves 20%)
1. Free - $0/month. Get started with the basics. Includes: 1 startup profile, Basic resources & templates, Community forum access, 1 consultation per month, Email support.
2. Growth Pro (Most Popular) - $49/month or $39/month annual. For serious founders ready to scale. Includes: Unlimited startup profiles, Premium resources & templates, Priority consultations (4/mo), Custom roadmap builder, AI-powered insights, Dedicated consultant, Advanced analytics, Document vault.
3. Enterprise - $149/month or $119/month annual. For teams and accelerators. Includes: Everything in Growth Pro, Team collaboration (up to 10), Custom integrations & API, White-label options, Dedicated account manager, SLA guarantee (99.9%), Unlimited consultations, Priority phone support.

DASHBOARD SECTIONS (logged-in user area, 13 sections)
1. Dashboard (/dashboard) - main overview of account and activity. Shows stats, quick actions, today's appointments, recent tasks, quick wins checklist, achievements summary, progress.
2. My Startup (/dashboard/startup) - startup profile setup, vision & goals, business canvas.
3. Resources (/dashboard/resources) - browse guides, templates, premium resources organized by category.
4. Appointments (/dashboard/appointments) - book calls with real consultants, view upcoming and past appointments.
5. Messages (/dashboard/messages) - direct messaging with consultants and the team.
6. Community (/dashboard/community) - connect with other founders, post discussions, comment and like.
7. Roadmap (/dashboard/roadmap) - plan and track business milestones with tasks.
8. Documents (/dashboard/documents) - storage for business plans, contracts, and files.
9. Analytics (/dashboard/analytics) - data and performance tracking for the user's startup.
10. AI Assistant (/dashboard/ai-assistant) - the AI consultant available 24/7 for advice (also accessible via the bottom search bar on the Dashboard).
11. Subscription (/dashboard/subscription) - manage plan and billing, upgrade or downgrade.
12. Notifications (/dashboard/notifications) - updates and alerts.
13. Settings (/dashboard/settings) - account and profile management.

USER ROLES
- FREE_USER - basic access, 1 startup profile, 1 consultation per month.
- PAID_USER (Growth Pro or Enterprise) - premium features, more consultations, advanced analytics, AI insights.
- ADMIN / SUPER_ADMIN - access to /admin panel for managing users, consultants, resources, appointments, payments, applications, CMS, analytics, and settings.

PLATFORM FEATURES
- AI Assistant: powered by GLM-5.2 from NVIDIA Build (https://build.nvidia.com/z-ai/glm-5.2). Available to all logged-in users via the bottom search bar on the Dashboard and the dedicated AI Assistant page. Returns structured responses (heading, description, subheading, numbered steps).
- Real-time messaging via Socket.io.
- Roadmap with milestone tracking and tasks.
- Achievement system with XP and badges (Quick Wins checklist of 6 actions worth XP each).
- Resource library with free and premium (paid users only) content.
- Consultant booking system with calendar.
- Admin panel for platform management.

KEY LINKS TO POINT USERS TO
- Sign up: /auth/signup
- Log in: /auth/login
- Book a demo: /contact
- View all services: /services
- Learn more about Upmind: /about
- Success stories: /success-stories
- Contact sales: /contact
- Pricing page: /pricing
- Upgrade plan: /dashboard/subscription
- Book a consultation: /dashboard/appointments
- Get AI advice: /dashboard/ai-assistant (or click the green pill at the bottom of the Dashboard)

ANSWERING GUIDELINES
- When users ask how to do something on the platform, point them to the specific dashboard section by name (e.g. "Go to Appointments to book a call").
- When users ask about pricing, give them the 3 plans and tell them to visit /pricing or /dashboard/subscription.
- When users ask about specific services, reference the 6 service categories above.
- If a user has a question you cannot help with (e.g. account-specific billing issue, technical bug), tell them to check Messages to reach the Upmind team.
- Always reference Upmind by name (not "the platform" or "this website").
`.trim()

/**
 * Returns the platform knowledge text to be injected into the AI's
 * system prompt. Currently just returns the constant, but kept as a
 * function so future versions can pull live data (e.g. CMS-driven FAQs)
 * without changing call sites.
 */
export function buildPlatformContext(): string {
  return PLATFORM_KNOWLEDGE
}
