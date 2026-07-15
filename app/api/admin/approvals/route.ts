import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { requireRole, getUserCollection } from "@/lib/server-auth";
import { ObjectId } from "mongodb";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { error, user } = await requireRole(req, "superadmin", "dept_admin", "batch_admin");
    if (error) return error;

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
    const limit = Math.min(100, parseInt(searchParams.get("limit") ?? "20"));

    const userCol = await getUserCollection();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: Record<string, any> = { status: "pending" };
    if (user.role === "dept_admin") filter.department = user.department;
    if (user.role === "batch_admin") filter.batch = user.batch;

    const [data, total] = await Promise.all([
      userCol
        .find(filter, { projection: { passwordHash: 0 } })
        .sort({ createdAt: 1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .toArray(),
      userCol.countDocuments(filter),
    ]);

    return NextResponse.json({
      data: data.map((u) => ({ ...u, id: u._id.toString() })),
      total,
      page,
      limit,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await connectDB();
    const { error, user } = await requireRole(req, "superadmin", "dept_admin", "batch_admin");
    if (error) return error;

    const { id, action } = await req.json();
    if (!id || !["approve", "reject"].includes(action)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const userCol = await getUserCollection();
    let query;
    try {
      query = { _id: new ObjectId(id) };
    } catch {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const target = await userCol.findOne(query);
    if (!target) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Scope checks
    if (user.role === "dept_admin" && target.department !== user.department) {
      return NextResponse.json({ error: "Cannot approve members from other departments" }, { status: 403 });
    }
    if (user.role === "batch_admin" && target.batch !== user.batch) {
      return NextResponse.json({ error: "Cannot approve members from other batches" }, { status: 403 });
    }

    await userCol.updateOne(query, {
      $set: {
        status: action === "approve" ? "approved" : "rejected",
        approvedBy: user.id,
        approvedAt: new Date(),
      },
    });

    return NextResponse.json({ message: `Member ${action === "approve" ? "approved" : "rejected"} successfully` });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
