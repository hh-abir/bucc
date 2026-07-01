import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import GlobalBanner from "@/model/GlobalBanner";
import { NextRequest, NextResponse } from "next/server";
import { isSuperUser } from "@/lib/permissions";

export async function GET() {
  try {
    await dbConnect();
    // Return only the single active banner
    const banner = await GlobalBanner.findOne().sort({ updatedAt: -1 });
    return NextResponse.json(banner || { isActive: false });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = session.user as any;
    if (!isSuperUser(user)) {
      return NextResponse.json({ error: "Only Governing Body and R&D leaders can manage the global banner" }, { status: 403 });
    }

    const body = await request.json();
    await dbConnect();

    // Upsert logic: always maintain only one banner record
    const updatedBanner = await GlobalBanner.findOneAndUpdate(
      {}, 
      { ...body, lastUpdatedBy: user.name },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return NextResponse.json({ message: "Banner updated successfully", banner: updatedBanner });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
