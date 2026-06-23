import { Hero } from "@/components/sections/Hero";
import { SearchBar } from "@/components/SearchBar";
import { Reveal, Stagger, StaggerItem } from "@/components/Motion";
import { Search, GitCompareArrows, BarChart3, Heart, Flame, Activity, } from "lucide-react";
const FEATURES = [
    {
        icon: Search,
        title: "Profile search",
        body: "Look up any GitHub user and get an instant, readable breakdown of their work.",
    },
    {
        icon: BarChart3,
        title: "Language stats",
        body: "See which languages a developer actually ships, weighted by repository traction.",
    },
    {
        icon: GitCompareArrows,
        title: "Side-by-side compare",
        body: "Put two developers next to each other across followers, stars, repos, and reach.",
    },
    {
        icon: Activity,
        title: "Contribution activity",
        body: "A year of commits at a glance with the familiar contribution heatmap.",
    },
    {
        icon: Flame,
        title: "Trending repos",
        body: "Track what the community is starring this week, filtered by language.",
    },
    {
        icon: Heart,
        title: "Save & revisit",
        body: "Sign in to favorite developers and keep a private history of your searches.",
    },
];
export default function HomePage() {
    return (<div className="pb-12">
      <Hero />

      <section className="mt-24">
        <Reveal>
          <p className="eyebrow text-center">what you get</p>
          <h2 className="mx-auto mt-3 max-w-xl text-center font-display text-3xl font-bold text-zinc-100">
            Everything you need to evaluate a developer
          </h2>
        </Reveal>

        <Stagger className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (<StaggerItem key={f.title}>
              <div className="glass glass-hover h-full p-6">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand/10 text-brand-400">
                  <f.icon className="h-5 w-5"/>
                </span>
                <h3 className="mt-4 font-display font-semibold text-zinc-100">{f.title}</h3>
                <p className="mt-2 text-sm text-zinc-400">{f.body}</p>
              </div>
            </StaggerItem>))}
        </Stagger>
      </section>

      <section className="mt-24">
        <Reveal>
          <div className="glass relative overflow-hidden p-10 text-center">
            <div className="absolute inset-0 bg-radial-glow"/>
            <div className="relative z-10">
              <h2 className="font-display text-3xl font-bold text-zinc-100">
                Start with a username
              </h2>
              <p className="mx-auto mt-3 max-w-md text-zinc-400">
                No setup required. Type a handle and explore — sign in only when you
                want to save favorites and history.
              </p>
              <div className="mx-auto mt-6 max-w-lg">
                <SearchBar size="lg"/>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </div>);
}
