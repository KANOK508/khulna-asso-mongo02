import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { District } from "@/lib/models/District";

export async function GET() {
  try {
    await connectDB();
    const districts = await District.find().sort({ name: 1 }).lean();
  return NextResponse.json(
  districts.map((d) => ({ ...d, id: (d._id as { toString(): string }).toString() }))
);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
