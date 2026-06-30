"use client";

import SpinnerComponent from "@/components/SpinnerComponent";
import Heading from "@/components/portal/heading";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";
import { FileText, Plus, Edit, Trash2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { isGoverningBody as checkGB } from "@/lib/permissions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const getPressReleases = async () => {
  const res = await fetch("/api/press-releases");
  if (!res.ok) throw new Error("Failed to fetch press releases");
  return res.json();
};

export default function PressReleaseManagementPage() {
  const { data: session, status: sessionStatus } = useSession();
  const [activeTab, setActiveTab] = useState<"all" | "published" | "pending" | "draft">("all");
  const queryClient = useQueryClient();

  const { data: releases, isLoading } = useQuery({
    queryKey: ["press-releases-list"],
    queryFn: getPressReleases,
    enabled: sessionStatus === "authenticated",
  });

  if (sessionStatus === "loading" || isLoading) return <SpinnerComponent />;

  const user = session?.user as any;
  const isAlumni = user?.memberStatus === "Alumni";
  const isGB = user ? checkGB(user) : false;
  const isPRModerator = !isAlumni && user?.buccDepartment === "Press Release and Publications" && ["Director", "Assistant Director"].includes(user?.designation);
  const isPRSE = !isAlumni && user?.buccDepartment === "Press Release and Publications" && user?.designation === "Senior Executive";

  if (!isGB && !isPRModerator && !isPRSE) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-2">
        <h2 className="text-2xl font-serif font-medium">Access Denied</h2>
        <p className="text-muted-foreground">You do not have permission to manage press releases.</p>
      </div>
    );
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this press release?")) return;
    try {
      const res = await fetch(`/api/press-releases?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Press release deleted successfully");
        queryClient.invalidateQueries({ queryKey: ["press-releases-list"] });
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to delete press release");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const res = await fetch(`/api/press-releases?id=${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "published" }),
      });
      if (res.ok) {
        toast.success("Press release approved & published!");
        queryClient.invalidateQueries({ queryKey: ["press-releases-list"] });
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to approve press release");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const filteredReleases = (releases || []).filter((release: any) => {
    if (activeTab === "all") return true;
    return release.status === activeTab;
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "published":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900/30";
      case "pending":
        return "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-900/30";
      case "draft":
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-6">
        <Heading 
          headingText="Press Releases" 
          subHeadingText="Manage official club statements and announcements." 
        />
        <Link href="/dashboard/press-releases/new">
          <Button className="gap-2 bg-foreground text-background">
            <Plus className="w-4 h-4" /> New Press Release
          </Button>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border gap-6">
        {(["all", "published", "pending", "draft"] as const).map((tab) => {
          const count = (releases || []).filter((r: any) => tab === "all" || r.status === tab).length;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "pb-4 text-sm font-medium border-b-2 transition-all capitalize px-1 flex items-center gap-2 -mb-[2px]",
                activeTab === tab 
                  ? "border-foreground text-foreground" 
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              {tab === "pending" ? "Pending Approval" : tab === "draft" ? "Drafts" : tab}
              <span className="text-xs px-2 py-0.5 rounded-full bg-muted font-mono text-muted-foreground">
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReleases.map((release: any) => {
          const isAuthor = release.author?.authorId?.toString() === user?.id;
          const canEdit = isGB || isPRModerator || (isAuthor && release.status !== "published");
          const canDelete = isGB || isPRModerator || (isAuthor && release.status !== "published");

          return (
            <div key={release._id} className="group border border-border bg-card rounded-md overflow-hidden hover:shadow-md transition-all flex flex-col h-full">
              <div className="aspect-video relative bg-muted overflow-hidden">
                {release.featuredImage ? (
                  <img 
                    src={release.featuredImage} 
                    alt={release.title} 
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FileText className="w-8 h-8 text-muted-foreground/20" />
                  </div>
                )}
                <div className="absolute top-3 left-3">
                  <span className={cn("text-[9px] font-bold uppercase px-2.5 py-1 rounded-full border tracking-widest backdrop-blur-sm shadow-sm", getStatusBadgeVariant(release.status))}>
                    {release.status === "pending" ? "pending approval" : release.status}
                  </span>
                </div>
              </div>
              
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="font-serif text-lg font-medium leading-tight group-hover:text-primary transition-colors line-clamp-2">
                    {release.title}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 font-light">
                    {release.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border/50">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-widest">
                    {new Date(release.createdDate).toLocaleDateString()}
                  </span>
                  <div className="flex items-center gap-2">
                    {(isGB || isPRModerator) && release.status === "pending" && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                        title="Approve & Publish"
                        onClick={() => handleApprove(release._id)}
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                    )}
                    {canEdit && (
                      <Link href={`/dashboard/press-releases/edit/${release._id}`}>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Edit className="w-3.5 h-3.5" />
                        </Button>
                      </Link>
                    )}
                    {canDelete && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => handleDelete(release._id)}
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {filteredReleases.length === 0 && (
          <div className="col-span-full py-20 text-center border border-dashed border-border rounded-md">
            <p className="text-muted-foreground font-serif">No press releases found in this section.</p>
          </div>
        )}
      </div>
    </div>
  );
}
