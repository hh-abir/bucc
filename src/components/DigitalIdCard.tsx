"use client";
 
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { User as UserIcon, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
 
interface UserProps {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  studentId?: string;
  buccDepartment?: string;
  designation?: string;
  memberStatus?: string;
  image?: string;
  profileSlug?: string;
}
 
// Obfuscates a 24-character hex MongoDB ObjectId into a scrambled token
const encodeObfuscatedId = (idStr: string): string => {
  if (!idStr || idStr.length !== 24) return idStr;
  const hex = "0123456789abcdef";
  let shifted = "";
  const normalized = idStr.toLowerCase();
  for (let i = 0; i < normalized.length; i++) {
    const char = normalized[i];
    const index = hex.indexOf(char);
    if (index !== -1) {
      shifted += hex[(index + 5) % 16];
    } else {
      shifted += char;
    }
  }
  return shifted.split("").reverse().join("");
};
 
// Formats student ID to custom display-only BUCC ID
const getBuccId = (studentId?: string) => {
  if (!studentId) return "BUCC-XXXX-0000";
  const idStr = studentId.trim();
  let year = new Date().getFullYear().toString();
  let suffix = "0000";
  
  if (idStr.length === 8) {
    year = "20" + idStr.substring(0, 2);
    suffix = idStr.substring(4);
  } else if (idStr.length === 10) {
    year = idStr.substring(0, 4);
    suffix = idStr.substring(6);
  } else {
    suffix = idStr.slice(-4);
  }
  
  return `BUCC-${year}-${suffix}`;
};
 
// Dynamically styles card based on specific BUCC role tiers
const getBuccTheme = (designation?: string) => {
  const role = designation || "General Member";
  
  // 1. Executive Tier (GB & EB)
  const isExecutive = ["President", "Vice President", "General Secretary", "Treasurer", "Director", "Assistant Director"].includes(role);
  if (isExecutive) {
    return {
      glow: "rgba(234, 179, 8, 0.25)",
      border: "border-yellow-500/40",
      bg: "from-yellow-500/20 via-yellow-600/5 to-transparent",
      text: "text-yellow-400",
      badge: "border-yellow-500/30 text-yellow-400",
      color: "#eab308",
      chip: "from-amber-400/80 via-yellow-500/60 to-amber-600/80",
      chipBorder: "border-yellow-700/30",
      avatarRing: "linear-gradient(to top right, #eab308, transparent 70%)"
    };
  }
  
  // 2. Senior Executive Tier (SE)
  if (role === "Senior Executive") {
    return {
      glow: "rgba(226, 232, 240, 0.22)",
      border: "border-zinc-400/40",
      bg: "from-zinc-400/15 via-zinc-500/5 to-transparent",
      text: "text-zinc-200",
      badge: "border-zinc-100/20 text-zinc-200",
      color: "#e2e8f0",
      chip: "from-zinc-300/80 via-zinc-400/60 to-zinc-500/80",
      chipBorder: "border-zinc-500/30",
      avatarRing: "linear-gradient(to top right, #e2e8f0, transparent 70%)"
    };
  }
  
  // 3. Executive Tier (E)
  if (role === "Executive") {
    return {
      glow: "rgba(59, 130, 246, 0.25)",
      border: "border-blue-500/40",
      bg: "from-blue-500/20 via-blue-600/5 to-transparent",
      text: "text-blue-400",
      badge: "border-blue-500/30 text-blue-400",
      color: "#3b82f6",
      chip: "from-orange-400/80 via-amber-600/60 to-orange-700/80",
      chipBorder: "border-orange-700/30",
      avatarRing: "linear-gradient(to top right, #3b82f6, transparent 70%)"
    };
  }
  
  // 4. General Member Tier (GM)
  return {
    glow: "rgba(71, 85, 105, 0.15)",
    border: "border-zinc-800",
    bg: "from-zinc-800/10 via-zinc-900/5 to-transparent",
    text: "text-zinc-400",
    badge: "border-zinc-800/85 text-zinc-300",
    color: "#64748b",
    chip: "from-slate-500/80 via-slate-600/60 to-slate-700/80",
    chipBorder: "border-slate-800/30",
    avatarRing: "linear-gradient(to top right, #64748b, transparent 70%)"
  };
};
 
export function DigitalIdCard({ user, cardType }: { user: UserProps; cardType: "digital" | "classic" }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [transformStyle, setTransformStyle] = useState("rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
  const [shineStyle, setShineStyle] = useState("");
  const [verificationUrl, setVerificationUrl] = useState("");
 
  const theme = getBuccTheme(user.designation);
  const buccId = getBuccId(user.studentId);
 
  useEffect(() => {
    if (typeof window !== "undefined") {
      const userId = user.id || user._id || "";
      const fallbackSlug = userId ? encodeObfuscatedId(userId) : "";
      const slug = user.profileSlug || fallbackSlug;
      setVerificationUrl(`${window.location.origin}/m/${slug.toLowerCase()}`);
    }
  }, [user, buccId]);
 
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
 
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
 
    const rotateX = ((centerY - y) / centerY) * 12;
    const rotateY = ((x - centerX) / centerX) * 12;
 
    setTransformStyle(`rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`);
 
    const pctX = (x / rect.width) * 100;
    const pctY = (y / rect.height) * 100;
    setShineStyle(`radial-gradient(circle at ${pctX}% ${pctY}%, rgba(255, 255, 255, 0.18) 0%, transparent 50%)`);
  };
 
  const handleMouseLeave = () => {
    setTransformStyle("rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
    setShineStyle("radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0) 0%, transparent 50%)");
  };
 
  return (
    <div className="w-full flex flex-col items-center lg:items-start select-none">
      {cardType === "digital" ? (
        <div key="digital-card" className="w-full animate-in fade-in zoom-in-98 duration-300">
          <style>{`
            @keyframes shimmersweep {
              0% { background-position: -200% 0; }
              100% { background-position: 200% 0; }
            }
            .designation-shimmer-layer {
              background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.18) 50%, rgba(255,255,255,0) 100%);
              background-size: 200% 100%;
              animation: shimmersweep 3.5s infinite linear;
            }
          `}</style>
 
          <div 
            className="relative w-full aspect-[1/1.58] cursor-pointer group rounded-[2.2rem] overflow-visible"
            style={{ perspective: "1500px" }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={() => setIsFlipped(!isFlipped)}
          >
            {/* Inner Card wrapper for 3D flip animation */}
            <div 
              className="relative w-full h-full duration-700 ease-out"
              style={{
                transformStyle: "preserve-3d",
                transform: `rotateY(${isFlipped ? 180 : 0}deg) ${transformStyle}`,
                transition: "transform 0.8s cubic-bezier(0.19, 1, 0.22, 1)"
              }}
            >
              
              {/* FRONT SIDE */}
              <div 
                className={cn(
                  "absolute inset-0 w-full h-full rounded-[2.2rem] border bg-gradient-to-br p-6 flex flex-col justify-between overflow-hidden shadow-2xl transition-all duration-500",
                  theme.border
                )}
                style={{
                  background: `linear-gradient(135deg, rgba(14, 15, 17, 0.98) 0%, rgba(3, 4, 5, 1) 100%)`,
                  boxShadow: `0 0 40px -15px ${theme.color}35, 0 20px 40px -15px rgba(0,0,0,0.8), inset 0 1px 1px rgba(255,255,255,0.05)`,
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden"
                }}
              >
                <div 
                  className="absolute inset-0 opacity-[0.03] pointer-events-none"
                  style={{
                    backgroundImage: `radial-gradient(circle, ${theme.color} 1px, transparent 1px)`,
                    backgroundSize: "16px 16px"
                  }}
                />
                
                <div 
                  className="absolute -top-1/4 -right-1/4 w-80 h-80 rounded-full blur-[90px] pointer-events-none opacity-30 transition-transform duration-500 group-hover:scale-110"
                  style={{ backgroundColor: theme.color }}
                />
                <div 
                  className="absolute -bottom-1/4 -left-1/4 w-60 h-60 rounded-full blur-[80px] pointer-events-none opacity-10"
                  style={{ backgroundColor: theme.color }}
                />
 
                <div className="absolute inset-0 pointer-events-none transition-opacity duration-300 group-hover:opacity-100" style={{ background: shineStyle }} />
                <div className="absolute top-0 bottom-0 left-3 w-[1px] bg-gradient-to-b from-transparent via-white/5 to-transparent pointer-events-none" />
 
                {/* Front Header */}
                <div className="flex justify-between items-start relative z-10">
                  <div className="flex items-center gap-2">
                    <Image 
                      src="/assets/bucc-logo.svg"
                      alt="BUCC Logo"
                      width={85}
                      height={29}
                      className="h-6 w-auto dark:invert dark:hue-rotate-180 drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]"
                    />
                    <span className="text-[8px] tracking-[0.25em] text-zinc-500 font-bold uppercase mt-1 pl-1">Portal</span>
                  </div>
 
                  {/* Smart Card EMV Chip */}
                  <div className={cn("w-9 h-7 rounded-md bg-gradient-to-br p-[1px] relative overflow-hidden shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] shrink-0 mt-0.5", theme.chip)}>
                    <div className={cn("w-full h-full border rounded-sm relative flex flex-col justify-between p-1", theme.chipBorder)}>
                      <div className={cn("w-full h-[1px] top-[50%] absolute left-0", theme.chipBorder)} />
                      <div className={cn("h-full w-[1px] left-[50%] absolute top-0", theme.chipBorder)} />
                      <div className="w-3 h-2 border border-zinc-700/20 rounded-sm mx-auto z-10 bg-white/5" />
                    </div>
                  </div>
                </div>
 
                {/* Front Profile Avatar & Titles */}
                <div className="flex flex-col items-center justify-center text-center space-y-4 my-auto relative z-10 pt-4">
                  {/* Profile Avatar Ring with pulsing glows */}
                  <div className="relative">
                    <div 
                      className="absolute inset-0 rounded-full blur-md opacity-40 animate-pulse scale-105"
                      style={{ backgroundColor: theme.color }}
                    />
                    <div 
                      className="h-28 w-28 rounded-full p-[3px] overflow-hidden bg-gradient-to-tr flex items-center justify-center shadow-lg relative z-10"
                      style={{
                        backgroundImage: theme.avatarRing
                      }}
                    >
                      <div className="h-full w-full rounded-full border border-zinc-950 bg-zinc-950 overflow-hidden relative flex items-center justify-center">
                        {user.image ? (
                          <Image 
                            src={user.image} 
                            alt={user.name} 
                            fill 
                            sizes="112px"
                            className="object-cover"
                          />
                        ) : (
                          <UserIcon className="w-12 h-12 text-zinc-600" />
                        )}
                      </div>
                    </div>
                  </div>
 
                  <div className="space-y-2.5 flex flex-col items-center">
                    <h2 className="font-serif text-3xl font-bold tracking-tight text-white leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
                      {user.name}
                    </h2>
                    
                    {/* Designation badge */}
                    <span className={cn(
                      "inline-flex items-center text-xs font-bold uppercase tracking-wider px-3.5 py-1 rounded-full border bg-zinc-950/60 backdrop-blur-md relative overflow-hidden",
                      theme.badge
                    )}>
                      <div className="absolute inset-0 designation-shimmer-layer pointer-events-none" />
                      <span className="relative z-10">{user.designation || "General Member"}</span>
                    </span>
 
                    {/* Department Label on Front */}
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 pl-[0.2em] mt-1 drop-shadow-sm">
                      {user.buccDepartment || "Unassigned"}
                    </span>
                  </div>
                </div>
 
                {/* Front Footer: Club ID & Verification QR Seal */}
                <div className="flex justify-between items-end pt-4 border-t border-zinc-800/40 relative z-10">
                  <div className="text-left space-y-1">
                    <span className="text-[9px] tracking-[0.25em] text-zinc-500 font-bold uppercase block">Club Identifier</span>
                    <span className="font-mono text-sm font-bold text-zinc-100 tracking-wider block">
                      {buccId}
                    </span>
                  </div>
                  
                  {/* Verification QR Seal (Interactive Hologram-like Button) */}
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsQrModalOpen(true);
                    }}
                    className="bg-white p-1 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.3)] border border-zinc-800/20 w-16 h-16 shrink-0 relative group/qr overflow-hidden hover:scale-105 active:scale-95 transition-all duration-200"
                    title="Click to Enlarge QR Code"
                  >
                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-transparent pointer-events-none" />
                    {verificationUrl ? (
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(verificationUrl)}`}
                        alt="Verification QR"
                        className="w-full h-full object-contain mix-blend-multiply"
                      />
                    ) : (
                      <div className="w-full h-full bg-zinc-100 animate-pulse" />
                    )}
                  </button>
                </div>
              </div>
              
              {/* BACK SIDE */}
              <div 
                className={cn(
                  "absolute inset-0 w-full h-full rounded-[2.2rem] border bg-gradient-to-br p-6 flex flex-col justify-between overflow-hidden shadow-2xl transition-all duration-500",
                  theme.border
                )}
                style={{
                  background: `linear-gradient(135deg, rgba(13, 14, 15, 0.98) 0%, rgba(3, 4, 5, 1) 100%)`,
                  boxShadow: `0 0 40px -15px ${theme.color}15, 0 20px 40px -15px rgba(0,0,0,0.8), inset 0 1px 1px rgba(255,255,255,0.05)`,
                  transform: "rotateY(180deg)",
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden"
                }}
              >
                <div className="absolute inset-0 pointer-events-none transition-opacity duration-300 group-hover:opacity-100" style={{ background: shineStyle }} />
                <div className="w-full h-11 bg-zinc-950 border-y border-zinc-900 absolute left-0 top-8" />
 
                <div className="w-full mt-16 relative z-10">
                  <span className="text-[9px] tracking-[0.2em] text-zinc-500 font-bold uppercase block text-left mb-1 pl-1">Authorized Signature</span>
                  <div className="w-full h-10 bg-zinc-800/80 border border-zinc-700/40 rounded-lg flex items-center px-3 relative overflow-hidden">
                    <span className="font-serif italic text-zinc-400 text-sm tracking-wide select-none drop-shadow-sm">
                      {user.name}
                    </span>
                    <div className="absolute top-0 bottom-0 right-4 w-12 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12" />
                  </div>
                </div>
 
                <div className="flex-1 py-4 flex flex-col justify-center gap-4 text-left relative z-10">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-0.5">
                      <span className="text-[9px] tracking-[0.2em] text-zinc-500 font-bold uppercase block">Student ID</span>
                      <span className="font-mono text-sm font-semibold text-zinc-200 block">{user.studentId || "N/A"}</span>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[9px] tracking-[0.2em] text-zinc-500 font-bold uppercase block">Department</span>
                      <span className="text-sm font-light text-zinc-300 block truncate">{user.buccDepartment || "Unassigned"}</span>
                    </div>
                  </div>
 
                  <div className="space-y-0.5">
                    <span className="text-[9px] tracking-[0.2em] text-zinc-500 font-bold uppercase block">Official Email</span>
                    <span className="text-sm font-light text-zinc-300 block truncate">{user.email}</span>
                  </div>
                  
                  <div className="space-y-0.5">
                    <span className="text-[9px] tracking-[0.2em] text-zinc-500 font-bold uppercase block">Verification Seal</span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
                      <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">{user.memberStatus || "Active"} Member</span>
                    </div>
                  </div>
                </div>
 
                <div className="flex flex-col items-center gap-1 relative z-10 pb-1">
                  <div className="h-7 w-40 bg-zinc-200 p-1 flex items-center justify-between rounded-sm shadow-inner opacity-90">
                    {[1,2,1,3,1,2,4,1,2,3,1,2,1,4,2,1,3,2,1,2,3,1,4,1].map((w, idx) => (
                      <div key={idx} className="bg-black h-full" style={{ width: `${w}px` }} />
                    ))}
                  </div>
                  <span className="font-mono text-[8px] text-zinc-500 uppercase tracking-widest mt-0.5">
                    {buccId}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center text-[9px] tracking-[0.25em] text-zinc-500 font-bold mt-4 animate-pulse uppercase flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-zinc-600" />
            Click Card to Flip
          </div>
        </div>
      ) : (
        /* CLASSIC FLAT CARD - spans full parent width */
        <div key="classic-card" className="border border-border p-8 rounded-lg bg-card shadow-sm w-full relative overflow-hidden text-left animate-in fade-in zoom-in-98 duration-300">
          {/* Decorative Ring Background */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full pointer-events-none" />
 
          <div className="flex flex-col justify-between items-start border-b border-border pb-6 mb-6 relative z-10 gap-6">
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
              <div className="h-24 w-24 rounded-full border-2 border-border overflow-hidden bg-muted flex-shrink-0 relative">
                {user.image ? (
                  <Image 
                    src={user.image} 
                    alt={user.name} 
                    fill 
                    sizes="96px"
                    className="object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center">
                    <UserIcon className="w-10 h-10 text-muted-foreground/30" />
                  </div>
                )}
              </div>
              <div>
                <h2 className="font-serif text-3xl font-bold text-foreground tracking-tight leading-tight">{user.name}</h2>
                <p className="text-muted-foreground text-lg mt-1">{user.designation || "General Member"}</p>
              </div>
            </div>
            <div className="text-left shrink-0 bg-background/80 p-3 rounded-md border border-border w-full sm:w-auto">
              <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium">Student ID</p>
              <p className="font-mono text-lg font-bold text-foreground mt-0.5">{user.studentId || "N/A"}</p>
            </div>
          </div>
          
          <div className="flex flex-col gap-6 text-sm relative z-10">
            <div className="space-y-1">
              <span className="text-muted-foreground block text-xs uppercase tracking-wider font-medium">Email Address</span>
              <span className="font-medium text-foreground block">{user.email}</span>
            </div>
            <div className="space-y-1">
              <span className="text-muted-foreground block text-xs uppercase tracking-wider font-medium">Department</span>
              <span className="font-medium text-foreground block">{user.buccDepartment || "Unassigned"}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-border/50">
              <div className="space-y-1">
                <span className="text-muted-foreground block text-xs uppercase tracking-wider font-medium">Status</span>
                <span className="inline-flex items-center gap-2 font-medium text-foreground">
                  <span className={`w-2.5 h-2.5 rounded-full ${user.memberStatus?.toLowerCase() === 'active' ? 'bg-green-500 animate-pulse' : 'bg-destructive'}`}></span>
                  {user.memberStatus || "Active"}
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground block text-xs uppercase tracking-wider font-medium">Club ID</span>
                <span className="font-medium text-foreground block font-mono">BUCC-{new Date().getFullYear()}-{user.studentId?.slice(-4) || "0000"}</span>
              </div>
            </div>
          </div>
        </div>
      )}
 
      {/* Enlarge QR Code Dialog */}
      <Dialog open={isQrModalOpen} onOpenChange={setIsQrModalOpen}>
        <DialogContent className="sm:max-w-md bg-zinc-950 border border-zinc-800 text-white rounded-[2.5rem] p-6 flex flex-col items-center text-center space-y-6">
          <DialogHeader className="space-y-2">
            <DialogTitle className="font-serif text-2xl text-white tracking-tight flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary animate-pulse" /> Verify BUCC Membership
            </DialogTitle>
            <DialogDescription className="text-zinc-400 text-sm font-light">
              Scan this QR code with any camera or scanner app to verify the active credentials of <span className="text-primary font-medium">{user.name}</span>.
            </DialogDescription>
          </DialogHeader>
          
          <div className="bg-white p-5 rounded-3xl shadow-2xl border border-zinc-200/10 w-64 h-64 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-sky-500/10 to-transparent pointer-events-none" />
            {verificationUrl ? (
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(verificationUrl)}`}
                alt="Large Verification QR"
                className="w-full h-full object-contain mix-blend-multiply"
              />
            ) : (
              <div className="w-full h-full bg-zinc-100 animate-pulse" />
            )}
          </div>
          
          <div className="space-y-1.5 text-[11px] text-zinc-500 font-light max-w-xs border-t border-zinc-800/80 pt-4 w-full">
            <p className="uppercase tracking-widest text-[9px] font-bold text-zinc-600">Verification URL</p>
            <a 
              href={verificationUrl}
              target="_blank"
              rel="noreferrer"
              className="font-mono text-primary hover:text-primary/80 transition-colors underline break-all block mt-0.5"
            >
              {verificationUrl}
            </a>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
