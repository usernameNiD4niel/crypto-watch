"use client";

import { useState, useEffect } from "react";
import { useSavedCoins } from "@/lib/useSavedCoins";

export default function StarButton({ id }: { id: string }) {
    const [saved, setSaved] = useSavedCoins();
    const [isClient, setIsClient] = useState(false);

    // This effect runs after the component mounts, ensuring it's client-side only
    useEffect(() => {
        setIsClient(true);
    }, []);

    // Don't render anything until it's client-side
    if (!isClient) {
        return null;
    }

    const isSaved = saved.includes(id);

    const toggle = () =>
        setSaved(isSaved ? saved.filter((i) => i !== id) : [...saved, id]);

    return (
        <button
            onClick={toggle}
            className="text-2xl leading-none"
            aria-label={isSaved ? "Unsave" : "Save"}
        >
            {isSaved ? "★" : "☆"}
        </button>
    );
}
