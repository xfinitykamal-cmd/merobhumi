import React from 'react';
import {
  Brain,
  Star,
  Lightbulb,
  ChevronRight,
  Trophy,
  AlertCircle,
} from 'lucide-react';
import type { PropertyAnalysis } from '../../pages/AIPropertyHubPage';

interface Props {
  analysis: PropertyAnalysis | null;
  loading: boolean;
  error: string | null;
  city: string;
}

const AIAnalysisPanel: React.FC<Props> = ({ analysis, loading, error, city }) => {
  /* Loading skeleton */
  if (loading) {
    return (
      <section className="bg-white py-16">
        <div className="max-w-[1200px] mx-auto px-6 animate-pulse space-y-6">
          <div className="h-8 bg-[#E6E0DA] rounded w-1/3" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-36 bg-[#F5F1E8] rounded-xl" />
            ))}
          </div>
          <div className="h-24 bg-[#F5F1E8] rounded-xl" />
        </div>
      </section>
    );
  }

  if (error || !analysis) return null;

  return (
    <section className="bg-white py-16">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* ── Header ─────────────────────────────── */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-[#D4755B]/10 rounded-full flex items-center justify-center">
            <Brain className="w-5 h-5 text-[#D4755B]" />
          </div>
          <div>
            <h2 className="font-syne text-2xl text-[#221410]">AI Analysis</h2>
            <p className="font-manrope font-light text-sm text-[#6b7280]">
              Powered by GPT-4.1 — Market insights for {city}
            </p>
          </div>
        </div>

        {/* Partial error banner */}
        {analysis.error && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
            <p className="font-manrope text-sm text-amber-700">
              {analysis.error}
            </p>
          </div>
        )}

        {/* ── Overview cards ─────────────────────── */}
        {analysis.overview?.length > 0 && (
          <div className="mb-8">
            <h3 className="font-syne text-lg text-[#221410] mb-4 flex items-center gap-2">
              <Star className="w-4 h-4 text-[#D4755B]" />
              Property Overview
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {analysis.overview.map((item, i) => (
                <div
                  key={i}
                  className="bg-[#FAF8F4] border border-[#E6E0DA] rounded-xl p-5 hover:border-[#D4755B]/30 transition-colors"
                >
                  <h4 className="font-syne text-base text-[#221410] mb-3 line-clamp-1">
                    {item.name}
                  </h4>

                  <div className="space-y-2 mb-3">
                    <div className="flex justify-between">
                      <span className="font-manrope text-xs text-[#6b7280]">
                        Price
                      </span>
                      <span className="font-space-mono text-sm font-medium text-[#221410]">
                        {item.price}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-manrope text-xs text-[#6b7280]">
                        Area
                      </span>
                      <span className="font-space-mono text-sm text-[#221410]">
                        {item.area}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-manrope text-xs text-[#6b7280]">
                        Location
                      </span>
                      <span className="font-manrope text-sm text-[#221410] text-right max-w-[60%] line-clamp-1">
                        {item.location}
                      </span>
                    </div>
                  </div>

                  {/* Highlight */}
                  <div className="bg-[#D4755B]/10 rounded-lg px-3 py-2">
                    <p className="font-manrope text-xs text-[#D4755B] flex items-start gap-1">
                      <Lightbulb className="w-3 h-3 mt-0.5 shrink-0" />
                      <span className="line-clamp-2">{item.highlight}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Best value pick ────────────────────── */}
        {analysis.best_value && (
          <div className="bg-gradient-to-r from-[#221410] to-[#3d2519] rounded-xl p-6 mb-8 flex items-start gap-4">
            <div className="w-12 h-12 bg-[#D4755B]/20 rounded-full flex items-center justify-center shrink-0">
              <Trophy className="w-6 h-6 text-[#D4755B]" />
            </div>
            <div>
              <div className="font-space-mono text-[11px] text-[#D4755B] uppercase tracking-widest mb-1">
                Best Value Pick
              </div>
              <h4 className="font-syne text-xl text-white mb-2">
                {analysis.best_value.name}
              </h4>
              <p className="font-manrope font-light text-sm text-white/70">
                {analysis.best_value.reason}
              </p>
            </div>
          </div>
        )}

        {/* ── Recommendations ────────────────────── */}
        {analysis.recommendations?.length > 0 && (
          <div className="bg-[#FAF8F4] border border-[#E6E0DA] rounded-xl p-6">
            <h3 className="font-syne text-lg text-[#221410] mb-4 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-[#D4755B]" />
              AI Recommendations
            </h3>
            <ul className="space-y-3">
              {analysis.recommendations.map((rec, i) => (
                <li key={i} className="flex items-start gap-3">
                  <ChevronRight className="w-4 h-4 text-[#D4755B] mt-0.5 shrink-0" />
                  <span className="font-manrope font-light text-sm text-[#4b5563]">
                    {rec}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
};

export default AIAnalysisPanel;
