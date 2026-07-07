"use client";

import { useState, useEffect } from "react";
import SpinnerComponent from "@/components/SpinnerComponent";
import Heading from "@/components/portal/heading";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSession } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { 
  Plus, 
  Trash2, 
  Save, 
  ArrowLeft,
  Layout,
  Image as ImageIcon,
  Type,
  Link as LinkIcon,
  MousePointer2,
  GripVertical,
  AlertTriangle
} from "lucide-react";
import Link from "next/link";
import { motion, Reorder } from "framer-motion";

const fetchHeroConfig = async () => {
  const res = await fetch("/api/config?key=hero_carousel_config");
  if (!res.ok) throw new Error("Failed to fetch config");
  const data = await res.json();
  return data.value || [];
};

export default function HeroConfigPage() {
  const queryClient = useQueryClient();
  const { data: session, status: sessionStatus } = useSession();
  const [slides, setSlides] = useState<any[]>([]);
  const [uploadingSlideId, setUploadingSlideId] = useState<number | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["hero-carousel-config"],
    queryFn: fetchHeroConfig,
    enabled: sessionStatus === "authenticated",
  });

  useEffect(() => {
    if (data) {
      setSlides(data);
    }
  }, [data]);

  const mutation = useMutation({
    mutationFn: async (updatedSlides: any[]) => {
      const res = await fetch("/api/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "hero_carousel_config", value: updatedSlides }),
      });
      if (!res.ok) throw new Error("Failed to save config");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Hero carousel updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["hero-carousel-config"] });
    },
    onError: () => {
      toast.error("Failed to update hero carousel.");
    }
  });

  if (sessionStatus === "loading" || isLoading) return <SpinnerComponent />;

  const user = session?.user as any;
  const userDept = user?.buccDepartment?.toLowerCase() || "";
  const userDesignation = user?.designation?.toLowerCase() || "";

  const isGB = ["president", "vice president", "vice-president", "general secretary", "treasurer"].includes(userDesignation);
  const isRDHead = userDept === "research and development" && ["director", "assistant director"].includes(userDesignation);

  if (!isGB && !isRDHead) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-2">
        <h2 className="text-2xl font-serif font-medium">Access Denied</h2>
        <p className="text-muted-foreground">You do not have permission to manage the hero carousel.</p>
      </div>
    );
  }

  const addSlide = () => {
    const newSlide = {
      id: Date.now(),
      title: "New Slide Title",
      subtitle: "New slide subtitle goes here.",
      image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop",
      link: "/",
      cta: "Learn More"
    };
    setSlides([...slides, newSlide]);
  };

  const removeSlide = (id: number) => {
    setSlides(slides.filter(slide => slide.id !== id));
  };

  const updateSlide = (id: number, field: string, value: string) => {
    setSlides(slides.map(slide => slide.id === id ? { ...slide, [field]: value } : slide));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, slideId: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB.");
      return;
    }

    setUploadingSlideId(slideId);
    const body = new FormData();
    body.append("file", file);

    try {
      const res = await fetch("/api/upload?type=carousel", {
        method: "POST",
        body: body,
      });

      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      updateSlide(slideId, "image", data.url);
      toast.success("Background image uploaded!");
    } catch (err: any) {
      toast.error(err.message || "Failed to upload image");
    } finally {
      setUploadingSlideId(null);
    }
  };

  const handleSave = () => {
    mutation.mutate(slides);
  };

  return (
    <div className="space-y-10 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/broadcast">
            <Button variant="ghost" size="icon" className="h-10 w-10 border border-border">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <Heading 
            headingText="Hero Configuration" 
            subHeadingText="Customize the main carousel slides on the homepage." 
          />
        </div>
        <Button 
          onClick={handleSave} 
          disabled={mutation.isPending}
          className="bg-foreground text-background font-bold uppercase text-[10px] tracking-widest h-10 px-6 gap-2"
        >
          {mutation.isPending ? "Saving..." : <><Save className="w-3.5 h-3.5" /> Save Changes</>}
        </Button>
      </div>

      <div className="max-w-4xl space-y-8">
        <Reorder.Group axis="y" values={slides} onReorder={setSlides} className="space-y-6">
          {slides.map((slide) => (
            <Reorder.Item key={slide.id} value={slide}>
              <Card className="border-border shadow-none bg-card relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing text-muted-foreground/30 group-hover:text-muted-foreground transition-colors">
                  <GripVertical className="w-5 h-5" />
                </div>
                <CardHeader className="pl-10 sm:pl-12 pr-4 flex flex-row items-center justify-between border-b border-border/50 py-4">
                  <div className="flex items-center gap-3">
                    <Layout className="w-4 h-4 text-primary" />
                    <CardTitle className="text-sm font-serif">{slide.title || "Untitled Slide"}</CardTitle>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/5"
                    onClick={() => removeSlide(slide.id)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </CardHeader>
                <CardContent className="pl-10 sm:pl-12 pr-4 sm:pr-6 pt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-2">
                        <Type className="w-3 h-3" /> Slide Title
                      </Label>
                      <Input 
                        value={slide.title}
                        onChange={e => updateSlide(slide.id, "title", e.target.value)}
                        placeholder="Enter headline..."
                        className="bg-muted/30 border-border h-10 text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-2">
                        <Type className="w-3 h-3" /> Subtitle / Description
                      </Label>
                      <Input 
                        value={slide.subtitle}
                        onChange={e => updateSlide(slide.id, "subtitle", e.target.value)}
                        placeholder="Enter description..."
                        className="bg-muted/30 border-border h-10 text-sm"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-2">
                          <MousePointer2 className="w-3 h-3" /> Button Text
                        </Label>
                        <Input 
                          value={slide.cta}
                          onChange={e => updateSlide(slide.id, "cta", e.target.value)}
                          placeholder="e.g. Join Us"
                          className="bg-muted/30 border-border h-10 text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-2">
                          <LinkIcon className="w-3 h-3" /> Target Link
                        </Label>
                        <Input 
                          value={slide.link}
                          onChange={e => updateSlide(slide.id, "link", e.target.value)}
                          placeholder="e.g. /registration"
                          className="bg-muted/30 border-border h-10 text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-2">
                        <ImageIcon className="w-3 h-3" /> Background Image URL
                      </Label>
                      <div className="flex gap-3 items-end">
                        <Input 
                          value={slide.image}
                          onChange={e => updateSlide(slide.id, "image", e.target.value)}
                          placeholder="https://..."
                          className="bg-muted/30 border-border h-10 text-sm flex-1"
                        />
                        <Button 
                          type="button" 
                          variant="outline"
                          disabled={uploadingSlideId === slide.id}
                          onClick={() => document.getElementById(`carousel-upload-${slide.id}`)?.click()}
                          className="border-border h-10 px-3 text-xs shrink-0 bg-transparent hover:bg-muted"
                        >
                          {uploadingSlideId === slide.id ? "Uploading..." : "Upload File"}
                        </Button>
                        <input 
                          type="file" 
                          id={`carousel-upload-${slide.id}`} 
                          className="hidden" 
                          accept="image/*" 
                          onChange={(e) => handleImageUpload(e, slide.id)} 
                        />
                      </div>
                    </div>
                    <div className="aspect-video bg-muted rounded-md overflow-hidden border border-border relative">
                      {slide.image ? (
                        <img src={slide.image} alt="Preview" className="object-cover w-full h-full" />
                      ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground/40 font-serif italic text-xs">
                          No Preview Available
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/20 pointer-events-none" />
                      <div className="absolute bottom-3 left-3 right-3 text-[10px] font-bold text-white uppercase tracking-widest drop-shadow-md truncate">
                        Live Preview (Mockup)
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Reorder.Item>
          ))}
        </Reorder.Group>

        <Button 
          variant="outline" 
          onClick={addSlide}
          className="w-full border-dashed border-2 border-border h-24 hover:border-primary/50 hover:bg-muted/50 transition-all group"
        >
          <div className="flex flex-col items-center gap-2">
            <Plus className="w-6 h-6 text-muted-foreground group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Add New Carousel Slide</span>
          </div>
        </Button>
      </div>

      <Card className="max-w-4xl border-amber-500/20 bg-amber-500/5 shadow-none">
        <CardContent className="p-4 flex gap-4 items-center">
          <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />
          <p className="text-xs text-amber-700 font-medium">
            Remember to save your changes. Updates are reflected immediately on the public homepage after saving. 
            Ensure image URLs are from reliable sources (like Unsplash or Cloudinary).
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
