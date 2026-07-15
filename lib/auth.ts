import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI!);

export const auth = betterAuth({
  database: mongodbAdapter(client.db()),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  user: {
    additionalFields: {
      mobile: {
        type: "string",
        required: true,
        defaultValue: "",
        input: true,
      },
      department: {
        type: "string",
        required: true,
        defaultValue: "",
        input: true,
      },
      batch: {
        type: "string",
        required: true,
        defaultValue: "",
        input: true,
      },
      admissionSession: {
        type: "string",
        required: true,
        defaultValue: "",
        input: true,
      },
      district: {
        type: "string",
        required: true,
        defaultValue: "",
        input: true,
      },
      bloodGroup: {
        type: "string",
        required: false,
        defaultValue: null,
        input: true,
      },
      photoUrl: {
        type: "string",
        required: false,
        defaultValue: null,
        input: true,
      },
      role: {
        type: "string",
        required: false,
        defaultValue: "member",
        input: false, // Not settable by users at signup
      },
      status: {
        type: "string",
        required: false,
        defaultValue: "pending",
        input: false, // Only admins change this
      },
      approvedBy: {
        type: "string",
        required: false,
        defaultValue: null,
        input: false,
      },
      approvedAt: {
        type: "date",
        required: false,
        defaultValue: null,
        input: false,
      },
    },
  },
  trustedOrigins: [
    process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  ],
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user & {
  mobile: string;
  department: string;
  batch: string;
  admissionSession: string;
  district: string;
  bloodGroup: string | null;
  photoUrl: string | null;
  role: "superadmin" | "dept_admin" | "batch_admin" | "member";
  status: "pending" | "approved" | "rejected";
  approvedBy: string | null;
  approvedAt: Date | null;
};
