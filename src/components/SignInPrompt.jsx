"use client";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { Github, Lock } from "lucide-react";
export function SignInPrompt({ title = "Sign in required", body = "Sign in with GitHub to continue.", }) {
    return (<motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass mx-auto max-w-md p-10 text-center">
      <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-brand/10 text-brand-400">
        <Lock className="h-5 w-5"/>
      </span>
      <h2 className="mt-4 font-display text-xl font-bold text-zinc-100">{title}</h2>
      <p className="mt-2 text-sm text-zinc-400">{body}</p>
      <button onClick={() => signIn("github")} className="btn-primary mt-6">
        <Github className="h-4 w-4"/>
        Sign in with GitHub
      </button>
    </motion.div>);
}
