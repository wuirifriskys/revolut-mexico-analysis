"use client";

import { useState } from "react";
import mapData from "@/data/mexico-map.json";

interface ScorecardItem {
  state: string;
  composite_score: number;
  composite_rank: number;
  volume_2024_m: number;
  cagr_3yr: number;
  volume_rank: number;
}

function getColor(score: number, min: number, max: number): string {
  const t = (score - min) / (max - min);
  // Gray to Revolut blue gradient
  const r = Math.round(220 - t * 214);
  const g = Math.round(220 - t * 118);
  const b = Math.round(220 + t * 15);
  return `rgb(${r},${g},${b})`;
}

export function MexicoMap({ data }: { data: ScorecardItem[] }) {
  const [hovered, setHovered] = useState<ScorecardItem | null>(null);

  const scoreMap = new Map(data.map((d) => [d.state, d]));
  const scores = data.map((d) => d.composite_score);
  const minScore = Math.min(...scores);
  const maxScore = Math.max(...scores);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 relative">
      {/* Tooltip */}
      {hovered && (
        <div className="absolute top-4 right-4 bg-[#191c33] text-white rounded-xl p-4 shadow-lg z-10 min-w-[200px]">
          <p className="font-bold text-lg">{hovered.state}</p>
          <div className="mt-2 space-y-1 text-sm">
            <p>Opportunity Rank: <span className="text-[#0666eb] font-bold">#{hovered.composite_rank}</span></p>
            <p>Volume 2024: <span className="font-mono">${hovered.volume_2024_m.toLocaleString()}M</span></p>
            <p>3yr CAGR: <span className={hovered.cagr_3yr > 0 ? "text-green-400" : "text-red-400"}>{(hovered.cagr_3yr * 100).toFixed(1)}%</span></p>
            <p>Score: <span className="font-mono font-bold">{hovered.composite_score.toFixed(3)}</span></p>
          </div>
        </div>
      )}

      <svg
        viewBox={mapData.viewBox}
        className="w-full h-auto max-h-[500px]"
        xmlns="http://www.w3.org/2000/svg"
      >
        {mapData.states.map((state) => {
          const match = scoreMap.get(state.name);
          const fill = match
            ? getColor(match.composite_score, minScore, maxScore)
            : "#e5e7eb";

          return (
            <path
              key={state.name}
              d={state.path}
              fill={fill}
              stroke="white"
              strokeWidth="1"
              className="transition-all duration-150 cursor-pointer hover:opacity-80 hover:stroke-[#0666eb] hover:stroke-2"
              onMouseEnter={() => match && setHovered(match)}
              onMouseLeave={() => setHovered(null)}
            />
          );
        })}
      </svg>

      {/* Legend */}
      <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-500">
        <span>Low opportunity</span>
        <div className="flex h-3 rounded-full overflow-hidden">
          {Array.from({ length: 10 }, (_, i) => (
            <div
              key={i}
              className="w-6 h-3"
              style={{ backgroundColor: getColor(minScore + (maxScore - minScore) * (i / 9), minScore, maxScore) }}
            />
          ))}
        </div>
        <span>High opportunity</span>
      </div>
    </div>
  );
}
