import { languageColor } from "@/lib/utils";
const REST = "https://api.github.com";
const GRAPHQL = "https://api.github.com/graphql";
function authHeaders() {
    const headers = {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
    };
    if (process.env.GITHUB_TOKEN) {
        headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }
    return headers;
}
/** Thrown for non-2xx GitHub responses so callers can branch on 404 / rate limit. */
export class GitHubError extends Error {
    status;
    constructor(status, message) {
        super(message);
        this.status = status;
        this.name = "GitHubError";
    }
}
async function ghFetch(path, revalidate = 1800) {
    const res = await fetch(`${REST}${path}`, {
        headers: authHeaders(),
        next: { revalidate }, // ISR-style caching on the server
    });
    if (res.status === 404)
        throw new GitHubError(404, "Not found");
    if (res.status === 403)
        throw new GitHubError(403, "Rate limit exceeded. Add a GITHUB_TOKEN.");
    if (!res.ok)
        throw new GitHubError(res.status, `GitHub request failed (${res.status})`);
    return res.json();
}
// ─── Single user ─────────────────────────────────────────────
export function getUser(username) {
    return ghFetch(`/users/${encodeURIComponent(username)}`);
}
// ─── User search (returns lightweight matches) ───────────────
export async function searchUsers(query, perPage = 12) {
    const data = await ghFetch(`/search/users?q=${encodeURIComponent(query)}&per_page=${perPage}`, 300);
    // Hydrate the top matches into full user objects.
    const logins = data.items.slice(0, perPage).map((i) => i.login);
    const users = await Promise.allSettled(logins.map((l) => getUser(l)));
    return users
        .filter((r) => r.status === "fulfilled")
        .map((r) => r.value);
}
// ─── All public repos for a user (paginated) ─────────────────
export async function getUserRepos(username, max = 100) {
    const repos = await ghFetch(`/users/${encodeURIComponent(username)}/repos?per_page=${max}&sort=updated`);
    return repos;
}
// ─── Single repository ───────────────────────────────────────
export function getRepo(owner, name) {
    return ghFetch(`/repos/${encodeURIComponent(owner)}/${encodeURIComponent(name)}`);
}
export function getRepoLanguages(owner, name) {
    return ghFetch(`/repos/${encodeURIComponent(owner)}/${encodeURIComponent(name)}/languages`);
}
export async function getRepoReadme(owner, name) {
    try {
        const data = await ghFetch(`/repos/${encodeURIComponent(owner)}/${encodeURIComponent(name)}/readme`);
        return Buffer.from(data.content, "base64").toString("utf-8");
    }
    catch {
        return null;
    }
}
// ─── Trending (search proxy — GitHub has no official trending API) ──
export async function getTrendingRepos(language, since = "week") {
    const days = since === "day" ? 1 : since === "week" ? 7 : 30;
    const date = new Date(Date.now() - days * 86_400_000).toISOString().split("T")[0];
    const langQ = language ? `+language:${encodeURIComponent(language)}` : "";
    const data = await ghFetch(`/search/repositories?q=created:>${date}${langQ}&sort=stars&order=desc&per_page=20`, 900);
    return data.items;
}
// ─── Aggregate language stats across a user's repos ──────────
export function aggregateLanguages(repos) {
    const counts = new Map();
    for (const r of repos) {
        if (r.fork || !r.language)
            continue;
        // weight by stars + 1 so popular repos count slightly more
        counts.set(r.language, (counts.get(r.language) ?? 0) + r.stargazers_count + 1);
    }
    const total = [...counts.values()].reduce((a, b) => a + b, 0) || 1;
    return [...counts.entries()]
        .map(([name, bytes]) => ({
        name,
        bytes,
        percentage: Math.round((bytes / total) * 1000) / 10,
        color: languageColor(name),
    }))
        .sort((a, b) => b.bytes - a.bytes)
        .slice(0, 8);
}
function levelFor(count) {
    if (count === 0)
        return 0;
    if (count < 3)
        return 1;
    if (count < 6)
        return 2;
    if (count < 10)
        return 3;
    return 4;
}
export async function getContributions(username) {
    if (!process.env.GITHUB_TOKEN) {
        return { total: 0, weeks: [] }; // GraphQL requires a token
    }
    const query = `
    query($login: String!) {
      user(login: $login) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays { date contributionCount }
            }
          }
        }
      }
    }`;
    try {
        const res = await fetch(GRAPHQL, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ query, variables: { login: username } }),
            next: { revalidate: 3600 },
        });
        const json = (await res.json());
        const cal = json.data?.user?.contributionsCollection?.contributionCalendar;
        if (!cal)
            return { total: 0, weeks: [] };
        const weeks = cal.weeks.map((w) => ({
            days: w.contributionDays.map((d) => ({
                date: d.date,
                count: d.contributionCount,
                level: levelFor(d.contributionCount),
            })),
        }));
        return { total: cal.totalContributions, weeks };
    }
    catch {
        return { total: 0, weeks: [] };
    }
}
// ─── Full profile bundle for the developer page ──────────────
export async function getDeveloperProfile(username) {
    const [user, repos, contrib] = await Promise.all([
        getUser(username),
        getUserRepos(username),
        getContributions(username),
    ]);
    const nonForks = repos.filter((r) => !r.fork);
    const totalStars = nonForks.reduce((a, r) => a + r.stargazers_count, 0);
    const totalForks = nonForks.reduce((a, r) => a + r.forks_count, 0);
    const topRepos = [...nonForks]
        .sort((a, b) => b.stargazers_count - a.stargazers_count)
        .slice(0, 6);
    return {
        user,
        repos,
        languages: aggregateLanguages(repos),
        totalStars,
        totalForks,
        topRepos,
        contributionTotal: contrib.total,
        contributionWeeks: contrib.weeks,
    };
}
