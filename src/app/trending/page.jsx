import { Suspense } from "react";
import { getTrendingRepos, GitHubError } from "@/lib/github";
import { RepositoryCard } from "@/components/RepositoryCard";
import { RepoCardSkeleton } from "@/components/ui/Skeletons";
import { TrendingFilter } from "@/components/TrendingFilter";
import { Flame } from "lucide-react";
export const metadata = { title: "Trending repositories" };
const LANGS = ["", "TypeScript", "JavaScript", "Python", "Go", "Rust", "Java"];
export default async function TrendingPage({ searchParams, }) {
    const { lang } = await searchParams;
    const active = LANGS.includes(lang ?? "") ? lang ?? "" : "";
    return (<div className="pb-12">
      <div className="flex items-center gap-2">
        <Flame className="h-5 w-5 text-orange-400"/>
        <p className="eyebrow !text-orange-400">~/ trending this week</p>
      </div>
      <h1 className="mt-2 font-display text-3xl font-bold text-zinc-100">
        What the community is building
      </h1>
      <p className="mt-2 text-zinc-400">
        The most-starred public repositories created in the last 7 days.
      </p>

      <div className="mt-6">
        <TrendingFilter languages={LANGS} active={active}/>
      </div>

      <div className="mt-8">
        <Suspense key={active} fallback={<Grid skeleton/>}>
          <Trending lang={active}/>
        </Suspense>
      </div>
    </div>);
}
async function Trending({ lang }) {
    try {
        const repos = await getTrendingRepos(lang || undefined, "week");
        if (!repos.length) {
            return <p className="glass p-6 text-sm text-zinc-500">No trending repos found.</p>;
        }
        return (<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {repos.map((r, i) => (<RepositoryCard key={r.id} repo={r} index={i}/>))}
      </div>);
    }
    catch (err) {
        const msg = err instanceof GitHubError && err.status === 403
            ? "GitHub rate limit reached. Add a GITHUB_TOKEN to raise the limit."
            : "Couldn't load trending repositories right now.";
        return <p className="glass p-6 text-sm text-rose-300">{msg}</p>;
    }
}
function Grid({ skeleton }) {
    return (<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {skeleton && Array.from({ length: 9 }).map((_, i) => <RepoCardSkeleton key={i}/>)}
    </div>);
}
