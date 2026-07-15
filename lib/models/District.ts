import mongoose, { Schema, Document } from "mongoose";

export interface IDistrict extends Document {
  name: string;
  division: string;
}

const DistrictSchema = new Schema<IDistrict>({
  name: { type: String, required: true, unique: true },
  division: { type: String, default: "Khulna" },
});

export const District =
  mongoose.models.District ??
  mongoose.model<IDistrict>("District", DistrictSchema);
