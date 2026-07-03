"use client";
 
import React, { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Users, Briefcase, Calendar, Rocket, Code, Lightbulb, Network, Award, ChevronLeft, ChevronRight, HelpCircle, MapPin, RotateCw, Layers, BookOpen, Terminal, Mic, Camera, Trophy, Handshake } from "lucide-react";
import { advisorsData, coAdvisorsData } from "@/constants/advisors";
import { allExecutiveBodies } from "@/constants/all-executive-body";
import { departmentsInfo } from "@/constants/departments";
import { motion, useInView, animate, AnimatePresence } from "framer-motion";
import ScrollingTicker from "@/components/ui/ScrollingTicker";
import HeroCarousel from "@/components/home/HeroCarousel";
import AnnouncementsSection from "@/components/home/AnnouncementsSection";
import { toast } from "sonner";
import dynamic from "next/dynamic";

const SplineModel = dynamic(() => import("@/components/home/SplineModel"), {
  ssr: false,
  loading: () => <SplineLoader />
});

function SplineLoader() {
  return (
    <div className="w-full h-full min-h-[450px] flex flex-col items-center justify-center relative overflow-hidden bg-card/10 rounded-2xl border border-border/40 backdrop-blur-sm">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-primary/20 rounded-full blur-[60px] animate-pulse" />
      <div className="relative z-10 flex flex-col items-center gap-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
          <div className="absolute inset-0 rounded-full border-t-2 border-primary animate-spin" />
        </div>
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground animate-pulse">
          Initializing 3D Space...
        </p>
      </div>
    </div>
  );
}
const wingsData = [
  {
    title: "Research Wing",
    description: "For future researchers and those aiming to study abroad. We organize weekly sessions with research-focused lecturers and professors.",
    highlight: "Erasmus Mundus & Japan Info Sessions",
    icon: BookOpen,
    color: "text-blue-400 border-blue-500/25 bg-blue-500/10",
  },
  {
    title: "Analytical Programming Corner",
    description: "For aspiring software engineers. Guided by BRACU Crows and renowned professors like Dr. Muhammad Kaykobad, sharpens coding and problem-solving.",
    highlight: "Bit Battles (Promoted by Phitron)",
    icon: Terminal,
    color: "text-emerald-400 border-emerald-500/25 bg-emerald-500/10",
  },
  {
    title: "Anchoring Wing",
    description: "Boost your confidence and master the art of public speaking. Perfect for anyone who wants to shine in front of an audience.",
    highlight: "Confidence & Presentation Mastery",
    icon: Mic,
    color: "text-purple-400 border-purple-500/25 bg-purple-500/10",
  },
  {
    title: "Photography Wing",
    description: "Capture stories through your lens! Learn professional photography techniques, creative composition, and editing.",
    highlight: "Storytelling & Digital Editing Techniques",
    icon: Camera,
    color: "text-amber-400 border-amber-500/25 bg-amber-500/10",
  },
  {
    title: "Sports Wing",
    description: "For our energetic members! Active male & female teams. Valkyrie League Runners-up & Rising Star '25 Female Basketball Champion!",
    highlight: "Valkyrie League Runners-up • Rising Star Champion",
    icon: Trophy,
    color: "text-red-400 border-red-500/25 bg-red-500/10",
  },
  {
    title: "Motion Graphics Wing",
    description: "A space for creative minds to explore design, animation, and storytelling. We train you, teach you tools, and upgrade your creative game.",
    highlight: "Design, Animation, & Storytelling",
    icon: Layers,
    color: "text-violet-400 border-violet-500/25 bg-violet-500/10",
  },
  {
    title: "Corporate Alliance Wing",
    description: "Bridge connection with corporate entities and secure external sponsorships while maintaining strict professionalism and confidentiality.",
    highlight: "Professional Sponsorships & Corporate Deals",
    icon: Handshake,
    color: "text-cyan-400 border-cyan-500/25 bg-cyan-500/10",
  }
];
 
function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [displayValue, setDisplayValue] = React.useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
 
  useEffect(() => {
    if (inView) {
      const controls = animate(0, value, {
        duration: 2,
        ease: "easeOut",
        onUpdate: (latest) => setDisplayValue(Math.round(latest)),
      });
      return () => controls.stop();
    }
  }, [inView, value]);
 
  return <span ref={ref}>{displayValue}{suffix}</span>;
}
 
export default function HomePage({ initialEvents = [], initialProjects = [] }: { initialEvents?: any[]; initialProjects?: any[] }) {
  const [activeTab, setActiveTab] = React.useState("all");
  const [isMobile, setIsMobile] = React.useState(false);
  const [isDeptsExpanded, setIsDeptsExpanded] = React.useState(false);

  const [currentWingIndex, setCurrentWingIndex] = React.useState(0);
  const [isCarouselHovered, setIsCarouselHovered] = React.useState(false);

  // Spline 3D Model Caching/Load Fallback State
  // We initialize useThreeColumnFallback to true so the site immediately displays
  // the original static 3-column layout, avoiding blank loaders or layout shifting.
  const [isWebGLSupported, setIsWebGLSupported] = React.useState(true);
  const [isSplineLoaded, setIsSplineLoaded] = React.useState(false);
  const [useThreeColumnFallback, setUseThreeColumnFallback] = React.useState(true);
  const [scrollY, setScrollY] = React.useState(0);

  React.useEffect(() => {
    // Passive scroll listener to freeze WebGL when out of view
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  React.useEffect(() => {
    // Verify WebGL capability in user's browser. If mobile or low-end browser, disable Spline and keep static columns.
    try {
      if (typeof window !== "undefined") {
        const isMobileOrTablet = window.innerWidth < 1024;
        if (isMobileOrTablet) {
          setIsWebGLSupported(false);
          setUseThreeColumnFallback(true);
          return;
        }
      }

      const canvas = document.createElement("canvas");
      const support = !!(
        window.WebGLRenderingContext &&
        (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
      );
      if (!support) {
        setIsWebGLSupported(false);
        setUseThreeColumnFallback(true);
      }
    } catch (e) {
      setIsWebGLSupported(false);
      setUseThreeColumnFallback(true);
    }
  }, []);

  React.useEffect(() => {
    if (!isWebGLSupported) return;

    // Safety Timeout: If assets from prod.spline.design fail to load within 10s 
    // (due to slow network or strict adblockers), maintain the static fallback layout.
    const timer = setTimeout(() => {
      if (!isSplineLoaded) {
        console.warn("Spline loading timed out, reverting to 3-column fallback layout.");
        setUseThreeColumnFallback(true);
      }
    }, 10000); // 10 seconds timeout

    return () => clearTimeout(timer);
  }, [isWebGLSupported, isSplineLoaded]);

  useEffect(() => {
    if (isCarouselHovered) return;
    const interval = setInterval(() => {
      setCurrentWingIndex((prevIndex) => (prevIndex + 1) % wingsData.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isCarouselHovered]);

  const handleDotClick = (idx: number) => {
    setCurrentWingIndex(idx);
  };

  const handlePrevClick = () => {
    setCurrentWingIndex((prevIndex) => (prevIndex - 1 + wingsData.length) % wingsData.length);
  };

  const handleNextClick = () => {
    setCurrentWingIndex((prevIndex) => (prevIndex + 1) % wingsData.length);
  };

  const [inquiryData, setInquiryData] = React.useState({
    name: "",
    email: "",
    message: ""
  });
  const [isSubmittingInquiry, setIsSubmittingInquiry] = React.useState(false);
  const [openFaqIndex, setOpenFaqIndex] = React.useState<number | null>(null);

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingInquiry(true);
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: inquiryData.name,
          email: inquiryData.email,
          subject: "Quick Inquiry from Homepage FAQ",
          message: inquiryData.message
        }),
      });
      if (!res.ok) throw new Error("Failed to send message");
      toast.success("Message sent successfully! We'll get back to you soon.");
      setInquiryData({ name: "", email: "", message: "" });
    } catch (error) {
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setIsSubmittingInquiry(false);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Ensure Event Management, Human Resources, Research and Development are first
  const orderedDepts = [...departmentsInfo].sort((a: any, b: any) => {
    const priority = ["Event Management", "Human Resources", "Research and Development"];
    const aIndex = priority.indexOf(a.name);
    const bIndex = priority.indexOf(b.name);
    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;
    return 0;
  });

  const displayedDepts = (isMobile && !isDeptsExpanded) ? orderedDepts.slice(0, 3) : orderedDepts;

  const filteredEvents = initialEvents.filter((event: any) => {
    if (activeTab === "all") return true;
    const type = event.type?.toLowerCase() || "";
    if (activeTab === "workshops") {
      return type.includes("workshop") || type.includes("seminar") || type.includes("bootcamp") || type.includes("session");
    }
    if (activeTab === "contests") {
      return type.includes("contest") || type.includes("hackathon") || type.includes("battle") || type.includes("competition");
    }
    if (activeTab === "socials") {
      return type.includes("social") || type.includes("gathering") || type.includes("orientation") || type.includes("fest");
    }
    return true;
  });

  // Get latest GB data (2026)
  const gbMembers = allExecutiveBodies["2026"]?.filter(m => 
    ["President", "Vice President", "General Secretary", "Treasurer"].includes(m.designation)
  ) || [];
 
  return (
    <div className="flex flex-col min-h-screen bg-background selection:bg-primary/10 overflow-hidden">
      
      {/* 1. Hero Section */}
      <div className="-mt-16 relative">
        <HeroCarousel />
      </div>
 
      <ScrollingTicker />
 
      {/* 2. Brag Board (Stats Bar) */}
      <section className="relative border-y border-border/80 bg-gradient-to-b from-background to-muted/20 py-16 px-6">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "Active Members", value: 800, suffix: "+", icon: Users, gradient: "from-blue-500/10 to-transparent" },
              { label: "Departments", value: 7, suffix: "", icon: Briefcase, gradient: "from-indigo-500/10 to-transparent" },
              { label: "Events Hosted", value: 350, suffix: "+", icon: Calendar, gradient: "from-purple-500/10 to-transparent" },
              { label: "Projects Completed", value: 40, suffix: "+", icon: Rocket, gradient: "from-emerald-500/10 to-transparent" }
            ].map((stat, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="relative overflow-hidden bg-card/40 backdrop-blur-md border border-border/80 rounded-2xl p-8 hover:border-primary/30 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.02)] transition-all duration-300 flex flex-col items-center justify-center text-center space-y-3 group"
              >
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-gradient-to-br opacity-5 rounded-full blur-xl pointer-events-none group-hover:scale-125 transition-transform duration-700" />
                <stat.icon className="w-5 h-5 text-primary/70 mb-1" />
                <span className="text-4xl md:text-5xl font-serif font-bold text-foreground tracking-tight">
                  <Counter value={stat.value} suffix={stat.suffix} />
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
 
      {/* 3. The 3D Growth Story (Mind, Career, Soul) */}
      <section className="relative min-h-[92vh] flex items-center py-16 lg:py-24 px-6 bg-muted/10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-primary/5 rounded-full blur-[160px] pointer-events-none" />
        <div className="max-w-6xl mx-auto w-full space-y-16 relative z-10">
          
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary px-4 py-1.5 bg-primary/5 rounded-full border border-primary/20">
              Why Join BUCC?
            </span>
            <h3 className="text-4xl md:text-5xl font-sans font-bold tracking-tight text-foreground pt-3">
              Upgrade Yourself in Three Dimensions
            </h3>
            <p className="text-muted-foreground leading-relaxed font-light text-base md:text-lg max-w-2xl mx-auto">
              No need to wander around trying to figure out where you belong. At BUCC, we provide everything you need to grow your mind, accelerate your career, and enrich your campus life under one unified ecosystem.
            </p>
          </div>

          {/* 
            Dynamic Grid Layout:
            - If Spline is loading or WebGL is missing (useThreeColumnFallback is true), renders a standard 3-column static layout.
            - If Spline is loaded (useThreeColumnFallback is false), renders a 12-column grid layout split (7 columns for cards, 5 for Spline).
          */}
          <div className={useThreeColumnFallback ? "grid grid-cols-1 lg:grid-cols-3 gap-8" : "grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"}>
            {/* 
              Cards Flex Container:
              - When useThreeColumnFallback is true, we set this div to 'contents'. This effectively dissolves the wrapper
                in CSS Grid, rendering the 3 Dimension cards directly under the parent container as columns of grid-cols-3.
              - When useThreeColumnFallback is false, it spans 7 columns and stacks the cards vertically to exactly match the Spline box.
            */}
            <div className={useThreeColumnFallback ? "contents" : "lg:col-span-7 flex flex-col gap-5 lg:gap-0 lg:justify-between lg:h-[500px]"}>
              
              {/* Dimension 1: MIND */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="group relative bg-card/20 border border-border/40 p-5 md:p-6 rounded-xl flex flex-col justify-between hover:border-primary/30 hover:bg-card/40 hover:shadow-[0_8px_30px_rgba(var(--primary-rgb),0.01)] transition-all duration-500 backdrop-blur-sm"
              >
                {/* Subtle top indicator bar */}
                <div className="absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="space-y-4">
                  <div className="space-y-1">
                    <span className="text-[9px] font-extrabold uppercase tracking-widest text-primary/80">Dimension 01</span>
                    <h4 className="text-xl font-bold text-foreground tracking-tight group-hover:text-primary transition-colors">The Mind</h4>
                    <p className="text-[10px] font-semibold text-muted-foreground">Technical Mastery & Research</p>
                  </div>
                  <p className="text-xs text-muted-foreground font-light leading-relaxed">
                    Hone your engineering skills and academic pursuits through intensive coding labs, structural problem solving, and global research guidelines.
                  </p>
                  
                  {useThreeColumnFallback && (
                    <ul className="space-y-1.5 pt-1.5 border-t border-border/10">
                      <li className="flex items-start gap-2 text-[11px] text-muted-foreground">
                        <div className="w-1 h-1 rounded-full bg-primary/45 mt-1.5 flex-shrink-0" />
                        <span>Weekly APC coding contests and web-dev bootcamps.</span>
                      </li>
                      <li className="flex items-start gap-2 text-[11px] text-muted-foreground">
                        <div className="w-1 h-1 rounded-full bg-primary/45 mt-1.5 flex-shrink-0" />
                        <span>Research Wing seminars with lecturing professors and study abroad mentors.</span>
                      </li>
                    </ul>
                  )}
                </div>

                {useThreeColumnFallback && (
                  <div className="mt-5 pt-4 border-t border-border/20 space-y-2">
                    <span className="text-[8px] font-bold tracking-wider uppercase text-muted-foreground/50 block">Action Wings:</span>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="text-[8px] font-bold px-1.5 py-0.5 bg-primary/5 border border-primary/10 text-primary/80 rounded">Analytical Programming Corner</span>
                      <span className="text-[8px] font-bold px-1.5 py-0.5 bg-primary/5 border border-primary/10 text-primary/80 rounded">Research Wing</span>
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Dimension 2: CAREER */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="group relative bg-card/20 border border-border/40 p-5 md:p-6 rounded-xl flex flex-col justify-between hover:border-primary/30 hover:bg-card/40 hover:shadow-[0_8px_30px_rgba(var(--primary-rgb),0.01)] transition-all duration-500 backdrop-blur-sm"
              >
                {/* Subtle top indicator bar */}
                <div className="absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="space-y-4">
                  <div className="space-y-1">
                    <span className="text-[9px] font-extrabold uppercase tracking-widest text-primary/80">Dimension 02</span>
                    <h4 className="text-xl font-bold text-foreground tracking-tight group-hover:text-primary transition-colors">The Career</h4>
                    <p className="text-[10px] font-semibold text-muted-foreground">Professional Readiness & Products</p>
                  </div>
                  <p className="text-xs text-muted-foreground font-light leading-relaxed">
                    Bridge the gap between class courses and the industry. Design production-level club software, build your resume, and connect with global employers.
                  </p>

                  {useThreeColumnFallback && (
                    <ul className="space-y-1.5 pt-1.5 border-t border-border/10">
                      <li className="flex items-start gap-2 text-[11px] text-muted-foreground">
                        <div className="w-1 h-1 rounded-full bg-primary/45 mt-1.5 flex-shrink-0" />
                        <span>Collaborate on live platforms, portfolios, and tools in R&D.</span>
                      </li>
                      <li className="flex items-start gap-2 text-[11px] text-muted-foreground">
                        <div className="w-1 h-1 rounded-full bg-primary/45 mt-1.5 flex-shrink-0" />
                        <span>Secure corporate relations, sponsorship pitches, and job referrals.</span>
                      </li>
                    </ul>
                  )}
                </div>

                {useThreeColumnFallback && (
                  <div className="mt-5 pt-4 border-t border-border/20 space-y-2">
                    <span className="text-[8px] font-bold tracking-wider uppercase text-muted-foreground/50 block">Active Teams:</span>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="text-[8px] font-bold px-1.5 py-0.5 bg-primary/5 border border-primary/10 text-primary/80 rounded">Research & Development (R&D)</span>
                      <span className="text-[8px] font-bold px-1.5 py-0.5 bg-primary/5 border border-primary/10 text-primary/80 rounded">Corporate Alliance</span>
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Dimension 3: SOUL */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="group relative bg-card/20 border border-border/40 p-5 md:p-6 rounded-xl flex flex-col justify-between hover:border-primary/30 hover:bg-card/40 hover:shadow-[0_8px_30px_rgba(var(--primary-rgb),0.01)] transition-all duration-500 backdrop-blur-sm"
              >
                {/* Subtle top indicator bar */}
                <div className="absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="space-y-4">
                  <div className="space-y-1">
                    <span className="text-[9px] font-extrabold uppercase tracking-widest text-primary/80">Dimension 03</span>
                    <h4 className="text-xl font-bold text-foreground tracking-tight group-hover:text-primary transition-colors">The Soul</h4>
                    <p className="text-[10px] font-semibold text-muted-foreground">Campus Life & Social Community</p>
                  </div>
                  <p className="text-xs text-muted-foreground font-light leading-relaxed">
                    Experience a supportive community that extends far beyond computer screens. Join sports leagues, host orientations, and capture college memories.
                  </p>

                  {useThreeColumnFallback && (
                    <ul className="space-y-1.5 pt-1.5 border-t border-border/10">
                      <li className="flex items-start gap-2 text-[11px] text-muted-foreground">
                        <div className="w-1 h-1 rounded-full bg-primary/45 mt-1.5 flex-shrink-0" />
                        <span>Male & female teams active in basketball, football, and e-sports leagues.</span>
                      </li>
                      <li className="flex items-start gap-2 text-[11px] text-muted-foreground">
                        <div className="w-1 h-1 rounded-full bg-primary/45 mt-1.5 flex-shrink-0" />
                        <span>Creative graphic design, anchoring, video editing, and orientations.</span>
                      </li>
                    </ul>
                  )}
                </div>

                {useThreeColumnFallback && (
                  <div className="mt-5 pt-4 border-t border-border/20 space-y-2">
                    <span className="text-[8px] font-bold tracking-wider uppercase text-muted-foreground/50 block">Action Wings:</span>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="text-[8px] font-bold px-1.5 py-0.5 bg-primary/5 border border-primary/10 text-primary/80 rounded">Sports Wing</span>
                      <span className="text-[8px] font-bold px-1.5 py-0.5 bg-primary/5 border border-primary/10 text-primary/80 rounded">Creative & Anchoring Wings</span>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>

            {/* 
              WebGL Spline Box:
              - Rendered persistently in the DOM to cache-prefetch the Spline assets in the background.
              - Controls display using CSS toggle states ('hidden pointer-events-none absolute' vs 'lg:col-span-5 block')
                to avoid unmounting and re-downloading WebGL canvases when state updates.
            */}
            {isWebGLSupported && (
              <div className={useThreeColumnFallback 
                ? "hidden opacity-0 pointer-events-none w-0 h-0 overflow-hidden absolute" 
                : `lg:col-span-5 h-[320px] md:h-[400px] lg:h-[500px] w-full relative rounded-2xl overflow-hidden bg-card/10 border border-border/40 backdrop-blur-sm opacity-100 transition-all duration-700 animate-in fade-in zoom-in-95 ${scrollY >= 800 ? "hidden opacity-0 pointer-events-none" : ""}`
              }>
                <SplineModel 
                  scene="https://prod.spline.design/97MRBci3ZutLdKaH/scene.splinecode" 
                  onLoad={() => {
                    setIsSplineLoaded(true);
                    setUseThreeColumnFallback(false);
                  }}
                  onError={() => {
                    setIsWebGLSupported(false);
                    setUseThreeColumnFallback(true);
                  }}
                />
              </div>
            )}
          </div>
          
        </div>
      </section>
 
      {/* 4. Department Directory */}
      <section id="departments-section" className="relative py-24 md:py-32 px-6">
        <div className="absolute right-0 bottom-1/4 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-6xl mx-auto space-y-16 relative z-10">
          <div className="max-w-2xl space-y-4">
            <h2 className="text-3xl md:text-5xl font-serif font-bold tracking-tight text-foreground">
              <span className="hidden md:inline">Explore Our </span>Departments and Wings
            </h2>
            <p className="text-muted-foreground leading-relaxed font-light text-lg">
              Explore the specialized departments and active student wings driving academic excellence, software engineering, and club activities forward.
            </p>
          </div>
 
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedDepts.map((dept: any, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="group perspective-1000 w-full h-[400px] cursor-pointer"
              >
                <div className="relative w-full h-full duration-700 preserve-3d group-hover:[transform:rotateY(180deg)]">
                  {/* Card Front */}
                  <div className="absolute inset-0 w-full h-full backface-hidden bg-card/60 backdrop-blur-sm border border-border/80 rounded-2xl p-7 flex flex-col justify-between overflow-hidden shadow-sm hover:border-primary/30 transition-all duration-300">
                    {/* Subtle Top glow of department color */}
                    <div className={`absolute -top-12 -right-12 w-32 h-32 rounded-full blur-3xl opacity-20 ${dept.color}`} />
                    
                    {/* Background Image with dark overlay */}
                    {dept.image && (
                      <div className="absolute inset-0 z-0">
                        <Image 
                          src={dept.image} 
                          alt={dept.name} 
                          fill
                          className="object-cover opacity-25 group-hover:opacity-40 group-hover:scale-105 transition-all duration-700"
                          sizes="(max-width: 768px) 100vw, 350px"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
                      </div>
                    )}

                    {/* Top: Department Badge */}
                    <div className="relative z-10">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-primary/70 px-2.5 py-1 bg-primary/5 rounded-full border border-primary/10">
                        Department
                      </span>
                    </div>

                    {/* Bottom: Title, Description & Action */}
                    <div className="space-y-4 relative z-10 mt-auto">
                      <div className="space-y-2">
                        <h3 className="text-2xl font-serif font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                          {dept.name}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed font-light line-clamp-3">
                          {dept.description}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-border/60 flex justify-end items-center">
                        <RotateCw className="w-4 h-4 text-muted-foreground/45 group-hover:rotate-180 transition-transform duration-700" />
                      </div>
                    </div>
                  </div>

                  {/* Card Back */}
                  <div className="absolute inset-0 w-full h-full backface-hidden [transform:rotateY(180deg)] bg-card border border-primary/20 rounded-2xl p-7 flex flex-col justify-between overflow-hidden shadow-lg">
                    {/* Bottom-left subtle glow */}
                    <div className={`absolute -bottom-12 -left-12 w-32 h-32 rounded-full blur-3xl opacity-25 ${dept.color}`} />
                    
                    <div className="space-y-5 relative z-10 flex-1 flex flex-col justify-between">
                      <div className="flex items-center justify-between border-b border-border/80 pb-3">
                        <div className="flex items-center gap-2">
                          <Layers className="w-4 h-4 text-primary" />
                          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Focus Areas & Wings</span>
                        </div>
                      </div>

                      <div className="space-y-2.5 my-auto">
                        {dept.subWings?.map((sub: string, idx: number) => (
                          <div 
                            key={idx} 
                            className="flex items-center gap-2.5 px-3 py-2 bg-background border border-border/80 rounded-xl hover:border-primary/30 transition-all duration-300 hover:translate-x-1"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                            <span className="text-xs text-foreground/90 font-medium">{sub}</span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-4 border-t border-border/60">
                        <Link 
                          href={dept.url} 
                          className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-all text-xs uppercase tracking-wider shadow-sm hover:shadow active:scale-[0.98]"
                        >
                          <span>Explore Department</span>
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Wings Carousel Card (Spans 2 columns on desktop) */}
            {(!isMobile || isDeptsExpanded) && (
              <div 
                onMouseEnter={() => setIsCarouselHovered(true)}
                onMouseLeave={() => setIsCarouselHovered(false)}
                className="col-span-1 md:col-span-1 lg:col-span-2 h-[400px] bg-card/60 backdrop-blur-sm border border-border/80 rounded-2xl flex overflow-hidden relative shadow-xs hover:border-primary/30 transition-all duration-300"
              >
                {/* Left Side: Vertical text banner */}
                <div className="w-12 border-r border-border/60 bg-primary/[0.02] flex items-center justify-center relative select-none">
                  <span className="[writing-mode:vertical-lr] rotate-180 text-[10px] font-bold uppercase tracking-[0.45em] text-muted-foreground/40">
                    W I N G S
                  </span>
                </div>

                {/* Right Side: Main Carousel Content */}
                <div className="flex-grow flex-1 p-8 flex flex-col justify-between relative overflow-hidden">
                  {/* Top-right subtle glow based on active active color */}
                  <div className={`absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl opacity-15 transition-all duration-700 pointer-events-none ${wingsData[currentWingIndex].color.split(" ")[2] || "bg-primary"}`} />

                  <div className="flex-grow flex flex-col justify-between z-10 relative h-full">
                    {/* Header Tag and Controls */}
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-primary/70 px-2.5 py-1 bg-primary/5 rounded-full border border-primary/10">
                        Action Wing
                      </span>
                      <div className="flex items-center gap-1.5">
                        {wingsData.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleDotClick(idx)}
                            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${currentWingIndex === idx ? 'bg-primary w-4' : 'bg-muted-foreground/30 hover:bg-muted-foreground/60'}`}
                            aria-label={`Go to slide ${idx + 1}`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Carousel Swipe Slide */}
                    <div className="flex-grow flex flex-col justify-center my-6 min-h-0">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={currentWingIndex}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.3 }}
                          className="space-y-4"
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center border border-border/60 ${wingsData[currentWingIndex].color}`}>
                              {React.createElement(wingsData[currentWingIndex].icon, { className: "w-6 h-6" })}
                            </div>
                            <div>
                              <h3 className="text-xl md:text-2xl font-serif font-bold text-foreground">
                                {wingsData[currentWingIndex].title}
                              </h3>
                              <span className="text-[9px] font-bold tracking-widest text-muted-foreground/80 uppercase">
                                BUCC Specialized Wing
                              </span>
                            </div>
                          </div>

                          <p className="text-xs md:text-sm text-muted-foreground leading-relaxed font-light line-clamp-3 md:line-clamp-4">
                            {wingsData[currentWingIndex].description}
                          </p>

                          {wingsData[currentWingIndex].highlight && (
                            <div className="flex items-start gap-2 pt-2 text-[10px] text-foreground font-medium">
                              <span className="font-bold text-primary uppercase tracking-wider">Highlight:</span>
                              <span className="text-muted-foreground font-light">{wingsData[currentWingIndex].highlight}</span>
                            </div>
                          )}
                        </motion.div>
                      </AnimatePresence>
                    </div>

                    {/* Bottom Bar Info */}
                    <div className="pt-4 border-t border-border/60 flex justify-between items-center text-xs text-muted-foreground/60">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handlePrevClick}
                          className="w-7 h-7 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/45 transition-colors focus:outline-none"
                          aria-label="Previous wing"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={handleNextClick}
                          className="w-7 h-7 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/45 transition-colors focus:outline-none"
                          aria-label="Next wing"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {isMobile && (
            <div className="flex justify-center pt-8">
              <button
                onClick={() => setIsDeptsExpanded(!isDeptsExpanded)}
                className="px-6 py-2.5 bg-card border border-border/80 text-foreground font-bold hover:bg-muted text-xs uppercase tracking-widest rounded-xl transition-all shadow-xs"
              >
                {isDeptsExpanded ? "Show Less" : "Expand Departments"}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 4.5. Featured Projects Section */}
      <section className="relative py-24 md:py-32 px-6 border-t border-border/80">
        <div className="absolute top-1/3 left-1/4 w-[450px] h-[450px] bg-primary/5 rounded-full blur-[130px] pointer-events-none" />
        <div className="max-w-6xl mx-auto space-y-16 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border/80 pb-6">
            <div className="space-y-2">
              <h2 className="text-3xl md:text-5xl font-serif font-bold tracking-tight text-foreground">Featured Projects</h2>
              <p className="text-sm text-muted-foreground font-light flex flex-wrap items-center gap-2">
                <span>Production-grade systems designed and built by our members.</span>
                <span className="hidden sm:inline">•</span>
                <Link 
                  href="/projects" 
                  className="text-xs font-bold uppercase tracking-widest hover:text-primary transition-colors underline underline-offset-4 flex items-center gap-1"
                >
                  Explore Member Showcase <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {initialProjects.length > 0 ? initialProjects.slice(0, 3).map((proj: any, i: number) => (
              <motion.div 
                key={proj._id || i} 
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="group bg-card border border-border/85 rounded-2xl p-5 hover:shadow-[0_12px_40px_rgba(0,0,0,0.03)] hover:border-primary/30 transition-all duration-500 flex flex-col justify-between"
              >
                <div className="space-y-5 flex-1 flex flex-col justify-between">
                  <div className="aspect-[16/10] overflow-hidden relative rounded-xl group-hover:shadow-md transition-all duration-700 bg-muted shrink-0">
                    {/* Featured star badge */}
                    {proj.isFeatured && (
                      <div className="absolute top-4 left-4 z-20 flex items-center gap-1 px-2.5 py-1 bg-amber-500 text-white rounded-full shadow-sm text-[9px] font-bold tracking-wider uppercase">
                        <span>★ Featured</span>
                      </div>
                    )}
                    
                    {proj.coverImage ? (
                      <img 
                        src={proj.coverImage} 
                        alt={proj.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-muted-foreground/40 font-serif italic bg-muted/40">
                        No Preview
                      </div>
                    )}
                  </div>

                  <div className="space-y-4 flex-1 flex flex-col justify-between mt-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                        <span>{proj.author?.name || "Unknown Author"}</span>
                        <span>•</span>
                        <span>{new Date(proj.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</span>
                      </div>
                      <h3 className="text-xl font-serif font-bold leading-snug group-hover:text-primary transition-colors line-clamp-2">
                        {proj.title}
                      </h3>
                      <p className="text-sm text-muted-foreground font-light line-clamp-2 leading-relaxed">
                        {proj.shortDescription}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {proj.techStack?.slice(0, 3).map((tech: string) => (
                        <span key={tech} className="text-[9px] font-semibold tracking-wide uppercase px-2 py-0.5 bg-muted rounded-md text-muted-foreground">
                          {tech}
                        </span>
                      ))}
                      {proj.techStack?.length > 3 && (
                        <span className="text-[9px] font-semibold tracking-wide uppercase px-2 py-0.5 bg-muted rounded-md text-muted-foreground">
                          +{proj.techStack.length - 3}
                        </span>
                      )}
                    </div>

                    <div className="pt-4 border-t border-border/60 flex items-center justify-between gap-3 mt-auto">
                      <Link 
                        href={`/projects/${proj.slug}`}
                        className="text-xs font-bold uppercase tracking-widest text-primary hover:text-foreground transition-colors group-hover:translate-x-1 duration-300"
                      >
                        Case Study &rarr;
                      </Link>
                      
                      {proj.deploymentLink && (
                        <a 
                          href={proj.deploymentLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/5 hover:bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest rounded-lg border border-primary/10 transition-colors"
                        >
                          Live Demo &nearr;
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )) : (
              <div className="col-span-full py-16 text-center text-muted-foreground font-serif italic border border-dashed border-border rounded-2xl bg-card/50">
                Explore our projects directory for latest releases.
              </div>
            )}
          </div>
        </div>
      </section>
 
      {/* 5. Events Feed */}
      <section className="relative py-24 md:py-32 px-6 bg-muted/20 border-t border-border/80">
        <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[140px] pointer-events-none" />
        <div className="max-w-6xl mx-auto space-y-16 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border/80 pb-6">
            <div className="space-y-2">
              <h2 className="text-3xl md:text-5xl font-serif font-bold tracking-tight text-foreground">Upcoming Events</h2>
              <p className="text-sm text-muted-foreground font-light flex flex-wrap items-center gap-2">
                <span>Join our workshops, hackathons, and social fests.</span>
                <span className="hidden sm:inline">•</span>
                <Link 
                  href="/events" 
                  className="text-xs font-bold uppercase tracking-widest hover:text-primary transition-colors underline underline-offset-4 flex items-center gap-1"
                >
                  View Full Calendar <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </p>
            </div>

            <div className="flex flex-wrap gap-2 items-center">
              {[
                { id: "all", label: "All" },
                { id: "workshops", label: "Workshops" },
                { id: "contests", label: "Hackathons" },
                { id: "socials", label: "Socials" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-300 ${
                    activeTab === tab.id
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-card border border-border text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
 
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.length > 0 ? filteredEvents.map((event: any, i: number) => {
              const dateObj = new Date(event.startingDate);
              const month = dateObj.toLocaleDateString("en-US", { month: "short" }).toUpperCase();
              const day = dateObj.toLocaleDateString("en-US", { day: "2-digit" });
              const hasRegLink = !!event.registrationLink;
              
              return (
                <motion.div 
                  key={event._id || i} 
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  className="group bg-card border border-border/85 rounded-2xl p-5 hover:shadow-[0_12px_40px_rgba(0,0,0,0.03)] hover:border-primary/30 transition-all duration-500 flex flex-col justify-between"
                >
                  <div className="space-y-6 flex-1 flex flex-col justify-between">
                    {/* Image container */}
                    <div className="aspect-[16/10] overflow-hidden relative rounded-xl group-hover:shadow-md transition-all duration-700 bg-muted shrink-0">
                      {/* Date Badge */}
                      <div className="absolute top-4 left-4 z-20 flex flex-col items-center justify-center bg-background/90 backdrop-blur-md border border-border/80 rounded-xl px-2.5 py-1.5 shadow-sm font-sans w-11">
                        <span className="text-[8px] font-bold text-primary tracking-wider uppercase leading-tight">{month}</span>
                        <span className="text-lg font-black text-foreground leading-none mt-0.5">{day}</span>
                      </div>

                      {/* Status Badge */}
                      <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 px-2.5 py-1 bg-background/95 backdrop-blur-md border border-border/60 rounded-full shadow-sm text-[9px] font-bold tracking-wider uppercase">
                        {hasRegLink ? (
                          <>
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-emerald-600">Register Open</span>
                          </>
                        ) : (
                          <>
                            <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40" />
                            <span className="text-muted-foreground/70">Details Only</span>
                          </>
                        )}
                      </div>

                      {event.featuredImage ? (
                        <Image 
                          src={event.featuredImage} 
                          alt={event.title} 
                          fill 
                          sizes="(max-width: 768px) 100vw, 350px"
                          className="object-cover transition-transform duration-700 group-hover:scale-105" 
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground/40 font-serif italic bg-muted/40">
                          No Preview
                        </div>
                      )}
                    </div>

                    {/* Content info */}
                    <div className="space-y-4 flex-1 flex flex-col justify-between mt-4">
                      <div className="space-y-2.5">
                        <p className="text-[9px] font-bold text-primary/70 uppercase tracking-[0.2em] bg-primary/5 px-2 py-0.5 rounded-md inline-block">
                          {event.type}
                        </p>
                        <h3 className="text-lg font-serif font-bold leading-snug group-hover:text-primary transition-colors line-clamp-2">
                          {event.title}
                        </h3>
                        <p className="text-xs text-muted-foreground font-light flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-primary/70 shrink-0" /> <span className="truncate">{event.venue}</span>
                        </p>
                      </div>

                      <div className="pt-4 border-t border-border/60 flex items-center justify-between gap-3 mt-auto">
                        <Link 
                          href={`/events/${event._id}`}
                          className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors group-hover:translate-x-1 duration-300"
                        >
                          Read Details &rarr;
                        </Link>
                        
                        {hasRegLink && (
                          <a 
                            href={event.registrationLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                          >
                            Register <ArrowRight className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            }) : (
              <div className="col-span-full py-16 text-center text-muted-foreground font-serif italic border border-dashed border-border rounded-2xl bg-card/50">
                Stay tuned! No events scheduled for this category yet.
              </div>
            )}
          </div>
        </div>
      </section>
 
      {/* 6. Notices / Bulletins */}
      <AnnouncementsSection />
 
      {/* 7. Leadership Roster */}
      <section className="relative py-24 md:py-32 px-6 border-t border-border/80">
        <div className="absolute top-1/3 right-1/4 w-[450px] h-[450px] bg-primary/5 rounded-full blur-[130px] pointer-events-none" />
        <div className="max-w-6xl mx-auto space-y-32 relative z-10">
          
          {/* Advisors */}
          <div className="space-y-16">
            <div className="max-w-2xl space-y-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary px-3 py-1.5 bg-primary/10 rounded-full">Guidance</span>
              <h2 className="text-3xl md:text-5xl font-serif font-bold tracking-tight pt-3">Faculty Advisors</h2>
              <p className="text-muted-foreground font-light text-lg">Guiding the club with wisdom, guidance, and academic excellence.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
              {[...advisorsData, ...coAdvisorsData].map((advisor, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="space-y-6"
                >
                  <div className="relative aspect-square w-full max-w-[280px] bg-muted overflow-hidden border border-border rounded-2xl group shadow-sm hover:shadow-md transition-all duration-300">
                    <Image 
                      src={advisor.image} 
                      alt={advisor.name} 
                      fill 
                      sizes="(max-width: 640px) 100vw, 280px"
                      className="object-cover transition-transform duration-750 group-hover:scale-105" 
                      quality={75}
                      priority={i < 3}
                    />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-serif font-bold transition-colors">{advisor.name}</h3>
                    <p className="text-xs font-bold text-primary uppercase tracking-widest">{advisor.designation}</p>
                    <p className="text-xs text-muted-foreground">{advisor.bracu_designation}, BRACU</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
 
          {/* Governing Body */}
          <div className="space-y-16">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div className="max-w-2xl space-y-4">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary px-3 py-1.5 bg-primary/10 rounded-full">Executive Panel</span>
                <h2 className="text-3xl md:text-5xl font-serif font-bold tracking-tight pt-3">Governing Body 2026</h2>
                <p className="text-muted-foreground font-light text-lg">The student leadership driving our operations and tech products forward.</p>
              </div>
              <Link 
                href="/executive-body" 
                className="text-xs font-bold uppercase tracking-widest hover:text-primary transition-colors border-b border-foreground/20 hover:border-primary/30 pb-1"
              >
                Full Executive Body
              </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
              {gbMembers.map((member, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  className="space-y-6 text-center group"
                >
                  <div className="relative aspect-[4/5] w-full bg-muted overflow-hidden border border-border rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
                    <Image 
                      src={member.image} 
                      alt={member.fullName} 
                      fill 
                      sizes="(max-width: 768px) 50vw, 280px"
                      className="object-cover transition-transform duration-750 group-hover:scale-105" 
                      quality={75}
                      priority={i < 4}
                    />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-serif font-bold leading-tight">{member.fullName}</h3>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{member.designation}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
 
      {/* 8. Quick FAQ & Inquiry Section - Completely Hidden on Mobile/Tablet */}
      <section className="hidden lg:block py-24 px-6 border-t border-border bg-card/30">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 text-primary">
              <HelpCircle className="w-5 h-5" />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Help Desk</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold tracking-tight text-foreground">Common Questions & Inquiries</h2>
            <p className="text-muted-foreground font-light max-w-xl mx-auto text-sm">Find quick answers or send an inquiry directly to the BUCC Governing Body.</p>
          </div>
 
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Column: Direct Inquiry Card */}
            <div className="lg:col-span-5">
              <div className="bg-card border border-border/80 p-8 rounded-2xl space-y-6 shadow-xs">
                <div className="space-y-1">
                  <h3 className="text-lg font-serif font-bold text-foreground">Direct Inquiry</h3>
                  <p className="text-xs text-muted-foreground font-light">Have a specific question? Write to us directly and we'll follow up shortly.</p>
                </div>

                <form onSubmit={handleInquirySubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label htmlFor="faq-name" className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Full Name</label>
                    <input 
                      id="faq-name"
                      type="text"
                      required
                      placeholder="Your Name"
                      value={inquiryData.name}
                      onChange={(e) => setInquiryData({ ...inquiryData, name: e.target.value })}
                      className="w-full bg-muted/20 border border-border focus:border-primary/50 text-foreground text-xs px-3.5 py-2.5 rounded-lg outline-none transition-all placeholder:text-muted-foreground/40"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="faq-email" className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Email Address</label>
                    <input 
                      id="faq-email"
                      type="email"
                      required
                      placeholder="your.email@gmail.com"
                      value={inquiryData.email}
                      onChange={(e) => setInquiryData({ ...inquiryData, email: e.target.value })}
                      className="w-full bg-muted/20 border border-border focus:border-primary/50 text-foreground text-xs px-3.5 py-2.5 rounded-lg outline-none transition-all placeholder:text-muted-foreground/40"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="faq-message" className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Message</label>
                    <textarea 
                      id="faq-message"
                      required
                      placeholder="Write your questions or inquiries here..."
                      rows={4}
                      value={inquiryData.message}
                      onChange={(e) => setInquiryData({ ...inquiryData, message: e.target.value })}
                      className="w-full bg-muted/20 border border-border focus:border-primary/50 text-foreground text-xs px-3.5 py-2.5 rounded-lg outline-none transition-all resize-none placeholder:text-muted-foreground/40"
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={isSubmittingInquiry}
                    className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 disabled:bg-neutral-800 disabled:text-neutral-600 font-bold uppercase tracking-widest text-[10px] rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/10"
                  >
                    {isSubmittingInquiry ? "Sending..." : "Send Message"}
                  </button>
                </form>
              </div>
            </div>

            {/* Right Column: Accordion FAQ List */}
            <div className="lg:col-span-7 space-y-4">
              {[
                {
                  q: "Do I need to be a CS student to join BUCC?",
                  a: "No! We welcome students from all departments (CS, EEE, Physics, BBA, etc.). Departments like Creative, Event Management, and HR look for creative designs, writing, and leadership skills beyond coding."
                },
                {
                  q: "When does recruitment happen?",
                  a: "Recruitment drives open at the start of major semesters (Spring and Fall). Announcements are pinned to the top of our announcements feed and posted on social media."
                },
                {
                  q: "I don't know how to code. Can I still join?",
                  a: "Absolutely! BUCC is a learning-first community. We regularly host workshops, competitive training cohorts, and study groups designed to build technical competence from the ground up."
                }
              ].map((faq, i) => {
                const isOpen = openFaqIndex === i;
                return (
                  <div 
                    key={i} 
                    className={`border border-border/80 bg-card/60 backdrop-blur-sm rounded-2xl transition-all duration-300 ${isOpen ? 'border-primary/30 bg-card shadow-[0_4px_20px_rgba(0,0,0,0.01)]' : 'hover:border-primary/20 hover:bg-card/80'}`}
                  >
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : i)}
                      type="button"
                      className="w-full text-left p-6 flex justify-between items-center gap-4 focus:outline-none"
                    >
                      <h3 className="font-serif text-base md:text-lg font-bold text-foreground">
                        <span className="text-primary font-bold mr-2">Q.</span>
                        {faq.q}
                      </h3>
                      <ChevronRight 
                        className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${isOpen ? 'rotate-90 text-primary' : ''}`} 
                      />
                    </button>
                    <div 
                      className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-48 border-t border-border/40' : 'max-h-0'}`}
                    >
                      <div className="p-6 text-sm text-muted-foreground font-light leading-relaxed pl-10">
                        {faq.a}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

          <div className="text-center">
            <Link href="/faq">
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors border-b border-border hover:border-foreground pb-1">
                View Complete FAQ <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          </div>
        </div>
      </section>
 
      {/* 9. Join Us Section (Premium Dark Contrast Fold - Centered CTA, Shown on Desktop & Mobile) */}
      <section className="relative py-24 md:py-36 px-6 overflow-hidden border-t border-border bg-zinc-950 text-white">
        {/* Ambient Gradient Mesh overlays */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center space-y-10 relative z-10">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-1.5 text-[9px] font-bold tracking-[0.25em] text-primary uppercase bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20">
              Ready to upgrade?
            </span>
            <h2 className="text-4xl md:text-6xl font-serif font-bold tracking-tight text-white leading-tight bg-gradient-to-b from-white via-neutral-100 to-neutral-400 bg-clip-text text-transparent">
              Ready to Upgrade Yourself?
            </h2>
            <p className="text-sm md:text-lg text-neutral-400 font-light leading-relaxed max-w-2xl mx-auto">
              Join hundreds of students pushing the boundaries of technology. Whether you're a beginner or an expert, there's a space for you in our community. Let's build the future together.
            </p>
          </div>
          <div className="pt-4 flex flex-col sm:flex-row justify-center items-center gap-6">
            <Link 
              href="/registration" 
              className="inline-flex items-center justify-center px-10 py-4 bg-white text-black hover:bg-neutral-200 active:scale-[0.98] font-bold rounded-xl transition-all text-xs uppercase tracking-widest shadow-lg shadow-white/5"
            >
              Apply for Membership
            </Link>
            <Link 
              href="/about" 
              className="inline-flex items-center justify-center px-10 py-4 border border-white/10 hover:border-white/30 text-white font-bold rounded-xl transition-all hover:bg-white/5 text-xs uppercase tracking-widest backdrop-blur-md"
            >
              Learn More
            </Link>
          </div>
          <p className="text-[9px] font-bold text-white/40 uppercase tracking-[0.35em] pt-4">
            Empowering the next generation of tech leaders since 2001
          </p>
        </div>
      </section>
    </div>
  );
}
