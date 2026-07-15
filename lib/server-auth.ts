/**
 * Server-side auth helpers for API routes.
 */
import { auth, type User } from "./auth";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "./mongodb";
import mongoose from "mongoose";

export async function getServerSession() {
  const session = await auth.api.getSession({ headers: await headers() });
  return session;
}

export async function requireAuth(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user) {
    return { error: NextResponse.json({ error: "Authentication required" }, { status: 401 }), user: null };
  }
  return { error: null, user: session.user as User };
}

export async function requireRole(req: NextRequest, ...roles: User["role"][]) {
  const { error, user } = await requireAuth(req);
  if (error) return { error, user: null };
  if (!roles.includes(user!.role)) {
    return {
      error: NextResponse.json({ error: "Insufficient permissions" }, { status: 403 }),
      user: null,
    };
  }
  return { error: null, user: user! };
}

export async function requireApproved(req: NextRequest) {
  const { error, user } = await requireAuth(req);
  if (error) return { error, user: null };
  if (user!.status !== "approved") {
    return {
      error: NextResponse.json({ error: "Account pending approval" }, { status: 403 }),
      user: null,
    };
  }
  return { error: null, user: user! };
}

/**
 * Access the Better Auth "user" MongoDB collection directly for admin operations.
 * We use the native MongoDB driver through Mongoose's connection.
 */
export async function getUserCollection() {
  await connectDB();
  const db = mongoose.connection.db!;
  return db.collection("user");
}
