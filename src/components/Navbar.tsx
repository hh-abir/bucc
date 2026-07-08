"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "./ThemeToggle";
import { ChevronDown, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [isVisible, setIsVisible] = useState(true);
  const [isAtTop, setIsAtTop] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileAboutOpen, setIsMobileAboutOpen] = useState(false);
  const [isMobilePubsOpen, setIsMobilePubsOpen] = useState(false);

  useEffect(() => {
    if (!isMobileMenuOpen) {
      setIsMobileAboutOpen(false);
      setIsMobilePubsOpen(false);
    }
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== 'undefined') {
        const currentScrollY = window.scrollY;

        // Visibility control
        if (currentScrollY < 10) {
          setIsVisible(true);
          setIsAtTop(true);
        } else {
          setIsAtTop(false);
          if (isMobileMenuOpen) {
            // Keep header visible while mobile drawer menu is open
            setIsVisible(true);
          } else if (currentScrollY > lastScrollY) {
            setIsVisible(false);
          } else {
            setIsVisible(true);
          }
        }

        setLastScrollY(currentScrollY);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', controlNavbar);

      return () => {
        window.removeEventListener('scroll', controlNavbar);
      };
    }
  }, [lastScrollY, isMobileMenuOpen]);

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full transition-all duration-500",
      isVisible ? "translate-y-0" : "-translate-y-full",
      isAtTop 
        ? "bg-background/90 dark:bg-background/40 backdrop-blur-md border-transparent" 
        : "border-b border-border bg-background/90 backdrop-blur-lg shadow-sm"
    )}>
      <div className="max-w-6xl mx-auto flex h-16 items-center justify-between px-8">
        <Link href="/" className="flex items-center gap-2 group">
          <Image 
            src="/assets/bucc-logo.svg" 
            alt="BUCC Logo" 
            width={160} 
            height={54} 
            priority
            className="h-12 w-auto transition-transform group-hover:scale-105 dark:invert dark:hue-rotate-180"
          />
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-black dark:text-foreground">
          <Link href="/" className="hover:text-muted-foreground transition-colors">Home</Link>
          
          <div className="relative group">
            <button className="flex items-center gap-1 hover:text-muted-foreground transition-colors py-2 text-black dark:text-foreground">
              About Us <ChevronDown className="w-4 h-4 opacity-50 group-hover:rotate-180 transition-transform duration-200" />
            </button>
            {/* Dropdown Menu */}
            <div className="absolute left-0 top-full mt-0 w-48 rounded-md border border-border bg-card p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:translate-y-1 transition-all duration-200 shadow-sm">
              <Link href="/about" className="block px-3 py-2 hover:bg-muted rounded-sm transition-colors text-black dark:text-foreground">About BUCC</Link>
              <Link href="/history" className="block px-3 py-2 hover:bg-muted rounded-sm transition-colors text-black dark:text-foreground">History</Link>
              <Link href="/executive-body" className="block px-3 py-2 hover:bg-muted rounded-sm transition-colors text-black dark:text-foreground">Executive Body</Link>
              <Link href="/advisors" className="block px-3 py-2 hover:bg-muted rounded-sm transition-colors text-black dark:text-foreground">Advisors</Link>
            </div>
          </div>

          <Link href="/people" className="hover:text-muted-foreground transition-colors py-2">People</Link>
          <Link href="/projects" className="hover:text-muted-foreground transition-colors py-2">Projects</Link>
          <Link href="/events" className="hover:text-muted-foreground transition-colors py-2">Events</Link>
          
          <div className="relative group">
            <button className="flex items-center gap-1 hover:text-muted-foreground transition-colors py-2 text-black dark:text-foreground">
              Publications <ChevronDown className="w-4 h-4 opacity-50 group-hover:rotate-180 transition-transform duration-200" />
            </button>
            {/* Dropdown Menu */}
            <div className="absolute left-0 top-full mt-0 w-48 rounded-md border border-border bg-card p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:translate-y-1 transition-all duration-200 shadow-sm">
              <Link href="/blogs" className="block px-3 py-2 hover:bg-muted rounded-sm transition-colors text-black dark:text-foreground">Blogs</Link>
              <Link href="/publications/press-releases" className="block px-3 py-2 hover:bg-muted rounded-sm transition-colors text-black dark:text-foreground">Press Releases</Link>
            </div>
          </div>

          <Link href="/contact" className="hover:text-muted-foreground transition-colors py-2">Contact</Link>
        </nav>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link 
            href="/login" 
            className="hidden md:inline-flex items-center justify-center px-4 py-2 bg-foreground text-background font-medium rounded-md hover:opacity-90 transition-opacity text-sm"
          >
            Portal Access
          </Link>
          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="inline-flex md:hidden items-center justify-center p-2 text-foreground hover:bg-muted/80 rounded-md transition-colors"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-background px-8 py-6 space-y-4 shadow-lg animate-in fade-in slide-in-from-top-5 duration-200">
          <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="block text-sm font-medium hover:text-muted-foreground transition-colors">Home</Link>
          
          {/* About Us Accordion */}
          <div className="space-y-2">
            <button 
              onClick={() => setIsMobileAboutOpen(!isMobileAboutOpen)}
              className="flex items-center justify-between w-full text-sm font-medium hover:text-muted-foreground transition-colors text-left"
            >
              <span>About Us</span>
              <ChevronDown className={cn("w-4 h-4 transition-transform duration-200 text-muted-foreground", isMobileAboutOpen && "rotate-180")} />
            </button>
            {isMobileAboutOpen && (
              <div className="pl-4 border-l border-border space-y-3 pt-1 animate-in fade-in slide-in-from-top-1 duration-200">
                <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="block text-sm font-light hover:text-muted-foreground transition-colors">About BUCC</Link>
                <Link href="/history" onClick={() => setIsMobileMenuOpen(false)} className="block text-sm font-light hover:text-muted-foreground transition-colors">History</Link>
                <Link href="/executive-body" onClick={() => setIsMobileMenuOpen(false)} className="block text-sm font-light hover:text-muted-foreground transition-colors">Executive Body</Link>
                <Link href="/advisors" onClick={() => setIsMobileMenuOpen(false)} className="block text-sm font-light hover:text-muted-foreground transition-colors">Advisors</Link>
              </div>
            )}
          </div>

          <Link href="/people" onClick={() => setIsMobileMenuOpen(false)} className="block text-sm font-medium hover:text-muted-foreground transition-colors">People</Link>
          <Link href="/projects" onClick={() => setIsMobileMenuOpen(false)} className="block text-sm font-medium hover:text-muted-foreground transition-colors">Projects</Link>
          <Link href="/events" onClick={() => setIsMobileMenuOpen(false)} className="block text-sm font-medium hover:text-muted-foreground transition-colors">Events</Link>
          
          {/* Publications Accordion */}
          <div className="space-y-2">
            <button 
              onClick={() => setIsMobilePubsOpen(!isMobilePubsOpen)}
              className="flex items-center justify-between w-full text-sm font-medium hover:text-muted-foreground transition-colors text-left"
            >
              <span>Publications</span>
              <ChevronDown className={cn("w-4 h-4 transition-transform duration-200 text-muted-foreground", isMobilePubsOpen && "rotate-180")} />
            </button>
            {isMobilePubsOpen && (
              <div className="pl-4 border-l border-border space-y-3 pt-1 animate-in fade-in slide-in-from-top-1 duration-200">
                <Link href="/blogs" onClick={() => setIsMobileMenuOpen(false)} className="block text-sm font-light hover:text-muted-foreground transition-colors">Blogs</Link>
                <Link href="/publications/press-releases" onClick={() => setIsMobileMenuOpen(false)} className="block text-sm font-light hover:text-muted-foreground transition-colors">Press Releases</Link>
              </div>
            )}
          </div>

          <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="block text-sm font-medium hover:text-muted-foreground transition-colors">Contact</Link>
          
          <div className="pt-4 border-t border-border">
            <Link 
              href="/login" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="inline-flex w-full items-center justify-center px-4 py-2.5 bg-foreground text-background font-medium rounded-md hover:opacity-90 transition-opacity text-sm"
            >
              Portal Access
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
