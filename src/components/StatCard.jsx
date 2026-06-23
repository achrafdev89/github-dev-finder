"use client";
import { motion } from "framer-motion";
import { Users, BookMarked, Star, GitFork, Eye, CircleDot } from "lucide-react";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
// Map plain string names -> icon components (kept on the client side).
const ICONS = {
    users: Users,
    repos: BookMarked,
    star: Star,
    fork: GitFork,
    eye: Eye,
    issue: CircleDot,
};
export function StatCard({ icon, label, value, compact = true, accent = "#7C5CFF", }) {
    const Icon = ICONS[icon];
    return (<motion.div whileHover={{ y: -3 }} className="glass glass-hover p-5">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl" style={{ backgroundColor: `${accent}1a`, color: accent }}>
          <Icon className="h-5 w-5"/>
        </span>
        <span className="eyebrow !text-zinc-500">{label}</span>
      </div>
      <p className="mt-3 font-display text-3xl font-bold text-zinc-100">
        <AnimatedCounter value={value} compact={compact}/>
      </p>
    </motion.div>);
}
