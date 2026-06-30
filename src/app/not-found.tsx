"use client";

import Link from "next/link";
import { MoveLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-140px)] px-6 py-24 text-center space-y-8 bg-background">
      <div className="space-y-4">
        <h1 className="text-8xl md:text-9xl font-serif font-bold text-muted-foreground/20">404</h1>
        <div className="space-y-2 relative -mt-12 md:-mt-16">
          <h2 className="text-3xl md:text-5xl font-serif tracking-tight">Page Not Found.</h2>
          <p className="text-muted-foreground font-light max-w-sm mx-auto leading-relaxed">
            The resource you are looking for has been moved, removed, or never existed in the first place.
          </p>
        </div>
      </div>
      
      <Link 
        href="/" 
        className="inline-flex items-center gap-2 px-8 py-3 bg-foreground text-background font-medium rounded-md hover:opacity-90 transition-opacity"
      >
        <MoveLeft className="w-4 h-4" /> Return to Home
      </Link>
    </div>
  );
}
