"use client";
 
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
 
export default function Preloader() {
  const [show, setShow] = useState(true);
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [progress, setProgress] = useState(1);
 
  const word1 = "UPGRADE";
  const word2 = "YOURSELF.";
 
  useEffect(() => {
    // Check if the site has already preloaded in this browser session
    const hasPreloaded = sessionStorage.getItem("bucc-portal-preloaded");
    if (hasPreloaded) {
      setShow(false);
      return;
    }
 
    // Otherwise, lock scrolling and run the cinematic loading sequence
    document.body.style.overflow = "hidden";
 
    let i = 0;
    let j = 0;
 
    // Typewriter sequence
    const typingInterval = setInterval(() => {
      if (i < word1.length) {
        setLine1(word1.substring(0, i + 1));
        i++;
      } else if (j < word2.length) {
        setLine2(word2.substring(0, j + 1));
        j++;
      } else {
        clearInterval(typingInterval);
      }
    }, 75);
 
    // Smooth 1% to 100% progress counter
    let startVal = 1;
    const progressDuration = 2400;
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
 
    // Mark as preloaded, unlock scroll, and slide overlay up
    const timeout = setTimeout(() => {
      setShow(false);
      sessionStorage.setItem("bucc-portal-preloaded", "true");
      document.body.style.overflow = "";
    }, 3200);
 
    return () => {
      clearInterval(typingInterval);
      clearInterval(progressInterval);
      clearTimeout(timeout);
      document.body.style.overflow = "";
    };
  }, []);
 
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 0 }}
          exit={{ 
            y: "-100%",
            transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] } 
          }}
          className="fixed inset-0 z-[9999] bg-[#0c0d0e] flex flex-col items-center justify-center text-white"
        >
          {/* Horizontal Logo */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              transition: { duration: 0.7, ease: "easeOut" }
            }}
            exit={{ 
              opacity: 0, 
              scale: 0.95,
              transition: { duration: 0.3 }
            }}
            className="relative h-16 w-48 md:h-20 md:w-60 mb-6 select-none"
          >
            <Image
              src="/assets/bucc-logo.svg"
              alt="BUCC Logo"
              fill
              priority
              className="object-contain invert hue-rotate-180"
            />
          </motion.div>
 
          {/* Bold, Italic Typewriter Mottos */}
          <div className="flex flex-col items-center justify-center text-center select-none space-y-2.5 mt-2">
            <h1 className="font-serif text-3xl md:text-4xl font-black italic tracking-[0.2em] text-white flex items-center justify-center leading-none">
              {line1}
              {line1.length < word1.length && (
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ repeat: Infinity, duration: 0.8 }}
                  className="w-1.5 h-7 bg-primary ml-1"
                />
              )}
            </h1>
            
            <h1 className="font-serif text-3xl md:text-4xl font-black italic tracking-[0.2em] text-primary flex items-center justify-center leading-none">
              {line2}
              {line1.length === word1.length && line2.length < word2.length && (
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ repeat: Infinity, duration: 0.8 }}
                  className="w-1.5 h-7 bg-primary ml-1"
                />
              )}
            </h1>
          </div>
 
          {/* Iconic Loading Progress Indicators */}
          <div className="flex flex-col items-center justify-center mt-10 space-y-3">
            <div className="w-40 md:w-48 h-[1px] bg-zinc-800 rounded-full overflow-hidden relative">
              <div 
                className="bg-primary h-full rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="font-mono text-[9px] md:text-[10px] tracking-[0.3em] text-zinc-500 select-none animate-pulse">
              LOADING / {String(progress).padStart(3, "0")}%
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
