import { hasAuth } from "@/helpers/hasAuth";
import PreRegMember from "@/model/PreRegMember";
import { NextResponse } from "next/server";

const permittedDepartments = ["Human Resources", "Governing Body", "Research and Development"];
const permittedDesignations = [
  "President",
  "Vice President",
  "General Secretary",
  "Treasurer",
  "Director",
  "Assistant Director",
];

export async function GET() {
  const { session, isPermitted } = await hasAuth(
    permittedDesignations,
    permittedDepartments,
  );

  if (!session || !isPermitted) {
    return NextResponse.json(
      { error: "You are not authorized to view this page" },
      { status: 401 },
    );
  }

  try {
    const users = await PreRegMember.find({});
    return NextResponse.json({ users: users });
  } catch (error) {
    return NextResponse.json({ error: error });
  }
}
