import Link from "next/link";
import { Code2, Github } from "lucide-react";
export function Footer() {
    return (<footer className="mt-24 border-t border-white/[0.06]">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-brand-gradient">
                <Code2 className="h-4 w-4 text-white"/>
              </span>
              <span className="font-display font-bold text-zinc-100">
                dev<span className="text-gradient">finder</span>
              </span>
            </Link>
            <p className="mt-3 max-w-xs text-sm text-zinc-500">
              Developer intelligence built on the GitHub API. Discover talent, study
              great repositories, and learn from how the best developers work.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-12 gap-y-2 text-sm">
            <Link href="/search" className="text-zinc-400 hover:text-zinc-100">
              Search
            </Link>
            <Link href="/trending" className="text-zinc-400 hover:text-zinc-100">
              Trending
            </Link>
            <Link href="/compare" className="text-zinc-400 hover:text-zinc-100">
              Compare
            </Link>
            <Link href="/dashboard" className="text-zinc-400 hover:text-zinc-100">
              Dashboard
            </Link>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-white/[0.06] pt-6 text-xs text-zinc-600 sm:flex-row">
          <p>© {new Date().getFullYear()} devfinder. Data from the GitHub API.</p>
          <a href="https://github.com" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:text-zinc-300">
            <Github className="h-3.5 w-3.5"/> Powered by GitHub
          </a>
        </div>
      </div>
    </footer>);
}
