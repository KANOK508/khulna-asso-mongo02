import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Event } from "@/lib/models/Event";
import { ForumPost } from "@/lib/models/ForumPost";
import { getUserCollection } from "@/lib/server-auth";

export async function GET(_req: NextRequest) {
  try {
    await connectDB();
    const userCol = await getUserCollection();
    const now = new Date();

    const [
      totalMembers,
      pendingApprovals,
      totalEvents,
      totalForumPosts,
      upcomingEvents,
      byDept,
      byDistrict,
      bySession,
    ] = await Promise.all([
      userCol.countDocuments({ status: "approved" }),
      userCol.countDocuments({ status: "pending" }),
      Event.countDocuments(),
      ForumPost.countDocuments(),
      Event.countDocuments({ date: { $gte: now } }),
      userCol.aggregate([
        { $match: { status: "approved" } },
        { $group: { _id: "$department", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 15 },
      ]).toArray(),
      userCol.aggregate([
        { $match: { status: "approved" } },
        { $group: { _id: "$district", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]).toArray(),
      userCol.aggregate([
        { $match: { status: "approved" } },
        { $group: { _id: "$admissionSession", count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]).toArray(),
    ]);

    return NextResponse.json({
      totalMembers,
      pendingApprovals,
      totalEvents,
      totalForumPosts,
      upcomingEvents,
      byDepartment: byDept.map((d) => ({ department: d._id, count: d.count })),
      byDistrict: byDistrict.map((d) => ({ district: d._id, count: d.count })),
      bySession: bySession.map((d) => ({ session: d._id, count: d.count })),
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
