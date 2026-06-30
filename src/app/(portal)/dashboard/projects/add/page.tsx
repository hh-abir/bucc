"use client";

import { useState } from "react";
import Heading from "@/components/portal/heading";
import ProjectForm from "@/components/portal/projects/ProjectForm";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function AdminAddProjectPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        throw new Error(error.error || "Failed to add project");
      }

      toast.success("Project published successfully!");
      router.push("/dashboard/projects/requests"); // Or to the gallery
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-10 pb-20">
      <Heading 
        headingText="Add New Project" 
        subHeadingText="Directly publish a project to the showcase gallery." 
      />
      <div className="max-w-7xl">
        <ProjectForm 
          onSubmit={handleSubmit} 
          isSubmitting={isSubmitting} 
          submitButtonText="Publish Project"
        />
      </div>
    </div>
  );
}
