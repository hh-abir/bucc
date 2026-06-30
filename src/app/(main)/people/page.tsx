import { Metadata } from "next";
import dbConnect from "@/lib/dbConnect";
import User from "@/model/User";
import PeopleDirectory from "./PeopleDirectory";

export const revalidate = 60; // Revalidate every minute

export const metadata: Metadata = {
  title: "Members Directory | BUCC",
  description: "Explore and connect with the talented student developers, designers, and organizers of the BRAC University Computer Club (BUCC).",
  openGraph: {
    title: "BUCC Members Directory",
    description: "Search and connect with the active members, executive panel, and alumni of the BRAC University Computer Club.",
    type: "website",
    images: [
      {
        url: "/assets/bucc-icon.svg",
        width: 400,
        height: 400,
        alt: "BUCC Logo",
      },
    ],
  },
};

export default async function PeoplePage() {
  await dbConnect();

  // Fetch only public profiles that have claimed slugs
  const rawMembers = await User.find({
    isPublicProfile: true,
    profileSlug: { $exists: true, $ne: "" }
  })
  .select("name designation buccDepartment image profileSlug memberStatus joinedBucc bio currentJob")
  .lean() as any[];

  // Serialize Mongoose models (convert ObjectIds to strings)
  const members = rawMembers.map(member => ({
    id: member._id.toString(),
    name: member.name,
    designation: member.designation,
    buccDepartment: member.buccDepartment,
    image: member.image || null,
    profileSlug: member.profileSlug,
    memberStatus: member.memberStatus || "Active",
    joinedBucc: member.joinedBucc || null,
    bio: member.bio || null,
    currentJob: member.currentJob || null,
  }));

  return (
    <div className="min-h-screen bg-background pb-32">
      <div className="max-w-6xl mx-auto px-6 pt-16">
        <PeopleDirectory initialMembers={members} />
      </div>
    </div>
  );
}
