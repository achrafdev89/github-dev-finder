"use client";
import { useState, useTransition } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { toggleFavorite } from "@/app/actions/favorites";
export function FavoriteButton({ user, initial = false, }) {
    const { status } = useSession();
    const [fav, setFav] = useState(initial);
    const [pending, start] = useTransition();
    const [hint, setHint] = useState(null);
    function onClick() {
        if (status !== "authenticated") {
            setHint("Sign in to save developers.");
            setTimeout(() => setHint(null), 2500);
            return;
        }
        // optimistic
        setFav((v) => !v);
        start(async () => {
            const res = await toggleFavorite({
                login: user.login,
                name: user.name,
                avatar_url: user.avatar_url,
                bio: user.bio,
                followers: user.followers,
                public_repos: user.public_repos,
            });
            if (!res.ok) {
                setFav((v) => !v); // revert
                setHint(res.error ?? "Something went wrong.");
                setTimeout(() => setHint(null), 2500);
            }
        });
    }
    return (<div className="relative">
      <motion.button whileTap={{ scale: 0.92 }} onClick={onClick} disabled={pending} aria-pressed={fav} className={`btn-ghost ${fav ? "!text-rose-400 !border-rose-400/40" : ""}`}>
        <Heart className={`h-4 w-4 ${fav ? "fill-rose-400" : ""}`}/>
        {fav ? "Saved" : "Save"}
      </motion.button>
      {hint && (<span className="absolute left-0 top-full mt-2 whitespace-nowrap rounded-lg bg-elevated px-3 py-1.5 text-xs text-zinc-300 shadow-glass">
          {hint}
        </span>)}
    </div>);
}
