"use client";
 
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
 
export default function Preloader() {
  const [show, setShow] = useState(true);
  const [progress, setProgress] = useState(1);
 
  useEffect(() => {
    // Check if the site has already preloaded in this browser session
    const hasPreloaded = sessionStorage.getItem("bucc-portal-preloaded");
    if (hasPreloaded) {
      setShow(false);
      return;
    }
 
    // Lock scrolling during loading sequence
    document.body.style.overflow = "hidden";
 
    // Smooth 1% to 100% progress counter
    let startVal = 1;
    const progressDuration = 2000;
    const stepInterval = 20;
    const totalSteps = progressDuration / stepInterval;
    const incrementPerStep = 99 / totalSteps;
 
    const progressInterval = setInterval(() => {
      startVal += incrementPerStep;
      if (startVal >= 100) {
        setProgress(100);
        clearInterval(progressInterval);
      } else {
        setProgress(Math.floor(startVal));
      }
    }, stepInterval);
 
    // Mark as preloaded and unlock scrolling on end
    const timeout = setTimeout(() => {
      setShow(false);
      sessionStorage.setItem("bucc-portal-preloaded", "true");
      document.body.style.overflow = "";
    }, 2600);
 
    return () => {
      clearInterval(progressInterval);
      clearTimeout(timeout);
      document.body.style.overflow = "";
    };
  }, []);
 
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            transition: { duration: 0.8, ease: "easeInOut" } 
          }}
          className="fixed inset-0 z-[9999] bg-[#090a0b] flex flex-col items-center justify-center text-white"
        >
          {/* Centered Logo & Motto */}
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            {/* Logo with pulsing shadow highlighting */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                filter: [
                  "drop-shadow(0 0 2px rgba(59, 130, 246, 0.15)) brightness(0.7)",
                  "drop-shadow(0 0 20px rgba(59, 130, 246, 0.45)) brightness(1.15)",
                  "drop-shadow(0 0 2px rgba(59, 130, 246, 0.15)) brightness(0.7)"
                ]
              }}
              transition={{
                opacity: { duration: 0.8, ease: "easeOut" },
                scale: { duration: 0.8, ease: "easeOut" },
                filter: { duration: 3.5, repeat: Infinity, ease: "easeInOut" }
              }}
              className="relative h-20 w-52 md:h-24 md:w-64 select-none mb-2"
            >
              <Image
                src="/assets/bucc-logo.svg"
                alt="BUCC Logo"
                fill
                priority
                className="object-contain invert hue-rotate-180"
              />
            </motion.div>
 
            {/* Welcome Motto with slow breathing neon highlighting */}
            <motion.h1
              initial={{ opacity: 0, y: 8 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                color: ["#52525b", "#f4f4f5", "#52525b"],
                textShadow: [
                  "0 0 2px rgba(59, 130, 246, 0)",
                  "0 0 16px rgba(59, 130, 246, 0.35)",
                  "0 0 2px rgba(59, 130, 246, 0)"
                ]
              }}
              transition={{
                opacity: { duration: 0.8, delay: 0.15, ease: "easeOut" },
                y: { duration: 0.8, delay: 0.15, ease: "easeOut" },
                color: { duration: 3.5, repeat: Infinity, ease: "easeInOut" },
                textShadow: { duration: 3.5, repeat: Infinity, ease: "easeInOut" }
              }}
              className="font-sans text-lg md:text-xl font-light tracking-[0.4em] uppercase text-zinc-500 pl-[0.4em] select-none"
            >
              Upgrade Yourself
            </motion.h1>
          </div>
 
          {/* Bottom Right Progress Number */}
          <div className="absolute bottom-10 right-10 md:bottom-16 md:right-16 select-none font-mono flex flex-col items-end animate-in fade-in duration-500">
            <span className="text-[9px] uppercase tracking-[0.3em] text-zinc-600 mb-1">System Load</span>
            <span className="text-5xl md:text-7xl font-extralight tracking-tighter text-zinc-400">
              {progress}<span className="text-xl md:text-2xl text-zinc-600 font-extralight ml-1">%</span>
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
