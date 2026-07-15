import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { ForumPost } from "@/lib/models/ForumPost";
import { ForumComment } from "@/lib/models/ForumComment";
import { requireAuth, requireRole, getUserCollection } from "@/lib/server-auth";
import { ObjectId } from "mongodb";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const post = await ForumPost.findById(id).lean();
    if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });

    const comments = await ForumComment.find({ postId: id })
      .sort({ createdAt: 1 })
      .lean();

    const authorIds = [post.authorId, ...comments.map((c) => c.authorId)];
    const uniqueIds = [...new Set(authorIds)];
    const userCol = await getUserCollection();
    const users = await userCol
      .find(
        { _id: { $in: uniqueIds.filter((id) => ObjectId.isValid(id)).map((id) => new ObjectId(id)) } } as object,
        { projection: { name: 1, department: 1, batch: 1, photoUrl: 1 } }
      )
      .toArray();
    const userMap = new Map(users.map((u) => [u._id.toString(), u]));

    return NextResponse.json({
      ...post,
      id: post._id.toString(),
      author: userMap.get(post.authorId) ?? { name: "Unknown" },
      comments: comments.map((c) => ({
        ...c,
        id: c._id.toString(),
        author: userMap.get(c.authorId) ?? { name: "Unknown" },
      })),
    });
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
    const { error, user } = await requireAuth(req);
    if (error) return error;

    const { id } = await params;
    const post = await ForumPost.findById(id);
    if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });

    if (post.authorId !== user.id && user.role !== "superadmin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await Promise.all([
      ForumPost.findByIdAndDelete(id),
      ForumComment.deleteMany({ postId: id }),
    ]);

    return NextResponse.json({ message: "Post deleted" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH — pin/unpin (admin only)
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { error } = await requireRole(req, "superadmin", "dept_admin", "batch_admin");
    if (error) return error;

    const { id } = await params;
    const { isPinned } = await req.json();
    const post = await ForumPost.findByIdAndUpdate(id, { $set: { isPinned } }, { new: true });
    if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });

    return NextResponse.json({ ...post.toObject(), id: post._id.toString() });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
