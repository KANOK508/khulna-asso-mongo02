import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { EventAttendee } from "@/lib/models/EventAttendee";
import { requireApproved } from "@/lib/server-auth";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { error, user } = await requireApproved(req);
    if (error) return error;

    const { id } = await params;

    const existing = await EventAttendee.findOne({ eventId: id, userId: user.id });
    if (existing) {
      await EventAttendee.deleteOne({ _id: existing._id });
    } else {
      await EventAttendee.create({ eventId: id, userId: user.id });
    }

    const attendeeCount = await EventAttendee.countDocuments({ eventId: id });
    return NextResponse.json({ attending: !existing, attendeeCount });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
