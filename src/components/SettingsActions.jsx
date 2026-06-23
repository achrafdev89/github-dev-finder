"use client";
import { useState, useTransition } from "react";
import { signOut } from "next-auth/react";
import { Trash2, LogOut, Check, Loader2 } from "lucide-react";
import { clearSearchHistory } from "@/app/actions/history";
export function SettingsActions({ historyCount }) {
    const [pending, start] = useTransition();
    const [cleared, setCleared] = useState(false);
    function onClear() {
        start(async () => {
            await clearSearchHistory();
            setCleared(true);
            setTimeout(() => setCleared(false), 2500);
        });
    }
    return (<section className="glass p-6">
      <h2 className="font-display font-semibold text-zinc-100">Manage</h2>
      <div className="mt-4 space-y-3">
        <div className="flex items-center justify-between gap-4 rounded-xl bg-white/[0.03] p-4">
          <div>
            <p className="text-sm font-medium text-zinc-200">Clear search history</p>
            <p className="text-xs text-zinc-500">
              Permanently delete all {historyCount} recorded searches.
            </p>
          </div>
          <button onClick={onClear} disabled={pending || historyCount === 0} className="btn-ghost !text-rose-400 !border-rose-400/30 disabled:opacity-40">
            {pending ? (<Loader2 className="h-4 w-4 animate-spin"/>) : cleared ? (<Check className="h-4 w-4"/>) : (<Trash2 className="h-4 w-4"/>)}
            {cleared ? "Cleared" : "Clear"}
          </button>
        </div>

        <div className="flex items-center justify-between gap-4 rounded-xl bg-white/[0.03] p-4">
          <div>
            <p className="text-sm font-medium text-zinc-200">Sign out</p>
            <p className="text-xs text-zinc-500">End your session on this device.</p>
          </div>
          <button onClick={() => signOut({ callbackUrl: "/" })} className="btn-ghost">
            <LogOut className="h-4 w-4"/> Sign out
          </button>
        </div>
      </div>
    </section>);
}
