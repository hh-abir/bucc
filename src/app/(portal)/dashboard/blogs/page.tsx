"use client";

import { authClient } from "@/lib/auth-client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, User, FileText, Check, X, Bookmark } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Blog {
  _id: string;
  title: string;
  description: string;
  featuredImage: string;
  category: string;
  status: string;
  createdDate: string;
  author: {
    authorName: string;
    authorId: string;
  };
}

export default function BlogManagement() {
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "published" | "pending" | "draft">("all");

  const fetchBlogs = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/blogs");
      const data = await res.json();
      if (Array.isArray(data)) {
        setBlogs(data);
      } else {
        setBlogs([]);
      }
    } catch (error) {
      toast.error("Failed to load blogs");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  if (sessionPending || isLoading) {
    return <div className="p-8 text-muted-foreground animate-pulse font-serif text-lg text-center mt-20">Loading your stories...</div>;
  }

  const user = session?.user as any;
  const isAlumni = user?.memberStatus === "Alumni";
  const isGB = ["President", "Vice President", "General Secretary", "Treasurer"].includes(user?.designation) && !isAlumni;
  const isEBHead = ["Director", "Assistant Director"].includes(user?.designation) && !isAlumni;
  const isManager = isGB || isEBHead;

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog?")) return;
    try {
      const res = await fetch(`/api/blogs/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Blog deleted");
        fetchBlogs();
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to delete blog");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const res = await fetch(`/api/blogs/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "published" }),
      });
      if (res.ok) {
        toast.success("Blog post approved & published!");
        fetchBlogs();
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to approve blog");
      }
    } catch (error) {
      toast.error("An error occurred during approval");
    }
  };

  const filteredBlogs = blogs.filter((blog) => {
    if (activeTab === "all") return true;
    return blog.status === activeTab;
  });

  const getStatusBadge = (status: string) => {
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
    <div className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-6">
        <div>
          <h1 className="text-4xl font-serif tracking-tight text-foreground font-bold">Blogs</h1>
          <p className="text-muted-foreground mt-2 text-lg max-w-xl">
            {isManager 
              ? "Review and approve member submissions or publish official club announcements."
              : "Share your insights, tutorials, and club news with the BUCC community."}
          </p>
        </div>
        <Link 
          href="/dashboard/blogs/new"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-md font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" /> Start Writing
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border gap-6">
        {(["all", "published", "pending", "draft"] as const).map((tab) => {
          const count = blogs.filter((b) => tab === "all" || b.status === tab).length;
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

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredBlogs.length === 0 ? (
          <div className="col-span-full p-24 border border-dashed border-border rounded-lg text-center space-y-4">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
               <FileText className="w-8 h-8 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <h2 className="font-serif text-xl font-medium">No stories found</h2>
              <p className="text-muted-foreground text-sm">
                There are no blog posts matching the "{activeTab}" filter.
              </p>
            </div>
            {activeTab === "draft" && (
              <Link href="/dashboard/blogs/new" className="inline-block text-primary font-medium hover:underline text-sm decoration-1 underline-offset-4">
                Write a draft post
              </Link>
            )}
          </div>
        ) : (
          filteredBlogs.map((blog) => {
            const canEdit = isManager || (blog.author.authorId === user?.id && blog.status !== "published");
            const canDelete = isManager || (blog.author.authorId === user?.id && blog.status !== "published");

            return (
              <div key={blog._id} className="group border border-border rounded-lg bg-card shadow-sm hover:shadow-md transition-all flex flex-col h-full overflow-hidden">
                <div className="aspect-video w-full overflow-hidden relative bg-muted border-b border-border">
                  <img 
                    src={blog.featuredImage} 
                    alt={blog.title} 
                    className="object-cover w-full h-full group-hover:scale-102 transition-transform duration-700" 
                  />
                  <div className="absolute top-3 left-3">
                    <span className={cn("text-[9px] font-bold uppercase px-2.5 py-1 rounded-full border tracking-widest backdrop-blur-sm shadow-sm", getStatusBadge(blog.status))}>
                      {blog.status === "pending" ? "pending approval" : blog.status}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-1 justify-between">
                  <div className="space-y-3 flex-1">
                    <p className="text-[10px] font-bold uppercase text-primary tracking-widest">{blog.category}</p>
                    <h2 className="text-lg font-serif font-bold text-foreground leading-tight line-clamp-2">{blog.title}</h2>
                    <p className="text-sm text-muted-foreground font-light line-clamp-3 leading-relaxed">{blog.description}</p>
                  </div>
                  
                  <div className="pt-6 border-t border-border mt-6 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-light text-muted-foreground">
                      <User className="w-3.5 h-3.5 text-primary" />
                      <span>{blog.author.authorName}</span>
                    </div>
                    <div className="flex gap-2 items-center">
                      {isManager && blog.status === "pending" && (
                        <button
                          onClick={() => handleApprove(blog._id)}
                          className="p-2 hover:bg-emerald-100 dark:hover:bg-emerald-950/40 rounded-md text-emerald-600 hover:text-emerald-800 dark:hover:text-emerald-300 transition-colors"
                          title="Approve & Publish"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                      {canEdit && (
                        <Link 
                          href={`/dashboard/blogs/${blog._id}/edit`}
                          className="p-2 hover:bg-muted rounded-md text-muted-foreground hover:text-foreground transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                      )}
                      {canDelete && (
                        <button 
                          onClick={() => handleDelete(blog._id)}
                          className="p-2 hover:bg-destructive/10 rounded-md text-muted-foreground hover:text-destructive transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
