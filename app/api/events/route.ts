import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Event } from "@/lib/models/Event";
import { EventAttendee } from "@/lib/models/EventAttendee";
import { requireRole } from "@/lib/server-auth";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const upcoming = searchParams.get("upcoming") === "true";
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
    const limit = Math.min(50, parseInt(searchParams.get("limit") ?? "10"));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: Record<string, any> = { isPublic: true };
    if (upcoming) filter.date = { $gte: new Date() };

    const [events, total] = await Promise.all([
      Event.find(filter)
        .sort({ date: upcoming ? 1 : -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Event.countDocuments(filter),
    ]);

    // Attach attendee count to each event
  const eventIds = events.map((e) => (e._id as { toString(): string }).toString());
const attendeeCounts = await EventAttendee.aggregate([
  { $match: { eventId: { $in: eventIds } } },
  { $group: { _id: "$eventId", count: { $sum: 1 } } },
]);
const countMap = new Map(attendeeCounts.map((a) => [a._id, a.count]));

return NextResponse.json({
  data: events.map((e) => {
    const id = (e._id as { toString(): string }).toString();
    return { ...e, id, attendeeCount: countMap.get(id) ?? 0 };
  }),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { error, user } = await requireRole(req, "superadmin", "dept_admin", "batch_admin");
    if (error) return error;

    const { title, description, date, location, maxAttendees, isPublic } = await req.json();
    if (!title || !description || !date || !location) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const event = await Event.create({
      title,
      description,
      date: new Date(date),
      location,
      organizerId: user.id,
      maxAttendees: maxAttendees ?? null,
      isPublic: isPublic !== false,
    });

    return NextResponse.json({ ...event.toObject(), id: event._id.toString() }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
