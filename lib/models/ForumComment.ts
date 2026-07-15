import mongoose, { Schema, Document } from "mongoose";

export interface IForumComment extends Document {
  postId: string;
  authorId: string;
  body: string;
  createdAt: Date;
  updatedAt: Date;
}

const ForumCommentSchema = new Schema<IForumComment>(
  {
    postId: { type: String, required: true, index: true },
    authorId: { type: String, required: true },
    body: { type: String, required: true },
  },
  { timestamps: true }
);

export const ForumComment =
  mongoose.models.ForumComment ??
  mongoose.model<IForumComment>("ForumComment", ForumCommentSchema);
