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
          initial={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
          exit={{ 
            opacity: 0,
            filter: "blur(20px)",
            scale: 1.03,
            transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] } 
          }}
          className="fixed inset-0 z-[9999] bg-[#090a0b] flex flex-col items-center justify-center text-white"
        >
          {/* Custom style sheet for light sheen sweeps */}
          <style>{`
            @keyframes sheen-sweep {
              0% {
                left: 180%;
              }
              60% {
                left: -120%;
              }
              100% {
                left: -120%;
              }
            }
            @keyframes text-shimmer {
              0% {
                background-position: 200% 0;
              }
              60% {
                background-position: -200% 0;
              }
              100% {
                background-position: -200% 0;
              }
            }
            .animate-sheen-sweep {
              position: absolute;
              top: 0;
              bottom: 0;
              width: 45%;
              background: linear-gradient(
                90deg,
                rgba(255, 255, 255, 0) 0%,
                rgba(255, 255, 255, 0.45) 50%,
                rgba(255, 255, 255, 0) 100%
              );
              transform: skewX(-25deg);
              animation: sheen-sweep 3.2s infinite ease-in-out;
            }
            .animate-text-shimmer {
              background: linear-gradient(
                90deg,
                #4b5563 0%,
                #4b5563 35%,
                #ffffff 50%,
                #4b5563 65%,
                #4b5563 100%
              );
              background-size: 200% auto;
              color: transparent;
              -webkit-background-clip: text;
              background-clip: text;
              animation: text-shimmer 3.2s infinite ease-in-out;
            }
          `}</style>
 
          {/* Centered Logo & Motto */}
          <motion.div 
            exit={{ 
              opacity: 0, 
              scale: 0.96, 
              filter: "blur(8px)",
              transition: { duration: 0.5, ease: "easeIn" } 
            }}
            className="flex flex-col items-center justify-center text-center space-y-4"
          >
            {/* Logo container with SVG Mask */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative h-20 w-52 md:h-24 md:w-64 select-none mb-2 overflow-hidden"
              style={{
                maskImage: 'url("/assets/bucc-logo.svg")',
                WebkitMaskImage: 'url("/assets/bucc-logo.svg")',
                maskSize: 'contain',
                WebkitMaskSize: 'contain',
                maskRepeat: 'no-repeat',
                WebkitMaskRepeat: 'no-repeat',
                maskPosition: 'center',
                WebkitMaskPosition: 'center'
              }}
            >
              <Image
                src="/assets/bucc-logo.svg"
                alt="BUCC Logo"
                fill
                priority
                className="object-contain invert hue-rotate-180"
              />
              {/* Sweeping Light Sheen */}
              <div className="animate-sheen-sweep pointer-events-none" />
            </motion.div>
 
            {/* Welcome Motto with text shimmer sweep */}
            <motion.h1
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
              className="font-sans text-lg md:text-xl font-light tracking-[0.4em] uppercase pl-[0.4em] select-none animate-text-shimmer"
            >
              Upgrade Yourself
            </motion.h1>
          </motion.div>
 
          {/* Bottom Right Progress Number */}
          <motion.div 
            exit={{ 
              opacity: 0, 
              x: 15,
              transition: { duration: 0.45, ease: "easeIn" } 
            }}
            className="absolute bottom-10 right-10 md:bottom-16 md:right-16 select-none font-mono flex flex-col items-end animate-in fade-in duration-500"
          >
            <span className="text-[9px] uppercase tracking-[0.3em] text-zinc-600 mb-1">System Load</span>
            <span className="text-5xl md:text-7xl font-extralight tracking-tighter text-zinc-400">
              {progress}<span className="text-xl md:text-2xl text-zinc-600 font-extralight ml-1">%</span>
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
