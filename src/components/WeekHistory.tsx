"use client";
import { useMemo } from "react";
import { getWeekOHLC, splitWeeks, toGMT8 } from "@/lib/history";
import { useCurrency } from "@/lib/currency";
import useSWR from "swr";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function WeekHistory({ coinId }: { coinId: string }) {
    const { currency, symbol } = useCurrency();
    const { data: prices } = useSWR(
        ["week", coinId, currency],
        () => getWeekOHLC(coinId, currency),
    );

    const table = useMemo(() => {
        console.log('prices', prices);

        if (!prices?.length) return null;
        const { thisWeek, prevWeek } = splitWeeks(prices);
        console.log(thisWeek, prevWeek);

        // helper to get high/low per day
        const dailyStats = (weekPrices: [number, number][]) => {
            const buckets = Array(7).fill(null).map(() => ({ high: 0, low: Infinity, highT: 0, lowT: 0 }));
            weekPrices.forEach(([ts, price]) => {
                const day = new Date(ts).getDay(); // 0 = Sun … 6 = Sat
                const index = (day + 6) % 7; // shift so Monday = 0
                if (price > buckets[index].high) {
                    buckets[index].high = price;
                    buckets[index].highT = ts;
                }
                if (price < buckets[index].low) {
                    buckets[index].low = price;
                    buckets[index].lowT = ts;
                }
            });
            return buckets;
        };

        const curr = dailyStats(thisWeek);
        const prev = dailyStats(prevWeek);

        console.log('curr', curr)
        console.log('prev', prev);

        return days.map((day, i) => ({
            day,
            currHigh: curr[i]?.high ?? 0,
            currLow: curr[i]?.low ?? 0,
            prevHigh: prev[i]?.high ?? 0,
            prevLow: prev[i]?.low ?? 0,
            currHighT: curr[i]?.highT ?? 0,
            currLowT: curr[i]?.lowT ?? 0,
        }));
    }, [prices]);

    if (!table) return <p className="text-slate-400">Loading week history…</p>;

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold">This Week vs Last Week</h2>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead>
                        <tr className="border-b border-slate-700">
                            <th>Day</th>
                            <th>This Week High</th>
                            <th>This Week Low</th>
                            <th>Prev Week High</th>
                            <th>Prev Week Low</th>
                        </tr>
                    </thead>
                    <tbody>
                        {table.map((r) => (
                            <tr key={r.day} className="border-b border-slate-800">
                                <td>{r.day}</td>
                                <td>
                                    {symbol}{r.currHigh.toLocaleString()}{" "}
                                    <span className="text-xs text-slate-400">{toGMT8(r.currHighT)}</span>
                                </td>
                                <td>
                                    {symbol}{r.currLow.toLocaleString()}{" "}
                                    <span className="text-xs text-slate-400">{toGMT8(r.currLowT)}</span>
                                </td>
                                <td>{symbol}{r.prevHigh.toLocaleString()}</td>
                                <td>{symbol}{r.prevLow.toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}