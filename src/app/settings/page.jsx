import Image from "next/image";
import { auth } from "@/lib/auth";
import { listSearchHistory } from "@/app/actions/history";
import { listFavorites } from "@/app/actions/favorites";
import { SignInPrompt } from "@/components/SignInPrompt";
import { SettingsActions } from "@/components/SettingsActions";
import { PageTransition } from "@/components/Motion";
import { Settings as SettingsIcon } from "lucide-react";
export const metadata = { title: "Settings" };
export default async function SettingsPage() {
    const session = await auth();
    if (!session?.user) {
        return (<SignInPrompt title="Settings" body="Sign in with GitHub to manage your account and data."/>);
    }
    const [history, favorites] = await Promise.all([listSearchHistory(100), listFavorites()]);
    return (<PageTransition>
      <div className="mx-auto max-w-2xl space-y-6 pb-12">
        <div className="flex items-center gap-2">
          <SettingsIcon className="h-5 w-5 text-zinc-400"/>
          <p className="eyebrow">~/ settings</p>
        </div>
        <h1 className="font-display text-3xl font-bold text-zinc-100">Account</h1>

        {/* Profile */}
        <section className="glass p-6">
          <h2 className="font-display font-semibold text-zinc-100">Signed in as</h2>
          <div className="mt-4 flex items-center gap-4">
            {session.user.image && (<Image src={session.user.image} alt={session.user.name ?? "avatar"} width={56} height={56} className="rounded-full ring-2 ring-brand/40"/>)}
            <div>
              <p className="font-medium text-zinc-100">{session.user.name}</p>
              <p className="text-sm text-zinc-500">{session.user.email}</p>
            </div>
          </div>
        </section>

        {/* Data summary */}
        <section className="glass p-6">
          <h2 className="font-display font-semibold text-zinc-100">Your data</h2>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-white/[0.03] p-4">
              <p className="font-display text-2xl font-bold text-zinc-100">{favorites.length}</p>
              <p className="text-sm text-zinc-500">saved developers</p>
            </div>
            <div className="rounded-xl bg-white/[0.03] p-4">
              <p className="font-display text-2xl font-bold text-zinc-100">{history.length}</p>
              <p className="text-sm text-zinc-500">searches recorded</p>
            </div>
          </div>
        </section>

        {/* Actions */}
        <SettingsActions historyCount={history.length}/>
      </div>
    </PageTransition>);
}
