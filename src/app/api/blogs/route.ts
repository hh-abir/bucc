import { auth } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import Blog from "@/model/Blog";
import { NextResponse } from "next/server";
import { canManageBlogs } from "@/lib/permissions";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const publicView = searchParams.get("publicView");

  await dbConnect();

  try {
    if (publicView) {
      const blogs = await Blog.find({ status: "published" }).sort({ createdDate: -1 });
      return NextResponse.json(blogs);
    }

    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as any;
    const isManager = canManageBlogs(user);

    // If manager (EB/GB), return all blogs for moderation/viewing.
    // If regular member, return only their own blogs.
    const query = isManager ? {} : { "author.authorId": user.id };
    const blogs = await Blog.find(query).sort({ createdDate: -1 });
    return NextResponse.json(blogs);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  try {
    const body = await request.json();
    const { title, description, featuredImage, content, category, tags, status } = body;

    if (!title || !content || !featuredImage) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const user = session.user as any;
    const isManager = canManageBlogs(user);

    // Determine status: 
    // - If saved explicitly as "draft", keep it "draft".
    // - Otherwise, if user is EB/GB, set to "published". Otherwise, set to "pending".
    let blogStatus = "pending";
    if (status === "draft") {
      blogStatus = "draft";
    } else {
      blogStatus = isManager ? "published" : "pending";
    }

    const newBlog = await Blog.create({
      title,
      description,
      featuredImage,
      content,
      category,
      tags,
      author: {
        authorId: user.id,
        authorName: user.name,
        authorEmail: user.email,
        authorDesignation: user.designation,
        authorDepartment: user.buccDepartment,
      },
      status: blogStatus,
    });

    return NextResponse.json(newBlog, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create blog" }, { status: 400 });
  }
}
