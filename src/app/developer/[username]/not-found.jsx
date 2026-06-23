import Link from "next/link";
import { UserX } from "lucide-react";
export default function NotFound() {
    return (<div className="glass mx-auto max-w-md p-10 text-center">
      <UserX className="mx-auto h-9 w-9 text-zinc-600"/>
      <h2 className="mt-3 font-display text-xl font-bold text-zinc-100">Developer not found</h2>
      <p className="mt-2 text-sm text-zinc-400">
        That GitHub username doesn&apos;t exist or has no public profile.
      </p>
      <Link href="/search" className="btn-primary mt-5">
        Search again
      </Link>
    </div>);
}
