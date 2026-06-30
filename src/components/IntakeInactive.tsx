"use client";

import React, { useState, useEffect } from "react";
import { Timer, Facebook, ExternalLink } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface IntakeInactiveProps {
  title: string;
  targetDate?: string;
  message?: string;
}

export default function IntakeInactive({ 
  title, 
  targetDate, 
  message = "BUCC Recruitment is not open. Please check our Facebook page for updates." 
}: IntakeInactiveProps) {
  const [timeLeft, setTimeLeft] = useState<{ d: number; h: number; m: number; s: number } | null>(null);

  useEffect(() => {
    if (!targetDate) return;

    const calculateTime = () => {
      const difference = new Date(targetDate).getTime() - new Date().getTime();
      if (difference <= 0) return null;

      return {
        d: Math.floor(difference / (1000 * 60 * 60 * 24)),
        h: Math.floor((difference / (1000 * 60 * 60)) % 24),
        m: Math.floor((difference / 1000 / 60) % 60),
        s: Math.floor((difference / 1000) % 60),
      };
    };

    setTimeLeft(calculateTime());
    const timer = setInterval(() => setTimeLeft(calculateTime()), 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center px-6 py-24 bg-background">
      <div className="max-w-2xl w-full text-center space-y-12">
        <div className="space-y-4">
          <div className="flex justify-center mb-8">
             <div className="p-4 bg-muted/50 rounded-full border border-border/50">
                <Image 
                  src="/assets/bucc-icon.svg" 
                  alt="BUCC Icon" 
                  width={80} 
                  height={80} 
                  className="opacity-90 dark:invert dark:hue-rotate-180"
                />
             </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-serif tracking-tight text-foreground">{title}</h1>
          <p className="text-xl text-muted-foreground font-light leading-relaxed max-w-lg mx-auto">
            {message}
          </p>
        </div>

        {timeLeft && (
          <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">
            <TimeUnit label="Days" value={timeLeft.d} />
            <TimeUnit label="Hours" value={timeLeft.h} />
            <TimeUnit label="Mins" value={timeLeft.m} />
            <TimeUnit label="Secs" value={timeLeft.s} />
          </div>
        )}

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link 
            href="https://www.facebook.com/BRACUCC" 
            target="_blank"
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-foreground hover:text-primary transition-colors border-b border-foreground/20 pb-1"
          >
            <Facebook className="w-3.5 h-3.5" /> Official Facebook
          </Link>
          <Link 
            href="/" 
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors border-b border-border pb-1"
          >
            Return Home <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function TimeUnit({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col items-center p-4 bg-muted/30 border border-border rounded-lg">
      <span className="text-3xl font-serif font-bold text-foreground">{String(value).padStart(2, '0')}</span>
      <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground/60">{label}</span>
    </div>
  );
}
