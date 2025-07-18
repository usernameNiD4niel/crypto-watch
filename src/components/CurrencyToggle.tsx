"use client";
import { useCurrency } from "@/lib/currency";

export default function CurrencyToggle() {
    const { currency, setCurrency } = useCurrency();
    return (
        <div className="flex gap-2">
            {(["usd", "php"] as const).map((c) => (
                <button
                    key={c}
                    onClick={() => setCurrency(c)}
                    className={`px-3 py-1 rounded text-sm transition ${currency === c
                            ? "bg-blue-600 text-white"
                            : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                        }`}
                >
                    {c.toUpperCase()}
                </button>
            ))}
        </div>
    );
}