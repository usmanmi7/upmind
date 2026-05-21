import { PrismaClient } from "@prisma/client"
import { hash } from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Seeding database...")

  // Clean up existing data
  await prisma.savedResource.deleteMany()
  await prisma.notification.deleteMany()
  await prisma.document.deleteMany()
  await prisma.roadmapItem.deleteMany()
  await prisma.task.deleteMany()
  await prisma.message.deleteMany()
  await prisma.appointment.deleteMany()
  await prisma.payment.deleteMany()
  await prisma.subscription.deleteMany()
  await prisma.consultant.deleteMany()
  await prisma.startup.deleteMany()
  await prisma.session.deleteMany()
  await prisma.account.deleteMany()
  await prisma.verificationToken.deleteMany()
  await prisma.testimonial.deleteMany()
  await prisma.fAQ.deleteMany()
  await prisma.blog.deleteMany()
  await prisma.resource.deleteMany()
  await prisma.user.deleteMany()

  const hashedPassword = await hash("password123", 12)

  // ============ ADMIN & SUPER ADMIN ============
  const superAdminUser = await prisma.user.create({
    data: {
      name: "Super Admin",
      email: "superadmin@upmind.io",
      password: hashedPassword,
      role: "SUPER_ADMIN",
      phone: "+1 (555) 000-0001",
      country: "United States",
      bio: "Platform super administrator with full system access.",
    },
  })

  const adminUser = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@upmind.io",
      password: hashedPassword,
      role: "ADMIN",
      phone: "+1 (555) 000-0002",
      country: "United States",
      bio: "Platform administrator managing day-to-day operations.",
    },
  })

  // ============ CONSULTANTS ============
  const consultant1User = await prisma.user.create({
    data: {
      name: "Dr. Sarah Chen",
      email: "sarah@upmind.io",
      password: hashedPassword,
      role: "CONSULTANT",
      bio: "Startup strategist with 15 years of experience. YC alum, helped 200+ startups validate and scale.",
      country: "United States",
    },
  })

  const consultant2User = await prisma.user.create({
    data: {
      name: "Marcus Johnson",
      email: "marcus@upmind.io",
      password: hashedPassword,
      role: "CONSULTANT",
      bio: "Fundraising expert who has helped startups raise over $500M in combined funding.",
      country: "United Kingdom",
    },
  })

  const consultant3User = await prisma.user.create({
    data: {
      name: "Dr. Aisha Patel",
      email: "aisha@upmind.io",
      password: hashedPassword,
      role: "CONSULTANT",
      bio: "Product development specialist with deep expertise in AI/ML startups.",
      country: "Canada",
    },
  })

  const consultant1 = await prisma.consultant.create({
    data: {
      userId: consultant1User.id,
      specialties: "Startup Strategy,Market Validation,Product-Market Fit",
      bio: "15 years of strategic consulting for early-stage startups. Specializing in market validation and go-to-market strategy.",
      rating: 4.9,
      availability: "Mon-Fri, 9am-5pm EST",
      isActive: true,
    },
  })

  const consultant2 = await prisma.consultant.create({
    data: {
      userId: consultant2User.id,
      specialties: "Fundraising,Investor Relations,Financial Modeling",
      bio: "Former VC turned consultant. Helps founders navigate the fundraising landscape with confidence.",
      rating: 4.8,
      availability: "Mon-Thu, 10am-4pm GMT",
      isActive: true,
    },
  })

  const consultant3 = await prisma.consultant.create({
    data: {
      userId: consultant3User.id,
      specialties: "Product Development,AI/ML Strategy,Technical Architecture",
      bio: "Former CTO with 10+ years building scalable products. Specializes in AI-driven startups.",
      rating: 4.7,
      availability: "Mon-Wed-Fri, 11am-3pm EST",
      isActive: true,
    },
  })

  console.log("✅ Created admin accounts and consultants")

  // ============ DEMO USER ============
  const demoUser = await prisma.user.create({
    data: {
      name: "Demo User",
      email: "demo@upmind.io",
      password: hashedPassword,
      role: "PAID_USER",
      phone: "+1 (555) 123-4567",
      country: "United States",
      bio: "Passionate founder building the next big thing in SaaS.",
    },
  })

  // ============ ADDITIONAL USERS ============
  const additionalUsers = [
    { name: "Emily Rodriguez", email: "emily@startup.io", role: "PAID_USER" as const, country: "United States", phone: "+1 (555) 234-5678" },
    { name: "James Park", email: "james@startup.io", role: "FREE_USER" as const, country: "South Korea", phone: "+82 10-1234-5678" },
    { name: "Sofia Martinez", email: "sofia@startup.io", role: "PAID_USER" as const, country: "Spain", phone: "+34 612-345-678" },
    { name: "Alex Thompson", email: "alex@startup.io", role: "FREE_USER" as const, country: "United Kingdom", phone: "+44 7700-900123" },
    { name: "Lena Müller", email: "lena@startup.io", role: "FREE_USER" as const, country: "Germany", phone: "+49 151-2345-6789" },
    { name: "Raj Kapoor", email: "raj@startup.io", role: "PAID_USER" as const, country: "India", phone: "+91 98765-43210" },
    { name: "Yuki Tanaka", email: "yuki@startup.io", role: "FREE_USER" as const, country: "Japan", phone: "+81 90-1234-5678" },
    { name: "Oliver Chen", email: "oliver@startup.io", role: "FREE_USER" as const, country: "Australia", phone: "+61 4-1234-5678" },
    { name: "Maria Santos", email: "maria@startup.io", role: "PAID_USER" as const, country: "Brazil", phone: "+55 11-91234-5678" },
    { name: "David Kim", email: "david@startup.io", role: "FREE_USER" as const, country: "Canada", phone: "+1 (555) 345-6789" },
    { name: "Aisha Hassan", email: "aisha.h@startup.io", role: "FREE_USER" as const, country: "UAE", phone: "+971 50-123-4567" },
    { name: "Lucas Weber", email: "lucas@startup.io", role: "FREE_USER" as const, country: "Germany", phone: "+49 170-1234567" },
  ]

  const createdUsers = []
  for (const u of additionalUsers) {
    const user = await prisma.user.create({
      data: {
        name: u.name,
        email: u.email,
        password: hashedPassword,
        role: u.role,
        country: u.country,
        phone: u.phone,
      },
    })
    createdUsers.push(user)
  }

  console.log("✅ Created additional users")

  // ============ STARTUPS ============
  const startup = await prisma.startup.create({
    data: {
      userId: demoUser.id,
      name: "TechVenture",
      industry: "SaaS",
      teamSize: "1-5",
      vision: "Building AI-powered tools that make complex business decisions simple.",
      goals: "Launch MVP by Q2, acquire first 100 users, raise seed round of $1.5M.",
      businessStage: "Early Stage",
      website: "https://techventure.io",
      progress: 35,
    },
  })

  // Create startups for some additional users
  const startupData = [
    { userId: createdUsers[0].id, name: "GreenTech Solutions", industry: "CleanTech", teamSize: "6-10", businessStage: "Growth Stage", progress: 62 },
    { userId: createdUsers[2].id, name: "FinFlow", industry: "FinTech", teamSize: "1-5", businessStage: "Early Stage", progress: 28 },
    { userId: createdUsers[5].id, name: "DataMesh AI", industry: "AI/ML", teamSize: "11-20", businessStage: "Growth Stage", progress: 55 },
    { userId: createdUsers[8].id, name: "HealthBridge", industry: "HealthTech", teamSize: "6-10", businessStage: "Early Stage", progress: 18 },
  ]

  for (const sd of startupData) {
    await prisma.startup.create({ data: sd })
  }

  console.log("✅ Created startups")

  // ============ SUBSCRIPTIONS ============
  const subscription = await prisma.subscription.create({
    data: {
      userId: demoUser.id,
      plan: "GROWTH_PRO",
      status: "ACTIVE",
      autoRenew: true,
      startDate: new Date("2024-01-01"),
    },
  })

  // Subscriptions for additional paid users
  const subsData = [
    { userId: createdUsers[0].id, plan: "ENTERPRISE" as const, status: "ACTIVE" as const },
    { userId: createdUsers[2].id, plan: "GROWTH_PRO" as const, status: "ACTIVE" as const },
    { userId: createdUsers[5].id, plan: "GROWTH_PRO" as const, status: "ACTIVE" as const },
    { userId: createdUsers[8].id, plan: "GROWTH_PRO" as const, status: "ACTIVE" as const },
    { userId: createdUsers[1].id, plan: "FREE" as const, status: "ACTIVE" as const },
    { userId: createdUsers[3].id, plan: "FREE" as const, status: "ACTIVE" as const },
    { userId: createdUsers[4].id, plan: "FREE" as const, status: "ACTIVE" as const },
    { userId: createdUsers[6].id, plan: "FREE" as const, status: "ACTIVE" as const },
    { userId: createdUsers[7].id, plan: "FREE" as const, status: "CANCELLED" as const },
    { userId: createdUsers[9].id, plan: "FREE" as const, status: "ACTIVE" as const },
    { userId: createdUsers[10].id, plan: "FREE" as const, status: "ACTIVE" as const },
    { userId: createdUsers[11].id, plan: "FREE" as const, status: "EXPIRED" as const },
  ]

  const createdSubs = []
  for (const sub of subsData) {
    const s = await prisma.subscription.create({ data: sub })
    createdSubs.push(s)
  }

  console.log("✅ Created subscriptions")

  // ============ PAYMENTS ============
  // Payments for demo user
  for (let i = 0; i < 6; i++) {
    const date = new Date()
    date.setMonth(date.getMonth() - i)
    await prisma.payment.create({
      data: {
        subscriptionId: subscription.id,
        amount: 49.0,
        currency: "USD",
        status: "COMPLETED",
        method: "card",
      },
    })
  }

  // Payments for other users
  const paymentData = [
    { subId: createdSubs[0].id, amount: 149.0, method: "card", status: "COMPLETED" as const },
    { subId: createdSubs[1].id, amount: 49.0, method: "card", status: "COMPLETED" as const },
    { subId: createdSubs[2].id, amount: 49.0, method: "paypal", status: "COMPLETED" as const },
    { subId: createdSubs[3].id, amount: 49.0, method: "card", status: "COMPLETED" as const },
    { subId: createdSubs[0].id, amount: 149.0, method: "card", status: "COMPLETED" as const },
    { subId: createdSubs[1].id, amount: 49.0, method: "card", status: "PENDING" as const },
    { subId: createdSubs[2].id, amount: 49.0, method: "card", status: "FAILED" as const },
    { subId: createdSubs[3].id, amount: 49.0, method: "paypal", status: "REFUNDED" as const },
  ]

  for (const pd of paymentData) {
    await prisma.payment.create({
      data: {
        subscriptionId: pd.subId,
        amount: pd.amount,
        currency: "USD",
        status: pd.status,
        method: pd.method,
      },
    })
  }

  console.log("✅ Created payments")

  // ============ TASKS ============
  const tasks = [
    { title: "Complete business model canvas", status: "IN_PROGRESS", description: "Fill out all sections of the business model canvas" },
    { title: "Review competitive analysis template", status: "TODO", description: "Use the template to map out your competitive landscape" },
    { title: "Set up metrics dashboard", status: "COMPLETED", description: "Configure your analytics tracking" },
    { title: "Prepare pitch deck outline", status: "TODO", description: "Draft the structure for your investor pitch deck" },
    { title: "Define customer personas", status: "COMPLETED", description: "Create 3-5 detailed customer personas" },
    { title: "Set up landing page", status: "COMPLETED", description: "Build a pre-launch landing page for waitlist" },
    { title: "Run 15 customer interviews", status: "IN_PROGRESS", description: "Conduct problem and solution interviews" },
    { title: "Create MVP feature list", status: "COMPLETED", description: "Prioritize features for minimum viable product" },
    { title: "Set up CI/CD pipeline", status: "COMPLETED", description: "Configure automated deployment" },
    { title: "Write unit tests for core features", status: "TODO", description: "Achieve 80% code coverage" },
    { title: "Design onboarding flow", status: "TODO", description: "Create user onboarding experience" },
    { title: "Plan content marketing strategy", status: "TODO", description: "Outline blog posts, social media, and email strategy" },
  ]

  for (const task of tasks) {
    await prisma.task.create({
      data: {
        startupId: startup.id,
        title: task.title,
        status: task.status as "TODO" | "IN_PROGRESS" | "COMPLETED",
        description: task.description,
        assignedBy: demoUser.id,
      },
    })
  }

  console.log("✅ Created tasks")

  // ============ ROADMAP ITEMS ============
  const roadmapItems = [
    { phase: "Research", title: "Market research & analysis", order: 1, isCompleted: true },
    { phase: "Research", title: "Competitive landscape mapping", order: 2, isCompleted: true },
    { phase: "Research", title: "Customer persona development", order: 3, isCompleted: true },
    { phase: "Research", title: "Industry trend analysis", order: 4, isCompleted: false },
    { phase: "Build", title: "Define MVP features", order: 1, isCompleted: true },
    { phase: "Build", title: "Create wireframes & prototypes", order: 2, isCompleted: true },
    { phase: "Build", title: "Develop MVP", order: 3, isCompleted: false },
    { phase: "Build", title: "Internal testing & QA", order: 4, isCompleted: false },
    { phase: "Build", title: "Beta user onboarding", order: 5, isCompleted: false },
    { phase: "Launch", title: "Launch marketing campaign", order: 1, isCompleted: false },
    { phase: "Launch", title: "Product Hunt launch", order: 2, isCompleted: false },
    { phase: "Launch", title: "Press & media outreach", order: 3, isCompleted: false },
    { phase: "Launch", title: "Monitor & iterate on feedback", order: 4, isCompleted: false },
    { phase: "Grow", title: "Optimize conversion funnel", order: 1, isCompleted: false },
    { phase: "Grow", title: "Scale paid acquisition", order: 2, isCompleted: false },
    { phase: "Grow", title: "Build referral program", order: 3, isCompleted: false },
    { phase: "Grow", title: "Prepare for Series A", order: 4, isCompleted: false },
  ]

  for (const item of roadmapItems) {
    await prisma.roadmapItem.create({
      data: {
        startupId: startup.id,
        phase: item.phase,
        title: item.title,
        order: item.order,
        isCompleted: item.isCompleted,
      },
    })
  }

  console.log("✅ Created roadmap items")

  // ============ RESOURCES ============
  const resources = [
    {
      title: "The Ultimate Startup Validation Framework",
      slug: "ultimate-startup-validation-framework",
      type: "GUIDE",
      category: "Startup Tips",
      isPremium: false,
      description: "A step-by-step framework to validate your startup idea in 2 weeks. Learn the proven methodology used by 500+ successful founders.",
      readTime: "15 min",
      tags: "Validation,Startups,Strategy,Market Research",
      content: `## Why Validation Matters More Than Your Product

Most startup failures don't happen because the product was bad — they happen because nobody wanted it. According to CB Insights, 42% of startups fail because there's no market need. That's more than running out of cash, team problems, or getting outcompeted combined.

The good news? Validation is a learnable skill. And it doesn't require months of work or thousands of dollars. In fact, the best validation happens quickly, cheaply, and before you write a single line of code.

## The 2-Week Validation Framework

### Week 1: Problem Discovery

**Days 1-2: Define Your Hypothesis**

Start by writing down your core assumptions. Every startup begins with beliefs about the world that may or may not be true. The goal of validation is to test these beliefs as efficiently as possible.

Write your hypothesis in this format: "I believe that [target customer] struggles with [specific problem] and would pay [amount] to solve it because [reason]."

Be brutally specific. "Small business owners struggle with accounting" is too vague. "Freelance designers with 5-20 clients spend 4+ hours per week chasing invoice payments and lose an average of $2,000 annually to late payments" is a testable hypothesis.

**Days 3-5: Customer Interviews**

Conduct 15-20 interviews with people in your target market. The key rules:

1. **Never pitch your solution.** Ask about their current experience, not your idea.
2. **Focus on the past, not the future.** "Tell me about the last time you dealt with this problem" beats "Would you use a tool that does X?"
3. **Listen for emotion and specifics.** If someone says "it's fine" or "I don't really think about it," that's a red flag. Real problems generate real frustration.
4. **Ask about workarounds.** If people have built spreadsheets, manual processes, or hacks to solve a problem, that's a strong signal.

**Days 6-7: Analyze Interview Data**

After your interviews, look for patterns. Are at least 60% of interviewees describing the same core problem? Are they actively trying to solve it? Do they have budget allocated or willingness to pay?

Create a simple spreadsheet tracking: how many people mentioned the problem, how severe it is (1-5), current solutions they use, and willingness to pay.

### Week 2: Solution Validation

**Days 8-9: Build a Smoke Test**

Create a simple landing page that describes your solution. Don't build the product — just describe what it would do. Include a clear call to action: "Join the waitlist," "Get early access," or "Pre-order for 50% off."

The landing page should include: a compelling headline, 3-5 key benefits, pricing (even if approximate), and an email capture form. Use tools like Carrd, Webflow, or even a simple Notion page.

**Days 10-11: Drive Traffic**

Share your landing page in communities where your target customers hang out. Reddit, Twitter/X, LinkedIn groups, Discord servers, Product Hunt Upcoming — meet them where they already are.

Aim for at least 200-500 page visitors. Track your conversion rate: what percentage give you their email? A conversion rate above 5-10% for a waitlist is a positive signal.

**Days 12-14: Measure and Decide**

Evaluate your results against these benchmarks:

- **Strong signal**: 40%+ of interviewees describe the same painful problem, 10%+ landing page conversion, people asking "when can I buy this?"
- **Moderate signal**: 20-40% problem overlap, 5-10% conversion, some genuine interest
- **Weak signal**: Less than 20% overlap, below 5% conversion, polite interest but no urgency

## Common Validation Mistakes to Avoid

1. **Asking friends and family.** They'll tell you what you want to hear. Talk to strangers who match your target customer.
2. **Confusing interest with intent.** "That sounds cool" is not validation. "How do I sign up right now?" is.
3. **Testing too many things at once.** Focus on one core hypothesis per validation cycle.
4. **Skipping pricing validation.** If you don't test willingness to pay, you're only validating half the equation.
5. **Giving up too early.** If your first hypothesis fails, pivot and test a new one. The process is working exactly as intended.

## What Comes Next

Once you've validated your core hypothesis, it's time to build your MVP. But that's a topic for another guide. The key takeaway: validation isn't a one-time event — it's a continuous process that should inform every major decision you make as a founder.

The best founders validate before they build, measure before they scale, and listen before they lead. Start with this framework, and you'll already be ahead of 90% of first-time founders.`,
    },
    {
      title: "Pitch Deck Template That Raised $5M",
      slug: "pitch-deck-template-raised-5m",
      type: "TEMPLATE",
      category: "Funding",
      isPremium: true,
      description: "The exact template used by founders who raised Series A. Includes slide-by-slide breakdown, examples, and pro tips from VCs.",
      readTime: "Template",
      tags: "Pitch Deck,Fundraising,Investors,Series A",
      content: `## The Anatomy of a Winning Pitch Deck

After analyzing 200+ successful pitch decks and interviewing 50+ venture capitalists, we've identified the exact structure that gets meetings booked and checks written. This isn't theory — it's the template that helped our founders raise over $500M in combined funding.

## The 12-Slide Structure That Works

### Slide 1: Title
Your company name, one-line tagline, and logo. That's it. Your tagline should be a 5-7 word sentence that makes investors want to turn to the next slide. Not "A platform for X" but "We're building the Stripe for healthcare payments."

### Slide 2: Problem
Describe the problem in human terms. Use a real story or statistic. Make the investor feel the pain. "40% of freelance workers lose income because clients don't pay on time — that's $15B in unpaid invoices annually."

### Slide 3: Solution
Now reveal your solution. Keep it simple. One sentence for what it does, one sentence for how it works. "AutoPay uses bank-connected smart contracts to trigger payment the moment work is delivered, guaranteed."

### Slide 4: Market Size
Use TAM → SAM → SOM framework. Bottom-up is better than top-down. "There are 70M freelancers in the US. 40% have late payment issues. Average annual loss: $2,000. That's a $56B problem in the US alone."

### Slide 5: Business Model
How do you make money? Unit economics matter more than revenue at this stage. "We charge 2.5% per transaction. Average freelancer processes $50K/year through our platform. That's $1,250 ARPU."

### Slide 6: Traction
This is the most important slide. Show momentum with real numbers: revenue growth, user growth, retention, logos. Charts speak louder than words. Even early traction (MRR growing 20% MoM) tells a compelling story.

### Slide 7: Go-to-Market
How will you acquire customers? Be specific about channels, CAC, and viral coefficients. "Community-led growth in freelance Discord servers (CAC: $12). Referral program drives 30% of new signups. Partnership with Upwork for distribution."

### Slide 8: Competition
A 2x2 matrix with your company in the top-right quadrant. Be honest about competitors — investors know them anyway. Your positioning should be: "Like X but for Y audience" or "X meets Y for Z use case."

### Slide 9: Team
Why are YOU the right people to build this? Highlight relevant domain expertise, previous exits, or unique insights. "CEO: 10 years running a freelance agency, experienced the problem firsthand. CTO: Built payment systems at Stripe."

### Slide 10: Financial Projections
3-5 year projections with key assumptions stated clearly. Don't overpromise — sophisticated investors will discount your numbers anyway. Show you understand the levers that drive growth.

### Slide 11: The Ask
How much are you raising? What will you use it for? How long will it last? "Raising $3M seed round. 18 months of runway. 50% engineering, 30% sales, 20% operations."

### Slide 12: Contact
Name, email, phone. Make it easy to reach you.

## Design Rules That Separate Pros from Amateurs

1. **One idea per slide.** If you're cramming, you're losing your audience.
2. **30pt font minimum.** If investors can't read it from across a table, it's too small.
3. **More visuals, less text.** Screenshots, charts, and logos beat paragraphs every time.
4. **Consistent branding.** Use 2-3 colors max. Same font throughout. Professional and clean.
5. **Numbers over adjectives.** "Fast-growing" means nothing. "300% YoY growth" means everything.

## Pro Tips from VCs

- **Send as PDF.** Never send a PowerPoint. Not everyone has the same fonts or software.
- **Under 15 slides.** If you can't tell your story in 12 slides, you don't know your story.
- **Practice your narrative.** The deck supports your story — it doesn't tell it for you.
- **Customize for each meeting.** Research the firm and tailor your competitive slide and market sizing.
- **Follow up within 24 hours.** With additional data points they asked about.`,
    },
    {
      title: "AI-Powered Growth Hacking Playbook",
      slug: "ai-powered-growth-hacking-playbook",
      type: "PDF",
      category: "AI",
      isPremium: true,
      description: "Leverage AI tools to 10x your growth without 10x the budget. A comprehensive guide to AI-driven marketing, content, and analytics.",
      readTime: "25 min",
      tags: "AI,Growth Hacking,Marketing,Automation",
      content: `## The AI Growth Revolution Is Here

The startups that will dominate the next decade aren't the ones with the biggest budgets — they're the ones that best leverage AI to amplify every growth lever. We've compiled the exact strategies and tools that our most successful founders use to achieve 10x growth without 10x the headcount.

## Phase 1: AI-Powered Content Engine

### Automated Content Creation

Content is still king, but the rules have changed. AI doesn't replace great content — it amplifies it. Here's how to build a content engine that produces 10x the output at 2x the quality:

**The 3-Step AI Content Workflow:**

1. **Research with AI.** Use ChatGPT or Claude to analyze top-performing content in your niche. Feed it 10 competitor articles and ask: "What patterns do you see? What's missing? What angles haven't been covered?"

2. **Draft with AI.** Generate outlines and first drafts using AI, then add your unique perspective, data, and voice. The AI does 60% of the work; you do the 40% that makes it great.

3. **Distribute with AI.** Use tools like Buffer's AI assistant or Jasper to create platform-specific versions of your content. One blog post becomes a Twitter thread, a LinkedIn carousel, an email newsletter, and 5 short-form videos.

### Content Calendar Automation

Use AI to generate a 90-day content calendar in minutes. Feed your niche, target keywords, and content pillars, and get a day-by-day publishing schedule with topic suggestions, headline options, and distribution strategies.

## Phase 2: AI-Driven Customer Acquisition

### Predictive Lead Scoring

Stop treating all leads equally. AI can analyze your existing customer data to identify which leads are most likely to convert. Tools like Clearbit and 6sense use firmographic and behavioral data to score leads in real-time.

**Setup in 3 steps:**
1. Export your last 12 months of customer data (industry, company size, sign-up behavior, time to conversion)
2. Train a simple model using tools like Obviously AI or BigQuery ML
3. Integrate with your CRM to auto-prioritize high-score leads

### AI-Powered Outreach

Personalized outreach at scale is now possible. Use AI to:
- Write personalized first lines based on LinkedIn profiles
- A/B test subject lines and messaging automatically
- Time emails for optimal open rates per recipient
- Follow up intelligently based on engagement signals

**Recommended tools:** Apollo.io, Lavender, Regie.ai

## Phase 3: AI Analytics & Optimization

### Real-Time Funnel Optimization

AI can identify where users drop off and suggest fixes before you even notice the problem. Tools like Amplitude's AI copilot and Heap's auto-capture can:
- Automatically identify anomalous behavior patterns
- Suggest A/B test ideas based on user behavior
- Predict which experiments will have the biggest impact

### Churn Prediction

For SaaS startups, churn is the silent killer. AI models can predict which users are likely to churn 30-60 days before they do, giving you time to intervene.

**Quick-win approach:**
1. Identify key churn signals (decreased login frequency, support tickets, feature adoption drop)
2. Set up automated "health score" calculations
3. Create triggered interventions for at-risk accounts (personal emails, feature walkthroughs, special offers)

## Phase 4: AI Product Development

### Feature Prioritization with AI

Use AI to analyze user feedback, support tickets, and usage data to identify which features will have the biggest impact on retention and revenue. Tools like Canny with AI summarization can process thousands of feedback items in minutes.

### AI-Powered Onboarding

Personalize the onboarding experience for each user based on their role, industry, and stated goals. Dynamic onboarding flows that adapt in real-time can increase activation rates by 40-60%.

## The AI Stack We Recommend

| Category | Free Tier | Paid Tier |
|----------|-----------|-----------|
| Content | ChatGPT Free | Claude Pro |
| Images | Canva AI | Midjourney |
| Analytics | Google Analytics | Amplitude |
| Outreach | Apollo Free | Apollo Paid |
| Social | Buffer Free | Hootsuite AI |
| Email | Mailchimp | Customer.io |

## Measuring AI-Powered Growth

Track these metrics to quantify your AI advantage:
- **Content velocity:** Articles published per month (target: 4x pre-AI)
- **CAC reduction:** Cost per acquisition change (target: -40%)
- **Conversion lift:** Landing page conversion improvement (target: +25%)
- **Time saved:** Hours saved per week per team member (target: 15+ hours)
- **Revenue per employee:** Should increase by 30-50% within 6 months`,
    },
    {
      title: "Building a Brand That Stands Out",
      slug: "building-brand-that-stands-out",
      type: "BLOG",
      category: "Branding",
      isPremium: false,
      description: "How to create a memorable brand identity on a startup budget. Real strategies from founders who built iconic brands from scratch.",
      readTime: "8 min",
      tags: "Branding,Identity,Design,Startups",
      content: `## Your Brand Is Not Your Logo

Let's get this out of the way: your brand is not your logo, your color palette, or your font choices. Your brand is the gut feeling people have when they interact with your company. It's the sum of every touchpoint, every interaction, every word you speak and action you take.

The good news? You don't need a $50,000 brand agency to build a powerful brand. You need clarity, consistency, and a deep understanding of who you're building for.

## Step 1: Define Your Brand DNA

Before you design anything, answer these three questions:

1. **What do you believe?** Not what your product does — what you believe about the world. Patagonia believes we're in an environmental crisis. Apple believes in thinking differently. What's your conviction?

2. **Who are you for?** "Everyone" is not an answer. The most powerful brands speak to a specific person. Notion speaks to the productivity-obsessed creative. Figma speaks to collaborative designers. Who is your person?

3. **What makes you different?** Not better — different. Better is subjective and easily copied. Different is ownable. Slack isn't "better email" — it's a completely different way to communicate at work.

## Step 2: Build Your Visual Identity (On a Budget)

### Color: Pick One, Own It

Don't pick five colors. Pick one signature color and own it. Tiffany blue. Spotify green. Robinhood orange. When someone sees that color, they should think of you.

For your brand, choose a primary color that evokes the right emotion, then add one neutral (white, black, or gray) and one accent. Three colors total. That's it.

### Typography: Two Fonts Maximum

One font for headings, one for body. Choose fonts that match your personality. A fintech startup might use a clean geometric sans-serif. A craft brand might use a warm serif. Free options: Google Fonts has world-class typefaces.

### Logo: Simple and Scalable

Your logo should work at 16px (favicon) and 16 feet (billboard). If it doesn't, it's too complex. The best startup logos are wordmarks or simple symbols. You can create a professional logo for free using Figma, or hire a designer on Fiverr for $50-200.

## Step 3: Craft Your Voice

Your brand voice should be as distinctive as your visual identity. Write down three adjectives that describe how you sound. Then write the opposite of each — those are the things you never sound like.

**Example:**
- We sound: Confident, Warm, Direct
- We never sound: Arrogant, Cold, Vague

Create a "do/don't" list for common scenarios:
- Welcome emails: Do say "Glad you're here" — Don't say "Welcome valued customer"
- Error messages: Do say "Something went wrong — let's fix it" — Don't say "Error 404: Resource not found"
- CTAs: Do say "Start building" — Don't say "Submit"

## Step 4: Be Consistent Across Every Touchpoint

Consistency is what separates brands from logos. Every single interaction should feel like it came from the same company:

- **Website**: Same voice, same colors, same personality
- **Emails**: Not just templates — tone, pacing, and personality
- **Social media**: Not cross-posted content — platform-native content in your voice
- **Customer support**: Especially here. Your support tone IS your brand for frustrated users
- **Product**: Microcopy, onboarding, error states — all on-brand

## Step 5: Tell Your Story

People don't buy products — they buy stories. Your founding story is your most powerful brand asset. Why did you start this company? What problem did you experience? What's the mission driving you?

Share it everywhere: your About page, your pitch deck, your social media, your hiring posts. The best brands have founders who are visibly driven by a mission, not just a market opportunity.

## The Startup Brand Checklist

- [ ] Brand beliefs written down (3 sentences max)
- [ ] Target customer persona defined with demographics AND psychographics
- [ ] One signature color chosen
- [ ] Two fonts selected
- [ ] Simple logo created
- [ ] Brand voice adjectives defined (3)
- [ ] Do/Don't language guide created
- [ ] Founding story written (200 words)
- [ ] Applied consistently to: website, emails, social, product

Remember: a consistent brand built on authentic beliefs will always outperform a polished brand with no soul. Start with who you are, not who you think you should be.`,
    },
    {
      title: "Content Marketing Strategy for Startups",
      slug: "content-marketing-strategy-startups",
      type: "GUIDE",
      category: "Marketing",
      isPremium: false,
      description: "Create content that drives organic traffic and converts visitors. The complete playbook from strategy to execution.",
      readTime: "12 min",
      tags: "Content Marketing,SEO,Organic Growth,Strategy",
      content: `## Why Content Marketing Is Your Best Growth Channel

Paid acquisition gets expensive. Referrals are unpredictable. Viral growth is a lottery ticket. But content marketing? It's the one channel that compounds over time, builds trust, and creates a moat that competitors can't easily replicate.

The data is clear: companies that blog get 67% more leads than those that don't. Content marketing costs 62% less than outbound marketing and generates 3x as many leads. For startups with limited budgets, it's not just the best option — it's often the only sustainable one.

## The 4-Pillar Content Strategy

### Pillar 1: Problem-Aware Content

Create content for people who know they have a problem but don't know the solution exists. These are your highest-value readers because they're actively searching for help.

**Formats:** Long-form guides, how-to articles, comparison posts
**Example:** "How to validate your startup idea without spending money"
**Distribution:** SEO, Google search, Reddit, Quora

### Pillar 2: Solution-Aware Content

For people who know solutions exist but haven't chosen one yet. This is where you position your approach as the best option.

**Formats:** Case studies, framework posts, tool reviews
**Example:** "The 2-week validation framework that 500+ founders use"
**Distribution:** Email, social media, community sharing

### Pillar 3: Product-Aware Content

For people evaluating your product specifically. Show proof that it works.

**Formats:** Customer stories, ROI analyses, feature deep-dives
**Example:** "How TechVenture validated their idea in 10 days using Upmind"
**Distribution:** Email nurture, retargeting, sales enablement

### Pillar 4: Brand-Aware Content

For your existing audience and community. Keep them engaged and sharing.

**Formats:** Opinion pieces, industry trends, founder stories
**Example:** "Why we believe every founder deserves a consultant"
**Distribution:** Newsletter, social media, speaking opportunities

## Building Your Content Calendar

### Week 1-4: Foundation

- Publish 4 pillar pieces (one per pillar above)
- Set up your blog with proper SEO basics (meta tags, sitemap, schema)
- Create your email capture and newsletter setup
- Claim your social profiles with consistent branding

### Week 5-12: Momentum

- Publish 2-3 pieces per week
- Start building backlinks through guest posts and partnerships
- Launch your email newsletter (weekly or bi-weekly)
- Repurpose long-form content into social snippets

### Week 13+: Scale

- Analyze what's working and double down
- Start creating content clusters around your best-performing topics
- Build a content distribution network (communities, partnerships, syndication)
- Consider hiring or contracting additional writers

## SEO for Startups: The Non-Negotiables

1. **Keyword research before writing.** Use free tools like Google Search Console, Ubersuggest, or AnswerThePublic. Target long-tail keywords with clear search intent.

2. **On-page optimization.** Include your target keyword in the title, first 100 words, one H2, meta description, and URL slug. Don't stuff — write naturally.

3. **Internal linking.** Link between your own articles. This builds topic authority and keeps readers on your site longer.

4. **Page speed.** Use Next.js or a static site generator. Compress images. Aim for under 3 seconds load time.

5. **Consistency.** Google rewards consistent publishing. Two posts per week for six months beats ten posts in one month.

## Content Distribution: The 80/20 Rule

Spend 20% of your time creating content and 80% distributing it. Here's how:

- **Email list:** Your most valuable distribution channel. Nurture it relentlessly.
- **Social media:** Don't just post links. Create native content for each platform.
- **Communities:** Share genuinely helpful content in relevant Reddit, Discord, and Slack communities.
- **Partnerships:** Cross-promote with complementary companies.
- **Guest posting:** Write for larger publications in your niche.

## Measuring Content Marketing Success

Track these metrics monthly:
- Organic traffic growth (target: 10-20% MoM)
- Email subscribers gained
- Content-attributed signups/leads
- Average time on page (target: 3+ minutes)
- Social shares and engagement
- Search rankings for target keywords

Content marketing is a long game. But for startups willing to invest 6-12 months of consistent effort, it becomes an unbeatable competitive advantage that pays dividends for years.`,
    },
    {
      title: "Financial Model Template",
      slug: "financial-model-template",
      type: "TEMPLATE",
      category: "Funding",
      isPremium: true,
      description: "Professional financial model template for investor presentations. Includes revenue projections, expense forecasts, and unit economics.",
      readTime: "Template",
      tags: "Financial Model,Projections,Unit Economics,Fundraising",
      content: `## Building a Financial Model That Investors Trust

A financial model isn't about predicting the future with precision — it's about demonstrating that you understand the key drivers of your business and can think critically about growth. The best models tell a coherent story backed by reasonable assumptions.

## The 5 Essential Components

### 1. Revenue Model

Start with your unit economics and work up:

- **Pricing tiers:** What do you charge? Per user? Per transaction? Flat fee?
- **Customer segments:** How many customers in each tier?
- **Growth rate:** How fast do you acquire new customers? What drives growth?
- **Expansion revenue:** Do customers spend more over time?
- **Churn rate:** What percentage of customers leave each month?

**Example calculation:**
- 100 customers in Month 1 at $49/mo average = $4,900 MRR
- 10% monthly growth = 110 customers in Month 2
- 5% monthly churn = lose 5 customers in Month 2
- Net: 105 customers × $49 = $5,145 MRR in Month 2

### 2. Cost Structure

Break costs into fixed and variable:

**Fixed costs:**
- Salaries and benefits (biggest line item, typically 60-70% of expenses)
- Office/rent (or remote work stipends)
- Software subscriptions and tools
- Insurance and legal

**Variable costs:**
- Customer acquisition cost (CAC)
- Payment processing fees
- Cloud infrastructure (scales with usage)
- Customer support (scales with customer count)

### 3. Cash Flow Projections

Map out monthly cash inflows and outflows for 18-24 months. This is what determines how much you need to raise:

- Beginning cash balance
- + Revenue collected
- - Operating expenses
- - Capital expenditures
- = Ending cash balance

**Rule of thumb:** Always maintain 6 months of runway as a buffer.

### 4. Key Metrics Dashboard

Investors want to see these metrics at a glance:

| Metric | Formula | Healthy Range (SaaS) |
|--------|---------|---------------------|
| MRR | Monthly Recurring Revenue | Growing 10-20% MoM |
| ARR | MRR × 12 | Track absolute number |
| ARPU | Revenue / Customers | Trending up |
| CAC | Sales & Marketing Spend / New Customers | < 12 months payback |
| LTV | ARPU × (1/Churn) × Gross Margin | > 3× CAC |
| LTV:CAC Ratio | LTV / CAC | > 3:1 |
| Payback Period | CAC / (ARPU × Gross Margin) | < 12 months |
| Burn Rate | Monthly cash outflow | Track absolute number |
| Runway | Cash / Monthly Burn | > 18 months |

### 5. Sensitivity Analysis

Show investors you've thought about risk. Create three scenarios:

- **Base case:** Most likely outcome (this is your main model)
- **Optimistic case:** 20-30% better than base case assumptions
- **Conservative case:** 20-30% worse than base case assumptions

Vary key assumptions: growth rate, churn, pricing, and CAC. Show how changes impact runway and break-even point.

## Common Mistakes That Kill Credibility

1. **Hockey stick without justification.** "We'll grow 50% MoM because" isn't a model. Show the pipeline, funnel, and acquisition strategy that drives growth.
2. **Ignoring seasonality.** Most businesses have seasonal patterns. Acknowledge them.
3. **Underestimating costs.** Everything costs more and takes longer than you think. Add 20-30% buffer.
4. **Forgetting about taxes.** Include tax estimates in your model.
5. **No sensitivity analysis.** A single-point forecast tells investors you haven't considered risk.

## Template Structure

Your financial model spreadsheet should include these tabs:
1. **Assumptions** — All key inputs in one place
2. **Revenue Forecast** — Monthly for 24 months, then quarterly
3. **Expense Forecast** — Same timeline, broken out by category
4. **Headcount Plan** — Who you're hiring, when, and at what cost
5. **Cash Flow** — Monthly cash in/out with runway calculation
6. **Dashboard** — Summary metrics and charts for quick reference`,
    },
    {
      title: "Hiring Your First 10 Employees",
      slug: "hiring-first-10-employees",
      type: "VIDEO",
      category: "Startup Tips",
      isPremium: false,
      description: "A comprehensive guide to making your first critical hires. Learn who to hire first, where to find them, and how to close top talent.",
      readTime: "30 min",
      tags: "Hiring,Team Building,Startups,Recruitment",
      content: `## Your First 10 Hires Define Everything

The first 10 people you hire will determine the trajectory of your company. They set the culture, establish the work ethic, and create the DNA that future employees will inherit. Get these wrong, and you'll spend years fighting uphill. Get them right, and everything becomes easier.

This guide walks you through exactly who to hire, in what order, and how to find and close exceptional candidates when you can't compete on salary.

## The Hiring Sequence

### Hires 1-3: The Foundation

**Hire 1: Senior Engineer / Technical Co-Founder**

Your first hire should be someone who can build. Not a junior developer who needs direction — a senior engineer who can take your vision and turn it into reality independently. This person will set your technical standards, choose your stack, and establish your engineering culture.

**What to look for:** 5+ years experience, startup mentality (comfortable with ambiguity), strong opinions loosely held, ability to ship fast. They should be excited about the problem space, not just the technology.

**Where to find them:** YC Work at a Startup, AngelList, your personal network, open source communities.

**Hire 2: Product-Minded Designer**

A designer who understands product strategy, not just visual design. This person will shape how users experience your product. They should be able to take a vague idea and turn it into a clear, usable interface.

**What to look for:** Portfolio showing end-to-end product design, understanding of user research, ability to code basic HTML/CSS is a plus. They should ask "why" before "how."

**Hire 3: Growth/Marketing Generalist**

Someone who can do it all: content, social, email, SEO, paid ads, analytics. At this stage, you don't need specialists — you need someone who can experiment across channels and find what works.

**What to look for:** Track record of growing something from zero, analytical mindset, excellent writing skills, bias toward action over planning.

### Hires 4-7: The Accelerators

**Hire 4: Second Engineer (Frontend or Backend, opposite of Hire 1)**

Round out your technical team. If Hire 1 was backend, hire frontend. If Hire 1 was full-stack, hire a specialist.

**Hire 5: Customer Success / Support**

Your early customers are your most valuable asset. Hire someone who genuinely cares about making them successful. This person will also be your best source of product feedback.

**Hire 6: Sales / Business Development**

If you're B2B, this hire comes earlier. If you're B2C, it might come later. The key is someone who can tell your story compellingly and close deals.

**Hire 7: Third Engineer**

By now, you have enough technical debt and feature requests to justify a third engineer. Focus on someone who complements the existing team's strengths.

### Hires 8-10: The Specialists

**Hire 8: Data Analyst / Analytics Engineer**

You've been making decisions on gut instinct. It's time to add data rigor. This person will help you understand what's actually happening vs. what you think is happening.

**Hire 9: Operations / Finance**

Someone needs to keep the trains running. Payroll, benefits, compliance, vendor management. This hire frees the founders to focus on product and growth.

**Hire 10: Content / Community Manager**

Double down on content marketing and community building. This person creates the content that attracts customers and builds the community that retains them.

## How to Close Top Talent Without Big Salaries

### 1. Sell the Mission, Not the Job

Top performers aren't motivated by money alone (though they need to pay rent). Sell them on the impact they'll have: "You'll be the first designer. Everything users see will be shaped by you."

### 2. Offer Meaningful Equity

Early employees should receive 0.5-2.0% equity, vesting over 4 years with a 1-year cliff. Be transparent about the valuation and what their equity could be worth.

### 3. Provide Extraordinary Autonomy

The best people want freedom. Offer remote work, flexible hours, and ownership over their domain. "You own marketing. I'll give input, but you make the final call."

### 4. Show Momentum

Nothing attracts talent like momentum. Share your growth metrics, customer testimonials, and recent wins. People want to join a rocket ship.

### 5. Move Fast

Top candidates get multiple offers. Your hiring process should be: initial call (30 min) → deep dive (60 min) → offer within 5 business days. Any slower and you'll lose them.

## Interview Framework for Early Hires

1. **Tell me about a time you built something from scratch.** (Looking for: initiative, resourcefulness, comfort with ambiguity)
2. **What's the most impactful thing you've shipped?** (Looking for: results orientation, ability to prioritize)
3. **Tell me about a failure and what you learned.** (Looking for: self-awareness, growth mindset)
4. **How would you approach [specific challenge our startup faces]?** (Looking for: problem-solving, strategic thinking)
5. **Why this company? Why now?** (Looking for: genuine motivation, alignment with mission)

## Red Flags in Early Hires

- Talks about what they'll manage, not what they'll build
- Asks about work-life balance in the first interview
- Wants detailed job descriptions and clear boundaries
- Focuses on title and seniority
- Can't give specific examples of impact from previous roles`,
    },
    {
      title: "Marketing Automation with AI",
      slug: "marketing-automation-with-ai",
      type: "VIDEO",
      category: "AI",
      isPremium: true,
      description: "Automate your marketing stack with AI-powered tools. Learn the exact workflows that save 20+ hours per week.",
      readTime: "20 min",
      tags: "Marketing,AI,Automation,Workflows",
      content: `## The AI Marketing Automation Blueprint

The average startup marketer spends 16 hours per week on tasks that could be automated. That's two full workdays lost to manual data entry, content formatting, report building, and repetitive outreach. AI marketing automation isn't about replacing marketers — it's about freeing them to do the strategic, creative work that actually moves the needle.

This guide covers the exact automation workflows we've implemented for 200+ startups, resulting in an average of 20+ hours saved per week and 35% improvement in campaign performance.

## Automation Workflow 1: Smart Email Sequences

### The Problem
Traditional email sequences are static: if-then rules that can't adapt to individual behavior. You send the same 5-email sequence to every lead, regardless of their engagement level, industry, or stage in the buying journey.

### The AI Solution
Dynamic email sequences that adapt in real-time based on recipient behavior:

1. **AI writes personalized subject lines** based on the recipient's industry, role, and past engagement. Our testing shows 47% higher open rates vs. generic subject lines.

2. **Send time optimization** analyzes when each recipient is most likely to open emails and schedules accordingly. No more "best time to send" guesswork.

3. **Behavioral branching** goes beyond "opened/clicked." AI analyzes which links they clicked, how long they spent on your site, and whether they compared pricing pages — then routes them to the right next email.

4. **Auto-generated follow-ups** that reference specific actions. "I noticed you checked out our pricing page — any questions about the Growth Pro plan?"

### Recommended Tools
- Customer.io for behavioral email automation
- Lavender for AI-powered email coaching
- Seventh Sense for send time optimization

## Automation Workflow 2: Social Media Content Engine

### The Problem
Creating platform-native content for 4+ social channels is exhausting. Most startups either post the same content everywhere (bad) or neglect most channels (worse).

### The AI Solution
One piece of long-form content → 10+ social assets, automatically:

1. **Write a blog post** (with AI assistance for research and first draft)
2. **AI extracts 5-7 key insights** and turns each into a standalone social post
3. **Auto-generate Twitter threads** with hooks, value, and CTAs
4. **Create LinkedIn carousels** from key statistics and frameworks
5. **Generate short-form video scripts** for TikTok/Reels/Shorts
6. **Schedule everything** with AI-optimized posting times per platform

### Recommended Tools
- Jasper for content repurposing
- Buffer/Hootsuite for scheduling
- Canva AI for visual asset generation
- Opus Clip for auto-generating short videos from long content

## Automation Workflow 3: Lead Scoring & Routing

### The Problem
Sales reps waste 60% of their time on leads that will never buy. Meanwhile, hot leads sit in the queue for days, going cold.

### The AI Solution
Real-time lead scoring that gets smarter over time:

1. **Collect signals:** Website visits, email engagement, content downloads, pricing page views, demo requests, social interactions
2. **AI scores each lead** 0-100 based on conversion probability (trained on your historical data)
3. **Auto-route high-score leads** to your best closers immediately
4. **Nurture low-score leads** with automated content sequences until they're sales-ready
5. **Predict optimal outreach timing** based on individual behavior patterns

### Recommended Tools
- Clearbit for firmographic enrichment
- 6sense for intent data
- HubSpot's AI scoring (if using HubSpot)
- Clay for data enrichment and workflow automation

## Automation Workflow 4: Reporting & Analytics

### The Problem
Building weekly marketing reports takes 4-6 hours. By the time you're done, the data is already stale.

### The AI Solution
Automated dashboards that update in real-time:

1. **Connect all data sources** (Google Analytics, ad platforms, CRM, email tool)
2. **AI generates weekly summaries** with plain-English insights
3. **Anomaly detection** alerts you when metrics deviate from expected ranges
4. **Automated recommendations** based on performance trends
5. **One-click sharing** with stakeholders via Slack or email

### Recommended Tools
- Databox for dashboarding
- Narrative Science for AI-generated reports
- Google Looker Studio (free) for custom dashboards

## Implementation Timeline

**Week 1:** Set up email automation (Workflow 1) — highest immediate ROI
**Week 2:** Implement content repurposing pipeline (Workflow 2)
**Week 3:** Connect lead scoring (Workflow 3)
**Week 4:** Build automated reporting (Workflow 4)

Total setup time: 20-30 hours
Expected time savings: 20+ hours per week (ongoing)
Expected performance improvement: 25-40% across all channels`,
    },
    {
      title: "Social Media Playbook 2024",
      slug: "social-media-playbook-2024",
      type: "PDF",
      category: "Marketing",
      isPremium: false,
      description: "Stay ahead with the latest social media strategies and trends. Platform-specific tactics that actually work for startups.",
      readTime: "10 min",
      tags: "Social Media,Marketing,Strategy,Growth",
      content: `## Social Media for Startups: What Actually Works in 2024

Forget everything you think you know about social media marketing. The landscape has shifted dramatically, and the strategies that worked even a year ago are now obsolete. This playbook covers what's actually driving results for startups right now.

## Platform-by-Platform Strategy

### X (Twitter): Build in Public

X remains the #1 platform for founders building in public. The algorithm heavily favors threads and long-form content. Here's what works:

**Content strategy:**
- Share your journey daily — wins, failures, learnings
- Write threads that teach something specific (5-10 tweets)
- Engage in relevant conversations (don't just broadcast)
- Quote-tweet with your perspective, not just "this"

**Growth tactics:**
- Post 3-5 times per day (mix of threads, single tweets, replies)
- Engage with 20+ accounts in your niche daily
- Use "hooks" — strong opening lines that make people stop scrolling
- Share numbers and metrics (people love real data)

### LinkedIn: The Underrated Growth Engine

LinkedIn's algorithm currently favors personal posts over company pages. Founders who post consistently on LinkedIn see 3-5x the engagement of Twitter for B2B audiences.

**Content strategy:**
- Write about lessons learned (not humblebrags)
- Share frameworks and mental models
- Post about hiring (it signals growth)
- Document your journey with vulnerability

**Format tips:**
- Text-only posts outperform posts with images (counterintuitive but true)
- Use line breaks for readability (short paragraphs)
- End with a question to drive comments
- Post Tuesday through Thursday, 8-10am in your timezone

### TikTok / Instagram Reels: The Discovery Engine

Short-form video isn't optional anymore — it's the primary way new audiences discover brands. You don't need professional production; authenticity outperforms polish.

**Content strategy:**
- "Day in the life" as a founder
- Quick tips and hot takes (15-30 seconds)
- Before/after transformations
- Reacting to industry news
- Behind-the-scenes of building your product

**Production tips:**
- Film on your phone (don't over-produce)
- Hook in the first 2 seconds (or they scroll)
- Add captions (80% watch without sound)
- Post 4-7 times per week for growth

### YouTube: Long-Form Authority

YouTube is the second-largest search engine. For startups, it's the best platform for building deep authority and trust through educational content.

**Content strategy:**
- Tutorial videos ("How to do X")
- Explainer videos ("What is X and why does it matter")
- Founder vlogs (build personal brand)
- Interview series with industry experts

**Optimization:**
- Thumbnails matter more than video quality
- First 30 seconds determine if people keep watching
- Include timestamps for longer videos
- Optimize title and description for search

## The 80/20 Social Media Strategy

If you only have 30 minutes per day for social media, do this:

1. **10 minutes:** Write one substantive post (thread, LinkedIn article, or video script)
2. **10 minutes:** Engage with 10 people in your target audience (genuine comments, not "great post!")
3. **10 minutes:** Respond to comments and DMs

Consistency beats intensity. Posting once a day for 90 days beats posting 10 times in one day and disappearing.

## Content Calendar Template

| Day | X (Twitter) | LinkedIn | Short Video |
|-----|-------------|----------|-------------|
| Mon | Build in public update | Lesson learned | Quick tip |
| Tue | Thread (educational) | Framework post | Behind the scenes |
| Wed | Industry take | Hiring/culture | React to news |
| Thu | Thread (story) | Data/metrics share | Day in the life |
| Fri | Casual/engagement | Week in review | Fun/creative |

## Measuring What Matters

Don't get distracted by vanity metrics. Track these:

- **Website clicks from social** → Are you driving real traffic?
- **Email signups from social** → Are you converting followers to owned audience?
- **DMs and conversations** → Are you building real relationships?
- **Share of voice** → Are people talking about you?

Forget follower count. 1,000 engaged followers who click, share, and buy beat 100,000 passive followers every time.`,
    },
    {
      title: "Startup Legal Essentials Checklist",
      slug: "startup-legal-essentials-checklist",
      type: "TEMPLATE",
      category: "Startup Tips",
      isPremium: false,
      description: "Don't miss any legal requirements when launching your startup. A comprehensive checklist from formation to fundraising.",
      readTime: "Template",
      tags: "Legal,Compliance,Formation,Checklist",
      content: `## The Startup Legal Checklist: Everything You Need Before, During, and After Launch

Legal mistakes are expensive to fix and can kill fundraising rounds, partnerships, and even the company itself. This checklist covers every legal essential, from the day you decide to start a company through your first funding round.

## Phase 1: Company Formation

### Entity Setup
- [ ] Choose entity type (Delaware C-Corp is standard for venture-backed startups)
- [ ] File Certificate of Incorporation with Delaware
- [ ] Obtain EIN (Employer Identification Number) from IRS
- [ ] Open business bank account (NEVER commingle personal and business funds)
- [ ] Register for state taxes in your operating state
- [ ] File foreign qualification if operating outside Delaware

### Corporate Governance
- [ ] Adopt bylaws
- [ ] Appoint initial directors and officers
- [ ] Authorize initial equity (typically 10M authorized shares)
- [ ] Adopt equity incentive plan (stock option pool)
- [ ] Issue founder shares with vesting schedules
- [ ] File 83(b) elections within 30 days of founder stock purchase (CRITICAL — cannot be fixed later)

### Founder Agreements
- [ ] Founders' IP assignment agreement (company owns what you build)
- [ ] Founder vesting agreement (4-year vesting, 1-year cliff is standard)
- [ ] Voting agreement (how founders vote their shares)
- [ ] Right of first refusal (company gets first option on share transfers)
- [ ] Non-competition and non-solicitation agreements (check state enforceability)

## Phase 2: Intellectual Property

### IP Protection
- [ ] Assign all IP to the company (not personal ownership)
- [ ] File trademark applications for company name and logo
- [ ] Consider provisional patent applications for key innovations
- [ ] Implement IP assignment clauses in all employee/contractor agreements
- [ ] Document all IP creation with dated records

### Open Source Compliance
- [ ] Audit all open source software used in your product
- [ ] Ensure compliance with license terms (especially GPL, AGPL)
- [ ] Create open source usage policy for engineering team
- [ ] Document third-party dependencies and their licenses

## Phase 3: Employment & Contractors

### Employee Documentation
- [ ] Offer letter template (at-will employment, role, compensation, equity)
- [ ] Confidentiality and invention assignment agreement
- [ ] Employee handbook (required in some states)
- [ ] Non-solicitation agreement (check state enforceability)
- [ ] Benefits enrollment and compliance (health insurance, 401k)
- [ ] I-9 employment eligibility verification
- [ ] State-specific required postings and notices

### Independent Contractors
- [ ] Contractor agreement with clear IP assignment
- [ ] W-9 form for tax reporting
- [ ] 1099 filing at year-end
- [ ] Clear distinction between employee and contractor roles (misclassification risk)

### Advisory Board
- [ ] Advisory agreement with clear expectations
- [ ] Advisory equity grant (typically 0.1-0.5% for 1-2 year term)
- [ ] Confidentiality and IP provisions
- [ ] Define scope of advice and time commitment

## Phase 4: Customer & Vendor Agreements

### Customer Agreements
- [ ] Terms of Service / Terms of Use
- [ ] Privacy Policy (required by law in most jurisdictions)
- [ ] Cookie Policy (required for EU/UK users)
- [ ] Data Processing Agreement (if handling EU personal data)
- [ ] Service Level Agreement (for B2B customers)
- [ ] End User License Agreement (for software products)

### Vendor Agreements
- [ ] Master service agreement template
- [ ] Non-disclosure agreement (NDA) template
- [ ] Vendor evaluation and due diligence checklist
- [ ] Payment terms and conditions
- [ ] Data security and privacy requirements

## Phase 5: Fundraising Legal

### Pre-Raise Preparation
- [ ] Clean cap table (no messy terms or dead equity)
- [ ] Updated corporate governance documents
- [ ] Previous financing documents organized
- [ ] IP assignment chain verified
- [ ] Employment agreements confirmed
- [ ] Financial statements prepared

### During the Raise
- [ ] Term sheet negotiation (understand every term)
- [ ] Investor due diligence package prepared
- [ ] SAFE or convertible note documents (if using)
- [ ] Securities law compliance (Reg D filing)
- [ ] State blue sky filings
- [ ] Cap table modeling for different scenarios

### Post-Raise
- [ ] Board composition updated per financing terms
- [ ] Protective provisions and investor rights documented
- [ ] Updated cap table reflecting new investment
- [ ] File Form D with SEC within 15 days
- [ ] Update corporate records and resolutions

## Common Legal Mistakes That Kill Startups

1. **Skipping 83(b) election.** If you don't file within 30 days of receiving restricted stock, you'll owe taxes on the appreciation. This can be devastating.

2. **Not assigning IP to the company.** If founders or contractors retain IP rights, investors won't fund you.

3. **Commingle personal and business finances.** This pierces the corporate veil and makes you personally liable.

4. **Using DIY legal documents.** A $500 mistake now becomes a $50,000 mistake at fundraising time.

5. **Ignoring securities laws.** Selling equity without proper exemptions is illegal and can't be fixed retroactively.

## Budget Guidance

| Legal Item | Cost Range | Priority |
|-----------|-----------|----------|
| Company formation | $500-2,000 | Required |
| Founder agreements | $1,000-3,000 | Required |
| Trademark filing | $250-500 per mark | High |
| Terms of Service | $1,000-5,000 | Required |
| Patent application | $5,000-15,000 | Optional |
| Fundraising legal | $5,000-20,000 | When raising |

**Total minimum for launch:** $3,000-10,000
**Total for funded startup:** $15,000-40,000

Spend money on a good startup lawyer early. It's the best investment you'll make.`,
    },
    {
      title: "Competitive Analysis Framework",
      slug: "competitive-analysis-framework",
      type: "GUIDE",
      category: "Branding",
      isPremium: true,
      description: "Systematically analyze and outmaneuver your competition. A proven framework used by top strategy consultants.",
      readTime: "18 min",
      tags: "Competition,Strategy,Analysis,Market Research",
      content: `## Why Most Competitive Analysis Is Useless

Most startups do competitive analysis wrong. They make a spreadsheet listing competitor features, slap on some pricing, and call it done. That tells you what competitors do — but not why they do it, where they're vulnerable, or how to position against them strategically.

This framework, adapted from McKinsey and BCG methodologies, helps you think about competition the way top strategy consultants do: systematically, objectively, and with an eye for exploitable gaps.

## The 5-Layer Competitive Analysis Framework

### Layer 1: Market Landscape Mapping

Start by mapping the entire competitive landscape, not just direct competitors:

**Direct competitors:** Same product, same customer (e.g., Notion vs. Coda)
**Indirect competitors:** Different product, same job-to-be-done (e.g., Notion vs. Google Docs)
**Substitutes:** Alternative ways to solve the problem (e.g., Notion vs. pen and paper + whiteboard)
**Emerging threats:** New technologies or business models that could disrupt the space

Create a 2x2 matrix with two axes that matter most in your market. Common choices:
- Price vs. Features
- Ease of use vs. Customization
- Self-serve vs. Enterprise
- Horizontal vs. Vertical

Plot every competitor. Where are the gaps? Where are the clusters? The gaps are your opportunities.

### Layer 2: Competitor Deep-Dives

For your top 5-8 competitors, analyze:

**Product:**
- Core value proposition (what they promise)
- Key features and differentiators
- Product roadmap trajectory (where are they heading?)
- Technical architecture advantages/limitations
- User experience quality

**Business:**
- Pricing model and tiers
- Target customer segments
- Distribution channels
- Unit economics (if public or if you can estimate)
- Revenue and growth rate

**Brand:**
- Positioning and messaging
- Brand personality and voice
- Content strategy and channels
- Community and social presence
- Customer sentiment and reviews

**Team:**
- Key hires and departures (check LinkedIn)
- Engineering team size and expertise
- Leadership background and strengths
- Company culture signals

### Layer 3: Win/Loss Analysis

This is the most valuable and most skipped step. Talk to customers who:
- Chose you over a competitor (wins)
- Chose a competitor over you (losses)
- Used a competitor then switched to you
- Used you then switched to a competitor

Ask specific questions:
- "What was the #1 reason you chose [competitor]?"
- "What almost made you choose us instead?"
- "What does [competitor] do better than anyone else?"
- "What frustrates you about [competitor]?"

Patterns in win/loss data reveal your true competitive advantages and vulnerabilities — not what you think they are, but what customers actually experience.

### Layer 4: Strategic Positioning

Based on your analysis, choose your strategic position:

**Differentiation:** Be uniquely better at something specific (Stripe = developer experience)
**Cost leadership:** Be the affordable option (Canva vs. Adobe)
**Focus:** Own a specific niche deeply (Bloomberg Terminal for finance)
**Platform:** Be the ecosystem others build on (Shopify for e-commerce)

Your positioning should answer: "Why should a customer choose us over every alternative, including doing nothing?"

### Layer 5: Competitive Moat Building

Identify which moats you can build over time:

1. **Network effects:** Each new user makes the product more valuable (marketplaces, social platforms)
2. **Switching costs:** Make it painful to leave (data lock-in, workflows, integrations)
3. **Economies of scale:** Get cheaper as you grow (cloud infrastructure, marketplaces)
4. **Brand:** Build trust that competitors can't replicate quickly
5. **Proprietary data:** Collect unique data that improves your product and blocks competitors

## Turning Analysis into Action

Create a one-page competitive battle card for your team:

1. **Who we're up against** (top 3 competitors)
2. **How we're different** (3 key differentiators)
3. **When we win** (specific scenarios where we're the clear choice)
4. **When we lose** (scenarios where competitors are stronger)
5. **Key messages** (what to say when a prospect mentions a competitor)
6. **Objection handling** (how to respond to "But Competitor X does Y")

Update this quarterly. Competition evolves, and so should your strategy.`,
    },
    {
      title: "Product-Market Fit Assessment",
      slug: "product-market-fit-assessment",
      type: "PDF",
      category: "Startup Tips",
      isPremium: true,
      description: "Quantitatively measure your progress toward product-market fit. The framework that separates signal from noise.",
      readTime: "15 min",
      tags: "Product-Market Fit,Validation,Metrics,Growth",
      content: `## What Product-Market Fit Actually Looks Like

Marc Andreessen famously said "you can always feel product-market fit" — but feelings are unreliable, especially for first-time founders who desperately want to believe they've found it. This assessment gives you a quantitative framework to measure where you stand and what to do next.

## The PMF Spectrum

Product-market fit isn't binary — it's a spectrum. Understanding where you are on this spectrum determines what you should optimize for:

**No PMF (0-20%):** Customers aren't engaging. Churn is high. Growth requires constant pushing. You should be iterating on the product, not scaling.

**Emerging PMF (20-50%):** Some customers love you. Retention is improving. Word of mouth is starting. Focus on understanding what's working for your best customers and doubling down.

**Strong PMF (50-80%):** Most customers love you. Retention is strong. Growth is accelerating organically. You can start investing in scale.

**Exceptional PMF (80%+):** Demand outstrips supply. Customers are evangelists. Growth is compounding. Focus on operational excellence and market expansion.

## The Sean Ellis Test

The most widely used quantitative PMF measure comes from Sean Ellis: survey your customers and ask, "How would you feel if you could no longer use this product?"

- Very disappointed
- Somewhat disappointed
- Not disappointed
- I no longer use it

**If 40%+ say "very disappointed," you have product-market fit.**

This isn't arbitrary — Ellis analyzed hundreds of startups and found this threshold consistently predicted sustainable growth.

### How to Run This Survey

1. Survey active users (used your product at least twice in the past two weeks)
2. Get at least 40 responses for statistical significance
3. Segment results by user type, acquisition channel, and use case
4. The segments with the highest "very disappointed" rates are your true product-market fit segments

## Retention-Based PMF Measurement

The other key indicator is your retention curve. For product-market fit, your retention curve should flatten — meaning users stop churning after a certain point.

**SaaS retention targets:**
- Month 1: 80%+ (20% monthly churn is the maximum tolerable)
- Month 3: 65%+
- Month 6: 50%+
- Month 12: 40%+ (the curve should be flattening by now)

If your retention curve keeps declining without flattening, you don't have PMF. Users are trying your product but not finding lasting value.

## The Leading Indicators of PMF

Before you see it in retention data, look for these qualitative signals:

1. **Unprompted testimonials.** Customers write you emails about how much they love the product — without you asking.
2. **Feature requests that build on your core.** Customers want more of what you do, not different things.
3. **Organic word of mouth.** People hear about you from friends, not ads.
4. **Pull from the market.** Customers, press, and partners come to you.
5. **Pricing sensitivity decreases.** Customers care less about price and more about getting access.
6. **Usage depth increases.** Users adopt more features and spend more time in the product over time.
7. **Low support burden.** Customers figure out the product themselves because it's intuitive.

## The PMF Assessment Scorecard

Rate each dimension 1-5 and calculate your total:

| Dimension | 1 (No PMF) | 3 (Emerging) | 5 (Strong PMF) |
|-----------|-----------|--------------|----------------|
| Sean Ellis Score | <20% | 25-35% | >40% |
| Monthly Retention | <70% | 75-85% | >85% |
| Organic Growth % | <10% | 20-40% | >50% |
| NPS Score | <0 | 10-30 | >50 |
| Feature Request Quality | Random/different | Adjacent to core | Deepening core |
| Customer Emotion | Apathetic | Satisfied | Passionate |
| Sales Cycle | Long/educational | Moderate | Short/pull |
| Pricing Power | None | Some | Strong |

**Score 8-16:** No PMF. Keep iterating on the product.
**Score 17-28:** Emerging PMF. Double down on what's working.
**Score 29-40:** Strong PMF. Start scaling aggressively.

## What to Do at Each Stage

### No PMF: Iterate Fast
- Shorten feedback loops (talk to customers weekly)
- Run rapid experiments (2-week cycles)
- Don't scale customer acquisition yet
- Consider pivoting if you've been at this stage for 6+ months

### Emerging PMF: Focus
- Identify your best customer segment (highest retention, lowest CAC)
- Build specifically for them (ignore other segments for now)
- Deepen the core value, don't expand horizontally
- Start measuring cohort retention carefully

### Strong PMF: Scale
- Invest heavily in customer acquisition
- Build the team and infrastructure for growth
- Expand to adjacent segments
- Start building competitive moats`,
    },
  ]

  for (const resource of resources) {
    await prisma.resource.create({
      data: {
        title: resource.title,
        slug: resource.slug,
        type: resource.type as "BLOG" | "TEMPLATE" | "VIDEO" | "PDF" | "GUIDE",
        category: resource.category,
        isPremium: resource.isPremium,
        description: resource.description,
        content: resource.content,
        readTime: resource.readTime,
        tags: resource.tags,
        downloadCount: Math.floor(Math.random() * 500) + 50,
        authorId: consultant1User.id,
      },
    })
  }

  console.log("✅ Created resources")

  // ============ BLOG POSTS ============
  const blogPosts = [
    { title: "10 Mistakes First-Time Founders Make (And How to Avoid Them)", slug: "10-mistakes-first-time-founders", category: "Startup Tips", excerpt: "Learn from the most common pitfalls that trip up new founders.", content: "Starting a company is one of the most challenging things you can do. Here are the top mistakes and how to avoid them:\n\n1. **Not validating your idea** - Talk to real customers before writing code.\n2. **Building too much** - Start with an MVP and iterate.\n3. **Ignoring unit economics** - Know your numbers from day one.\n4. **Hiring too fast** - Every early hire shapes your culture.\n5. **Not having a clear value prop** - If you can't explain it simply, it's not clear enough." },
    { title: "How to Validate Your Startup Idea in 2 Weeks", slug: "validate-startup-idea-2-weeks", category: "Startup Tips", excerpt: "A practical framework for quick validation without spending a fortune.", content: "The biggest risk in starting up is building something nobody wants. Here's a 2-week framework:\n\n**Week 1:** Customer interviews (15-20), competitive analysis, landing page test.\n**Week 2:** Analyze data, iterate on concept, measure intent signals." },
    { title: "The Art of the Pitch: What Investors Really Want to See", slug: "art-of-pitch-what-investors-want", category: "Funding", excerpt: "Inside tips from a former VC on crafting a winning pitch deck.", content: "After reviewing thousands of pitch decks, here's what separates the good from the great:\n\n- Clear problem statement with data\n- Unique insight that others miss\n- Traction metrics that matter\n- Team that can execute\n- Realistic ask with clear use of funds" },
    { title: "AI Tools Every Startup Founder Should Know About", slug: "ai-tools-startup-founders", category: "AI", excerpt: "The best AI tools to automate, optimize, and accelerate your startup.", content: "AI is no longer a luxury — it's a necessity for startups looking to compete. Here are the top tools:\n\n- **ChatGPT/Claude** - Content creation and brainstorming\n- **Midjourney** - Quick design prototyping\n- **Cursor** - AI-powered code editor\n- **Jasper** - Marketing copy at scale" },
    { title: "From Zero to 1000 Users: A Growth Playbook", slug: "zero-to-1000-users-growth-playbook", category: "Marketing", excerpt: "Proven strategies to get your first 1000 users without breaking the bank.", content: "Getting your first 1000 users is the hardest part of building a startup. Here are proven strategies:\n\n1. Leverage your personal network\n2. Launch on Product Hunt\n3. Create content that provides real value\n4. Build in public on Twitter/X\n5. Offer an irresistible free tier" },
    { title: "Enterprise Sales for Startups: A Complete Guide", slug: "enterprise-sales-startups-guide", category: "Funding", excerpt: "How to land your first enterprise customer and build a scalable sales process.", content: "Enterprise sales can transform your startup. Here's how to get started:\n\n- Start with warm introductions\n- Understand the procurement process\n- Build champions inside the organization\n- Price for value, not cost\n- Be patient but persistent" },
  ]

  for (const post of blogPosts) {
    await prisma.blog.create({
      data: {
        title: post.title,
        slug: post.slug,
        category: post.category,
        excerpt: post.excerpt,
        content: post.content,
        isPublished: true,
        authorId: consultant1User.id,
        tags: post.category,
      },
    })
  }

  // Add an unpublished draft
  await prisma.blog.create({
    data: {
      title: "The Future of No-Code: Trends for 2025",
      slug: "future-no-code-trends-2025",
      category: "Technology",
      excerpt: "An upcoming deep dive into the no-code revolution.",
      content: "Draft content about no-code trends...",
      isPublished: false,
      authorId: consultant2User.id,
      tags: "Technology",
    },
  })

  console.log("✅ Created blog posts")

  // ============ FAQS ============
  const faqs = [
    { question: "What is Upmind?", answer: "Upmind is a strategic consulting platform designed specifically for startups. We combine expert human consultants with AI-powered insights to help founders validate ideas, build products, raise funding, and scale their businesses.", category: "General", order: 1 },
    { question: "Who is Upmind for?", answer: "Upmind is for early-stage and growth-stage startup founders who want access to premium consulting, resources, and tools without the cost of a full-time advisory team.", category: "General", order: 2 },
    { question: "Is there a free plan?", answer: "Yes! Our Free plan includes 1 startup profile, basic resources, community access, and 1 consultation per month.", category: "Pricing", order: 3 },
    { question: "Can I switch plans at any time?", answer: "Yes, you can upgrade or downgrade at any time. Upgrades take effect immediately with prorated billing.", category: "Pricing", order: 4 },
    { question: "How do consultations work?", answer: "Book a session through your dashboard, choose your consultant, pick a time slot, and meet via video, phone, or in-person.", category: "Consulting", order: 5 },
    { question: "Who are the consultants?", answer: "Our consultants are experienced founders, operators, and domain experts with proven track records across various industries.", category: "Consulting", order: 6 },
    { question: "What types of resources are available?", answer: "We offer blog posts, templates, video tutorials, PDF guides, and interactive tools — all curated by our expert consultants.", category: "Resources", order: 7 },
    { question: "Is my data secure?", answer: "We use enterprise-grade encryption, follow SOC 2 best practices, and never share your data with third parties.", category: "Technical", order: 8 },
    { question: "Is there a mobile app?", answer: "Our platform is fully responsive and works great on mobile browsers. A dedicated mobile app is on our roadmap.", category: "Technical", order: 9 },
  ]

  for (const faq of faqs) {
    await prisma.fAQ.create({ data: faq })
  }

  console.log("✅ Created FAQs")

  // ============ TESTIMONIALS ============
  const testimonials = [
    { name: "Sarah Chen", role: "CEO", company: "TechFlow", content: "Upmind helped us validate our idea in just 2 weeks. We saved months of wasted effort and $50K in potential missteps.", rating: 5, order: 1 },
    { name: "Marcus Johnson", role: "Founder", company: "GreenScale", content: "The consulting sessions were game-changing. Our consultant helped us see blind spots we never would have caught on our own.", rating: 5, order: 2 },
    { name: "Priya Sharma", role: "CTO", company: "DataBridge", content: "The resources and templates alone are worth the subscription. They saved us hundreds of hours of research.", rating: 5, order: 3 },
    { name: "Tom Reynolds", role: "Co-Founder", company: "CloudNine", content: "From idea validation to our first paying customer — Upmind was there every step of the way.", rating: 4, order: 4 },
    { name: "Lisa Chang", role: "Founder", company: "NovaTech", content: "Best investment we made in our early stage. The ROI was 10x within 3 months.", rating: 5, order: 5 },
  ]

  for (const testimonial of testimonials) {
    await prisma.testimonial.create({ data: testimonial })
  }

  console.log("✅ Created testimonials")

  // ============ NOTIFICATIONS ============
  const notifications = [
    { title: "Welcome to Upmind!", message: "Your account is set up. Start by creating your startup profile.", type: "SYSTEM" },
    { title: "New message from Dr. Sarah Chen", message: "Let's discuss your market validation results next session.", type: "MESSAGE" },
    { title: "Appointment reminder", message: "You have a consultation with Dr. Sarah Chen tomorrow at 2:00 PM.", type: "APPOINTMENT" },
    { title: "Payment confirmed", message: "Your Growth Pro subscription payment of $49.00 was processed.", type: "PAYMENT" },
    { title: "New resource available", message: "AI-Powered Growth Hacking Playbook has been added to the library.", type: "RESOURCE" },
  ]

  for (let i = 0; i < notifications.length; i++) {
    await prisma.notification.create({
      data: {
        userId: demoUser.id,
        title: notifications[i].title,
        message: notifications[i].message,
        type: notifications[i].type as "MESSAGE" | "APPOINTMENT" | "PAYMENT" | "RESOURCE" | "SYSTEM",
        isRead: i > 1,
      },
    })
  }

  console.log("✅ Created notifications")

  // ============ APPOINTMENTS ============
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(14, 0, 0, 0)

  const nextWeek = new Date(today)
  nextWeek.setDate(nextWeek.getDate() + 7)
  nextWeek.setHours(10, 0, 0, 0)

  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  yesterday.setHours(11, 0, 0, 0)

  const lastWeek = new Date(today)
  lastWeek.setDate(lastWeek.getDate() - 7)
  lastWeek.setHours(15, 0, 0, 0)

  const todayAppt = new Date(today)
  todayAppt.setHours(16, 0, 0, 0)

  await prisma.appointment.createMany({
    data: [
      { userId: demoUser.id, consultantId: consultant1.id, date: tomorrow, duration: 60, type: "VIDEO", status: "SCHEDULED", notes: "Discuss market validation results" },
      { userId: demoUser.id, consultantId: consultant2.id, date: nextWeek, duration: 45, type: "PHONE", status: "SCHEDULED", notes: "Review fundraising strategy" },
      { userId: demoUser.id, consultantId: consultant1.id, date: yesterday, duration: 60, type: "VIDEO", status: "COMPLETED", notes: "Product roadmap review" },
      { userId: demoUser.id, consultantId: consultant3.id, date: lastWeek, duration: 30, type: "PHONE", status: "CANCELLED", notes: "Initial consultation - cancelled by user" },
      { userId: createdUsers[0].id, consultantId: consultant1.id, date: todayAppt, duration: 60, type: "VIDEO", status: "SCHEDULED", notes: "Growth strategy session" },
      { userId: createdUsers[2].id, consultantId: consultant2.id, date: todayAppt, duration: 45, type: "IN_PERSON", status: "SCHEDULED", notes: "Fundraising preparation" },
      { userId: createdUsers[5].id, consultantId: consultant3.id, date: nextWeek, duration: 60, type: "VIDEO", status: "SCHEDULED", notes: "AI product architecture review" },
      { userId: createdUsers[0].id, consultantId: consultant2.id, date: lastWeek, duration: 60, type: "VIDEO", status: "COMPLETED", notes: "Enterprise pricing strategy" },
      { userId: createdUsers[8].id, consultantId: consultant1.id, date: yesterday, duration: 30, type: "PHONE", status: "COMPLETED", notes: "Initial consultation" },
    ],
  })

  console.log("✅ Created appointments")

  // ============ DOCUMENTS ============
  await prisma.document.createMany({
    data: [
      { userId: demoUser.id, name: "Pitch Deck v3.pdf", fileUrl: "/uploads/pitch-deck-v3.pdf", fileType: "pdf", size: 2400000, folder: "Pitch Deck" },
      { userId: demoUser.id, name: "Financial Model.xlsx", fileUrl: "/uploads/financial-model.xlsx", fileType: "xlsx", size: 1100000, folder: "Financials" },
      { userId: demoUser.id, name: "Business Plan.docx", fileUrl: "/uploads/business-plan.docx", fileType: "docx", size: 850000, folder: "General" },
      { userId: demoUser.id, name: "NDA Template.pdf", fileUrl: "/uploads/nda-template.pdf", fileType: "pdf", size: 120000, folder: "Legal" },
    ],
  })

  console.log("✅ Created documents")

  // ============ MESSAGES ============
  await prisma.message.createMany({
    data: [
      { senderId: consultant1User.id, receiverId: demoUser.id, content: "Hi! I've been reviewing your startup profile. Great progress so far!", isRead: true },
      { senderId: demoUser.id, receiverId: consultant1User.id, content: "Thank you! I've been working on the market validation framework.", isRead: true },
      { senderId: consultant1User.id, receiverId: demoUser.id, content: "Excellent! Have you had a chance to run the customer interviews yet?", isRead: true },
      { senderId: demoUser.id, receiverId: consultant1User.id, content: "Yes, I completed 15 interviews this week. The feedback has been insightful.", isRead: false },
      { senderId: consultant1User.id, receiverId: demoUser.id, content: "Let's discuss your market validation results next session.", isRead: false },
      { senderId: consultant2User.id, receiverId: createdUsers[0].id, content: "Hi Emily! Ready to discuss your fundraising timeline?", isRead: true },
      { senderId: createdUsers[0].id, receiverId: consultant2User.id, content: "Absolutely! I've been preparing the pitch deck updates.", isRead: false },
      { senderId: consultant3User.id, receiverId: createdUsers[5].id, content: "Raj, I've reviewed your AI architecture. Let's discuss optimizations.", isRead: false },
      { senderId: consultant1User.id, receiverId: createdUsers[8].id, content: "Welcome Maria! I'm looking forward to our first consultation.", isRead: true },
      { senderId: createdUsers[2].id, receiverId: consultant2User.id, content: "Can we reschedule our meeting to next week?", isRead: false },
      { senderId: adminUser.id, receiverId: consultant1User.id, content: "Hi Sarah, just checking in on your upcoming appointments.", isRead: true },
      { senderId: adminUser.id, receiverId: consultant2User.id, content: "Marcus, could you update your availability for next month?", isRead: false },
    ],
  })

  console.log("✅ Created messages")

  console.log("🎉 Seeding complete!")
  console.log("\n📋 Demo accounts:")
  console.log("  Email: superadmin@upmind.io | Password: password123 | Role: SUPER_ADMIN")
  console.log("  Email: admin@upmind.io | Password: password123 | Role: ADMIN")
  console.log("  Email: demo@upmind.io | Password: password123 | Role: PAID_USER")
  console.log("  Email: sarah@upmind.io | Password: password123 | Role: CONSULTANT")
  console.log("  Email: marcus@upmind.io | Password: password123 | Role: CONSULTANT")
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
