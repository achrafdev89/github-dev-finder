"use client";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { motion } from "framer-motion";
export function LanguageChart({ languages }) {
    if (!languages.length) {
        return (<div className="glass p-6 text-sm text-zinc-500">
        No language data available for this developer&apos;s public repositories.
      </div>);
    }
    return (<div className="glass p-6">
      <h3 className="font-display font-semibold text-zinc-100">Language breakdown</h3>
      <p className="mt-1 text-xs text-zinc-500">
        Weighted by repository popularity across public, non-forked repos.
      </p>

      <div className="mt-4 grid gap-6 sm:grid-cols-2 items-center">
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={languages} dataKey="percentage" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={2} stroke="none">
                {languages.map((l) => (<Cell key={l.name} fill={l.color}/>))}
              </Pie>
              <Tooltip contentStyle={{
            background: "#16161F",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 12,
            fontSize: 12,
        }} formatter={(v, n) => [`${v}%`, n]}/>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <ul className="space-y-2.5">
          {languages.map((l, i) => (<li key={l.name}>
              <div className="flex items-center justify-between text-sm">
                <span className="inline-flex items-center gap-2 text-zinc-300">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: l.color }}/>
                  {l.name}
                </span>
                <span className="font-mono text-xs text-zinc-500">{l.percentage}%</span>
              </div>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/[0.05]">
                <motion.div className="h-full rounded-full" style={{ backgroundColor: l.color }} initial={{ width: 0 }} whileInView={{ width: `${l.percentage}%` }} viewport={{ once: true }} transition={{ delay: i * 0.06, duration: 0.6 }}/>
              </div>
            </li>))}
        </ul>
      </div>
    </div>);
}
