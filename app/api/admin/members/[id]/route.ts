import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { requireRole, getUserCollection } from "@/lib/server-auth";
import { ObjectId } from "mongodb";

// PATCH /api/admin/members/[id] — update role or status
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { error } = await requireRole(req, "superadmin");
    if (error) return error;

    const { id } = await params;
    const body = await req.json();
    const allowed = ["role", "status"];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const update: Record<string, any> = {};
    for (const k of allowed) {
      if (k in body) update[k] = body[k];
    }

    const userCol = await getUserCollection();
    await userCol.updateOne({ _id: new ObjectId(id) }, { $set: update });

    return NextResponse.json({ message: "Member updated" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/admin/members/[id]
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { error } = await requireRole(req, "superadmin");
    if (error) return error;

    const { id } = await params;
    const userCol = await getUserCollection();
    await userCol.deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({ message: "Member deleted successfully" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
