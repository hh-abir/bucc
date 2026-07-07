"use client";
 
import { useState, useEffect } from "react";
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
import BRACUDepartments from "@/constants/BRACUDepartments";
import { toast } from "sonner";
import { 
  User, Mail, Phone, Briefcase, Calendar, 
  Hash, ShieldCheck, Trash2, AlertTriangle 
} from "lucide-react";
 
const BUCC_DEPARTMENTS = [
  "Communication and Marketing",
  "Creative",
  "Event Management",
  "Finance",
  "Human Resources",
  "Press Release and Publications",
  "Research and Development"
];
 
export default function MemberApprovalDialog({ 
  request, 
  isOpen, 
  onClose,
  onUpdate 
}: { 
  request: any, 
  isOpen: boolean, 
  onClose: () => void,
  onUpdate: () => void
}) {
  const [loading, setLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [formData, setFormData] = useState<any>(null);
 
  // Initialize form data when request changes
  useEffect(() => {
    if (request) {
      setFormData({
        ...request,
        joinedBucc: request.joinedBucc || "",
        joinedBracu: request.joinedBracu || "",
      });
      setDeleteConfirm(false);
    }
  }, [request]);
 
  if (!formData) return null;
 
  const handleFieldChange = (name: string, value: string) => {
    if (name === "memberStatus") {
      setFormData((prev: any) => ({
        ...prev,
        memberStatus: value,
        buccDepartment: "",
        designation: "",
      }));
      return;
    }
 
    if (name === "buccDepartment") {
      setFormData((prev: any) => ({
        ...prev,
        buccDepartment: value,
        designation: "",
      }));
      return;
    }
 
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };
 
  // Save edits only
  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/member-registration/${request._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "save",
          ...formData
        }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        toast.error(data.message || "Failed to save request");
      } else {
        toast.success("Registration request updated successfully!");
        onUpdate();
        onClose();
      }
    } catch (err) {
      toast.error("Error updating request details");
    } finally {
      setLoading(false);
    }
  };
 
  // Approve & Save
  const handleApprove = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/member-registration/${request._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "approve",
          ...formData
        }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        toast.error(data.message || "Failed to approve request");
      } else {
        toast.success("Member approved and account activated!");
        onUpdate();
        onClose();
      }
    } catch (err) {
      toast.error("Error during account activation approval");
    } finally {
      setLoading(false);
    }
  };
 
  // Reject/Delete
  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/member-registration/${request._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      
      if (!res.ok) {
        toast.error(data.message || "Failed to reject request");
      } else {
        toast.success("Registration request rejected & deleted.");
        onUpdate();
        onClose();
      }
    } catch (err) {
      toast.error("Error deleting registration request");
    } finally {
      setLoading(false);
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
    // Current Member designations
    designationOptions = ["Senior Executive", "Executive", "General Member"];
  }
 
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-xl overflow-y-auto z-[150] space-y-6">
        <SheetHeader>
          <SheetTitle className="font-serif text-2xl flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-primary" /> Review Registration
          </SheetTitle>
          <SheetDescription className="font-light text-sm">
            Edit profile fields below if necessary, then click Approve to create their portal account, or Reject to decline their application.
          </SheetDescription>
        </SheetHeader>
 
        <div className="space-y-5 py-4 border-t border-border">
          {/* Status Selection */}
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Membership Status</Label>
            <div className="flex gap-2">
              {["Active", "Alumni"].map(status => (
                <Button
                  key={status}
                  type="button"
                  variant={formData.memberStatus === status ? "default" : "outline"}
                  onClick={() => handleFieldChange("memberStatus", status)}
                  className="w-1/2 rounded-lg font-light text-xs py-2"
                >
                  {status === "Active" ? "Current Member" : "Alumni"}
                </Button>
              ))}
            </div>
          </div>
 
          {/* Name Input */}
          <div className="space-y-1.5">
            <Label htmlFor="edit-name" className="text-xs font-semibold flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-muted-foreground" /> Full Name
            </Label>
            <Input
              id="edit-name"
              value={formData.name}
              onChange={(e) => handleFieldChange("name", e.target.value)}
              className="rounded-lg font-light"
            />
          </div>
 
          {/* Student ID & Email Inputs */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="edit-studentId" className="text-xs font-semibold flex items-center gap-1.5">
                <Hash className="h-3.5 w-3.5 text-muted-foreground" /> Student ID
              </Label>
              <Input
                id="edit-studentId"
                value={formData.studentId}
                onChange={(e) => handleFieldChange("studentId", e.target.value)}
                className="rounded-lg font-mono font-light"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-email" className="text-xs font-semibold flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-muted-foreground" /> G-Suite Email
              </Label>
              <Input
                id="edit-email"
                value={formData.email}
                onChange={(e) => handleFieldChange("email", e.target.value)}
                className="rounded-lg font-light"
              />
            </div>
          </div>
 
          {/* Phone Number & BRACU Academic Department */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="edit-phoneNumber" className="text-xs font-semibold flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-muted-foreground" /> Phone Number
              </Label>
              <Input
                id="edit-phoneNumber"
                value={formData.phoneNumber}
                onChange={(e) => handleFieldChange("phoneNumber", e.target.value)}
                className="rounded-lg font-light"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold flex items-center gap-1.5">
                <Briefcase className="h-3.5 w-3.5 text-muted-foreground" /> Academic Dept
              </Label>
              <Select
                value={formData.bracuDepartment}
                onValueChange={(val) => handleFieldChange("bracuDepartment", val)}
              >
                <SelectTrigger className="rounded-lg font-light">
                  <SelectValue placeholder="Select Dept" />
                </SelectTrigger>
                <SelectContent className="z-[160]">
                  {BRACUDepartments.map((dept) => (
                    <SelectItem key={dept.name} value={dept.name}>
                      {dept.name} ({dept.initial})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
 
          {/* BUCC Department Select */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold flex items-center gap-1.5">
              <Briefcase className="h-3.5 w-3.5 text-muted-foreground" /> BUCC Department
            </Label>
            <Select
              value={formData.buccDepartment}
              onValueChange={(val) => handleFieldChange("buccDepartment", val)}
            >
              <SelectTrigger className="rounded-lg font-light">
                <SelectValue placeholder="Select BUCC Department" />
              </SelectTrigger>
              <SelectContent className="z-[160]">
                {departmentOptions.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
 
          {/* Designation Dropdown */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold flex items-center gap-1.5">
              <Briefcase className="h-3.5 w-3.5 text-muted-foreground" /> BUCC Designation
            </Label>
            <Select
              value={formData.designation}
              onValueChange={(val) => handleFieldChange("designation", val)}
            >
              <SelectTrigger className="rounded-lg font-light">
                <SelectValue placeholder="Select Designation" />
              </SelectTrigger>
              <SelectContent className="z-[160]">
                {designationOptions.map((des) => (
                  <SelectItem key={des} value={des}>
                    {des}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
 
          {/* Joined BUCC & Joined BRACU */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="edit-joinedBracu" className="text-xs font-semibold flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" /> Joined BRACU
              </Label>
              <Input
                id="edit-joinedBracu"
                value={formData.joinedBracu}
                placeholder="e.g. Spring 2021"
                onChange={(e) => handleFieldChange("joinedBracu", e.target.value)}
                className="rounded-lg font-light"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-joinedBucc" className="text-xs font-semibold flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" /> Joined BUCC
              </Label>
              <Input
                id="edit-joinedBucc"
                value={formData.joinedBucc}
                placeholder="e.g. Fall 2021"
                onChange={(e) => handleFieldChange("joinedBucc", e.target.value)}
                className="rounded-lg font-light"
              />
            </div>
          </div>
        </div>
 
        <SheetFooter className="pt-6 border-t border-border flex flex-col gap-2 sm:flex-row sm:justify-between items-stretch">
          <div className="w-full flex flex-col gap-2">
            {!deleteConfirm ? (
              <Button
                type="button"
                variant="outline"
                className="text-destructive border-destructive/20 hover:bg-destructive/10 rounded-lg font-light py-2 w-full flex items-center justify-center gap-1.5"
                onClick={() => setDeleteConfirm(true)}
              >
                <Trash2 className="h-4 w-4" /> Reject Registration
              </Button>
            ) : (
              <div className="p-4 rounded-xl border border-destructive/20 bg-destructive/5 space-y-3">
                <div className="flex items-start gap-2 text-destructive text-xs">
                  <AlertTriangle className="h-5 w-5 shrink-0" />
                  <p className="font-light leading-relaxed">
                    Are you sure you want to reject this registration request? This will permanently wipe their submission from the staging database.
                  </p>
                </div>
                <div className="flex gap-2 w-full">
                  <Button
                    type="button"
                    variant="destructive"
                    disabled={loading}
                    className="w-1/2 rounded-lg text-xs"
                    onClick={handleDelete}
                  >
                    Yes, Reject
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-1/2 rounded-lg text-xs"
                    onClick={() => setDeleteConfirm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
            
            {!deleteConfirm && (
              <div className="flex flex-col sm:flex-row gap-2 mt-2 w-full">
                <Button
                  type="button"
                  variant="outline"
                  disabled={loading}
                  onClick={handleSave}
                  className="w-full sm:w-1/2 rounded-lg font-light py-2"
                >
                  Save Edits
                </Button>
                <Button
                  type="button"
                  disabled={loading}
                  onClick={handleApprove}
                  className="w-full sm:w-1/2 rounded-lg py-2 font-medium bg-primary text-primary-foreground hover:bg-primary/95 flex items-center justify-center gap-1"
                >
                  Approve & Activate
                </Button>
              </div>
            )}
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
