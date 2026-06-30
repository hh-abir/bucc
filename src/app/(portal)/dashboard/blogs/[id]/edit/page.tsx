"use client";

import { authClient } from "@/lib/auth-client";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";

const BlockNoteEditor = dynamic(() => import("@/components/BlockNoteEditor"), { 
  ssr: false,
  loading: () => <div className="h-[500px] w-full bg-muted animate-pulse rounded-md border border-border" />
});

export default function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    featuredImage: "",
    category: "Technology",
    content: [] as any,
  });

  const { data: session } = authClient.useSession();
  const [status, setStatus] = useState<string>("draft");

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`/api/blogs/${id}`);
        const data = await res.json();
        if (res.ok) {
          setFormData({
            title: data.title,
            description: data.description,
            featuredImage: data.featuredImage,
            category: data.category,
            content: data.content,
          });
          setStatus(data.status || "draft");
        } else {
          toast.error("Failed to load blog");
          router.push("/dashboard/blogs");
        }
      } catch (error) {
        toast.error("An error occurred");
      } finally {
        setIsLoading(false);
      }
    };
    fetchBlog();
  }, [id, router]);



  const user = session?.user as any;
  const isAlumni = user?.memberStatus === "Alumni";
  const isGB = ["President", "Vice President", "General Secretary", "Treasurer"].includes(user?.designation) && !isAlumni;
  const isEBHead = ["Director", "Assistant Director"].includes(user?.designation) && !isAlumni;
  const isManager = isGB || isEBHead;

  const handleSubmit = async (e: React.FormEvent, targetStatus: "draft" | "submit" | "published") => {
    e.preventDefault();
    if (!formData.featuredImage) {
      toast.error("Please upload a featured image");
      return;
    }

    setIsSubmitting(true);
    try {
      // Determine new status
      let newStatus = status;
      if (targetStatus === "draft") {
        newStatus = "draft";
      } else if (targetStatus === "submit") {
        newStatus = isManager ? "published" : "pending";
      } else if (targetStatus === "published") {
        newStatus = "published";
      }

      const res = await fetch(`/api/blogs/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, status: newStatus }),
      });
      if (res.ok) {
        toast.success(targetStatus === "draft" ? "Blog saved as draft!" : (newStatus === "published") ? "Blog published!" : "Blog submitted for review!");
        router.push("/dashboard/blogs");
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to update blog");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-muted-foreground animate-pulse font-serif text-lg text-center mt-20">Loading your story...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20">
      <div className="flex items-center justify-between border-b border-border pb-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/blogs" className="p-2 hover:bg-muted rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-3xl font-serif font-bold tracking-tight">Edit Story</h1>
        </div>
        <div className="flex gap-4">
          {status !== "published" && (
            <button 
              type="button"
              disabled={isSubmitting}
              onClick={(e) => handleSubmit(e, "draft")}
              className="px-6 py-2 border border-border text-foreground rounded-md font-medium hover:bg-muted transition-colors disabled:opacity-50 text-sm"
            >
              Save as Draft
            </button>
          )}
          <button 
            type="button"
            disabled={isSubmitting}
            onClick={(e) => handleSubmit(e, status === "published" ? "published" : "submit")}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:opacity-90 transition-opacity disabled:opacity-50 text-sm"
          >
            {isSubmitting ? "Saving..." : status === "published" ? "Update Story" : isManager ? "Publish Story" : "Submit for Review"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-8">
          <div className="space-y-4">
            <input 
              required 
              placeholder="Title of your story..." 
              value={formData.title} 
              onChange={e => setFormData({...formData, title: e.target.value})} 
              className="w-full text-4xl font-serif font-bold bg-transparent border-none focus:outline-none placeholder:text-muted-foreground/30" 
            />
            <textarea 
              required 
              placeholder="A short, compelling description..." 
              rows={2} 
              value={formData.description} 
              onChange={e => setFormData({...formData, description: e.target.value})} 
              className="w-full text-xl text-muted-foreground bg-transparent border-none focus:outline-none resize-none placeholder:text-muted-foreground/30 leading-relaxed" 
            />
          </div>

          <div className="pt-4 border-t border-border">
            <BlockNoteEditor 
              initialValue={formData.content} 
              onChange={(json) => setFormData({...formData, content: json})} 
            />
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <section className="space-y-4 p-6 border border-border rounded-lg bg-card">
            <h3 className="font-serif text-lg font-bold">Settings</h3>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Category</label>
                <select 
                  value={formData.category} 
                  onChange={e => setFormData({...formData, category: e.target.value})} 
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm"
                >
                  <option>Technology</option>
                  <option>Club News</option>
                  <option>Events</option>
                  <option>Research</option>
                  <option>Tutorial</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Cover Image URL</label>
                <input 
                  type="text"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={formData.featuredImage}
                  onChange={e => setFormData({...formData, featuredImage: e.target.value})}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground/30"
                />
                {formData.featuredImage && (
                  <div className="aspect-[4/3] w-full border border-border rounded-lg overflow-hidden bg-muted/10 relative group mt-2">
                    <img src={formData.featuredImage} className="object-cover w-full h-full" alt="Preview" onError={(e) => { (e.target as any).src = ""; }} />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button type="button" onClick={() => setFormData({...formData, featuredImage: ""})} className="bg-destructive text-white p-2 rounded-full shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
