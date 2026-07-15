// import { NextRequest, NextResponse } from "next/server";
// import connectDB from "@/lib/mongodb";
// import { Event } from "@/lib/models/Event";
// import { EventAttendee } from "@/lib/models/EventAttendee";
// import { requireRole, requireAuth } from "@/lib/server-auth";

// export async function GET(
//   req: NextRequest,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   try {
//     await connectDB();
//     const { id } = await params;
//     const event = await Event.findById(id).lean();
//     if (!event) return NextResponse.json({ error: "Event not found" }, { status: 404 });

//     const session = await requireAuth(req);
//     const userId = session.user?.id;

//     const [attendeeCount, attending] = await Promise.all([
//       EventAttendee.countDocuments({ eventId: id }),
//       userId ? EventAttendee.exists({ eventId: id, userId }) : Promise.resolve(null),
//     ]);

//     return NextResponse.json({ ...event, id: event._id.toString(), attendeeCount, attending: !!attending });
//   } catch (err) {
//     console.error(err);
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 });
//   }
// }

// export async function PATCH(
//   req: NextRequest,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   try {
//     await connectDB();
//     const { error } = await requireRole(req, "superadmin", "dept_admin", "batch_admin");
//     if (error) return error;

//     const { id } = await params;
//     const body = await req.json();
//     const allowed = ["title", "description", "date", "location", "maxAttendees", "isPublic"];
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     const update: Record<string, any> = {};
//     for (const k of allowed) {
//       if (k in body) update[k] = k === "date" ? new Date(body[k]) : body[k];
//     }

//     const event = await Event.findByIdAndUpdate(id, { $set: update }, { new: true });
//     if (!event) return NextResponse.json({ error: "Event not found" }, { status: 404 });

//     return NextResponse.json({ ...event.toObject(), id: event._id.toString() });
//   } catch (err) {
//     console.error(err);
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 });
//   }
// }

// export async function DELETE(
//   req: NextRequest,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   try {
//     await connectDB();
//     const { error } = await requireRole(req, "superadmin", "dept_admin", "batch_admin");
//     if (error) return error;

//     const { id } = await params;
//     await Event.findByIdAndDelete(id);
//     return NextResponse.json({ message: "Event deleted" });
//   } catch (err) {
//     console.error(err);
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 });
//   }
// }


import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Event } from "@/lib/models/Event";
import { EventAttendee } from "@/lib/models/EventAttendee";
import { requireRole, requireAuth } from "@/lib/server-auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const event = (await Event.findById(id).lean()) as Record<string, unknown> | null;
    if (!event) return NextResponse.json({ error: "Event not found" }, { status: 404 });

    const session = await requireAuth(req);
    const userId = session.user?.id;

    const [attendeeCount, attending] = await Promise.all([
      EventAttendee.countDocuments({ eventId: id }),
      userId ? EventAttendee.exists({ eventId: id, userId }) : Promise.resolve(null),
    ]);

    return NextResponse.json({
      ...event,
      id: (event._id as { toString(): string }).toString(),
      attendeeCount,
      attending: !!attending,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { error } = await requireRole(req, "superadmin", "dept_admin", "batch_admin");
    if (error) return error;

    const { id } = await params;
    const body = await req.json();
    const allowed = ["title", "description", "date", "location", "maxAttendees", "isPublic"];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const update: Record<string, any> = {};
    for (const k of allowed) {
      if (k in body) update[k] = k === "date" ? new Date(body[k]) : body[k];
    }

    const event = await Event.findByIdAndUpdate(id, { $set: update }, { new: true });
    if (!event) return NextResponse.json({ error: "Event not found" }, { status: 404 });

    return NextResponse.json({ ...event.toObject(), id: event._id.toString() });
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
    const { error } = await requireRole(req, "superadmin", "dept_admin", "batch_admin");
    if (error) return error;

    const { id } = await params;
    await Event.findByIdAndDelete(id);
    return NextResponse.json({ message: "Event deleted" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}