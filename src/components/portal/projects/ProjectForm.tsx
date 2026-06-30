"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import MultipleSelector from "@/components/ui/multiple-selector";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import dynamic from "next/dynamic";
import { 
  Plus, 
  X, 
  Link as LinkIcon, 
  Github, 
  Globe, 
  Image as ImageIcon,
  Save,
  Rocket
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Dynamically import BlockNoteEditor to avoid SSR issues
const BlockNoteEditor = dynamic(() => import("@/components/BlockNoteEditor"), {
  ssr: false,
});

const projectSchema = zod.object({
  title: zod.string().min(3, "Title must be at least 3 characters"),
  coverImage: zod.string().url("Please enter a valid image URL"),
  shortDescription: zod.string().min(10, "Provide a brief summary").max(200, "Too long! Max 200 chars"),
  deploymentLink: zod.string().url("Invalid URL").optional().or(zod.literal("")),
  sourceCodeLink: zod.string().url("Invalid URL").optional().or(zod.literal("")),
  techStack: zod.array(zod.string()).min(1, "Add at least one technology"),
  contributors: zod.array(zod.string()).optional().default([]),
});

interface ProjectFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
  submitButtonText?: string;
}

export default function ProjectForm({ 
  initialData, 
  onSubmit, 
  isSubmitting,
  submitButtonText = "Submit Project"
}: ProjectFormProps) {
  const [fullDescription, setFullDescription] = useState<any>(
    initialData?.fullDescription ? JSON.parse(initialData.fullDescription) : []
  );
  const [techInput, setTechInput] = useState("");
  const [members, setMembers] = useState<any[]>([]);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await fetch("/api/members?minimal=true");
        if (res.ok) {
          const data = await res.json();
          setMembers(data.users || []);
        }
      } catch (err) {
        console.error("Failed to load members:", err);
      }
    };
    fetchMembers();
  }, []);

  const form = useForm<zod.infer<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: initialData?.title || "",
      coverImage: initialData?.coverImage || "",
      shortDescription: initialData?.shortDescription || "",
      deploymentLink: initialData?.deploymentLink || "",
      sourceCodeLink: initialData?.sourceCodeLink || "",
      techStack: initialData?.techStack || [],
      contributors: initialData?.contributors?.map((c: any) => c._id || c) || [],
    },
  });

  const handleTechAdd = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && techInput.trim()) {
      e.preventDefault();
      const currentTech = form.getValues("techStack");
      if (!currentTech.includes(techInput.trim())) {
        form.setValue("techStack", [...currentTech, techInput.trim()]);
      }
      setTechInput("");
    }
  };

  const removeTech = (tech: string) => {
    const currentTech = form.getValues("techStack");
    form.setValue("techStack", currentTech.filter(t => t !== tech));
  };

  const handleFormSubmit = (values: zod.infer<typeof projectSchema>) => {
    if (!fullDescription || fullDescription.length === 0) {
      toast.error("Please provide a full project description.");
      return;
    }
    onSubmit({
      ...values,
      fullDescription: JSON.stringify(fullDescription),
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Basic Info */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Project Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. BUCC Web Portal" {...field} className="bg-muted/30 border-border h-12" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="shortDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Short Summary</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="A brief overview of your project..." 
                        {...field} 
                        className="bg-muted/30 border-border resize-none h-24" 
                      />
                    </FormControl>
                    <FormDescription className="text-[10px]">Appears in the gallery card. Max 200 chars.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <FormLabel className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Tech Stack</FormLabel>
                <div className="flex flex-wrap gap-2 min-h-10 p-2 border border-border rounded-md bg-muted/20">
                  {form.watch("techStack").map((tech) => (
                    <Badge key={tech} variant="secondary" className="gap-1 h-6 text-[10px] bg-background border-border">
                      {tech}
                      <X size={12} className="cursor-pointer hover:text-destructive" onClick={() => removeTech(tech)} />
                    </Badge>
                  ))}
                  <input
                    placeholder="Press Enter to add tags..."
                    className="flex-1 bg-transparent border-none outline-none text-sm min-w-[150px]"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyDown={handleTechAdd}
                  />
                </div>
                {form.formState.errors.techStack && (
                  <p className="text-sm font-medium text-destructive">{form.formState.errors.techStack.message}</p>
                )}
              </div>

              {/* Contributors Selection */}
              <div className="space-y-4 pt-2">
                <FormLabel className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Contributors (Optional)</FormLabel>
                <MultipleSelector
                  value={form.watch("contributors")?.map((cId: string) => {
                    const found = members.find((m: any) => m.id === cId);
                    return {
                      label: found ? `${found.name} (${found.designation})` : cId,
                      value: cId,
                    };
                  }) || []}
                  onChange={(options) => form.setValue("contributors", options.map(o => o.value))}
                  defaultOptions={members.map((member: any) => ({
                    label: `${member.name} (${member.designation})`,
                    value: member.id,
                  }))}
                  placeholder="Select co-contributors..."
                  className="bg-muted/30 border-border"
                  badgeClassName="bg-primary/10 text-primary border-primary/20"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <FormField
                  control={form.control}
                  name="deploymentLink"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground flex items-center gap-2">
                        <Globe size={12} /> Live Link
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="https://..." {...field} className="bg-muted/30 border-border h-10 text-sm" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sourceCodeLink"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground flex items-center gap-2">
                        <Github size={12} /> Repo Link
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="https://github..." {...field} className="bg-muted/30 border-border h-10 text-sm" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          {/* Right Column: Visuals & Preview */}
          <div className="lg:col-span-7 space-y-8">
            <FormField
              control={form.control}
              name="coverImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground flex items-center gap-2">
                    <ImageIcon size={12} /> Cover Image URL
                  </FormLabel>
                  <FormControl>
                    <div className="flex gap-2">
                      <Input placeholder="https://images.unsplash.com/..." {...field} className="bg-muted/30 border-border h-12" />
                    </div>
                  </FormControl>
                  <FormDescription className="text-[10px]">Use Unsplash, Imgur, or any direct image link.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="aspect-video w-full bg-muted rounded-lg border border-border relative overflow-hidden group">
              {form.watch("coverImage") ? (
                <img 
                  src={form.watch("coverImage")} 
                  alt="Preview" 
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  onError={(e) => {
                    (e.target as any).src = "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop";
                  }}
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground/40 space-y-2">
                  <ImageIcon size={40} strokeWidth={1} />
                  <p className="text-xs font-serif italic">Image Preview will appear here</p>
                </div>
              )}
              <div className="absolute inset-0 bg-black/10 pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4">
                 <div className="h-6 w-24 bg-white/20 backdrop-blur-md rounded-sm animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* Full Description Section (BlockNote) */}
        <div className="space-y-6 pt-6 border-t border-border">
          <div className="space-y-1">
            <h2 className="text-xl font-serif font-medium">Detailed Case Study</h2>
            <p className="text-sm text-muted-foreground font-light">Tell the full story: challenges, solutions, and key features.</p>
          </div>
          <BlockNoteEditor 
            initialValue={fullDescription} 
            onChange={(content) => setFullDescription(content)} 
          />
        </div>

        <div className="flex justify-end pt-8">
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="bg-foreground text-background h-14 px-12 font-bold uppercase tracking-widest gap-3 transition-all hover:scale-[1.02]"
          >
            {isSubmitting ? (
              "Processing..."
            ) : (
              <>
                {submitButtonText} <Rocket className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
