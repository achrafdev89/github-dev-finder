"use client";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
export function CompareForm({ defaultA = "", defaultB = "", }) {
    const [a, setA] = useState(defaultA);
    const [b, setB] = useState(defaultB);
    const [pending, start] = useTransition();
    const router = useRouter();
    function submit(e) {
        e.preventDefault();
        if (!a.trim() || !b.trim())
            return;
        start(() => router.push(`/compare?a=${encodeURIComponent(a.trim())}&b=${encodeURIComponent(b.trim())}`));
    }
    return (<form onSubmit={submit} className="glass flex flex-col items-stretch gap-3 p-3 sm:flex-row sm:items-center">
      <div className="flex flex-1 items-center gap-2 rounded-xl bg-white/[0.03] px-3 py-2.5">
        <span className="font-mono text-brand-400">@</span>
        <input value={a} onChange={(e) => setA(e.target.value)} placeholder="first username" aria-label="First developer" className="w-full bg-transparent font-mono text-sm text-zinc-100 outline-none placeholder:text-zinc-600"/>
      </div>
      <span className="hidden text-zinc-600 sm:block">vs</span>
      <div className="flex flex-1 items-center gap-2 rounded-xl bg-white/[0.03] px-3 py-2.5">
        <span className="font-mono text-cyanx">@</span>
        <input value={b} onChange={(e) => setB(e.target.value)} placeholder="second username" aria-label="Second developer" className="w-full bg-transparent font-mono text-sm text-zinc-100 outline-none placeholder:text-zinc-600"/>
      </div>
      <button type="submit" className="btn-primary" disabled={pending}>
        {pending ? <Loader2 className="h-4 w-4 animate-spin"/> : <>Compare <ArrowRight className="h-4 w-4"/></>}
      </button>
    </form>);
}
