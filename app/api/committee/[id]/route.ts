import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { CommitteePosition } from "@/lib/models/CommitteePosition";
import { requireRole } from "@/lib/server-auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { error } = await requireRole(req, "superadmin", "dept_admin", "batch_admin");
    if (error) return error;

    const { id } = await params;
    const { isCurrent } = await req.json();
    const position = await CommitteePosition.findByIdAndUpdate(
      id,
      { $set: { isCurrent } },
      { new: true }
    );
    if (!position) return NextResponse.json({ error: "Position not found" }, { status: 404 });

    return NextResponse.json({ ...position.toObject(), id: position._id.toString() });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { error } = await requireRole(req, "superadmin");
    if (error) return error;

    const { id } = await params;
    await CommitteePosition.findByIdAndDelete(id);
    return NextResponse.json({ message: "Position deleted" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
