"use client";
import { motion } from "framer-motion";
import { SearchBar } from "@/components/SearchBar";
// A decorative, animated contribution-style grid — the signature motif.
function GridMotif() {
    const cols = 28;
    const rows = 7;
    const cells = Array.from({ length: cols * rows });
    const palette = ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"];
    // Deterministic pseudo-random so SSR and client render the same grid.
    const levelFor = (i) => {
        const x = Math.sin(i * 99.13) * 43758.5453;
        return Math.floor((x - Math.floor(x)) * 5);
    };
    return (<div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.18]">
      <div className="grid gap-[5px]" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {cells.map((_, i) => {
            const level = levelFor(i);
            return (<motion.span key={i} className="h-3 w-3 rounded-[3px]" style={{ backgroundColor: palette[level] }} initial={{ opacity: 0.2 }} animate={{ opacity: [0.2, level > 1 ? 0.9 : 0.3, 0.2] }} transition={{ duration: 4 + (i % 5), repeat: Infinity, delay: (i % cols) * 0.06 }}/>);
        })}
      </div>
    </div>);
}
export function Hero() {
    return (<section className="relative overflow-hidden rounded-3xl">
      <GridMotif />

      <div className="relative z-10 mx-auto max-w-3xl px-4 py-20 text-center sm:py-28">
        <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="eyebrow inline-block">
          ~/ github developer intelligence
        </motion.span>

        <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="mt-4 font-display text-4xl font-bold leading-[1.05] tracking-tight text-zinc-50 sm:text-6xl">
          Read a developer
          <br />
          <span className="text-gradient">by their commits.</span>
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mx-auto mt-5 max-w-xl text-balance text-zinc-400">
          Search any GitHub user and get a clear picture in seconds — language
          breakdown, top repositories, contribution activity, and side-by-side
          comparisons. Built for recruiters, learners, and the curious.
        </motion.p>

        <div className="mx-auto mt-8 max-w-xl">
          <SearchBar size="lg"/>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-4 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs text-zinc-600">
          <span>Try</span>
          {["torvalds", "gaearon", "sindresorhus"].map((u) => (<a key={u} href={`/developer/${u}`} className="rounded-full border border-white/10 px-2.5 py-0.5 font-mono text-zinc-400 transition hover:border-brand/40 hover:text-brand-400">
              @{u}
            </a>))}
        </motion.div>
      </div>
    </section>);
}
