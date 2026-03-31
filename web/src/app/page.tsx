"use client";

import dynamic from "next/dynamic";
import scorecard from "@/data/scorecard.json";
import competitors from "@/data/competitors.json";
import unitEconomics from "@/data/unit_economics.json";
import nationalTrend from "@/data/national_trend.json";
import usOrigin from "@/data/us_origin.json";
import top5 from "@/data/top5_opportunities.json";

const Charts = {
  NationalTrend: dynamic(() => import("@/components/Charts").then(m => m.Charts.NationalTrend), { ssr: false, loading: () => <div className="bg-white rounded-xl border border-gray-200 p-6 h-[350px] animate-pulse" /> }),
  RankComparison: dynamic(() => import("@/components/Charts").then(m => m.Charts.RankComparison), { ssr: false, loading: () => <div className="bg-white rounded-xl border border-gray-200 p-6 h-[400px] animate-pulse" /> }),
  GrowthTrajectory: dynamic(() => import("@/components/Charts").then(m => m.Charts.GrowthTrajectory), { ssr: false, loading: () => <div className="bg-white rounded-xl border border-gray-200 p-6 h-[400px] animate-pulse" /> }),
  USOrigin: dynamic(() => import("@/components/Charts").then(m => m.Charts.USOrigin), { ssr: false, loading: () => <div className="bg-white rounded-xl border border-gray-200 p-6 h-[400px] animate-pulse" /> }),
  MexicoMap: dynamic(() => import("@/components/MexicoMap").then(m => m.MexicoMap), { ssr: false, loading: () => <div className="bg-white rounded-xl border border-gray-200 p-6 h-[500px] animate-pulse" /> }),
};

const UnitEconomicsInteractive = dynamic(
  () => import("@/components/UnitEconomicsInteractive").then(m => m.UnitEconomicsInteractive),
  { ssr: false }
);

export default function Home() {
  const top10 = scorecard.slice(0, 10);
  const movers = scorecard
    .filter((s) => s.rank_delta > 3)
    .sort((a, b) => b.rank_delta - a.rank_delta);

  return (
    <main className="bg-white text-gray-900">
      {/* HERO */}
      <section className="relative bg-[#191c33] text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0666eb]/20 to-transparent" />
        <div className="relative max-w-5xl mx-auto px-6 py-20 md:py-28">
          <p className="text-[#0666eb] font-semibold text-sm uppercase tracking-widest mb-4">
            Strategy & Operations Analysis
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Where Revolut Wins
            <br />
            in Mexico
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mb-8">
            Mexico receives{" "}
            <span className="text-white font-semibold">$62.6B+</span> in
            remittances annually. But not all corridors are equal — this
            analysis identifies where Revolut has the highest probability of
            winning.
          </p>
          <div className="flex flex-wrap gap-4 text-sm">
            <span className="bg-white/10 px-4 py-2 rounded-full">
              32 states scored
            </span>
            <span className="bg-white/10 px-4 py-2 rounded-full">
              53 US origin states
            </span>
            <span className="bg-white/10 px-4 py-2 rounded-full">
              Banxico public data (2003-2025)
            </span>
            <span className="bg-white/10 px-4 py-2 rounded-full">
              5 competitor teardown
            </span>
          </div>
        </div>
      </section>

      {/* NATIONAL CONTEXT */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold mb-2">The Opportunity</h2>
        <p className="text-gray-500 mb-8 max-w-2xl">
          Mexico is the world&apos;s #2 remittance recipient. Volume has more
          than doubled since 2015, driven by a growing Mexican diaspora in the
          US and increasing digital transfer adoption.
        </p>
        <Charts.NationalTrend data={nationalTrend} />
      </section>

      {/* KEY INSIGHT */}
      <section className="bg-gray-50 border-y border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <div className="bg-[#191c33] text-white rounded-2xl p-8 md:p-12">
            <p className="text-[#0666eb] font-semibold text-sm uppercase tracking-widest mb-4">
              Key Finding
            </p>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Volume rank &ne; Opportunity rank
            </h2>
            <p className="text-gray-300 text-lg mb-6 max-w-2xl">
              The states that receive the most remittances are not necessarily
              the best targets. By combining volume, growth rate, growth
              acceleration, and competitive intensity, a different picture
              emerges.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              {movers.slice(0, 3).map((m) => (
                <div key={m.state} className="bg-white/10 rounded-xl p-5">
                  <p className="text-2xl font-bold">{m.state}</p>
                  <p className="text-gray-400 mt-1">
                    Volume rank{" "}
                    <span className="text-gray-500">#{m.volume_rank}</span>{" "}
                    &rarr; Opportunity rank{" "}
                    <span className="text-[#0666eb] font-semibold">
                      #{m.composite_rank}
                    </span>
                  </p>
                  <p className="text-[#10b981] font-semibold mt-2">
                    &uarr;{m.rank_delta} positions
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CHOROPLETH MAP */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold mb-2">Opportunity by State</h2>
        <p className="text-gray-500 mb-8 max-w-2xl">
          Each state colored by composite opportunity score. Darker blue = higher opportunity.
          Hover over a state to see its score and ranking.
        </p>
        <Charts.MexicoMap data={scorecard} />
      </section>

      {/* OPPORTUNITY SCORECARD */}
      <section className="bg-gray-50 border-y border-gray-200">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold mb-2">Opportunity Scorecard</h2>
        <p className="text-gray-500 mb-4 max-w-2xl">
          All 32 Mexican states ranked by composite opportunity score. The score
          weights: volume (30%), 3-year growth CAGR (25%), growth acceleration
          (25%), and underserved index (20%).
        </p>
        <Charts.RankComparison data={scorecard.slice(0, 15)} />

        <div className="mt-8 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-gray-200 text-left">
                <th className="py-3 px-2 font-semibold">Rank</th>
                <th className="py-3 px-2 font-semibold">State</th>
                <th className="py-3 px-2 font-semibold text-right">
                  Volume 2024
                </th>
                <th className="py-3 px-2 font-semibold text-right">
                  3yr CAGR
                </th>
                <th className="py-3 px-2 font-semibold text-right">
                  Vol. Rank
                </th>
                <th className="py-3 px-2 font-semibold text-right">Score</th>
              </tr>
            </thead>
            <tbody>
              {top10.map((s) => (
                <tr
                  key={s.state}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-3 px-2 font-mono text-[#0666eb] font-bold">
                    #{s.composite_rank}
                  </td>
                  <td className="py-3 px-2 font-medium">{s.state}</td>
                  <td className="py-3 px-2 text-right font-mono">
                    ${s.volume_2024_m.toLocaleString()}M
                  </td>
                  <td className="py-3 px-2 text-right font-mono">
                    <span
                      className={
                        s.cagr_3yr > 0 ? "text-green-600" : "text-red-500"
                      }
                    >
                      {(s.cagr_3yr * 100).toFixed(1)}%
                    </span>
                  </td>
                  <td className="py-3 px-2 text-right font-mono">
                    #{s.volume_rank}
                  </td>
                  <td className="py-3 px-2 text-right font-mono font-bold">
                    {s.composite_score.toFixed(3)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      </section>

      {/* GROWTH TRAJECTORY */}
      <section>
        <div className="max-w-5xl mx-auto px-6 py-16">
          <h2 className="text-3xl font-bold mb-2">Growth Trajectories</h2>
          <p className="text-gray-500 mb-8 max-w-2xl">
            Annual remittance volume for the top 5 opportunity states. Note the
            acceleration in Chiapas and Ciudad de Mexico since 2020.
          </p>
          <Charts.GrowthTrajectory data={top5} />
        </div>
      </section>

      {/* US ORIGIN */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold mb-2">The Sending Side</h2>
        <p className="text-gray-500 mb-8 max-w-2xl">
          California alone accounts for 32.6% of all US&rarr;Mexico remittances.
          The top 5 US states represent over 58% of total volume — these are
          where Revolut needs US-side presence.
        </p>
        <Charts.USOrigin data={usOrigin} />
      </section>

      {/* COMPETITIVE LANDSCAPE */}
      <section className="bg-gray-50 border-y border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <h2 className="text-3xl font-bold mb-2">Competitive Landscape</h2>
          <p className="text-gray-500 mb-8 max-w-2xl">
            Operational comparison for sending $300 USD to Mexico.
            Revolut&apos;s FX advantage is clear — the gap is cash-out
            infrastructure.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm bg-white rounded-xl overflow-hidden shadow-sm">
              <thead>
                <tr className="bg-[#191c33] text-white text-left">
                  <th className="py-4 px-4 font-semibold">Provider</th>
                  <th className="py-4 px-4 font-semibold text-right">Fee</th>
                  <th className="py-4 px-4 font-semibold text-right">
                    FX Markup
                  </th>
                  <th className="py-4 px-4 font-semibold text-right">
                    Recipient Gets
                  </th>
                  <th className="py-4 px-4 font-semibold">Cash Pickup</th>
                  <th className="py-4 px-4 font-semibold">Delivery</th>
                </tr>
              </thead>
              <tbody>
                {competitors.map((c, i) => (
                  <tr
                    key={c.provider}
                    className={`border-b border-gray-100 ${i === 0 ? "bg-blue-50" : "hover:bg-gray-50"}`}
                  >
                    <td className="py-4 px-4 font-medium">
                      {c.provider}
                      {i === 0 && (
                        <span className="ml-2 text-xs bg-[#0666eb] text-white px-2 py-0.5 rounded-full">
                          Best Rate
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-right font-mono">
                      {c.fee_usd === 0 ? "Free" : `$${c.fee_usd.toFixed(2)}`}
                    </td>
                    <td className="py-4 px-4 text-right font-mono">
                      {c.fx_markup_pct}%
                    </td>
                    <td className="py-4 px-4 text-right font-mono font-semibold">
                      {c.recipient_mxn.toLocaleString()} MXN
                    </td>
                    <td className="py-4 px-4">
                      {c.cash_pickup ? (
                        <span className="text-green-600">Yes</span>
                      ) : (
                        <span className="text-gray-400">No</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-gray-600 text-xs">
                      {c.delivery_time}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-6 grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-green-100">
              <h3 className="font-bold text-green-700 mb-2">
                Revolut&apos;s Structural Advantage
              </h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>
                  &bull; Best-in-class FX rates (mid-market on weekdays)
                </li>
                <li>&bull; Zero-fee transfers within fair usage limits</li>
                <li>
                  &bull; Multi-currency account — not just a transfer tool
                </li>
                <li>&bull; Instant Revolut-to-Revolut transfers</li>
              </ul>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-red-100">
              <h3 className="font-bold text-red-700 mb-2">
                Structural Gaps to Close
              </h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>
                  &bull; No cash-out network (OXXO, Walmart, Elektra)
                </li>
                <li>
                  &bull; Recipient needs Revolut for best experience
                </li>
                <li>&bull; Bank transfers take 3-5 days vs minutes</li>
                <li>&bull; Brand awareness near zero in Mexico</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* UNIT ECONOMICS */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold mb-2">Unit Economics</h2>
        <p className="text-gray-500 mb-8 max-w-2xl">
          Modeling {unitEconomics.corridor} — the largest single corridor at $
          {unitEconomics.corridor_volume_m.toLocaleString()}M annually (
          {(unitEconomics.ca_share_of_total * 100).toFixed(1)}% of all
          US&rarr;MX volume).
        </p>
        <UnitEconomicsInteractive base={unitEconomics} />
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-sm text-amber-800">
          <p className="font-semibold mb-2">Assumptions & Caveats</p>
          <ul className="space-y-1">
            <li>
              &bull; Average transaction: ${unitEconomics.avg_transaction_usd}{" "}
              USD (Banxico national average)
            </li>
            <li>
              &bull; Revenue per transaction: $
              {unitEconomics.revenue_per_tx} (estimated fee + FX spread)
            </li>
            <li>
              &bull; CAC range: ${unitEconomics.cac_range[0]}-$
              {unitEconomics.cac_range[1]} (fintech industry benchmarks)
            </li>
            <li>
              &bull; LTV horizon: 3 years (conservative for a sticky financial
              product)
            </li>
            <li>
              &bull; These estimates use public data. With internal Revolut data
              on actual margins, fees, and acquisition costs, this model becomes
              actionable.
            </li>
          </ul>
        </div>
      </section>

      {/* WHAT I'D DO WITH INTERNAL DATA */}
      <section className="bg-[#191c33] text-white">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <h2 className="text-3xl font-bold mb-2">
            What I&apos;d Do With Internal Data
          </h2>
          <p className="text-gray-400 mb-8 max-w-2xl">
            This analysis uses public Banxico data — which is already
            substantial. Here&apos;s what becomes possible with Revolut&apos;s
            internal datasets:
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "User Acquisition Optimization",
                desc: "Cross-reference corridor data with Revolut's existing Mexico user base to identify CAC efficiency by region. Target marketing spend on corridors with highest organic adoption.",
              },
              {
                title: "Pricing Strategy by Corridor",
                desc: "Model optimal fee/FX spread by corridor based on competitive intensity, user price sensitivity, and transaction frequency. Each corridor likely has a different optimal price point.",
              },
              {
                title: "Partnership Prioritization",
                desc: "Use transaction data to identify which cash-out partnerships (OXXO, Walmart, Elektra) would unlock the most volume in underserved corridors. Sequence partner deals by ROI.",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="bg-white/5 rounded-xl p-6 border border-white/10"
              >
                <h3 className="font-bold text-lg mb-2">{card.title}</h3>
                <p className="text-gray-400 text-sm">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WAS BUILT (Section A — short) */}
      <section className="bg-gray-50 border-y border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-[#0666eb] font-semibold text-sm uppercase tracking-widest mb-4">
                How This Was Built
              </p>
              <h2 className="text-3xl font-bold mb-4">
                One person.<br />One session.<br />An agent system.
              </h2>
              <p className="text-gray-600 mb-4">
                This entire analysis — data acquisition, competitive research,
                scoring model, visualizations, interactive web page, and deployment —
                was produced in a single working session using a personal AI agent
                infrastructure.
              </p>
              <p className="text-gray-600 mb-6">
                Not by copy-pasting into ChatGPT. Through coordinated specialist agents
                that I design, direct, and quality-control — the same system I&apos;d
                build for Revolut&apos;s S&O team.
              </p>
              <a
                href="/how-it-works"
                className="inline-flex items-center gap-2 bg-[#191c33] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[#2a2e4a] transition"
              >
                See how the system works &rarr;
              </a>
            </div>
            <div className="bg-[#191c33] rounded-xl p-6 text-white text-sm">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-[#0666eb] text-xs font-bold">D</div>
                  <div>
                    <p className="font-semibold">Data Agents</p>
                    <p className="text-gray-400 text-xs">Banxico API, 4 datasets, parallel acquisition</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-xs font-bold">R</div>
                  <div>
                    <p className="font-semibold">Research Agents</p>
                    <p className="text-gray-400 text-xs">5 competitors priced, 3 agents in parallel</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center text-violet-400 text-xs font-bold">E</div>
                  <div>
                    <p className="font-semibold">Execution Agents</p>
                    <p className="text-gray-400 text-xs">Python pipeline, Next.js web, Vercel deploy</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400 text-xs font-bold">Q</div>
                  <div>
                    <p className="font-semibold">Quality Agents</p>
                    <p className="text-gray-400 text-xs">Visual audit, mobile test, security review</p>
                  </div>
                </div>
                <div className="border-t border-white/10 pt-3 mt-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#0666eb]/30 flex items-center justify-center text-[#0666eb] text-xs font-bold">AF</div>
                    <div>
                      <p className="font-semibold">Strategic Layer (Me)</p>
                      <p className="text-gray-400 text-xs">Framework design, insight extraction, quality control</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold mb-6">About This Analysis</h2>
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <p className="text-gray-600 mb-4">
              I built this analysis because I believe in showing, not telling.
              The code that produced every number and chart on this page is{" "}
              <a
                href="https://github.com/wuirifriskys/revolut-mexico-analysis"
                className="text-[#0666eb] underline"
                target="_blank"
              >
                open source on GitHub
              </a>
              .
            </p>
            <p className="text-gray-600 mb-3 font-semibold">Alex Friedlander</p>
            <ul className="text-gray-600 text-sm space-y-2 mb-4">
              <li>&bull; <strong>BBA, ESADE Business School</strong> (Ramon Llull University, Barcelona)</li>
              <li>&bull; <strong>4 years at Alfa Consulting / Accenture</strong> — Strategy & operational improvement for major utilities across the US, Spain, and Singapore. Built Power BI dashboards for executive decision-making, led maintenance optimization delivering &euro;1M+ annual impact per site, designed crew programs improving field productivity by 15-20%.</li>
              <li>&bull; <strong>AI Business Development, ZenAI Group (APAC)</strong> — Sole responsibility for expanding an AI solutions company across Southeast Asia. Built enterprise sales pipeline from scratch in a new market.</li>
              <li>&bull; <strong>Founder, Bookids</strong> — AI-powered personalized children&apos;s books. Built from zero to live product across 3 markets with no external funding. Manage the full stack: product, engineering, vendor negotiations, marketing funnel, unit economics.</li>
              <li>&bull; <strong>Spanish & US citizen</strong> — Native Spanish speaker with direct operational context for both sides of the US-Mexico corridor.</li>
              <li>&bull; <strong>Claude Code Certified (Anthropic)</strong> — Certified in agentic AI development. I operate with a personal AI agent infrastructure daily — the same system that <a href="/how-it-works" className="text-[#0666eb] underline">produced this analysis</a>.</li>
            </ul>
            <div className="flex gap-4 mt-6">
              <a
                href="https://github.com/wuirifriskys/revolut-mexico-analysis"
                className="bg-[#191c33] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[#2a2e4a] transition"
                target="_blank"
              >
                View Code on GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/alex-friedlander-a3766197/"
                className="bg-[#0666eb] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[#0555cc] transition"
                target="_blank"
              >
                Connect on LinkedIn
              </a>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="font-bold text-lg">
              Why This Matters for the Role
            </h3>
            <div className="space-y-3 text-sm">
              {[
                [
                  "Building scalable processes",
                  "The analysis pipeline itself — reproducible, modular, data-driven",
                ],
                [
                  "Exploring and prioritizing projects",
                  "Corridor scoring framework — prioritization with weighted criteria",
                ],
                [
                  "Experience coding (SQL, Python, R)",
                  "Python + pandas + Plotly + Next.js — full-stack execution",
                ],
                [
                  "Breaking complex problems down",
                  "Macro \u2192 state \u2192 corridor \u2192 unit economics decomposition",
                ],
                [
                  "Managing vendor relationships",
                  "Competitive teardown includes partner/vendor assessment",
                ],
                [
                  "Natural curiosity + will to impact",
                  "You\u2019re reading an unsolicited analysis \u2014 that\u2019s both",
                ],
              ].map(([req, proof]) => (
                <div key={req} className="flex gap-3">
                  <span className="text-[#0666eb] mt-0.5 shrink-0">
                    &#10003;
                  </span>
                  <div>
                    <p className="font-medium">{req}</p>
                    <p className="text-gray-500">{proof}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* METHODOLOGY */}
      <section className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <h3 className="font-bold text-lg mb-4">
            Methodology & Data Sources
          </h3>
          <div className="text-sm text-gray-500 space-y-2">
            <p>
              <strong>Remittance data:</strong> Banco de Mexico (Banxico) SIE —
              Table CE100 (state-level, quarterly, 2003-2025).
              Values in USD.
            </p>
            <p>
              <strong>US origin data:</strong> Banxico bilateral remittance
              records, quarterly, 53 US states/territories, 2013-2025.
            </p>
            <p>
              <strong>Competitor pricing:</strong> Collected March 2026 from
              provider websites and World Bank Remittance Prices Worldwide.
              Dynamic pricing means these are directionally accurate, not exact.
            </p>
            <p>
              <strong>Opportunity score:</strong> Composite of volume (30%),
              3-year CAGR (25%), growth acceleration (25%), and underserved
              index (20%). All factors min-max normalized to 0-1 before
              weighting.
            </p>
            <p className="mt-2 bg-white border border-gray-200 rounded-lg p-3">
              <strong>Known limitation:</strong> The &ldquo;underserved index&rdquo; uses
              inverse volume rank as a proxy for competitive intensity — assuming
              that higher-volume states attract more fintech entrants. This is
              directionally correct (Nu, Mercado Pago, and Stori all prioritize
              top-volume states), but real fintech penetration data by state from
              CNBV would make this factor significantly more precise. With Revolut
              internal data, this model becomes materially more actionable.
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#191c33] text-gray-400 py-8">
        <div className="max-w-5xl mx-auto px-6 text-sm text-center">
          <p>
            Built by Alex Friedlander &bull; Data from Banco de Mexico &bull;{" "}
            <a
              href="https://github.com/wuirifriskys/revolut-mexico-analysis"
              className="text-[#0666eb] hover:underline"
              target="_blank"
            >
              Source Code
            </a>
          </p>
        </div>
      </footer>
    </main>
  );
}
