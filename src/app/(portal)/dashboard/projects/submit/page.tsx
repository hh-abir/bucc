"use client";

import { useState } from "react";
import Heading from "@/components/portal/heading";
import ProjectForm from "@/components/portal/projects/ProjectForm";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function SubmitProjectPage() {
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
        throw new Error(error.error || "Failed to submit project");
      }

      toast.success("Project submitted successfully! It will be live once approved.");
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-10 pb-20">
      <Heading 
        headingText="Submit Your Project" 
        subHeadingText="Showcase your hard work to the BUCC community and potential recruiters." 
      />
      <div className="max-w-7xl">
        <ProjectForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </div>
  );
}
