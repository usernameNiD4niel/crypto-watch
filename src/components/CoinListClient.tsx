"use client";
import { useEffect, useState } from "react";
import { Coin } from "@/lib/coins";
import CoinRow from "@/components/CoinRow";
import { useSavedCoins } from "@/lib/useSavedCoins";

export default function CoinListClient({ coins }: { coins: Coin[] }) {
    const [saved] = useSavedCoins();
    // same initial list on both server & client
    const [display, setDisplay] = useState(coins);

    // after hydration → apply saved order
    useEffect(() => {
        const sorted = [...coins].sort(
            (a, b) => (saved.includes(b.id) ? 1 : 0) - (saved.includes(a.id) ? 1 : 0)
        );
        setDisplay(sorted);
    }, [coins, saved]);

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead>
                    <tr className="border-b border-slate-700 text-sm text-slate-400">
                        <th className="p-2 sm:p-3">Coin</th>
                        <th className="p-2 sm:p-3">Price</th>
                        <th className="p-2 sm:p-3">24 h %</th>
                        <th className="p-2 sm:p-3">7 d Trend</th>
                        <th className="p-2 sm:p-3">Save</th>
                    </tr>
                </thead>
                <tbody>
                    {display.map((c) => (
                        <CoinRow key={c.id} coin={c} />
                    ))}
                </tbody>
            </table>
        </div>
    );
}