"use client";

import { useState } from "react";

interface UnitEconData {
  corridor: string;
  corridor_volume_m: number;
  ca_share_of_total: number;
  avg_transaction_usd: number;
  revenue_per_tx: number;
  tx_per_user_year: number;
  cac_range: number[];
  ltv_3yr: number;
}

export function UnitEconomicsInteractive({ base }: { base: UnitEconData }) {
  const [marketShare, setMarketShare] = useState(2);

  const pct = marketShare / 100;
  const addressableVolume = base.corridor_volume_m * 1_000_000;
  const addressableTx = addressableVolume / base.avg_transaction_usd;
  const captureTx = Math.round(addressableTx * pct);
  const captureUsers = Math.round(captureTx / base.tx_per_user_year);
  const annualRevenue = captureTx * base.revenue_per_tx;
  const ltv = base.revenue_per_tx * base.tx_per_user_year * 3;
  const ltvCacLow = ltv / base.cac_range[1];
  const ltvCacHigh = ltv / base.cac_range[0];
  const paybackLow = base.cac_range[0] / (base.revenue_per_tx * base.tx_per_user_year / 12);
  const paybackHigh = base.cac_range[1] / (base.revenue_per_tx * base.tx_per_user_year / 12);

  const cards = [
    {
      label: "Target Market Share",
      value: `${marketShare}%`,
      sub: marketShare <= 2 ? "Conservative" : marketShare <= 3.5 ? "Moderate" : "Aggressive",
    },
    {
      label: "Annual Revenue",
      value: `$${(annualRevenue / 1_000_000).toFixed(1)}M`,
      sub: `${captureTx.toLocaleString()} transactions`,
    },
    {
      label: "Users Needed",
      value: captureUsers.toLocaleString(),
      sub: `${base.tx_per_user_year} tx/user/year`,
    },
    {
      label: "LTV:CAC Ratio",
      value: `${ltvCacLow.toFixed(1)}x - ${ltvCacHigh.toFixed(1)}x`,
      sub: `Payback: ${paybackLow.toFixed(1)}-${paybackHigh.toFixed(1)} months`,
    },
  ];

  return (
    <div>
      <div className="mb-8 bg-gray-50 rounded-xl p-6 border border-gray-200">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Adjust market share target
        </label>
        <div className="flex items-center gap-4">
          <span className="text-xs text-gray-400 w-8">0.5%</span>
          <input
            type="range"
            min={0.5}
            max={5}
            step={0.5}
            value={marketShare}
            onChange={(e) => setMarketShare(parseFloat(e.target.value))}
            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#0666eb]"
          />
          <span className="text-xs text-gray-400 w-8">5%</span>
          <span className="bg-[#0666eb] text-white px-3 py-1 rounded-lg font-bold text-lg min-w-[56px] text-center">
            {marketShare}%
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-6 mb-8">
        {cards.map((card) => (
          <div
            key={card.label}
            className="bg-gray-50 rounded-xl p-6 border border-gray-200 transition-all"
          >
            <p className="text-sm text-gray-500 mb-1">{card.label}</p>
            <p className="text-2xl font-bold text-[#191c33]">{card.value}</p>
            <p className="text-xs text-gray-400 mt-1">{card.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
