import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import { isSuperUser as checkGB } from "@/lib/permissions";
import generatePassword from "@/helpers/generatePassword";
import { singleWelcomeMail } from "@/helpers/mailer";
import { auth as authServer } from "@/lib/auth";

const client = new MongoClient(process.env.MONGODB_URI as string);
const db = client.db(process.env.MONGODB_DB as string);

// Configuration
const FLUSHABLE_MODELS = [
  "evaluationdatas", 
  "preregmembers", 
  "pressreleases", 
  "inquiries", 
  "testimonials", 
  "announcements", 
  "tasks"
];
const MANAGEABLE_MODELS = [
  { name: "Members (All Data)", collection: "user" },
  { name: "Projects", collection: "projects" },
  { name: "Blogs", collection: "blogs" },
  { name: "Events", collection: "events" },
  { name: "Evaluations", collection: "evaluationdatas" },
  { name: "Pre-Reg Members", collection: "preregmembers" },
  { name: "PR/Press Releases", collection: "pressreleases" },
  { name: "Inquiries", collection: "inquiries" },
  { name: "Testimonials", collection: "testimonials" },
  { name: "Announcements", collection: "announcements" },
  { name: "Tasks", collection: "tasks" },
  { name: "Sessions (Live)", collection: "session" },
];

function convertToCSV(data: any[]) {
  if (data.length === 0) return "";
  const headers = Object.keys(data[0]).filter(k => k !== "_id").join(",");
  const rows = data.map(obj => 
    Object.values(obj)
      .map(val => `"${String(val).replace(/"/g, '""')}"`)
      .join(",")
  );
  return [headers, ...rows].join("\n");
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = session.user as any;
    const isGB = checkGB(user);
    const isHRHead = user.buccDepartment === "Human Resources" && ["Director", "Assistant Director"].includes(user.designation);

    if (!isGB && !isHRHead) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const url = new URL(request.url);
    const stats = url.searchParams.get("stats");
    const model = url.searchParams.get("model"); // collection name
    const format = url.searchParams.get("format") || "json";

    if (stats === "true") {
      await dbConnect();
      
      const totalMembers = await db.collection("user").countDocuments({
        buccDepartment: { $nin: ["Governing Body", "governing body", "GOVERNING BODY"] }
      });
      const totalAlumni = await db.collection("user").countDocuments({
        memberStatus: "Alumni",
        buccDepartment: { $nin: ["Governing Body", "governing body", "GOVERNING BODY"] }
      });
      const totalPreReg = await db.collection("preregmembers").countDocuments();
      const totalBlogs = await db.collection("blogs").countDocuments();
      const totalEvents = await db.collection("events").countDocuments();
      const totalProjects = await db.collection("projects").countDocuments();
      const totalInquiries = await db.collection("inquiries").countDocuments();
      const totalSessions = await db.collection("session").countDocuments();

      // Aggregate department breakdown (excluding Governing Body, grouping Alumni together)
      const deptData = await db.collection("user").aggregate([
        { 
          $match: { 
            buccDepartment: { 
              $exists: true, 
              $ne: null, 
              $nin: ["Governing Body", "governing body", "GOVERNING BODY"] 
            } 
          } 
        },
        {
          $project: {
            departmentGroup: {
              $cond: {
                if: { $eq: ["$memberStatus", "Alumni"] },
                then: "Alumni",
                else: "$buccDepartment"
              }
            }
          }
        },
        { $group: { _id: "$departmentGroup", count: { $sum: 1 } } }
      ]).toArray();

      // Fetch daily visitor logs
      const visitorLogs = await db.collection("visitorlogs").find({}).sort({ date: 1 }).toArray();

      // Estimate visitor traffic dynamically from active session logs, inquiries, and application rates
      const visitorEstimate = Math.max(128, (totalSessions * 5) + (totalInquiries * 8) + (totalPreReg * 3));

      return NextResponse.json({
        counts: {
          members: totalMembers,
          alumni: totalAlumni,
          preReg: totalPreReg,
          blogs: totalBlogs,
          events: totalEvents,
          projects: totalProjects,
          inquiries: totalInquiries,
          visitors: visitorEstimate,
        },
        departments: deptData.map(d => ({
          name: d._id || "Unassigned",
          value: d.count
        })),
        visitorLogs: visitorLogs.map(log => ({
          date: log.date,
          views: log.views || 0,
          visitors: log.visitors || 0
        }))
      });
    }

    if (!model) return NextResponse.json({ models: MANAGEABLE_MODELS });

    await dbConnect();
    const collection = db.collection(model);
    const data = await collection.find({}).toArray();

    if (format === "csv") {
      const csv = convertToCSV(data);
      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename=${model}_export.csv`,
        },
      });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const currentUser = session.user as any;
    const isGB = checkGB(currentUser);
    const isHRHead = currentUser.buccDepartment === "Human Resources" && ["Director", "Assistant Director"].includes(currentUser.designation);

    if (!isGB && !isHRHead) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await request.json();
    const { type, data } = body;

    if (type === "bulk-user") {
      if (!Array.isArray(data)) return NextResponse.json({ error: "Data must be an array" }, { status: 400 });

      const results = { success: 0, failed: 0, errors: [] as string[] };

      for (const userData of data) {
        try {
          if (!userData || typeof userData !== "object") {
            throw new Error("Invalid member record format");
          }
          const password = userData.password || generatePassword();
          const newUser = await authServer.api.signUpEmail({
            body: {
              email: userData.email ? userData.email.toLowerCase() : "",
              password: password,
              name: userData.name,
              studentId: userData.studentId,
              phoneNumber: userData.phoneNumber,
              bracuDepartment: userData.bracuDepartment,
              buccDepartment: userData.buccDepartment,
              designation: userData.designation || "General Member",
              memberStatus: "Active",
              joinedBucc: userData.joinedBucc || "",
            },
          });

          if (newUser) {
            results.success++;
            await singleWelcomeMail(newUser.user.id, userData.name, userData.email, password);
          }
        } catch (err: any) {
          results.failed++;
          results.errors.push(`${userData?.email || "Unknown"}: ${err.message}`);
        }
      }

      return NextResponse.json({ message: "Bulk onboarding complete", results });
    }

    return NextResponse.json({ error: "Invalid operation type" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = session.user as any;
    if (!checkGB(user)) return NextResponse.json({ error: "Only Governing Body and R&D leaders can flush data" }, { status: 403 });

    const url = new URL(request.url);
    const model = url.searchParams.get("model");

    if (!model) {
      return NextResponse.json({ error: "Missing model parameter" }, { status: 400 });
    }

    if (model.toLowerCase() === "recruitment_all") {
      await dbConnect();
      const preregResult = await db.collection("preregmembers").deleteMany({});
      const evalResult = await db.collection("evaluationdatas").deleteMany({});
      return NextResponse.json({ 
        message: `Successfully wiped recruitment data. Deleted ${preregResult.deletedCount} prereg records and ${evalResult.deletedCount} evaluation records.` 
      });
    }

    if (!FLUSHABLE_MODELS.includes(model.toLowerCase())) {
      return NextResponse.json({ error: "Cannot flush this model or collection is protected" }, { status: 400 });
    }

    await dbConnect();
    const result = await db.collection(model).deleteMany({});

    return NextResponse.json({ message: `Successfully flushed ${result.deletedCount} records from ${model}` });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
