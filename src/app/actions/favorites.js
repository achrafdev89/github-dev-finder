"use server";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Favorite } from "@/lib/models/Favorite";
async function requireEmail() {
    const session = await auth();
    return session?.user?.email ?? null;
}
export async function toggleFavorite(dev) {
    const email = await requireEmail();
    if (!email)
        return { ok: false, favorited: false, error: "Sign in to save developers." };
    await connectDB();
    const existing = await Favorite.findOne({ userEmail: email, login: dev.login });
    if (existing) {
        await existing.deleteOne();
        revalidatePath("/favorites");
        revalidatePath("/dashboard");
        return { ok: true, favorited: false };
    }
    await Favorite.create({ userEmail: email, ...dev });
    revalidatePath("/favorites");
    revalidatePath("/dashboard");
    return { ok: true, favorited: true };
}
export async function isFavorited(login) {
    const email = await requireEmail();
    if (!email)
        return false;
    await connectDB();
    return !!(await Favorite.findOne({ userEmail: email, login }));
}
export async function listFavorites() {
    const email = await requireEmail();
    if (!email)
        return [];
    await connectDB();
    const docs = await Favorite.find({ userEmail: email }).sort({ createdAt: -1 }).lean();
    return docs.map((d) => ({
        _id: String(d._id),
        userEmail: d.userEmail,
        login: d.login,
        name: d.name ?? null,
        avatar_url: d.avatar_url,
        bio: d.bio ?? null,
        followers: d.followers ?? 0,
        public_repos: d.public_repos ?? 0,
        createdAt: d.createdAt?.toISOString?.() ?? new Date().toISOString(),
    }));
}
