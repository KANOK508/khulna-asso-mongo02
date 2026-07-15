import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { ForumPost } from "@/lib/models/ForumPost";
import { ForumComment } from "@/lib/models/ForumComment";
import { requireApproved, getUserCollection } from "@/lib/server-auth";
import { ObjectId } from "mongodb";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { error, user } = await requireApproved(req);
    if (error) return error;

    const { id } = await params;
    const { body } = await req.json();
    if (!body) return NextResponse.json({ error: "Comment body required" }, { status: 400 });

    const post = await ForumPost.findById(id);
    if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });

    const comment = await ForumComment.create({ postId: id, authorId: user.id, body });

    const userCol = await getUserCollection();
    const author = await userCol.findOne(
      { _id: new ObjectId(user.id) },
      { projection: { name: 1, department: 1, batch: 1, photoUrl: 1 } }
    );

    return NextResponse.json(
      { ...comment.toObject(), id: comment._id.toString(), author: author ?? { name: user.name } },
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
