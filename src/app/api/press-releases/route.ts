import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import PressRelease from "@/model/PressRelease";
import { NextRequest, NextResponse } from "next/server";
import { isGoverningBody as checkGB } from "@/lib/permissions";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    const session = await auth();
    const user = session?.user as any;

    if (id) {
      const release = await PressRelease.findById(id);
      if (!release) return NextResponse.json({ error: "Press Release not found" }, { status: 404 });

      // If not published, check authorization
      if (release.status !== "published") {
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const isAlumni = user?.memberStatus === "Alumni";
        const isGB = checkGB(user);
        const isPRDept = !isAlumni && user.buccDepartment === "Press Release and Publications";
        const isAuthor = release.author?.authorId?.toString() === user.id;

        if (!isGB && !(isPRDept && ["Director", "Assistant Director", "Senior Executive"].includes(user.designation)) && !isAuthor) {
          return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
      }

      return NextResponse.json(release);
    }

    // List view
    if (!user) {
      // Public: only published press releases
      const releases = await PressRelease.find({ status: "published" }).sort({ createdDate: -1 });
      return NextResponse.json(releases);
    }

    const isAlumni = user?.memberStatus === "Alumni";
    const isGB = checkGB(user);
    const isPRModerator = !isAlumni && user.buccDepartment === "Press Release and Publications" && ["Director", "Assistant Director"].includes(user.designation);
    const isPRSE = !isAlumni && user.buccDepartment === "Press Release and Publications" && user.designation === "Senior Executive";

    if (isGB || isPRModerator) {
      // GB and PR Directors can see everything
      const releases = await PressRelease.find({}).sort({ createdDate: -1 });
      return NextResponse.json(releases);
    } else if (isPRSE) {
      // PR SE can see published ones OR their own drafts/pending
      const releases = await PressRelease.find({
        $or: [
          { status: "published" },
          { "author.authorId": user.id }
        ]
      }).sort({ createdDate: -1 });
      return NextResponse.json(releases);
    } else {
      // Other club members: only published
      const releases = await PressRelease.find({ status: "published" }).sort({ createdDate: -1 });
      return NextResponse.json(releases);
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = session.user as any;
    const isAlumni = user?.memberStatus === "Alumni";
    const isGB = checkGB(user);
    const isPRModerator = !isAlumni && user.buccDepartment === "Press Release and Publications" && ["Director", "Assistant Director"].includes(user.designation);
    const isPRSE = !isAlumni && user.buccDepartment === "Press Release and Publications" && user.designation === "Senior Executive";

    if (!isGB && !isPRModerator && !isPRSE) {
      return NextResponse.json({ error: "Forbidden: You are not authorized to write Press Releases" }, { status: 403 });
    }

    const body = await request.json();
    const { status, ...releaseData } = body;
    
    await dbConnect();

    // Determine status:
    // - If saved explicitly as "draft", keep it "draft".
    // - Otherwise: if user is GB or PR Director/AD, set to "published".
    // - If user is PR SE, set to "pending".
    let prStatus = "pending";
    if (status === "draft") {
      prStatus = "draft";
    } else {
      prStatus = (isGB || isPRModerator) ? "published" : "pending";
    }

    const newRelease = new PressRelease({
      ...releaseData,
      status: prStatus,
      author: {
        authorId: user.id,
        authorName: user.name,
        authorEmail: user.email,
        authorDesignation: user.designation,
        authorDepartment: user.buccDepartment,
      }
    });

    await newRelease.save();

    return NextResponse.json({ message: "Press Release created successfully", release: newRelease }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = session.user as any;
    const isAlumni = user?.memberStatus === "Alumni";
    const isGB = checkGB(user);
    const isPRModerator = !isAlumni && user.buccDepartment === "Press Release and Publications" && ["Director", "Assistant Director"].includes(user.designation);
    const isPRSE = !isAlumni && user.buccDepartment === "Press Release and Publications" && user.designation === "Senior Executive";

    if (!isGB && !isPRModerator && !isPRSE) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    await dbConnect();
    const release = await PressRelease.findById(id);
    if (!release) return NextResponse.json({ error: "Press Release not found" }, { status: 404 });

    const isAuthor = release.author?.authorId?.toString() === user.id;

    // Permissions logic:
    // - Moderators (GB, PR Directors) can edit/approve any.
    // - PR SE (Authors) can edit their own only if it's draft or pending.
    if (!isGB && !isPRModerator) {
      if (!isAuthor) return NextResponse.json({ error: "Forbidden: You do not own this Press Release" }, { status: 403 });
      if (release.status === "published") {
        return NextResponse.json({ error: "Forbidden: Cannot edit an already published Press Release" }, { status: 403 });
      }
    }

    const body = await request.json();
    const { status, ...updates } = body;

    const updateData: any = { ...updates };

    if (isGB || isPRModerator) {
      if (status !== undefined) {
        updateData.status = status;
      }
    } else {
      if (status !== undefined) {
        if (status === "published") {
          return NextResponse.json({ error: "Forbidden: You do not have permission to publish directly" }, { status: 403 });
        }
        updateData.status = status;
      }
    }

    const updatedRelease = await PressRelease.findByIdAndUpdate(
      id,
      { ...updateData, lastUpdate: Date.now() },
      { new: true }
    );

    return NextResponse.json({ message: "Press Release updated successfully", release: updatedRelease });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = session.user as any;
    const isAlumni = user?.memberStatus === "Alumni";
    const isGB = checkGB(user);
    const isPRModerator = !isAlumni && user.buccDepartment === "Press Release and Publications" && ["Director", "Assistant Director"].includes(user.designation);
    const isPRSE = !isAlumni && user.buccDepartment === "Press Release and Publications" && user.designation === "Senior Executive";

    if (!isGB && !isPRModerator && !isPRSE) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    await dbConnect();
    const release = await PressRelease.findById(id);
    if (!release) return NextResponse.json({ error: "Press Release not found" }, { status: 404 });

    const isAuthor = release.author?.authorId?.toString() === user.id;

    // SE (Author) can delete their own if draft or pending.
    // Moderators can delete any.
    if (!isGB && !isPRModerator) {
      if (!isAuthor) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      if (release.status === "published") {
        return NextResponse.json({ error: "Forbidden: Cannot delete an already published Press Release" }, { status: 403 });
      }
    }

    await PressRelease.findByIdAndDelete(id);

    return NextResponse.json({ message: "Press Release deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
