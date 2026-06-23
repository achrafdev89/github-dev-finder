import { languageColor } from "@/lib/utils";
/** Convert the /languages endpoint's { Lang: bytes } map into sorted stats. */
export function aggregateLanguagesFromBytes(bytes) {
    const total = Object.values(bytes).reduce((a, b) => a + b, 0) || 1;
    return Object.entries(bytes)
        .map(([name, b]) => ({
        name,
        bytes: b,
        percentage: Math.round((b / total) * 1000) / 10,
        color: languageColor(name),
    }))
        .sort((a, b) => b.bytes - a.bytes);
}
