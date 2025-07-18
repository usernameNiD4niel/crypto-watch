"use client";
import { createContext, useContext, useState, ReactNode } from "react";

type Currency = "usd" | "php";
const CurrencyContext = createContext<{
    currency: Currency;
    setCurrency: (c: Currency) => void;
    symbol: string;
}>({ currency: "usd", setCurrency: () => { }, symbol: "$" });

export function CurrencyProvider({ children }: { children: ReactNode }) {
    const [currency, setCurrency] = useState<Currency>("usd");
    const symbol = currency === "usd" ? "$" : "₱";
    return (
        <CurrencyContext.Provider value={{ currency, setCurrency, symbol }}>
            {children}
        </CurrencyContext.Provider>
    );
}

export const useCurrency = () => useContext(CurrencyContext);