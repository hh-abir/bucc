import { auth } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import Event from "@/model/Event";
import { canManageEvents } from "@/lib/permissions";
import { NextResponse } from "next/server";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session || !canManageEvents(session.user as any)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  await dbConnect();
  try {
    const { id } = await params;
    const body = await request.json();
    const updatedEvent = await Event.findByIdAndUpdate(id, body, { new: true });
    if (!updatedEvent) return NextResponse.json({ error: "Event not found" }, { status: 404 });
    return NextResponse.json(updatedEvent);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update event" }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session || !canManageEvents(session.user as any)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  await dbConnect();
  try {
    const { id } = await params;
    const deletedEvent = await Event.findByIdAndDelete(id);
    if (!deletedEvent) return NextResponse.json({ error: "Event not found" }, { status: 404 });
    return NextResponse.json({ message: "Event deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete event" }, { status: 500 });
  }
}
