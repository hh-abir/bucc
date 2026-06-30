import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Testimonial from "@/model/Testimonial";
import User from "@/model/User";
import { ObjectId } from "mongodb";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentUser = session.user as any;
    
    // Check if the current user is EB or Alumni
    const isGB = ["President", "Vice President", "General Secretary", "Treasurer"].includes(currentUser.designation);
    const isEB = ["Director", "Assistant Director", "Senior Executive", "Executive"].includes(currentUser.designation);
    const isAlumni = currentUser.memberStatus === "Alumni";

    if (!isGB && !isEB && !isAlumni) {
      return NextResponse.json({ 
        error: "Forbidden: Only EB Panel members or Alumni can write testimonials" 
      }, { status: 403 });
    }

    const { targetMember, relationship, content } = await request.json();

    if (!targetMember || !relationship || !content || content.trim() === "") {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await dbConnect();

    // Check if target member exists
    const targetUser = await User.findById(new ObjectId(targetMember));
    if (!targetUser) {
      return NextResponse.json({ error: "Target member not found" }, { status: 404 });
    }

    // Save testimonial
    const newTestimonial = await Testimonial.create({
      author: new ObjectId(currentUser.id || currentUser._id),
      targetMember: new ObjectId(targetMember),
      relationship: relationship.trim(),
      content: content.trim(),
      isApproved: true, // Default to true
    });

    return NextResponse.json({ testimonial: newTestimonial }, { status: 201 });
  } catch (error: any) {
    console.error("Create testimonial error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Testimonial ID is required" }, { status: 400 });
  }

  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentUser = session.user as any;
    const isGB = ["President", "Vice President", "General Secretary", "Treasurer"].includes(currentUser.designation);

    await dbConnect();

    const testimonial = await Testimonial.findById(new ObjectId(id));
    if (!testimonial) {
      return NextResponse.json({ error: "Testimonial not found" }, { status: 404 });
    }

    // Only author or GB admin can delete
    const isAuthor = testimonial.author.toString() === (currentUser.id || currentUser._id);
    if (!isGB && !isAuthor) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await Testimonial.findByIdAndDelete(testimonial._id);

    return NextResponse.json({ message: "Testimonial deleted successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Delete testimonial error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
