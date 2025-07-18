import { getCoins } from "@/lib/coins";
import CoinListClient from "@/components/CoinListClient";

export default async function HomePage() {
  const coins = await getCoins().catch(() => []);
  return (
    <main className="max-w-7xl mx-auto p-4">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4">Crypto Live Prices</h1>
      <CoinListClient coins={coins} />
    </main>
  );
}