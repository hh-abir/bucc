"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

const SelectContext = React.createContext<{
  value?: string;
  onValueChange?: (value: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
} | null>(null);

export function Select({
  value,
  defaultValue,
  onValueChange,
  children,
}: {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Close when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <SelectContext.Provider value={{ value: value ?? defaultValue, onValueChange, open, setOpen }}>
      <div className="relative w-full" ref={containerRef}>
        {children}
      </div>
    </SelectContext.Provider>
  );
}

export const SelectTrigger = ({ className, children }: React.HTMLAttributes<HTMLDivElement>) => {
  const context = React.useContext(SelectContext);
  
  return (
    <div 
      className={cn(
        "flex min-h-10 w-full cursor-pointer items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50", 
        className
      )}
      onClick={() => context?.setOpen(!context?.open)}
    >
      {children}
      <ChevronDown className={cn("h-4 w-4 opacity-50 transition-transform", context?.open && "rotate-180")} />
    </div>
  );
};

export const SelectValue = ({ placeholder }: { placeholder?: string }) => {
  const context = React.useContext(SelectContext);

  return <span className={cn(!context?.value && "text-muted-foreground")}>{context?.value || placeholder || "Select..."}</span>;
};

export const SelectContent = ({ className, children }: React.HTMLAttributes<HTMLDivElement>) => {
  const context = React.useContext(SelectContext);

  if (!context?.open) return null;

  return (
    <div className={cn(
      "absolute z-50 mt-1 max-h-56 w-full overflow-auto rounded-md border border-border bg-card p-1 shadow-md animate-in fade-in zoom-in-95 duration-100", 
      className
    )}>
      {children}
    </div>
  );
};

export function SelectItem({ value, children }: { value: string; children: React.ReactNode }) {
  const context = React.useContext(SelectContext);

  return (
    <button
      type="button"
      className={cn(
        "block w-full cursor-pointer rounded-sm px-3 py-2 text-left text-sm transition-colors hover:bg-muted",
        context?.value === value && "bg-muted font-medium"
      )}
      onClick={() => {
        context?.onValueChange?.(value);
        context?.setOpen(false);
      }}
    >
      {children}
    </button>
  );
}
