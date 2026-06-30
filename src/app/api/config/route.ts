import { NextResponse } from "next/server";
import { getConfigValue } from "@/helpers/appConfigStore"; 
import { setConfigValue } from "@/helpers/appConfigStore";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { isGoverningBody, isRDAdmin } from "@/lib/permissions";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get("key"); 
  const defaultValue = searchParams.get("defaultValue");

  if (!key || typeof key !== "string") {
    return NextResponse.json(
      { error: "Missing or invalid config key" },
      { status: 400 },
    );
  }

  try {
    const value: any = await getConfigValue(key, defaultValue || null);
    
    // Inject specific BUCC defaults for recruitment
    if (key === "recruitment_config" && value && typeof value === 'object') {
      if (!value.registrationMessage) {
        value.registrationMessage = "BUCC Recruitment Process is not ongoing. Please check our Facebook page for updates.";
      }
      if (!value.evaluationMessage) {
        value.evaluationMessage = "BUCC is not accepting any more evaluations. Please contact HR or GB.";
      }
    }

    return NextResponse.json({ key, value });
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching config", details: error },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    // 1. Authenticate the session
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as any;
    const body = await request.json();
    const { key, value } = body;

    if (!key || typeof key !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid config key" },
        { status: 400 },
      );
    }

    // 2. Role-Based Access Control (RBAC) for sensitive keys
    const sensitiveKeys = ["hero_carousel_config", "recruitment_config"];
    
    if (sensitiveKeys.includes(key)) {
      const isAuthorized = isGoverningBody(user) || isRDAdmin(user);
      
      if (!isAuthorized) {
        return NextResponse.json(
          { error: "Forbidden: You do not have permission to update this configuration." },
          { status: 403 }
        );
      }
    }

    // 3. Update the configuration
    await setConfigValue(key, value);
    
    return NextResponse.json({
      key,
      value,
      message: "Config updated successfully",
    });
  } catch (error) {
    console.error("Config API Error:", error);
    return NextResponse.json(
      { error: "Error updating config", details: error },
      { status: 500 },
    );
  }
}