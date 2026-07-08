"use client";
 
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { 
  User, Mail, Hash, Phone, Building2, Calendar, 
  Sparkles, ChevronRight, Lock, Eye, EyeOff, ShieldAlert,
  ArrowLeft, Users, Briefcase, GraduationCap, BellRing, PartyPopper
} from "lucide-react";
import BRACUDepartments from "@/constants/BRACUDepartments";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import confettiLottie from "@/lottie/confetti.json";
 
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });
 
const BUCC_DEPARTMENTS = [
  "Communication and Marketing",
  "Creative",
  "Event Management",
  "Finance",
  "Human Resources",
  "Press Release and Publications",
  "Research and Development"
];
 
export default function MemberRegistration() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [noGSuite, setNoGSuite] = useState(false);
  const [activeConfetti, setActiveConfetti] = useState<{id: number, x: string, y: string}[]>([]);
 
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    studentId: "",
    phoneNumber: "",
    bracuDepartment: "",
    memberStatus: "Active", // "Active" | "Alumni"
    buccDepartment: "",
    designation: "",
    joinedBucc: "",
    joinedBracu: "",
  });
 
  useEffect(() => {
    if (isSuccess) {
      // Initial staggered bursts
      const initialPoints = [
        { x: "50%", y: "45%" },
        { x: "25%", y: "30%" },
        { x: "75%", y: "60%" },
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
 
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Reset subordinate fields if parent switches
    if (name === "memberStatus") {
      setFormData(prev => ({
        ...prev,
        memberStatus: value,
        buccDepartment: "",
        designation: "",
      }));
      setNoGSuite(false); // Reset G-Suite checkbox on status toggle
      return;
    }
 
    if (name === "buccDepartment") {
      setFormData(prev => ({
        ...prev,
        buccDepartment: value,
        designation: "",
      }));
      return;
    }
 
    setFormData(prev => ({ ...prev, [name]: value }));
  };
 
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
 
    // Validation Checks
    if (!formData.name.trim()) {
      toast.error("Please enter your name.");
      return;
    }
 
    const isGSuiteRequired = formData.memberStatus === "Active" || !noGSuite;
    if (isGSuiteRequired) {
      if (!formData.email.match(/^[a-zA-Z0-9._%+-]+@(g\.)?bracu\.ac\.bd$/)) {
        toast.error("Please use a valid BRACU G-Suite email address.");
        return;
      }
    } else {
      if (!formData.email.match(/^\S+@\S+\.\S+$/)) {
        toast.error("Please enter a valid personal email address.");
        return;
      }
    }
 
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }
 
    if (!formData.studentId.match(/^(?:[0-9]{8}|[0-9]{10})$/)) {
      toast.error("Please enter a valid 8 or 10 digit Student ID.");
      return;
    }
 
    if (!formData.phoneNumber.trim()) {
      toast.error("Please enter your phone number.");
      return;
    }
 
    if (!formData.bracuDepartment) {
      toast.error("Please select your BRACU academic department.");
      return;
    }
 
    if (!formData.buccDepartment) {
      toast.error("Please select your BUCC department.");
      return;
    }
 
    if (!formData.designation) {
      toast.error("Please select your BUCC designation.");
      return;
    }
 
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/member-registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
 
      const data = await response.json();
 
      if (!response.ok) {
        toast.error(data.message || "Registration submission failed");
      } else {
        toast.success("Registration request submitted successfully!");
        setIsSuccess(true);
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };
 
  const isAlumniSelected = formData.memberStatus === "Alumni";
 
  // Dynamic department options based on status
  const departmentOptions = isAlumniSelected 
    ? ["Governing Body", ...BUCC_DEPARTMENTS]
    : BUCC_DEPARTMENTS;
 
  // Dynamic designation options based on status + department selection
  let designationOptions: string[] = [];
  if (isAlumniSelected) {
    if (formData.buccDepartment === "Governing Body") {
      designationOptions = ["President", "Vice President", "General Secretary", "Treasurer"];
    } else {
      designationOptions = ["Director", "Assistant Director", "Senior Executive", "Executive", "General Member"];
    }
  } else {
    designationOptions = ["Senior Executive", "Executive", "General Member"];
  }
 
  if (isSuccess) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 md:px-6 bg-background/60 backdrop-blur-sm overflow-hidden">
        {/* Continuous Confetti Bursts */}
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
                  Request Received!
                </h1>
                <p className="text-muted-foreground font-light text-base leading-relaxed">
                  Hi <span className="text-primary font-medium">{formData.name}</span>, your enrollment request was successfully submitted.
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
                    <h3 className="font-semibold text-sm text-foreground uppercase tracking-wider">Verification Steps</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {formData.memberStatus === "Alumni"
                        ? "Your Alumni request will be verified by the Governing Body or R&D Department directors."
                        : `Your profile request will be checked and approved by the Director or Assistant Director of the ${formData.buccDepartment} department.`
                      }
                    </p>
                  </div>
                </div>
 
                <div className="flex items-start gap-4 p-5 rounded-2xl bg-primary/5 border border-primary/10">
                  <div className="bg-primary/10 p-2.5 rounded-lg shrink-0">
                    <ShieldAlert className="h-5 w-5 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-sm text-foreground uppercase tracking-wider">Account Security</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Once approved, you will be registered in our database and can immediately sign in using your credentials.
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
    <div className="min-h-screen bg-background relative flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden selection:bg-primary/20">
      <div className="w-full max-w-4xl bg-card border border-border shadow-[0_24px_48px_-12px_rgba(0,0,0,0.06)] rounded-3xl p-6 sm:p-8 md:p-10 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 relative z-10">
        
        {/* Header Block */}
        <div className="space-y-2 border-b border-border pb-6">
          <div className="flex justify-between items-center">
            <Link href="/login" className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-all text-xs font-light">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Log In
            </Link>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-medium bg-primary/10 text-primary border border-primary/20">
              <Users className="h-3 w-3" /> Member Portal enrollment
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-serif text-foreground mt-2">Verify & Enroll Account.</h2>
          <p className="text-muted-foreground font-light text-sm max-w-lg">
            This panel registers accounts only for existing BUCC members or alumni. Fill in your details below to stage your account activation.
          </p>
        </div>
 
        <form onSubmit={onSubmit} className="space-y-8">
          {/* Dual-Column Layout on larger screens */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            
            {/* Left Column: Academic Credentials */}
            <div className="space-y-5">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-primary border-b border-border/40 pb-1.5 w-fit">
                Academic Credentials
              </h3>
 
              {/* Full Name */}
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
                  placeholder="e.g. Nafis Sadique"
                  className="w-full bg-muted/20 border-b border-transparent rounded-t-md px-3 py-2.5 focus:outline-none focus:border-primary focus:bg-muted/40 transition-all text-base font-light"
                />
              </div>
 
              {/* Student ID */}
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
 
              {/* Phone Number */}
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
 
              {/* Email Address */}
              <div className="space-y-1.5 group">
                <label htmlFor="email" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2 group-focus-within:text-primary transition-colors">
                  <Mail className="h-3 w-3" /> {isAlumniSelected && noGSuite ? "Personal Email" : "G-Suite Email"}
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={isAlumniSelected && noGSuite ? "name@gmail.com" : "name@g.bracu.ac.bd"}
                  className="w-full bg-muted/20 border-b border-transparent rounded-t-md px-3 py-2.5 focus:outline-none focus:border-primary focus:bg-muted/40 transition-all text-base font-light"
                />
              </div>
 
              {/* Password */}
              <div className="space-y-1.5 group">
                <label htmlFor="password" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2 group-focus-within:text-primary transition-colors">
                  <Lock className="h-3 w-3" /> Password
                </label>
                <div className="relative w-full">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Min 6 characters"
                    className="w-full bg-muted/20 border-b border-transparent rounded-t-md pl-3 pr-10 py-2.5 focus:outline-none focus:border-primary focus:bg-muted/40 transition-all text-base font-light"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
 
              {/* Academic Department */}
              <div className="space-y-1.5 group">
                <label htmlFor="bracuDepartment" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2 group-focus-within:text-primary transition-colors">
                  <GraduationCap className="h-3 w-3" /> Academic Dept
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
            </div>
 
            {/* Right Column: BUCC Membership details */}
            <div className="space-y-5">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-primary border-b border-border/40 pb-1.5 w-fit">
                BUCC Club Profile
              </h3>
 
              {/* Membership Status Select Cards */}
              <div className="space-y-2 group">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2 group-focus-within:text-primary transition-colors">
                  <Users className="h-3 w-3" /> Membership Status
                </label>
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Current Member */}
                  <label className={cn(
                    "flex-1 flex flex-col items-center justify-center p-3 border rounded-xl cursor-pointer transition-all duration-300 text-center space-y-1 group/card",
                    formData.memberStatus === "Active"
                      ? "border-primary bg-primary/5 text-foreground"
                      : "border-border/50 bg-muted/25 text-muted-foreground hover:bg-muted/30"
                  )}>
                    <input
                      type="radio"
                      name="memberStatus"
                      value="Active"
                      checked={formData.memberStatus === "Active"}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <Users className={cn("h-5 w-5 transition-transform group-hover/card:scale-105", formData.memberStatus === "Active" ? "text-primary" : "text-muted-foreground")} />
                    <div>
                      <span className="text-xs font-semibold block">Current Member</span>
                      <span className="text-[9px] font-light opacity-80 block mt-0.5">Serving in BUCC</span>
                    </div>
                  </label>
                  
                  {/* Alumni */}
                  <label className={cn(
                    "flex-1 flex flex-col items-center justify-center p-3 border rounded-xl cursor-pointer transition-all duration-300 text-center space-y-1 group/card",
                    formData.memberStatus === "Alumni"
                      ? "border-primary bg-primary/5 text-foreground"
                      : "border-border/50 bg-muted/25 text-muted-foreground hover:bg-muted/30"
                  )}>
                    <input
                      type="radio"
                      name="memberStatus"
                      value="Alumni"
                      checked={formData.memberStatus === "Alumni"}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <GraduationCap className={cn("h-5 w-5 transition-transform group-hover/card:scale-105", formData.memberStatus === "Alumni" ? "text-primary" : "text-muted-foreground")} />
                    <div>
                      <span className="text-xs font-semibold block">Alumni</span>
                      <span className="text-[9px] font-light opacity-80 block mt-0.5">Left active duties</span>
                    </div>
                  </label>
                </div>
              </div>
 
              {/* Alumni-specific G-Suite access checkbox */}
              {isAlumniSelected && (
                <div className="px-1 animate-in fade-in duration-200">
                  <label className="flex items-center gap-2.5 cursor-pointer select-none text-xs font-light text-muted-foreground hover:text-foreground transition-colors">
                    <input
                      type="checkbox"
                      checked={noGSuite}
                      onChange={(e) => {
                        setNoGSuite(e.target.checked);
                        setFormData(prev => ({ ...prev, email: "" })); 
                      }}
                      className="accent-primary h-4 w-4 rounded border-border"
                    />
                    I don't have access to G-Suite email (Use personal email)
                  </label>
                </div>
              )}
 
              {/* Assigned BUCC Department */}
              <div className="space-y-1.5 group">
                <label htmlFor="buccDepartment" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2 group-focus-within:text-primary transition-colors">
                  <Building2 className="h-3 w-3" /> Assigned BUCC Dept
                </label>
                <select
                  id="buccDepartment"
                  name="buccDepartment"
                  value={formData.buccDepartment}
                  onChange={handleChange}
                  className="w-full bg-muted/20 border-b border-transparent rounded-t-md px-3 py-2.5 focus:outline-none focus:border-primary focus:bg-muted/40 transition-all text-sm appearance-none cursor-pointer font-light"
                >
                  <option value="" disabled className="bg-background text-foreground">Select Dept</option>
                  {departmentOptions.map((dept) => (
                    <option key={dept} value={dept} className="bg-background text-foreground">{dept}</option>
                  ))}
                </select>
              </div>
 
              {/* Position / Role Designation */}
              <div className="space-y-1.5 group">
                <label htmlFor="designation" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2 group-focus-within:text-primary transition-colors">
                  <Briefcase className="h-3 w-3" /> Assigned Position
                </label>
                <select
                  id="designation"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  className="w-full bg-muted/20 border-b border-transparent rounded-t-md px-3 py-2.5 focus:outline-none focus:border-primary focus:bg-muted/40 transition-all text-sm appearance-none cursor-pointer font-light"
                >
                  <option value="" disabled className="bg-background text-foreground">Select Role</option>
                  {designationOptions.map((des) => (
                    <option key={des} value={des} className="bg-background text-foreground">{des}</option>
                  ))}
                </select>
              </div>
 
              {/* Joined BRACU Semester */}
              <div className="space-y-1.5 group">
                <label htmlFor="joinedBracu" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2 group-focus-within:text-primary transition-colors">
                  <Calendar className="h-3 w-3" /> Joined BRACU Semester
                </label>
                <input
                  id="joinedBracu"
                  name="joinedBracu"
                  value={formData.joinedBracu}
                  onChange={handleChange}
                  placeholder="e.g. Spring 2021"
                  className="w-full bg-muted/20 border-b border-transparent rounded-t-md px-3 py-2.5 focus:outline-none focus:border-primary focus:bg-muted/40 transition-all text-base font-light"
                />
              </div>
 
              {/* Optional Joined BUCC Semester */}
              <div className="space-y-1.5 group">
                <label htmlFor="joinedBucc" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2 group-focus-within:text-primary transition-colors">
                  <Calendar className="h-3 w-3" /> Joined BUCC Semester
                </label>
                <input
                  id="joinedBucc"
                  name="joinedBucc"
                  value={formData.joinedBucc}
                  onChange={handleChange}
                  placeholder="e.g. Fall 2021"
                  className="w-full bg-muted/20 border-b border-transparent rounded-t-md px-3 py-2.5 focus:outline-none focus:border-primary focus:bg-muted/40 transition-all text-base font-light"
                />
              </div>
            </div>
          </div>
 
          {/* Submit & Redirects - Full Width below */}
          <div className="pt-6 border-t border-border space-y-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="group w-full bg-foreground text-background py-4 rounded-lg font-medium transition-all hover:bg-foreground/90 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 overflow-hidden relative"
            >
              <span className="relative z-10">{isSubmitting ? "Processing..." : "Complete Enrollment"}</span>
              {!isSubmitting && <ChevronRight className="h-4 w-4 relative z-10 transition-transform group-hover:translate-x-1" />}
              <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </button>
 
            <div className="text-center">
              <p className="text-xs text-muted-foreground font-light">
                Already enrolled?{" "}
                <Link href="/login" className="text-foreground hover:text-primary underline-offset-4 decoration-border/50 hover:decoration-primary font-medium transition-all underline">
                  Sign in to your dashboard
                </Link>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
