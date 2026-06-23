"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Code2, Menu, X } from "lucide-react";
import { AuthButton } from "@/components/AuthButton";
import { cn } from "@/lib/utils";
const LINKS = [
    { href: "/search", label: "Search" },
    { href: "/trending", label: "Trending" },
    { href: "/compare", label: "Compare" },
    { href: "/dashboard", label: "Dashboard" },
];
export function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);
    const pathname = usePathname();
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 12);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);
    useEffect(() => setOpen(false), [pathname]);
    return (<motion.header initial={{ y: -24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.4 }} className={cn("fixed inset-x-0 top-0 z-50 transition-all duration-300", scrolled ? "border-b border-white/[0.06] bg-canvas/70 backdrop-blur-xl" : "bg-transparent")}>
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5">
        <Link href="/" className="group flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-gradient shadow-glow">
            <Code2 className="h-4 w-4 text-white"/>
          </span>
          <span className="font-display text-lg font-bold tracking-tight text-zinc-100">
            dev<span className="text-gradient">finder</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (<Link key={l.href} href={l.href} className={cn("rounded-lg px-3 py-2 text-sm transition-colors", pathname.startsWith(l.href)
                ? "text-zinc-100"
                : "text-zinc-400 hover:text-zinc-100")}>
              {l.label}
            </Link>))}
        </div>

        <div className="hidden md:block">
          <AuthButton />
        </div>

        <button className="rounded-lg p-2 text-zinc-300 md:hidden" onClick={() => setOpen((v) => !v)} aria-label="Toggle menu">
          {open ? <X className="h-5 w-5"/> : <Menu className="h-5 w-5"/>}
        </button>
      </nav>

      {open && (<motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="border-t border-white/[0.06] bg-canvas/90 px-4 py-3 backdrop-blur-xl md:hidden">
          <div className="flex flex-col gap-1">
            {LINKS.map((l) => (<Link key={l.href} href={l.href} className="rounded-lg px-3 py-2.5 text-sm text-zinc-300 hover:bg-white/[0.05]">
                {l.label}
              </Link>))}
            <div className="pt-2">
              <AuthButton />
            </div>
          </div>
        </motion.div>)}
    </motion.header>);
}
