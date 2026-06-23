"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, GitFork, CircleDot, Archive } from "lucide-react";
import { formatCompact, languageColor, timeAgo } from "@/lib/utils";
export function RepositoryCard({ repo, index = 0 }) {
    return (<motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04, duration: 0.35 }} whileHover={{ y: -3 }}>
      <Link href={`/repository/${repo.owner.login}/${repo.name}`} className="glass glass-hover group flex h-full flex-col p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display font-semibold text-zinc-100 group-hover:text-brand-400 transition-colors truncate">
            {repo.name}
          </h3>
          {repo.archived && (<span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-400">
              <Archive className="h-3 w-3"/> archived
            </span>)}
        </div>

        <p className="mt-2 flex-1 text-sm text-zinc-400 line-clamp-2">
          {repo.description ?? "No description provided."}
        </p>

        {repo.topics?.length > 0 && (<div className="mt-3 flex flex-wrap gap-1.5">
            {repo.topics.slice(0, 3).map((t) => (<span key={t} className="rounded-full bg-brand/10 px-2 py-0.5 text-[11px] font-medium text-brand-400">
                {t}
              </span>))}
          </div>)}

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-400">
          {repo.language && (<span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: languageColor(repo.language) }}/>
              {repo.language}
            </span>)}
          <span className="inline-flex items-center gap-1">
            <Star className="h-3.5 w-3.5 text-zinc-500"/>
            {formatCompact(repo.stargazers_count)}
          </span>
          <span className="inline-flex items-center gap-1">
            <GitFork className="h-3.5 w-3.5 text-zinc-500"/>
            {formatCompact(repo.forks_count)}
          </span>
          {repo.open_issues_count > 0 && (<span className="inline-flex items-center gap-1">
              <CircleDot className="h-3.5 w-3.5 text-zinc-500"/>
              {formatCompact(repo.open_issues_count)}
            </span>)}
          <span className="ml-auto text-zinc-600">updated {timeAgo(repo.pushed_at)}</span>
        </div>
      </Link>
    </motion.div>);
}
