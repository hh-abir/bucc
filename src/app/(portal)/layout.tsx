"use client";

import { ThemeToggle } from "@/components/ThemeToggle";
import { Sidebar } from "@/components/Sidebar";
import { useUser } from "@/context/UserContext";
import { useState } from "react";
import { Menu } from "lucide-react";

function DashboardHeader({ 
  onMenuClick 
}: { 
  onMenuClick: () => void;
}) {
  const { user, isLoading } = useUser();
  
  return (
    <header className="h-16 flex items-center justify-between px-4 md:px-8 border-b border-border bg-background gap-4 shrink-0">
      {/* Mobile Menu Toggle */}
      <button 
        onClick={onMenuClick}
        className="p-2 hover:bg-muted rounded-md md:hidden text-foreground transition-colors"
        aria-label="Toggle Mobile Menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      <div className="flex items-center gap-4 ml-auto">
        <ThemeToggle />
        <div className="text-sm text-muted-foreground flex flex-col items-end">
          {isLoading ? (
            <span className="animate-pulse bg-muted h-4 w-20 rounded"></span>
          ) : user ? (
            <>
              <span className="font-medium text-foreground text-xs md:text-sm">{user.name}</span>
              <span className="text-[9px] md:text-[10px] uppercase tracking-wider font-bold text-primary">{user.designation}</span>
            </>
          ) : (
            <span>Guest</span>
          )}
        </div>
      </div>
    </header>
  );
}

export default function PortalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-background text-foreground font-sans overflow-hidden">
      <Sidebar 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        isCollapsed={isCollapsed}
        onExpand={() => setIsCollapsed(false)}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-y-auto relative">
        <DashboardHeader 
          onMenuClick={() => setIsOpen(true)} 
        />
        <div className="p-4 md:p-8 max-w-5xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
