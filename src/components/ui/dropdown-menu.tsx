import * as React from "react";
import { cn } from "@/lib/utils";

export const DropdownMenu = ({ children }: { children: React.ReactNode }) => (
  <div className="relative inline-block">{children}</div>
);

export const DropdownMenuTrigger = ({ children }: { children: React.ReactNode; asChild?: boolean }) => <>{children}</>;

export const DropdownMenuContent = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement> & { align?: string }) => (
  <div className={cn("absolute right-0 z-50 mt-2 min-w-40 rounded-md border border-border bg-card p-1 shadow-sm", className)} {...props} />
);

export const DropdownMenuItem = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("cursor-pointer rounded-sm px-3 py-2 text-sm hover:bg-muted", className)} {...props} />
);
