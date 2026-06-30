"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

const fetchBanner = async () => {
  const res = await fetch("/api/global-banner");
  if (!res.ok) return { isActive: false };
  return res.json();
};

export function AnnouncementBar() {
  const [isDismissed, setIsDismissed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  const { data: banner, isLoading } = useQuery({
    queryKey: ["global-banner"],
    queryFn: fetchBanner,
    enabled: mounted,
  });

  const handleDismiss = () => {
    setIsDismissed(true);
  };

  if (!mounted || isLoading || isDismissed || !banner?.isActive) return null;

  return (
    <div className="relative w-full bg-foreground text-background py-2 px-8 flex items-center justify-center min-h-[40px] z-[60] animate-in fade-in slide-in-from-top duration-500">
      <div className="flex flex-col sm:flex-row items-center gap-x-3 text-center">
        <p className="text-xs sm:text-sm font-medium tracking-tight">
          {banner.message}
        </p>
        {banner.link && (
          <Link 
            href={banner.link} 
            className="text-xs sm:text-sm font-bold underline underline-offset-4 hover:opacity-80 transition-opacity"
          >
            Visit Details
          </Link>
        )}
      </div>

      <button
        onClick={handleDismiss}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-background/10 rounded-full transition-colors group"
        aria-label="Dismiss announcement"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
