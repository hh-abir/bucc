import dbConnect from "@/lib/dbConnect";
import Project from "@/model/Project";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Github, 
  Globe, 
  ArrowLeft, 
  ArrowRight,
  Calendar, 
  User, 
  Code2,
  Share2
} from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import type { Metadata } from "next";

const BlockNoteRenderer = dynamic(() => import("@/components/BlockNoteRenderer"));

export const revalidate = 7200; // Revalidate every 2 hours

async function getProjectData(slug: string) {
  await dbConnect();
  const project: any = await Project.findOne({ slug, status: "approved" })
    .populate("author", "name designation buccDepartment")
    .populate("contributors", "name designation buccDepartment")
    .lean();
  if (!project) return null;
  return { 
    ...project, 
    _id: project._id.toString(), 
    author: project.author ? { ...project.author, _id: project.author._id?.toString() } : null,
    contributors: project.contributors ? project.contributors.map((c: any) => ({ ...c, _id: c._id?.toString() })) : []
  };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectData(slug);

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  return {
    title: project.title,
    description: project.shortDescription || "View this project on the BUCC Portal.",
    openGraph: {
      title: project.title,
      description: project.shortDescription,
      type: "website",
      images: [
        {
          url: project.coverImage || "/images/cover.png",
          width: 1200,
          height: 630,
          alt: project.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.shortDescription,
      images: [project.coverImage || "/images/cover.png"],
    },
  };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectData(slug);

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <h1 className="text-4xl font-serif">Project Not Found</h1>
        <Link href="/projects">
          <Button variant="outline" className="gap-2">
            <ArrowLeft size={16} /> Back to Gallery
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Cinematic Header */}
      <section className="relative h-[60vh] md:h-[70vh] overflow-hidden">
        <img 
          src={project.coverImage} 
          alt={project.title} 
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-black/20" />
        
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 lg:p-20">
          <div className="max-w-6xl mx-auto space-y-6">
            <Link href="/projects">
              <button className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest mb-4">
                <ArrowLeft size={14} /> Back to Gallery
              </button>
            </Link>
            
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech: string) => (
                  <Badge key={tech} className="bg-white/20 backdrop-blur-md text-white border-white/20 hover:bg-white/30 transition-all text-[10px] uppercase font-bold tracking-widest">
                    {tech}
                  </Badge>
                ))}
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-white tracking-tight leading-[1.1]">
                {project.title}
              </h1>
              <p className="text-lg md:text-xl text-white/80 font-light max-w-3xl leading-relaxed">
                {project.shortDescription}
              </p>
            </div>

            <div className="flex flex-wrap gap-6 pt-4 text-white/60 text-xs font-light">
              <div className="flex items-center gap-2">
                <User size={14} className="text-primary" />
                <span>By <span className="text-white font-medium">{project.author?.name}</span></span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-primary" />
                <span>Published on <span className="text-white font-medium">{new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date(project.createdAt))}</span></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="max-w-6xl mx-auto px-6 py-20 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
          
          {/* Article Side */}
          <div className="lg:col-span-8 space-y-12">
            <div className="space-y-6">
              <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-primary">The Case Study</h2>
              <BlockNoteRenderer initialValue={project.fullDescription} />
            </div>
          </div>

          {/* Sidebar / Info Panel */}
          <div className="lg:col-span-4 space-y-10">
             {/* Links Card */}
             <div className="bg-muted/30 border border-border rounded-xl p-8 space-y-8 sticky top-32">
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Resources</h3>
                  <div className="space-y-3">
                    {project.deploymentLink && (
                      <a href={project.deploymentLink} target="_blank" className="block">
                        <Button className="w-full h-12 gap-3 bg-foreground text-background font-bold uppercase text-[10px] tracking-widest">
                          <Globe size={16} /> Visit Live Project
                        </Button>
                      </a>
                    )}
                    {project.sourceCodeLink && (
                      <a href={project.sourceCodeLink} target="_blank" className="block">
                        <Button variant="outline" className="w-full h-12 gap-3 border-border font-bold uppercase text-[10px] tracking-widest">
                          <Github size={16} /> Source Code
                        </Button>
                      </a>
                    )}
                  </div>
                </div>

                <div className="pt-8 border-t border-border space-y-4">
                   <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Author Details</h3>
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center font-serif text-xl">
                        {project.author?.name?.charAt(0)}
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-sm font-medium">{project.author?.name}</p>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">{project.author?.designation}</p>
                      </div>
                   </div>
                   <p className="text-xs text-muted-foreground font-light leading-relaxed italic pt-2">
                     "{project.author?.name} is a member of the {project.author?.buccDepartment} department at BUCC."
                   </p>
                </div>

                {project.contributors && project.contributors.length > 0 && (
                  <div className="pt-8 border-t border-border space-y-4">
                     <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Contributors</h3>
                     <div className="space-y-4">
                       {project.contributors.map((contributor: any) => (
                         <div key={contributor._id} className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-serif text-xs">
                              {contributor.name?.charAt(0)}
                            </div>
                            <div className="space-y-0.5">
                              <p className="text-xs font-medium">{contributor.name}</p>
                              <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider">{contributor.designation}</p>
                            </div>
                         </div>
                       ))}
                     </div>
                  </div>
                )}

                <div className="pt-8 border-t border-border">
                  <Button variant="ghost" className="w-full h-10 gap-2 text-muted-foreground hover:text-foreground text-[10px] font-bold uppercase tracking-widest">
                    <Share2 size={14} /> Share Project
                  </Button>
                </div>
             </div>
          </div>

        </div>
      </section>

      {/* More Projects Section (Optional) */}
      <section className="bg-muted/10 border-t border-border py-24 px-6">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-serif">Similar Explorations</h2>
            <Link href="/projects" className="text-sm font-bold uppercase tracking-widest text-primary hover:underline flex items-center gap-2">
              View All Projects <ArrowRight size={14} />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="py-20 text-center col-span-full border border-dashed border-border rounded-lg bg-background/50">
               <Code2 className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
               <p className="text-muted-foreground font-serif">More projects coming soon</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
