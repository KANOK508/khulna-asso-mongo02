import mongoose, { Schema, Document } from "mongoose";

export interface IMemberProfile extends Document {
  userId: string;
  currentJob: string | null;
  company: string | null;
  location: string | null;
  bio: string | null;
  activities: string[];
  skills: string[];
  linkedinUrl: string | null;
  facebookUrl: string | null;
  websiteUrl: string | null;
  updatedAt: Date;
}

const MemberProfileSchema = new Schema<IMemberProfile>(
  {
    userId: { type: String, required: true, unique: true, index: true },
    currentJob: { type: String, default: null },
    company: { type: String, default: null },
    location: { type: String, default: null },
    bio: { type: String, default: null },
    activities: { type: [String], default: [] },
    skills: { type: [String], default: [] },
    linkedinUrl: { type: String, default: null },
    facebookUrl: { type: String, default: null },
    websiteUrl: { type: String, default: null },
  },
  { timestamps: true }
);

export const MemberProfile =
  mongoose.models.MemberProfile ??
  mongoose.model<IMemberProfile>("MemberProfile", MemberProfileSchema);
