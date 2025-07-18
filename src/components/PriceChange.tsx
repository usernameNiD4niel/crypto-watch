export default function PriceChange({ value }: { value: number }) {
    const isUp = value >= 0;
    return (
        <span
            className={`flex items-center gap-1 text-sm font-semibold ${isUp ? "text-green-400" : "text-red-400"
                }`}
        >
            {isUp ? "▲" : "▼"}
            {Math.abs(value).toFixed(2)} %
        </span>
    );
}