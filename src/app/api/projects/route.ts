import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Project from "@/model/Project";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { canManageProjects, isSuperUser } from "@/lib/permissions";

export const runtime = "nodejs";

// GET: Fetch projects
// Public: Approved only
// Admin: Can filter by status
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "approved";
    const id = searchParams.get("id");
    const slug = searchParams.get("slug");

    await dbConnect();

    // Fetch single project by ID or Slug
    if (id || slug) {
      const query = id ? { _id: id } : { slug };
      const project = await Project.findOne(query)
        .populate("author", "name designation buccDepartment")
        .populate("contributors", "name designation buccDepartment");
      
      if (!project) {
        return NextResponse.json({ error: "Project not found" }, { status: 404 });
      }

      // If not approved, check if user is admin or author
      if (project.status !== "approved") {
        const session = await auth.api.getSession({ headers: await headers() });
        const user = session?.user as any;
        const isContributor = project.contributors?.some((c: any) => c._id.toString() === user?.id);
        const isAuthor = user?.id === project.author._id.toString() || isContributor;
        const isAdmin = user && canManageProjects(user);

        if (!isAuthor && !isAdmin) {
          return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
      }

      return NextResponse.json(project);
    }

    // Fetch list
    const session = await auth.api.getSession({ headers: await headers() });
    const user = session?.user as any;
    const isAdmin = user && canManageProjects(user);

    const query: any = {};
    if (isAdmin && status !== "approved") {
      query.status = status;
    } else {
      query.status = "approved";
    }

    const featured = searchParams.get("featured");
    if (featured === "true") {
      query.isFeatured = true;
    }

    const author = searchParams.get("author");
    if (author) {
      query.$or = [
        { author: author },
        { contributors: author }
      ];
    }

    const projects = await Project.find(query)
      .sort({ createdAt: -1 })
      .populate("author", "name designation buccDepartment")
      .populate("contributors", "name designation buccDepartment");

    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST: Create/Submit a project
export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as any;
    const body = await request.json();
    const { title, coverImage, shortDescription, fullDescription, deploymentLink, sourceCodeLink, techStack, contributors } = body;

    if (!title || !coverImage || !shortDescription || !fullDescription) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await dbConnect();

    // If admin is adding, it's auto-approved
    const isAdmin = canManageProjects(user);
    const status = isAdmin ? "approved" : "pending";

    const newProject = await Project.create({
      title,
      coverImage,
      shortDescription,
      fullDescription,
      deploymentLink,
      sourceCodeLink,
      techStack: techStack || [],
      author: user.id,
      contributors: contributors || [],
      status,
    });

    return NextResponse.json({ message: "Project submitted successfully", project: newProject });
  } catch (error) {
    if ((error as any).code === 11000) {
      return NextResponse.json({ error: "A project with this title already exists" }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// PATCH: Update project (Admin edit/approve/reject or Member edit)
export async function PATCH(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as any;
    const body = await request.json();
    const { id, status, isFeatured, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing project ID" }, { status: 400 });
    }

    await dbConnect();
    const project = await Project.findById(id);

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const isAdmin = canManageProjects(user);
    const isContributor = project.contributors?.some((c: any) => c.toString() === user.id);
    const isAuthor = project.author.toString() === user.id || isContributor;

    // Permissions check
    if (!isAdmin && !isAuthor) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Members can only edit if still pending
    if (!isAdmin && project.status !== "pending") {
      return NextResponse.json({ error: "Cannot edit project once it is processed" }, { status: 403 });
    }

    // Only admins can change status
    if (status && !isAdmin) {
      return NextResponse.json({ error: "Only admins can change project status" }, { status: 403 });
    }

    // Only GB and R&D Admins (isSuperUser) can change featured status
    if (isFeatured !== undefined && !isSuperUser(user)) {
      return NextResponse.json({ error: "Only Governing Body and R&D Admins can toggle featured status" }, { status: 403 });
    }

    const updateData: any = { ...updates };
    if (status) updateData.status = status;
    if (isFeatured !== undefined) updateData.isFeatured = isFeatured;
    if (isAdmin && isAuthor === false) {
      updateData.lastEditedBy = user.id;
    }

    const updatedProject = await Project.findByIdAndUpdate(id, updateData, { new: true });

    return NextResponse.json(updatedProject);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE: Remove project
export async function DELETE(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as any;
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing project ID" }, { status: 400 });
    }

    await dbConnect();
    const project = await Project.findById(id);

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const isAdmin = canManageProjects(user);
    const isAuthor = project.author.toString() === user.id;

    if (!isAdmin && !isAuthor) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await Project.findByIdAndDelete(id);

    return NextResponse.json({ message: "Project deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
