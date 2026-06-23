"use server";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { SearchHistory } from "@/lib/models/SearchHistory";
async function requireEmail() {
    const session = await auth();
    return session?.user?.email ?? null;
}
export async function recordSearch(query, resultLogin) {
    const email = await requireEmail();
    if (!email || !query.trim())
        return;
    await connectDB();
    await SearchHistory.create({ userEmail: email, query: query.trim(), resultLogin });
    // Keep only the 50 most recent per user.
    const extra = await SearchHistory.find({ userEmail: email })
        .sort({ createdAt: -1 })
        .skip(50)
        .select("_id");
    if (extra.length) {
        await SearchHistory.deleteMany({ _id: { $in: extra.map((e) => e._id) } });
    }
}
export async function listSearchHistory(limit = 20) {
    const email = await requireEmail();
    if (!email)
        return [];
    await connectDB();
    const docs = await SearchHistory.find({ userEmail: email })
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean();
    return docs.map((d) => ({
        _id: String(d._id),
        userEmail: d.userEmail,
        query: d.query,
        resultLogin: d.resultLogin ?? null,
        createdAt: d.createdAt?.toISOString?.() ?? new Date().toISOString(),
    }));
}
export async function clearSearchHistory() {
    const email = await requireEmail();
    if (!email)
        return;
    await connectDB();
    await SearchHistory.deleteMany({ userEmail: email });
    revalidatePath("/dashboard");
}
