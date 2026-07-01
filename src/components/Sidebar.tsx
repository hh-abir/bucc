"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Settings, 
  Calendar, 
  LogOut, 
  FileText, 
  Users, 
  ChevronDown, 
  UserPlus, 
  ClipboardCheck, 
  GraduationCap,
  UserCheck,
  Database,
  Megaphone,
  Radio,
  MessageSquare,
  FolderRoot,
  PlusCircle,
  Globe,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useUser();
  const [isRecruitmentOpen, setIsRecruitmentOpen] = useState(false);
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);

  // Auto-expand if on a related path
  useEffect(() => {
    if (pathname.includes("/dashboard/recruitment")) {
      setIsRecruitmentOpen(true);
    }
    if (pathname.includes("/dashboard/projects")) {
      setIsProjectsOpen(true);
    }
  }, [pathname]);

  const isAlumni = user?.memberStatus === "Alumni";

  const links = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    ...(!isAlumni ? [
      { href: "/dashboard/members", label: "Members", icon: Users },
      { href: "/dashboard/events", label: "Events", icon: Calendar },
    ] : []),
    { href: "/dashboard/blogs", label: "Blogs", icon: FileText },
  ];

  const recruitmentLinks = [
    { href: "/dashboard/recruitment/prereg", label: "Pre-Reg Members", icon: UserPlus },
    { href: "/dashboard/evaluation", label: "Evaluation", icon: GraduationCap },
    { href: "/dashboard/registration", label: "Account Creation", icon: UserPlus },
  ];

  const userDesignation = user?.designation?.toLowerCase() || "";
  const userDept = user?.buccDepartment?.toLowerCase() || "";

  const isGB = ["president", "vice president", "vice-president", "general secretary", "treasurer"].includes(userDesignation) && !isAlumni;
  const isHRHead = userDept === "human resources" && ["director", "assistant director"].includes(userDesignation) && !isAlumni;
  const isRDAdmin = userDept === "research and development" && ["director", "assistant director"].includes(userDesignation) && !isAlumni;
  const isPR = (userDept === "press release and publications" || isGB || isRDAdmin) && !isAlumni;
  
  const canManagePR = isPR && [
    "president", "vice president", "vice-president", "general secretary", "treasurer",
    "director", "assistant director", "senior executive"
  ].includes(userDesignation);

  const canBroadcast = (isGB || ["director", "assistant director", "senior executive", "executive"].includes(userDesignation)) && !isAlumni;

  const canSeeRecruitment = user && 
    ["human resources", "governing body", "research and development"].includes(userDept) &&
    ["president", "vice president", "vice-president", "general secretary", "treasurer", "director", "assistant director"].includes(userDesignation) && !isAlumni;

  const canManageData = isGB || isHRHead || isRDAdmin;
  const canManageInquiries = isGB || isHRHead || isRDAdmin;
  const canManageProjects = isGB || isHRHead || isRDAdmin;
  
  const isMember = user && !canManageProjects;

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-40 md:hidden transition-all duration-300"
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={cn(
          "w-64 flex-shrink-0 border-r border-border bg-card flex flex-col h-full z-50 transition-transform duration-300 ease-in-out md:translate-x-0",
          "fixed inset-y-0 left-0 md:relative",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-6 border-b border-border flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group" onClick={onClose}>
            <Image 
              src="/assets/bucc-icon.svg" 
              alt="BUCC Icon" 
              width={40} 
              height={40} 
              className="h-10 w-10 transition-transform group-hover:scale-110 dark:invert dark:hue-rotate-180"
            />
            <span className="font-serif text-2xl font-bold tracking-tight text-foreground">Portal.</span>
          </Link>
          <button 
            onClick={onClose}
            className="md:hidden p-1.5 hover:bg-muted rounded-md text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                pathname === link.href 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <link.icon className="w-4 h-4" />
              {link.label}
            </Link>
          ))}

          {canManagePR && (
            <Link
              href="/dashboard/press-releases"
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                pathname === "/dashboard/press-releases" 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Megaphone className="w-4 h-4" />
              Press Releases
            </Link>
          )}

          {canBroadcast && (
            <Link
              href="/dashboard/broadcast"
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                pathname === "/dashboard/broadcast" 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Radio className="w-4 h-4" />
              Broadcast Center
            </Link>
          )}

          {canManageData && (
            <Link
              href="/dashboard/manage-data"
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                pathname === "/dashboard/manage-data" 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Database className="w-4 h-4" />
              Manage Data
            </Link>
          )}

          {canManageInquiries && (
            <Link
              href="/dashboard/inquiries"
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                pathname === "/dashboard/inquiries" 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <MessageSquare className="w-4 h-4" />
              Inquiries
            </Link>
          )}

          {canManageProjects && (
            <div className="space-y-1">
              <button
                onClick={() => setIsProjectsOpen(!isProjectsOpen)}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors text-muted-foreground hover:bg-muted hover:text-foreground",
                  pathname.includes("/dashboard/projects") && "text-foreground"
                )}
              >
                <div className="flex items-center gap-3">
                  <FolderRoot className="w-4 h-4" />
                  <span>Projects</span>
                </div>
                <ChevronDown className={cn("w-4 h-4 transition-transform", isProjectsOpen && "rotate-180")} />
              </button>
              
              {isProjectsOpen && (
                <div className="pl-4 space-y-1 mt-1">
                  <Link
                    href="/dashboard/projects/add"
                    onClick={onClose}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                      pathname === "/dashboard/projects/add" 
                        ? "bg-primary/10 text-primary" 
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    )}
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    Add Project
                  </Link>
                  <Link
                    href="/dashboard/projects/requests"
                    onClick={onClose}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                      pathname === "/dashboard/projects/requests" 
                        ? "bg-primary/10 text-primary" 
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    )}
                  >
                    <ClipboardCheck className="w-3.5 h-3.5" />
                    Requests
                  </Link>
                </div>
              )}
            </div>
          )}

          {isMember && (
            <Link
              href="/dashboard/projects/submit"
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                pathname === "/dashboard/projects/submit" 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <PlusCircle className="w-4 h-4" />
              Submit Project
            </Link>
          )}

          {canSeeRecruitment && (
            <div className="space-y-1">
              <button
                onClick={() => setIsRecruitmentOpen(!isRecruitmentOpen)}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors text-muted-foreground hover:bg-muted hover:text-foreground",
                  pathname.includes("/dashboard/recruitment") && "text-foreground"
                )}
              >
                <div className="flex items-center gap-3">
                  <UserCheck className="w-4 h-4" />
                  <span>Recruitment</span>
                </div>
                <ChevronDown className={cn("w-4 h-4 transition-transform", isRecruitmentOpen && "rotate-180")} />
              </button>
              
              {isRecruitmentOpen && (
                <div className="pl-4 space-y-1 mt-1">
                  {recruitmentLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={onClose}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                        pathname === link.href 
                          ? "bg-primary/10 text-primary" 
                          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                      )}
                    >
                      <link.icon className="w-3.5 h-3.5" />
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          <Link
            href="/dashboard/public-profile"
            onClick={onClose}
            className={cn(
              "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
              pathname === "/dashboard/public-profile" 
                ? "bg-primary text-primary-foreground" 
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Globe className="w-4 h-4" />
            Public Profile
          </Link>

          <Link
            href="/dashboard/settings"
            onClick={onClose}
            className={cn(
              "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
              pathname === "/dashboard/settings" 
                ? "bg-primary text-primary-foreground" 
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Settings className="w-4 h-4" />
            Settings
          </Link>
        </nav>
        <div className="p-4 border-t border-border">
          <Link 
            href="/logout" 
            onClick={onClose}
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </Link>
        </div>
      </aside>
    </>
  );
}
