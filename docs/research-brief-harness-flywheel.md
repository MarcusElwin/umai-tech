# Research Brief: The Moat Is the Harness, Not the Model

**Compiled**: March 2026
**Author**: Marcus Elwin
**Topic**: Agentic harnesses and data flywheels as durable competitive advantages in AI

---

## 1. Model Commoditization Evidence

### Source: Epoch AI — AI Price Performance Trends
- Price to achieve GPT-4-level performance falls **~40x per year**; some benchmarks show **900x/year** decline
- GPT-4 output token pricing dropped **>90%** since March 2023
- Open-source models deliver **~90% of proprietary capability at ~17x lower cost**
- Quality gap: shrank from **15–20 points to 9 points** (Oct 2024 → mid-2025), parity projected Q2 2026

### Source: Enterprise Adoption Data
- **37% of enterprises** use 5+ models in production
- **69%** using Google models also use OpenAI simultaneously
- Enterprise model API spending: **$3.5B → $8.4B** (late 2024 → mid-2025), even as per-token prices collapsed

### Key Quotes — Industry Leaders
- **Sam Altman (OpenAI)**: *"We will maintain less of a lead than we did in previous years."*
- **Satya Nadella (Microsoft)**: *"AI is turning into a commodity we just can't get enough of."*
- **Nandan Nilekani (Infosys)**: *"The models will become more commoditized and the value will switch to the application layer."*
- **Jared Spataro (Microsoft)**: *"As powerful CPUs became commodities, the value shifted to the overall system."*

### Source: DeepSeek R1
- Matched OpenAI o1 reasoning performance
- Training cost: **~$5.6M** vs $100M+ for comparable proprietary models

---

## 2. Compound AI Systems Thesis

### Source: Berkeley BAIR Lab (Matei Zaharia et al., Feb 2024)
- **Core argument**: State-of-the-art AI results are increasingly from compound systems with multiple components, not monolithic models
- **Four reasons systems beat models**:
  1. Some tasks improve more through system design than scaling
  2. Systems can be dynamic; models have static training data
  3. Systems offer better control and trust
  4. Performance goals vary widely across applications

### Source: Andrej Karpathy — LLM as OS Kernel
- LLM = kernel in a larger operating system
- Peripheral layers: tool access, memory, I/O across modalities, code execution
- These peripheral layers create the actual product

### Source: NGP Capital
- *"The deeper your evals, the deeper your moat"*
- *"EvalOps is no longer a cost center, it's the differentiator"*

### Source: Y Combinator (Garry Tan)
- *"Evals are emerging as the real moat for AI startups"*

### Source: Tidemark Capital
- *"The model is replaceable. Your orchestration layer isn't."*

### Source: Google VP Darren Mowry
- *"The industry doesn't have a lot of patience anymore if you're really just counting on the back-end model."*

---

## 3. Agentic Harness Architecture

### Definition
The comprehensive system infrastructure surrounding an AI model in production:
- **Tool integration** — browsers, terminals, APIs, file systems
- **Context & state management** — memory, session persistence
- **Evaluation frameworks** — continuous output verification
- **Observability pipelines** — hallucination/drift monitoring
- **Security guardrails** — deterministic validation of probabilistic outputs

### Key Architectural Insight
Decoupling of probabilistic reasoning from deterministic execution:
- LLM ("Cognitive Engine") drafts probabilistic plan
- "Reasoning Orchestrator" validates against business rules, access controls, compliance
- Distinction between **scaffolding** (pre-prompt construction) and **harness** (runtime orchestration)

### Source: Randall Hunt — Cognitive Debt
- *"If you don't engineer the harness, you don't get compounding leverage; you get compounding cognitive debt."*
- Cognitive debt = AI-era successor to technical debt
- Manifests as: context loss, uncontrolled tool usage, unreliable agent behavior
- Also manifests in human capital: junior employee deskilling

---

## 4. Data Flywheel Mechanics

### Core Loop
More Usage → More Proprietary Data → Better Fine-tuning/Retrieval/Guardrails → Better Product → Higher Retention → More Usage

### Building Blocks
- **Human-in-the-loop (HITL)** workflows — gold-standard data no scraper can replicate
- **Workflow integration** — AI embedded in EHR/CRM/checkout flow owns the context
- **Low-latency feedback** — faster learning = faster competitive separation
- **Proprietary data generation** — data that can only exist through your product

### TCO Reduction Through Flywheel
- Organizations start with expensive 70B+ parameter models
- Collect successful interactions → curate ground-truth dataset
- Fine-tune smaller models (1B–8B parameters)
- **A customized 1B model on proprietary data achieves ~96% accuracy of a 70B model** on the same task

### Modern Data Moat
- Static data moats are vulnerable (LLMs can generate synthetic approximations)
- True defensibility = owning the software interfaces where data is **naturally and continuously generated**
- After 12–24 months of compounding, the gap often becomes uncrossable

---

## 5. Case Studies

### Bloomberg
- Invested **~$10M** in BloombergGPT (50B params, 369B tokens of proprietary financial data)
- **GPT-4 outperformed it** on most financial tasks
- Yet Bloomberg Terminal remains unassailable: **$25K–$30K/user/year, 350K+ subscribers**
- Moat = decades of curated data, 90+ proprietary models, deep workflow integration
- LLM is a retention feature inside the harness, not the product itself

### Stripe
- **$1.4 trillion** in payment volume (2024) — 1.3% of global GDP
- **92% probability** of having previously seen any given card on the network
- May 2025: launched world's first payments foundation model (tens of billions of transactions)
- Card-testing attack detection: **59% → 97%** (64% improvement)
- Stripe Radar: blocked **20.9M fraudulent transactions ($917M)** during BFCM 2024
- Adaptive Acceptance: recovered **$6B in false declines** in 2024
- Launched Shared Payment Tokens (SPTs) for agentic commerce

### Fin-R1 (Research)
- Specialized 7B parameter model for financial reasoning
- Scored **85.0 ConvFinQA, 76.0 FinQA** — surpassing much larger general-purpose models
- Training: domain-specific data, hand-crafted reasoning chains, tight feedback loop

### NVIDIA
- Building Data Flywheel Blueprint for financial workflows
- Orchestrator coordinating fine-tuning, distillation, and evaluation in continuous loop

### Two Sigma (2026 Outlook)
- *"The next year won't be about LLMs making trades. It will be about AI becoming the operating system for how quant research and investing actually work."*

---

## 6. Retail & Agentic Commerce

### Market Size
- McKinsey: agentic commerce = **$3–5 trillion global value by 2030**

### Shopify
- **$1.1 trillion GMV**, **>12% of US e-commerce**
- **SimGym**: AI shopper personas from billions of transactions
- **Shopify Catalog**: billions of products with AI-inferred categories
- Quote: *"We are uniquely set up to do this because we've seen billions of product configurations over the years."*

### Amazon
- Recommendation engine: **35% of total sales (~$70B annually)**
- Amazon Rufus: **300M+ users** (2025), interactions up **210% YoY**
- Rufus users **60% more likely to complete purchase** → projected **$12B incremental annualized sales**

### Klarna + Stripe SPTs
- Klarna Agentic Product Protocol: **100M+ items, 400M prices, 12 markets**
- Every agent query generates signals → feeds back into recommendations, pricing, fraud detection

---

## 7. Platform Giants Entering Verticals

### Anthropic
- Claude for Financial Services (July 2025) — first industry-specific product
- Integrations: Snowflake, S&P Global, Morningstar, FactSet
- Clients: Bridgewater, NBIM (Norway sovereign wealth fund)
- NBIM: **~20% productivity gains = 213,000 hours**
- AIG: underwriting review **5x faster**, accuracy **75% → 90%+**
- Claude Cowork (Jan 2026): wiped **20–33%** off ServiceNow, Salesforce, Snowflake, Intuit, Thomson Reuters stocks

### OpenAI
- ChatGPT for Excel + financial data integrations (early 2026)
- Partners: FactSet, Dow Jones Factiva, LSEG, S&P Global, Moody's, MSCI
- Healthcare: ChatGPT Health (consumer) + HIPAA enterprise suite

### Others
- Google: Gemini Enterprise
- AWS: Bedrock AgentCore
- Microsoft: Agent 365, Foundry

---

## 8. Vertical SaaS Resilience

### VC Investment Data (2025)
- Vertical startups: **53% of deal volume**, **30% of capital** (4,395 financings, $186B total)
- Excluding 12 mega-rounds (OpenAI, Anthropic etc.): verticals = **51% of total capital**
- 2026: AI-native vertical SaaS seeing **65% increase** in capital flow

### Why Verticals Survive
1. **Domain-specific data** — general AI can't replicate specialized workflow data
2. **Workflow integration** — deep embedding creates structural lock-in (ripping out = ripping out the workflow)
3. **Embedded fintech** — platforms like Toast, ServiceTitan process payments, payroll, banking (LLMs can't settle payments)
4. **Pricing power** — vertical AI legal tool: **300% higher pricing, <3% churn** vs 15% churn for general AI

### Historical Parallel
- Despite AWS/Salesforce/Azure dominating horizontal cloud, vertical SaaS produced: Veeva (~$37B peak), Toast, Procore, ServiceTitan
- **Top 20 public vertical SaaS: ~$300B combined market cap**
- CrowdStrike CEO George Kurtz: *"As cloud was maturing, I heard a lot about the hyperscalers actually providing all the security services. Well, that didn't happen."*

---

## 9. Emerging Frontiers

### Verticals to Watch
- **Logistics/Manufacturing**: autonomous routing, defect detection, predictive maintenance
- **Real Estate**: automated property management, lease negotiations
- **Healthcare**: AI-driven diagnostics, compliance automation

### Technical Bottlenecks
- Long-context memory management
- Multi-agent coordination at scale
- Robust human oversight in regulated industries

### Regulatory Tailwinds
- AML fines increased **417% in H1 2025**
- Regulatory complexity favors data-rich incumbents
- GDPR-like regulations raise bar for new entrants

---

## 10. Strategic Framework

### Five Principles for Durable AI Advantage
1. **Own the workflow, not the output** — embed where switching costs are prohibitive
2. **Build the harness first** — orchestration, guardrails, memory, observability, tool integration; model-agnostic
3. **Spin the flywheel from day one** — every interaction = proprietary data; HITL, edge cases, eval loops
4. **Compete on integration, not intelligence** — let model labs race on benchmarks; your advantage is domain depth
5. **Price for outcomes, not seats** — value is in the labor line of P&L being replaced
