"use client";
 
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { 
  User, Mail, Hash, Phone, Building2, Calendar, 
  Sparkles, ChevronRight, Lock, Eye, EyeOff, ShieldAlert,
  ArrowLeft, Users, Briefcase
} from "lucide-react";
import BRACUDepartments from "@/constants/BRACUDepartments";
 
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
      <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-background/80 backdrop-blur-sm overflow-hidden">
        <div className="w-full max-w-xl bg-card border border-border shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] rounded-3xl p-6 sm:p-8 md:p-12 text-center space-y-6 animate-in fade-in zoom-in duration-500">
          <div className="mx-auto h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Sparkles className="h-8 w-8 text-primary animate-pulse" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-serif text-foreground leading-tight">
              Registration Queued!
            </h1>
            <p className="text-muted-foreground font-light text-sm max-w-md mx-auto leading-relaxed">
              Hey <span className="text-foreground font-semibold">{formData.name}</span>, your member account request is submitted. Reviewers will check your credentials before account activation.
            </p>
          </div>
          
          <div className="p-4 rounded-xl bg-muted/60 border border-border/40 text-left flex items-start gap-3 text-xs leading-relaxed max-w-md mx-auto">
            <ShieldAlert className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-foreground">Next Review Steps</h4>
              <p className="text-muted-foreground mt-1">
                {formData.memberStatus === "Alumni" 
                  ? "Your Alumni profile request will be reviewed by the Governing Body or R&D Department directors."
                  : `Your Current Member request will be reviewed by the Director or Assistant Director of the ${formData.buccDepartment} department.`
                }
              </p>
            </div>
          </div>
 
          <div className="pt-2 max-w-xs mx-auto">
            <Link 
              href="/"
              className="flex items-center justify-center w-full bg-primary text-primary-foreground py-3 rounded-lg font-medium transition-all hover:bg-primary/95"
            >
              Return to Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }
 
  return (
    <div className="min-h-screen bg-background relative flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background neon ambient glows (using radial-gradient to prevent GPU blur pixelation on mobile screens) */}
      <div 
        className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] pointer-events-none"
        style={{
          background: "radial-gradient(circle, hsla(var(--primary) / 0.05) 0%, transparent 70%)"
        }}
      />
      <div 
        className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[500px] h-[500px] pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(14, 165, 233, 0.05) 0%, transparent 70%)"
        }}
      />
 
      <div className="w-full max-w-3xl space-y-6 relative z-10">
        {/* Navigation back and badge */}
        <div className="flex justify-between items-center px-2">
          <Link href="/login" className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-all text-xs font-light">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Log In
          </Link>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-primary/10 text-primary border border-primary/20">
            <Users className="h-3 w-3" /> Member Portal enrollment
          </span>
        </div>
 
        {/* Main Centered Enrollment Card */}
        <div className="bg-card border border-border shadow-[0_24px_48px_-12px_rgba(0,0,0,0.08)] rounded-3xl overflow-hidden p-5 sm:p-8 md:p-10 space-y-8">
          <div className="space-y-2 border-b border-border pb-6">
            <h2 className="text-3xl font-serif text-foreground">Verify & Enroll Account</h2>
            <p className="text-muted-foreground font-light text-sm max-w-lg">
              This panel registers accounts only for existing BUCC members or alumni. Fill in your details below to stage your account activation.
            </p>
          </div>
 
          <form onSubmit={onSubmit} className="space-y-8">
            {/* Group 1: Personal Credentials */}
            <div className="space-y-4">
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-primary border-b border-border/40 pb-1 w-fit">
                Account Credentials
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="name" className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5" /> Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Nafis Sadique"
                    className="w-full bg-muted/20 border border-border/40 rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-primary focus:bg-background transition-all text-sm font-light"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="studentId" className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Hash className="h-3.5 w-3.5" /> Student ID
                  </label>
                  <input
                    id="studentId"
                    name="studentId"
                    required
                    value={formData.studentId}
                    onChange={handleChange}
                    placeholder="e.g. 21101001"
                    className="w-full bg-muted/20 border border-border/40 rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-primary focus:bg-background transition-all text-sm font-mono font-light"
                  />
                </div>
              </div>
 
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5 relative">
                  <label htmlFor="email" className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                    <span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" /> {isAlumniSelected && noGSuite ? "Personal Email" : "G-Suite Email"}</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={isAlumniSelected && noGSuite ? "name@gmail.com" : "name@g.bracu.ac.bd"}
                    className="w-full bg-muted/20 border border-border/40 rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-primary focus:bg-background transition-all text-sm font-light"
                  />
                </div>
                <div className="space-y-1.5 relative">
                  <label htmlFor="password" className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Lock className="h-3.5 w-3.5" /> Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Min 6 characters"
                      className="w-full bg-muted/20 border border-border/40 rounded-lg pl-3.5 pr-10 py-2.5 focus:outline-none focus:border-primary focus:bg-background transition-all text-sm font-light"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>
 
              {/* Alumni-specific G-Suite access checkbox */}
              {isAlumniSelected && (
                <div className="px-1 animate-in fade-in duration-200">
                  <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-light text-muted-foreground hover:text-foreground transition-colors">
                    <input
                      type="checkbox"
                      checked={noGSuite}
                      onChange={(e) => {
                        setNoGSuite(e.target.checked);
                        setFormData(prev => ({ ...prev, email: "" })); // Clear email to avoid validation confusion
                      }}
                      className="accent-primary h-3.5 w-3.5 rounded border-border"
                    />
                    I don't have access to my G-Suite student email (Use personal email for registration)
                  </label>
                </div>
              )}
 
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="phoneNumber" className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5" /> Phone Number
                  </label>
                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    required
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="e.g. 017XXXXXXXX"
                    className="w-full bg-muted/20 border border-border/40 rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-primary focus:bg-background transition-all text-sm font-light"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="bracuDepartment" className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Building2 className="h-3.5 w-3.5" /> Academic Department
                  </label>
                  <select
                    id="bracuDepartment"
                    name="bracuDepartment"
                    required
                    value={formData.bracuDepartment}
                    onChange={handleChange}
                    className="w-full bg-muted/20 border border-border/40 rounded-lg px-3 py-2.5 focus:outline-none focus:border-primary focus:bg-background transition-all text-sm cursor-pointer font-light"
                  >
                    <option value="" disabled>Select Department</option>
                    {BRACUDepartments.map(dept => (
                      <option key={dept.name} value={dept.name}>{dept.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
 
            {/* Group 2: BUCC Membership profile details */}
            <div className="space-y-5 pt-6 border-t border-border">
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-primary border-b border-border/40 pb-1 w-fit">
                BUCC Club Profile
              </h3>
 
              {/* Member Status Radio buttons */}
              <div className="space-y-2">
                <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Membership Status</label>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <label className="flex items-center gap-2 bg-muted/5 border border-border/60 rounded-xl px-4 py-3 cursor-pointer hover:bg-muted/15 transition-all w-full sm:w-1/2">
                    <input
                      type="radio"
                      name="memberStatus"
                      value="Active"
                      checked={formData.memberStatus === "Active"}
                      onChange={handleChange}
                      className="accent-primary h-4 w-4"
                    />
                    <span className="text-sm font-light text-foreground">Current Member</span>
                  </label>
                  <label className="flex items-center gap-2 bg-muted/5 border border-border/60 rounded-xl px-4 py-3 cursor-pointer hover:bg-muted/15 transition-all w-full sm:w-1/2">
                    <input
                      type="radio"
                      name="memberStatus"
                      value="Alumni"
                      checked={formData.memberStatus === "Alumni"}
                      onChange={handleChange}
                      className="accent-primary h-4 w-4"
                    />
                    <span className="text-sm font-light text-foreground">Alumni</span>
                  </label>
                </div>
              </div>
 
              {/* Department Dropdown (Governing Body included only if Alumni is selected) */}
              <div className="space-y-1.5 animate-in fade-in duration-200">
                <label htmlFor="buccDepartment" className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5" /> Assigned BUCC Department
                </label>
                <select
                  id="buccDepartment"
                  name="buccDepartment"
                  required
                  value={formData.buccDepartment}
                  onChange={handleChange}
                  className="w-full bg-muted/20 border border-border/40 rounded-lg px-3 py-2.5 focus:outline-none focus:border-primary focus:bg-background transition-all text-sm cursor-pointer font-light"
                >
                  <option value="" disabled>Select BUCC Department</option>
                  {departmentOptions.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
 
              {/* Designation Selector */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="designation" className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Briefcase className="h-3.5 w-3.5" /> Assigned Position / Role
                  </label>
                  <select
                    id="designation"
                    name="designation"
                    required
                    value={formData.designation}
                    onChange={handleChange}
                    className="w-full bg-muted/20 border border-border/40 rounded-lg px-3 py-2.5 focus:outline-none focus:border-primary focus:bg-background transition-all text-sm cursor-pointer font-light"
                  >
                    <option value="" disabled>Select Designation</option>
                    {designationOptions.map(des => (
                      <option key={des} value={des}>{des}</option>
                    ))}
                  </select>
                </div>
 
                {/* Joined BRACU */}
                <div className="space-y-1.5">
                  <label htmlFor="joinedBracu" className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" /> Joined BRACU Semester
                  </label>
                  <input
                    id="joinedBracu"
                    name="joinedBracu"
                    value={formData.joinedBracu}
                    onChange={handleChange}
                    placeholder="e.g. Spring 2021"
                    className="w-full bg-muted/20 border border-border/40 rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-primary focus:bg-background transition-all text-sm font-light"
                  />
                </div>
              </div>
 
              {/* Optional Joined BUCC */}
              <div className="space-y-1.5 animate-in fade-in duration-200">
                <label htmlFor="joinedBucc" className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" /> Joined BUCC Semester
                </label>
                <input
                  id="joinedBucc"
                  name="joinedBucc"
                  value={formData.joinedBucc}
                  onChange={handleChange}
                  placeholder="e.g. Fall 2021"
                  className="w-full bg-muted/20 border border-border/40 rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-primary focus:bg-background transition-all text-sm font-light"
                />
              </div>
            </div>
 
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary text-primary-foreground py-3.5 rounded-xl font-medium transition-all hover:bg-primary/95 disabled:opacity-50 flex items-center justify-center gap-2 text-base shadow-sm hover:shadow active:scale-[0.99]"
            >
              {isSubmitting ? "Submitting Registration..." : "Submit Registration Request"}
              <ChevronRight className="h-4 w-4" />
            </button>
 
            <div className="text-center text-xs font-light text-muted-foreground">
              Already enrolled? <Link href="/login" className="text-primary font-medium hover:underline">Log in here</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
