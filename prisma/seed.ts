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
    { title: "The Ultimate Startup Validation Framework", type: "GUIDE", category: "Startup Tips", isPremium: false, description: "A step-by-step framework to validate your startup idea in 2 weeks." },
    { title: "Pitch Deck Template That Raised $5M", type: "TEMPLATE", category: "Funding", isPremium: true, description: "The exact template used by founders who raised Series A." },
    { title: "AI-Powered Growth Hacking Playbook", type: "PDF", category: "AI", isPremium: true, description: "Leverage AI tools to 10x your growth without 10x the budget." },
    { title: "Building a Brand That Stands Out", type: "BLOG", category: "Branding", isPremium: false, description: "How to create a memorable brand identity on a startup budget." },
    { title: "Content Marketing Strategy for Startups", type: "GUIDE", category: "Marketing", isPremium: false, description: "Create content that drives organic traffic and converts visitors." },
    { title: "Financial Model Template", type: "TEMPLATE", category: "Funding", isPremium: true, description: "Professional financial model template for investor presentations." },
    { title: "Hiring Your First 10 Employees", type: "VIDEO", category: "Startup Tips", isPremium: false, description: "A comprehensive guide to making your first critical hires." },
    { title: "Marketing Automation with AI", type: "VIDEO", category: "AI", isPremium: true, description: "Automate your marketing stack with these AI-powered tools." },
    { title: "Social Media Playbook 2024", type: "PDF", category: "Marketing", isPremium: false, description: "Stay ahead with the latest social media strategies and trends." },
    { title: "Startup Legal Essentials Checklist", type: "TEMPLATE", category: "Startup Tips", isPremium: false, description: "Don't miss any legal requirements when launching your startup." },
  ]

  for (const resource of resources) {
    await prisma.resource.create({
      data: {
        title: resource.title,
        type: resource.type as "BLOG" | "TEMPLATE" | "VIDEO" | "PDF" | "GUIDE",
        category: resource.category,
        isPremium: resource.isPremium,
        description: resource.description,
        downloadCount: Math.floor(Math.random() * 500) + 50,
        tags: resource.category,
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
