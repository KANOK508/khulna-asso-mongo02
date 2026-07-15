import mongoose, { Schema, Document } from "mongoose";

export type ForumCategory = "jobs" | "guidance" | "news" | "general";

export interface IForumPost extends Document {
  title: string;
  body: string;
  category: ForumCategory;
  authorId: string;
  isPinned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ForumPostSchema = new Schema<IForumPost>(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
    category: {
      type: String,
      enum: ["jobs", "guidance", "news", "general"],
      required: true,
    },
    authorId: { type: String, required: true, index: true },
    isPinned: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const ForumPost =
  mongoose.models.ForumPost ??
  mongoose.model<IForumPost>("ForumPost", ForumPostSchema);
