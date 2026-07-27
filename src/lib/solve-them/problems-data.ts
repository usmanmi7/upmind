import type { Problem } from "./types";

/**
 * Solve Them, v1 problems dataset.
 *
 * Curated from WHO, UN, UNICEF, World Bank, WEF, UNDP, research papers, and
 * global risk reports. Each entry carries rich metadata for filtering,
 * scoring, and matching engineers to problems they can solve.
 *
 * v1 covers 26 categories with ~2-3 problems each (~70 entries total).
 * Future versions will expand to 500+ via AI-assisted generation + curation.
 */

export const PROBLEMS: Problem[] = [
  // ─────────────────────────────────────────────────────────────────────────
  // HEALTHCARE
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: "ai-powered-early-disease-detection",
    title: "AI-Powered Early Disease Detection in Low-Resource Clinics",
    summary:
      "Most deaths from cancer, TB, and diabetes in low-income regions happen because disease is caught too late. AI on cheap mobile devices can change that.",
    description:
      "In low- and middle-income countries, over 70% of cancer cases are detected at late stages when treatment is far less effective. Rural clinics lack pathologists, radiologists, and specialists. A single misdiagnosed X-ray can mean the difference between life and death. The opportunity is to build AI models that run on edge devices, cheap smartphones, low-power edge TPUs, and give a clinic nurse the diagnostic power of a specialist. The WHO estimates that scaling early detection could save 7+ million lives per year. The challenge is not the model accuracy alone; it's robustness across populations with different genetics, diets, and environmental exposures than the training data, plus the user-experience challenge of integrating AI into a 5-minute consultation.",
    category: "Healthcare",
    tags: ["AI", "Diagnostics", "Mobile Health", "Edge Computing", "Global Health"],
    source: "WHO Global Cancer Report",
    sourceUrl: "https://www.who.int/publications",
    scope: "GLOBAL",
    regions: ["Sub-Saharan Africa", "South Asia", "Southeast Asia"],
    countriesAffected: ["India", "Nigeria", "Indonesia", "Pakistan", "Bangladesh"],
    peopleAffected: "2.4 Billion+",
    severity: 92,
    difficulty: 7,
    marketNeed: 88,
    globalDemand: 78,
    futureImportance: 95,
    innovationScore: 90,
    impactScore: 96,
    canEngineersSolve: true,
    engineerSolvableNote:
      "Requires edge ML, medical imaging datasets, and regulatory clearance. Engineering-heavy with cross-functional medical partnerships.",
    estimatedTimelineMonths: 18,
    difficultyLevel: "HARD",
    projectTypes: ["Startup", "Research", "Product"],
    solutions: [
      {
        title: "Edge AI X-ray & ECG Analyzer",
        description:
          "Mobile-first app that runs lightweight CNN models offline to flag TB, pneumonia, and cardiac anomalies from cheap portable X-ray or ECG devices.",
      },
      {
        title: "Symptom Triage Assistant",
        description:
          "Voice-first chatbot for community health workers that asks localized questions and ranks probable conditions for referral.",
      },
      {
        title: "Federated Learning Network",
        description:
          "Cross-clinic federated training pipeline so rural clinics improve the model without sending patient data anywhere.",
      },
    ],
    skills: [
      { skill: "Python", importance: 9 },
      { skill: "PyTorch / TensorFlow", importance: 9 },
      { skill: "Edge ML / ONNX", importance: 8 },
      { skill: "Mobile Development (React Native / Flutter)", importance: 7 },
      { skill: "Medical Imaging", importance: 8 },
    ],
    teamTemplates: [
      {
        templateName: "Lean Team",
        minMembers: 3,
        maxMembers: 5,
        estimatedTimelineMonths: 18,
        roles: ["ML Engineer", "Mobile Engineer", "Clinical Advisor"],
      },
      {
        templateName: "Full Team",
        minMembers: 6,
        maxMembers: 10,
        estimatedTimelineMonths: 14,
        roles: ["ML Engineer", "Edge ML Specialist", "Mobile Engineer", "Backend Engineer", "Clinical Lead", "Regulatory Lead"],
      },
    ],
    roadmaps: [
      { phase: "Research", title: "Dataset & clinical partnerships", description: "Secure IRB-approved access to 50k+ labeled medical images across 3+ geographies.", duration: "3 months" },
      { phase: "Prototype", title: "Edge ML MVP", description: "Train baseline CNN, distill to <50MB ONNX model, validate on cheap Android devices.", duration: "4 months" },
      { phase: "MVP", title: "Pilot deployment in 5 clinics", description: "Run live alongside existing diagnostics, collect false-positive / false-negative data.", duration: "6 months" },
      { phase: "Scale", title: "Regulatory clearance & multi-country rollout", description: "WHO prequalification, country-by-country approvals, federated learning loop.", duration: "12+ months" },
    ],
  },
  {
    slug: "cold-chain-vaccine-logistics",
    title: "Cold-Chain Vaccine Logistics in Tropical Climates",
    summary:
      "Up to 50% of vaccines are wasted globally because cold-chain breaks. IoT + edge analytics can plug the leak.",
    description:
      "The WHO estimates that 25–50% of vaccines are wasted worldwide, with most losses occurring in the last mile of delivery in tropical and rural regions. Vaccines require strict 2–8°C storage, but power outages, broken fridges, and human error cause silent failures. Every wasted vial is a child unprotected. The opportunity is to build low-cost IoT sensors, mesh-networked over LoRa or GSM, that monitor temperature continuously, predict failure before it happens, and route replacement stock automatically. The downstream impact: cheaper immunization programs, fewer outbreaks, and trust in public health systems.",
    category: "Healthcare",
    tags: ["IoT", "Logistics", "Vaccines", "Sensors", "Global Health"],
    source: "WHO Immunization Summary",
    sourceUrl: "https://www.who.int/immunization",
    scope: "GLOBAL",
    regions: ["Sub-Saharan Africa", "South Asia", "Latin America"],
    countriesAffected: ["India", "Nigeria", "DRC", "Ethiopia", "Brazil"],
    peopleAffected: "1.5 Billion+",
    severity: 85,
    difficulty: 6,
    marketNeed: 82,
    globalDemand: 70,
    futureImportance: 88,
    innovationScore: 78,
    impactScore: 90,
    canEngineersSolve: true,
    engineerSolvableNote: "Pure engineering + logistics. No regulatory barrier beyond medical device certifications for the sensor.",
    estimatedTimelineMonths: 12,
    difficultyLevel: "MEDIUM",
    projectTypes: ["Startup", "Product", "Hardware"],
    solutions: [
      { title: "LoRa Mesh Cold-Chain Sensors", description: "Sub-$10 battery-powered temperature loggers forming a mesh that reports every 5 minutes through any available gateway." },
      { title: "Predictive Spoilage Dashboard", description: "ML model that predicts fridge failures 24h ahead using temperature variance, ambient humidity, and door-open frequency." },
      { title: "Auto-Rerouting Logistics Layer", description: "API that integrates with national immunization supply chains to auto-reroute replacement stock before spoilage." },
    ],
    skills: [
      { skill: "Embedded C / Firmware", importance: 9 },
      { skill: "LoRa / IoT Networking", importance: 8 },
      { skill: "Backend Engineering (Node/Go)", importance: 7 },
      { skill: "Time-Series ML", importance: 6 },
      { skill: "Hardware Design", importance: 8 },
    ],
    teamTemplates: [
      { templateName: "Lean Team", minMembers: 3, maxMembers: 5, estimatedTimelineMonths: 12, roles: ["Hardware Engineer", "Firmware Engineer", "Backend Engineer"] },
    ],
    roadmaps: [
      { phase: "Research", title: "Field study in 2 districts", description: "Visit 20+ clinics, instrument existing fridges, log failure modes.", duration: "2 months" },
      { phase: "Prototype", title: "V1 sensor + gateway", description: "Build 50 sensor units, deploy in 1 district, validate telemetry.", duration: "3 months" },
      { phase: "MVP", title: "Predictive spoilage model live", description: "Train and deploy ML model, integrate with Ministry of Health dashboard.", duration: "4 months" },
      { phase: "Scale", title: "Multi-country rollout", description: "Manufacturing partnerships, Gavi/UNICEF procurement channels.", duration: "12+ months" },
    ],
  },
  {
    slug: "maternal-health-remote-monitoring",
    title: "Remote Monitoring for High-Risk Pregnancies",
    summary:
      "800 women die every day from preventable pregnancy causes. Connected, AI-flagged monitoring saves lives.",
    description:
      "Approximately 800 women die every day from preventable causes related to pregnancy and childbirth, with 95% of these deaths occurring in low- and middle-income countries. Conditions like preeclampsia, gestational diabetes, and obstructed labor are predictable with regular monitoring but go undetected because rural mothers rarely see a clinician. The opportunity: build a kit, blood pressure cuff, simple urine test strip, weight scale, paired with a phone app that flags danger signs and routes high-risk mothers to facilities before crisis. The technical challenge is designing for low-literacy users, intermittent connectivity, and integration with overstretched rural health systems.",
    category: "Healthcare",
    tags: ["Maternal Health", "IoT", "Mobile Health", "AI Triage"],
    source: "UNICEF State of the World's Children",
    scope: "GLOBAL",
    regions: ["Sub-Saharan Africa", "South Asia"],
    countriesAffected: ["Nigeria", "India", "Pakistan", "Ethiopia", "DRC"],
    peopleAffected: "200 Million+",
    severity: 90,
    difficulty: 6,
    marketNeed: 85,
    globalDemand: 65,
    futureImportance: 88,
    innovationScore: 80,
    impactScore: 94,
    canEngineersSolve: true,
    engineerSolvableNote: "Requires cross-functional medical + UX + hardware work. Regulatory path is well-trodden.",
    estimatedTimelineMonths: 14,
    difficultyLevel: "MEDIUM",
    projectTypes: ["Startup", "Product", "Hardware"],
    solutions: [
      { title: "Connected Maternal Kit", description: "$30 kit: BP cuff, urine test strip reader, weight scale, all BLE-paired to a phone." },
      { title: "Preeclampsia Risk Model", description: "Lightweight ML model that uses BP trend, weight gain, and urine protein to flag risk 1-2 weeks early." },
      { title: "Voice-First Education Module", description: "Localized audio guidance for low-literacy users on warning signs and clinic visits." },
    ],
    skills: [
      { skill: "Mobile Development", importance: 8 },
      { skill: "Bluetooth Low Energy", importance: 7 },
      { skill: "ML / Risk Modeling", importance: 7 },
      { skill: "UX for Low-Literacy Users", importance: 8 },
    ],
    teamTemplates: [
      { templateName: "Lean Team", minMembers: 4, maxMembers: 6, estimatedTimelineMonths: 14, roles: ["Mobile Engineer", "ML Engineer", "UX Designer", "Clinical Advisor"] },
    ],
    roadmaps: [
      { phase: "Research", title: "Clinical needs assessment", description: "Interview 50+ maternal health workers across 3 countries.", duration: "2 months" },
      { phase: "Prototype", title: "V1 kit + app", description: "Build 100 kits, deploy with 50 mothers, iterate on UX.", duration: "4 months" },
      { phase: "MVP", title: "Risk model live", description: "Validate preeclampsia model on 500+ pregnancies.", duration: "5 months" },
      { phase: "Scale", title: "National health ministry partnerships", description: "Integrate into national maternal health programs.", duration: "12+ months" },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // CLIMATE CHANGE
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: "ai-flood-prediction-platform",
    title: "AI Flood Prediction for Vulnerable River Basins",
    summary:
      "Floods displace 30M+ people yearly. AI forecasting 24-72 hours ahead could cut displacement by half.",
    description:
      "Flooding affects more people than any other natural hazard, over 30 million displaced annually, with economic damages exceeding $40B. South Asia, Southeast Asia, and West Africa bear the brunt. Existing flood models are either globally coarse (satellite-based) or locally expensive (custom hydrology per basin). The opportunity: train AI models on satellite imagery, rainfall forecasts, and historical flood extents to predict inundation 24-72 hours ahead at 30m resolution, and deliver SMS alerts to at-risk villages. The challenge is ground-truth data scarcity in exactly the regions that need it most.",
    category: "Climate Change",
    tags: ["AI", "Flooding", "Satellite", "Disaster Prediction", "Remote Sensing"],
    source: "World Bank Climate Change Knowledge Portal",
    scope: "GLOBAL",
    regions: ["South Asia", "Southeast Asia", "West Africa"],
    countriesAffected: ["Bangladesh", "India", "Vietnam", "Nigeria", "Pakistan"],
    peopleAffected: "30 Million+",
    severity: 88,
    difficulty: 7,
    marketNeed: 85,
    globalDemand: 72,
    futureImportance: 95,
    innovationScore: 85,
    impactScore: 92,
    canEngineersSolve: true,
    engineerSolvableNote: "Pure engineering. Satellite data is increasingly free (Sentinel, Landsat). Computational cost is the main barrier.",
    estimatedTimelineMonths: 14,
    difficultyLevel: "HARD",
    projectTypes: ["Startup", "Research", "Product"],
    solutions: [
      { title: "30m Resolution Flood Forecast Model", description: "CNN+LSTM trained on Sentinel-1 SAR imagery, rainfall forecasts, and DEM data; outputs daily inundation probability maps." },
      { title: "SMS Alert System", description: "Multilingual SMS gateway that auto-notifies villages in predicted flood paths 48h ahead." },
      { title: "Open Flood Data API", description: "Free API for NGOs, governments, and researchers to consume flood predictions for their regions." },
    ],
    skills: [
      { skill: "Python", importance: 9 },
      { skill: "PyTorch", importance: 8 },
      { skill: "Remote Sensing / GIS", importance: 9 },
      { skill: "Cloud Infrastructure (AWS/GCP)", importance: 7 },
      { skill: "Geospatial Data Processing", importance: 8 },
    ],
    teamTemplates: [
      { templateName: "Lean Team", minMembers: 3, maxMembers: 5, estimatedTimelineMonths: 14, roles: ["ML Engineer", "Geospatial Engineer", "Backend Engineer"] },
      { templateName: "Full Team", minMembers: 5, maxMembers: 8, estimatedTimelineMonths: 12, roles: ["ML Engineer", "Geospatial Engineer", "Backend Engineer", "Mobile Engineer", "Partnerships Lead"] },
    ],
    roadmaps: [
      { phase: "Research", title: "Historical flood dataset", description: "Compile 10+ years of flood events across 5 basins with Sentinel-1 imagery.", duration: "3 months" },
      { phase: "Prototype", title: "V1 model + dashboard", description: "Train baseline model, validate hindcast on 2022-2024 events.", duration: "4 months" },
      { phase: "MVP", title: "Live pilot in 1 basin", description: "Deploy with national disaster agency, send real SMS alerts.", duration: "5 months" },
      { phase: "Scale", title: "Multi-basin rollout", description: "Expand to 10 basins, integrate with Google Flood Hub.", duration: "12+ months" },
    ],
  },
  {
    slug: "decentralized-renewable-microgrids",
    title: "Decentralized Renewable Microgrids for 800M Without Electricity",
    summary:
      "800M people still lack electricity. Solar microgrids + smart load balancing can leapfrog the grid.",
    description:
      "Despite two decades of electrification programs, 800M people still live without electricity, and billions more suffer unreliable supply. Extending the central grid to remote communities is prohibitively expensive, often $5,000+ per connection. Decentralized solar microgrids with battery storage can power a village for $500/household, but they face challenges: load balancing across diverse users (homes, businesses, schools), payment collection in cash economies, and maintenance in remote areas. The engineering opportunity is end-to-end: smart inverters, IoT load management, mobile money integration, and predictive maintenance.",
    category: "Climate Change",
    tags: ["Energy Access", "Solar", "Microgrids", "IoT", "Decentralization"],
    source: "IEA Energy Access Report",
    scope: "GLOBAL",
    regions: ["Sub-Saharan Africa", "South Asia"],
    countriesAffected: ["Nigeria", "India", "DRC", "Ethiopia", "Bangladesh"],
    peopleAffected: "800 Million+",
    severity: 85,
    difficulty: 7,
    marketNeed: 90,
    globalDemand: 80,
    futureImportance: 92,
    innovationScore: 82,
    impactScore: 95,
    canEngineersSolve: true,
    engineerSolvableNote: "Hardware + software + business model innovation. Capital-intensive but proven feasible.",
    estimatedTimelineMonths: 18,
    difficultyLevel: "HARD",
    projectTypes: ["Startup", "Hardware", "Product"],
    solutions: [
      { title: "Smart Microgrid Controller", description: "Edge device that balances solar input, battery state, and 50+ household loads in real-time, prioritizing critical loads." },
      { title: "Mobile Money Pay-As-You-Go", description: "Integration with M-Pesa, Airtel Money, etc. for prepaid electricity tokens that auto-cut on non-payment." },
      { title: "Predictive Maintenance Platform", description: "ML model that predicts battery degradation and inverter failure from voltage/current anomalies." },
    ],
    skills: [
      { skill: "Power Electronics", importance: 9 },
      { skill: "Embedded Systems", importance: 8 },
      { skill: "Backend Engineering", importance: 7 },
      { skill: "IoT / Edge Computing", importance: 8 },
      { skill: "Mobile Money APIs", importance: 6 },
    ],
    teamTemplates: [
      { templateName: "Full Team", minMembers: 5, maxMembers: 8, estimatedTimelineMonths: 18, roles: ["Power Electronics Engineer", "Embedded Engineer", "Backend Engineer", "Field Operations", "Partnerships Lead"] },
    ],
    roadmaps: [
      { phase: "Research", title: "Site selection & community partnerships", description: "Identify 10 villages across 2 countries, sign MOUs.", duration: "3 months" },
      { phase: "Prototype", title: "V1 controller + 1 pilot village", description: "Deploy 5kW microgrid, instrument 30 households.", duration: "5 months" },
      { phase: "MVP", title: "10 village rollout", description: "Scale manufacturing, validate business model.", duration: "6 months" },
      { phase: "Scale", title: "100+ villages, national utility partnerships", description: "Integrate with national rural electrification programs.", duration: "18+ months" },
    ],
  },
  {
    slug: "carbon-capture-direct-air",
    title: "Direct Air Carbon Capture at $50/ton",
    summary:
      "Current DAC costs $600+/ton. To stay under 1.5°C, we need DAC at $50/ton by 2035.",
    description:
      "The IPCC is clear: staying under 1.5°C requires not just emissions cuts but active removal of 5-10 gigatons of CO₂ per year by 2050. Direct Air Capture (DAC) is one of the few technologies that can do this at scale, but current costs are $600-1,000/ton, 10x too expensive. The bottleneck is not physics but engineering: sorbent materials, heat recovery, modular plant design, and integration with cheap renewable power. The opportunity is enormous: whoever cracks $50/ton DAC unlocks a trillion-dollar carbon removal market.",
    category: "Climate Change",
    tags: ["Carbon Capture", "Materials Science", "Climate Tech", "Direct Air Capture"],
    source: "IPCC AR6 Working Group III",
    sourceUrl: "https://www.ipcc.ch/report/ar6/wg3/",
    scope: "GLOBAL",
    regions: ["Global"],
    countriesAffected: ["United States", "European Union", "China", "India", "Brazil"],
    peopleAffected: "8 Billion",
    severity: 95,
    difficulty: 10,
    marketNeed: 92,
    globalDemand: 95,
    futureImportance: 99,
    innovationScore: 95,
    impactScore: 98,
    canEngineersSolve: true,
    engineerSolvableNote: "Frontier engineering across materials science, thermodynamics, and process design. Multi-decade effort.",
    estimatedTimelineMonths: 60,
    difficultyLevel: "EXTREME",
    projectTypes: ["Startup", "Research", "Hardware"],
    solutions: [
      { title: "Next-Gen Sorbent Materials", description: "MOFs or amine-functionalized materials with 2x CO₂ capacity and 50% lower regeneration energy." },
      { title: "Modular DAC Plant Design", description: "Containerized DAC units that mass-manufacture like shipping containers, deployable anywhere with cheap renewables." },
      { title: "Waste Heat Integration", description: "Co-locate with industrial heat sources (geothermal, nuclear, green steel) to slash energy costs." },
    ],
    skills: [
      { skill: "Chemical Engineering", importance: 10 },
      { skill: "Materials Science", importance: 10 },
      { skill: "Process Engineering", importance: 9 },
      { skill: "Mechanical Engineering", importance: 8 },
      { skill: "Techno-Economic Modeling", importance: 8 },
    ],
    teamTemplates: [
      { templateName: "Research Team", minMembers: 6, maxMembers: 12, estimatedTimelineMonths: 36, roles: ["Principal Investigator", "Materials Scientist", "Chemical Engineer", "Mechanical Engineer", "Process Engineer", "Lab Technician"] },
      { templateName: "Commercial Scale-Up", minMembers: 10, maxMembers: 25, estimatedTimelineMonths: 60, roles: ["CTO", "Materials Scientist", "Process Engineer", "Mechanical Engineer", "Manufacturing Lead", "Project Finance", "Policy Lead"] },
    ],
    roadmaps: [
      { phase: "Research", title: "Sorbent discovery", description: "Synthesize and test 1000+ candidate materials, identify top 5.", duration: "12 months" },
      { phase: "Prototype", title: "Bench-scale DAC unit", description: "Demonstrate 1 ton/day capture with target sorbent.", duration: "12 months" },
      { phase: "MVP", title: "Pilot plant 1000 tons/year", description: "Validate at scale, measure actual cost/ton.", duration: "18 months" },
      { phase: "Scale", title: "Commercial 1 megaton/year plant", description: "Mass manufacturing, integrate with carbon markets.", duration: "24+ months" },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // ARTIFICIAL INTELLIGENCE
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: "low-resource-language-ai",
    title: "AI for Low-Resource Languages (1,500+ Languages)",
    summary:
      "GPT works in 100 languages. 6,500+ languages have zero AI. Billions are excluded from the AI economy.",
    description:
      "Modern LLMs work well in ~100 high-resource languages, but the world has 7,000+ languages. Speakers of the other 6,500+ languages, billions of people, are locked out of AI tools, from translation to education to voice assistants. This isn't just a fairness issue; it's a massive lost opportunity. Building LLMs for low-resource languages requires creative approaches: cross-lingual transfer, synthetic data generation, mobile-first inference, and partnerships with native speakers. The technical challenge is that traditional ML requires millions of examples, many of these languages have only thousands.",
    category: "Artificial Intelligence",
    tags: ["NLP", "LLM", "Low-Resource Languages", "Translation", "Voice"],
    source: "Ethnologue / UNESCO Atlas of Languages in Danger",
    scope: "GLOBAL",
    regions: ["Global"],
    countriesAffected: ["India", "Indonesia", "Nigeria", "Papua New Guinea", "Brazil"],
    peopleAffected: "3 Billion+",
    severity: 75,
    difficulty: 8,
    marketNeed: 78,
    globalDemand: 70,
    futureImportance: 92,
    innovationScore: 90,
    impactScore: 88,
    canEngineersSolve: true,
    engineerSolvableNote: "Hard ML problem but tractable with transfer learning and synthetic data. Data collection is the long pole.",
    estimatedTimelineMonths: 24,
    difficultyLevel: "HARD",
    projectTypes: ["Startup", "Research", "Open Source"],
    solutions: [
      { title: "Cross-Lingual Transfer Framework", description: "Pipeline that takes a high-resource LLM and adapts it to a low-resource language with as few as 10k parallel sentences." },
      { title: "Synthetic Data Generation", description: "Use GPT-4 to bootstrap synthetic monolingual corpora for languages with near-zero digitized text." },
      { title: "Voice-First AI for Oral Languages", description: "End-to-end speech-to-speech AI for languages with no writing system, unlocking voice interfaces for 1B+ people." },
    ],
    skills: [
      { skill: "NLP / LLM Training", importance: 10 },
      { skill: "Cross-Lingual Transfer Learning", importance: 9 },
      { skill: "Speech Recognition (ASR)", importance: 7 },
      { skill: "Data Engineering", importance: 8 },
      { skill: "Linguistics", importance: 7 },
    ],
    teamTemplates: [
      { templateName: "Lean Team", minMembers: 3, maxMembers: 5, estimatedTimelineMonths: 18, roles: ["ML Engineer", "Linguist", "Data Engineer"] },
      { templateName: "Full Team", minMembers: 5, maxMembers: 8, estimatedTimelineMonths: 12, roles: ["ML Engineer", "Linguist", "Data Engineer", "Mobile Engineer", "Community Manager"] },
    ],
    roadmaps: [
      { phase: "Research", title: "Language prioritization", description: "Pick 5 languages with 10M+ speakers but minimal AI support.", duration: "2 months" },
      { phase: "Prototype", title: "V1 translation model", description: "Train baseline MT model, achieve BLEU > 30 on 1 language.", duration: "5 months" },
      { phase: "MVP", title: "Voice assistant in 3 languages", description: "Ship speech-to-text + text-to-speech for 3 languages.", duration: "6 months" },
      { phase: "Scale", title: "50+ languages, open-source release", description: "Open-source models, partner with national language authorities.", duration: "12+ months" },
    ],
  },
  {
    slug: "ai-alignment-interpretability",
    title: "Mechanistic Interpretability for Safe AI",
    summary:
      "We don't understand why LLMs do what they do. As models get smarter, this becomes a civilization-level risk.",
    description:
      "Modern LLMs are black boxes: they work, but we don't know why they produce any specific output. As models approach and exceed human capability, this opacity becomes a civilization-level risk. Mechanistic interpretability, the project of reverse-engineering neural networks to understand their internal computations, is one of the most important research directions of our time. Without it, we cannot reliably detect deception, bias, or emergent dangerous capabilities. The field is in its infancy: we can interpret small models, but trillion-parameter systems remain opaque.",
    category: "Artificial Intelligence",
    tags: ["AI Safety", "Interpretability", "Alignment", "Research"],
    source: "Anthropic / OpenAI Research",
    scope: "GLOBAL",
    regions: ["Global"],
    countriesAffected: ["United States", "United Kingdom", "China", "European Union", "Canada"],
    peopleAffected: "8 Billion",
    severity: 80,
    difficulty: 10,
    marketNeed: 70,
    globalDemand: 90,
    futureImportance: 99,
    innovationScore: 95,
    impactScore: 92,
    canEngineersSolve: true,
    engineerSolvableNote: "Frontier research. Requires deep ML, neuroscience, and novel math. 5-10 year horizon for major breakthroughs.",
    estimatedTimelineMonths: 60,
    difficultyLevel: "EXTREME",
    projectTypes: ["Research", "Open Source"],
    solutions: [
      { title: "Circuit Discovery Tools", description: "Automated tools that identify computational circuits inside transformers, scaling to 100B+ parameter models." },
      { title: "Deception Detection", description: "Methods to detect when a model is being deceptive or scheming in its internal activations." },
      { title: "Activation Patching Framework", description: "Open-source framework for causal intervention experiments at scale, with standardized benchmarks." },
    ],
    skills: [
      { skill: "Deep Learning Theory", importance: 10 },
      { skill: "PyTorch", importance: 9 },
      { skill: "Linear Algebra / Information Theory", importance: 8 },
      { skill: "Causal Inference", importance: 7 },
      { skill: "Neuroscience (helpful)", importance: 5 },
    ],
    teamTemplates: [
      { templateName: "Research Team", minMembers: 4, maxMembers: 8, estimatedTimelineMonths: 36, roles: ["Lead Researcher", "ML Engineer", "Theorist", "Empirical Researcher"] },
    ],
    roadmaps: [
      { phase: "Research", title: "Replicate existing interp work", description: "Reproduce Anthropic's circuit-level results on toy models.", duration: "6 months" },
      { phase: "Prototype", title: "Scaling to 7B parameter model", description: "Identify circuits in a real production-scale model.", duration: "12 months" },
      { phase: "MVP", title: "Deception detection benchmark", description: "Release benchmark for deception in LLMs, score top models.", duration: "12 months" },
      { phase: "Scale", title: "Production interpretability tools", description: "Tools used by every frontier lab during training.", duration: "24+ months" },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // CYBER SECURITY
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: "post-quantum-cryptography-migration",
    title: "Migrating the Internet to Post-Quantum Cryptography",
    summary:
      "Quantum computers will break RSA & ECC by 2035. The entire internet needs to migrate. We're 5% done.",
    description:
      "Shor's algorithm, run on a sufficiently large quantum computer, breaks RSA and elliptic-curve cryptography, the foundation of HTTPS, SSH, code signing, and blockchain. NIST estimates a 50% chance of cryptographically-relevant quantum computers by 2033. Migrating the internet to post-quantum cryptography (PQC) is a multi-decade, multi-trillion-dollar engineering project. The challenge is enormous: every TLS certificate, every code signing key, every IoT device, every banking system must be upgraded. We're roughly 5% done. The 'harvest now, decrypt later' threat means data encrypted today is already at risk.",
    category: "Cyber Security",
    tags: ["Quantum", "Cryptography", "PQC", "Infrastructure"],
    source: "NIST PQC Standardization",
    sourceUrl: "https://csrc.nist.gov/projects/post-quantum-cryptography",
    scope: "GLOBAL",
    regions: ["Global"],
    countriesAffected: ["United States", "European Union", "China", "India", "Japan"],
    peopleAffected: "5 Billion+",
    severity: 88,
    difficulty: 9,
    marketNeed: 95,
    globalDemand: 90,
    futureImportance: 98,
    innovationScore: 85,
    impactScore: 92,
    canEngineersSolve: true,
    engineerSolvableNote: "Pure engineering + standards work. NIST algorithms are ready; the migration is the hard part.",
    estimatedTimelineMonths: 120,
    difficultyLevel: "EXTREME",
    projectTypes: ["Startup", "Infrastructure", "Open Source"],
    solutions: [
      { title: "Hybrid TLS Stack", description: "Drop-in PQC-enabled TLS library that supports hybrid classical+PQC handshakes for zero-downtime migration." },
      { title: "Code Signing Migration Tool", description: "Automated tool that scans billions of binaries and re-signs them with PQC algorithms." },
      { title: "IoT PQC Firmware Standard", description: "Open firmware standard for PQC on constrained devices (<100KB RAM)." },
    ],
    skills: [
      { skill: "Cryptography", importance: 10 },
      { skill: "C / Rust Systems Programming", importance: 9 },
      { skill: "TLS / X.509", importance: 9 },
      { skill: "Embedded Systems", importance: 7 },
      { skill: "Standards Bodies (IETF, NIST)", importance: 6 },
    ],
    teamTemplates: [
      { templateName: "Core Team", minMembers: 4, maxMembers: 7, estimatedTimelineMonths: 24, roles: ["Cryptographer", "Systems Engineer", "Embedded Engineer", "Standards Liaison"] },
    ],
    roadmaps: [
      { phase: "Research", title: "Audit current crypto exposure", description: "Catalog every RSA/ECC dependency across a target enterprise.", duration: "3 months" },
      { phase: "Prototype", title: "Hybrid TLS library", description: "Implement and benchmark hybrid PQC TLS in OpenSSL fork.", duration: "6 months" },
      { phase: "MVP", title: "Production deployment with 1 cloud provider", description: "Ship hybrid TLS to 1M+ end users, measure performance.", duration: "8 months" },
      { phase: "Scale", title: "Enterprise migration suite", description: "Tooling for any enterprise to migrate in <6 months.", duration: "24+ months" },
    ],
  },
  {
    slug: "open-source-siem-for-smes",
    title: "Open-Source SIEM for Small & Medium Businesses",
    summary:
      "Enterprise SIEMs cost $100k+/year. 99% of SMBs can't afford them and get breached because of it.",
    description:
      "Security Information and Event Management (SIEM) platforms, Splunk, IBM QRadar, Microsoft Sentinel, start at $100k/year and quickly exceed $1M for mid-size deployments. This prices out 99% of small and medium businesses, who then become the soft underbelly of the internet: easy targets for ransomware that cascades through supply chains. The opportunity is an open-source SIEM that any SMB can self-host or run as a managed service for <$50/month, with the detection quality of enterprise tools. The technical challenge is doing this with 1/1000th the compute budget.",
    category: "Cyber Security",
    tags: ["SIEM", "Open Source", "SMB", "Threat Detection", "Log Analysis"],
    source: "Verizon Data Breach Investigations Report",
    scope: "GLOBAL",
    regions: ["Global"],
    countriesAffected: ["United States", "European Union", "India", "Brazil", "United Kingdom"],
    peopleAffected: "400 Million+",
    severity: 78,
    difficulty: 6,
    marketNeed: 88,
    globalDemand: 80,
    futureImportance: 90,
    innovationScore: 75,
    impactScore: 85,
    canEngineersSolve: true,
    engineerSolvableNote: "Pure software engineering. Detection logic is well-known; the innovation is in cost optimization.",
    estimatedTimelineMonths: 14,
    difficultyLevel: "MEDIUM",
    projectTypes: ["Startup", "Open Source", "Product"],
    solutions: [
      { title: "Columnar Log Store", description: "Purpose-built columnar database for log analytics at 1/100th the cost of Splunk's index." },
      { title: "Sigma-Compatible Detection Engine", description: "Open Sigma rule format compatibility, so community rules plug in directly." },
      { title: "AI Anomaly Detection", description: "Lightweight unsupervised model that flags behavioral anomalies on top of rule-based detections." },
    ],
    skills: [
      { skill: "Backend Engineering (Rust/Go)", importance: 9 },
      { skill: "Databases / Columnar Storage", importance: 8 },
      { skill: "Security / Threat Detection", importance: 8 },
      { skill: "ML / Anomaly Detection", importance: 7 },
    ],
    teamTemplates: [
      { templateName: "Lean Team", minMembers: 3, maxMembers: 5, estimatedTimelineMonths: 14, roles: ["Backend Engineer", "Security Engineer", "ML Engineer"] },
    ],
    roadmaps: [
      { phase: "Research", title: "Threat model for SMBs", description: "Survey 100 SMBs, identify top 20 attack patterns.", duration: "2 months" },
      { phase: "Prototype", title: "V1 log store + 50 detection rules", description: "Open-source MVP, deploy with 10 design partners.", duration: "4 months" },
      { phase: "MVP", title: "Managed cloud version", description: "Cloud-hosted SIEM at $50/month, 100 customers.", duration: "5 months" },
      { phase: "Scale", title: "10,000+ SMBs, MSSP channel", description: "Sell through Managed Security Service Providers.", duration: "12+ months" },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // AGRICULTURE
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: "precision-agriculture-smallholders",
    title: "Precision Agriculture for 500M Smallholder Farmers",
    summary:
      "Big-farm precision ag is solved. Smallholders (under 2 hectares) get nothing, and feed 80% of Asia and Africa.",
    description:
      "Precision agriculture, satellite imagery, soil sensors, variable-rate input application, is standard on large Western farms. But 500M smallholder farmers in Asia and Africa, who cultivate under 2 hectares and feed 80% of those continents, have no access. They farm on intuition, get 1/3 the yield per hectare of large farms, and over-apply fertilizers that pollute watersheds. The opportunity: SMS and basic-app based advisory that uses free satellite data, weather forecasts, and crop models to tell a smallholder exactly when to plant, water, fertilize, and harvest. The challenge is delivery: many users have feature phones, intermittent connectivity, and limited literacy.",
    category: "Agriculture",
    tags: ["Precision Agriculture", "Satellite", "Smallholder", "Mobile", "Food Security"],
    source: "FAO Smallholder Data Portfolio",
    scope: "GLOBAL",
    regions: ["South Asia", "Sub-Saharan Africa", "Southeast Asia"],
    countriesAffected: ["India", "Ethiopia", "Nigeria", "Bangladesh", "Indonesia"],
    peopleAffected: "2.5 Billion+",
    severity: 82,
    difficulty: 6,
    marketNeed: 85,
    globalDemand: 75,
    futureImportance: 92,
    innovationScore: 78,
    impactScore: 92,
    canEngineersSolve: true,
    engineerSolvableNote: "Engineering + product + go-to-market. Tech exists; the hard part is distribution and trust.",
    estimatedTimelineMonths: 12,
    difficultyLevel: "MEDIUM",
    projectTypes: ["Startup", "Product", "NGO"],
    solutions: [
      { title: "SMS Advisory System", description: "Daily SMS in local language: 'Plant tomorrow, rain expected Thursday. Apply 5kg urea per acre.'" },
      { title: "Satellite Yield Prediction", description: "NDVI-based yield forecast at 10m resolution, free Sentinel-2 data." },
      { title: "Voice-First Helpline", description: "IVR system where farmers call a toll-free number and ask questions in their language, answered by AI." },
    ],
    skills: [
      { skill: "Backend Engineering", importance: 8 },
      { skill: "Geospatial / Remote Sensing", importance: 8 },
      { skill: "SMS / IVR Integration", importance: 7 },
      { skill: "Mobile Development", importance: 6 },
      { skill: "Agronomy", importance: 7 },
    ],
    teamTemplates: [
      { templateName: "Lean Team", minMembers: 4, maxMembers: 6, estimatedTimelineMonths: 12, roles: ["Backend Engineer", "Geospatial Engineer", "Agronomist", "Field Operations"] },
    ],
    roadmaps: [
      { phase: "Research", title: "Crop & region focus", description: "Pick 2 crops in 2 countries (e.g. rice in India, maize in Kenya).", duration: "2 months" },
      { phase: "Prototype", title: "V1 SMS advisory", description: "Deploy with 1,000 farmers, measure yield improvement.", duration: "4 months" },
      { phase: "MVP", title: "100,000 farmers, 2 countries", description: "Prove yield lift of 15%+, monetize via input suppliers.", duration: "5 months" },
      { phase: "Scale", title: "10M farmers, multi-country", description: "Government partnerships, scale across regions.", duration: "12+ months" },
    ],
  },
  {
    slug: "soil-carbon-measurement",
    title: "Cheap Soil Carbon Measurement for Carbon Markets",
    summary:
      "Soil stores 3x more carbon than air. Farmers want to sell credits but measurement costs $50/sample. We need $5.",
    description:
      "Soil is the largest terrestrial carbon sink, 3x more carbon than the atmosphere. Regenerative farming practices (cover crops, no-till, rotational grazing) can sequester tons of CO₂ per acre per year, but farmers can't monetize this because verifying soil carbon costs $50-100 per lab sample. With 500M farms globally, this is a $50B+ measurement problem. The opportunity: cheap, scalable soil carbon measurement, either via spectroscopy, soil DNA, or remote sensing fusion, that brings the cost to $5 or less per sample.",
    category: "Agriculture",
    tags: ["Carbon", "Soil", "Sensors", "Carbon Markets", "Climate Tech"],
    source: "IPCC Special Report on Land Use",
    scope: "GLOBAL",
    regions: ["Global"],
    countriesAffected: ["United States", "Brazil", "India", "Australia", "Russia"],
    peopleAffected: "500 Million+",
    severity: 75,
    difficulty: 8,
    marketNeed: 88,
    globalDemand: 80,
    futureImportance: 92,
    innovationScore: 88,
    impactScore: 88,
    canEngineersSolve: true,
    engineerSolvableNote: "Hardware + ML + lab science. Requires careful calibration against gold-standard lab measurements.",
    estimatedTimelineMonths: 24,
    difficultyLevel: "HARD",
    projectTypes: ["Startup", "Hardware", "Research"],
    solutions: [
      { title: "Portable NIR Spectrometer", description: "Handheld $500 device that estimates soil carbon in 30 seconds using near-infrared spectroscopy." },
      { title: "Satellite+Soil Fusion Model", description: "ML model that combines Sentinel-2 imagery, weather, and sparse ground samples to map carbon at 10m resolution." },
      { title: "Blockchain Carbon Registry", description: "Transparent registry that links measurements to carbon credits, preventing double-counting." },
    ],
    skills: [
      { skill: "Hardware / Spectroscopy", importance: 9 },
      { skill: "ML / Calibration Modeling", importance: 8 },
      { skill: "Geospatial Engineering", importance: 8 },
      { skill: "Soil Science", importance: 7 },
      { skill: "Blockchain / Carbon Markets", importance: 6 },
    ],
    teamTemplates: [
      { templateName: "Full Team", minMembers: 5, maxMembers: 8, estimatedTimelineMonths: 24, roles: ["Hardware Engineer", "ML Engineer", "Geospatial Engineer", "Soil Scientist", "Carbon Markets Lead"] },
    ],
    roadmaps: [
      { phase: "Research", title: "Soil spectral library", description: "Build 10,000-sample spectral library across 5 countries.", duration: "6 months" },
      { phase: "Prototype", title: "V1 handheld spectrometer", description: "Build 50 units, validate against lab measurements.", duration: "6 months" },
      { phase: "MVP", title: "Commercial pilot with 1,000 farms", description: "Issue first verified carbon credits.", duration: "8 months" },
      { phase: "Scale", title: "10M acres measured", description: "Integrate with Verra, Gold Standard registries.", duration: "24+ months" },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // EDUCATION
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: "ai-tutor-low-bandwidth",
    title: "AI Tutor for 600M Children Without Quality Education",
    summary:
      "GPT-4 tutors at $20/month. 600M kids in low-income countries can't pay $20/year. Cheaper AI = global literacy.",
    description:
      "UNESCO estimates 600M children worldwide are not achieving minimum proficiency in reading and math. The shortage of qualified teachers is acute: Sub-Saharan Africa needs 17M more teachers by 2030. AI tutors like Khan Academy's Khanmigo work, but at $20/month they're 50x too expensive for the children who need them most. The opportunity: build an AI tutor that runs at <$0.10/month per student, offline-first, in local languages. The technical challenge is cost compression, smaller models, distillation, on-device inference, without losing pedagogical quality.",
    category: "Education",
    tags: ["AI", "Education", "EdTech", "Low-Bandwidth", "Literacy"],
    source: "UNESCO Global Education Monitoring Report",
    scope: "GLOBAL",
    regions: ["Sub-Saharan Africa", "South Asia", "Latin America"],
    countriesAffected: ["India", "Nigeria", "Pakistan", "Ethiopia", "Indonesia"],
    peopleAffected: "600 Million+",
    severity: 85,
    difficulty: 7,
    marketNeed: 92,
    globalDemand: 85,
    futureImportance: 95,
    innovationScore: 88,
    impactScore: 95,
    canEngineersSolve: true,
    engineerSolvableNote: "Tech is feasible. Distribution and government partnerships are the real challenge.",
    estimatedTimelineMonths: 18,
    difficultyLevel: "HARD",
    projectTypes: ["Startup", "NGO", "Open Source"],
    solutions: [
      { title: "On-Device LLM Tutor", description: "1B parameter LLM distilled for primary math, runs offline on $50 Android tablet." },
      { title: "Adaptive Curriculum Engine", description: "IRT-based adaptive engine that diagnoses misconceptions and remediates them." },
      { title: "Teacher Co-Pilot", description: "Helps underqualified teachers prepare lessons and grade homework." },
    ],
    skills: [
      { skill: "ML / LLM Distillation", importance: 9 },
      { skill: "Mobile Engineering (Android)", importance: 8 },
      { skill: "Pedagogy / Instructional Design", importance: 8 },
      { skill: "Edge ML / TFLite", importance: 7 },
    ],
    teamTemplates: [
      { templateName: "Lean Team", minMembers: 4, maxMembers: 6, estimatedTimelineMonths: 18, roles: ["ML Engineer", "Mobile Engineer", "Pedagogy Lead", "Field Operations"] },
    ],
    roadmaps: [
      { phase: "Research", title: "Curriculum & language scope", description: "Pick 1 country (e.g. Kenya), 1 subject (math), grades 4-6.", duration: "3 months" },
      { phase: "Prototype", title: "V1 on-device tutor", description: "Train and distill model, deploy on 100 tablets.", duration: "5 months" },
      { phase: "MVP", title: "10,000 students pilot", description: "Measure learning gains vs. control group.", duration: "6 months" },
      { phase: "Scale", title: "National ministry partnership", description: "Deploy across 1 country's school system.", duration: "18+ months" },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // ENERGY
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: "grid-scale-storage-beyond-lithium",
    title: "Grid-Scale Storage Beyond Lithium (24h+ Duration)",
    summary:
      "Solar/wind need 24h+ storage to replace coal. Lithium batteries max out at 4h. New chemistry needed.",
    description:
      "Solar and wind are now the cheapest electricity in history, but they're intermittent. To replace fossil baseload, we need 24+ hours of grid-scale storage. Lithium-ion batteries top out at ~4 hours economically, beyond that, costs explode. The opportunity is in long-duration storage: iron-air, sodium-ion, flow batteries, thermal storage, compressed air, gravity. Each has 10x cost reduction potential at scale. The technical challenges vary by chemistry but all require fundamental materials and manufacturing innovation.",
    category: "Energy",
    tags: ["Batteries", "Energy Storage", "Grid", "Materials Science"],
    source: "IEA Net Zero by 2050 Roadmap",
    scope: "GLOBAL",
    regions: ["Global"],
    countriesAffected: ["United States", "China", "European Union", "India", "Australia"],
    peopleAffected: "8 Billion",
    severity: 90,
    difficulty: 9,
    marketNeed: 95,
    globalDemand: 95,
    futureImportance: 98,
    innovationScore: 90,
    impactScore: 96,
    canEngineersSolve: true,
    engineerSolvableNote: "Deep materials science + manufacturing scale-up. 5-10 year horizon for commercial impact.",
    estimatedTimelineMonths: 60,
    difficultyLevel: "EXTREME",
    projectTypes: ["Startup", "Hardware", "Research"],
    solutions: [
      { title: "Iron-Air Battery", description: "Reversible rusting chemistry, $20/kWh, 100h duration, earth-abundant materials." },
      { title: "Sodium-Ion at Scale", description: "Sodium chemistries that replace lithium for stationary storage, 30% cheaper." },
      { title: "Thermal Storage", description: "Store heat in cheap materials (crushed rock, molten salt) for industrial + grid use." },
    ],
    skills: [
      { skill: "Electrochemistry", importance: 10 },
      { skill: "Materials Science", importance: 9 },
      { skill: "Manufacturing Engineering", importance: 9 },
      { skill: "Power Electronics", importance: 7 },
      { skill: "Systems Engineering", importance: 8 },
    ],
    teamTemplates: [
      { templateName: "Research Team", minMembers: 5, maxMembers: 10, estimatedTimelineMonths: 36, roles: ["Principal Investigator", "Electrochemist", "Materials Scientist", "Manufacturing Engineer", "Lab Technician"] },
      { templateName: "Commercial Scale-Up", minMembers: 10, maxMembers: 30, estimatedTimelineMonths: 60, roles: ["CTO", "VP Manufacturing", "Electrochemist", "Materials Scientist", "Mechanical Engineer", "Supply Chain", "Project Finance"] },
    ],
    roadmaps: [
      { phase: "Research", title: "Chemistry selection", description: "Identify 1-2 chemistries with clear path to $30/kWh.", duration: "9 months" },
      { phase: "Prototype", title: "Bench-scale cell", description: "Demonstrate 100 cycles with <5% degradation.", duration: "12 months" },
      { phase: "MVP", title: "Pilot manufacturing line", description: "Build 1 MWh pilot, validate cost model.", duration: "18 months" },
      { phase: "Scale", title: "Gigafactory-scale manufacturing", description: "10 GWh/year production, utility contracts.", duration: "24+ months" },
    ],
  },
  {
    slug: "fusion-energy-net-positive",
    title: "Fusion Energy: Net-Positive & Commercially Viable",
    summary:
      "Fusion could give humanity unlimited clean energy. We've broken even. Now we need 10x more for commercial power.",
    description:
      "Fusion, the energy that powers the sun, could provide effectively unlimited clean energy with no long-lived waste. For 70 years it's been 30 years away. In December 2022, NIF achieved scientific breakeven (more energy out than in). Now the race is to commercial fusion: net-positive Q>10, sustained plasma, breedable tritium fuel cycle, and economically competitive electricity. Private fusion startups have raised $7B+ and several target demo plants by 2030. This is the highest-impact engineering challenge in human history.",
    category: "Energy",
    tags: ["Fusion", "Energy", "Plasma Physics", "Materials Science", "Decarbonization"],
    source: "DOE Fusion Energy Strategy",
    scope: "GLOBAL",
    regions: ["Global"],
    countriesAffected: ["United States", "China", "European Union", "United Kingdom", "Japan"],
    peopleAffected: "8 Billion",
    severity: 95,
    difficulty: 10,
    marketNeed: 99,
    globalDemand: 99,
    futureImportance: 100,
    innovationScore: 99,
    impactScore: 100,
    canEngineersSolve: true,
    engineerSolvableNote: "Most ambitious engineering project in history. Multi-decade, multi-billion-dollar. Needs thousands of engineers.",
    estimatedTimelineMonths: 180,
    difficultyLevel: "EXTREME",
    projectTypes: ["Startup", "Research", "Hardware", "National Lab"],
    solutions: [
      { title: "High-Temperature Superconductor Magnets", description: "REBCO HTS magnets enabling smaller, cheaper tokamaks (Commonwealth Fusion Systems approach)." },
      { title: "Tritium Breeding Blanket", description: "Lithium blanket that breeds tritium fuel from fusion neutrons, critical unsolved problem." },
      { title: "Plasma Disruption Mitigation", description: "AI-controlled massive gas injection system that prevents plasma disruptions in milliseconds." },
    ],
    skills: [
      { skill: "Plasma Physics", importance: 10 },
      { skill: "Superconductor Engineering", importance: 9 },
      { skill: "Materials Science (Radiation-Resistant)", importance: 10 },
      { skill: "Mechanical Engineering", importance: 8 },
      { skill: "Nuclear Engineering", importance: 9 },
      { skill: "Control Systems / AI", importance: 8 },
    ],
    teamTemplates: [
      { templateName: "Core Research Team", minMembers: 10, maxMembers: 30, estimatedTimelineMonths: 60, roles: ["Lead Physicist", "Magnets Engineer", "Materials Scientist", "Tritium Cycle Engineer", "Control Systems Engineer", "Radiation Engineer", "Mechanical Engineer", "Project Manager"] },
    ],
    roadmaps: [
      { phase: "Research", title: "Magnet & plasma validation", description: "Demonstrate HTS magnets at field strength, validate plasma stability.", duration: "24 months" },
      { phase: "Prototype", title: "Net-energy demo plant", description: "Q>1 sustained plasma, 30+ minutes.", duration: "36 months" },
      { phase: "MVP", title: "Pilot power plant (100 MW)", description: "Grid-connected, demonstrate tritium breeding.", duration: "60 months" },
      { phase: "Scale", title: "Commercial GW plants", description: "First commercial fusion power plant online.", duration: "120+ months" },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // WATER & SANITATION
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: "decentralized-water-purification",
    title: "Decentralized Water Purification for 2B Without Clean Water",
    summary:
      "2B people lack safely managed drinking water. Centralized treatment plants won't reach them. We need $20 household purifiers.",
    description:
      "2 billion people lack safely managed drinking water, and 3.6 billion lack safely managed sanitation. The traditional solution, centralized water treatment plants and piped infrastructure, costs $50,000+ per village and takes decades to build. Decentralized purification, devices that can be installed in a home, school, or village for under $50 and operate without electricity or chemicals, could leapfrog the entire problem. The technical challenges: long lifetime without maintenance, removing both pathogens and chemical contaminants, and verifying water quality cheaply.",
    category: "Water & Sanitation",
    tags: ["Water", "Purification", "Decentralized", "Hardware", "WASH"],
    source: "WHO/UNICEF Joint Monitoring Programme",
    scope: "GLOBAL",
    regions: ["Sub-Saharan Africa", "South Asia", "Southeast Asia"],
    countriesAffected: ["India", "Nigeria", "Ethiopia", "DRC", "Bangladesh"],
    peopleAffected: "2 Billion+",
    severity: 92,
    difficulty: 7,
    marketNeed: 90,
    globalDemand: 85,
    futureImportance: 92,
    innovationScore: 80,
    impactScore: 96,
    canEngineersSolve: true,
    engineerSolvableNote: "Hardware + manufacturing at scale. Tech is mature; the challenge is cost and distribution.",
    estimatedTimelineMonths: 18,
    difficultyLevel: "HARD",
    projectTypes: ["Startup", "Hardware", "NGO"],
    solutions: [
      { title: "Membrane Filter Cartridge", description: "Sub-$10 hollow-fiber ultrafilter cartridge that removes 99.99% of bacteria and viruses, lasts 2 years." },
      { title: "Solar UV Disinfection", description: "Passive solar UV system that purifies 50L/day with zero electricity." },
      { title: "Arsenic Removal Module", description: "Add-on module for regions with arsenic-contaminated groundwater (Bangladesh, West Bengal)." },
    ],
    skills: [
      { skill: "Mechanical Engineering", importance: 8 },
      { skill: "Membrane Science", importance: 8 },
      { skill: "Manufacturing Engineering", importance: 8 },
      { skill: "Water Quality Testing", importance: 7 },
      { skill: "Supply Chain / Distribution", importance: 8 },
    ],
    teamTemplates: [
      { templateName: "Full Team", minMembers: 5, maxMembers: 8, estimatedTimelineMonths: 18, roles: ["Mechanical Engineer", "Membrane Scientist", "Manufacturing Lead", "Field Operations", "Partnerships Lead"] },
    ],
    roadmaps: [
      { phase: "Research", title: "Water quality baseline", description: "Test 1,000 water sources across 3 countries.", duration: "3 months" },
      { phase: "Prototype", title: "V1 cartridge + UV system", description: "Manufacture 500 units, deploy with 200 households.", duration: "5 months" },
      { phase: "MVP", title: "50,000 unit pilot", description: "Prove 99.99% pathogen removal in real-world conditions.", duration: "6 months" },
      { phase: "Scale", title: "5M units, government contracts", description: "National WASH program integration.", duration: "18+ months" },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // TRANSPORTATION
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: "rural-last-mile-transport",
    title: "Rural Last-Mile Transport in Developing Nations",
    summary:
      "1B rural residents are cut off from markets, schools, and hospitals by lack of transport. Cheap EVs + digital mapping can fix this.",
    description:
      "Over 1 billion rural residents in developing countries lack reliable year-round access to markets, schools, and healthcare due to poor roads and no transport services. The economic cost is staggering: farmers can't sell produce, kids can't attend school, pregnant women can't reach clinics. Traditional solutions, paved roads and buses, cost $100k+/km. The opportunity: ultra-low-cost electric vehicles (3-wheelers, e-bikes) coupled with digital ride-sharing and route optimization for underserved rural corridors. The challenge is building vehicles that cost $1,000, last 10 years on dirt roads, and operate profitably at $0.10/km fare.",
    category: "Transportation",
    tags: ["EV", "Rural", "Mobility", "Last-Mile", "Developing Markets"],
    source: "World Bank Transport for Development",
    scope: "GLOBAL",
    regions: ["Sub-Saharan Africa", "South Asia", "Southeast Asia"],
    countriesAffected: ["India", "Kenya", "Nigeria", "Bangladesh", "Indonesia"],
    peopleAffected: "1 Billion+",
    severity: 78,
    difficulty: 7,
    marketNeed: 88,
    globalDemand: 75,
    futureImportance: 88,
    innovationScore: 78,
    impactScore: 90,
    canEngineersSolve: true,
    engineerSolvableNote: "Hardware + software + business model. Indian e-rickshaw market proves demand.",
    estimatedTimelineMonths: 18,
    difficultyLevel: "HARD",
    projectTypes: ["Startup", "Hardware", "Product"],
    solutions: [
      { title: "Ultra-Low-Cost EV Three-Wheeler", description: "Sub-$1,500 EV 3-wheeler with swappable batteries, 80km range, designed for dirt roads." },
      { title: "Rural Ride-Sharing App", description: "Offline-first app that matches riders with drivers along shared corridors, optimizes routes." },
      { title: "Solar Charging Station Network", description: "Off-grid solar charging stations every 30km on key rural corridors." },
    ],
    skills: [
      { skill: "Mechanical Engineering", importance: 9 },
      { skill: "Power Electronics / EV", importance: 8 },
      { skill: "Mobile Engineering", importance: 7 },
      { skill: "Operations Research / Routing", importance: 7 },
      { skill: "Solar / Off-Grid Power", importance: 7 },
    ],
    teamTemplates: [
      { templateName: "Full Team", minMembers: 5, maxMembers: 9, estimatedTimelineMonths: 18, roles: ["Mechanical Engineer", "EV Engineer", "Mobile Engineer", "Operations", "Field Lead"] },
    ],
    roadmaps: [
      { phase: "Research", title: "Corridor selection & demand study", description: "Pick 2 high-traffic rural corridors in 2 countries.", duration: "3 months" },
      { phase: "Prototype", title: "V1 vehicle + 5 charging stations", description: "Build 50 vehicles, deploy 5 stations, 1,000 riders.", duration: "6 months" },
      { phase: "MVP", title: "Commercial operations in 1 corridor", description: "100 vehicles, profitable per-ride economics.", duration: "6 months" },
      { phase: "Scale", title: "10 corridors, 10,000 vehicles", description: "National partnerships, fleet financing.", duration: "18+ months" },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // HOUSING
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: "3d-printed-affordable-housing",
    title: "3D-Printed Affordable Housing at $5,000/Home",
    summary:
      "1.6B people lack adequate housing. 3D-printed homes in 24h for $5k could be the answer.",
    description:
      "1.6 billion people lack adequate housing, and the global housing affordability crisis affects both developed and developing nations. Traditional construction is slow (3-6 months), labor-intensive, and expensive ($20k+ per home in developing countries). 3D printing with local materials, earth, geopolymer, recycled concrete, can produce a 50m² home in 24 hours for under $5,000 in materials. The technology is proven at demo scale; the engineering challenge is reliability, building code approval, and scaling to millions of homes.",
    category: "Housing",
    tags: ["3D Printing", "Construction", "Affordable Housing", "Hardware"],
    source: "UN-Habitat World Cities Report",
    scope: "GLOBAL",
    regions: ["Global"],
    countriesAffected: ["India", "Mexico", "United States", "Nigeria", "Indonesia"],
    peopleAffected: "1.6 Billion+",
    severity: 82,
    difficulty: 7,
    marketNeed: 92,
    globalDemand: 85,
    futureImportance: 90,
    innovationScore: 85,
    impactScore: 92,
    canEngineersSolve: true,
    engineerSolvableNote: "Robotics + materials science + regulatory. Demo projects prove feasibility.",
    estimatedTimelineMonths: 24,
    difficultyLevel: "HARD",
    projectTypes: ["Startup", "Hardware", "Product"],
    solutions: [
      { title: "Mobile 3D Printer", description: "Gantry-style printer that fits in a shipping container, sets up in 2 hours, prints 50m² home in 24h." },
      { title: "Local Material Geopolymer", description: "Use local soil + fly ash + alkali activator for $200/ton printing material vs. $5,000/ton concrete." },
      { title: "Building Code Compliance Toolkit", description: "Pre-engineered structural designs pre-approved for major building codes." },
    ],
    skills: [
      { skill: "Mechanical Engineering / Robotics", importance: 9 },
      { skill: "Materials Science", importance: 9 },
      { skill: "Civil / Structural Engineering", importance: 8 },
      { skill: "Software / G-code Generation", importance: 7 },
      { skill: "Manufacturing Engineering", importance: 7 },
    ],
    teamTemplates: [
      { templateName: "Full Team", minMembers: 6, maxMembers: 10, estimatedTimelineMonths: 24, roles: ["Mechanical Engineer", "Materials Scientist", "Structural Engineer", "Software Engineer", "Manufacturing Lead", "Regulatory Lead"] },
    ],
    roadmaps: [
      { phase: "Research", title: "Material & printer design", description: "Develop local material recipes, design gantry printer.", duration: "6 months" },
      { phase: "Prototype", title: "Print 5 demo homes", description: "Validate structural integrity, durability.", duration: "8 months" },
      { phase: "MVP", title: "Commercial pilot, 100 homes", description: "Work with government housing programs.", duration: "8 months" },
      { phase: "Scale", title: "1,000 homes/year production capacity", description: "Franchise model, national deployment.", duration: "24+ months" },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // MENTAL HEALTH
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: "ai-therapist-low-income",
    title: "AI Therapist for the 70% Without Mental Health Care",
    summary:
      "1 in 8 people have a mental health disorder. 70% get no treatment. There aren't enough therapists, AI can fill the gap.",
    description:
      "1 in 8 people globally live with a mental health disorder, but 70% receive no treatment. In low-income countries, the treatment gap exceeds 90%, there are simply no therapists. Even in wealthy countries, waitlists are months long and costs are $200+/session. Evidence-based AI therapy, grounded in CBT, DBT, and motivational interviewing, can deliver meaningful care at <1% of the cost. The technical challenge is clinical safety: AI must recognize crisis situations, avoid harmful responses, and know when to escalate to a human.",
    category: "Mental Health",
    tags: ["AI", "Mental Health", "Therapy", "CBT", "Digital Health"],
    source: "WHO World Mental Health Report",
    scope: "GLOBAL",
    regions: ["Global"],
    countriesAffected: ["United States", "India", "China", "United Kingdom", "Brazil"],
    peopleAffected: "1 Billion+",
    severity: 85,
    difficulty: 8,
    marketNeed: 95,
    globalDemand: 88,
    futureImportance: 95,
    innovationScore: 88,
    impactScore: 92,
    canEngineersSolve: true,
    engineerSolvableNote: "AI + clinical psychology + safety engineering. Regulatory path (FDA SaMD) is well-defined.",
    estimatedTimelineMonths: 24,
    difficultyLevel: "HARD",
    projectTypes: ["Startup", "Research", "Product"],
    solutions: [
      { title: "CBT Grounded AI Therapist", description: "LLM fine-tuned on evidence-based CBT protocols with strict safety guardrails for crisis detection." },
      { title: "Daily Mood & Behavior Tracking", description: "Passive sensing + active check-ins to detect deteriorating mental health early." },
      { title: "Human Therapist Escalation", description: "Seamless handoff to licensed therapists for high-risk cases, integrated into the same platform." },
    ],
    skills: [
      { skill: "NLP / LLM Training", importance: 9 },
      { skill: "Clinical Psychology", importance: 9 },
      { skill: "Safety Engineering / Red Teaming", importance: 10 },
      { skill: "Mobile Engineering", importance: 7 },
      { skill: "Regulatory / FDA SaMD", importance: 7 },
    ],
    teamTemplates: [
      { templateName: "Full Team", minMembers: 6, maxMembers: 10, estimatedTimelineMonths: 24, roles: ["ML Engineer", "Clinical Psychologist", "Safety Engineer", "Mobile Engineer", "Regulatory Lead", "Data Engineer"] },
    ],
    roadmaps: [
      { phase: "Research", title: "Clinical protocol & safety framework", description: "Define CBT protocols, crisis detection taxonomy, escalation rules.", duration: "4 months" },
      { phase: "Prototype", title: "V1 AI therapist", description: "Train model, run 500 user study, measure clinical outcomes.", duration: "8 months" },
      { phase: "MVP", title: "FDA SaMD submission", description: "Submit for FDA clearance as Software as Medical Device.", duration: "8 months" },
      { phase: "Scale", title: "Commercial launch, 100k users", description: "B2B2C via employers and health plans.", duration: "12+ months" },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // POVERTY
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: "digital-identity-1-billion",
    title: "Digital Identity for 1 Billion People Without ID",
    summary:
      "1B people have no ID, no bank account, no school, no healthcare. Self-sovereign digital ID changes everything.",
    description:
      "1 billion people worldwide lack official identification, no birth certificate, no national ID, nothing. Without ID, you can't open a bank account, enroll in school, claim government benefits, vote, or even prove your age. The World Bank estimates that providing ID to everyone would unlock $100B+ in economic value annually. The opportunity is self-sovereign digital identity: biometric-based, privacy-preserving, works offline, and puts the user in control of their data. India's Aadhaar covers 1.3B people but raises privacy concerns; the next generation must do better.",
    category: "Poverty",
    tags: ["Identity", "Digital ID", "Self-Sovereign", "Privacy", "Financial Inclusion"],
    source: "World Bank ID4D Initiative",
    scope: "GLOBAL",
    regions: ["Sub-Saharan Africa", "South Asia", "Southeast Asia"],
    countriesAffected: ["Nigeria", "Ethiopia", "Pakistan", "Bangladesh", "DRC"],
    peopleAffected: "1 Billion+",
    severity: 85,
    difficulty: 8,
    marketNeed: 90,
    globalDemand: 80,
    futureImportance: 92,
    innovationScore: 85,
    impactScore: 92,
    canEngineersSolve: true,
    engineerSolvableNote: "Cryptography + biometrics + policy. Tech exists; trust and adoption are harder.",
    estimatedTimelineMonths: 24,
    difficultyLevel: "HARD",
    projectTypes: ["Startup", "NGO", "Government"],
    solutions: [
      { title: "Self-Sovereign Identity Wallet", description: "Mobile app using W3C DID standard, zero-knowledge proofs, user-controlled data." },
      { title: "Offline Biometric Enrollment", description: "Tablet-based biometric enrollment (fingerprint, iris, face) that works fully offline." },
      { title: "Open Verifiable Credential Network", description: "Decentralized network where governments, NGOs, and businesses issue verifiable credentials." },
    ],
    skills: [
      { skill: "Cryptography (ZKP, BLS)", importance: 9 },
      { skill: "Mobile Engineering", importance: 8 },
      { skill: "Biometrics", importance: 7 },
      { skill: "Distributed Systems / Blockchain", importance: 7 },
      { skill: "Policy / Government Relations", importance: 8 },
    ],
    teamTemplates: [
      { templateName: "Full Team", minMembers: 5, maxMembers: 8, estimatedTimelineMonths: 24, roles: ["Cryptographer", "Mobile Engineer", "Biometrics Engineer", "Backend Engineer", "Policy Lead"] },
    ],
    roadmaps: [
      { phase: "Research", title: "Use case & country selection", description: "Pick 1 country, define top 5 use cases (healthcare, banking, education).", duration: "3 months" },
      { phase: "Prototype", title: "V1 wallet + enrollment app", description: "Deploy with 5,000 users across 1 country.", duration: "6 months" },
      { phase: "MVP", title: "100,000 users, 5 credential issuers", description: "Prove multi-issuer interoperability.", duration: "8 months" },
      { phase: "Scale", title: "Multi-country rollout", description: "National government adoption, 10M+ users.", duration: "18+ months" },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // HUNGER
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: "food-waste-cold-storage",
    title: "Smallholder Cold Storage to Cut 30% Food Waste",
    summary:
      "30% of food grown in developing nations rots before reaching market. $5k solar cold rooms change the math.",
    description:
      "30% of food grown in developing nations rots before reaching market, a loss of $310B annually and a major contributor to hunger. The lack of cold storage at the farm level means tomatoes, mangoes, leafy greens, and dairy spoil within days of harvest. Solar-powered cold rooms costing $5,000-10,000 can extend shelf life by 2-4 weeks, doubling farmer income and cutting waste. The challenge: low upfront cost, reliable operation off-grid, and financing models that work for smallholders.",
    category: "Hunger",
    tags: ["Cold Storage", "Solar", "Agriculture", "Food Security", "Hardware"],
    source: "FAO Food Waste Report",
    scope: "GLOBAL",
    regions: ["Sub-Saharan Africa", "South Asia", "Southeast Asia"],
    countriesAffected: ["India", "Nigeria", "Kenya", "Indonesia", "Bangladesh"],
    peopleAffected: "500 Million+",
    severity: 82,
    difficulty: 6,
    marketNeed: 88,
    globalDemand: 80,
    futureImportance: 88,
    innovationScore: 78,
    impactScore: 90,
    canEngineersSolve: true,
    engineerSolvableNote: "Mechanical engineering + business model. Tech is mature; the innovation is cost and distribution.",
    estimatedTimelineMonths: 18,
    difficultyLevel: "MEDIUM",
    projectTypes: ["Startup", "Hardware", "NGO"],
    solutions: [
      { title: "Solar Cold Room Kit", description: "5-ton capacity solar cold room in flat-pack kit form, $5,000, installable in 2 days." },
      { title: "Pay-As-You-Store Mobile App", description: "Farmers pay per crate per day via mobile money, no upfront cost." },
      { title: "Predictive Demand Matching", description: "App that matches stored produce to nearby buyers, reducing time-to-sale." },
    ],
    skills: [
      { skill: "Mechanical Engineering / Refrigeration", importance: 9 },
      { skill: "Solar / Off-Grid Power", importance: 8 },
      { skill: "Mobile Development", importance: 6 },
      { skill: "Manufacturing Engineering", importance: 7 },
      { skill: "Supply Chain", importance: 7 },
    ],
    teamTemplates: [
      { templateName: "Full Team", minMembers: 4, maxMembers: 7, estimatedTimelineMonths: 18, roles: ["Mechanical Engineer", "Solar Engineer", "Mobile Engineer", "Operations Lead", "Field Lead"] },
    ],
    roadmaps: [
      { phase: "Research", title: "Crop & market mapping", description: "Identify 3 high-value crops in 2 countries, map production-to-market flows.", duration: "2 months" },
      { phase: "Prototype", title: "V1 cold room + 5 pilot sites", description: "Deploy 5 units, measure impact on farmer income.", duration: "4 months" },
      { phase: "MVP", title: "500 cold rooms, 5,000 farmers", description: "Prove unit economics, mobile money integration.", duration: "6 months" },
      { phase: "Scale", title: "10,000 cold rooms, multi-country", description: "Government + agribusiness partnerships.", duration: "18+ months" },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // EQUALITY
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: "gender-pay-gap-audit-ai",
    title: "AI-Powered Gender Pay Gap Auditing",
    summary:
      "Women earn 77 cents on the dollar globally. Companies want to fix this but can't measure it. AI can.",
    description:
      "Globally, women earn 77 cents for every dollar men earn, a gap that closes by less than 1% per year at current rates. Companies increasingly want to address pay equity but lack the tools to audit themselves: the analysis is complex, requires controlling for role, experience, performance, and unconscious bias in promotion. The opportunity: AI-powered pay equity auditing that ingests HR data, controls for legitimate factors, surfaces unexplained gaps, and recommends specific remediation. The challenge is rigor (legal exposure), privacy, and trust.",
    category: "Equality",
    tags: ["AI", "Gender Equality", "HR Tech", "Bias", "Compliance"],
    source: "UN Women Gender Pay Gap Report",
    scope: "GLOBAL",
    regions: ["Global"],
    countriesAffected: ["United States", "European Union", "United Kingdom", "Canada", "Australia"],
    peopleAffected: "1 Billion+",
    severity: 70,
    difficulty: 5,
    marketNeed: 80,
    globalDemand: 75,
    futureImportance: 85,
    innovationScore: 75,
    impactScore: 82,
    canEngineersSolve: true,
    engineerSolvableNote: "ML + statistics + HR domain. Regulatory pressure (EU Pay Transparency Directive) creates demand.",
    estimatedTimelineMonths: 10,
    difficultyLevel: "MEDIUM",
    projectTypes: ["Startup", "Product"],
    solutions: [
      { title: "Pay Equity Audit Platform", description: "SaaS that ingests HR data, runs causal analysis on pay gaps, generates compliance reports." },
      { title: "Bias-Aware Promotion Tracker", description: "Tool that surfaces promotion-rate disparities across demographic groups." },
      { title: "EU Pay Transparency Compliance", description: "Automated compliance reporting for EU Pay Transparency Directive 2026 deadlines." },
    ],
    skills: [
      { skill: "Statistics / Causal Inference", importance: 9 },
      { skill: "ML", importance: 7 },
      { skill: "Backend Engineering", importance: 7 },
      { skill: "HR Domain Expertise", importance: 8 },
      { skill: "Privacy / Differential Privacy", importance: 7 },
    ],
    teamTemplates: [
      { templateName: "Lean Team", minMembers: 3, maxMembers: 5, estimatedTimelineMonths: 10, roles: ["ML/Stats Engineer", "Backend Engineer", "HR Domain Expert"] },
    ],
    roadmaps: [
      { phase: "Research", title: "Methodology & compliance framework", description: "Define statistical methodology, map EU/US compliance requirements.", duration: "2 months" },
      { phase: "Prototype", title: "V1 audit platform", description: "Deploy with 10 design partners, validate analysis.", duration: "3 months" },
      { phase: "MVP", title: "Commercial launch, 100 customers", description: "B2B SaaS, target mid-market companies.", duration: "4 months" },
      { phase: "Scale", title: "Enterprise contracts, 1,000 customers", description: "Expand globally, partner with HR consultancies.", duration: "12+ months" },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // DISASTER RESPONSE
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: "ai-disaster-damage-assessment",
    title: "AI Damage Assessment in 24 Hours After Disaster",
    summary:
      "After earthquakes and floods, aid takes days to reach the right places. AI satellite assessment in 24h saves lives.",
    description:
      "After major disasters, the first 72 hours are critical for saving lives. But damage assessment traditionally takes days, satellite imagery has to be manually analyzed, building-by-building. AI can compress this to hours: post-disaster satellite imagery is fed through CNN models that output damage heatmaps at building resolution, helping responders direct search-and-rescue to where it matters most. The challenge is model robustness across disaster types (earthquakes, floods, hurricanes, wildfires) and speed of deployment.",
    category: "Disaster Response",
    tags: ["AI", "Satellite", "Disaster Response", "Computer Vision", "Remote Sensing"],
    source: "UN OCHA Humanitarian Response",
    scope: "GLOBAL",
    regions: ["Global"],
    countriesAffected: ["Turkey", "Pakistan", "Japan", "Indonesia", "United States"],
    peopleAffected: "200 Million+",
    severity: 88,
    difficulty: 7,
    marketNeed: 82,
    globalDemand: 78,
    futureImportance: 92,
    innovationScore: 85,
    impactScore: 92,
    canEngineersSolve: true,
    engineerSolvableNote: "ML + remote sensing + humanitarian partnerships. Open data (Copernicus EMS) is available.",
    estimatedTimelineMonths: 14,
    difficultyLevel: "HARD",
    projectTypes: ["Startup", "NGO", "Open Source"],
    solutions: [
      { title: "Building-Level Damage CNN", description: "Model that takes pre/post satellite imagery and outputs damage classification per building." },
      { title: "Automated Disaster Trigger", description: "Pipeline that detects disasters (USGS, GDACS), automatically pulls satellite imagery, runs assessment." },
      { title: "Open Damage Map API", description: "Free API for humanitarian organizations to access damage assessments within 24h of event." },
    ],
    skills: [
      { skill: "Computer Vision / CNN", importance: 9 },
      { skill: "Remote Sensing / GIS", importance: 9 },
      { skill: "Cloud Infrastructure", importance: 7 },
      { skill: "Geospatial Data Processing", importance: 8 },
    ],
    teamTemplates: [
      { templateName: "Lean Team", minMembers: 3, maxMembers: 5, estimatedTimelineMonths: 14, roles: ["ML Engineer", "Geospatial Engineer", "Backend Engineer"] },
    ],
    roadmaps: [
      { phase: "Research", title: "Historical disaster dataset", description: "Compile 50+ disasters with pre/post imagery and ground truth.", duration: "3 months" },
      { phase: "Prototype", title: "V1 damage model", description: "Train baseline, validate on recent disasters (Turkey 2023, Morocco 2023).", duration: "4 months" },
      { phase: "MVP", title: "Live deployment with 3 humanitarian orgs", description: "Activate within 24h of next major disaster.", duration: "5 months" },
      { phase: "Scale", title: "Global coverage, 100+ orgs", description: "Integrate with UN OCHA, IFRC, national agencies.", duration: "12+ months" },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // OCEAN & MARINE
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: "ocean-plastic-cleanup-drones",
    title: "Autonomous Drones for Ocean Plastic Cleanup",
    summary:
      "11M tons of plastic enter the ocean yearly. River interceptors + autonomous cleanup drones can stop it.",
    description:
      "11 million tons of plastic enter the ocean every year, and that number is projected to triple by 2040. Once plastic reaches the open ocean, cleanup is nearly impossible. The most effective intervention point is at rivers, 80% of ocean plastic comes from 1,000 rivers. Autonomous solar-powered drones that intercept plastic in rivers before it reaches the ocean could solve this. The engineering challenges: autonomy in debris-heavy environments, sorting plastic from organic matter, and maintenance in remote locations.",
    category: "Ocean & Marine",
    tags: ["Robotics", "Drones", "Plastic Pollution", "Ocean", "Autonomous Systems"],
    source: "UNEP Marine Plastic Pollution Report",
    scope: "GLOBAL",
    regions: ["Global"],
    countriesAffected: ["Indonesia", "Philippines", "India", "China", "Brazil"],
    peopleAffected: "3 Billion+",
    severity: 75,
    difficulty: 7,
    marketNeed: 75,
    globalDemand: 80,
    futureImportance: 88,
    innovationScore: 85,
    impactScore: 85,
    canEngineersSolve: true,
    engineerSolvableNote: "Robotics + computer vision + marine engineering. The Ocean Cleanup proves the demand.",
    estimatedTimelineMonths: 18,
    difficultyLevel: "HARD",
    projectTypes: ["Startup", "Hardware", "NGO"],
    solutions: [
      { title: "Autonomous River Interceptor", description: "Solar-powered autonomous drone that patrols rivers, collects plastic, returns to base for emptying." },
      { title: "Plastic vs. Organic Classifier", description: "On-board CV model that distinguishes plastic from organic debris to avoid collecting fish and plants." },
      { title: "River Plastic Monitoring Network", description: "Sensor network that ranks rivers by plastic flux, prioritizing intervention." },
    ],
    skills: [
      { skill: "Robotics / Autonomous Systems", importance: 9 },
      { skill: "Computer Vision", importance: 8 },
      { skill: "Marine Engineering", importance: 8 },
      { skill: "Solar / Off-Grid Power", importance: 7 },
      { skill: "Mechanical Engineering", importance: 8 },
    ],
    teamTemplates: [
      { templateName: "Full Team", minMembers: 5, maxMembers: 8, estimatedTimelineMonths: 18, roles: ["Robotics Engineer", "CV Engineer", "Marine Engineer", "Mechanical Engineer", "Field Operations"] },
    ],
    roadmaps: [
      { phase: "Research", title: "River plastic flux mapping", description: "Survey 20 high-plastic rivers in 5 countries.", duration: "3 months" },
      { phase: "Prototype", title: "V1 interceptor drone", description: "Build 5 units, deploy in 2 rivers, validate collection rate.", duration: "6 months" },
      { phase: "MVP", title: "50 drones, 10 rivers", description: "Prove cost-effectiveness, partner with governments.", duration: "6 months" },
      { phase: "Scale", title: "1,000 drones, global deployment", description: "Standardize, franchise to local operators.", duration: "18+ months" },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // BIODIVERSITY
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: "ai-biodiversity-monitoring",
    title: "AI-Powered Biodiversity Monitoring at Planetary Scale",
    summary:
      "We're losing species faster than we can count them. AI + satellite + acoustics can track biodiversity globally.",
    description:
      "Earth is experiencing its sixth mass extinction, with species disappearing 100-1000x faster than background rates. But we can't protect what we can't measure, current biodiversity monitoring is manual, slow, and expensive. The opportunity: integrate satellite imagery (vegetation), acoustic sensors (bird/frog/insect calls), camera traps (mammals), and eDNA (water samples) into a unified AI-powered biodiversity monitoring platform that can track ecosystem health globally. The challenge is multi-modal data fusion and ground truth scarcity in exactly the biodiverse regions that need monitoring.",
    category: "Biodiversity",
    tags: ["AI", "Biodiversity", "Satellite", "Bioacoustics", "Conservation"],
    source: "IPBES Global Assessment Report",
    scope: "GLOBAL",
    regions: ["Global"],
    countriesAffected: ["Brazil", "Indonesia", "Madagascar", "DRC", "Colombia"],
    peopleAffected: "8 Billion",
    severity: 85,
    difficulty: 8,
    marketNeed: 75,
    globalDemand: 80,
    futureImportance: 95,
    innovationScore: 90,
    impactScore: 90,
    canEngineersSolve: true,
    engineerSolvableNote: "Multi-modal ML + conservation biology. Data is fragmented; consolidation is the win.",
    estimatedTimelineMonths: 18,
    difficultyLevel: "HARD",
    projectTypes: ["Startup", "Research", "NGO"],
    solutions: [
      { title: "Bioacoustic AI Network", description: "Cheap acoustic sensors + ML model that identifies 1,000+ species from calls, deployed across protected areas." },
      { title: "Satellite Biodiversity Index", description: "Daily-updated biodiversity index from Sentinel-2 imagery, calibrates against ground sensors." },
      { title: "eDNA Pipeline Platform", description: "Open-source platform for eDNA sample analysis, reducing cost from $500 to $50 per sample." },
    ],
    skills: [
      { skill: "ML / Multi-modal Fusion", importance: 9 },
      { skill: "Bioacoustics", importance: 8 },
      { skill: "Remote Sensing / GIS", importance: 8 },
      { skill: "Genomics / eDNA", importance: 7 },
      { skill: "Conservation Biology", importance: 8 },
    ],
    teamTemplates: [
      { templateName: "Full Team", minMembers: 5, maxMembers: 8, estimatedTimelineMonths: 18, roles: ["ML Engineer", "Bioacoustics Expert", "Geospatial Engineer", "Conservation Biologist", "Field Operations"] },
    ],
    roadmaps: [
      { phase: "Research", title: "Pilot ecosystem selection", description: "Pick 3 ecosystems (Amazon, Borneo, Madagascar), deploy 50 acoustic sensors each.", duration: "3 months" },
      { phase: "Prototype", title: "V1 bioacoustic model", description: "Train classifier on 500 species, validate in 3 sites.", duration: "5 months" },
      { phase: "MVP", title: "Live platform, 1,000 sensors", description: "Real-time biodiversity dashboard for conservation orgs.", duration: "6 months" },
      { phase: "Scale", title: "10,000 sensors, global coverage", description: "Partner with WWF, Conservation International, national parks.", duration: "18+ months" },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // WASTE MANAGEMENT
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: "ai-recycling-sorting",
    title: "AI Sorting to Make Recycling Actually Profitable",
    summary:
      "Recycling fails because sorting is too expensive. AI computer vision + robotic sorting changes the economics.",
    description:
      "Recycling is in crisis. China's 2018 ban on imported waste collapsed Western recycling markets, and contamination rates of 25%+ make most recycled material unsellable. The root cause: sorting is done by humans who are slow, expensive, and error-prone. AI-powered robotic sorting, computer vision identifies each item on the conveyor belt, robotic arms sort at 2x human speed with 95%+ accuracy, can make recycled material cheaper than virgin. The challenge is robustness across wildly variable waste streams and cost-competitiveness with landfill.",
    category: "Waste Management",
    tags: ["AI", "Robotics", "Recycling", "Computer Vision", "Circular Economy"],
    source: "World Bank What a Waste 2.0",
    scope: "GLOBAL",
    regions: ["Global"],
    countriesAffected: ["United States", "European Union", "China", "India", "Brazil"],
    peopleAffected: "5 Billion+",
    severity: 72,
    difficulty: 7,
    marketNeed: 85,
    globalDemand: 80,
    futureImportance: 90,
    innovationScore: 82,
    impactScore: 85,
    canEngineersSolve: true,
    engineerSolvableNote: "Robotics + CV + hardware. AMP Robotics and Glacier prove the model; market is far from saturated.",
    estimatedTimelineMonths: 14,
    difficultyLevel: "HARD",
    projectTypes: ["Startup", "Hardware", "Product"],
    solutions: [
      { title: "Waste Item Recognition Model", description: "Real-time CV model that identifies 500+ waste categories on conveyor belt at 60 fps." },
      { title: "Robotic Sorting Arm", description: "Cobot arm optimized for waste picking, 80 picks/minute, $30k unit cost." },
      { title: "Material Recovery Optimization", description: "Software that tunes sorting logic to maximize revenue based on real-time commodity prices." },
    ],
    skills: [
      { skill: "Computer Vision", importance: 9 },
      { skill: "Robotics / Control Systems", importance: 9 },
      { skill: "Mechanical Engineering", importance: 8 },
      { skill: "Edge ML / Real-time Inference", importance: 8 },
      { skill: "Manufacturing Engineering", importance: 7 },
    ],
    teamTemplates: [
      { templateName: "Full Team", minMembers: 5, maxMembers: 8, estimatedTimelineMonths: 14, roles: ["CV Engineer", "Robotics Engineer", "Mechanical Engineer", "Edge ML Engineer", "Manufacturing Lead"] },
    ],
    roadmaps: [
      { phase: "Research", title: "Waste stream characterization", description: "Visit 20 MRFs (Materials Recovery Facilities), catalog waste streams.", duration: "2 months" },
      { phase: "Prototype", title: "V1 sorting cell", description: "Build prototype with 1 arm + 1 camera, validate accuracy on real waste.", duration: "4 months" },
      { phase: "MVP", title: "First commercial deployment", description: "Install at 5 MRFs, prove ROI vs. human sorting.", duration: "5 months" },
      { phase: "Scale", title: "100+ MRFs, global channel", description: "Partner with Waste Management, Republic Services, Biffa.", duration: "12+ months" },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // SPACE
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: "space-debris-removal",
    title: "Active Removal of 30,000+ Tracked Space Debris Objects",
    summary:
      "Kessler Syndrome could make LEO unusable for centuries. Active debris removal is the only solution.",
    description:
      "Low Earth Orbit (LEO) is increasingly congested, with 30,000+ tracked debris objects and millions of untracked smaller pieces. The Kessler Syndrome, a cascading collision cascade, could render LEO unusable for centuries, killing the satellite industry that powers modern GPS, weather forecasting, and internet. Active Debris Removal (ADR), rendezvous with dead satellites and deorbit them, is technically feasible but commercially unproven. The first company to demonstrate reliable ADR at scale will define a new multi-billion-dollar industry and protect orbital infrastructure for humanity.",
    category: "Space",
    tags: ["Space", "Debris", "Satellite", "Robotics", "Orbital"],
    source: "ESA Space Debris Office",
    scope: "GLOBAL",
    regions: ["Global"],
    countriesAffected: ["United States", "European Union", "China", "Japan", "India"],
    peopleAffected: "8 Billion",
    severity: 78,
    difficulty: 10,
    marketNeed: 80,
    globalDemand: 90,
    futureImportance: 95,
    innovationScore: 92,
    impactScore: 88,
    canEngineersSolve: true,
    engineerSolvableNote: "Frontier aerospace. Requires rendezvous/proximity operations, robotics, and orbital mechanics expertise.",
    estimatedTimelineMonths: 60,
    difficultyLevel: "EXTREME",
    projectTypes: ["Startup", "Hardware", "Research"],
    solutions: [
      { title: "Autonomous Rendezvous Spacecraft", description: "Small spacecraft that autonomously rendezvous with debris, captures with robotic arm or net." },
      { title: "Magnetic Capture System", description: "Capture method using electromagnetic docking plates pre-installed on cooperative satellites." },
      { title: "Debris Tracking AI Network", description: "AI-enhanced tracking that predicts collision risk and prioritizes removal targets." },
    ],
    skills: [
      { skill: "Aerospace Engineering", importance: 10 },
      { skill: "Orbital Mechanics", importance: 10 },
      { skill: "Robotics / Space Robotics", importance: 9 },
      { skill: "Autonomous Systems", importance: 9 },
      { skill: "Propulsion Systems", importance: 8 },
    ],
    teamTemplates: [
      { templateName: "Core Team", minMembers: 10, maxMembers: 25, estimatedTimelineMonths: 60, roles: ["Mission Designer", "Propulsion Engineer", "Robotics Engineer", "Avionics Engineer", "Software Engineer", "Ground Operations", "Systems Engineer", "Program Manager"] },
    ],
    roadmaps: [
      { phase: "Research", title: "Mission architecture", description: "Define capture method, target debris, mission profile.", duration: "9 months" },
      { phase: "Prototype", title: "Ground demo of capture system", description: "Robotics lab demo, zero-g aircraft tests.", duration: "18 months" },
      { phase: "MVP", title: "In-orbit demonstration", description: "Launch demo mission, capture simulated debris.", duration: "24 months" },
      { phase: "Scale", title: "Commercial removal contracts", description: "First paid debris removal for ESA/NASA.", duration: "24+ months" },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // QUANTUM COMPUTING
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: "scalable-quantum-error-correction",
    title: "Scalable Quantum Error Correction for Useful Quantum Computers",
    summary:
      "Today's quantum computers have ~1,000 noisy qubits. Useful QC needs millions of error-corrected qubits. We need 1000x.",
    description:
      "Quantum computers could solve problems intractable for classical computers, drug discovery, materials science, cryptography, optimization. Today's devices have ~1,000 noisy physical qubits and can run for microseconds before decoherence. To run useful algorithms (Shor's, quantum chemistry), we need millions of error-corrected logical qubits, each requiring ~1,000 physical qubits. The challenge is scalable quantum error correction: surface codes, transversal gates, and real-time classical control at GHz speeds. This is the central bottleneck of the entire field.",
    category: "Quantum Computing",
    tags: ["Quantum Computing", "Error Correction", "Quantum Information", "Hardware"],
    source: "National Quantum Initiative / arXiv quantum-ph",
    scope: "GLOBAL",
    regions: ["Global"],
    countriesAffected: ["United States", "China", "European Union", "United Kingdom", "Japan"],
    peopleAffected: "8 Billion",
    severity: 70,
    difficulty: 10,
    marketNeed: 85,
    globalDemand: 80,
    futureImportance: 99,
    innovationScore: 98,
    impactScore: 92,
    canEngineersSolve: true,
    engineerSolvableNote: "Frontier physics + engineering. Requires deep quantum mechanics, control theory, and cryogenics.",
    estimatedTimelineMonths: 120,
    difficultyLevel: "EXTREME",
    projectTypes: ["Startup", "Research", "Hardware"],
    solutions: [
      { title: "Surface Code Architecture", description: "Implement surface code with logical qubit fidelity >99.99% at scale." },
      { title: "Real-Time Classical Control", description: "FPGA-based classical control system that decodes syndromes in <1μs." },
      { title: "Modular Quantum Networking", description: "Photonic interconnects between quantum processor modules, enabling scaling beyond single dilution refrigerator." },
    ],
    skills: [
      { skill: "Quantum Physics", importance: 10 },
      { skill: "Quantum Information Theory", importance: 10 },
      { skill: "FPGA / Real-time Systems", importance: 9 },
      { skill: "Cryogenic Engineering", importance: 8 },
      { skill: "Control Theory", importance: 8 },
    ],
    teamTemplates: [
      { templateName: "Research Team", minMembers: 8, maxMembers: 20, estimatedTimelineMonths: 60, roles: ["Principal Investigator", "Quantum Physicist", "Control Systems Engineer", "FPGA Engineer", "Cryogenics Engineer", "Quantum Software Engineer", "Theorist"] },
    ],
    roadmaps: [
      { phase: "Research", title: "Qubit fidelity improvements", description: "Push physical qubit fidelity from 99.9% to 99.99%+.", duration: "24 months" },
      { phase: "Prototype", title: "Single logical qubit demo", description: "Demonstrate distance-7 surface code with logical fidelity > physical.", duration: "24 months" },
      { phase: "MVP", title: "100 logical qubits", description: "Run first useful quantum chemistry algorithm.", duration: "36 months" },
      { phase: "Scale", title: "Million-qubit machine", description: "Commercially useful quantum computer for chemistry/cryptography.", duration: "60+ months" },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // ROBOTICS
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: "general-purpose-humanoid-robot",
    title: "General-Purpose Humanoid Robots for $20k",
    summary:
      "Humanoid robots that do real work, construction, care, manufacturing, for under $20k would transform labor.",
    description:
      "The labor market is fragmented: construction workers, caregivers, warehouse workers, and household helpers all do physical work that humans don't want to do or can't do enough of. A general-purpose humanoid robot priced at $20,000, the cost of a cheap car, could transform labor economics. Recent advances (Tesla Optimus, Figure, Agility Robotics) prove the hardware is feasible; the challenges are dexterous manipulation, generalizable AI for novel tasks, and manufacturing cost reduction. Whoever wins this race defines a multi-trillion-dollar industry.",
    category: "Robotics",
    tags: ["Humanoid", "Robotics", "AI", "Manufacturing", "Labor"],
    source: "WEF Future of Jobs Report",
    scope: "GLOBAL",
    regions: ["Global"],
    countriesAffected: ["United States", "China", "Japan", "Germany", "South Korea"],
    peopleAffected: "8 Billion",
    severity: 70,
    difficulty: 10,
    marketNeed: 95,
    globalDemand: 90,
    futureImportance: 99,
    innovationScore: 95,
    impactScore: 90,
    canEngineersSolve: true,
    engineerSolvableNote: "Frontier robotics + AI + manufacturing. 5-10 year horizon for $20k viable humanoids.",
    estimatedTimelineMonths: 60,
    difficultyLevel: "EXTREME",
    projectTypes: ["Startup", "Hardware", "Research"],
    solutions: [
      { title: "Dexterous Manipulation Hand", description: "20-DOF humanoid hand with tactile sensing, $2k unit cost, capable of in-hand object manipulation." },
      { title: "Imitation Learning Foundation Model", description: "VLA (vision-language-action) model trained on 1M+ hours of human task demonstrations." },
      { title: "Cost-Optimized Actuator Stack", description: "Custom brushless motors + harmonic gearboxes at 1/5th current cost via vertical integration." },
    ],
    skills: [
      { skill: "Mechanical Engineering", importance: 10 },
      { skill: "Robotics / Control Systems", importance: 10 },
      { skill: "ML / Reinforcement Learning", importance: 9 },
      { skill: "Computer Vision", importance: 8 },
      { skill: "Manufacturing Engineering", importance: 9 },
      { skill: "Embedded Systems", importance: 8 },
    ],
    teamTemplates: [
      { templateName: "Core Team", minMembers: 15, maxMembers: 50, estimatedTimelineMonths: 60, roles: ["CTO", "Mechanical Engineer", "Robotics Engineer", "ML Engineer", "CV Engineer", "Manufacturing Lead", "Embedded Engineer", "Program Manager"] },
    ],
    roadmaps: [
      { phase: "Research", title: "Hardware platform v0", description: "Build bipedal platform that walks reliably, 8h battery life.", duration: "18 months" },
      { phase: "Prototype", title: "Manipulation capability", description: "Add dexterous hands, train on 100 tasks via imitation learning.", duration: "18 months" },
      { phase: "MVP", title: "Pilot deployment", description: "Deploy 100 robots in 5 commercial pilots (warehouse, retail).", duration: "12 months" },
      { phase: "Scale", title: "Mass production at $20k", description: "1M+ units/year manufacturing, consumer launch.", duration: "24+ months" },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // BIOTECHNOLOGY
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: "ai-driven-drug-discovery",
    title: "AI-Driven Drug Discovery: 10x Faster, 10x Cheaper",
    summary:
      "Bringing a new drug to market costs $2.6B and takes 12 years. AI can compress this to $200M and 4 years.",
    description:
      "Drug discovery is broken: $2.6B average cost, 12-year timeline, 90% failure rate in clinical trials. The bottleneck is the search space, 10^60 possible molecules, which is impossible to explore experimentally. AI changes this: generative models design novel molecules, structure prediction (AlphaFold) replaces wet-lab crystallography, and active learning prioritizes which molecules to synthesize. AI-first pharma companies (Insilico, Recursion) are already advancing drugs in 4 years at 1/10th the cost. The opportunity is still wide open: every major disease class needs AI-driven pipelines.",
    category: "Biotechnology",
    tags: ["AI", "Drug Discovery", "Biotech", "Pharma", "Generative Models"],
    source: "DiMasi et al. / Pharma R&D Economics",
    scope: "GLOBAL",
    regions: ["Global"],
    countriesAffected: ["United States", "European Union", "China", "United Kingdom", "Switzerland"],
    peopleAffected: "8 Billion",
    severity: 82,
    difficulty: 9,
    marketNeed: 95,
    globalDemand: 92,
    futureImportance: 98,
    innovationScore: 92,
    impactScore: 95,
    canEngineersSolve: true,
    engineerSolvableNote: "ML + computational chemistry + biology. Requires deep cross-disciplinary team.",
    estimatedTimelineMonths: 36,
    difficultyLevel: "EXTREME",
    projectTypes: ["Startup", "Research"],
    solutions: [
      { title: "Generative Molecule Design", description: "Diffusion model that generates novel molecules optimized for target binding, ADME, and toxicity." },
      { title: "AlphaFold-Integrated Pipeline", description: "End-to-end pipeline from protein target → molecule design → synthesis planning → assay prediction." },
      { title: "Active Learning Wet-Lab Loop", description: "Robotic wet lab (Strateos-style) integrated with ML model, runs 24/7 experimental loop." },
    ],
    skills: [
      { skill: "ML / Generative Models", importance: 10 },
      { skill: "Computational Chemistry", importance: 9 },
      { skill: "Structural Biology", importance: 8 },
      { skill: "Cheminformatics / RDKit", importance: 8 },
      { skill: "Wet-Lab Automation", importance: 7 },
    ],
    teamTemplates: [
      { templateName: "Full Team", minMembers: 8, maxMembers: 15, estimatedTimelineMonths: 36, roles: ["ML Engineer", "Computational Chemist", "Structural Biologist", "Wet-Lab Lead", "Medicinal Chemist", "Clinical Lead", "Software Engineer"] },
    ],
    roadmaps: [
      { phase: "Research", title: "Target & pipeline selection", description: "Pick 2 disease targets, validate ML pipeline on retrospective data.", duration: "6 months" },
      { phase: "Prototype", title: "First novel molecule", description: "Generate, synthesize, and test novel molecule in vitro.", duration: "12 months" },
      { phase: "MVP", title: "Lead compound in animal model", description: "Demonstrate efficacy in vivo, file IND.", duration: "12 months" },
      { phase: "Scale", title: "Phase 2 clinical trials", description: "Multiple drug candidates in clinical trials.", duration: "24+ months" },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // MATERIALS SCIENCE
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: "ai-materials-discovery",
    title: "AI Materials Discovery: 10,000 New Materials in 5 Years",
    summary:
      "Materials science discovers ~100 new materials per year. AI can do 10,000+ per year. Batteries, superconductors, catalysts.",
    description:
      "Throughout history, new materials have driven civilizational progress: bronze, steel, silicon. Today, materials discovery is slow, ~100 new materials per year globally, mostly through trial-and-error. AI changes this: Google DeepMind's GNoME discovered 2.2M new crystal structures in 2023, 800,000 of which are stable. The opportunity is to build AI-driven materials discovery platforms that synthesize and characterize materials at industrial scale, unlocking better batteries, room-temperature superconductors, carbon capture catalysts, and room-temperature quantum devices.",
    category: "Materials Science",
    tags: ["AI", "Materials Science", "Discovery", "Energy", "Catalysis"],
    source: "DeepMind GNoME paper / Nature",
    scope: "GLOBAL",
    regions: ["Global"],
    countriesAffected: ["United States", "China", "European Union", "Japan", "South Korea"],
    peopleAffected: "8 Billion",
    severity: 78,
    difficulty: 9,
    marketNeed: 88,
    globalDemand: 85,
    futureImportance: 98,
    innovationScore: 95,
    impactScore: 92,
    canEngineersSolve: true,
    engineerSolvableNote: "ML + materials science + high-throughput experimentation. Multi-year horizon.",
    estimatedTimelineMonths: 48,
    difficultyLevel: "EXTREME",
    projectTypes: ["Startup", "Research"],
    solutions: [
      { title: "Generative Crystal Structure Model", description: "Diffusion model that generates novel crystal structures stable at room temperature." },
      { title: "Autonomous Synthesis Lab", description: "Robotic wet-lab that synthesizes and characterizes 100 materials/day with no human intervention." },
      { title: "Materials Property Database", description: "Open database of 10M+ computed materials properties, queried via natural language." },
    ],
    skills: [
      { skill: "ML / Generative Models", importance: 10 },
      { skill: "Materials Science", importance: 10 },
      { skill: "Density Functional Theory (DFT)", importance: 8 },
      { skill: "Wet-Lab Automation", importance: 8 },
      { skill: "Crystallography", importance: 7 },
    ],
    teamTemplates: [
      { templateName: "Full Team", minMembers: 8, maxMembers: 15, estimatedTimelineMonths: 48, roles: ["ML Engineer", "Materials Scientist", "DFT Specialist", "Wet-Lab Lead", "Crystallographer", "Software Engineer", "Program Manager"] },
    ],
    roadmaps: [
      { phase: "Research", title: "Application vertical", description: "Pick 1 vertical (battery materials, catalysts, superconductors).", duration: "6 months" },
      { phase: "Prototype", title: "AI discovery + synthesis", description: "Discover 100 novel materials, synthesize 10 in lab.", duration: "12 months" },
      { phase: "MVP", title: "First commercial material licensed", description: "License a novel material to a commercial partner.", duration: "12 months" },
      { phase: "Scale", title: "10,000+ materials, multi-vertical", description: "Multiple commercialized materials, broad IP portfolio.", duration: "24+ months" },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // URBAN PLANNING
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: "15-minute-city-planning-ai",
    title: "AI Tools for 15-Minute City Planning",
    summary:
      "68% of us will live in cities by 2050. AI urban planning tools can make cities walkable, livable, and low-carbon.",
    description:
      "By 2050, 68% of humanity will live in cities, 6.7 billion people. Most cities are car-dependent, sprawling, and environmentally destructive. The 15-minute city concept, where everything you need (work, school, healthcare, groceries) is within a 15-minute walk or bike, could cut emissions, improve health, and reduce inequality. But implementing it requires complex trade-offs: zoning changes, transit routing, density planning, economic modeling. AI tools that simulate urban interventions and predict their multi-dimensional impact could empower city planners to make data-driven decisions.",
    category: "Urban Planning",
    tags: ["AI", "Urban Planning", "Cities", "Sustainability", "Mobility"],
    source: "UN World Urbanization Prospects",
    scope: "GLOBAL",
    regions: ["Global"],
    countriesAffected: ["United States", "China", "India", "European Union", "Brazil"],
    peopleAffected: "4 Billion+",
    severity: 75,
    difficulty: 7,
    marketNeed: 75,
    globalDemand: 85,
    futureImportance: 92,
    innovationScore: 85,
    impactScore: 88,
    canEngineersSolve: true,
    engineerSolvableNote: "ML + GIS + urban planning domain. Requires deep partnerships with city governments.",
    estimatedTimelineMonths: 18,
    difficultyLevel: "HARD",
    projectTypes: ["Startup", "Product", "Government"],
    solutions: [
      { title: "Urban Intervention Simulator", description: "Simulator that predicts impact of zoning changes, transit lines, density on 50+ urban metrics." },
      { title: "15-Minute Accessibility Mapper", description: "Tool that computes 15-minute accessibility for every block in a city, identifies gaps." },
      { title: "Participatory Planning Platform", description: "Platform where citizens propose and vote on urban interventions, with AI impact estimates." },
    ],
    skills: [
      { skill: "ML / Simulation", importance: 8 },
      { skill: "GIS / Geospatial", importance: 9 },
      { skill: "Urban Planning Domain", importance: 9 },
      { skill: "Frontend Visualization", importance: 7 },
      { skill: "Backend Engineering", importance: 7 },
    ],
    teamTemplates: [
      { templateName: "Full Team", minMembers: 5, maxMembers: 8, estimatedTimelineMonths: 18, roles: ["ML Engineer", "GIS Engineer", "Urban Planner", "Frontend Engineer", "Backend Engineer"] },
    ],
    roadmaps: [
      { phase: "Research", title: "Pilot city partnership", description: "Sign MOU with 1 mid-size city, access to data.", duration: "3 months" },
      { phase: "Prototype", title: "V1 accessibility mapper", description: "Deploy for 1 city, validate against ground truth.", duration: "5 months" },
      { phase: "MVP", title: "Commercial pilot with 5 cities", description: "Real interventions simulated, real decisions made.", duration: "6 months" },
      { phase: "Scale", title: "100+ cities, open platform", description: "Standard platform for cities worldwide.", duration: "18+ months" },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // FINANCIAL INCLUSION
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: "credit-scoring-unbanked",
    title: "Alternative Credit Scoring for 1.7B Unbanked",
    summary:
      "1.7B adults have no bank account and no credit score. Mobile data + AI can unlock credit for billions.",
    description:
      "1.7 billion adults remain unbanked, they have no bank account, no credit history, and no access to loans beyond loan sharks. Traditional credit scoring (FICO) requires decades of banking data, locking the unbanked out of the formal economy. But mobile phones generate rich behavioral data: call patterns, mobile money transactions, app usage. AI models trained on this alternative data can accurately predict creditworthiness, unlocking microloans, mortgages, and business financing for billions. The challenge is fairness, regulatory approval, and avoiding predatory lending.",
    category: "Financial Inclusion",
    tags: ["Fintech", "AI", "Credit Scoring", "Mobile", "Developing Markets"],
    source: "World Bank Global Findex Database",
    scope: "GLOBAL",
    regions: ["Sub-Saharan Africa", "South Asia", "Latin America"],
    countriesAffected: ["India", "Nigeria", "Kenya", "Indonesia", "Brazil"],
    peopleAffected: "1.7 Billion+",
    severity: 78,
    difficulty: 7,
    marketNeed: 90,
    globalDemand: 85,
    futureImportance: 92,
    innovationScore: 82,
    impactScore: 92,
    canEngineersSolve: true,
    engineerSolvableNote: "ML + fintech + regulatory. Mobile money infrastructure (M-Pesa, UPI) is mature.",
    estimatedTimelineMonths: 18,
    difficultyLevel: "HARD",
    projectTypes: ["Startup", "Product"],
    solutions: [
      { title: "Mobile Behavior Credit Model", description: "ML model trained on mobile data (with consent) predicting repayment probability for unbanked users." },
      { title: "Microloan Marketplace", description: "Marketplace connecting AI-scored borrowers with microfinance lenders." },
      { title: "Financial Health App", description: "App that helps users build credit, save, and access financial education." },
    ],
    skills: [
      { skill: "ML / Risk Modeling", importance: 9 },
      { skill: "Mobile Engineering", importance: 7 },
      { skill: "Fintech / Payments", importance: 8 },
      { skill: "Regulatory / Compliance", importance: 8 },
      { skill: "Backend Engineering", importance: 7 },
    ],
    teamTemplates: [
      { templateName: "Full Team", minMembers: 5, maxMembers: 8, estimatedTimelineMonths: 18, roles: ["ML Engineer", "Mobile Engineer", "Fintech Lead", "Regulatory Lead", "Backend Engineer"] },
    ],
    roadmaps: [
      { phase: "Research", title: "Country & partner selection", description: "Pick 1 country, partner with telecom for data access.", duration: "3 months" },
      { phase: "Prototype", title: "V1 credit model", description: "Train model, validate on retrospective loan data.", duration: "5 months" },
      { phase: "MVP", title: "10,000 microloans deployed", description: "Prove repayment rate, regulatory approval.", duration: "6 months" },
      { phase: "Scale", title: "Multi-country, $1B loan book", description: "Expand across 5+ countries, partner with banks.", duration: "18+ months" },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // ACCESSIBILITY
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: "real-time-sign-language-translation",
    title: "Real-Time Sign Language Translation for 70M Deaf People",
    summary:
      "70M people use sign language as their first language. Real-time translation to/from spoken language changes everything.",
    description:
      "70 million deaf people worldwide use sign language as their primary language, but the hearing world doesn't speak it. Communication with hearing people requires slow, error-prone human interpreters, who cost $50-100/hour and aren't available on demand. Real-time sign language translation, bidirectional, on a phone, supporting multiple sign languages, would transform deaf people's access to education, employment, healthcare, and daily life. The technical challenge is enormous: sign language has its own grammar, uses 3D space, and varies by country (ASL, BSL, ISL, JSL, etc.).",
    category: "Accessibility",
    tags: ["Accessibility", "Sign Language", "Computer Vision", "Deaf", "Translation"],
    source: "World Federation of the Deaf",
    scope: "GLOBAL",
    regions: ["Global"],
    countriesAffected: ["United States", "India", "China", "Brazil", "European Union"],
    peopleAffected: "70 Million+",
    severity: 75,
    difficulty: 8,
    marketNeed: 82,
    globalDemand: 75,
    futureImportance: 92,
    innovationScore: 88,
    impactScore: 88,
    canEngineersSolve: true,
    engineerSolvableNote: "Computer vision + NLP + deep domain expertise. Data scarcity is the main barrier.",
    estimatedTimelineMonths: 24,
    difficultyLevel: "HARD",
    projectTypes: ["Startup", "Research", "Open Source"],
    solutions: [
      { title: "Sign-to-Speech Mobile App", description: "Phone camera captures signing, translates to spoken language in real-time (<1s latency)." },
      { title: "Speech-to-Sign Avatar", description: "Realistic 3D avatar that signs spoken language, supporting multiple sign languages." },
      { title: "Sign Language Dataset Platform", description: "Platform for deaf communities to contribute sign language data, with fair compensation." },
    ],
    skills: [
      { skill: "Computer Vision / 3D Pose", importance: 10 },
      { skill: "NLP / Translation Models", importance: 8 },
      { skill: "Mobile Engineering", importance: 8 },
      { skill: "3D Animation / Avatars", importance: 7 },
      { skill: "Deaf Community Engagement", importance: 9 },
    ],
    teamTemplates: [
      { templateName: "Full Team", minMembers: 5, maxMembers: 8, estimatedTimelineMonths: 24, roles: ["CV Engineer", "NLP Engineer", "Mobile Engineer", "3D Animator", "Deaf Community Lead"] },
    ],
    roadmaps: [
      { phase: "Research", title: "Sign language scope", description: "Pick 1 sign language (ASL), build dataset with deaf community.", duration: "4 months" },
      { phase: "Prototype", title: "V1 sign-to-text", description: "Real-time ASL recognition at 80%+ accuracy on 1,000 signs.", duration: "8 months" },
      { phase: "MVP", title: "Commercial launch (sign-to-speech)", description: "Launch mobile app, free tier for deaf users.", duration: "8 months" },
      { phase: "Scale", title: "Multi-language, enterprise tier", description: "Expand to 5+ sign languages, enterprise B2B.", duration: "18+ months" },
    ],
  },
];
