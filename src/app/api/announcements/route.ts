import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import Announcement from "@/model/Announcement";
import { NextRequest, NextResponse } from "next/server";
import { isGoverningBody } from "@/lib/permissions";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit");
    
    let query = Announcement.find().sort({ isPinned: -1, createdAt: -1 });
    
    if (limit) {
      query = query.limit(parseInt(limit));
    }

    const announcements = await query.lean();
    return NextResponse.json(announcements);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = session.user as any;
    const isGB = isGoverningBody(user);
    const isEB = ["Director", "Assistant Director", "Senior Executive", "Executive"].includes(user.designation);

    if (!isGB && !isEB) {
      return NextResponse.json({ error: "Only GB and EB members can post announcements" }, { status: 403 });
    }

    const body = await request.json();
    await dbConnect();

    const newAnnouncement = new Announcement({
      ...body,
      author: {
        id: user.id,
        name: user.name,
        designation: user.designation,
      }
    });

    await newAnnouncement.save();
    return NextResponse.json(newAnnouncement, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const user = session.user as any;
    const isGB = isGoverningBody(user);

    if (!isGB) return NextResponse.json({ error: "Only GB can delete announcements" }, { status: 403 });

    await dbConnect();
    await Announcement.findByIdAndDelete(id);
    return NextResponse.json({ message: "Announcement deleted" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
