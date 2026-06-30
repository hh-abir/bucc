import dbConnect from "@/lib/dbConnect";
import Event from "@/model/Event";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const searchQuery = request.nextUrl.searchParams.get("query");

    if (searchQuery) {
      const events = await Event.find({
        title: { $regex: searchQuery, $options: "i" },
      })
        .select("__id title startingDate prId")
        .limit(10);

      return NextResponse.json(events, { status: 200 });
    }

    return NextResponse.json({ error: "Missing search query" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
