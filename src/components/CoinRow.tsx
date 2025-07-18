"use client"; // ← new
import Image from "next/image";
import Link from "next/link";
import PriceChange from "./PriceChange";
import StarButton from "./StarButton";
import { Coin } from "@/lib/coins";

export default function CoinRow({ coin }: { coin: Coin }) {
    const sparkline = coin.sparkline_in_7d.price;
    const min = Math.min(...sparkline);
    const max = Math.max(...sparkline);
    const range = max - min || 1;
    const points = sparkline
        .map((p, i) => {
            const x = (i / (sparkline.length - 1)) * 100;
            const y = 100 - ((p - min) / range) * 100;
            return `${x},${y}`;
        })
        .join(" ");
    const trendColor = coin.price_change_percentage_24h >= 0 ? "#4ade80" : "#f87171";

    return (
        <tr className="border-b border-slate-800 hover:bg-slate-800/50">
            <td className="p-2 sm:p-3 flex items-center gap-2">
                <Image src={coin.image} alt={coin.name} width={24} height={24} />
                {/* 2️⃣ make the name a Next.js Link */}
                <Link href={`/coins/${coin.id}`} className="font-medium hover:underline">
                    {coin.name}
                </Link>
                <span className="text-xs text-slate-400 uppercase">{coin.symbol}</span>
            </td>
            <td className="p-2 sm:p-3 font-mono">${coin.current_price.toLocaleString()}</td>
            <td className="p-2 sm:p-3">
                <PriceChange value={coin.price_change_percentage_24h} />
            </td>
            <td className="p-2 sm:p-3 w-28 h-10">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                    <polyline
                        fill="none"
                        stroke={trendColor}
                        strokeWidth={2}
                        points={points}
                    />
                </svg>
            </td>
            <td className="p-2 sm:p-3">
                <StarButton id={coin.id} />
            </td>
        </tr>
    );
}