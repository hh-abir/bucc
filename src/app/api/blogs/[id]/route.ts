import { auth } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import Blog from "@/model/Blog";
import { NextResponse } from "next/server";
import { canManageBlogs } from "@/lib/permissions";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  await dbConnect();
  try {
    const { id } = await params;
    const blog = await Blog.findById(id);
    if (!blog) return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    return NextResponse.json(blog);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch blog" }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  try {
    const { id } = await params;
    const blog = await Blog.findById(id);
    
    if (!blog) return NextResponse.json({ error: "Blog not found" }, { status: 404 });

    const user = session.user as any;
    const isAuthor = blog.author.authorId.toString() === user.id.toString();
    const isManager = canManageBlogs(user);

    if (!isAuthor && !isManager) {
      return NextResponse.json({ error: "Unauthorized to edit this blog" }, { status: 403 });
    }

    const body = await request.json();
    const { status, ...updates } = body;

    const updateData: any = { ...updates };

    if (isManager) {
      // Managers can change status (e.g., publish/approve or put back to draft/pending)
      if (status !== undefined) {
        updateData.status = status;
      }
    } else {
      // Authors who are NOT managers:
      // Can only edit if status is draft or pending
      if (blog.status === "published") {
        return NextResponse.json({ error: "Cannot edit an already published blog" }, { status: 403 });
      }

      // Can transition status from draft to pending, but not directly to published
      if (status !== undefined) {
        if (status === "published") {
          return NextResponse.json({ error: "Unauthorized to publish directly" }, { status: 403 });
        }
        updateData.status = status;
      }
    }

    updateData.lastUpdate = Date.now();

    const updatedBlog = await Blog.findByIdAndUpdate(id, updateData, { new: true });
    return NextResponse.json(updatedBlog);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update blog" }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  try {
    const { id } = await params;
    const blog = await Blog.findById(id);
    
    if (!blog) return NextResponse.json({ error: "Blog not found" }, { status: 404 });

    const user = session.user as any;
    const isAuthor = blog.author.authorId.toString() === user.id.toString();
    const isManager = canManageBlogs(user);

    if (!isManager && !isAuthor) {
      return NextResponse.json({ error: "Unauthorized to delete this blog" }, { status: 403 });
    }

    // Authors can only delete if draft or pending
    if (!isManager && blog.status === "published") {
      return NextResponse.json({ error: "Cannot delete an already published blog" }, { status: 403 });
    }

    await Blog.findByIdAndDelete(id);
    return NextResponse.json({ message: "Blog deleted" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete blog" }, { status: 500 });
  }
}
