import departments from "@/constants/departments";
import designations from "@/constants/designations";
import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { isSuperUser } from "@/lib/permissions";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI as string);
const db = client.db(process.env.MONGODB_DB as string);

const departmentsName = departments.map((department) => department.title);
const designationsName = designations.map((designation) => designation.title);

const permittedDepartments = ["Governing Body", "Human Resources"];
const permittedDesignations = [
  "President",
  "Vice President",
  "General Secretary",
  "Treasurer",
  "Director",
  "Assistant Director",
];

export async function GET() {
  const session = await auth();

  if (!session) {
    return NextResponse.json(
      { error: "You are not authorized to view this page" },
      { status: 401 },
    );
  }
  
  const user = session.user as any;
  const isGB = isSuperUser(user);
  const isHR = user.buccDepartment === "Human Resources";
  const isDeptHead = ["Director", "Assistant Director"].includes(user.designation);

  if (!isGB && !(isHR && isDeptHead)) {
    return NextResponse.json({
      message: `${user.designation}s of ${user.buccDepartment} don't have the permission to view this page.`,
    }, { status: 403 });
  }

  try {
    const usersCollection = db.collection("user");
    const members = await usersCollection.find({}).toArray();

    members.sort((a: any, b: any) => {
      const deptA = a.buccDepartment || "";
      const deptB = b.buccDepartment || "";
      const desA = a.designation || "";
      const desB = b.designation || "";

      const departmentComparison = departmentsName.indexOf(deptA) - departmentsName.indexOf(deptB);
      if (departmentComparison !== 0) return departmentComparison;

      return designationsName.indexOf(desA) - designationsName.indexOf(desB);
    });

    return NextResponse.json({ user: members });
  } catch (error: any) {
    console.error("Fetch all members error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
