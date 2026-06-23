import { Suspense } from "react";
import { searchUsers, GitHubError } from "@/lib/github";
import { recordSearch } from "@/app/actions/history";
import { DeveloperCard } from "@/components/DeveloperCard";
import { SearchBar } from "@/components/SearchBar";
import { DeveloperCardSkeleton } from "@/components/ui/Skeletons";
import { SearchX } from "lucide-react";
export const metadata = { title: "Search" };
export default async function SearchPage({ searchParams, }) {
    const { q } = await searchParams;
    const query = (q ?? "").trim();
    return (<div className="pb-12">
      <div className="mx-auto max-w-2xl">
        <p className="eyebrow">~/ search</p>
        <h1 className="mt-2 font-display text-3xl font-bold text-zinc-100">
          Find a developer
        </h1>
        <div className="mt-5">
          <SearchBar size="md" defaultValue={query} autoFocus/>
        </div>
      </div>

      <div className="mt-10">
        {query ? (<Suspense key={query} fallback={<ResultsSkeleton />}>
            <Results query={query}/>
          </Suspense>) : (<EmptyState />)}
      </div>
    </div>);
}
async function Results({ query }) {
    try {
        const users = await searchUsers(query);
        // Best-effort history logging (no-op when signed out).
        await recordSearch(query, users[0]?.login ?? null);
        if (!users.length) {
            return (<Centered title="No developers found" body={`Nothing matched "${query}". Try a different username or name.`}/>);
        }
        return (<>
        <p className="mb-4 text-sm text-zinc-500">
          {users.length} result{users.length > 1 ? "s" : ""} for{" "}
          <span className="font-mono text-zinc-300">{query}</span>
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {users.map((u, i) => (<DeveloperCard key={u.login} user={u} index={i}/>))}
        </div>
      </>);
    }
    catch (err) {
        const msg = err instanceof GitHubError && err.status === 403
            ? "GitHub rate limit reached. Add a GITHUB_TOKEN to raise the limit."
            : "Couldn't reach GitHub right now. Please try again.";
        return <Centered title="Search unavailable" body={msg}/>;
    }
}
function ResultsSkeleton() {
    return (<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (<DeveloperCardSkeleton key={i}/>))}
    </div>);
}
function EmptyState() {
    return (<Centered title="Search for a developer" body="Type a GitHub username or name above to get started."/>);
}
function Centered({ title, body }) {
    return (<div className="glass mx-auto max-w-md p-10 text-center">
      <SearchX className="mx-auto h-8 w-8 text-zinc-600"/>
      <h3 className="mt-3 font-display font-semibold text-zinc-100">{title}</h3>
      <p className="mt-1.5 text-sm text-zinc-400">{body}</p>
    </div>);
}
