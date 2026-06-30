"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Facebook, 
  Linkedin, 
  Github, 
  Youtube, 
  Instagram, 
  Mail, 
  MapPin, 
  ExternalLink, 
  Phone,
  Globe,
  ArrowRight
} from "lucide-react";
import { departmentsInfo } from "@/constants/departments";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const navigation = {
    club: [
      { name: "About BUCC", href: "/about" },
      { name: "Executive Body", href: "/executive-body" },
      { name: "Advisors", href: "/advisors" },
      { name: "Events & Workshops", href: "/events" },
      { name: "Tech Blogs", href: "/blogs" },
      { name: "Contact Us", href: "/contact" },
    ],
    university: [
      { name: "BRAC University", href: "https://www.bracu.ac.bd/" },
      { name: "Student Portal (Connect)", href: "https://connect.bracu.ac.bd/" },
      { name: "e-Learning (Moodle)", href: "https://buclms.bracu.ac.bd/" },
      { name: "Ayesha Abed Library", href: "https://library.bracu.ac.bd/" },
      { name: "CSE Department", href: "https://www.bracu.ac.bd/academics/departments/computer-science-and-engineering" },
    ],
    departments: departmentsInfo.slice(0, 6).map(dept => ({
      name: dept.name,
      href: dept.url
    })),
    social: [
      { name: "Facebook", href: "https://www.facebook.com/BRACUCC", icon: Facebook },
      { name: "LinkedIn", href: "https://www.linkedin.com/company/bracucc", icon: Linkedin },
      { name: "GitHub", href: "https://github.com/buccbracu", icon: Github },
      { name: "Instagram", href: "https://www.instagram.com/bracucc/", icon: Instagram },
      { name: "YouTube", href: "https://www.youtube.com/@bracucc", icon: Youtube },
    ],
  };

  return (
    <footer className="bg-background border-t border-border pt-24 pb-12 px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 lg:gap-12">
          
          {/* Brand & Mission */}
          <div className="lg:col-span-4 space-y-8">
            <div className="space-y-4">
              <Link href="/" className="inline-block">
                <Image 
                  src="/assets/bucc-icon.svg" 
                  alt="BUCC Logo" 
                  width={80} 
                  height={80} 
                  className="h-20 w-auto dark:invert dark:hue-rotate-180 transition-transform hover:scale-105"
                />
              </Link>
              <p className="text-sm text-muted-foreground leading-relaxed font-light max-w-sm">
                The largest and oldest student-led tech community at BRAC University. 
                Since 2001, we've been dedicated to fostering innovation, 
                enhancing technical skills, and bridging the gap between academia and industry.
              </p>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground">Follow Us</h3>
              <div className="flex gap-4">
                {navigation.social.map((item) => (
                  <a 
                    key={item.name} 
                    href={item.href} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-all p-2 border border-border/50 hover:border-foreground/20 rounded-sm bg-muted/20"
                    aria-label={item.name}
                  >
                    <item.icon size={16} strokeWidth={1.5} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Navigation Grid */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-12">
            {/* Club Links */}
            <div className="space-y-8">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground">Club</h3>
              <ul className="space-y-4">
                {navigation.club.map((item) => (
                  <li key={item.name}>
                    <Link 
                      href={item.href} 
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors font-light flex items-center group"
                    >
                      <ArrowRight className="w-3 h-3 mr-2 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* University Links */}
            <div className="space-y-8">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground">University</h3>
              <ul className="space-y-4">
                {navigation.university.map((item) => (
                  <li key={item.name}>
                    <a 
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors font-light flex items-center group"
                    >
                      {item.name}
                      <ExternalLink className="ml-2 w-3 h-3 opacity-30 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact Information */}
          <div className="lg:col-span-3 space-y-8">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground">Contact & Visit</h3>
            <div className="space-y-6">
              <div className="flex gap-4 text-sm text-muted-foreground font-light leading-relaxed">
                <MapPin className="w-5 h-5 shrink-0 text-muted-foreground/40" />
                <p>
                  BRAC University New Campus<br />
                  Kha 224 Pragati Sarani, Merul Badda<br />
                  Dhaka 1212, Bangladesh
                </p>
              </div>
              
              <div className="space-y-4">
                <a 
                  href="mailto:marketing.bucc@g.bracu.ac.bd"
                  className="flex items-center gap-4 text-sm text-muted-foreground hover:text-foreground transition-colors font-light"
                >
                  <Mail className="w-5 h-5 shrink-0 text-muted-foreground/40" />
                  <span className="break-all">For Business: marketing.bucc@g.bracu.ac.bd</span>
                </a>
                <div className="flex items-center gap-4 text-sm text-muted-foreground font-light">
                  <Phone className="w-5 h-5 shrink-0 text-muted-foreground/40" />
                  <span>+8801732644303</span>
                </div>
                <a 
                  href="https://www.bracu.ac.bd"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 text-sm text-muted-foreground hover:text-foreground transition-colors font-light"
                >
                  <Globe className="w-5 h-5 shrink-0 text-muted-foreground/40" />
                  <span>www.bracu.ac.bd</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-24 pt-12 border-t border-border flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 text-center md:text-left">
            <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">
              &copy; {currentYear} BRAC University Computer Club. All Rights Reserved.
            </p>
          </div>
          
          <div className="text-center md:text-right space-y-1">
            <p className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-[0.2em]">
              Developed by <span className="text-foreground">BUCC R&D Web Team</span>
            </p>
            <p className="text-[9px] text-muted-foreground/30 uppercase tracking-[0.1em]">
              Crafted with Precision at BRAC University
            </p>
          </div>
        </div>
      </div>

      {/* Background Decorative Blur */}
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-muted/20 rounded-full blur-3xl -z-10" />
    </footer>
  );
};

export default Footer;
