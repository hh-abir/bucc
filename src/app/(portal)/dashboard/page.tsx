"use client";

import { useSession } from "next-auth/react";
import { DigitalIdCard } from "@/components/DigitalIdCard";
import { isGoverningBody, canManageEvents, canManageMembers } from "@/lib/permissions";
import Link from "next/link";
import SpinnerComponent from "@/components/SpinnerComponent";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { 
  Plus, 
  Megaphone, 
  Calendar, 
  Users, 
  Database, 
  FileText,
  Clock,
  ArrowRight,
  Pin
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const getDashboardData = async () => {
  const [annRes, eventsRes, bannerRes] = await Promise.all([
    fetch("/api/announcements"),
    fetch("/api/events"),
    fetch("/api/global-banner")
  ]);
  
  const announcements = await annRes.json();
  const events = await eventsRes.json();
  const banner = await bannerRes.json();
  
  return { announcements, events, banner };
};

export default function Dashboard() {
  const queryClient = useQueryClient();
  const { data: session, status: sessionStatus } = useSession();
  const [isPostOpen, setIsPostOpen] = useState(false);
  const [newNotice, setNewNotice] = useState({ title: "", content: "" });

  // Banner Management State
  const [bannerForm, setBannerForm] = useState({ message: "", link: "", isActive: true });

  const { data, isLoading } = useQuery({
    queryKey: ["dashboard-hub"],
    queryFn: getDashboardData,
    enabled: sessionStatus === "authenticated",
  });

  const mutation = useMutation({
    mutationFn: async (notice: typeof newNotice) => {
      const res = await fetch("/api/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(notice),
      });
      if (!res.ok) throw new Error("Failed to post");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Announcement posted!");
      queryClient.invalidateQueries({ queryKey: ["dashboard-hub"] });
      setIsPostOpen(false);
      setNewNotice({ title: "", content: "" });
    },
  });

  const bannerMutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await fetch("/api/global-banner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to update banner");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Global banner updated!");
      queryClient.invalidateQueries({ queryKey: ["dashboard-hub"] });
    },
  });

  // Sync banner form when data is loaded
  useState(() => {
    if (data?.banner) {
      setBannerForm({
        message: data.banner.message || "",
        link: data.banner.link || "",
        isActive: data.banner.isActive ?? true
      });
    }
  });

  if (sessionStatus === "loading" || isLoading) return <SpinnerComponent />;

  const user = session?.user as any;
  const isGB = isGoverningBody(user);
  const isEB = ["Director", "Assistant Director", "Senior Executive", "Executive"].includes(user.designation);
  const canPost = isGB || isEB;

  // Filter for truly upcoming events
  const upcomingEvents = (data?.events || [])
    .filter((e: any) => new Date(e.startingDate) >= new Date())
    .sort((a: any, b: any) => new Date(a.startingDate).getTime() - new Date(b.startingDate).getTime())
    .slice(0, 3);

  const displayAnnouncements = (data?.announcements || []).slice(0, 5);

  return (
    <div className="space-y-12 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-8">
        <div className="space-y-1">
          <h1 className="text-4xl font-serif tracking-tight text-foreground">
            Welcome back, {user.name.split(" ")[0]}
          </h1>
          <p className="text-muted-foreground font-light text-lg italic">
            Empowering the next generation of tech leaders.
          </p>
        </div>
        {isGB && (
          <Badge variant="outline" className="px-4 py-1.5 border-primary/20 text-primary font-serif">
            Executive View
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Identity & Admin Quick Links */}
        <div className="lg:col-span-5 space-y-10">
          <section className="space-y-4">
            <h2 className="font-serif text-2xl tracking-tight">Your Identity</h2>
            <DigitalIdCard user={user} />
          </section>

          {(canPost || canManageEvents(user) || canManageMembers(user)) && (
            <section className="space-y-6">
              <h2 className="font-serif text-2xl tracking-tight border-b border-border pb-2">Operations</h2>
              <div className="grid grid-cols-2 gap-4">
                {canManageMembers(user) && (
                  <Link href="/dashboard/members" className="p-4 bg-card border border-border rounded-md hover:border-primary/40 transition-all flex flex-col gap-2 group">
                    <Users className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    <span className="font-serif text-lg leading-tight">Members</span>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground/60">Registry</span>
                  </Link>
                )}
                {canManageEvents(user) && (
                  <Link href="/dashboard/events" className="p-4 bg-card border border-border rounded-md hover:border-primary/40 transition-all flex flex-col gap-2 group">
                    <Calendar className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    <span className="font-serif text-lg leading-tight">Events</span>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground/60">Schedules</span>
                  </Link>
                )}
                {isGB && (
                  <Link href="/dashboard/manage-data" className="p-4 bg-card border border-border rounded-md hover:border-primary/40 transition-all flex flex-col gap-2 group">
                    <Database className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    <span className="font-serif text-lg leading-tight">Data Hub</span>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground/60">Maintenance</span>
                  </Link>
                )}
                <Link href="/dashboard/blogs" className="p-4 bg-card border border-border rounded-md hover:border-primary/40 transition-all flex flex-col gap-2 group">
                  <FileText className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  <span className="font-serif text-lg leading-tight">Editorial</span>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground/60">Publications</span>
                </Link>
              </div>
            </section>
          )}
        </div>

        {/* Announcements & Live Events */}
        <div className="lg:col-span-7 space-y-12">
          {/* Announcements Hub */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Megaphone className="w-5 h-5 text-primary" />
                <h2 className="font-serif text-2xl tracking-tight">Announcements</h2>
              </div>
              
              <div className="flex items-center gap-2">
                <Dialog>
                  <DialogTrigger>
                    <button className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground underline underline-offset-4 decoration-1">
                      View all
                    </button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-3xl max-h-[85vh] overflow-hidden flex flex-col border-border bg-background p-0 text-left">
                    <DialogHeader className="p-8 border-b border-border bg-muted/10 shrink-0">
                      <div className="flex items-center gap-3 text-primary mb-2">
                        <Megaphone className="w-5 h-5" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Communications</span>
                      </div>
                      <DialogTitle className="text-3xl font-serif">Announcement Archive</DialogTitle>
                      <DialogDescription>A complete history of official BUCC communications.</DialogDescription>
                    </DialogHeader>
                    <div className="flex-1 overflow-y-auto p-8 pt-0">
                      <div className="divide-y divide-border">
                        {data?.announcements.map((ann: any) => (
                          <div key={ann._id} className="py-8 space-y-4">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">{new Date(ann.createdAt).toLocaleDateString()}</span>
                              {ann.isPinned && <Badge variant="outline">Pinned</Badge>}
                            </div>
                            <h3 className="text-xl font-serif font-medium">{ann.title}</h3>
                            <p className="text-sm text-muted-foreground font-light whitespace-pre-wrap">{ann.content}</p>
                            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40 pt-2 border-t border-border/50">
                              <span>Published by {ann.author.name} ({ann.author.designation})</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <div className="space-y-4">
              {displayAnnouncements.length > 0 ? (
                displayAnnouncements.map((ann: any) => (
                  <div key={ann._id} className="p-6 rounded-md border border-border bg-card shadow-none hover:border-primary/20 transition-all group">
                    <div className="flex justify-between items-start mb-2">
                      <div className="space-y-1">
                        <h3 className="font-serif text-lg font-medium leading-snug group-hover:text-primary transition-colors">{ann.title}</h3>
                        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                          {ann.isPinned && <Pin className="w-2.5 h-2.5 text-primary fill-primary" />}
                          <span>{ann.author.name}</span>
                          <span className="h-1 w-1 bg-border rounded-full" />
                          <span>{new Date(ann.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed font-light line-clamp-2">{ann.content}</p>
                  </div>
                ))
              ) : (
                <div className="p-12 border border-dashed border-border rounded-md text-center">
                  <p className="text-sm text-muted-foreground italic font-serif">No official announcements currently active.</p>
                </div>
              )}
            </div>
          </section>

          {/* Upcoming Events (Live) */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-primary" />
                <h2 className="font-serif text-2xl tracking-tight">Coming Up Next</h2>
              </div>
              <Link href="/events" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground underline underline-offset-4 decoration-1">
                View Calendar
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map((event: any) => (
                  <div key={event._id} className="flex gap-6 p-4 rounded-md border border-border bg-card group hover:shadow-sm transition-all">
                    <div className="h-20 w-20 flex-shrink-0 bg-muted rounded-sm overflow-hidden relative border border-border">
                      {event.featuredImage ? (
                        <img src={event.featuredImage} alt={event.title} className="object-cover w-full h-full grayscale group-hover:grayscale-0 transition-all duration-500" />
                      ) : (
                        <Calendar className="absolute inset-0 m-auto w-6 h-6 text-muted-foreground/20" />
                      )}
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="space-y-0.5">
                        <h3 className="font-serif text-md font-medium group-hover:text-primary transition-colors">{event.title}</h3>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {new Date(event.startingDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {event.venue}
                        </p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 bg-muted rounded-full">{new Date(event.startingDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                        <Link href={`/events/${event._id}`} className="text-[10px] font-bold uppercase tracking-widest text-foreground flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                          Details <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 border border-dashed border-border rounded-md text-center space-y-2">
                  <p className="text-lg font-serif text-muted-foreground">The schedule is clear.</p>
                  <p className="text-xs text-muted-foreground/60 italic font-light tracking-wide uppercase">No upcoming events this week</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
