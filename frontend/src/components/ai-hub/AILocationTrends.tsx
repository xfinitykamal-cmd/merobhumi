import React from 'react';
import {
  TrendingUp,
  MapPin,
  ArrowUpRight,
  Loader2,
  AlertCircle,
  ChevronRight,
  BarChart3,
} from 'lucide-react';
import type { LocationData, LocationAnalysis } from '../../pages/AIPropertyHubPage';

interface Props {
  locations: LocationData[];
  analysis: LocationAnalysis | null;
  loading: boolean;
  error: string | null;
  city: string;
}

const AILocationTrends: React.FC<Props> = ({
  locations,
  analysis,
  loading,
  error,
  city,
}) => {
  /* Loading */
  if (loading) {
    return (
      <section className="bg-[#FAF8F4] py-16">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-3 bg-[#D4755B]/10 rounded-full px-6 py-3">
            <Loader2 className="w-5 h-5 text-[#D4755B] animate-spin" />
            <span className="font-manrope text-sm text-[#D4755B] font-medium">
              Loading location trends for {city}…
            </span>
          </div>
        </div>
      </section>
    );
  }

  /* Error */
  if (error) {
    return (
      <section className="bg-[#FAF8F4] py-16">
        <div className="max-w-[600px] mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 text-amber-600 mb-2">
            <AlertCircle className="w-5 h-5" />
            <span className="font-manrope text-sm font-medium">
              Trends Unavailable
            </span>
          </div>
          <p className="font-manrope font-light text-sm text-[#6b7280]">
            {error}
          </p>
        </div>
      </section>
    );
  }

  if (!locations.length && !analysis) return null;

  return (
    <section className="bg-[#FAF8F4] py-16 border-t border-[#E6E0DA]">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* ── Header ─────────────────────────────── */}
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-[#D4755B]/10 rounded-full flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-[#D4755B]" />
          </div>
          <div>
            <h2 className="font-syne text-2xl text-[#221410]">
              Location Trends — {city}
            </h2>
            <p className="font-manrope font-light text-sm text-[#6b7280]">
              Real-time market data from 99acres
            </p>
          </div>
        </div>

        {/* ── Raw location data table ────────────── */}
        {locations.length > 0 && (
          <div className="bg-white border border-[#E6E0DA] rounded-xl overflow-hidden mb-8">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#F5F1E8] border-b border-[#E6E0DA]">
                    <th className="text-left font-space-mono text-[11px] uppercase tracking-widest text-[#6b7280] px-6 py-4">
                      Location
                    </th>
                    <th className="text-right font-space-mono text-[11px] uppercase tracking-widest text-[#6b7280] px-6 py-4">
                      Price / sq.ft
                    </th>
                    <th className="text-right font-space-mono text-[11px] uppercase tracking-widest text-[#6b7280] px-6 py-4">
                      YoY Change
                    </th>
                    <th className="text-right font-space-mono text-[11px] uppercase tracking-widest text-[#6b7280] px-6 py-4">
                      Rental Yield
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {locations.map((loc, i) => (
                    <tr
                      key={i}
                      className="border-b border-[#E6E0DA] last:border-0 hover:bg-[#FAF8F4] transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-[#D4755B]" />
                          <span className="font-manrope text-sm text-[#221410] font-medium">
                            {loc.location}
                          </span>
                        </div>
                      </td>
                      <td className="text-right px-6 py-4">
                        <span className="font-space-mono text-sm text-[#221410]">
                          ₹{loc.price_per_sqft?.toLocaleString?.('en-IN') ?? loc.price_per_sqft ?? '—'}
                        </span>
                      </td>
                      <td className="text-right px-6 py-4">
                        {loc.percent_increase && Number(loc.percent_increase) !== 0 ? (
                          <span className="inline-flex items-center gap-1 font-space-mono text-sm text-emerald-600">
                            <ArrowUpRight className="w-3.5 h-3.5" />
                            {loc.percent_increase}%
                          </span>
                        ) : (
                          <span className="font-space-mono text-sm text-[#9ca3af]">—</span>
                        )}
                      </td>
                      <td className="text-right px-6 py-4">
                        <span className="font-space-mono text-sm text-[#221410]">
                          {loc.rental_yield && Number(loc.rental_yield) !== 0
                            ? `${loc.rental_yield}%`
                            : '—'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── AI Analysis ────────────────────────── */}
        {analysis && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Trend cards */}
            {analysis.trends?.length > 0 && (
              <div className="bg-white border border-[#E6E0DA] rounded-xl p-6">
                <h3 className="font-syne text-lg text-[#221410] mb-4 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#D4755B]" />
                  AI Trend Analysis
                </h3>

                <div className="space-y-4">
                  {analysis.trends.map((trend, i) => {
                    const outlookLower = (trend.outlook || '').toLowerCase();
                    const isPositive =
                      outlookLower.includes('positive') ||
                      outlookLower.includes('good') ||
                      outlookLower.includes('bullish');
                    const isNegative =
                      outlookLower.includes('negative') ||
                      outlookLower.includes('declin');

                    return (
                      <div key={i} className="bg-[#FAF8F4] rounded-lg p-4">
                        {/* Location name */}
                        <h4 className="font-syne text-sm font-medium text-[#221410] mb-1">
                          {trend.location}
                        </h4>

                        {/* Outlook badge */}
                        <span
                          className={`inline-block font-space-mono text-[11px] px-2.5 py-1 rounded-full mb-3 ${
                            isPositive
                              ? 'bg-emerald-50 text-emerald-600'
                              : isNegative
                              ? 'bg-red-50 text-red-600'
                              : 'bg-amber-50 text-amber-600'
                          }`}
                        >
                          {trend.outlook || 'Stable'}
                        </span>

                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div>
                            <span className="font-manrope text-[#6b7280] block">
                              ₹/sq.ft
                            </span>
                            <span className="font-space-mono text-[#221410]">
                              {trend.price_per_sqft
                                ? `₹${Number(trend.price_per_sqft).toLocaleString('en-IN')}`
                                : '—'}
                            </span>
                          </div>
                          <div>
                            <span className="font-manrope text-[#6b7280] block">
                              YoY
                            </span>
                            <span className={`font-space-mono ${
                              trend.yearly_change_pct && Number(trend.yearly_change_pct) !== 0
                                ? 'text-emerald-600'
                                : 'text-[#9ca3af]'
                            }`}>
                              {trend.yearly_change_pct && Number(trend.yearly_change_pct) !== 0
                                ? `${trend.yearly_change_pct}%`
                                : '—'}
                            </span>
                          </div>
                          <div>
                            <span className="font-manrope text-[#6b7280] block">
                              Yield
                            </span>
                            <span className="font-space-mono text-[#221410]">
                              {trend.rental_yield_pct && Number(trend.rental_yield_pct) !== 0
                                ? `${trend.rental_yield_pct}%`
                                : '—'}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Highlights & Tips */}
            <div className="space-y-6">
              {/* Top Appreciation */}
              {analysis.top_appreciation && (
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5">
                  <div className="font-space-mono text-[11px] text-emerald-600 uppercase tracking-widest mb-2">
                    Top Appreciation
                  </div>
                  <h4 className="font-syne text-lg text-emerald-800 mb-1">
                    {analysis.top_appreciation.location}
                  </h4>
                  <p className="font-manrope font-light text-sm text-emerald-700">
                    {analysis.top_appreciation.reason}
                  </p>
                </div>
              )}

              {/* Best Rental Yield */}
              {analysis.best_rental_yield && (
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
                  <div className="font-space-mono text-[11px] text-blue-600 uppercase tracking-widest mb-2">
                    Best Rental Yield
                  </div>
                  <h4 className="font-syne text-lg text-blue-800 mb-1">
                    {analysis.best_rental_yield.location}
                  </h4>
                  <p className="font-manrope font-light text-sm text-blue-700">
                    {analysis.best_rental_yield.reason}
                  </p>
                </div>
              )}

              {/* Investment Tips */}
              {analysis.investment_tips?.length > 0 && (
                <div className="bg-white border border-[#E6E0DA] rounded-xl p-5">
                  <h3 className="font-syne text-lg text-[#221410] mb-4">
                    Investment Tips
                  </h3>
                  <ul className="space-y-2">
                    {analysis.investment_tips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <ChevronRight className="w-4 h-4 text-[#D4755B] mt-0.5 shrink-0" />
                        <span className="font-manrope font-light text-sm text-[#4b5563]">
                          {tip}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default AILocationTrends;
