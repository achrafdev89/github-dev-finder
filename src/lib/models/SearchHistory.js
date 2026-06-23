import { Schema, models, model } from "mongoose";
const SearchHistorySchema = new Schema({
    userEmail: { type: String, required: true, index: true },
    query: { type: String, required: true },
    resultLogin: { type: String, default: null },
}, { timestamps: true });
export const SearchHistory = models.SearchHistory || model("SearchHistory", SearchHistorySchema);
