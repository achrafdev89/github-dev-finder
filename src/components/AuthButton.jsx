"use client";
import Image from "next/image";
import { useSession, signIn, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Github, LogOut, LayoutDashboard, Heart } from "lucide-react";
import Link from "next/link";
export function AuthButton() {
    const { data: session, status } = useSession();
    const [open, setOpen] = useState(false);
    if (status === "loading") {
        return <div className="h-9 w-24 animate-pulse rounded-xl bg-white/[0.05]"/>;
    }
    if (!session?.user) {
        return (<button onClick={() => signIn("github")} className="btn-primary text-sm">
        <Github className="h-4 w-4"/>
        Sign in
      </button>);
    }
    return (<div className="relative">
      <button onClick={() => setOpen((v) => !v)} className="flex items-center gap-2 rounded-full p-1 pr-3 hover:bg-white/[0.05] transition">
        {session.user.image && (<Image src={session.user.image} alt={session.user.name ?? "avatar"} width={32} height={32} className="rounded-full ring-2 ring-brand/40"/>)}
        <span className="hidden text-sm text-zinc-300 sm:block">
          {session.user.name?.split(" ")[0]}
        </span>
      </button>

      <AnimatePresence>
        {open && (<>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)}/>
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="glass absolute right-0 z-20 mt-2 w-48 overflow-hidden p-1.5">
              <Link href="/dashboard" onClick={() => setOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-300 hover:bg-white/[0.06]">
                <LayoutDashboard className="h-4 w-4"/> Dashboard
              </Link>
              <Link href="/favorites" onClick={() => setOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-300 hover:bg-white/[0.06]">
                <Heart className="h-4 w-4"/> Favorites
              </Link>
              <button onClick={() => signOut()} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-rose-400 hover:bg-white/[0.06]">
                <LogOut className="h-4 w-4"/> Sign out
              </button>
            </motion.div>
          </>)}
      </AnimatePresence>
    </div>);
}
