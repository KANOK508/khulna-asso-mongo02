import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Department } from "@/lib/models/Department";

export async function GET() {
  try {
    await connectDB();
    const departments = await Department.find().sort({ name: 1 }).lean();
    return NextResponse.json(departments.map((d) => ({ ...d, id: d._id.toString() })));
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
