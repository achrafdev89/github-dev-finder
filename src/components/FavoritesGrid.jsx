"use client";
import { useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Users, BookMarked, Trash2 } from "lucide-react";
import { toggleFavorite } from "@/app/actions/favorites";
import { formatCompact } from "@/lib/utils";
export function FavoritesGrid({ favorites }) {
    const [items, setItems] = useState(favorites);
    const [pending, start] = useTransition();
    function remove(dev) {
        setItems((prev) => prev.filter((d) => d.login !== dev.login)); // optimistic
        start(async () => {
            const res = await toggleFavorite({
                login: dev.login,
                name: dev.name,
                avatar_url: dev.avatar_url,
                bio: dev.bio,
                followers: dev.followers,
                public_repos: dev.public_repos,
            });
            // If it ended up favorited again (error/revert), restore.
            if (res.favorited)
                setItems((prev) => [dev, ...prev]);
        });
    }
    return (<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <AnimatePresence mode="popLayout">
        {items.map((dev) => (<motion.div key={dev.login} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="glass group relative p-5">
            <button onClick={() => remove(dev)} disabled={pending} aria-label={`Remove ${dev.login}`} className="absolute right-3 top-3 rounded-lg p-1.5 text-zinc-600 opacity-0 transition hover:bg-rose-500/10 hover:text-rose-400 group-hover:opacity-100">
              <Trash2 className="h-4 w-4"/>
            </button>

            <Link href={`/developer/${dev.login}`} className="block">
              <div className="flex items-center gap-4">
                <Image src={dev.avatar_url} alt={dev.login} width={56} height={56} className="rounded-full ring-2 ring-white/10"/>
                <div className="min-w-0">
                  <p className="truncate font-display font-semibold text-zinc-100">
                    {dev.name ?? dev.login}
                  </p>
                  <p className="truncate font-mono text-sm text-brand-400">@{dev.login}</p>
                </div>
              </div>
              {dev.bio && <p className="mt-3 line-clamp-2 text-sm text-zinc-400">{dev.bio}</p>}
              <div className="mt-4 flex items-center gap-4 text-xs text-zinc-400">
                <span className="inline-flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-zinc-500"/>
                  {formatCompact(dev.followers)}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <BookMarked className="h-3.5 w-3.5 text-zinc-500"/>
                  {formatCompact(dev.public_repos)}
                </span>
              </div>
            </Link>
          </motion.div>))}
      </AnimatePresence>
    </div>);
}
