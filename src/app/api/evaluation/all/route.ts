import { hasAuth } from "@/helpers/hasAuth";
import { getConfigValue } from "@/helpers/appConfigStore";
import EvaluationData from "@/model/EvaluationData";
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
  const config = await getConfigValue("recruitment_config", { allowSERecruitmentAccess: false });
  const activeDesignations = [...permittedDesignations];
  if (config?.allowSERecruitmentAccess) {
    activeDesignations.push("Senior Executive");
  }

  const { session, isPermitted } = await hasAuth(
    activeDesignations,
    permittedDepartments,
  );

  if (!session || !isPermitted) {
    return NextResponse.json(
      { error: "You are not authorized to view this page" },
      { status: 401 },
    );
  }

  try {
    const evaluations = await EvaluationData.find({});
    return NextResponse.json(evaluations);
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
