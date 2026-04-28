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
- Matched OpenAI o1 reasoning performance (97.3% vs 96.4% on MATH-500)
- Training cost: **~$5.6M** on 2,000 H800 chips vs $100M+ for comparable proprietary models
- API pricing **95% cheaper**: $0.55–$2.19 vs $15–$60 per million tokens

### Source: Reasoning Model Commoditization
- o3-mini (Feb 2025): democratized "PhD-level reasoning" at **~15x cheaper than o1**
- Reasoning capability itself is now commodity, not just inference cost
- Pattern: general inference commoditized → reasoning commoditized → value migrates further up the stack

### Source: Gartner — Forward Projection (March 2025)
- Predicts **90% cost reduction by 2030** for inference on 1T-parameter models
- Warns against confusing commodity inference cost with frontier reasoning capability scarcity

### Source: Menlo Ventures — API Market Share Shift (Mid-2025)
- Anthropic now leads with **32% of enterprise API spend** (up from minority)
- OpenAI fell from **50% to 25%** — market fragmentation accelerating
- Reinforces multi-model thesis: no single provider dominates

### Source: Enterprise Deployment Inflection (2026)
- Gartner: **72% of enterprises** moved from AI trials to production deployment
- Projected: **40%** will have task-specific AI agents by end of 2026 (vs <5% in 2025)

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

### Source: TRAE — "The Definitive Guide to Harness Engineering" (April 23, 2026)
**Context**: Mitchell Hashimoto (HashiCorp co-founder) introduced the term; gained widespread traction after pivotal OpenAI report. 42.2K followers, San Francisco-based AI engineer.

**Core Definition & Metaphor**:
- **"Horse and Reins"**: AI Agent = SOTA Model (Wild Horse) + Harness (Control System) = Elite Performer
- *"The Harness is essentially every piece of infrastructure other than the LLM that enables an agent to actually deliver results."*
- Not about "better prompts" or "more capable models" — it's about optimizing the environment and mechanisms the model operates within
- Core problem solved: *"Now that AI has joined your workflow, how do we actually manage this 'super intern'?"*

**Paradigm Shift: From Executor to Architect**
- Traditional role: laborers laying bricks line-by-line
- New role: architects drafting blueprints, defining rules, signing off on final output ("Spec Coding")
- *"When a model hits a wall, we implement an engineered mechanism to ensure that the same class of failure never happens again."*
- Living system: as models iterate, capabilities are internalized; as new scenarios emerge, new harness innovations birth

**The PPAF Cycle** (Perception, Planning, Action, Feedback/Reflection):
Production-ready agents operate on continuous four-stage loop:
1. **Perception**: Observing current world state, user inputs, tool outputs, interaction history
2. **Planning**: Using perception to update goals, decompose tasks, decide next move
3. **Action**: Executing operations (internal memory updates or external tool calls)
4. **Feedback/Reflection**: Results feed back into next observation

**The R.E.S.T Framework** (Four Production Pillars):

1. **Reliability**
   - Fault Recovery: automatically resume from checkpoints after task interruption
   - Operation Idempotency: critical write operations can be safely retried without corrupting state
   - Behavioral Consistency: predictable behavior under same inputs

2. **Efficiency**
   - Resource Control: precise budget management for tokens, API calls, compute time
   - Low-Latency Response: meaningful feedback quickly in interactive scenarios
   - High Throughput: process more tasks per unit time in batch scenarios

3. **Security**
   - Least Privilege: grant only minimum permissions necessary for specific sub-task
   - Sandboxed Execution: execute all untrusted code in strictly isolated sandbox environment
   - I/O Filtering: prevent prompt injection, sensitive data leaks, harmful content generation

4. **Traceability**
   - End-to-End Tracing: clear, traceable call chain from initial request to final result
   - Explainable Decisions: every critical decision has clear attribution record
   - Auditable State: complete system state at any point in history can be queried and audited

**Core Architectural Insight: REPL Container**
- Harness = REPL (Read-Eval-Print Loop) container with boundary controls, tool routing, deterministic feedback
- Deterministic shell wrapping non-deterministic LLM "brain"
- **Read**: Context Manager translates external world + internal memory into structured prompts
- **Eval**: Call Interceptor catches LLM intent, routes to appropriate tool executor (monitored for timeouts, quotas, errors)
- **Print**: Feedback Assembler captures output, repackages as structured "observation," re-injects into context
- **Loop**: Repeats until goal achieved or termination condition triggered

**The Token Transformation Challenge: Infinite State → Finite Tokens**
- Central challenge: bidirectional mapping between "infinite" external state and "finite" token context
- **Context Management**: Reduction Rules determine what to prioritize/prune when token budget tight
- **Injection Boundary**: dictates where external data (RAG results) inserted to maximize performance, avoid "Lost in the Middle"
- **Token Pipeline**: Collection → Ranking → Compression → Budgeting → Assembly
  - Ranking: score by recency + semantic relevance
  - Compression: summarize high-volume, low-density content
  - Assembly: structured templates ([user_request], [tool_output] blocks)

**Function Calling Lifecycle** (Bridge from LLM Planning → Physical Execution):
1. Schema Serialization: tools + parameters (JSON Schema) → text format injected into prompt
2. Trigger Generation: LLM generates text with tool name + argument values
3. Deterministic Deserialization: Harness intercepts text, deserializes into structured request (most brittle stage)
4. Observation Injection: Harness executes call, wraps result (success/failure) into "observation," re-injects

**Failure Surfaces & Fallback Paths**:
- Deserialization failure → Retry with error message OR Fallback to text
- Execution failure → Interactive clarification OR Reflection and re-planning

**State Separation Principle**:
- Treat LLM strictly as stateless compute unit ("CPU")
- All state requiring cross-turn consistency → offloaded to external Context State Manager or persistence engine
- Anti-Pattern: forcing LLM to maintain complex state via prompt engineering = chaotic, unpredictable behavior

**Control Plane vs. Data Plane Architecture**:
- **Control Plane** (The "What"): task scheduling, resource quotas, behavioral planning, policy enforcement
- **Data Plane** (The "How"): agent runtime instances, state/memory storage, sandboxed execution environment

**Tiered Memory System**:
- **Short-term Memory**: Recent interaction history (conversation turns, immediate context)
- **Long-term Memory**: Persistent knowledge base (vector DB, graph DB, traditional SQL)
- **Working Memory**: Active task state and ephemeral calculations

**Planning Models & Execution Strategies**:
- **ReAct** (Reasoning + Acting): Simple loop for straightforward tasks
- **Chain-of-Thought (CoT)**: Step-by-step reasoning before action
- **Plan-and-Execute**: Upfront decomposition → sequential execution (recommended default)
- **Multi-Agent Orchestration**: Complex tasks requiring specialized sub-agents

**Sandboxed Execution Framework** (Four Levels):
- Level 1: Process-level Isolation (chroot, Linux namespaces, seccomp-bpf) — fast, shares kernel
- Level 2: Container Isolation (Docker, containerd) — industry-standard, mature choice ⭐ **Recommended default**
- Level 3: MicroVMs (Firecracker) — independent virtual kernels, multi-tenant safe
- Level 4: Full VMs (KVM/QEMU) — maximum security, highest cost

**Resource Management & Resilience**:
- Budgets and Quotas: limits for tokens, API calls, CPU time
- Timeout Control: strict timeouts on network requests, tool executions
- Retry Strategies: backoff for transient errors, fail fast on permanent ones
- Circuit Breakers: trip circuit if dependency fails repeatedly
- Graceful Degradation: downshift to "weak but safe" mode when critical capabilities offline

**Policy Gateway** (Between Planner and Execution):
- Permissions: RBAC/ABAC checks for resource access authorization
- Data Filtering: PII and secret detection for input parameters and return values
- Injection Defense: identify malicious prompt patterns before execution
- Audit Logging: "who did what, when, and the result" for post-mortems and compliance

**Six Core Design Principles**:
1. **Design for Failure**: Treat exceptions as norm; every component supports fault tolerance, retries, graceful degradation
2. **Contract-First**: All interactions via explicit, machine-readable contracts (Schemas, APIs, Events)
3. **Secure by Default**: Security as starting point (least privilege, zero trust, defense-in-depth)
4. **Separation of Concerns**: Decouple "deciding what to do" from "how to do it"
5. **Everything is Measurable**: Every behavior, decision, resource use must be quantifiable
6. **Data-Driven Evolution**: Every agent run = learning opportunity; closed loop of data collection, labeling, feedback

**Evaluation Metrics**:
- Task Effectiveness: success rate, instruction-following rate, tool-use efficacy
- Quality of Service: end-to-end latency, time-to-first-action, error rates
- Resource Efficiency: average token consumption, average tool calls
- Security and Compliance: policy denial rates, security incidents

**Three Core Constraints** (Mentioned but not fully detailed in source):
- Non-determinism of LLM outputs
- Finite token context windows
- Security and compliance requirements

**Key Insights**:
- *"Harness Engineering is the practice of imposing deterministic constraints on [stochastic LLM] raw compute to enable complex engineering workflows."*
- *"The role of the engineer isn't disappearing. It's evolving. We are shifting from being the creators of code to becoming the guardians of the creation process."*
- *"True engineering wisdom lies in building systems that can learn from failure and navigate uncertainty with resilience."*
- *"The ultimate goal of these 'reins' was never to restrict, but to enable a safer, more complete release of potential."*
- *"It's not about 'better prompts' or 'more capable models'. It's about optimizing the environment and mechanisms the model operates within."*

### Source: Randall Hunt — Cognitive Debt
- *"If you don't engineer the harness, you don't get compounding leverage; you get compounding cognitive debt."*
- Cognitive debt = AI-era successor to technical debt
- Manifests as: context loss, uncontrolled tool usage, unreliable agent behavior
- Also manifests in human capital: junior employee deskilling

---

## 4. Harness Engineering Evidence

### Source: Terminal Bench 2.0
- Claude Opus 4.6 ranked **#33** in its native Claude Code harness
- Same model ranked **#5** in a different harness not seen during training
- Demonstrates: harness configuration matters more than model selection

### Source: Princeton HAL Leaderboard
- Tested **21,730 agent rollouts** across 9 models
- Finding: optimal scaffold **flips depending on model family**
- Claude performs better with one scaffold; OpenAI performs better with a completely different one
- Conclusion: models need custom agent harnesses

### Source: ETH Zurich — Context Engineering Study
- LLM-generated CLAUDE.md files **hurt performance** while costing **20%+ more tokens**
- Human-written context files provided only **~4% improvement**
- Agents spent **14–22% more reasoning tokens** on context instructions without improving resolution rates
- Implication: context engineering > prompt engineering; quality > quantity

### Source: "Improving 15 LLMs at Coding in One Afternoon"
- Harness optimization alone produced **dramatic improvements across all 15 models**
- No model retraining required — gains came entirely from harness configuration
- Evidence supports: harness optimization lifts all models regardless of provider

### Source: Big Model vs. Big Harness Debate
- **Boris Cherny (Anthropic)**: *"All the secret sauce, it's all in the model. And this is the thinnest possible wrapper."*
- **Jerry Liu (LlamaIndex)**: *"The Model Harness is Everything — the biggest barrier to getting value from AI is your own ability to context and workflow engineer the models."*
- **METR testing**: Claude Code and Codex don't significantly outperform basic scaffolds
- **Scale AI's SWE-Atlas**: harness choice produces marginal performance differences within error margins
- Takeaway: the debate itself validates that harness engineering is a first-class discipline

### Source: HumanLayer — Configuration Philosophy
- *"It's not a model problem. It's a configuration problem."*
- Six configuration levers: CLAUDE.md files, MCP servers, skills, sub-agents, hooks, back-pressure mechanisms
- Sub-agents function as "context firewalls" — isolate intermediate results, prevent context pollution
- Back-pressure: *"Your likelihood of successfully solving a problem is strongly correlated with the agent's ability to verify its own work."*

### Source: Chroma Research — Context Length
- Models perform worse at longer context lengths
- Semantic relevance matters more than raw context length
- Progressive disclosure (955 tokens at 100% efficiency) vs. static loading (25,000 tokens at 0.8% efficiency) — **~26x improvement**

### Source: OpenDev Paper (arxiv 2603.05344)
- First comprehensive technical report for an open-source, terminal-native, interactive coding agent
- Formalizes **scaffolding** (pre-execution: system prompt, tool schemas, subagent registry) vs. **harness** (runtime: tool dispatch, context management, safety enforcement)
- **Five-layer defense-in-depth safety model**: prompt guardrails → schema restrictions → runtime approval → tool validation → user hooks
- **Dual-memory architecture**: episodic memory (full history) + working memory (current task)
- **Event-driven reminders**: combat "instruction fade-out" by injecting guidance at decision points

### Source: ICML 2025 — Modular Gaming Harness
- Single GPT-4-class model with perception, memory, and reasoning modules
- Achieved **significantly higher win rates** across diverse games vs. unharnessed baseline
- Validates harness approach beyond coding domain

### Market Validation
- **Cursor**: $50B valuation — same underlying models as competitors, differentiation entirely in harness
- **AIE Europe**: hosted "world's first Harness Engineering track"
- **Latent Space**: major coverage — *"Harness Engineering has real value"*
- **Parallel.ai**: published formal agent harness definition and taxonomy

---

## 5. Data Flywheel Mechanics

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

## 6. Case Studies

### Bloomberg
- Invested **~$10M** in BloombergGPT (50B params, 369B tokens of proprietary financial data)
- **GPT-4 outperformed it** on most financial tasks
- Yet Bloomberg Terminal remains unassailable: **$28K–$32K/user/year, ~325K subscribers**
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

## 7. Retail & Agentic Commerce

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

## 8. Platform Giants Entering Verticals

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

### Anthropic — Claude Computer Use (March 2026)
- Full desktop/browser automation capability — not just code execution
- Represents shift from "AI copilot" to "autonomous agent"
- Extends harness moat beyond code to full desktop automation
- Claude Agent Skills SDK: package-once-use-everywhere agent framework; lowers barrier to harness construction

### Others
- Google: Gemini Enterprise
- AWS: Bedrock AgentCore
- Microsoft: Agent 365, Foundry

---

## 9. Vertical SaaS Resilience

### VC Investment Data (2025)
- Vertical startups: **53% of deal volume**, **30% of capital** (4,395 financings, $186B total)
- Excluding 12 mega-rounds (OpenAI, Anthropic etc.): verticals = **51% of total capital**
- 2026: AI-native vertical SaaS seeing **65% increase** in capital flow
- AI-native vertical SaaS Series A medians: **$22M vs $15M traditional** (47% larger rounds)

### "Invisible AI" Trend
- 65% funding surge toward **embedded AI** (in-workflow intelligence) vs. chatbot-style replacement interfaces
- Capital markets pricing in flywheel advantage for harness-based products
- Key distinction: invisible AI lives inside existing workflows; visible AI replaces interfaces

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

## 10. Emerging Frontiers

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

### Academic Validation
- **ACM CAIS 2026**: new conference launched for compound AI systems research
- Multiple survey papers (Oct 2025 – Mar 2026): "Compound AI Systems Optimization", "From Standalone LLMs to Integrated Intelligence"
- Formal academic recognition that agentic systems are a major research direction

### Infrastructure Race
- SoftBank/AEP: **10GW Ohio data center** (largest US AI infrastructure project)
- Meta: **$10B AI investment** (6x prior), approaching 1GW+ facilities
- Power is now the bottleneck, not chips — US grid under stress with 2,600 GW interconnection queue
- Verticals with integrated AI need deep infrastructure partners

---

## 11. Strategic Framework

### Five Principles for Durable AI Advantage
1. **Own the workflow, not the output** — embed where switching costs are prohibitive
2. **Build the harness first** — orchestration, guardrails, memory, observability, tool integration; model-agnostic
3. **Spin the flywheel from day one** — every interaction = proprietary data; HITL, edge cases, eval loops
4. **Compete on integration, not intelligence** — let model labs race on benchmarks; your advantage is domain depth
5. **Price for outcomes, not seats** — value is in the labor line of P&L being replaced
