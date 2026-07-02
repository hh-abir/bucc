import { getConfigValue } from "@/helpers/appConfigStore";
import dbConnect from "@/lib/dbConnect";
import EvaluationData from "@/model/EvaluationData";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const config = await getConfigValue("recruitment_config", { 
      isTasksPortalOpen: false, 
      tasksDeadline: "" 
    });
    return NextResponse.json({
      isTasksPortalOpen: config.isTasksPortalOpen,
      tasksDeadline: config.tasksDeadline
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, studentId, phoneNumber } = body;

    if (!studentId || !phoneNumber) {
      return NextResponse.json({ error: "Student ID and Phone Number are required." }, { status: 400 });
    }

    await dbConnect();

    // Normalize phone numbers for robust matching (digits only comparison)
    const cleanPhoneInput = phoneNumber.replace(/\D/g, "");
    const candidate = await EvaluationData.findOne({ 
      studentId: { $regex: new RegExp(`^${studentId.trim()}$`, "i") } 
    });

    if (!candidate) {
      return NextResponse.json({ error: "No application found for this Student ID." }, { status: 404 });
    }

    const cleanCandPhone = candidate.phoneNumber.replace(/\D/g, "");
    if (cleanPhoneInput !== cleanCandPhone && phoneNumber.trim() !== candidate.phoneNumber.trim()) {
      return NextResponse.json({ error: "Invalid credentials. Student ID and Phone Number do not match our records." }, { status: 401 });
    }

    // Fetch recruitment config
    const config = await getConfigValue("recruitment_config", { 
      isTasksPortalOpen: false, 
      tasksDeadline: "" 
    });

    // Check if tasks portal is active
    if (action === "verify" && !config.isTasksPortalOpen) {
      return NextResponse.json({ 
        error: "Recruitment Tasks Submission Portal is currently closed.", 
        isPortalClosed: true 
      }, { status: 403 });
    }

    if (action === "verify") {
      return NextResponse.json({
        name: candidate.name,
        assignedTasks: candidate.assignedTasks || [],
        config: {
          isTasksPortalOpen: config.isTasksPortalOpen,
          tasksDeadline: config.tasksDeadline
        }
      });
    }

    if (action === "submit") {
      // Check again if portal is open
      if (!config.isTasksPortalOpen) {
        return NextResponse.json({ error: "Tasks portal is closed." }, { status: 403 });
      }

      // Check deadline
      if (config.tasksDeadline) {
        const deadline = new Date(config.tasksDeadline);
        if (new Date() > deadline) {
          return NextResponse.json({ error: "The submission deadline has passed." }, { status: 400 });
        }
      }

      const { department, driveLink, githubLink } = body;

      if (!department || !driveLink) {
        return NextResponse.json({ error: "Department and Google Drive link are required." }, { status: 400 });
      }

      // Drive link validation
      const normalizedDrive = driveLink.trim();
      if (!normalizedDrive.toLowerCase().includes("drive.google.com") && !normalizedDrive.toLowerCase().includes("docs.google.com")) {
        return NextResponse.json({ error: "A valid Google Drive or Google Docs link is mandatory." }, { status: 400 });
      }

      // Find the specific assigned task
      const taskIndex = candidate.assignedTasks.findIndex(
        (t: any) => t.department.toLowerCase() === department.toLowerCase()
      );

      if (taskIndex === -1) {
        return NextResponse.json({ error: "You are not assigned a task for this department." }, { status: 400 });
      }

      // Update task details
      candidate.assignedTasks[taskIndex].driveLink = normalizedDrive;
      candidate.assignedTasks[taskIndex].githubLink = githubLink ? githubLink.trim() : "";
      candidate.assignedTasks[taskIndex].status = "submitted";
      candidate.assignedTasks[taskIndex].submittedAt = new Date();

      // Mongoose save triggers change tracking
      candidate.markModified("assignedTasks");
      await candidate.save();

      return NextResponse.json({ 
        message: `Task for ${department} submitted successfully!`,
        assignedTasks: candidate.assignedTasks 
      });
    }

    return NextResponse.json({ error: "Invalid action." }, { status: 400 });
  } catch (error: any) {
    console.error("Recruitment tasks portal error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
