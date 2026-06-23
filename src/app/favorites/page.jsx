import Link from "next/link";
import { auth } from "@/lib/auth";
import { listFavorites } from "@/app/actions/favorites";
import { SignInPrompt } from "@/components/SignInPrompt";
import { FavoritesGrid } from "@/components/FavoritesGrid";
import { PageTransition } from "@/components/Motion";
import { Heart } from "lucide-react";
export const metadata = { title: "Favorites" };
export default async function FavoritesPage() {
    const session = await auth();
    if (!session?.user) {
        return (<SignInPrompt title="Saved developers" body="Sign in with GitHub to save developers and revisit them anytime."/>);
    }
    const favorites = await listFavorites();
    return (<PageTransition>
      <div className="pb-12">
        <div className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-rose-400"/>
          <p className="eyebrow !text-rose-400">~/ favorites</p>
        </div>
        <h1 className="mt-2 font-display text-3xl font-bold text-zinc-100">Saved developers</h1>
        <p className="mt-2 text-zinc-400">
          {favorites.length
            ? `${favorites.length} developer${favorites.length > 1 ? "s" : ""} saved.`
            : "You haven't saved any developers yet."}
        </p>

        <div className="mt-8">
          {favorites.length ? (<FavoritesGrid favorites={favorites}/>) : (<div className="glass mx-auto max-w-md p-10 text-center">
              <p className="text-sm text-zinc-400">
                Find a developer and tap <span className="text-rose-400">Save</span> to add them
                here.
              </p>
              <Link href="/search" className="btn-primary mt-5">
                Search developers
              </Link>
            </div>)}
        </div>
      </div>
    </PageTransition>);
}
