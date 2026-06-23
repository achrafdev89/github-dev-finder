import { Schema, models, model } from "mongoose";
const FavoriteSchema = new Schema({
    userEmail: { type: String, required: true, index: true },
    login: { type: String, required: true },
    name: { type: String, default: null },
    avatar_url: { type: String, required: true },
    bio: { type: String, default: null },
    followers: { type: Number, default: 0 },
    public_repos: { type: Number, default: 0 },
}, { timestamps: true });
// One favorite per (user, developer) pair.
FavoriteSchema.index({ userEmail: 1, login: 1 }, { unique: true });
export const Favorite = models.Favorite || model("Favorite", FavoriteSchema);
