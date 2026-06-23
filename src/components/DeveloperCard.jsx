"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Users, BookMarked, MapPin } from "lucide-react";
import { formatCompact } from "@/lib/utils";
export function DeveloperCard({ user, index = 0, }) {
    return (<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05, duration: 0.4 }} whileHover={{ y: -4 }}>
      <Link href={`/developer/${user.login}`} className="glass glass-hover group block p-5 h-full">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Image src={user.avatar_url} alt={user.login} width={56} height={56} className="rounded-full ring-2 ring-white/10 group-hover:ring-brand/50 transition"/>
          </div>
          <div className="min-w-0">
            <p className="font-display font-semibold text-zinc-100 truncate">
              {user.name ?? user.login}
            </p>
            <p className="font-mono text-sm text-brand-400 truncate">@{user.login}</p>
          </div>
        </div>

        {user.bio && (<p className="mt-3 text-sm text-zinc-400 line-clamp-2">{user.bio}</p>)}

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-400">
          <span className="inline-flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-zinc-500"/>
            {formatCompact(user.followers)} followers
          </span>
          <span className="inline-flex items-center gap-1.5">
            <BookMarked className="h-3.5 w-3.5 text-zinc-500"/>
            {formatCompact(user.public_repos)} repos
          </span>
          {user.location && (<span className="inline-flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-zinc-500"/>
              {user.location}
            </span>)}
        </div>
      </Link>
    </motion.div>);
}
