"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="relative w-full h-[85vh] overflow-hidden bg-black">
      {/* 1. Background Image - Using standard img tag and positive Z-index */}
      <img
        src="/images/cover.jpeg"
        alt="BUCC Cover"
        className="absolute inset-0 w-full h-full object-cover z-10"
      />

      {/* 2. Simplified Overlay - Dark tint to ensure text contrast */}
      <div className="absolute inset-0 bg-black/40 z-20 pointer-events-none" />

      {/* 3. Content Container - Highest Z-index */}
      <div className="relative z-30 container mx-auto h-full flex items-center justify-center px-6 md:px-12">
        <div className="max-w-3xl text-center space-y-6">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight drop-shadow-2xl">
            BRAC University <br /> Computer Club
          </h1>

          <p className="text-lg md:text-2xl text-gray-200 font-medium drop-shadow-xl">
            Upgrade yourself.
          </p>

          <div className="flex items-center justify-center gap-4 pt-4">
            <Link href="/registration">
              <Button size="lg" className="px-8 font-semibold bg-white text-black hover:bg-gray-200">
                Join Us
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="outline" size="lg" className="px-8 font-semibold border-white text-white hover:bg-white/10">
                About Us
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
