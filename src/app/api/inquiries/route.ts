import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Inquiry from "@/model/Inquiry";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { canManageInquiries } from "@/lib/permissions";

export const runtime = "nodejs";

// GET: Fetch all inquiries (Restricted)
export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as any;
    if (!canManageInquiries(user)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await dbConnect();
    const inquiries = await Inquiry.find({}).sort({ createdAt: -1 });
    
    return NextResponse.json(inquiries);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST: Submit a new inquiry (Public)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await dbConnect();
    const newInquiry = await Inquiry.create({
      name,
      email,
      subject,
      message,
    });

    return NextResponse.json({ message: "Inquiry submitted successfully", id: newInquiry._id });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// PATCH: Update inquiry status (Restricted)
export async function PATCH(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as any;
    if (!canManageInquiries(user)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await dbConnect();
    const updatedInquiry = await Inquiry.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedInquiry) {
      return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
    }

    return NextResponse.json(updatedInquiry);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE: Delete an inquiry (Restricted to GB only)
export async function DELETE(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as any;
    const gbDesignations = ["President", "Vice President", "General Secretary", "Treasurer"];
    const isGB = gbDesignations.includes(user.designation);

    if (!isGB) {
      return NextResponse.json({ error: "Forbidden: Only GB can delete inquiries" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing inquiry ID" }, { status: 400 });
    }

    await dbConnect();
    await Inquiry.findByIdAndDelete(id);

    return NextResponse.json({ message: "Inquiry deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
