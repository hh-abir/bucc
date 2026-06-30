"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface RefreshButtonProps {
  revalidateAction: () => Promise<void>;
  label: string;
}

export default function RefreshButton({ revalidateAction, label }: RefreshButtonProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await revalidateAction();
      toast.success(`${label} updated successfully`);
    } catch (error) {
      toast.error(`Failed to refresh ${label.toLowerCase()}`);
      console.error(error);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <button
      onClick={handleRefresh}
      disabled={isRefreshing}
      className="p-2 rounded-full hover:bg-muted transition-all duration-200 disabled:opacity-50 group"
      title={`Refresh ${label.toLowerCase()}`}
    >
      <RefreshCw
        className={cn(
          "w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors",
          isRefreshing && "animate-spin text-primary"
        )}
      />
    </button>
  );
}
