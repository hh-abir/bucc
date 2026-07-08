"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const DEFAULT_HERO_SLIDES = [
  {
    id: 1,
    title: "Pioneering Tech Since 2001.",
    subtitle: "Join the oldest and most prestigious tech community at BRAC University.",
    image: "/images/hero-slide-1.jpg",
    link: "/registration",
    cta: "Become a Member",
  },
  {
    id: 2,
    title: "Innovate. Build. Lead.",
    subtitle: "From software development to robotics, turn your ideas into reality.",
    image: "/images/hero-slide-2.jpg",
    link: "#departments-section",
    cta: "Explore Departments",
  },
  {
    id: 3,
    title: "Connecting Industry & Academia.",
    subtitle: "Exclusive workshops, seminars, and networking events with tech leaders.",
    image: "/images/hero-slide-3.jpg",
    link: "/events",
    cta: "View Events Calendar",
  }
];

export default function HeroCarousel() {
  const [slides, setSlides] = useState<any[]>(DEFAULT_HERO_SLIDES);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch("/api/config?key=hero_carousel_config");
        if (res.ok) {
          const data = await res.json();
          if (data.value && Array.isArray(data.value) && data.value.length > 0) {
            setSlides(data.value);
          }
        }
      } catch (err) {
        console.error("Failed to fetch hero config:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchConfig();
  }, []);

  useEffect(() => {
    if (isHovered || slides.length <= 1) return;
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 7000);

    return () => clearInterval(timer);
  }, [isHovered, slides.length]);

  if (isLoading) {
    return <div className="h-screen w-full bg-background animate-pulse" />;
  }

  return (
    <div 
      className="relative h-screen w-full bg-background overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={slides[currentSlide].id || currentSlide}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0"
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src={slides[currentSlide].image}
              alt={slides[currentSlide].title}
              fill
              sizes="100vw"
              priority
              className="object-cover"
            />
          </div>
          
          {/* Cinematic Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          <div className="absolute inset-0 bg-black/30" />

          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-center px-6 pt-20 max-w-6xl mx-auto">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
              className="space-y-6 max-w-3xl"
            >
              <h1 className="text-5xl md:text-7xl lg:text-7xl font-serif text-white tracking-tight leading-[1.1]">
                {slides[currentSlide].title}
              </h1>
              <p className="text-lg md:text-2xl text-white/80 font-light leading-relaxed max-w-2xl">
                {slides[currentSlide].subtitle}
              </p>
              <div className="pt-4">
                {slides[currentSlide].link.startsWith("#") ? (
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      const el = document.getElementById(slides[currentSlide].link.substring(1));
                      if (el) {
                        el.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                    className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black font-medium transition-all hover:bg-white/90 group"
                  >
                    {slides[currentSlide].cta}
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                ) : (
                  <Link 
                    href={slides[currentSlide].link}
                    className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black font-medium transition-all hover:bg-white/90 group"
                  >
                    {slides[currentSlide].cta}
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Progress Indicators */}
      <div className="absolute bottom-12 left-6 right-6 max-w-6xl mx-auto flex items-center gap-4 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className="group py-4 flex-1 max-w-[120px]"
            aria-label={`Go to slide ${index + 1}`}
          >
            <div className="relative h-px w-full bg-white/20 overflow-hidden">
              <motion.div
                className="absolute inset-y-0 left-0 bg-white"
                initial={{ width: "0%" }}
                animate={{ width: currentSlide === index ? "100%" : currentSlide > index ? "100%" : "0%" }}
                transition={{ 
                  duration: currentSlide === index ? 7 : 0.3, 
                  ease: currentSlide === index ? "linear" : "easeOut" 
                }}
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
