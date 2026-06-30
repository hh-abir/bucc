import React from "react";
import Image from "next/image";
import { User as UserIcon } from "lucide-react";

interface UserProps {
  name: string;
  email: string;
  studentId?: string;
  buccDepartment?: string;
  designation?: string;
  memberStatus?: string;
  image?: string;
}

export function DigitalIdCard({ user }: { user: UserProps }) {
  return (
    <div className="border border-border p-8 rounded-lg bg-card shadow-sm w-full relative overflow-hidden">
      {/* Decorative Background Element */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full pointer-events-none" />

      <div className="flex flex-col justify-between items-start border-b border-border pb-6 mb-6 relative z-10 gap-6">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
          <div className="h-20 w-20 rounded-full border-2 border-border overflow-hidden bg-muted flex-shrink-0 relative">
            {user.image ? (
              <Image 
                src={user.image} 
                alt={user.name} 
                fill 
                sizes="80px"
                className="object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center">
                <UserIcon className="w-8 h-8 text-muted-foreground/30" />
              </div>
            )}
          </div>
          <div>
            <h2 className="font-serif text-3xl font-bold text-foreground tracking-tight">{user.name}</h2>
            <p className="text-muted-foreground text-lg mt-1">{user.designation || "General Member"}</p>
          </div>
        </div>
        <div className="text-left shrink-0 bg-background/80 p-3 rounded-md border border-border w-full md:w-auto">
          <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium">Student ID</p>
          <p className="font-mono text-lg font-bold text-foreground mt-0.5">{user.studentId || "N/A"}</p>
        </div>
      </div>
      
      <div className="flex flex-col gap-6 text-sm relative z-10">
        <div className="space-y-1">
          <span className="text-muted-foreground block text-xs uppercase tracking-wider font-medium">Email Address</span>
          <span className="font-medium text-foreground block">{user.email}</span>
        </div>
        <div className="space-y-1">
          <span className="text-muted-foreground block text-xs uppercase tracking-wider font-medium">Department</span>
          <span className="font-medium text-foreground block">{user.buccDepartment || "Unassigned"}</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="space-y-1">
            <span className="text-muted-foreground block text-xs uppercase tracking-wider font-medium">Status</span>
            <span className="inline-flex items-center gap-2 font-medium text-foreground">
              <span className={`w-2.5 h-2.5 rounded-full ${user.memberStatus?.toLowerCase() === 'active' ? 'bg-green-500' : 'bg-destructive'}`}></span>
              {user.memberStatus || "Active"}
            </span>
          </div>
          <div className="space-y-1">
            <span className="text-muted-foreground block text-xs uppercase tracking-wider font-medium">Club ID</span>
            <span className="font-medium text-foreground block font-mono">BUCC-{new Date().getFullYear()}-{user.studentId?.slice(-4) || "0000"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
