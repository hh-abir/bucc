import { auth } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import Event from "@/model/Event";
import { canManageEvents } from "@/lib/permissions";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();
  try {
    const events = await Event.find({}).sort({ startingDate: -1 });
    return NextResponse.json(events);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session || !canManageEvents(session.user as any)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  await dbConnect();
  try {
    const body = await request.json();
    const newEvent = await Event.create(body);
    return NextResponse.json(newEvent, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create event" }, { status: 400 });
  }
}
