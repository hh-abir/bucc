"use client";

import { useState } from "react";
import SpinnerComponent from "@/components/SpinnerComponent";
import Heading from "@/components/portal/heading";
import { 
  Card, 
  CardContent, 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSession } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { 
  FolderRoot, 
  User, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  Trash2, 
  Edit,
  ExternalLink,
  Search,
  ArrowRight,
  Eye
} from "lucide-react";
import { cn } from "@/lib/utils";
import { canManageProjects } from "@/lib/permissions";
import Link from "next/link";

const fetchProjects = async (status: string) => {
  const res = await fetch(`/api/projects?status=${status}`);
  if (!res.ok) throw new Error("Failed to fetch projects");
  return res.json();
};

export default function ProjectRequestsPage() {
  const queryClient = useQueryClient();
  const { data: session, status: sessionStatus } = useSession();
  const [filter, setFilter] = useState<"pending" | "approved" | "rejected">("pending");
  const [searchTerm, setSearchTerm] = useState("");

  const { data: projects, isLoading } = useQuery({
    queryKey: ["projects", filter],
    queryFn: () => fetchProjects(filter),
    enabled: sessionStatus === "authenticated",
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await fetch("/api/projects", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) throw new Error("Update failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project status updated.");
    },
  });

  const toggleFeatureMutation = useMutation({
    mutationFn: async ({ id, isFeatured }: { id: string; isFeatured: boolean }) => {
      const res = await fetch("/api/projects", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isFeatured }),
      });
      if (!res.ok) throw new Error("Featured toggle failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project featured status updated.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/projects?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project deleted.");
    },
  });

  if (sessionStatus === "loading" || isLoading) return <SpinnerComponent />;

  const user = session?.user as any;
  if (!user || !canManageProjects(user)) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-2">
        <h2 className="text-2xl font-serif font-medium">Access Denied</h2>
        <p className="text-muted-foreground">You do not have permission to manage projects.</p>
      </div>
    );
  }

  const isGB = ["President", "Vice President", "General Secretary", "Treasurer"].includes(user.designation);
  const isRDAdmin = user?.buccDepartment === "Research and Development" && ["Director", "Assistant Director"].includes(user?.designation);
  const isSuper = isGB || isRDAdmin;

  const filteredProjects = projects?.filter((proj: any) => {
    return (
      proj.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proj.author?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proj.techStack.some((tech: string) => tech.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  return (
    <div className="space-y-10 pb-20">
      <Heading 
        headingText="Project Moderation" 
        subHeadingText="Review, approve, and refine projects submitted by BUCC members." 
      />

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="flex bg-muted p-1 rounded-md">
          {["pending", "approved", "rejected"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={cn(
                "px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-sm transition-all",
                filter === f ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search projects or tech..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
      </div>

      {/* Projects List */}
      <div className="grid grid-cols-1 gap-6">
        {filteredProjects?.length > 0 ? (
          filteredProjects.map((proj: any) => (
            <Card key={proj._id} className="border-border shadow-none overflow-hidden bg-card group">
              <div className="flex flex-col md:flex-row">
                {/* Image Preview */}
                <div className="md:w-64 h-48 md:h-auto relative shrink-0 overflow-hidden bg-muted">
                  <img src={proj.coverImage} alt={proj.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/20" />
                </div>

                <div className="flex-1 p-6 md:p-8 space-y-6">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-serif text-xl font-medium">{proj.title}</h3>
                        <Badge variant={proj.status === "pending" ? "default" : proj.status === "approved" ? "secondary" : "destructive"} className="text-[10px] uppercase font-bold tracking-widest">
                          {proj.status}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-muted-foreground font-light">
                        <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> {proj.author?.name || "Unknown"}</span>
                        <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> 
                          {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(proj.createdAt))}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {proj.status !== "approved" && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-9 gap-2 text-[10px] font-bold uppercase tracking-widest hover:bg-green-500/10 hover:text-green-600 hover:border-green-500/20"
                          onClick={() => updateStatusMutation.mutate({ id: proj._id, status: "approved" })}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                        </Button>
                      )}
                      {proj.status !== "rejected" && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-9 gap-2 text-[10px] font-bold uppercase tracking-widest hover:bg-red-500/10 hover:text-red-600 hover:border-red-500/20"
                          onClick={() => updateStatusMutation.mutate({ id: proj._id, status: "rejected" })}
                        >
                          <XCircle className="w-3.5 h-3.5" /> Reject
                        </Button>
                      )}
                      {proj.status === "approved" && isSuper && (
                        <Button 
                          variant={proj.isFeatured ? "default" : "outline"} 
                          size="sm" 
                          className={cn(
                            "h-9 gap-2 text-[10px] font-bold uppercase tracking-widest transition-all",
                            proj.isFeatured 
                              ? "bg-amber-500 text-white hover:bg-amber-600 border-amber-600" 
                              : "hover:bg-amber-500/10 hover:text-amber-600 hover:border-amber-500/20 border-border"
                          )}
                          onClick={() => toggleFeatureMutation.mutate({ id: proj._id, isFeatured: !proj.isFeatured })}
                        >
                          ★ {proj.isFeatured ? "Featured" : "Feature"}
                        </Button>
                      )}
                      <Link href={`/dashboard/projects/edit/${proj._id}`}>
                        <Button variant="outline" size="sm" className="h-9 gap-2 text-[10px] font-bold uppercase tracking-widest">
                          <Edit className="w-3.5 h-3.5" /> Edit
                        </Button>
                      </Link>
                      {isSuper && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-9 w-9 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/5"
                          onClick={() => {
                            if (confirm("Permanently delete this project?")) {
                              deleteMutation.mutate(proj._id);
                            }
                          }}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground font-light line-clamp-2">{proj.shortDescription}</p>

                  <div className="flex flex-wrap gap-2">
                    {proj.techStack.map((tech: string) => (
                      <Badge key={tech} variant="outline" className="text-[9px] font-medium bg-muted/50 border-border/50">
                        {tech}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center gap-4 pt-2">
                    <Link href={`/projects/${proj.slug}`} target="_blank" className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-primary hover:underline">
                      <Eye className="w-3.5 h-3.5" /> View Public Page
                    </Link>
                    {proj.deploymentLink && (
                      <a href={proj.deploymentLink} target="_blank" className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground">
                        <ExternalLink className="w-3.5 h-3.5" /> Live Demo
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="py-32 text-center border-2 border-dashed border-border rounded-lg bg-muted/10">
            <div className="space-y-4 max-w-xs mx-auto">
              <div className="p-4 bg-muted rounded-full w-fit mx-auto">
                <FolderRoot className="w-8 h-8 text-muted-foreground/40" />
              </div>
              <div className="space-y-1">
                <p className="font-serif text-lg text-muted-foreground">No projects found</p>
                <p className="text-xs text-muted-foreground/60">Change your filter or wait for member submissions.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
