"use client";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { cn } from "@/lib/utils";
export function TrendingFilter({ languages, active, }) {
    const router = useRouter();
    const [pending, start] = useTransition();
    return (<div className="flex flex-wrap gap-2">
      {languages.map((lang) => {
            const isActive = lang === active;
            return (<button key={lang || "all"} disabled={pending} onClick={() => start(() => router.push(lang ? `/trending?lang=${encodeURIComponent(lang)}` : "/trending"))} className={cn("rounded-full border px-3.5 py-1.5 text-sm font-mono transition", isActive
                    ? "border-brand/50 bg-brand/15 text-brand-400"
                    : "border-white/10 text-zinc-400 hover:border-white/20 hover:text-zinc-200")}>
            {lang || "All"}
          </button>);
        })}
    </div>);
}
