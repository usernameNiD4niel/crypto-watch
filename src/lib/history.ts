export async function getWeekOHLC(coinId: string, currency: string) {
    // CoinGecko gives hourly prices for the last 7 days
    const res = await fetch(
        `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=${currency}&days=7&interval=hour`,
    );
    if (!res.ok) throw new Error("fetch week");
    const json: { prices: [number, number][] } = await res.json();
    return json.prices;
}

// split into this week & previous week
export function splitWeeks(prices: [number, number][]) {
    const now = Date.now();
    const msInDay = 86_400_000;
    const weekAgo = now - 7 * msInDay;
    const twoWeeksAgo = now - 14 * msInDay;

    const thisWeek = prices.filter(([t]) => t >= weekAgo);
    const prevWeek = prices.filter(
        ([t]) => t >= twoWeeksAgo && t < weekAgo
    );
    return { thisWeek, prevWeek };
}

// convert timestamp to GMT+8
export function toGMT8(ts: number) {
    return new Date(ts + 8 * 3600_000).toLocaleString("en-US", {
        timeZone: "Asia/Manila",
        hour12: false,
    });
}