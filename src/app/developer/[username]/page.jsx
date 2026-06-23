import { notFound } from "next/navigation";
import Image from "next/image";
import { MapPin, LinkIcon, Building2, Twitter, CalendarDays, ExternalLink, } from "lucide-react";
import { getDeveloperProfile, GitHubError } from "@/lib/github";
import { isFavorited } from "@/app/actions/favorites";
import { StatCard } from "@/components/StatCard";
import { LanguageChart } from "@/components/LanguageChart";
import { ContributionGraph } from "@/components/ContributionGraph";
import { RepositoryCard } from "@/components/RepositoryCard";
import { FavoriteButton } from "@/components/FavoriteButton";
import { PageTransition } from "@/components/Motion";
import { formatJoined } from "@/lib/utils";
export async function generateMetadata({ params, }) {
    const { username } = await params;
    return { title: `@${username}` };
}
export default async function DeveloperPage({ params, }) {
    const { username } = await params;
    let profile;
    try {
        profile = await getDeveloperProfile(username);
    }
    catch (err) {
        if (err instanceof GitHubError && err.status === 404)
            notFound();
        throw err;
    }
    const { user, languages, totalStars, totalForks, topRepos, contributionWeeks, contributionTotal } = profile;
    const favorited = await isFavorited(user.login);
    return (<PageTransition>
      <div className="space-y-6 pb-12">
        {/* ── Header ── */}
        <header className="glass p-6 sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            <Image src={user.avatar_url} alt={user.login} width={120} height={120} className="h-24 w-24 rounded-2xl ring-2 ring-white/10 sm:h-28 sm:w-28" priority/>
            <div className="flex-1">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h1 className="font-display text-2xl font-bold text-zinc-50">
                    {user.name ?? user.login}
                  </h1>
                  <a href={user.html_url} target="_blank" rel="noreferrer" className="font-mono text-brand-400 hover:underline">
                    @{user.login}
                  </a>
                </div>
                <div className="flex gap-2">
                  <FavoriteButton user={user} initial={favorited}/>
                  <a href={user.html_url} target="_blank" rel="noreferrer" className="btn-ghost">
                    <ExternalLink className="h-4 w-4"/> GitHub
                  </a>
                </div>
              </div>

              {user.bio && <p className="mt-3 max-w-2xl text-zinc-300">{user.bio}</p>}

              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-zinc-400">
                {user.company && (<span className="inline-flex items-center gap-1.5">
                    <Building2 className="h-4 w-4 text-zinc-500"/> {user.company}
                  </span>)}
                {user.location && (<span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-zinc-500"/> {user.location}
                  </span>)}
                {user.blog && (<a href={user.blog.startsWith("http") ? user.blog : `https://${user.blog}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:text-brand-400">
                    <LinkIcon className="h-4 w-4 text-zinc-500"/> {user.blog}
                  </a>)}
                {user.twitter_username && (<a href={`https://twitter.com/${user.twitter_username}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:text-brand-400">
                    <Twitter className="h-4 w-4 text-zinc-500"/> @{user.twitter_username}
                  </a>)}
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="h-4 w-4 text-zinc-500"/> joined{" "}
                  {formatJoined(user.created_at)}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* ── Stats ── */}
    <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
  <StatCard icon="users" label="Followers" value={user.followers} accent="#22D3EE"/>
  <StatCard icon="repos" label="Repositories" value={user.public_repos}/>
  <StatCard icon="star" label="Total stars" value={totalStars} accent="#f1e05a"/>
  <StatCard icon="fork" label="Total forks" value={totalForks} accent="#39d353"/>
    </div>

        {/* ── Languages + Contributions ── */}
        <div className="grid gap-6 lg:grid-cols-2">
          <LanguageChart languages={languages}/>
          <ContributionGraph weeks={contributionWeeks} total={contributionTotal}/>
        </div>

        {/* ── Top repositories ── */}
        <section>
          <h2 className="font-display text-xl font-bold text-zinc-100">Top repositories</h2>
          {topRepos.length ? (<div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {topRepos.map((r, i) => (<RepositoryCard key={r.id} repo={r} index={i}/>))}
            </div>) : (<p className="mt-4 glass p-6 text-sm text-zinc-500">
              No public, non-forked repositories to show.
            </p>)}
        </section>
      </div>
    </PageTransition>);
}
