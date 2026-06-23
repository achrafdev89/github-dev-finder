import { notFound } from "next/navigation";
import Link from "next/link";
import { Scale, ExternalLink, GitBranch, Calendar, } from "lucide-react";
import { getRepo, getRepoLanguages, getRepoReadme, GitHubError } from "@/lib/github";
import { StatCard } from "@/components/StatCard";
import { PageTransition } from "@/components/Motion";
import { aggregateLanguagesFromBytes } from "@/lib/repoLanguages";
import { languageColor, formatJoined, timeAgo } from "@/lib/utils";
export async function generateMetadata({ params, }) {
    const { owner, name } = await params;
    return { title: `${owner}/${name}` };
}
export default async function RepositoryPage({ params, }) {
    const { owner, name } = await params;
    let repo, langBytes;
    try {
        [repo, langBytes] = await Promise.all([
            getRepo(owner, name),
            getRepoLanguages(owner, name),
        ]);
    }
    catch (err) {
        if (err instanceof GitHubError && err.status === 404)
            notFound();
        throw err;
    }
    const readme = await getRepoReadme(owner, name);
    const languages = aggregateLanguagesFromBytes(langBytes);
    return (<PageTransition>
      <div className="space-y-6 pb-12">
        {/* Breadcrumb */}
        <p className="font-mono text-sm text-zinc-500">
          <Link href={`/developer/${owner}`} className="text-brand-400 hover:underline">
            {owner}
          </Link>{" "}
          / <span className="text-zinc-300">{repo.name}</span>
        </p>

        {/* Header */}
        <header className="glass p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-2xl">
              <h1 className="font-display text-2xl font-bold text-zinc-50">{repo.name}</h1>
              {repo.description && <p className="mt-2 text-zinc-300">{repo.description}</p>}
              {repo.topics?.length > 0 && (<div className="mt-3 flex flex-wrap gap-1.5">
                  {repo.topics.map((t) => (<span key={t} className="rounded-full bg-brand/10 px-2.5 py-0.5 text-xs font-medium text-brand-400">
                      {t}
                    </span>))}
                </div>)}
            </div>
            <div className="flex gap-2">
              {repo.homepage && (<a href={repo.homepage} target="_blank" rel="noreferrer" className="btn-ghost">
                  <ExternalLink className="h-4 w-4"/> Live
                </a>)}
              <a href={repo.html_url} target="_blank" rel="noreferrer" className="btn-primary">
                <ExternalLink className="h-4 w-4"/> View on GitHub
              </a>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-zinc-400">
            <span className="inline-flex items-center gap-1.5">
              <GitBranch className="h-4 w-4 text-zinc-500"/> {repo.default_branch}
            </span>
            {repo.license && (<span className="inline-flex items-center gap-1.5">
                <Scale className="h-4 w-4 text-zinc-500"/> {repo.license.spdx_id}
              </span>)}
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-zinc-500"/> created {formatJoined(repo.created_at)}
            </span>
            <span className="text-zinc-600">last push {timeAgo(repo.pushed_at)}</span>
          </div>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard icon="star" label="Stars" value={repo.stargazers_count} accent="#f1e05a"/>
    <StatCard icon="fork" label="Forks" value={repo.forks_count} accent="#39d353"/>
    <StatCard icon="eye" label="Watchers" value={repo.watchers_count} accent="#22D3EE"/>
    <StatCard icon="issue" label="Open issues" value={repo.open_issues_count} accent="#f78166"/>
        </div>

        {/* Languages */}
        {languages.length > 0 && (<section className="glass p-6">
            <h2 className="font-display font-semibold text-zinc-100">Languages</h2>
            <div className="mt-4 flex h-2.5 overflow-hidden rounded-full">
              {languages.map((l) => (<div key={l.name} style={{ width: `${l.percentage}%`, backgroundColor: l.color }} title={`${l.name} ${l.percentage}%`}/>))}
            </div>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-sm">
              {languages.map((l) => (<span key={l.name} className="inline-flex items-center gap-1.5 text-zinc-400">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: languageColor(l.name) }}/>
                  {l.name} <span className="text-zinc-600">{l.percentage}%</span>
                </span>))}
            </div>
          </section>)}

        {/* README preview */}
        {readme && (<section className="glass p-6">
            <h2 className="font-display font-semibold text-zinc-100">README preview</h2>
            <pre className="mt-4 max-h-[28rem] overflow-auto whitespace-pre-wrap rounded-xl bg-black/30 p-4 font-mono text-[13px] leading-relaxed text-zinc-300">
              {readme.slice(0, 6000)}
              {readme.length > 6000 ? "\n\n…(truncated — view full README on GitHub)" : ""}
            </pre>
          </section>)}
      </div>
    </PageTransition>);
}
