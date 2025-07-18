import RealTimeChart from "@/components/RealTimeChart";

export default async function CoinPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return (
        <main className="max-w-5xl mx-auto p-4 space-y-8">
            <RealTimeChart coinId={id} />
            {/* <WeekHistory coinId={id} /> */}
        </main>
    );
}