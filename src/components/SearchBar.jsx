"use client";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import { Search, Loader2 } from "lucide-react";
export function SearchBar({ size = "lg", defaultValue = "", autoFocus = false, }) {
    const [value, setValue] = useState(defaultValue);
    const [pending, start] = useTransition();
    const router = useRouter();
    function submit(e) {
        e.preventDefault();
        const q = value.trim();
        if (!q)
            return;
        start(() => router.push(`/search?q=${encodeURIComponent(q)}`));
    }
    const tall = size === "lg";
    return (<motion.form onSubmit={submit} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.5 }} className="group relative w-full">
      <div className={`glass flex items-center gap-3 px-4 transition-shadow focus-within:shadow-glow ${tall ? "py-4" : "py-2.5"}`}>
        <span className="font-mono text-brand-400 select-none">~/</span>
        <Search className="h-5 w-5 text-zinc-500 group-focus-within:text-brand-400 transition-colors"/>
        <input 
    // eslint-disable-next-line jsx-a11y/no-autofocus
    autoFocus={autoFocus} value={value} onChange={(e) => setValue(e.target.value)} placeholder="Search a GitHub username or developer…" aria-label="Search GitHub developers" className={`flex-1 bg-transparent outline-none placeholder:text-zinc-600 text-zinc-100 font-mono ${tall ? "text-lg" : "text-sm"}`}/>
        <button type="submit" className="btn-primary !px-4 !py-2 text-sm" disabled={pending}>
          {pending ? <Loader2 className="h-4 w-4 animate-spin"/> : "Find"}
        </button>
      </div>
    </motion.form>);
}
