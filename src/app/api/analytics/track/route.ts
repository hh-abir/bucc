import dbConnect from "@/lib/dbConnect";
import VisitorLog from "@/model/VisitorLog";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    // Capture IP
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0] : (request.ip || "127.0.0.1");

    // Format local date: YYYY-MM-DD
    const today = new Date().toISOString().split("T")[0];

    // Find and update daily record
    await VisitorLog.findOneAndUpdate(
      { date: today },
      {
        $inc: { views: 1 },
        $addToSet: { ips: ip }
      },
      { upsert: true, new: true }
    );

    // Sync visitor count with unique IP list length
    const log = await VisitorLog.findOne({ date: today });
    if (log) {
      log.visitors = log.ips.length;
      await log.save();
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
