import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import PreRegMember from "@/model/PreRegMember";
import { getConfigValue } from "@/helpers/appConfigStore";

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    // SERVER-SIDE GATING: Check if registration is open in AppConfig
    const config: any = await getConfigValue("recruitment_config", { isRegistrationOpen: false });
    if (!config.isRegistrationOpen) {
      return NextResponse.json(
        { message: config.registrationMessage || "Registration is currently closed." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { name, email, studentId, phoneNumber, bracuDepartment, buccDepartment, joinedSemester, joinedYear } = body;

    // Validate required fields
    if (!name || !email || !studentId || !phoneNumber || !bracuDepartment || !joinedSemester || !joinedYear) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    // Check if student already registered
    const existingMember = await PreRegMember.findOne({
      $or: [{ studentId }, { email }],
    });

    if (existingMember) {
      return NextResponse.json(
        { message: "You have already registered with this Student ID or Email" },
        { status: 400 }
      );
    }

    const newPreRegMember = new PreRegMember({
      name,
      email,
      studentId,
      phoneNumber,
      bracuDepartment,
      buccDepartment: buccDepartment || "General Member",
      joinedSemester,
      joinedYear,
    });

    await newPreRegMember.save();

    return NextResponse.json(
      { message: "Registration successful" },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Failed to register", error: error.message },
      { status: 500 }
    );
  }
}
