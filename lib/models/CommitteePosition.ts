import mongoose, { Schema, Document } from "mongoose";

export interface ICommitteePosition extends Document {
  title: string;
  userId: string;
  year: string;
  isCurrent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CommitteePositionSchema = new Schema<ICommitteePosition>(
  {
    title: { type: String, required: true },
    userId: { type: String, required: true, index: true },
    year: { type: String, required: true },
    isCurrent: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const CommitteePosition =
  mongoose.models.CommitteePosition ??
  mongoose.model<ICommitteePosition>(
    "CommitteePosition",
    CommitteePositionSchema
  );
