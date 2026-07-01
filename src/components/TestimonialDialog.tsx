"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Award, Plus } from "lucide-react";
import { isSuperUser } from "@/lib/permissions";

interface TestimonialDialogProps {
  targetMemberId: string;
  targetMemberName: string;
}

export default function TestimonialDialog({ targetMemberId, targetMemberName }: TestimonialDialogProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [relationship, setRelationship] = useState("");
  const [content, setContent] = useState("");

  const currentUser = session?.user as any;

  if (!currentUser) return null;

  // Check if current user has permissions (EB or Alumni)
  const isGB = isSuperUser(currentUser);
  const isEB = ["Director", "Assistant Director", "Senior Executive", "Executive"].includes(currentUser.designation);
  const isAlumni = currentUser.memberStatus === "Alumni";

  const isSelf = currentUser.id === targetMemberId || currentUser._id === targetMemberId;

  // Only allow EB members or Alumni to write recommendations, and not for themselves
  if ((!isGB && !isEB && !isAlumni) || isSelf) {
    return null;
  }

  // Pre-fill default relationship
  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen && !relationship) {
      if (isAlumni) {
        setRelationship(`Former ${currentUser.designation} (Alumni)`);
      } else {
        setRelationship(`${currentUser.designation} of ${currentUser.buccDepartment}`);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!relationship.trim() || !content.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetMember: targetMemberId,
          relationship: relationship.trim(),
          content: content.trim(),
        }),
      });

      if (res.ok) {
        toast.success("Recommendation submitted successfully!");
        setOpen(false);
        setContent("");
        router.refresh();
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to submit recommendation");
      }
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger>
        <span className="inline-flex items-center gap-2 px-4 py-2 border border-border text-xs font-bold uppercase tracking-widest hover:bg-muted/40 transition-all rounded-sm text-foreground bg-background">
          <Award className="w-3.5 h-3.5" /> Recommend Member
        </span>
      </DialogTrigger>
      
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Write Recommendation</DialogTitle>
          <DialogDescription>
            Recommend {targetMemberName} based on your experience working with them in the club.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-1.5">
            <Label htmlFor="relationship" className="text-[10px] uppercase font-bold text-muted-foreground">Your Relationship</Label>
            <Input
              id="relationship"
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
              placeholder="e.g. Director of R&D"
              className="bg-transparent border border-border rounded-none px-3"
              disabled={loading}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="content" className="text-[10px] uppercase font-bold text-muted-foreground">Recommendation / Testimonial</Label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={`Write your recommendation for ${targetMemberName} here...`}
              rows={4}
              className="w-full bg-transparent border border-border rounded-none p-3 text-sm focus-visible:outline-none focus:border-primary transition-colors resize-y font-light"
              disabled={loading}
              required
            />
          </div>

          <DialogFooter>
            <Button
              type="submit"
              disabled={loading}
              className="bg-foreground text-background hover:opacity-90 font-medium px-6"
            >
              {loading ? "Submitting..." : "Submit Recommendation"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
