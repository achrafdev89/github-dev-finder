import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs) {
    return twMerge(clsx(inputs));
}
/** 1234 -> "1.2k", 1_500_000 -> "1.5M" */
export function formatCompact(n) {
    return new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(n);
}
export function formatNumber(n) {
    return new Intl.NumberFormat("en").format(n);
}
/** "joined Mar 2019" style */
export function formatJoined(iso) {
    return new Date(iso).toLocaleDateString("en", { month: "short", year: "numeric" });
}
/** "3 days ago" relative time */
export function timeAgo(iso) {
    const diff = Date.now() - new Date(iso).getTime();
    const units = [
        ["year", 1000 * 60 * 60 * 24 * 365],
        ["month", 1000 * 60 * 60 * 24 * 30],
        ["day", 1000 * 60 * 60 * 24],
        ["hour", 1000 * 60 * 60],
        ["minute", 1000 * 60],
    ];
    const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
    for (const [unit, ms] of units) {
        if (Math.abs(diff) >= ms || unit === "minute") {
            return rtf.format(-Math.round(diff / ms), unit);
        }
    }
    return "just now";
}
/** GitHub's canonical language colors (subset of the most common). */
export const LANGUAGE_COLORS = {
    JavaScript: "#f1e05a",
    TypeScript: "#3178c6",
    Python: "#3572A5",
    Java: "#b07219",
    "C++": "#f34b7d",
    C: "#555555",
    "C#": "#178600",
    Go: "#00ADD8",
    Rust: "#dea584",
    Ruby: "#701516",
    PHP: "#4F5D95",
    Swift: "#F05138",
    Kotlin: "#A97BFF",
    Dart: "#00B4AB",
    HTML: "#e34c26",
    CSS: "#563d7c",
    Shell: "#89e051",
    Vue: "#41b883",
    Svelte: "#ff3e00",
    Scala: "#c22d40",
    Elixir: "#6e4a7e",
    Haskell: "#5e5086",
    Lua: "#000080",
    R: "#198CE7",
    Jupyter: "#DA5B0B",
    Solidity: "#AA6746",
};
export function languageColor(lang) {
    if (!lang)
        return "#8b8b96";
    return LANGUAGE_COLORS[lang] ?? "#8b8b96";
}
