import Link from "next/link";
import { auth } from "@/lib/auth";
import { listFavorites } from "@/app/actions/favorites";
import { listSearchHistory } from "@/app/actions/history";
import { SignInPrompt } from "@/components/SignInPrompt";
import { DeveloperCard } from "@/components/DeveloperCard";
import { PageTransition } from "@/components/Motion";
import { Heart, History, Search } from "lucide-react";
import { timeAgo } from "@/lib/utils";
export const metadata = { title: "Dashboard" };
export default async function DashboardPage() {
    const session = await auth();
    if (!session?.user) {
        return (<SignInPrompt title="Your developer dashboard" body="Sign in with GitHub to save favorite developers and keep a private search history."/>);
    }
    const [favorites, history] = await Promise.all([listFavorites(), listSearchHistory(10)]);
    return (<PageTransition>
      <div className="space-y-8 pb-12">
        <div>
          <p className="eyebrow">~/ dashboard</p>
          <h1 className="mt-2 font-display text-3xl font-bold text-zinc-100">
            Welcome back, {session.user.name?.split(" ")[0] ?? "developer"}
          </h1>
        </div>

        {/* Overview tiles */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="glass flex items-center gap-4 p-5">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-rose-500/10 text-rose-400">
              <Heart className="h-5 w-5"/>
            </span>
            <div>
              <p className="font-display text-2xl font-bold text-zinc-100">{favorites.length}</p>
              <p className="text-sm text-zinc-500">saved developers</p>
            </div>
          </div>
          <div className="glass flex items-center gap-4 p-5">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand/10 text-brand-400">
              <History className="h-5 w-5"/>
            </span>
            <div>
              <p className="font-display text-2xl font-bold text-zinc-100">{history.length}</p>
              <p className="text-sm text-zinc-500">recent searches</p>
            </div>
          </div>
        </div>

        {/* Favorites */}
        <section>
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-bold text-zinc-100">Favorite developers</h2>
            <Link href="/favorites" className="text-sm text-brand-400 hover:underline">
              View all
            </Link>
          </div>
          {favorites.length ? (<div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {favorites.slice(0, 6).map((f, i) => (<DeveloperCard key={f.login} index={i} user={{
                    login: f.login,
                    name: f.name,
                    avatar_url: f.avatar_url,
                    bio: f.bio,
                    followers: f.followers,
                    public_repos: f.public_repos,
                    location: null,
                }}/>))}
            </div>) : (<div className="glass mt-4 p-8 text-center text-sm text-zinc-500">
              No favorites yet.{" "}
              <Link href="/search" className="text-brand-400 hover:underline">
                Find a developer
              </Link>{" "}
              and tap Save.
            </div>)}
        </section>

        {/* Search history */}
        <section>
          <h2 className="font-display text-xl font-bold text-zinc-100">Recent searches</h2>
          {history.length ? (<ul className="glass mt-4 divide-y divide-white/[0.05]">
              {history.map((h) => (<li key={h._id} className="flex items-center justify-between px-5 py-3">
                  <Link href={h.resultLogin
                    ? `/developer/${h.resultLogin}`
                    : `/search?q=${encodeURIComponent(h.query)}`} className="flex items-center gap-3 text-sm text-zinc-300 hover:text-brand-400">
                    <Search className="h-4 w-4 text-zinc-600"/>
                    <span className="font-mono">{h.query}</span>
                  </Link>
                  <span className="text-xs text-zinc-600">{timeAgo(h.createdAt)}</span>
                </li>))}
            </ul>) : (<div className="glass mt-4 p-8 text-center text-sm text-zinc-500">
              Your searches will show up here.
            </div>)}
        </section>
      </div>
    </PageTransition>);
}
