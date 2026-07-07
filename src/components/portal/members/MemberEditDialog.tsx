"use client";

import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { isSuperUser } from "@/lib/permissions";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription,
  SheetFooter
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { departmentsInfo } from "@/constants/departments";
import designations from "@/constants/designations";
import SKILLS_LIST from "@/constants/skills";
import { toast } from "sonner";
import { 
  ShieldCheck, 
  User, 
  Mail, 
  Phone, 
  Briefcase, 
  Calendar, 
  Hash, 
  Droplet, 
  HeartPulse, 
  Facebook, 
  Github, 
  Linkedin,
  Globe,
  Trash2,
  AlertTriangle
} from "lucide-react";
import MultipleSelector, { Option } from "@/components/ui/multiple-selector";

export default function MemberEditDialog({ 
  member, 
  isOpen, 
  onClose,
  onUpdate 
}: { 
  member: any, 
  isOpen: boolean, 
  onClose: () => void,
  onUpdate: () => void
}) {
  const { data: session } = authClient.useSession();
  const currentUser = session?.user as any;
  const isGB = currentUser && isSuperUser(currentUser);

  const [loading, setLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [formData, setFormData] = useState<any>(null);

  // Initialize form data when member changes
  useEffect(() => {
    if (member) {
      setFormData({
        ...member,
        personalEmail: member.personalEmail || "",
        bracuDepartment: member.bracuDepartment || "",
        image: member.image || "",
        memberSocials: member.memberSocials || { Facebook: "", Github: "", Linkedin: "" },
        memberSkills: member.memberSkills || [],
        profileSlug: member.profileSlug || "",
        isPublicProfile: member.isPublicProfile ?? false,
        bio: member.bio || "",
        currentJob: member.currentJob || "",
        cvLink: member.cvLink || "",
        coverImage: member.coverImage || "",
        experience: member.experience || "",
        recentActivity: member.recentActivity || "",
        education: member.education || "",
        achievements: member.achievements || "",
        certifications: member.certifications || "",
        twoFactorEnabled: member.twoFactorEnabled ?? false,
      });
      setDeleteConfirm(false);
    }
  }, [member]);

  if (!formData) return null;

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/member?id=${member._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success("Member updated successfully");
        onUpdate();
        onClose();
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to update member");
      }
    } catch (error) {
      toast.error("An error occurred during update");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/member?id=${member._id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Member deleted successfully");
        onUpdate();
        onClose();
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to delete member");
      }
    } catch (error) {
      toast.error("An error occurred during deletion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-2xl border-l border-border bg-background flex flex-col h-full">
        <SheetHeader className="text-left space-y-2 shrink-0">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-2xl font-serif tracking-tight">Edit Member Profile</SheetTitle>
            <Badge variant={formData.memberStatus}>{formData.memberStatus}</Badge>
          </div>
          <SheetDescription className="text-muted-foreground font-light">
            Modify all organizational, personal, and professional details for {member.name}.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto pr-4 -mr-4 mt-6">
          <div className="space-y-12 pb-10">
            
            {/* --- Section: Core Identity --- */}
            <section className="space-y-6">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary border-b border-primary/10 pb-2 flex items-center gap-2">
                <User className="w-3 h-3" /> Core Identity
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground">Full Name</Label>
                  <Input 
                    value={formData.name} 
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="bg-transparent border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary transition-colors h-9"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground">Student ID</Label>
                  <Input 
                    value={formData.studentId} 
                    onChange={(e) => setFormData({...formData, studentId: e.target.value})}
                    className="bg-transparent border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary transition-colors h-9 font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground">G-Suite Email (Locked)</Label>
                  <Input 
                    value={formData.email} 
                    readOnly
                    className="bg-transparent border-0 border-b border-border rounded-none px-0 opacity-50 cursor-not-allowed h-9"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground">University Dept</Label>
                  <Input 
                    value={formData.bracuDepartment || ""} 
                    onChange={(e) => setFormData({...formData, bracuDepartment: e.target.value})}
                    placeholder="e.g. CSE"
                    className="bg-transparent border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary transition-colors h-9"
                  />
                </div>

                <div className="space-y-1.5 col-span-full">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground">Profile Image URL</Label>
                  <Input 
                    value={formData.image || ""} 
                    onChange={(e) => setFormData({...formData, image: e.target.value})}
                    placeholder="https://cloudinary.com/..."
                    className="bg-transparent border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary transition-colors h-9"
                  />
                </div>
              </div>
            </section>

            {/* --- Section: Club Organization --- */}
            <section className="space-y-6">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary border-b border-primary/10 pb-2 flex items-center gap-2">
                <Briefcase className="w-3 h-3" /> Club Organization
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground">Designation</Label>
                  <Select 
                    value={formData.designation} 
                    onValueChange={(val) => setFormData({...formData, designation: val})}
                  >
                    <SelectTrigger className="w-full h-9 bg-transparent border-0 border-b border-border rounded-none px-0 focus:ring-0">
                      <SelectValue placeholder="Select Designation" />
                    </SelectTrigger>
                    <SelectContent>
                      {designations.map((d) => (
                        <SelectItem key={d.title} value={d.title}>{d.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground">BUCC Department</Label>
                  <Select 
                    value={formData.buccDepartment} 
                    onValueChange={(val) => setFormData({...formData, buccDepartment: val})}
                  >
                    <SelectTrigger className="w-full h-9 bg-transparent border-0 border-b border-border rounded-none px-0 focus:ring-0">
                      <SelectValue placeholder="Select Department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departmentsInfo.map((dept) => (
                        <SelectItem key={dept.name} value={dept.name}>{dept.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground">Membership Status</Label>
                  <Select 
                    value={formData.memberStatus} 
                    onValueChange={(val) => setFormData({...formData, memberStatus: val})}
                  >
                    <SelectTrigger className="w-full h-9 bg-transparent border-0 border-b border-border rounded-none px-0 focus:ring-0">
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                      <SelectItem value="Alumni">Alumni</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground">Last Promotion</Label>
                  <Input 
                    value={formData.lastPromotion || ""} 
                    onChange={(e) => setFormData({...formData, lastPromotion: e.target.value})}
                    placeholder="E.g. Fall 2025"
                    className="bg-transparent border-0 border-b border-border rounded-none px-0 h-9"
                  />
                </div>
              </div>
            </section>

            {/* --- Section: Professional Presence --- */}
            <section className="space-y-6">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary border-b border-primary/10 pb-2 flex items-center gap-2">
                <Globe className="w-3 h-3" /> Professional Presence
              </h3>
              
              <div className="space-y-6">
                <div className="space-y-1.5">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground">Member Skills</Label>
                  <MultipleSelector
                    value={formData.memberSkills.map((s: string) => ({ label: s, value: s }))}
                    onChange={(options) => setFormData({...formData, memberSkills: options.map(o => o.value)})}
                    defaultOptions={SKILLS_LIST}
                    placeholder="Select or search skills..."
                    className="bg-transparent border-0 border-b border-border rounded-none px-0 min-h-[40px]"
                    badgeClassName="bg-primary/10 text-primary border-primary/20"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-2">
                      <Facebook className="w-3 h-3" /> Facebook
                    </Label>
                    <Input 
                      value={formData.memberSocials.Facebook || ""} 
                      onChange={(e) => setFormData({
                        ...formData, 
                        memberSocials: { ...formData.memberSocials, Facebook: e.target.value }
                      })}
                      placeholder="Username/URL"
                      className="bg-transparent border-0 border-b border-border rounded-none px-0 h-9 text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-2">
                      <Github className="w-3 h-3" /> Github
                    </Label>
                    <Input 
                      value={formData.memberSocials.Github || ""} 
                      onChange={(e) => setFormData({
                        ...formData, 
                        memberSocials: { ...formData.memberSocials, Github: e.target.value }
                      })}
                      placeholder="Username/URL"
                      className="bg-transparent border-0 border-b border-border rounded-none px-0 h-9 text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-2">
                      <Linkedin className="w-3 h-3" /> LinkedIn
                    </Label>
                    <Input 
                      value={formData.memberSocials.Linkedin || ""} 
                      onChange={(e) => setFormData({
                        ...formData, 
                        memberSocials: { ...formData.memberSocials, Linkedin: e.target.value }
                      })}
                      placeholder="Username/URL"
                      className="bg-transparent border-0 border-b border-border rounded-none px-0 h-9 text-xs"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* --- Section: Personal & History --- */}
            <section className="space-y-6">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary border-b border-primary/10 pb-2 flex items-center gap-2">
                <HeartPulse className="w-3 h-3" /> Personal & History
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground">Blood Group</Label>
                  <div className="relative">
                    <Droplet className="absolute left-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/40 z-10" />
                    <Select 
                      value={formData.bloodGroup || ""} 
                      onValueChange={(val) => setFormData({...formData, bloodGroup: val})}
                    >
                      <SelectTrigger className="w-full h-9 bg-transparent border-0 border-b border-border rounded-none pl-6 px-0 focus:ring-0">
                        <SelectValue placeholder="Select Blood Group" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A+">A+</SelectItem>
                        <SelectItem value="A-">A-</SelectItem>
                        <SelectItem value="B+">B+</SelectItem>
                        <SelectItem value="B-">B-</SelectItem>
                        <SelectItem value="AB+">AB+</SelectItem>
                        <SelectItem value="AB-">AB-</SelectItem>
                        <SelectItem value="O+">O+</SelectItem>
                        <SelectItem value="O-">O-</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground">Emergency Contact</Label>
                  <div className="relative">
                    <Phone className="absolute left-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/40" />
                    <Input 
                      value={formData.emergencyContact || ""} 
                      onChange={(e) => setFormData({...formData, emergencyContact: e.target.value})}
                      className="bg-transparent border-0 border-b border-border rounded-none pl-6 px-0 h-9"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground">Birth Date</Label>
                  <Input 
                    type="date"
                    value={formData.birthDate ? new Date(formData.birthDate).toISOString().split('T')[0] : ""} 
                    onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
                    className="bg-transparent border-0 border-b border-border rounded-none px-0 h-9"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground">Gender</Label>
                  <Select 
                    value={formData.gender || ""} 
                    onValueChange={(val) => setFormData({...formData, gender: val})}
                  >
                    <SelectTrigger className="w-full h-9 bg-transparent border-0 border-b border-border rounded-none px-0 focus:ring-0">
                      <SelectValue placeholder="Select Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground">Joined BUCC (Sem)</Label>
                  <Input 
                    value={formData.joinedBucc || ""} 
                    onChange={(e) => setFormData({...formData, joinedBucc: e.target.value})}
                    className="bg-transparent border-0 border-b border-border rounded-none px-0 h-9"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground">Joined BRACU (Sem)</Label>
                  <Input 
                    value={formData.joinedBracu || ""} 
                    onChange={(e) => setFormData({...formData, joinedBracu: e.target.value})}
                    className="bg-transparent border-0 border-b border-border rounded-none px-0 h-9"
                  />
                </div>
              </div>
            </section>

            {/* --- Section: Public Profile & Bio --- */}
            <section className="space-y-6">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary border-b border-primary/10 pb-2 flex items-center gap-2">
                <Globe className="w-3 h-3" /> Public Profile & Bio
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground">Profile Slug</Label>
                  <Input 
                    value={formData.profileSlug || ""} 
                    onChange={(e) => setFormData({...formData, profileSlug: e.target.value})}
                    placeholder="e.g. johndoe"
                    className="bg-transparent border-0 border-b border-border rounded-none px-0 h-9 font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground">Public Directory Listing</Label>
                  <Select 
                    value={formData.isPublicProfile ? "true" : "false"} 
                    onValueChange={(val) => setFormData({...formData, isPublicProfile: val === "true"})}
                  >
                    <SelectTrigger className="w-full h-9 bg-transparent border-0 border-b border-border rounded-none px-0 focus:ring-0">
                      <SelectValue placeholder="Public Profile Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Public</SelectItem>
                      <SelectItem value="false">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground">Current Job / Working As</Label>
                  <Input 
                    value={formData.currentJob || ""} 
                    onChange={(e) => setFormData({...formData, currentJob: e.target.value})}
                    placeholder="e.g. SWE in Meta"
                    className="bg-transparent border-0 border-b border-border rounded-none px-0 h-9"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground">CV Link</Label>
                  <Input 
                    value={formData.cvLink || ""} 
                    onChange={(e) => setFormData({...formData, cvLink: e.target.value})}
                    placeholder="e.g. https://drive.google.com/..."
                    className="bg-transparent border-0 border-b border-border rounded-none px-0 h-9"
                  />
                </div>

                <div className="space-y-1.5 col-span-full">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground">Short Biography</Label>
                  <textarea 
                    value={formData.bio || ""} 
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    placeholder="Write a short biography..."
                    className="w-full bg-transparent border border-border rounded-md p-2 text-sm focus-visible:ring-1 focus-visible:ring-primary min-h-[80px] outline-none"
                  />
                </div>
              </div>
            </section>

            {/* --- Section: Extended Profile Content --- */}
            <section className="space-y-6">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary border-b border-primary/10 pb-2 flex items-center gap-2">
                <Briefcase className="w-3 h-3" /> Extended Profile Details
              </h3>
              
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground">Education</Label>
                  <textarea 
                    value={formData.education || ""} 
                    onChange={(e) => setFormData({...formData, education: e.target.value})}
                    className="w-full bg-transparent border border-border rounded-md p-2 text-sm min-h-[60px] outline-none focus-visible:ring-1 focus-visible:ring-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground">Work Experience</Label>
                  <textarea 
                    value={formData.experience || ""} 
                    onChange={(e) => setFormData({...formData, experience: e.target.value})}
                    className="w-full bg-transparent border border-border rounded-md p-2 text-sm min-h-[60px] outline-none focus-visible:ring-1 focus-visible:ring-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground">Achievements</Label>
                  <textarea 
                    value={formData.achievements || ""} 
                    onChange={(e) => setFormData({...formData, achievements: e.target.value})}
                    className="w-full bg-transparent border border-border rounded-md p-2 text-sm min-h-[60px] outline-none focus-visible:ring-1 focus-visible:ring-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground">Certifications</Label>
                  <textarea 
                    value={formData.certifications || ""} 
                    onChange={(e) => setFormData({...formData, certifications: e.target.value})}
                    className="w-full bg-transparent border border-border rounded-md p-2 text-sm min-h-[60px] outline-none focus-visible:ring-1 focus-visible:ring-primary"
                  />
                </div>
              </div>
            </section>

            {/* --- Section: Security & Authentication --- */}
            {isGB && (
              <section className="space-y-6">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary border-b border-primary/10 pb-2 flex items-center gap-2">
                  <ShieldCheck className="w-3 h-3" /> Security Settings
                </h3>
                <div className="flex items-center justify-between p-4 bg-muted/40 border border-border rounded-md">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-foreground">Two-Factor Authentication (2FA)</p>
                    <p className="text-[10px] text-muted-foreground font-light font-sans">
                      {formData.twoFactorEnabled 
                        ? "Currently ENABLED for this member." 
                        : "Currently DISABLED/Not configured."}
                    </p>
                  </div>
                  {formData.twoFactorEnabled && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setFormData({ ...formData, twoFactorEnabled: false });
                        toast.info("2FA marked to turn off. Click 'Save All Changes' to apply.");
                      }}
                      className="border-destructive/20 text-destructive hover:bg-destructive hover:text-white transition-all text-[10px] uppercase font-bold"
                    >
                      Turn Off 2FA
                    </Button>
                  )}
                </div>
              </section>
            )}

            {/* --- Dangerous Area --- */}
            <section className="pt-8 border-t border-destructive/10">
              <div className="bg-destructive/5 border border-destructive/10 rounded-md p-4 space-y-4">
                <div className="flex items-center gap-2 text-destructive">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Danger Zone</span>
                </div>
                
                {deleteConfirm ? (
                  <div className="space-y-3">
                    <p className="text-xs text-muted-foreground">Are you sure? This will permanently delete the account and all associated data.</p>
                    <div className="flex gap-2">
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        className="flex-1 h-8 text-[10px] uppercase font-bold"
                        onClick={handleDelete}
                        disabled={loading}
                      >
                        Yes, Delete Permanently
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 h-8 text-[10px] uppercase font-bold"
                        onClick={() => setDeleteConfirm(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button 
                    variant="outline" 
                    className="w-full border-destructive/20 text-destructive hover:bg-destructive hover:text-white transition-all h-9 text-[10px] uppercase font-bold tracking-widest"
                    onClick={() => setDeleteConfirm(true)}
                  >
                    Delete Member Account
                  </Button>
                )}
              </div>
            </section>

          </div>
        </div>

        <SheetFooter className="pt-6 mt-auto shrink-0 border-t border-border bg-background py-4">
          <div className="flex flex-col w-full gap-2">
            <Button
              className="w-full bg-foreground text-background py-6 font-medium transition-all hover:opacity-90"
              disabled={loading}
              onClick={handleUpdate}
            >
              {loading ? "Processing..." : "Save All Changes"}
            </Button>
            {formData.modifiedBy && (
              <p className="text-[10px] text-center text-muted-foreground italic">
                Last modified by {formData.modifiedBy}
              </p>
            )}
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

// Simple internal Badge component for the header
function Badge({ children, variant }: { children: React.ReactNode, variant?: string }) {
  const styles: any = {
    Active: "bg-emerald-50 text-emerald-700 border-emerald-200/50",
    Inactive: "bg-gray-50 text-gray-700 border-gray-200/50",
    Alumni: "bg-blue-50 text-blue-700 border-blue-200/50",
    Probation: "bg-amber-50 text-amber-700 border-amber-200/50",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full border text-[9px] font-bold uppercase tracking-wider ${styles[variant || "Active"] || styles.Active}`}>
      {children}
    </span>
  );
}
