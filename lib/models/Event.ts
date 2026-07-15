import mongoose, { Schema, Document } from "mongoose";

export interface IEvent extends Document {
  title: string;
  description: string;
  date: Date;
  location: string;
  organizerId: string;
  maxAttendees: number | null;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true, index: true },
    location: { type: String, required: true },
    organizerId: { type: String, required: true },
    maxAttendees: { type: Number, default: null },
    isPublic: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Event =
  mongoose.models.Event ?? mongoose.model<IEvent>("Event", EventSchema);
