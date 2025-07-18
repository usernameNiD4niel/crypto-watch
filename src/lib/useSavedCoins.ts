"use client";
import { useLocalStorage } from "usehooks-ts";

export function useSavedCoins() {
    return useLocalStorage<string[]>("saved-coins", []);
}