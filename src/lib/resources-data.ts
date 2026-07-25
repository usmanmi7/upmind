/**
 * Engineering Innovation Resources
 *
 * Static dataset that mirrors the shape of the Prisma Resource model,
 * so we can swap to DB-backed data later without touching the UI.
 *
 * Categorized to match the Engineering Innovation Platform motive:
 *   - Engineering Skills   : hands-on technical playbooks
 *   - Problem Discovery    : how to find & frame problems worth solving
 *   - Build Playbooks      : how to ship engineering projects
 *   - Innovation Theory    : frameworks for innovators
 *   - Career & Growth      : engineer → innovator career paths
 *   - Open Source          : building in public, contributing
 */

export type ResourceType = "BLOG" | "TEMPLATE" | "VIDEO" | "PDF" | "GUIDE";

export interface Author {
  id: string;
  name: string;
  image: string | null;
  bio?: string | null;
}

export interface EngineeringResource {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string; // markdown
  type: ResourceType;
  category: string;
  tags: string; // comma-separated
  readTime: string;
  coverImage: string | null;
  thumbnailUrl: string | null;
  isPremium: boolean;
  downloadCount: number;
  createdAt: string; // ISO date
  author: Author;
}

export const RESOURCE_CATEGORIES = [
  "All",
  "Engineering Skills",
  "Problem Discovery",
  "Build Playbooks",
  "Innovation Theory",
  "Career & Growth",
  "Open Source",
] as const;

export const RESOURCE_TYPES: ResourceType[] = ["BLOG", "TEMPLATE", "VIDEO", "PDF", "GUIDE"];

const UP = { id: "enginest-team", name: "Enginest Team", image: null, bio: "Engineering Innovation Platform team — curating playbooks for builders." };

export const RESOURCES: EngineeringResource[] = [
  {
    id: "r-001",
    slug: "engineering-skills-self-assessment",
    title: "The Engineering Skills Self-Assessment",
    description:
      "A 60-question diagnostic that maps your current skill set against the 14 disciplines engineers need to ship real-world innovation projects.",
    content: `# The Engineering Skills Self-Assessment

Before you pick a problem to solve, you need to know what you bring to the table. This self-assessment maps your current capabilities across 14 engineering disciplines — from systems thinking and ML fundamentals to product judgment and team orchestration.

## Why a self-assessment matters

Most engineers dramatically over-index on one or two skills (typically their day-job specialty) and ignore the rest. Innovation work demands a wider surface area — you may be excellent at Python but underprepared on hardware, regulatory, or user-research fronts.

A structured assessment surfaces those gaps early, before you commit 6 months to a problem you can't actually solve end-to-end.

## The 14 disciplines

1. **Software engineering** — clean code, testing, deployment
2. **Machine learning & data** — modeling, evaluation, data plumbing
3. **Hardware & embedded** — electronics, PCBs, firmware
4. **Systems & infrastructure** — distributed systems, observability
5. **Security & privacy** — threat modeling, secure design
6. **UX & product judgment** — user research, prototyping, prioritization
7. **Domain research** — literature review, primary research
8. **Regulatory & compliance** — FDA, CE, GDPR, sector-specific
9. **Business & market analysis** — sizing, GTM, unit economics
10. **Communication** — writing, talks, technical advocacy
11. **Project management** — scope, milestones, risk
12. **Fundraising & finance** — grants, VCs, bootstrapping
13. **Team building** — hiring, mentoring, conflict
14. **Ethics & impact** — stakeholder analysis, unintended consequences

## How to score yourself

For each discipline, rate yourself on a 1-5 scale:

- **1** — I've heard of this
- **2** — I can do basic tasks with guidance
- **3** — I can ship work independently
- **4** — I can lead others in this area
- **5** — I'm a recognized expert

Be brutally honest. The goal isn't a high score — it's an accurate map.

## What to do with the results

Once you've scored all 14, you'll see one of three patterns:

- **T-shaped** — deep in 1-2 areas, shallow everywhere else. Great for early-stage specialist work.
- **Pi-shaped** — deep in 2 areas, with bridges between them. Strong fit for innovation projects.
- **Comb-shaped** — moderate depth across 4+ areas. Excellent for solo founders and small-team leads.

Use the results to:

1. Pick problems where your top 3 disciplines directly apply
2. Find co-founders or teammates whose strengths cover your gaps
3. Plan deliberate learning sprints for high-leverage weaknesses

## Next steps

After completing the assessment, paste your top 5 skills into the [Innovation Engine](/dashboard/innovation-engine) — it will match you to problems you're actually positioned to solve.`,
    type: "GUIDE",
    category: "Engineering Skills",
    tags: "self-assessment, skills, engineering, career, diagnostic",
    readTime: "12 min",
    coverImage: null,
    thumbnailUrl: null,
    isPremium: false,
    downloadCount: 1842,
    createdAt: "2025-01-15T10:00:00Z",
    author: UP,
  },
  {
    id: "r-002",
    slug: "how-to-find-problems-worth-solving",
    title: "How to Find Problems Worth Solving",
    description:
      "A field guide for engineers who want to build meaningful things — sourcing real-world problems from WHO, UN, IEA, and direct field research instead of brainstorming from a whiteboard.",
    content: `# How to Find Problems Worth Solving

Most engineers build solutions in search of problems. This guide flips that — start with a real, documented problem, then engineer a solution.

## Why problem-first beats idea-first

Idea-first founders fall in love with their technology. When the market doesn't care, they blame the market. Problem-first builders fall in love with the problem — they iterate on solutions until one sticks.

## Where real problems live

Skip the whiteboard brainstorm. Real problems are documented by:

- **Multilateral organizations** — WHO, UN, UNICEF, World Bank, IEA, IPCC, FAO, UNESCO, UNEP
- **Government reports** — NIST, ESA, DOE, national innovation agencies
- **Field NGOs** — organizations running programs in the field
- **Academic literature** — systematic reviews in Lancet, Nature, Science
- **Industry forums** — WEF, IEEE working groups, sector conferences

These sources already do the hard work of validation, sizing, and stakeholder mapping. Your job is to read them and find the engineering leverage points.

## A 5-step discovery process

1. **Pick a domain** — climate, health, agriculture, water, energy, AI safety, etc.
2. **Pull 5-10 authoritative reports** from the last 3 years
3. **Extract every named problem** with severity and affected populations
4. **Cross-reference** with current engineering solutions — what's tried, what's failing
5. **Shortlist** problems where (a) the problem is severe, (b) current solutions are insufficient, and (c) your skills are relevant

## Reading reports like an engineer

Most engineers skim reports for the headline number. Instead, extract:

- **Quantified severity** — how many people affected, what's the cost
- **Root causes** — not just symptoms
- **Existing solutions** — and why they're failing
- **Technical constraints** — power, connectivity, cost per unit
- **Regulatory environment** — what's allowed, what isn't
- **Funding landscape** — who's already paying for solutions

## Avoiding the "interesting trap"

Some problems are intellectually fascinating but have no leverage. Ask:

- Can a small team realistically build a useful solution in 6-12 months?
- Is there a clear path to impact at scale?
- Are there buyers — governments, NGOs, enterprises, individuals — willing to pay or adopt?

If the answer to any is no, file it and move on.

## Where Enginest helps

The [Solve Them](/solve-them) database does steps 1-4 for you across 26 categories. Each problem is pre-validated against multilateral sources, with severity, impact, and engineering skill requirements attached.

Open any problem to see the full picture — then use the [Innovation Engine](/dashboard/innovation-engine) to filter for problems matching your skill set.`,
    type: "GUIDE",
    category: "Problem Discovery",
    tags: "problem discovery, research, WHO, UN, IEA, climate, health",
    readTime: "15 min",
    coverImage: null,
    thumbnailUrl: null,
    isPremium: false,
    downloadCount: 3210,
    createdAt: "2025-02-04T10:00:00Z",
    author: UP,
  },
  {
    id: "r-003",
    slug: "build-vs-research-decision-framework",
    title: "The Build vs Research Decision Framework",
    description:
      "Should you ship a product, publish a paper, or open-source a tool? A decision framework for choosing the right output type for your engineering project.",
    content: `# The Build vs Research Decision Framework

Not every engineering project should become a startup. Not every problem needs a paper. This framework helps you pick the right output type for the problem you're solving.

## The four output types

1. **Product / Startup** — a venture that sells or distributes a solution
2. **Research / Paper** — a contribution to the academic or technical literature
3. **Open Source** — a tool or library the community can adopt
4. **Infrastructure** — public goods like datasets, benchmarks, or protocols

## When to choose each

### Product / Startup
- There's a clear buyer — individual, enterprise, or government
- Unit economics work at scale
- You can build a defensible moat
- Regulatory environment allows commercial operation
- You want to capture the value you create

### Research / Paper
- The contribution is a new method, dataset, or finding
- Replicability matters more than adoption speed
- No clear commercial buyer exists
- Peer review will accelerate adoption

### Open Source
- The tool is useful across many domains
- Network effects matter — libraries, frameworks, protocols
- You want adoption over revenue
- You have other ways to capture value (consulting, hosting, SaaS)

### Infrastructure
- The gap is a missing public good — datasets, benchmarks, registries
- Multiple stakeholders benefit but none will pay alone
- Long time horizons (3-10 years to impact)

## The decision matrix

Score your problem on three axes:

- **Buyer clarity** (1-5): How clear is who pays or adopts?
- **Replicability need** (1-5): How much does independent verification matter?
- **Network effects** (1-5): How much does ecosystem adoption multiply impact?

Then:

| Pattern | Output Type |
|---------|-------------|
| Buyer ≥4, Network ≥3 | Product + Open Source (dual license) |
| Buyer ≥4, Network ≤2 | Product / Startup |
| Buyer ≤2, Replicability ≥4 | Research / Paper |
| Buyer ≤2, Network ≥4 | Open Source |
| Buyer ≤2, Network ≤2, long horizon | Infrastructure |

## Real examples

**Direct air capture cost reduction** → Research (open papers) + Startup (commercial deployment)
**Malaria surveillance in low-connectivity regions** → Open Source (software) + NGO partnership (deployment)
**Bias benchmarks for foundation models** → Infrastructure (benchmark + dataset)
**Low-cost water quality sensors** → Startup (hardware) + Open Source (firmware)

## Why this matters

Engineers default to building products because that's the loudest success narrative in tech. But many of the world's hardest problems are better solved as research, infrastructure, or open source. Picking wrong wastes years.

Use this framework before committing to a path.`,
    type: "TEMPLATE",
    category: "Build Playbooks",
    tags: "decision framework, startup, research, open source, infrastructure",
    readTime: "10 min",
    coverImage: null,
    thumbnailUrl: null,
    isPremium: false,
    downloadCount: 957,
    createdAt: "2025-02-22T10:00:00Z",
    author: UP,
  },
  {
    id: "r-004",
    slug: "skill-to-problem-matching-explained",
    title: "Skill-to-Problem Matching, Explained",
    description:
      "How Enginest's Innovation Engine scores your skills against real-world problems — the algorithm, the weights, and how to interpret your matches.",
    content: `# Skill-to-Problem Matching, Explained

The Innovation Engine takes your skills, interests, time, and team size, then scores every problem in the Solve Them database for fit. Here's how the scoring actually works.

## The scoring formula

Each problem is scored on a 0-100 scale:

\`\`\`
matchScore = skillScore (0-60)
          + interestScore (0-30)
          + difficultyBonus (0-10)
          + timeBonus (0-5)
          + teamBonus (0-5)
\`\`\`

Capped at 100.

## Skill score (60% of total)

This is the dominant signal. For each problem, we maintain a weighted list of required skills with importance scores (1-5). Your match is the fraction of importance-weighted skills you cover.

Example — for "Early warning systems for pandemic outbreaks":
- Machine Learning: importance 5
- Distributed Systems: importance 4
- Epidemiology: importance 3
- Mobile Development: importance 2

If you bring ML and distributed systems, you cover (5+4)/(5+4+3+2) = 9/14 = 64% of the importance weight. Your skill score is 64% × 60 = ~38/60.

## Interest score (30% of total)

For each of your interests, we check whether it appears in the problem's category, tags, or title. Each match adds 15 points, capped at 30.

## Difficulty bonus (10)

If you specify a difficulty preference and the problem matches it (e.g., you want "Hard" and the problem is rated Hard), you get +10.

## Time bonus (5)

If the problem's estimated timeline fits within your committed time, you get +5.

## Team bonus (5)

If your team size fits within any of the problem's recommended team templates, you get +5.

## How to read your matches

- **85-100** — Strong fit. You should seriously consider this problem.
- **70-84** — Good fit. Worth investigating further.
- **50-69** — Adjacent. Your skills partially apply; you'd need a co-founder to fill gaps.
- **Below 50** — Likely not the right problem for you.

## What the engine can't do

The engine is a starting point, not an oracle. It can't measure:

- Your motivation and grit
- Domain knowledge you've acquired informally
- Network access to the right stakeholders
- Personal mission alignment

Use the matches as a shortlist — then dive into the problem detail page to read the full context before committing.

## Try it

Open the [Innovation Engine](/dashboard/innovation-engine), enter your top 5-8 skills and 2-3 interests, and see your top matches.`,
    type: "BLOG",
    category: "Innovation Theory",
    tags: "innovation engine, matching algorithm, skills, scoring",
    readTime: "8 min",
    coverImage: null,
    thumbnailUrl: null,
    isPremium: false,
    downloadCount: 624,
    createdAt: "2025-03-08T10:00:00Z",
    author: UP,
  },
  {
    id: "r-005",
    slug: "team-templates-for-engineering-projects",
    title: "Team Templates for Engineering Projects",
    description:
      "Battle-tested team structures for hardware, software, research, and hybrid engineering projects — including role definitions, sizes, and hiring sequence.",
    content: `# Team Templates for Engineering Projects

A great team beats a great idea. This guide covers five team templates that work across most engineering innovation projects.

## Template 1: Lean Software (3-5 people)

**Best for:** SaaS, dev tools, ML platforms, web/mobile products

- **Tech lead / full-stack engineer** — owns architecture
- **Senior engineer** — owns a major subsystem
- **Designer (contract or part-time)** — owns UX
- **Product / GTM lead** — owns user research and distribution

## Template 2: Hardware + Software (5-8 people)

**Best for:** IoT, robotics, embedded devices, medical devices

- **Hardware engineer** — PCBs, mechanical, manufacturing
- **Firmware engineer** — embedded software
- **Backend / cloud engineer** — data pipeline, app layer
- **Mobile engineer** — companion app
- **QA / regulatory lead** — certifications, testing
- **Product lead** — user research, partnerships

## Template 3: Research Lab (3-6 people)

**Best for:** Papers, open datasets, fundamental methods

- **Principal investigator** — sets direction, writes papers
- **2-3 research engineers** — implement and experiment
- **Data engineer** — pipelines, evaluation infrastructure
- **Collaborator network** — domain experts, co-authors

## Template 4: Open Source Project (3-10 people)

**Best for:** Libraries, frameworks, protocols, tools

- **Maintainer (1-2)** — code review, releases, direction
- **Core contributors (3-5)** — major features, docs
- **Community manager** — issues, PRs, onboarding
- **Developer advocate** — content, talks, adoption

## Template 5: Field Deployment (6-12 people)

**Best for:** Climate, health, agriculture — projects with physical deployment

- **Engineering lead**
- **2-3 engineers** (mixed hardware/software)
- **Field operations lead** — local partnerships, deployment
- **Monitoring & evaluation lead** — impact measurement
- **Local team (2-4)** — operations, training, support
- **Partnerships lead** — government, NGO, donor relationships

## Hiring sequence

Don't hire all roles at once. Sequence matters:

1. **Co-founder / tech lead** — first 1-2 hires
2. **Senior IC** — first non-founder hire, force multiplier
3. **Designer or field lead** — when UX or domain becomes bottleneck
4. **Specialist hires** — fill specific gaps (hardware, regulatory, ML)
5. **Operator / GTM** — once you have something to deploy

## Common mistakes

- **Hiring too fast** — burns runway before product-market fit
- **Hiring clones of yourself** — creates blind spots
- **Skipping design** — engineers doing UX leads to unusable products
- **Ignoring field expertise** — building in a vacuum for users you've never met

## Where to find these people

- Open source contributors (GitHub, mailing lists)
- University labs and research groups
- Domain-specific Slack/Discord communities
- Hackathon and engineering competition alumni
- Local maker spaces and hardware meetups

Each problem in the Solve Them database includes recommended team templates tuned to that problem's specific needs.`,
    type: "TEMPLATE",
    category: "Build Playbooks",
    tags: "team, hiring, hardware, software, research, open source",
    readTime: "14 min",
    coverImage: null,
    thumbnailUrl: null,
    isPremium: false,
    downloadCount: 1421,
    createdAt: "2025-03-20T10:00:00Z",
    author: UP,
  },
  {
    id: "r-006",
    slug: "engineering-projects-roadmap-template",
    title: "Engineering Project Roadmap Template (12-month)",
    description:
      "A 4-phase roadmap template for taking an engineering project from problem validation to first deployment — phases, milestones, deliverables, and exit criteria.",
    content: `# Engineering Project Roadmap Template (12-month)

This roadmap works for most engineering innovation projects — adapt the durations to your context.

## Phase 1: Validation (Months 1-2)

**Goal:** Confirm the problem is real, sized correctly, and that engineering has leverage.

### Activities
- Read 10+ authoritative sources on the problem
- Interview 15+ affected stakeholders
- Map existing solutions and why they fail
- Identify regulatory and ethical constraints
- Define the smallest engineering contribution that would matter

### Deliverables
- Problem brief (3-5 pages)
- Stakeholder map
- Existing solutions landscape
- Smallest useful contribution (SUC) definition

### Exit criteria
- Problem severity is quantified and credible
- You can name the SUC in one sentence
- 3+ stakeholders would adopt your SUC if it existed

## Phase 2: Prototype (Months 3-5)

**Goal:** Build a working prototype that demonstrates the SUC.

### Activities
- Architecture design
- Build the smallest end-to-end vertical slice
- Test with 5-10 friendly users
- Iterate on the hardest technical risk first

### Deliverables
- Working prototype
- Demo environment
- Internal technical retrospective
- Updated risk register

### Exit criteria
- Prototype works end-to-end
- 3+ friendly users confirm it solves the SUC
- Hardest technical risks are de-risked or kill criteria met

## Phase 3: Pilot (Months 6-9)

**Goal:** Deploy with real users in a real context.

### Activities
- Onboard 5-20 pilot users
- Instrument everything (telemetry, feedback loops)
- Iterate weekly based on real usage
- Build deployment and support infrastructure

### Deliverables
- Pilot deployment
- Impact metrics dashboard
- Case studies (3+)
- Scaling plan

### Exit criteria
- 70%+ pilot users are active after 30 days
- Impact metrics show measurable improvement on the problem
- Unit economics or sustainability path is clear

## Phase 4: Scale (Months 10-12)

**Goal:** Reach 10x pilot scale or establish sustainability.

### Activities
- Hire operators and specialists
- Build partnerships for distribution
- Establish revenue, grant, or funding model
- Document and open-source where appropriate

### Deliverables
- Scaled deployment (10x pilot)
- Sustainability model proven
- Team of 5-10
- 12-month forward plan

### Exit criteria
- 10x pilot scale achieved
- Sustainable funding path secured
- Clear expansion roadmap

## Adapting the template

- **Research projects** — collapse Phase 4 into "Publication & follow-up"
- **Open source** — Phase 3-4 becomes "Community adoption"
- **Hardware** — add 2-3 months to Phase 2-3 for manufacturing

## Tracking your roadmap

Use the dashboard roadmap feature to break each phase into milestones, assign owners, and track completion. Every problem in Solve Them comes with a pre-filled roadmap based on this template.`,
    type: "TEMPLATE",
    category: "Build Playbooks",
    tags: "roadmap, project management, milestones, validation, prototype, pilot, scale",
    readTime: "16 min",
    coverImage: null,
    thumbnailUrl: null,
    isPremium: false,
    downloadCount: 2156,
    createdAt: "2025-04-05T10:00:00Z",
    author: UP,
  },
  {
    id: "r-007",
    slug: "from-engineer-to-innovator-career-paths",
    title: "From Engineer to Innovator: Career Paths",
    description:
      "Five concrete career paths for engineers who want to spend their time on meaningful innovation — beyond the default FAANG → startup ladder.",
    content: `# From Engineer to Innovator: Career Paths

The default engineer career path — FAANG → startup → VC — is one option. There are at least four others worth knowing about.

## Path 1: The Founder

**What:** Build a venture around a problem you've identified.

**Best for:** Engineers with high autonomy, risk tolerance, and a clear problem obsession.

**Typical arc:**
- 2-4 years engineering experience
- Identify problem through side research
- 6-12 months validating while still employed
- Full-time founder with co-founder + small seed

**Funding sources:** Angels, accelerators, problem-specific grants (climate, health), early-stage VCs.

## Path 2: The Research Engineer

**What:** Work at the intersection of engineering and research — labs, R&D, applied science.

**Best for:** Engineers who love depth, peer review, and methods work.

**Typical arc:**
- Engineering degree + domain specialization (often MS/PhD)
- Join a research lab (DeepMind, FAIR, Allen Institute, national labs)
- Publish papers, build open datasets, contribute to standards

**Funding sources:** Lab budgets, government grants (NSF, DARPA, Horizon), industry sponsorships.

## Path 3: The Open Source Maintainer

**What:** Build and sustain critical open-source infrastructure.

**Best for:** Engineers who love systems, community, and ecosystem leverage.

**Typical arc:**
- Contribute to existing projects for 1-2 years
- Launch own project, build adoption
- Secure funding (GitHub Sponsors, Open Collective, foundation grants, company sponsorship)
- Eventually full-time or sponsored by a foundation

**Funding sources:** Sponsorships, foundation grants (Mozilla, NumFocus, Linux Foundation), company backing.

## Path 4: The Field Engineer

**What:** Deploy engineering in specific real-world contexts — climate field projects, global health, agriculture.

**Best for:** Engineers who want direct, measurable impact and don't need VC-scale outcomes.

**Typical arc:**
- Engineering degree + domain immersion (MPH, climate science, agriculture)
- Join an organization like Climate Corps, PATH, Gates Foundation grantees, UN innovation teams
- Build and deploy solutions in the field

**Funding sources:** Foundations, government aid, multilateral grants, NGO budgets.

## Path 5: The Builder-Investor

**What:** Build, then invest in other builders — combine engineering with capital allocation.

**Best for:** Engineers with operator experience who enjoy mentoring and pattern-matching.

**Typical arc:**
- 5-10 years shipping (often as founder or early engineer)
- Angel investing alongside operating role
- Transition to full-time investing (VC, venture studio, foundation)

**Funding sources:** LP capital, foundation endowments, family offices.

## Which path is for you?

Honest questions:

- **Risk tolerance** — How much financial uncertainty can you handle?
- **Time horizon** — Are you optimizing for 2-year outcomes or 10-year?
- **Depth vs breadth** — Do you want to go deep in one area or work across many?
- **Independence** — How much do you need to set your own direction?

The right path is the one where you'll still be engaged in 5 years — not the one that looks most prestigious today.

## What Enginest can do

The Solve Them database + Innovation Engine are designed to support any of these paths. Founders find venture-scale problems. Research engineers find paper-worthy gaps. Open source maintainers find infrastructure needs. Field engineers find deployment-ready problems. Builder-investors find sectors worth funding.`,
    type: "BLOG",
    category: "Career & Growth",
    tags: "career, founder, research, open source, field engineering, investing",
    readTime: "13 min",
    coverImage: null,
    thumbnailUrl: null,
    isPremium: false,
    downloadCount: 1788,
    createdAt: "2025-04-18T10:00:00Z",
    author: UP,
  },
  {
    id: "r-008",
    slug: "open-source-your-engineering-project",
    title: "How to Open-Source Your Engineering Project",
    description:
      "A practical playbook for engineers who want to open-source their work — licensing, governance, documentation, community building, and sustainability.",
    content: `# How to Open-Source Your Engineering Project

Open-sourcing your engineering work multiplies impact — but only if done right. This playbook covers the decisions that matter.

## Should you open-source?

Open source is right when:

- The tool is broadly useful beyond your immediate use case
- Ecosystem adoption creates network effects
- You're OK with limited or indirect monetization
- You have time to maintain it for 2+ years

If any of these are false, consider keeping it proprietary or dual-licensing.

## Choosing a license

### Permissive (MIT, Apache 2.0, BSD)
- Maximum adoption
- Anyone can use, including commercially
- You give up most control

### Copyleft (GPL, AGPL)
- Forces derivative works to also be open
- Slower enterprise adoption
- Protects against closed-source forks

### Dual licensing
- Open core (community edition) + commercial (enterprise edition)
- Common for infrastructure (e.g., Postgres, MongoDB historically)

**Default for new projects:** MIT or Apache 2.0 unless you have a specific reason.

## Repository setup checklist

- [ ] README with: what it does, install, quick start, examples
- [ ] CONTRIBUTING.md — how to contribute, code style, PR process
- [ ] CODE_OF_CONDUCT.md — use Contributor Covenant
- [ ] LICENSE — the actual license file
- [ ] CHANGELOG.md — track releases
- [ ] CI/CD — automated tests on every PR
- [ ] Issue templates — bug report, feature request
- [ ] PR template — checklist for contributors

## Documentation is the product

New users judge your project by the README in 30 seconds. Invest disproportionately in:

- **The 5-minute quick start** — should work end-to-end
- **The "why" section** — what problem does this solve
- **Worked examples** — common use cases with copy-paste code
- **Comparison table** — vs alternatives (honest, not competitive)

## Building a community

Communities don't form around code — they form around shared problems.

1. **Pick a communication channel** — GitHub Discussions, Discord, or mailing list
2. **Respond fast** — first 24 hours after launch set the tone
3. **Recognize contributors publicly** — release notes, contributor highlights
4. **Hold regular office hours** — especially in the first 6 months
5. **Don't merge bad PRs** — set the quality bar early

## Governance models

### BDFL (Benevolent Dictator For Life)
- You make final calls
- Fast decisions, single point of failure
- Works for early-stage projects

### Meritocratic
- Core maintainers vote on decisions
- Slower but more durable
- Works once you have 5+ active maintainers

### Foundation-governed
- Project lives under a foundation (NumFocus, Linux Foundation, Apache)
- Slowest decisions, most durable
- Best for mature projects with many stakeholders

## Sustainability

Open source has a maintenance problem. Plan for it from day one:

- **Company sponsorship** — your employer sponsors your time
- **GitHub Sponsors / Open Collective** — direct community funding
- **Foundation grants** — Mozilla, Sovereign Tech Fund, etc.
- **Consulting / hosting** — sell services around the project
- **Open core** — sell enterprise features

## When to walk away

It's OK to archive a project. Do it cleanly:

1. Mark the repo as archived
2. Post a clear "sunset" announcement
3. Point to alternatives or forks
4. Transfer ownership if a maintainer wants to continue

Abandoned-but-not-archived projects are worse than no project — they waste users' time.`,
    type: "GUIDE",
    category: "Open Source",
    tags: "open source, licensing, governance, community, sustainability",
    readTime: "18 min",
    coverImage: null,
    thumbnailUrl: null,
    isPremium: false,
    downloadCount: 1103,
    createdAt: "2025-05-02T10:00:00Z",
    author: UP,
  },
  {
    id: "r-009",
    slug: "reading-list-engineering-innovators",
    title: "Reading List for Engineering Innovators",
    description:
      "30 essential books, papers, and long-form essays for engineers who want to build things that matter — spanning systems thinking, problem framing, and impact at scale.",
    content: `# Reading List for Engineering Innovators

These are the 30 readings that most shaped how we think about engineering innovation at Enginest. Grouped by theme.

## Systems Thinking

1. **Thinking in Systems** — Donella Meadows
2. **The Fifth Discipline** — Peter Senge
3. **Seeing Like a State** — James C. Scott (cautionary)
4. **The Difference** — Scott Page

## Problem Framing

5. **Are Your Lights On?** — Donald Gause & Gerald Weinberg
6. **The Design of Everyday Things** — Don Norman
7. **Design Justice** — Sasha Costanza-Chock
8. **Weapons of Math Destruction** — Cathy O'Neil

## Engineering Practice

9. **The Pragmatic Programmer** — Hunt & Thomas
10. **Designing Data-Intensive Applications** — Martin Kleppmann
11. **The Mythical Man-Month** — Fred Brooks
12. **Site Reliability Engineering** — Google
13. **Software Engineering at Google** — Titus Winters et al.

## Hardware & Physical Systems

14. **The Design of Everyday Things** — Don Norman (overlap, but essential)
15. **Making It: Manufacturing Techniques for Product Design** — Chris Lefteri
16. **The Hardware Startup** — Renee DiResta et al.

## Innovation Theory

17. **The Innovator's Dilemma** — Clayton Christensen
18. **Where Good Ideas Come From** — Steven Johnson
19. **The Structure of Scientific Revolutions** — Thomas Kuhn
20. **Seeing Like a State** — James C. Scott

## Impact & Field Work

21. **Poor Economics** — Abhijit Banerjee & Esther Duflo
22. **The White Man's Burden** — William Easterly
23. **Mountains Beyond Mountains** — Tracy Kidder
24. **The Idealist** — Nina Munk

## Climate & Energy

25. **Sustainable Energy — Without the Hot Air** — David MacKay
26. **Drawdown** — Paul Hawken (ed.)
27. **The Uninhabitable Earth** — David Wallace-Wells

## AI & Computing

28. **Human Compatible** — Stuart Russell
29. **The Alignment Problem** — Brian Christian
30. **Artificial Intelligence: A Guide for Thinking Humans** — Melanie Mitchell

## How to read this list

Don't read all 30. Pick 5 in the area you care about most. Read deeply — take notes, argue with the author in the margins.

Then pick 3 from outside your area. Innovation happens at intersections.

## Suggested sequences

**Climate engineer:** MacKay → Drawdown → Uninhabitable Earth → Poor Economics → Thinking in Systems

**AI/ML engineer:** Russell → Christian → Mitchell → Weapons of Math Destruction → The Difference

**Hardware entrepreneur:** Norman → Lefteri → The Hardware Startup → The Innovator's Dilemma → The Pragmatic Programmer

**Global health engineer:** Poor Economics → Mountains Beyond Mountains → The Idealist → Design Justice → Thinking in Systems`,
    type: "BLOG",
    category: "Innovation Theory",
    tags: "reading list, books, papers, systems thinking, innovation, climate, AI",
    readTime: "20 min",
    coverImage: null,
    thumbnailUrl: null,
    isPremium: false,
    downloadCount: 2634,
    createdAt: "2025-05-14T10:00:00Z",
    author: UP,
  },
  {
    id: "r-010",
    slug: "engineering-ethics-framework",
    title: "The Engineering Ethics Framework",
    description:
      "A practical framework for thinking through the ethical dimensions of engineering projects — stakeholders, harms, trade-offs, and accountability.",
    content: `# The Engineering Ethics Framework

Ethics isn't a checkbox at the end of a project — it's a set of decisions woven through every stage. This framework helps you ask the right questions at the right time.

## The five ethical lenses

Every engineering decision can be examined through five lenses:

### 1. Stakeholder lens
Who is affected by what you're building?
- Direct users
- Indirect users (those affected by users' actions)
- Non-users (those who can't or won't use it)
- Future users (generations not yet present)
- Non-human stakeholders (animals, ecosystems)

### 2. Harm lens
What harms could this cause?
- Physical harm (injury, death)
- Economic harm (job loss, exploitation)
- Social harm (discrimination, polarization)
- Psychological harm (addiction, anxiety)
- Environmental harm (pollution, resource depletion)

### 3. Power lens
Who gains power? Who loses it?
- Does this concentrate power in the builder?
- Does it empower users or disempower them?
- Does it create new forms of surveillance?
- Does it create dependencies?

### 4. Reversibility lens
Can the harms be undone?
- Fully reversible — easy to roll back
- Partially reversible — some harms persist
- Irreversible — once done, can't be undone

Irreversible harms deserve extra scrutiny.

### 5. Accountability lens
Who is responsible when things go wrong?
- The engineer
- The company
- The user
- The regulator
- Nobody (this is the worst answer)

## Applying the framework

At each project milestone, run a 30-minute ethics review:

1. **List 5+ stakeholders** beyond the obvious
2. **Brainstorm 5+ possible harms** beyond the obvious
3. **Identify power shifts** — who gains, who loses
4. **Rate reversibility** of the worst harms
5. **Name who's accountable** for each major risk

## Common ethical traps

### "It's just a tool"
Tools have politics. A tool that's easier to use for surveillance will be used for surveillance. A tool that's easier to use for harm will be used for harm.

### "We'll add safety later"
Safety designed in from the start costs 10x less than safety bolted on later. And sometimes it's impossible to add later.

### "Users consented"
Consent under power imbalance isn't consent. Consent to surveillance you don't understand isn't consent.

### "The market will decide"
Markets optimize for what's measurable and payable. Externalities — environmental, social, long-term — are invisible to markets.

### "We're just engineers"
You're not just an engineer. You're a citizen, a stakeholder, and a moral agent. The fact that you can build it doesn't mean you should.

## Hard cases

### A more efficient coal plant
Stakeholder lens: workers, climate, communities near plants
Harm lens: reduces short-term harm but extends coal's life
Power lens: empowers incumbents vs renewables
Reversibility: CO2 lasts centuries
Accountability: distributed, hard to assign

**Takeaway:** Efficiency gains in harmful systems often extend the harm. Consider whether to work on the alternative instead.

### A facial recognition system for finding missing children
Stakeholder lens: children, families, abuse survivors, political dissidents
Harm lens: short-term rescue vs long-term surveillance infrastructure
Power lens: dramatically empowers state over individuals
Reversibility: surveillance infrastructure is rarely dismantled
Accountability: often classified, hard to audit

**Takeaway:** Even noble-sounding applications can build infrastructure later used for harm. The system matters more than the use case.

## What to do when ethics blocks the project

Sometimes ethics review surfaces a fundamental problem. Your options:

1. **Refuse the work** — walk away
2. **Redesign** — change the approach to address the concern
3. **Constrain** — build it but with hard limits (no dual-use, regulated deployment)
4. **Disclose** — be honest about the trade-offs publicly
5. **Hand off** — let someone else make the call, with full context

Option 3 (constrain) is often the right answer. Option 5 (hand off) is rarely ethical — you're just outsourcing the moral weight.

## Resources

- **IEEE Code of Ethics** — engineering professional standards
- **ACM Code of Ethics** — computing professional standards
- **Data Justice Lab** — research on data and inequality
- **AI Now Institute** — critical AI research
- **Partnership on AI** — industry consortium

Every problem in the Solve Them database includes an ethics note flagging the key considerations specific to that problem.`,
    type: "PDF",
    category: "Innovation Theory",
    tags: "ethics, stakeholders, harm, power, accountability, framework",
    readTime: "22 min",
    coverImage: null,
    thumbnailUrl: null,
    isPremium: false,
    downloadCount: 894,
    createdAt: "2025-05-28T10:00:00Z",
    author: UP,
  },
  {
    id: "r-011",
    slug: "funding-engineering-innovation",
    title: "Funding Engineering Innovation: A Field Guide",
    description:
      "Where to find money for engineering innovation work — grants, fellowships, angels, VCs, and customer-funded models, with honest trade-offs for each.",
    content: `# Funding Engineering Innovation: A Field Guide

There are more funding sources for engineering innovation than most engineers realize. The trick is matching the source to your project type.

## The funding landscape

### Grants (non-dilutive)

**Government:**
- **NSF (SBIR/STTR)** — US, $50K-$1.7M, engineering and science
- **DARPA / ARPA-E** — high-risk engineering, US
- **Horizon Europe** — EU, large collaborative grants
- **UKRI** — UK research and innovation
- **DOE** — energy, US
- **NIH** — health and biomedical

**Foundations:**
- **Gates Foundation** — global health, agriculture
- **Wellcome Trust** — health
- **ClimateWorks** — climate
- **Mozilla Foundation** — open web
- **Sloan Foundation** — science, tech

**Multilateral:**
- **World Bank** — development
- **UN Innovation Fund** — UN agencies
- **EU Innovation Fund** — climate tech

**Pros:** Non-dilutive, prestige, validation
**Cons:** Slow (6-18 months), reporting heavy, restrictive scope

### Fellowships & Stipends

- **Thiel Fellowship** — $100K over 2 years for under-22s
- **Kleiner Perkins Fellows** — engineering fellowship
- **Echoing Green** — social innovation
- **MIT Media Lab director's fellows**
- **Royal Society grants** — UK science

### Angels

High-net-worth individuals writing $25K-$500K checks.

- **Distinctive advantage:** Patient, mission-aligned, often bring expertise
- **Drawback:** Smaller checks, harder to find

Find them through:
- AngelList
- YC demo day (even if not in YC)
- Sector-specific angel groups (Climate Capital, IVF Capital, etc.)

### Venture capital

- **Pre-seed:** $250K-$1M, 5-10% equity
- **Seed:** $1-3M, 15-25% equity
- **Series A:** $5-15M, 20-30% equity

**Best for:** Software, deep tech with clear commercial path, scalable ventures
**Worst for:** Research, open source, infrastructure, slow-burn problems

Choose VC only if you genuinely want to build a venture-scale business. The funding model dictates the outcome.

### Customer-funded

- **Pre-sales** — get customers to pay before you build
- **Loans against contracts** — banks advance against signed deals
- **Sponsorships** — companies sponsor development of features they need
- **Consortium funding** — multiple buyers pool to fund development

**Best for:** B2B, infrastructure, enterprise tools
**Pros:** No dilution, forces market validation
**Cons:** Slower, limited upside

### Crowdfunding

- **Kickstarter / Indiegogo** — hardware, consumer products
- **GitHub Sponsors / Open Collective** — open source
- **Experiment.com** — scientific research

### Bootstrapping

Self-funding from consulting, savings, or day-job income.

**Best for:** Open source, research, slow-burn projects, founders who can't or won't take outside capital.

## Matching funding to project type

| Project Type | Primary Sources |
|--------------|-----------------|
| Climate hardware startup | ARPA-E, climate angels, climate VC |
| Global health nonprofit | Gates, Wellcome, NIH, USAID |
| Open source library | GitHub Sponsors, foundation grants, sponsorship |
| Research project | NSF, university, foundation grants |
| AI safety research | Long-Term Future Fund, Open Philanthropy |
| Field deployment | UN, World Bank, government aid |

## Red flags in funding

- "We invest in mission-aligned founders" (often means they'll pressure you to chase metrics)
- "We'll lead your next round if you hit these milestones" (often reneged)
- "Take our terms or we'll fund your competitor" (they probably won't)
- "We're founder-friendly" (always say this; sometimes true)

## The honest trade-off

More funding = more pressure to grow fast = less room for mission alignment.

For engineers who care about impact, the question isn't "how do I raise the most money?" but "what funding model preserves my ability to do the work that matters?"

Sometimes the answer is to raise less, grow slower, and stay aligned.`,
    type: "BLOG",
    category: "Build Playbooks",
    tags: "funding, grants, VC, angels, fellowships, bootstrapping, crowdfunding",
    readTime: "17 min",
    coverImage: null,
    thumbnailUrl: null,
    isPremium: false,
    downloadCount: 1456,
    createdAt: "2025-06-10T10:00:00Z",
    author: UP,
  },
  {
    id: "r-012",
    slug: "interview-with-climate-hardware-founder",
    title: "Interview: Building Climate Hardware That Actually Ships",
    description:
      "A long-form interview with an engineer who built and deployed low-cost air quality sensors across 14 countries — lessons on hardware, partnerships, and patience.",
    content: `# Interview: Building Climate Hardware That Actually Ships

We sat down with an engineer (who asked to remain anonymous due to ongoing government contracts) who built and deployed low-cost air quality sensor networks across 14 countries. Lessons below.

## The problem they picked

**Q: How did you pick air quality?**

A: I was working at a big tech company on ads infrastructure, and I kept reading WHO reports on the health cost of air pollution — 7 million premature deaths a year. The thing that struck me was that most of those deaths happen in places without monitoring. You can't manage what you can't measure.

I looked at existing solutions. Reference-grade monitors cost $50K+. The cheap consumer ones were inaccurate. There was a missing middle — accurate enough to be useful, cheap enough to deploy at scale.

## The first 12 months

**Q: What did the first year look like?**

A: First six months was just reading. EPA monitoring protocols, low-cost sensor literature, what cities were trying. I built 12 prototypes and threw away 11.

Months 7-12, I had one design that worked in lab conditions. Then I took it to Delhi in winter and it failed within 4 hours — the particulate load was 20x what the sensor was rated for. That was a humbling week.

**Q: How did you fund the first year?**

A: Personal savings and consulting. About $40K of my own money over 14 months. I deliberately didn't raise VC early — I didn't know what I was building yet.

## The breakthrough

**Q: What was the moment it became real?**

A: Month 18, I had a version that survived Delhi winters. I deployed 50 sensors across the city with a local university partnership. The data was good enough that the state pollution control board started using it.

That's when I knew I had something. Not "users love it" — government was using it for actual decisions.

## The funding decision

**Q: Did you raise VC then?**

A: I considered it. Had term sheets. But the more I thought about it, the more I realized VC would push me to scale to consumer IoT, which isn't where the impact is. The impact is in government and industrial deployments.

I ended up taking a mix:
- **ARPA-E grant** ($500K) — for the next-gen hardware
- **Climate foundation grant** ($300K) — for open data layer
- **Government contracts** ($200-400K/year) — for deployments

No equity dilution. Slower growth, but I own the mission.

## What surprised them

**Q: What did you not expect?**

A: Three things.

First, **how long government procurement takes**. Six months from "yes we want this" to signed contract. Eighteen months to first deployment. You have to plan cash flow accordingly.

Second, **how much local teams matter**. The Delhi deployment worked because I partnered with a local university that knew the politics, the regulations, the maintenance realities. I could never have done it remotely.

Third, **how much maintenance matters**. The first 100 sensors I deployed, 30% were broken within 6 months. Hardware in the field breaks. You need to plan for it from day one.

## On picking problems

**Q: What would you tell engineers picking a problem today?**

A: Pick something where:

1. **The problem is documented** — not just your opinion, but credible sources saying it's severe
2. **There's a missing middle** — solutions exist at the high end and the low end, but the useful middle is empty
3. **You can make a 10x improvement** — incremental improvements don't change adoption
4. **You can stick with it for 5+ years** — meaningful problems don't reward sprinters

Air quality met all four. Reference monitors existed (high end), consumer sensors existed (low end), but the accurate-and-affordable middle was empty. WHO documented the severity. I knew I could spend a decade on it.

## On the lonely middle

**Q: What was the hardest part?**

A: Months 12-18. The prototype didn't work in the field yet. I'd spent most of my savings. My friends were getting promoted at FAANG. I was debugging a sensor in a Delhi winter wondering what I was doing.

What got me through was talking to other builders in the same valley of suck. Join communities — Climatebase, Work on Climate, the SOSV climate Slack. You're not alone, but you have to find your people.

## Advice for engineers

**Q: Final advice?**

A: Three things.

**Don't go it alone.** Find a co-founder or at least a committed collaborator. Solo founders have a much higher failure rate, and the psychological toll is real.

**Talk to users before you build.** I wasted 6 months on a feature no one wanted because I didn't ask.

**Plan for 5 years, not 18 months.** Real engineering innovation takes that long. If you can't commit to that horizon, pick a different problem or stay at your job.

---

*This interview has been edited and condensed. The engineer mentioned is a real person; identifying details have been changed.*`,
    type: "BLOG",
    category: "Career & Growth",
    tags: "interview, climate, hardware, founder, government, deployment",
    readTime: "19 min",
    coverImage: null,
    thumbnailUrl: null,
    isPremium: false,
    downloadCount: 762,
    createdAt: "2025-06-22T10:00:00Z",
    author: UP,
  },
];
