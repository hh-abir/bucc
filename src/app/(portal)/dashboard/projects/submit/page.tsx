"use client";
 
import { useState } from "react";
import Heading from "@/components/portal/heading";
import ProjectForm from "@/components/portal/projects/ProjectForm";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Folder, Plus, Pencil, ExternalLink, Calendar, 
  CheckCircle2, Clock, XCircle 
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
 
export default function SubmitProjectPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user as any;
  
  const [activeTab, setActiveTab] = useState<"list" | "submit">("list");
  const [isSubmitting, setIsSubmitting] = useState(false);
 
  // Fetch user's submitted projects
  const { data: projects, isLoading, refetch } = useQuery({
    queryKey: ["my-submitted-projects", user?.id],
    queryFn: async () => {
      const res = await fetch(`/api/projects?author=${user.id}`);
      if (!res.ok) throw new Error("Failed to fetch your projects");
      return res.json();
    },
    enabled: !!user?.id,
  });
 
  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
 
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to submit project");
      }
 
      toast.success("Project submitted successfully! It will be live once approved.");
      refetch();
      setActiveTab("list"); // Switch back to list to see the pending submission
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };
 
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/30">
            <CheckCircle2 className="w-3.5 h-3.5" /> Approved
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-900/30 animate-pulse">
            <Clock className="w-3.5 h-3.5" /> Pending Review
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-destructive/10 text-destructive border border-destructive/20">
            <XCircle className="w-3.5 h-3.5" /> Rejected
          </span>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
 
  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 border-b border-border pb-6">
        <Heading 
          headingText="Project Showcase Hub" 
          subHeadingText="Submit your creations to present your engineering skills to the BUCC community." 
        />
        {activeTab === "list" && (
          <Button 
            onClick={() => setActiveTab("submit")}
            className="w-full sm:w-auto h-11 px-5 font-medium flex items-center justify-center gap-2"
          >
            <Plus className="w-4.5 h-4.5" /> Submit New Project
          </Button>
        )}
      </div>
 
      {/* Tabs */}
      <div className="flex border-b border-border gap-6">
        <button 
          onClick={() => setActiveTab("list")} 
          className={cn(
            "pb-4 text-sm font-medium border-b-2 transition-all px-1",
            activeTab === "list" 
              ? "border-primary text-primary" 
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          My Submissions
        </button>
        <button 
          onClick={() => setActiveTab("submit")} 
          className={cn(
            "pb-4 text-sm font-medium border-b-2 transition-all px-1",
            activeTab === "submit" 
              ? "border-primary text-primary" 
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          Submit Project Form
        </button>
      </div>
 
      {activeTab === "list" ? (
        <div className="space-y-6">
          {isLoading ? (
            <div className="py-20 text-center text-muted-foreground font-light animate-pulse">
              Loading your submitted projects...
            </div>
          ) : !projects || projects.length === 0 ? (
            <div className="p-20 border border-dashed border-border rounded-2xl text-center space-y-4 max-w-3xl mx-auto">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                <Folder className="w-8 h-8 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif text-xl font-medium">No projects submitted yet</h3>
                <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                  You haven't showcased any projects yet. Click the button below to submit your first project!
                </p>
              </div>
              <Button 
                onClick={() => setActiveTab("submit")}
                className="mt-2 font-medium"
              >
                Submit Your First Project
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project: any) => (
                <div 
                  key={project._id} 
                  className="group border border-border rounded-xl bg-card shadow-sm hover:shadow-md transition-all flex flex-col h-full overflow-hidden"
                >
                  <div className="aspect-video w-full overflow-hidden relative bg-muted border-b border-border">
                    <img 
                      src={project.coverImage} 
                      alt={project.title} 
                      className="object-cover w-full h-full group-hover:scale-102 transition-transform duration-750" 
                    />
                    <div className="absolute top-3 left-3">
                      {getStatusBadge(project.status)}
                    </div>
                  </div>
 
                  <div className="p-5 flex flex-col flex-1 justify-between">
                    <div className="space-y-2 flex-1">
                      <h4 className="text-lg font-serif font-bold text-foreground leading-tight line-clamp-1">
                        {project.title}
                      </h4>
                      <p className="text-xs text-muted-foreground font-light line-clamp-2 leading-relaxed">
                        {project.shortDescription}
                      </p>
                      
                      {project.techStack?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-2">
                          {project.techStack.slice(0, 3).map((tech: string) => (
                            <span 
                              key={tech} 
                              className="text-[9px] font-medium bg-muted text-muted-foreground px-2 py-0.5 rounded"
                            >
                              {tech}
                            </span>
                          ))}
                          {project.techStack.length > 3 && (
                            <span className="text-[9px] font-medium bg-muted text-muted-foreground px-2 py-0.5 rounded">
                              +{project.techStack.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
 
                    <div className="pt-4 border-t border-border mt-5 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-[10px] font-light text-muted-foreground">
                        <Calendar className="w-3.5 h-3.5 text-primary" />
                        <span>
                          {new Date(project.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            year: "numeric"
                          })}
                        </span>
                      </div>
                      
                      <div className="flex gap-2">
                        <Link 
                          href={`/dashboard/projects/edit/${project._id}`}
                          className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 bg-muted text-foreground hover:bg-primary hover:text-primary-foreground rounded-lg transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5" /> Edit
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="max-w-7xl animate-in fade-in duration-300">
          <ProjectForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </div>
      )}
    </div>
  );
}
