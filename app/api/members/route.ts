import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { getUserCollection } from "@/lib/server-auth";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const userCol = await getUserCollection();

    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") ?? "";
    const department = searchParams.get("department") ?? "";
    const district = searchParams.get("district") ?? "";
    const batch = searchParams.get("batch") ?? "";
    const session = searchParams.get("session") ?? "";
    const bloodGroup = searchParams.get("bloodGroup") ?? "";
    const sort = searchParams.get("sort") ?? "name";
    const order = searchParams.get("order") ?? "asc";
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") ?? "12")));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: Record<string, any> = { status: "approved" };
    if (department) filter.department = department;
    if (district) filter.district = district;
    if (batch) filter.batch = batch;
    if (session) filter.admissionSession = session;
    if (bloodGroup) filter.bloodGroup = bloodGroup;
    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: "i" } },
        { department: { $regex: q, $options: "i" } },
        { district: { $regex: q, $options: "i" } },
        { batch: { $regex: q, $options: "i" } },
      ];
    }

    const sortField = sort === "batch" ? "batch" : sort === "createdAt" ? "createdAt" : "name";
    const sortDir = order === "desc" ? -1 : 1;

    const [data, total] = await Promise.all([
      userCol
        .find(filter, {
          projection: {
            passwordHash: 0,
            emailVerified: 0,
          },
        })
        .sort({ [sortField]: sortDir })
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
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
