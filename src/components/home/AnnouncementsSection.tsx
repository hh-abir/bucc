"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogTrigger 
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Megaphone, ArrowRight, Pin, Clock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import SpinnerComponent from "@/components/SpinnerComponent";

const getAnnouncements = async (limit?: number) => {
  const url = limit ? `/api/announcements?limit=${limit}` : "/api/announcements";
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
};

export default function AnnouncementsSection() {
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isAllOpen, setIsAllOpen] = useState(false);

  const { data: latest, isLoading: isLatestLoading } = useQuery({
    queryKey: ["home-announcements-latest"],
    queryFn: () => getAnnouncements(3),
  });

  const { data: all, isLoading: isAllLoading } = useQuery({
    queryKey: ["home-announcements-all"],
    queryFn: () => getAnnouncements(),
    enabled: isAllOpen,
  });

  if (isLatestLoading) return null; // Keep it clean while loading

  if (!latest || latest.length === 0) return null;

  return (
    <section className="py-24 md:py-32 px-6 border-t border-border bg-background">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-2xl space-y-4">
            <div className="flex items-center gap-3 text-primary">
              <Megaphone className="w-5 h-5" />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Bulletins</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-serif tracking-tight text-foreground">Latest Announcements</h2>
            <p className="text-muted-foreground leading-relaxed font-light">
              Stay informed with official updates, deadlines, and internal notices from the BUCC board.
            </p>
          </div>
          
          <Button 
            variant="outline" 
            className="text-[10px] font-bold uppercase tracking-widest gap-2 border-border h-11 px-8 hover:bg-muted"
            onClick={() => setIsAllOpen(true)}
          >
            See All Notices <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>

        {/* Latest 3 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border border border-border">
          {latest.map((ann: any) => (
            <div 
              key={ann._id} 
              className="bg-background p-8 space-y-6 hover:bg-muted/30 transition-all duration-500 group cursor-pointer"
              onClick={() => {
                setSelectedAnnouncement(ann);
                setIsDetailOpen(true);
              }}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 flex items-center gap-1.5">
                    <Clock className="w-3 h-3" /> {new Date(ann.createdAt).toLocaleDateString()}
                  </span>
                  {ann.isPinned && <Pin className="w-3 h-3 text-primary fill-primary" />}
                </div>
                <h3 className="text-xl font-serif font-medium leading-tight group-hover:text-primary transition-colors line-clamp-2">
                  {ann.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed font-light line-clamp-3">
                  {ann.content}
                </p>
              </div>
              <div className="pt-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-foreground opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1">
                Read Full Notice <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          ))}
        </div>

        {/* Detailed Modal */}
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent className="sm:max-w-xl border-border bg-background">
            {selectedAnnouncement && (
              <div className="space-y-8 py-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-primary">
                    <Megaphone className="w-4 h-4" />
                    <span>Official Notice</span>
                    <span className="h-1 w-1 bg-primary/30 rounded-full" />
                    <span>{new Date(selectedAnnouncement.createdAt).toLocaleDateString()}</span>
                  </div>
                  <DialogTitle className="text-3xl font-serif tracking-tight leading-tight">
                    {selectedAnnouncement.title}
                  </DialogTitle>
                </div>

                <div className="space-y-6 text-foreground leading-relaxed font-light">
                   <p className="whitespace-pre-wrap">{selectedAnnouncement.content}</p>
                </div>

                <div className="pt-8 border-t border-border flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                      <User className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="space-y-0.5 text-left">
                      <p className="text-xs font-bold leading-none">{selectedAnnouncement.author.name}</p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{selectedAnnouncement.author.designation}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* "See All" Large Modal */}
        <Dialog open={isAllOpen} onOpenChange={setIsAllOpen}>
          <DialogContent className="sm:max-w-3xl max-h-[85vh] overflow-hidden flex flex-col border-border bg-background p-0">
            <DialogHeader className="p-8 border-b border-border bg-muted/10 shrink-0">
              <div className="flex items-center gap-3 text-primary mb-2">
                <Megaphone className="w-5 h-5" />
                <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Communications</span>
              </div>
              <DialogTitle className="text-3xl font-serif">All Announcements</DialogTitle>
              <DialogDescription>A complete history of official BUCC communications.</DialogDescription>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto p-8 pt-0">
              {isAllLoading ? (
                <div className="py-20 flex justify-center"><SpinnerComponent /></div>
              ) : (
                <div className="divide-y divide-border">
                  {all?.map((ann: any) => (
                    <div 
                      key={ann._id} 
                      className="py-8 space-y-4 hover:bg-muted/30 -mx-8 px-8 transition-colors cursor-pointer group"
                      onClick={() => {
                        setSelectedAnnouncement(ann);
                        setIsDetailOpen(true);
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">{new Date(ann.createdAt).toLocaleDateString("en-US", { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                        {ann.isPinned && <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5">Pinned</Badge>}
                      </div>
                      <h3 className="text-xl font-serif font-medium group-hover:text-primary transition-colors">{ann.title}</h3>
                      <p className="text-sm text-muted-foreground font-light line-clamp-2">{ann.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
