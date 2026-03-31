import Link from "next/link";

export default function HowItWorks() {
  return (
    <main className="bg-white text-gray-900">
      {/* HERO */}
      <section className="bg-[#191c33] text-white">
        <div className="max-w-5xl mx-auto px-6 py-16 md:py-24">
          <Link
            href="/"
            className="text-[#0666eb] text-sm font-medium hover:underline mb-6 inline-block"
          >
            &larr; Back to Analysis
          </Link>
          <p className="text-[#0666eb] font-semibold text-sm uppercase tracking-widest mb-4">
            Behind the Analysis
          </p>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            The System Behind<br />the Work
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl">
            This analysis — from raw Banxico data to deployed interactive web page —
            was built in a single working session. Here&apos;s how, and what this
            approach would look like at Revolut.
          </p>
        </div>
      </section>

      {/* THE PROBLEM */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold mb-4">The Traditional Way vs. The Agentic Way</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gray-50 rounded-xl p-8 border border-gray-200">
            <h3 className="font-bold text-lg mb-4 text-gray-400">Traditional Approach</h3>
            <p className="text-sm text-gray-500 mb-4">What this analysis would typically require:</p>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex gap-3">
                <span className="text-gray-300 shrink-0">01</span>
                <span>Analyst spends 2 days finding and cleaning Banxico data sources</span>
              </li>
              <li className="flex gap-3">
                <span className="text-gray-300 shrink-0">02</span>
                <span>Separate researcher manually collects competitor pricing</span>
              </li>
              <li className="flex gap-3">
                <span className="text-gray-300 shrink-0">03</span>
                <span>Data analyst builds scoring model in Excel over 1-2 days</span>
              </li>
              <li className="flex gap-3">
                <span className="text-gray-300 shrink-0">04</span>
                <span>Designer creates visualizations and presentation (2-3 days)</span>
              </li>
              <li className="flex gap-3">
                <span className="text-gray-300 shrink-0">05</span>
                <span>Developer builds web page and deploys (2-3 days)</span>
              </li>
            </ul>
            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-gray-400 text-sm">Team of 3-4 people &bull; 1-2 weeks &bull; Multiple handoffs</p>
            </div>
          </div>

          <div className="bg-[#191c33] rounded-xl p-8 text-white">
            <h3 className="font-bold text-lg mb-4 text-[#0666eb]">Agentic Approach</h3>
            <p className="text-sm text-gray-400 mb-4">How this analysis was actually built:</p>
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex gap-3">
                <span className="text-[#0666eb] shrink-0">01</span>
                <span><strong>Data agents</strong> pulled Banxico API data, identified series IDs, downloaded 4 datasets in parallel</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#0666eb] shrink-0">02</span>
                <span><strong>Research agents</strong> collected competitor pricing from 5 providers simultaneously</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#0666eb] shrink-0">03</span>
                <span><strong>I designed</strong> the scoring framework, defined weights, and validated the methodology</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#0666eb] shrink-0">04</span>
                <span><strong>Execution agents</strong> built the Python pipeline, generated charts, scaffolded the web app</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#0666eb] shrink-0">05</span>
                <span><strong>Quality agents</strong> audited the page, found the SSO auth bug, verified mobile rendering</span>
              </li>
            </ul>
            <div className="mt-6 pt-4 border-t border-white/10">
              <p className="text-gray-400 text-sm">One person + agent system &bull; One session &bull; Zero handoffs</p>
            </div>
          </div>
        </div>
      </section>

      {/* THE ARCHITECTURE */}
      <section className="bg-gray-50 border-y border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <h2 className="text-3xl font-bold mb-2">How the System Works</h2>
          <p className="text-gray-500 mb-10 max-w-2xl">
            Not a chatbot. A coordinated system of specialist agents that I design,
            direct, and quality-control. The agents handle execution at speed —
            I focus on strategy, frameworks, and judgment calls.
          </p>

          {/* Architecture diagram */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8 md:p-12">
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {[
                {
                  title: "Data Agents",
                  color: "bg-blue-50 border-blue-200",
                  titleColor: "text-blue-700",
                  items: [
                    "API data acquisition (Banxico, INEGI)",
                    "Parallel multi-source collection",
                    "Data cleaning & normalization",
                    "Format conversion & export",
                  ],
                },
                {
                  title: "Research Agents",
                  color: "bg-emerald-50 border-emerald-200",
                  titleColor: "text-emerald-700",
                  items: [
                    "Competitor pricing collection",
                    "Regulatory monitoring",
                    "Market intelligence synthesis",
                    "Multi-perspective analysis",
                  ],
                },
                {
                  title: "Execution Agents",
                  color: "bg-violet-50 border-violet-200",
                  titleColor: "text-violet-700",
                  items: [
                    "Python pipeline development",
                    "Visualization generation",
                    "Web application build",
                    "Deployment & QA audit",
                  ],
                },
              ].map((col) => (
                <div key={col.title} className={`rounded-xl p-6 border ${col.color}`}>
                  <h3 className={`font-bold mb-3 ${col.titleColor}`}>{col.title}</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    {col.items.map((item) => (
                      <li key={item} className="flex gap-2">
                        <span className="text-gray-300">&bull;</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Human layer */}
            <div className="relative">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#0666eb] to-transparent" />
              <div className="bg-[#191c33] rounded-xl p-6 md:p-8 text-white mt-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#0666eb] flex items-center justify-center font-bold text-sm">AF</div>
                  <div>
                    <p className="font-bold">Strategic Layer — Human in the Loop</p>
                    <p className="text-gray-400 text-sm">Where judgment, creativity, and accountability live</p>
                  </div>
                </div>
                <div className="grid md:grid-cols-4 gap-4 text-sm">
                  {[
                    ["Framework Design", "Defining scoring criteria, choosing methodology, setting weights"],
                    ["Insight Extraction", "Identifying non-obvious findings, connecting dots agents can't see"],
                    ["Quality Control", "Validating data accuracy, challenging assumptions, catching errors"],
                    ["Decision Making", "Prioritizing what to build, when to pivot, what to present"],
                  ].map(([title, desc]) => (
                    <div key={title}>
                      <p className="font-semibold text-[#0666eb] mb-1">{title}</p>
                      <p className="text-gray-400 text-xs">{desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* REVOLUT AI CONTEXT */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold mb-2">Revolut Is Already AI-First</h2>
        <p className="text-gray-500 mb-8 max-w-2xl">
          I&apos;m not proposing to &ldquo;bring AI to Revolut&rdquo; — Revolut is
          already one of the most AI-advanced fintechs in the world. The question
          is how to extend these capabilities into S&O workflows.
        </p>
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {[
            {
              name: "Sherlock",
              desc: "Proprietary ML fraud detection. 96% of fraudulent transactions caught in <50ms. €550M+ in fraud prevented.",
            },
            {
              name: "ElevenLabs Voice AI",
              desc: "3,000 calls/day across 32 languages. 99.7% resolved without human escalation. 8x faster than previous agents.",
            },
            {
              name: "Google AP2 Partnership",
              desc: "Revolut Pay as a core payment rail for agentic commerce. One of the first EU methods compatible with AI-led checkout.",
            },
          ].map((item) => (
            <div key={item.name} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h3 className="font-bold mb-2">{item.name}</h3>
              <p className="text-sm text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>

        <h2 className="text-3xl font-bold mb-2">Extending This to S&O</h2>
        <p className="text-gray-500 mb-10 max-w-2xl">
          Revolut&apos;s AI investments focus on customer-facing (fraud, support, payments)
          and engineering. The opportunity is applying the same agentic approach to
          Strategy & Operations — where I already operate this way daily.
        </p>

        <div className="space-y-6">
          {[
            {
              name: "Corridor Performance Monitor",
              trigger: "Runs daily",
              does: "Pulls latest Banxico remittance data, compares against targets, flags anomalies (volume drops, growth deceleration), generates weekly corridor brief for the team.",
              impact: "Ops team gets corridor insights without manual reporting. Anomalies caught in hours, not weeks.",
              phase: "Week 1-2",
            },
            {
              name: "Competitor Intelligence Tracker",
              trigger: "Runs weekly",
              does: "Scrapes competitor pricing (Wise, Remitly, WU, Xoom), monitors app store reviews for feature launches, tracks regulatory filings. Flags pricing changes and new market entries.",
              impact: "S&O reacts to market moves in days, not months. Price adjustments backed by live competitive data.",
              phase: "Week 2-4",
            },
            {
              name: "Vendor Scorecard System",
              trigger: "Runs on-demand + monthly",
              does: "Automated performance scoring of partners (OXXO, payment rails, KYC providers). Tracks SLA compliance, cost per transaction, incident frequency. Generates renewal negotiation briefs.",
              impact: "Vendor negotiations backed by live performance data. Underperformers flagged before they become problems.",
              phase: "Month 2",
            },
            {
              name: "Regulatory Scanner",
              trigger: "Runs daily",
              does: "Monitors CNBV publications, Diario Oficial de la Federacion, Ley Fintech amendments, Banco de Mexico circulars. Summarizes relevance to Revolut's Mexico operations.",
              impact: "Never blindsided by regulatory changes. Compliance team gets pre-filtered, relevant updates.",
              phase: "Month 2-3",
            },
            {
              name: "Process Optimization Engine",
              trigger: "Runs weekly",
              does: "Analyzes support ticket patterns, onboarding funnel drop-offs, transaction failure rates. Identifies bottlenecks and proposes process improvements with estimated impact.",
              impact: "Continuous improvement without a dedicated analyst. Data-backed prioritization of what to fix next.",
              phase: "Month 3-4",
            },
          ].map((system, i) => (
            <div key={system.name} className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 hover:border-[#0666eb]/30 transition">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-[#0666eb] font-mono font-bold text-sm">0{i + 1}</span>
                    <h3 className="font-bold text-lg">{system.name}</h3>
                  </div>
                  <p className="text-gray-400 text-sm mt-1">{system.trigger}</p>
                </div>
                <span className="text-xs bg-gray-100 text-gray-500 px-3 py-1 rounded-full">{system.phase}</span>
              </div>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-semibold text-gray-500 mb-1">What it does</p>
                  <p className="text-gray-600">{system.does}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-500 mb-1">Impact</p>
                  <p className="text-gray-600">{system.impact}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* THE HONEST CAVEATS */}
      <section className="bg-gray-50 border-y border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <h2 className="text-3xl font-bold mb-2">What Agents Can&apos;t Do</h2>
          <p className="text-gray-500 mb-8 max-w-2xl">
            Intellectual honesty about limitations is what separates useful AI
            deployment from hype. Here&apos;s where the human layer is irreplaceable:
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-bold text-green-700">Agents excel at</h3>
              {[
                "Structured, repeatable data collection",
                "Parallel research across multiple sources",
                "Pattern detection in large datasets",
                "First-draft analysis and reporting",
                "Monitoring and anomaly alerting",
                "Code generation and deployment",
              ].map((item) => (
                <p key={item} className="flex gap-2 text-sm text-gray-600">
                  <span className="text-green-500 shrink-0">&#10003;</span>
                  {item}
                </p>
              ))}
            </div>
            <div className="space-y-4">
              <h3 className="font-bold text-red-700">Humans are essential for</h3>
              {[
                "Stakeholder relationships and political judgment",
                "Defining what questions to ask in the first place",
                "Novel strategic thinking under ambiguity",
                "Vendor negotiations and partnership deals",
                "Quality control — agents hallucinate confidently",
                "Knowing when the data is wrong, not just different",
              ].map((item) => (
                <p key={item} className="flex gap-2 text-sm text-gray-600">
                  <span className="text-red-400 shrink-0">&#10005;</span>
                  {item}
                </p>
              ))}
            </div>
          </div>
          <div className="mt-8 bg-white rounded-xl p-6 border border-amber-200">
            <p className="text-sm text-amber-800">
              <strong>The deployment principle:</strong> Start small, prove value, scale incrementally.
              Every system listed above begins as a personal tool. Once it saves measurable
              hours, it becomes a team tool. No Big Bang deployments — Gartner predicts
              40%+ of agentic AI projects will be canceled by 2027 due to escalating costs
              and inadequate governance. The antidote is incremental rollout with human oversight.
            </p>
          </div>
        </div>
      </section>

      {/* CREDENTIALS */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold mb-6">Background & Credentials</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <p className="text-gray-600 mb-4">
              This isn&apos;t theoretical — I&apos;ve been building and operating with
              AI agent systems daily for over a year. The infrastructure that
              produced this analysis is the same one I use to run my own business.
            </p>
            <div className="space-y-3 text-sm">
              <div className="flex gap-3 items-start">
                <div className="w-2 h-2 rounded-full bg-[#0666eb] mt-1.5 shrink-0" />
                <p className="text-gray-600">
                  <strong>Claude Code Certified by Anthropic</strong> — one of the
                  first practitioners certified in agentic AI development with
                  Claude&apos;s agent infrastructure
                </p>
              </div>
              <div className="flex gap-3 items-start">
                <div className="w-2 h-2 rounded-full bg-[#0666eb] mt-1.5 shrink-0" />
                <p className="text-gray-600">
                  <strong>Daily production use</strong> — multi-agent research, data
                  pipelines, competitive monitoring, content generation, and full-stack
                  development through coordinated agent workflows
                </p>
              </div>
              <div className="flex gap-3 items-start">
                <div className="w-2 h-2 rounded-full bg-[#0666eb] mt-1.5 shrink-0" />
                <p className="text-gray-600">
                  <strong>Real business impact</strong> — used this system to build
                  and launch an AI-powered e-commerce platform (Bookids) across 3
                  markets with zero external funding, handling everything from product
                  development to marketing analytics to vendor management
                </p>
              </div>
            </div>
          </div>
          <div className="bg-[#191c33] rounded-xl p-8 text-white">
            <h3 className="font-bold text-lg mb-4">The reference points</h3>
            <p className="text-gray-400 text-sm mb-4">
              Companies already operating this way at enterprise scale:
            </p>
            <div className="space-y-4 text-sm">
              <div>
                <p className="font-semibold">Revolut — Sherlock, ElevenLabs, AP2</p>
                <p className="text-gray-400">ML fraud detection catching 96% of fraud in &lt;50ms. AI voice support in 32 languages handling 3,000 calls/day. Agentic commerce pioneer with Google AP2.</p>
              </div>
              <div>
                <p className="font-semibold">Block (Square) — &ldquo;Goose&rdquo;</p>
                <p className="text-gray-400">150+ internal service integrations. 8-10 hours saved per employee per week. Used by HR, legal, ops, and strategy teams.</p>
              </div>
              <div>
                <p className="font-semibold">Nubank</p>
                <p className="text-gray-400">5,000+ employees use AI tools monthly across operations. 70% response time reduction. 13M+ customers in Mexico alone.</p>
              </div>
              <div>
                <p className="font-semibold">HPE — &ldquo;Alfred&rdquo;</p>
                <p className="text-gray-400">Started as one CFO&apos;s personal tool, became enterprise-wide. Cut reporting cycle time by 40%.</p>
              </div>
            </div>
            <p className="text-gray-500 text-xs mt-6">
              Sources: Revolut newsroom, Couchbase case study, Block/Sequoia podcast, Nubank tech blog, Fortune (Feb 2026)
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#191c33] text-white">
        <div className="max-w-5xl mx-auto px-6 py-16 text-center">
          <h2 className="text-3xl font-bold mb-4">
            You&apos;re not hiring one person.<br />
            You&apos;re hiring a force multiplier.
          </h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            The question isn&apos;t whether S&O teams will use agent systems — it&apos;s
            who builds them first. I&apos;ve already started.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/"
              className="bg-[#0666eb] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#0555cc] transition"
            >
              View the Analysis
            </Link>
            <a
              href="https://www.linkedin.com/in/alex-friedlander-a3766197/"
              className="bg-white/10 text-white px-6 py-3 rounded-lg font-medium hover:bg-white/20 transition"
              target="_blank"
            >
              Connect on LinkedIn
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
