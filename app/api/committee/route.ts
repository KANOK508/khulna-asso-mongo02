import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { CommitteePosition } from "@/lib/models/CommitteePosition";
import { requireRole, getUserCollection } from "@/lib/server-auth";
import { ObjectId } from "mongodb";

async function enrichPositions(positions: Record<string, unknown>[]) {
  const userIds = [...new Set(positions.map((p) => p.userId as string))];
  const userCol = await getUserCollection();
  const users = await userCol
    .find(
      { _id: { $in: userIds.filter((id) => ObjectId.isValid(id)).map((id) => new ObjectId(id)) } } as object,
      { projection: { name: 1, email: 1, department: 1, batch: 1, photoUrl: 1, district: 1 } }
    )
    .toArray();
  const userMap = new Map(users.map((u) => [u._id.toString(), u]));

  return positions.map((p) => ({
    ...p,
    id: (p._id as unknown as { toString(): string }).toString(),
    member: userMap.get(p.userId as string) ?? null,
  }));
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const year = searchParams.get("year") ?? "";
    const current = searchParams.get("current") === "true";

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: Record<string, any> = {};
    if (year) filter.year = year;
    if (current) filter.isCurrent = true;

    const positions = await CommitteePosition.find(filter)
      .sort({ createdAt: -1 })
      .lean() as unknown as Record<string, unknown>[];

    const enriched = await enrichPositions(positions);
    const currentPositions = enriched.filter((p) => p.isCurrent);
    const history = enriched.filter((p) => !p.isCurrent);
    const years = [...new Set(enriched.map((p) => p.year as string))].sort().reverse();

    return NextResponse.json({ current: currentPositions, history, years });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { error } = await requireRole(req, "superadmin", "dept_admin", "batch_admin");
    if (error) return error;

    const { title, userId, year, isCurrent = true } = await req.json();
    if (!title || !userId || !year) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (isCurrent) {
      await CommitteePosition.updateMany(
        { title, isCurrent: true },
        { $set: { isCurrent: false } }
      );
    }

    const position = await CommitteePosition.create({ title, userId, year, isCurrent });
    const [enriched] = await enrichPositions([position.toObject() as unknown as Record<string, unknown>]);
    return NextResponse.json(enriched, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
