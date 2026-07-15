import mongoose, { Schema, Document } from "mongoose";

export interface IDepartment extends Document {
  name: string;
  code: string;
}

const DepartmentSchema = new Schema<IDepartment>({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
});

export const Department =
  mongoose.models.Department ??
  mongoose.model<IDepartment>("Department", DepartmentSchema);
