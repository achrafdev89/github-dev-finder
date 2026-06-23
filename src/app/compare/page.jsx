import { getDeveloperProfile, GitHubError } from "@/lib/github";
import { CompareForm } from "@/components/CompareForm";
import { CompareView } from "@/components/CompareView";
import { GitCompareArrows } from "lucide-react";
export const metadata = { title: "Compare developers" };
export default async function ComparePage({ searchParams, }) {
    const { a, b } = await searchParams;
    let profileA = null;
    let profileB = null;
    let error = null;
    if (a && b) {
        try {
            [profileA, profileB] = await Promise.all([
                getDeveloperProfile(a.trim()),
                getDeveloperProfile(b.trim()),
            ]);
        }
        catch (err) {
            error =
                err instanceof GitHubError && err.status === 404
                    ? "One of those usernames doesn't exist. Check the spelling and try again."
                    : "Couldn't load both profiles right now. Please try again.";
        }
    }
    return (<div className="pb-12">
      <div className="mx-auto max-w-2xl text-center">
        <p className="eyebrow">~/ compare</p>
        <h1 className="mt-2 font-display text-3xl font-bold text-zinc-100">
          Two developers, side by side
        </h1>
        <p className="mt-2 text-zinc-400">
          Enter two GitHub usernames to compare reach, output, and language focus.
        </p>
      </div>

      <div className="mx-auto mt-8 max-w-2xl">
        <CompareForm defaultA={a ?? ""} defaultB={b ?? ""}/>
      </div>

      <div className="mt-10">
        {error && (<div className="glass mx-auto max-w-md p-6 text-center text-sm text-rose-300">
            {error}
          </div>)}

        {profileA && profileB && !error && (<CompareView a={profileA} b={profileB}/>)}

        {!a && !b && !error && (<div className="glass mx-auto max-w-md p-10 text-center">
            <GitCompareArrows className="mx-auto h-8 w-8 text-zinc-600"/>
            <p className="mt-3 text-sm text-zinc-400">
              Pick two developers above — for example{" "}
              <span className="font-mono text-zinc-300">torvalds</span> vs{" "}
              <span className="font-mono text-zinc-300">gaearon</span>.
            </p>
          </div>)}
      </div>
    </div>);
}
