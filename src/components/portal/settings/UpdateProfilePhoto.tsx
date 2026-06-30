"use client";

import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUser } from "@/context/UserContext";
import { toast } from "sonner";
import { Camera, RefreshCw, Check, X as CloseIcon } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function UpdateProfilePhoto() {
  const { user, refreshUser } = useUser();
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type and size
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB.");
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (!selectedFile) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      // 1. Upload to Cloudinary via internal API
      const uploadRes = await fetch("/api/upload?type=profile", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) throw new Error("Upload to cloud failed");
      const { url } = await uploadRes.json();

      // 2. Update user profile in DB
      const updateRes = await fetch(`/api/member?id=${user?.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: url }),
      });

      if (updateRes.ok) {
        toast.success("Profile photo updated!");
        setSelectedFile(null);
        setPreviewUrl(null);
        await refreshUser();
      } else {
        throw new Error("Failed to save photo to profile");
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred during upload");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const triggerUpload = () => {
    document.getElementById("profile-photo-input")?.click();
  };

  return (
    <Card className="border-border shadow-none bg-card">
      <CardHeader>
        <CardTitle className="text-xl font-serif">Profile Picture</CardTitle>
        <CardDescription>Your photo will be visible to other club members.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center space-y-6 pt-4">
        <input 
          id="profile-photo-input"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileSelect}
          disabled={loading}
        />
        <div className="relative group">
          <div className="h-32 w-32 rounded-full overflow-hidden border-2 border-border group-hover:border-primary transition-colors relative bg-muted">
            {(previewUrl || user?.image) ? (
              <Image 
                src={previewUrl || user?.image || ""} 
                alt={user?.name || "Member"} 
                fill 
                sizes="128px"
                className="object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center">
                <Camera className="h-10 w-10 text-muted-foreground/30" />
              </div>
            )}
            {loading && (
              <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                <RefreshCw className="h-6 w-6 animate-spin text-primary" />
              </div>
            )}
          </div>
          {!selectedFile && (
            <button 
              disabled={loading}
              className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full shadow-lg hover:scale-110 transition-transform disabled:opacity-50"
              onClick={triggerUpload}
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="text-center">
          <p className="text-sm font-medium text-foreground">{user?.name}</p>
          <p className="text-xs text-muted-foreground">{user?.designation}</p>
        </div>

        {selectedFile ? (
          <div className="flex w-full gap-3">
            <Button 
              className="flex-1 bg-foreground text-background hover:opacity-90 transition-all font-medium gap-2"
              disabled={loading}
              onClick={handleSave}
            >
              {loading ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
              {loading ? "Saving..." : "Save"}
            </Button>
            <Button 
              variant="outline"
              className="flex-1 border-border gap-2"
              disabled={loading}
              onClick={handleCancel}
            >
              <CloseIcon className="w-3 h-3" />
              Cancel
            </Button>
          </div>
        ) : (
          <Button 
            variant="outline"
            disabled={loading}
            className="w-full border-border hover:bg-muted font-medium"
            onClick={triggerUpload}
          >
            Change Photo
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
