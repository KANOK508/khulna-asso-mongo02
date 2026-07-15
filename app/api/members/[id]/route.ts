import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { MemberProfile } from "@/lib/models/MemberProfile";
import { requireAuth, getUserCollection } from "@/lib/server-auth";
import { ObjectId } from "mongodb";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const userCol = await getUserCollection();

    let query;
    try {
      query = { _id: new ObjectId(id) };
    } catch {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    const user = await userCol.findOne(query, {
      projection: { passwordHash: 0, emailVerified: 0 },
    });

    if (!user) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    const profile = await MemberProfile.findOne({ userId: id });

    return NextResponse.json({
      ...user,
      id: user._id.toString(),
      currentJob: profile?.currentJob ?? null,
      company: profile?.company ?? null,
      location: profile?.location ?? null,
      bio: profile?.bio ?? null,
      activities: profile?.activities ?? [],
      skills: profile?.skills ?? [],
      linkedinUrl: profile?.linkedinUrl ?? null,
      facebookUrl: profile?.facebookUrl ?? null,
      websiteUrl: profile?.websiteUrl ?? null,
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
    const { error, user } = await requireAuth(req);
    if (error) return error;

    const { id } = await params;
    if (user.id !== id && user.role !== "superadmin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const allowed = [
      "currentJob", "company", "location", "bio",
      "activities", "skills", "linkedinUrl", "facebookUrl", "websiteUrl",
    ];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const update: Record<string, any> = {};
    for (const k of allowed) {
      if (k in body) update[k] = body[k];
    }

    await MemberProfile.findOneAndUpdate(
      { userId: id },
      { $set: update },
      { upsert: true, new: true }
    );

    return NextResponse.json({ message: "Profile updated" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
