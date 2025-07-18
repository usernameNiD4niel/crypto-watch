const COINGECKO = "https://api.coingecko.com/api/v3";

export interface Coin {
    id: string;
    symbol: string;
    name: string;
    image: string;
    current_price: number;
    price_change_percentage_24h: number;
    sparkline_in_7d: { price: number[] };
}

export async function getCoins(): Promise<Coin[]> {
    const res = await fetch(
        `${COINGECKO}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=true`,
        { next: { revalidate: 30 } } // ISR every 30 s
    );
    if (!res.ok) throw new Error("Failed to fetch coins");
    return res.json();
}

export async function getCoinPrice(coinId: string, currency: string) {
    const res = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=${currency}&include_last_updated_at=true`,
        { next: { revalidate: 1 } }
    );
    if (!res.ok) throw new Error("fetch price");
    return res.json();
}