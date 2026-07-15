import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { ForumPost } from "@/lib/models/ForumPost";
import { ForumComment } from "@/lib/models/ForumComment";
import { requireApproved } from "@/lib/server-auth";
import { getUserCollection } from "@/lib/server-auth";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") ?? "";
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
    const limit = Math.min(50, parseInt(searchParams.get("limit") ?? "10"));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: Record<string, any> = {};
    if (category) filter.category = category;

    const [posts, total] = await Promise.all([
      ForumPost.find(filter)
        .sort({ isPinned: -1, createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      ForumPost.countDocuments(filter),
    ]);

    // Attach comment counts and author names
    const postIds = posts.map((p) => p._id.toString());
    const authorIds = [...new Set(posts.map((p) => p.authorId))];

    const userCol = await getUserCollection();
    const { ObjectId } = await import("mongodb");

    const [commentCounts, authors] = await Promise.all([
      ForumComment.aggregate([
        { $match: { postId: { $in: postIds } } },
        { $group: { _id: "$postId", count: { $sum: 1 } } },
      ]),
      userCol
        .find(
          { _id: { $in: authorIds.filter((id) => ObjectId.isValid(id)).map((id) => new ObjectId(id)) } } as object,
          { projection: { name: 1, department: 1, batch: 1, photoUrl: 1 } }
        )
        .toArray(),
    ]);

    const commentCountMap = new Map(commentCounts.map((c) => [c._id, c.count]));
    const authorMap = new Map(authors.map((a) => [a._id.toString(), a]));

    return NextResponse.json({
      data: posts.map((p) => ({
        ...p,
        id: p._id.toString(),
        commentCount: commentCountMap.get(p._id.toString()) ?? 0,
        author: authorMap.get(p.authorId) ?? { name: "Unknown" },
      })),
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
    const { error, user } = await requireApproved(req);
    if (error) return error;

    const { title, body, category } = await req.json();
    if (!title || !body || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!["jobs", "guidance", "news", "general"].includes(category)) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }

    const post = await ForumPost.create({
      title,
      body,
      category,
      authorId: user.id,
      isPinned: false,
    });

    return NextResponse.json({ ...post.toObject(), id: post._id.toString() }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
