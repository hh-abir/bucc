import HomePage from "@/components/HomePage";
import dbConnect from "@/lib/dbConnect";
import Event from "@/model/Event";
import Project from "@/model/Project";
import User from "@/model/User";
import Preloader from "@/components/public/Preloader";

export const revalidate = 3600; // Revalidate page every hour

export default async function Page() {
  await dbConnect();
  
  // Fetch latest 3 upcoming or recent events
  const latestEvents = await Event.find({})
    .sort({ startingDate: -1 })
    .limit(3)
    .lean();

  // Fetch up to 3 featured approved projects, fallback to latest approved
  let featuredProjects = await Project.find({ isFeatured: true, status: "approved" })
    .sort({ updatedAt: -1 })
    .limit(3)
    .populate("author", "name designation")
    .lean();

  if (featuredProjects.length < 3) {
    const additional = await Project.find({ isFeatured: { $ne: true }, status: "approved" })
      .sort({ createdAt: -1 })
      .limit(3 - featuredProjects.length)
      .populate("author", "name designation")
      .lean();
    featuredProjects = [...featuredProjects, ...additional];
  }

  // Serialize MongoDB objects for client component
  const serializedEvents = JSON.parse(JSON.stringify(latestEvents));
  const serializedProjects = JSON.parse(JSON.stringify(featuredProjects));

  return (
    <>
      <Preloader />
      <HomePage initialEvents={serializedEvents} initialProjects={serializedProjects} />
    </>
  );
}
