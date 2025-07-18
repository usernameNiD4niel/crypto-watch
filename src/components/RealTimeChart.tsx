"use client";
import { useEffect, useRef } from "react";
import { createChart, IChartApi, ISeriesApi, AreaSeries } from "lightweight-charts";
import useSWR from "swr";
import { getCoinPrice } from "@/lib/coins";
import { useCurrency } from "@/lib/currency";
import CurrencyToggle from "./CurrencyToggle";

export default function RealTimeChart({ coinId }: { coinId: string }) {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<IChartApi | null>(null);
    const seriesRef = useRef<ISeriesApi<"Area"> | null>(null);

    const { currency, symbol } = useCurrency();

    // 1-second price
    const { data: priceData } = useSWR(
        ["price", coinId, currency],
        () => getCoinPrice(coinId, currency),
    );

    // 1-second chart
    const { data: history } = useSWR(
        ["chart", coinId, currency],
        () =>
            fetch(
                `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=${currency}&days=1`
            ).then((r) => r.json()),
    );

    useEffect(() => {
        if (!chartContainerRef.current || !history?.prices?.length) return;

        if (!chartRef.current) {
            chartRef.current = createChart(chartContainerRef.current, {
                width: chartContainerRef.current.clientWidth,
                height: 280,
                layout: { background: { color: "transparent" }, textColor: "#d1d5db" },
                grid: { vertLines: { visible: false }, horzLines: { color: "rgba(42,46,57,.5)" } },
                timeScale: { borderVisible: false },
                rightPriceScale: { borderVisible: false },
            });
        }

        if (!seriesRef.current) {
            seriesRef.current = chartRef.current.addSeries(AreaSeries, {
                lineColor: "#3b82f6",
                topColor: "rgba(59,130,246,.4)",
                bottomColor: "rgba(59,130,246,.05)",
            });
        }

        const cData = history.prices.map(([time, value]: [number, number]) => ({
            time: time / 1000,
            value,
        }));
        seriesRef.current.setData(cData);

        const resize = () =>
            chartRef.current?.applyOptions({ width: chartContainerRef.current!.clientWidth });
        window.addEventListener("resize", resize);
        return () => window.removeEventListener("resize", resize);
    }, [history, currency]);

    const price =
        priceData?.[coinId]?.[currency] ?? 0;

    return (
        <div className="space-y-4">
            {/* Current price & currency switcher */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold">Live Price (1 s)</h2>
                    <p className="text-4xl font-bold text-blue-400">
                        {symbol}
                        {price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                </div>
                <CurrencyToggle />
            </div>

            {/* Chart */}
            <div ref={chartContainerRef} className="w-full" />
        </div>
    );
}