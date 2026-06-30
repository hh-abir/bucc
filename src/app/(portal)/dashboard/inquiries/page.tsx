"use client";

import { useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import { useSession } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { 
  Mail, 
  User, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Trash2, 
  ExternalLink,
  MessageSquare,
  Search,
  Filter,
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { canManageInquiries } from "@/lib/permissions";

const fetchInquiries = async () => {
  const res = await fetch("/api/inquiries");
  if (!res.ok) throw new Error("Failed to fetch inquiries");
  return res.json();
};

export default function InquiriesPage() {
  const queryClient = useQueryClient();
  const { data: session, status: sessionStatus } = useSession();
  const [filter, setFilter] = useState<"all" | "unread" | "read" | "archived">("all");
  const [searchTerm, setSearchTerm] = useState("");

  const { data: inquiries, isLoading } = useQuery({
    queryKey: ["inquiries"],
    queryFn: fetchInquiries,
    enabled: sessionStatus === "authenticated",
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await fetch("/api/inquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) throw new Error("Update failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inquiries"] });
      toast.success("Inquiry status updated.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/inquiries?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inquiries"] });
      toast.success("Inquiry deleted.");
    },
  });

  if (sessionStatus === "loading" || isLoading) return <SpinnerComponent />;

  const user = session?.user as any;
  if (!user || !canManageInquiries(user)) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-2">
        <h2 className="text-2xl font-serif font-medium">Access Denied</h2>
        <p className="text-muted-foreground">You do not have permission to view inquiries.</p>
      </div>
    );
  }

  const isGB = ["President", "Vice President", "General Secretary", "Treasurer"].includes(user.designation);

  const filteredInquiries = inquiries?.filter((inq: any) => {
    const matchesFilter = filter === "all" || inq.status === filter;
    const matchesSearch = 
      inq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inq.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inq.subject.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-10 pb-20">
      <Heading 
        headingText="Member Inquiries" 
        subHeadingText="Manage and respond to messages from the public contact form." 
      />

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="flex bg-muted p-1 rounded-md">
          {["all", "unread", "read", "archived"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={cn(
                "px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-sm transition-all",
                filter === f ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search inquiries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
      </div>

      {/* Inquiries List */}
      <div className="space-y-6">
        {filteredInquiries?.length > 0 ? (
          filteredInquiries.map((inq: any) => (
            <Card key={inq._id} className={cn(
              "border-border shadow-none transition-all group overflow-hidden",
              inq.status === "unread" ? "border-l-4 border-l-primary bg-primary/5" : "bg-card"
            )}>
              <CardContent className="p-0">
                <div className="p-6 md:p-8 space-y-6">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-serif text-xl font-medium">{inq.subject}</h3>
                        <Badge variant={inq.status === "unread" ? "default" : "outline"} className="text-[10px] uppercase font-bold tracking-widest">
                          {inq.status}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-muted-foreground font-light">
                        <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> {inq.name}</span>
                        <span className="flex items-center gap-1.5 text-primary hover:underline cursor-pointer"><Mail className="w-3.5 h-3.5" /> {inq.email}</span>
                        <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true }).format(new Date(inq.createdAt))}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {inq.status !== "read" && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-9 gap-2 text-[10px] font-bold uppercase tracking-widest"
                          onClick={() => updateStatusMutation.mutate({ id: inq._id, status: "read" })}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Mark Read
                        </Button>
                      )}
                      {inq.status === "read" && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-9 gap-2 text-[10px] font-bold uppercase tracking-widest"
                          onClick={() => updateStatusMutation.mutate({ id: inq._id, status: "archived" })}
                        >
                          <Clock className="w-3.5 h-3.5" /> Archive
                        </Button>
                      )}
                      {isGB && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-9 w-9 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/5"
                          onClick={() => {
                            if (confirm("Are you sure you want to delete this inquiry?")) {
                              deleteMutation.mutate(inq._id);
                            }
                          }}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="p-6 bg-muted/30 rounded-md border border-border/50">
                    <p className="text-sm text-foreground/80 leading-relaxed font-light whitespace-pre-wrap italic">
                      "{inq.message}"
                    </p>
                  </div>

                  <div className="flex justify-end pt-2">
                    <a href={`mailto:${inq.email}?subject=Re: ${inq.subject}`}>
                      <Button className="gap-2 bg-foreground text-background text-[10px] font-bold uppercase tracking-widest h-10 px-6 group">
                        Reply via Email <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="py-32 text-center border-2 border-dashed border-border rounded-lg bg-muted/10">
            <div className="space-y-4 max-w-xs mx-auto">
              <div className="p-4 bg-muted rounded-full w-fit mx-auto">
                <MessageSquare className="w-8 h-8 text-muted-foreground/40" />
              </div>
              <div className="space-y-1">
                <p className="font-serif text-lg text-muted-foreground">No inquiries found</p>
                <p className="text-xs text-muted-foreground/60">Adjust your filters or wait for new messages from members.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
