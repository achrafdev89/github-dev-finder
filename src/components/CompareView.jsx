"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import { formatCompact } from "@/lib/utils";
const METRICS = [
    { label: "Followers", get: (p) => p.user.followers },
    { label: "Following", get: (p) => p.user.following },
    { label: "Public repos", get: (p) => p.user.public_repos },
    { label: "Total stars", get: (p) => p.totalStars },
    { label: "Total forks", get: (p) => p.totalForks },
    { label: "Contributions (yr)", get: (p) => p.contributionTotal },
];
function Head({ p, accent }) {
    return (<Link href={`/developer/${p.user.login}`} className="flex flex-col items-center gap-2 group">
      <Image src={p.user.avatar_url} alt={p.user.login} width={72} height={72} className="rounded-2xl ring-2 transition group-hover:scale-105" style={{ borderColor: accent }}/>
      <div className="text-center">
        <p className="font-display font-semibold text-zinc-100 group-hover:text-brand-400">
          {p.user.name ?? p.user.login}
        </p>
        <p className="font-mono text-xs" style={{ color: accent }}>
          @{p.user.login}
        </p>
      </div>
    </Link>);
}
export function CompareView({ a, b }) {
    // Score each developer by how many metrics they win.
    let scoreA = 0;
    let scoreB = 0;
    for (const m of METRICS) {
        const va = m.get(a);
        const vb = m.get(b);
        if (va > vb)
            scoreA++;
        else if (vb > va)
            scoreB++;
    }
    const leader = scoreA === scoreB ? null : scoreA > scoreB ? a : b;
    return (<motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass mx-auto max-w-3xl overflow-hidden p-6 sm:p-8">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
        <Head p={a} accent="#7C5CFF"/>
        <span className="font-display text-sm font-bold text-zinc-600">VS</span>
        <Head p={b} accent="#22D3EE"/>
      </div>

      {leader && (<div className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-white/[0.04] py-2 text-sm text-zinc-300">
          <Trophy className="h-4 w-4 text-amber-400"/>
          <span className="font-mono text-brand-400">@{leader.user.login}</span> leads{" "}
          {Math.max(scoreA, scoreB)}–{Math.min(scoreA, scoreB)} across these metrics
        </div>)}

      <div className="mt-6 space-y-4">
        {METRICS.map((m, i) => {
            const va = m.get(a);
            const vb = m.get(b);
            const max = Math.max(va, vb, 1);
            return (<div key={m.label}>
              <div className="flex items-center justify-between text-xs text-zinc-500">
                <span className={va >= vb ? "font-semibold text-brand-400" : ""}>
                  {formatCompact(va)}
                </span>
                <span className="uppercase tracking-wide">{m.label}</span>
                <span className={vb >= va ? "font-semibold text-cyanx" : ""}>
                  {formatCompact(vb)}
                </span>
              </div>
              <div className="mt-1.5 flex items-center gap-1">
                <div className="flex flex-1 justify-end">
                  <motion.div className="h-2 rounded-l-full bg-brand" initial={{ width: 0 }} animate={{ width: `${(va / max) * 100}%` }} transition={{ delay: i * 0.05, duration: 0.5 }}/>
                </div>
                <div className="flex flex-1">
                  <motion.div className="h-2 rounded-r-full bg-cyanx" initial={{ width: 0 }} animate={{ width: `${(vb / max) * 100}%` }} transition={{ delay: i * 0.05, duration: 0.5 }}/>
                </div>
              </div>
            </div>);
        })}
      </div>
    </motion.div>);
}
