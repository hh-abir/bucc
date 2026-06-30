"use client";

import { authClient } from "@/lib/auth-client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, Trash2, RefreshCw } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import SpinnerComponent from "@/components/SpinnerComponent";

const BlockNoteEditor = dynamic(() => import("@/components/BlockNoteEditor"), { 
  ssr: false,
  loading: () => <div className="h-[500px] w-full bg-muted animate-pulse rounded-md border border-border" />
});

export default function EditPressReleasePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { data: session } = authClient.useSession();

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<any>(null);

  useEffect(() => {
    const fetchRelease = async () => {
      try {
        const res = await fetch(`/api/press-releases?id=${id}`);
        const data = await res.json();
        if (res.ok) {
          setFormData(data);
        } else {
          toast.error("Failed to load release");
        }
      } catch (err) {
        toast.error("Error fetching release");
      } finally {
        setIsLoading(false);
      }
    };
    fetchRelease();
  }, [id]);



  const user = session?.user as any;
  const isAlumni = user?.memberStatus === "Alumni";
  const isGB = ["President", "Vice President", "General Secretary", "Treasurer"].includes(user?.designation) && !isAlumni;
  const isPRModerator = user?.buccDepartment === "Press Release and Publications" && ["Director", "Assistant Director"].includes(user?.designation) && !isAlumni;
  const isManager = isGB || isPRModerator;

  const handleSubmit = async (e: React.FormEvent, targetStatus: "draft" | "submit" | "published") => {
    e.preventDefault();
    if (!formData.title) {
      toast.error("Title is required");
      return;
    }
    if (!formData.featuredImage) {
      toast.error("Cover image is required for official releases");
      return;
    }

    setIsSubmitting(true);
    try {
      let newStatus = formData.status;
      if (targetStatus === "draft") {
        newStatus = "draft";
      } else if (targetStatus === "submit") {
        newStatus = isManager ? "published" : "pending";
      } else if (targetStatus === "published") {
        newStatus = "published";
      }

      const res = await fetch(`/api/press-releases?id=${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, status: newStatus }),
      });
      if (res.ok) {
        toast.success(targetStatus === "draft" ? "Press Release saved as draft!" : (newStatus === "published") ? "Press Release published!" : "Press Release submitted for review!");
        router.push("/dashboard/press-releases");
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to update");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <SpinnerComponent />;
  if (!formData) return <div className="p-20 text-center">Release not found.</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20 pt-10">
      <div className="flex items-center justify-between border-b border-border pb-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/press-releases" className="p-2 hover:bg-muted rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-3xl font-serif font-bold tracking-tight text-foreground">Edit Release</h1>
        </div>
        <div className="flex gap-4">
          {formData.status !== "published" && (
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
            onClick={(e) => handleSubmit(e, formData.status === "published" ? "published" : "submit")}
            className="px-6 py-2 bg-foreground text-background rounded-md font-medium hover:opacity-90 transition-opacity disabled:opacity-50 text-sm"
          >
            {isSubmitting ? "Saving..." : formData.status === "published" ? "Update Release" : isManager ? "Publish Release" : "Submit for Review"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-8">
          <div className="space-y-4">
            <input 
              required 
              placeholder="Release Title..." 
              value={formData.title} 
              onChange={e => setFormData({...formData, title: e.target.value})} 
              className="w-full text-4xl font-serif font-bold bg-transparent border-none focus:outline-none placeholder:text-muted-foreground/20" 
            />
            <textarea 
              required 
              placeholder="Official summary or lead paragraph..." 
              rows={3} 
              value={formData.description} 
              onChange={e => setFormData({...formData, description: e.target.value})} 
              className="w-full text-xl text-muted-foreground bg-transparent border-none focus:outline-none resize-none placeholder:text-muted-foreground/20 leading-relaxed italic border-l-2 border-border pl-6" 
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
            <h3 className="font-serif text-lg font-bold">Release Settings</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Official Banner URL</label>
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
