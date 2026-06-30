"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { BRACUDepartments } from "@/constants/BRACUDepartments";
import { departmentsInfo } from "@/constants/departments";
import SpinnerComponent from "@/components/SpinnerComponent";
import IntakeInactive from "@/components/IntakeInactive";
import { User, Mail, Hash, Phone, Building2, Calendar, Sparkles, ChevronRight, GraduationCap, PartyPopper, BellRing } from "lucide-react";
import dynamic from "next/dynamic";
import confettiLottie from "@/lottie/confetti.json";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export default function Registration() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    studentId: "",
    phoneNumber: "",
    bracuDepartment: "",
    buccDepartment: "",
    joinedSemester: "",
    joinedYear: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [config, setConfig] = useState<any>(null);
  const [isChecking, setIsChecking] = useState(true);
  const [activeConfetti, setActiveConfetti] = useState<{id: number, x: string, y: string}[]>([]);

  useEffect(() => {
    if (isSuccess) {
      // Initial staggered bursts
      const initialPoints = [
        { x: "50%", y: "45%" }, // Center
        { x: "25%", y: "30%" }, // Random-ish 1
        { x: "75%", y: "60%" }, // Random-ish 2
      ];

      initialPoints.forEach((point, index) => {
        setTimeout(() => {
          setActiveConfetti(prev => [
            ...prev.slice(-4), 
            { id: Date.now() + index, ...point }
          ]);
        }, index * 1000);
      });

      // Continuous random loop
      const interval = setInterval(() => {
        const newBurst = {
          id: Date.now(),
          x: `${Math.random() * 70 + 15}%`,
          y: `${Math.random() * 70 + 15}%`
        };
        setActiveConfetti(prev => [...prev.slice(-4), newBurst]);
      }, 2500);

      return () => clearInterval(interval);
    }
  }, [isSuccess]);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 7 }, (_, i) => (currentYear - i).toString());
  const semesters = ["Spring", "Summer", "Fall"];

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await fetch("/api/config?key=recruitment_config");
        const data = await res.json();
        setConfig(data.value);
      } catch (err) {
        console.error(err);
      } finally {
        setIsChecking(false);
      }
    };
    checkStatus();
  }, []);

  const buccDepartments = [
    "Communication and Marketing",
    "Creative",
    "Event Management",
    "Finance",
    "Human Resources",
    "Press Release and Publications",
    "Research and Development",
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email.match(/^[a-zA-Z0-9._%+-]+@(g\.)?bracu\.ac\.bd$/)) {
      toast.error("Please use a valid BRACU G-Suite email address.");
      return;
    }

    if (!formData.studentId.match(/^(?:[0-9]{8}|[0-9]{10})$/)) {
      toast.error("Please enter a valid 8 or 10 digit Student ID.");
      return;
    }

    if (!formData.bracuDepartment) {
      toast.error("Please select your BRACU department.");
      return;
    }

    if (!formData.joinedSemester || !formData.joinedYear) {
      toast.error("Please select when you joined BRACU.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/preregister", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Registration failed");
      } else {
        toast.success("Registration successful!");
        setIsSuccess(true);
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isChecking) return <SpinnerComponent />;
  
  if (config && !config.isRegistrationOpen) {
    return (
      <IntakeInactive 
        title="Member Registration" 
        targetDate={config.registrationTargetDate} 
        message={config.registrationMessage || "BUCC Recruitment Process is not ongoing. Please check our Facebook page for updates."}
      />
    );
  }

  if (isSuccess) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 md:px-6 bg-background/60 backdrop-blur-sm overflow-hidden">
        {/* Continuous Confetti Bursts - Highest z-index to overlay everything */}
        {activeConfetti.map(conf => (
          <div 
            key={conf.id} 
            className="fixed pointer-events-none z-[120] -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] md:w-[800px] md:h-[800px]"
            style={{ left: conf.x, top: conf.y }}
          >
            <Lottie 
              animationData={confettiLottie} 
              loop={false} 
              className="w-full h-full" 
            />
          </div>
        ))}

        <div className="w-full max-w-4xl bg-background/95 backdrop-blur-xl border border-border shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] rounded-[2rem] overflow-hidden animate-in fade-in zoom-in duration-500 relative z-[105]">
          <div className="flex flex-col md:flex-row h-full">
            {/* Success Left Side - Celebration */}
            <div className="w-full md:w-2/5 p-8 md:p-12 flex flex-col items-center justify-center text-center space-y-6 bg-primary/5 border-b md:border-b-0 md:border-r border-border/50">
              <div className="relative">
                <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center animate-bounce">
                  <PartyPopper className="h-10 w-10 text-primary" />
                </div>
                <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-yellow-500 animate-pulse" />
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl md:text-4xl font-serif tracking-tight text-foreground leading-tight">
                  Welcome to the Journey!
                </h1>
                <p className="text-muted-foreground font-light text-base leading-relaxed">
                  Your journey of becoming a <span className="text-primary font-medium italic">Buccian</span> has officially begun.
                </p>
              </div>
            </div>

            {/* Success Right Side - Info & Action */}
            <div className="w-full md:w-3/5 p-8 md:p-12 flex flex-col justify-center space-y-8">
              <div className="space-y-6">
                <div className="flex items-start gap-4 p-5 rounded-2xl bg-muted/50 border border-border/50 transition-colors hover:bg-muted/70">
                  <div className="bg-primary/10 p-2.5 rounded-lg shrink-0">
                    <BellRing className="h-5 w-5 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-sm text-foreground uppercase tracking-wider">Next Steps</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Keep a close eye on your <span className="text-foreground font-medium">G-Suite email</span>. Our team will contact you shortly regarding the next phase.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 rounded-2xl bg-primary/5 border border-primary/10">
                  <div className="bg-primary/10 p-2.5 rounded-lg shrink-0">
                    <GraduationCap className="h-5 w-5 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-sm text-foreground uppercase tracking-wider">Community</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Join thousands of students making an impact through technology and leadership.
                    </p>
                  </div>
                </div>
              </div>

              <Link 
                href="/"
                className="group flex items-center justify-center w-full bg-foreground text-background py-4 rounded-xl font-medium transition-all hover:bg-foreground/90 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98]"
              >
                Take me to Homepage
                <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left Panel - Hero Section */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden p-12 flex-col justify-between">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 hover:scale-105"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=2070')",
          }}
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
        
        <div className="relative z-10 space-y-6 max-w-xl">
          <h1 className="text-5xl xl:text-6xl font-serif text-white leading-tight drop-shadow-2xl">
            The journey of a thousand <span className="text-sky-400 italic">lines of code</span> begins here.
          </h1>
          <p className="text-lg text-white/80 font-light leading-relaxed drop-shadow-md">
            Join the oldest and most prestigious tech community at BRAC University. Develop skills, build connections, and shape the future of technology together.
          </p>

          
          <div className="flex flex-wrap gap-3 pt-2">
            {["Community", "Innovation", "Development", "Leadership"].map((tag) => (
              <span key={tag} className="px-3 py-1.5 rounded-full border border-white/20 bg-white/5 text-white/90 text-xs font-medium backdrop-blur-md">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="relative z-10 pt-8 border-t border-white/10">
          <div className="flex items-center gap-4">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-10 w-10 rounded-full border-2 border-white/20 bg-muted overflow-hidden">
                   <div className="w-full h-full bg-primary/20 flex items-center justify-center text-[10px] text-white font-bold">U{i}</div>
                </div>
              ))}
            </div>
            <p className="text-white/70 text-xs font-light drop-shadow-sm">
              Join <span className="text-white font-medium">2,000+</span> students already making an impact.
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-8 xl:p-16 bg-background selection:bg-primary/20">
        <div className="w-full max-w-lg space-y-8 animate-in fade-in slide-in-from-right-8 duration-700">
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-serif text-foreground">Create your application.</h2>
            <p className="text-muted-foreground font-light text-base">
              Fill in your details to start the recruitment process.
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-6">
            {/* Personal Details Group */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5 group">
                  <label htmlFor="name" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2 group-focus-within:text-primary transition-colors">
                    <User className="h-3 w-3" /> Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="MD. Nafis Sadique"
                    className="w-full bg-muted/20 border-b border-transparent rounded-t-md px-3 py-2.5 focus:outline-none focus:border-primary focus:bg-muted/40 transition-all text-base font-light"
                  />
                </div>
                <div className="space-y-1.5 group">
                  <label htmlFor="studentId" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2 group-focus-within:text-primary transition-colors">
                    <Hash className="h-3 w-3" /> Student ID
                  </label>
                  <input
                    id="studentId"
                    name="studentId"
                    required
                    value={formData.studentId}
                    onChange={handleChange}
                    placeholder="21101001"
                    className="w-full bg-muted/20 border-b border-transparent rounded-t-md px-3 py-2.5 focus:outline-none focus:border-primary focus:bg-muted/40 transition-all text-base font-mono font-light"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5 group">
                  <label htmlFor="email" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2 group-focus-within:text-primary transition-colors">
                    <Mail className="h-3 w-3" /> G-Suite Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="nafis.sadique@g.bracu.ac.bd"
                    className="w-full bg-muted/20 border-b border-transparent rounded-t-md px-3 py-2.5 focus:outline-none focus:border-primary focus:bg-muted/40 transition-all text-base font-light"
                  />
                </div>

                <div className="space-y-1.5 group">
                  <label htmlFor="phoneNumber" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2 group-focus-within:text-primary transition-colors">
                    <Phone className="h-3 w-3" /> Phone Number
                  </label>
                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    required
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="017XXXXXXXX"
                    className="w-full bg-muted/20 border-b border-transparent rounded-t-md px-3 py-2.5 focus:outline-none focus:border-primary focus:bg-muted/40 transition-all text-base font-light"
                  />
                </div>
              </div>
            </div>

            {/* Academic Details Group */}
            <div className="space-y-4 pt-4 border-t border-border">
              <div className="space-y-2 group">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2 group-focus-within:text-primary transition-colors">
                  <Calendar className="h-3 w-3" /> Joined BRACU
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <select
                    id="joinedSemester"
                    name="joinedSemester"
                    required
                    value={formData.joinedSemester}
                    onChange={handleChange}
                    className="w-full bg-muted/20 border-b border-transparent rounded-t-md px-3 py-2.5 focus:outline-none focus:border-primary focus:bg-muted/40 transition-all text-sm appearance-none cursor-pointer font-light"
                  >
                    <option value="" disabled className="bg-background text-foreground">Semester</option>
                    {semesters.map((sem) => (
                      <option key={sem} value={sem} className="bg-background text-foreground">{sem}</option>
                    ))}
                  </select>
                  <select
                    id="joinedYear"
                    name="joinedYear"
                    required
                    value={formData.joinedYear}
                    onChange={handleChange}
                    className="w-full bg-muted/20 border-b border-transparent rounded-t-md px-3 py-2.5 focus:outline-none focus:border-primary focus:bg-muted/40 transition-all text-sm appearance-none cursor-pointer font-light"
                  >
                    <option value="" disabled className="bg-background text-foreground">Year</option>
                    {years.map((year) => (
                      <option key={year} value={year} className="bg-background text-foreground">{year}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5 group">
                  <label htmlFor="bracuDepartment" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2 group-focus-within:text-primary transition-colors">
                    <GraduationCap className="h-3 w-3" /> BRACU Dept
                  </label>
                  <select
                    id="bracuDepartment"
                    name="bracuDepartment"
                    value={formData.bracuDepartment}
                    onChange={handleChange}
                    className="w-full bg-muted/20 border-b border-transparent rounded-t-md px-3 py-2.5 focus:outline-none focus:border-primary focus:bg-muted/40 transition-all text-sm appearance-none cursor-pointer font-light"
                  >
                    <option value="" disabled className="bg-background text-foreground">Select Dept</option>
                    {BRACUDepartments.map((dept) => (
                      <option key={dept.name} value={dept.name} className="bg-background text-foreground">{dept.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5 group">
                  <label htmlFor="buccDepartment" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2 group-focus-within:text-primary transition-colors">
                    <Building2 className="h-3 w-3" /> BUCC Choice
                  </label>
                  <select
                    id="buccDepartment"
                    name="buccDepartment"
                    value={formData.buccDepartment}
                    onChange={handleChange}
                    className="w-full bg-muted/20 border-b border-transparent rounded-t-md px-3 py-2.5 focus:outline-none focus:border-primary focus:bg-muted/40 transition-all text-sm appearance-none cursor-pointer font-light"
                  >
                    <option value="" className="bg-background text-foreground">Optional</option>
                    {buccDepartments.map((dept) => (
                      <option key={dept} value={dept} className="bg-background text-foreground">{dept}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-4 space-y-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="group w-full bg-foreground text-background py-4 rounded-lg font-medium transition-all hover:bg-foreground/90 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 overflow-hidden relative"
              >
                <span className="relative z-10">{isSubmitting ? "Processing..." : "Complete Application"}</span>
                {!isSubmitting && <ChevronRight className="h-4 w-4 relative z-10 transition-transform group-hover:translate-x-1" />}
                <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </button>

              <div className="text-center">
                <p className="text-xs text-muted-foreground">
                  Already a member?{" "}
                  <Link href="/login" className="text-foreground hover:text-primary underline-offset-4 decoration-border/50 hover:decoration-primary font-medium transition-all underline">
                    Sign in to your dashboard
                  </Link>
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
