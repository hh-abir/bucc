"use client";

import { useState, Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import Heading from "@/components/portal/heading";
import SpinnerComponent from "@/components/SpinnerComponent";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Github, 
  Globe, 
  ArrowRight, 
  Search,
  Code2
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import RefreshButton from "@/components/public/RefreshButton";
import { revalidateProjects } from "@/actions/revalidate";
import { useSearchParams } from "next/navigation";

const fetchProjects = async (authorId?: string) => {
  const url = authorId 
    ? `/api/projects?status=approved&author=${authorId}` 
    : "/api/projects?status=approved";
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch projects");
  return res.json();
};

function ProjectsGallery() {
  const searchParams = useSearchParams();
  const authorId = searchParams.get("author") || undefined;
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data: projects, isLoading } = useQuery({
    queryKey: ["public-projects", authorId],
    queryFn: () => fetchProjects(authorId),
  });

  const filteredProjects = projects?.filter((proj: any) => {
    return (
      proj.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proj.techStack.some((tech: string) => tech.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  if (isLoading) return <SpinnerComponent />;

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 border-b border-border bg-muted/10 overflow-hidden">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="max-w-3xl space-y-4">
            <div className="flex items-center gap-3">
              <h1 className="text-4xl md:text-6xl font-serif tracking-tight text-foreground">
                Member Showcase
              </h1>
              <div className="mt-2 md:mt-4">
                <RefreshButton revalidateAction={revalidateProjects} label="Projects" />
              </div>
            </div>
            <p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed">
              Explore the innovative projects, tools, and applications built by the talented members of BRAC University Computer Club.
            </p>
          </div>

          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search by project name or tech stack (e.g. React, Python)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-4 bg-background border border-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
            />
          </div>
        </div>
        <div className="absolute top-1/4 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" />
      </section>

      <section className="max-w-6xl mx-auto px-6 py-20">
        {filteredProjects?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((proj: any) => (
              <Card key={proj._id} className="group border-border shadow-none overflow-hidden bg-card hover:border-primary/20 transition-all duration-500">
                <Link href={`/projects/${proj.slug}`}>
                  <div className="aspect-[16/10] overflow-hidden relative bg-muted">
                    <img 
                      src={proj.coverImage} 
                      alt={proj.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                       <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/30 text-white text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                         View Project <ArrowRight size={14} />
                       </div>
                    </div>
                  </div>
                </Link>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                      {proj.techStack.slice(0, 3).map((tech: string) => (
                        <span key={tech} className="text-[9px] font-bold uppercase tracking-widest text-primary bg-primary/5 px-2 py-0.5 rounded-sm">
                          {tech}
                        </span>
                      ))}
                      {proj.techStack.length > 3 && (
                        <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
                          +{proj.techStack.length - 3}
                        </span>
                      )}
                    </div>
                    <Link href={`/projects/${proj.slug}`}>
                      <h3 className="font-serif text-xl group-hover:text-primary transition-colors line-clamp-1">{proj.title}</h3>
                    </Link>
                    <p className="text-sm text-muted-foreground font-light line-clamp-2 leading-relaxed">
                      {proj.shortDescription}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-border/50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold">
                        {proj.author?.name?.charAt(0) || "U"}
                      </div>
                      <span className="text-[10px] font-medium text-muted-foreground truncate max-w-[100px]">{proj.author?.name || "Member"}</span>
                    </div>
                    <div className="flex gap-3">
                      {proj.sourceCodeLink && (
                        <a href={proj.sourceCodeLink} target="_blank" className="text-muted-foreground hover:text-foreground transition-colors">
                          <Github size={16} strokeWidth={1.5} />
                        </a>
                      )}
                      {proj.deploymentLink && (
                        <a href={proj.deploymentLink} target="_blank" className="text-muted-foreground hover:text-foreground transition-colors">
                          <Globe size={16} strokeWidth={1.5} />
                        </a>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="py-32 text-center">
            <div className="space-y-4 max-w-xs mx-auto">
              <Code2 className="w-12 h-12 text-muted-foreground/20 mx-auto" />
              <p className="font-serif text-xl text-muted-foreground">No matching projects</p>
              <p className="text-sm text-muted-foreground/60 font-light">Try searching for a different technology or project name.</p>
            </div>
          </div>
        )}
      </section>


    </div>
  );
}

export default function ProjectsGalleryPage() {
  return (
    <Suspense fallback={<SpinnerComponent />}>
      <ProjectsGallery />
    </Suspense>
  );
}
