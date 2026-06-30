import * as React from "react";
import { cn } from "@/lib/utils";

export function Badge({
  className,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { variant?: string }) {
  const variants: Record<string, string> = {
    default: "bg-primary text-primary-foreground",
    secondary: "bg-secondary text-secondary-foreground",
    outline: "border border-border text-foreground",
    
    // Recruitment Statuses
    submitted: "bg-blue-50 text-blue-700 border border-blue-200/50 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/50",
    pending: "bg-amber-50 text-amber-700 border border-amber-200/50 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/50",
    accepted: "bg-emerald-50 text-emerald-700 border border-emerald-200/50 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/50",
    rejected: "bg-rose-50 text-rose-700 border border-rose-200/50 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-800/50",
    
    // Membership Status
    active: "bg-green-50 text-green-700 border border-green-200/50 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800/50",
    inactive: "bg-gray-50 text-gray-700 border border-gray-200/50 dark:bg-gray-800/20 dark:text-gray-400 dark:border-gray-700/50",
    alumni: "bg-blue-50 text-blue-700 border border-blue-200/50 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/50",
    probation: "bg-amber-50 text-amber-700 border border-amber-200/50 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/50",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variants[variant.toLowerCase()] ?? variants.default,
        className
      )}
      {...props}
    />
  );
}
