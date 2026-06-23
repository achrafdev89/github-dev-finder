import Link from "next/link";
import { Compass } from "lucide-react";
export default function NotFound() {
    return (<div className="glass mx-auto max-w-md p-10 text-center">
      <Compass className="mx-auto h-9 w-9 text-brand-400"/>
      <h2 className="mt-3 font-display text-2xl font-bold text-zinc-100">Page not found</h2>
      <p className="mt-2 text-sm text-zinc-400">
        That page doesn&apos;t exist. Let&apos;s get you back on track.
      </p>
      <Link href="/" className="btn-primary mt-5">
        Back home
      </Link>
    </div>);
}
