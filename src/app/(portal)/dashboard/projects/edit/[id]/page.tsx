"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Heading from "@/components/portal/heading";
import ProjectForm from "@/components/portal/projects/ProjectForm";
import SpinnerComponent from "@/components/SpinnerComponent";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

const fetchProject = async (id: string) => {
  const res = await fetch(`/api/projects?id=${id}`);
  if (!res.ok) throw new Error("Failed to fetch project");
  return res.json();
};

export default function EditProjectPage() {
  const params = useParams();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data: project, isLoading, error } = useQuery({
    queryKey: ["project", params.id],
    queryFn: () => fetchProject(params.id as string),
    enabled: !!params.id,
  });

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/projects", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: params.id, ...data }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update project");
      }

      toast.success("Project updated successfully!");
      router.back();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to permanently delete this project?")) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/projects?id=${params.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to delete project");
      }

      toast.success("Project deleted successfully!");
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) return <SpinnerComponent />;
  if (error) return <div className="text-center py-20">Error loading project</div>;

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 border-b border-border pb-6">
        <Heading 
          headingText="Edit Project" 
          subHeadingText={`Refining: ${project.title}`} 
        />
        <Button
          variant="destructive"
          onClick={handleDelete}
          disabled={isDeleting || isSubmitting}
          className="w-full sm:w-auto h-11 px-6 font-bold uppercase tracking-widest gap-2"
        >
          <Trash2 className="w-4 h-4" />
          {isDeleting ? "Deleting..." : "Delete Project"}
        </Button>
      </div>
      <div className="max-w-7xl">
        <ProjectForm 
          initialData={project} 
          onSubmit={handleSubmit} 
          isSubmitting={isSubmitting} 
          submitButtonText="Save Changes"
        />
      </div>
    </div>
  );
}
