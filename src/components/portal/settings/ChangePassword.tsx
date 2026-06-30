"use client";

import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { KeyRound, ShieldAlert } from "lucide-react";

export default function ChangePassword() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (formData.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    setLoading(true);
    try {
      const { error } = await authClient.changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        revokeOtherSessions: true,
      });

      if (error) {
        toast.error(error.message || "Failed to change password");
      } else {
        toast.success("Password updated successfully");
        setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-border shadow-none bg-card">
      <CardHeader>
        <CardTitle className="text-xl font-serif">Security</CardTitle>
        <CardDescription>Manage your account password and sessions.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handlePasswordChange} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-bold text-muted-foreground">Current Password</Label>
              <div className="relative">
                <KeyRound className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" />
                <Input 
                  type="password"
                  value={formData.currentPassword} 
                  onChange={(e) => setFormData({...formData, currentPassword: e.target.value})}
                  className="bg-transparent border-0 border-b border-border rounded-none pl-7 px-0 focus-visible:ring-0 focus-visible:border-primary transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-bold text-muted-foreground">New Password</Label>
              <div className="relative">
                <ShieldAlert className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" />
                <Input 
                  type="password"
                  value={formData.newPassword} 
                  onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                  className="bg-transparent border-0 border-b border-border rounded-none pl-7 px-0 focus-visible:ring-0 focus-visible:border-primary transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-bold text-muted-foreground">Confirm New Password</Label>
              <div className="relative">
                <ShieldAlert className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" />
                <Input 
                  type="password"
                  value={formData.confirmPassword} 
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  className="bg-transparent border-0 border-b border-border rounded-none pl-7 px-0 focus-visible:ring-0 focus-visible:border-primary transition-colors"
                />
              </div>
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full bg-foreground text-background hover:opacity-90 transition-all font-medium py-5"
          >
            {loading ? "Updating..." : "Update Password"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
