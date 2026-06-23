"use client";
import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
export default function Error({ error, reset, }) {
    useEffect(() => {
        console.error(error);
    }, [error]);
    return (<div className="glass mx-auto max-w-md p-10 text-center">
      <AlertTriangle className="mx-auto h-9 w-9 text-amber-400"/>
      <h2 className="mt-3 font-display text-xl font-bold text-zinc-100">Something went wrong</h2>
      <p className="mt-2 text-sm text-zinc-400">
        We hit an unexpected error. This is often a GitHub rate limit — adding a
        GITHUB_TOKEN usually fixes it.
      </p>
      <button onClick={reset} className="btn-primary mt-5">
        Try again
      </button>
    </div>);
}
