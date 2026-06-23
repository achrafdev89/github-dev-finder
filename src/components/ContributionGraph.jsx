"use client";
import { motion } from "framer-motion";
import { formatCompact } from "@/lib/utils";
const LEVEL_BG = ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"];
export function ContributionGraph({ weeks, total, }) {
    if (!weeks.length) {
        return (<div className="glass p-6 text-sm text-zinc-500">
        Contribution data needs a server-side <span className="font-mono">GITHUB_TOKEN</span>.
        Add one to enable the activity heatmap.
      </div>);
    }
    return (<div className="glass p-6">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-semibold text-zinc-100">Contribution activity</h3>
        <span className="font-mono text-sm text-contrib-4">
          {formatCompact(total)} in the last year
        </span>
      </div>

      <div className="mt-4 overflow-x-auto pb-2">
        <div className="flex gap-[3px]">
          {weeks.map((week, wi) => (<div key={wi} className="flex flex-col gap-[3px]">
              {week.days.map((day) => (<motion.div key={day.date} title={`${day.count} contributions on ${day.date}`} className="h-[11px] w-[11px] rounded-[2px]" style={{ backgroundColor: LEVEL_BG[day.level] }} initial={{ opacity: 0, scale: 0.5 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: Math.min(wi * 0.008, 0.4), duration: 0.2 }}/>))}
            </div>))}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-end gap-1.5 text-[11px] text-zinc-500">
        Less
        {LEVEL_BG.map((c) => (<span key={c} className="h-[11px] w-[11px] rounded-[2px]" style={{ backgroundColor: c }}/>))}
        More
      </div>
    </div>);
}
