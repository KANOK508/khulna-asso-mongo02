import mongoose, { Schema, Document } from "mongoose";

export interface IEventAttendee extends Document {
  eventId: string;
  userId: string;
  createdAt: Date;
}

const EventAttendeeSchema = new Schema<IEventAttendee>(
  {
    eventId: { type: String, required: true, index: true },
    userId: { type: String, required: true },
  },
  { timestamps: true }
);

EventAttendeeSchema.index({ eventId: 1, userId: 1 }, { unique: true });

export const EventAttendee =
  mongoose.models.EventAttendee ??
  mongoose.model<IEventAttendee>("EventAttendee", EventAttendeeSchema);
