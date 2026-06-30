"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { Facebook, Linkedin, Github, Users } from "lucide-react";
import { allExecutiveBodies, EBMember } from "@/constants/all-executive-body";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

// Utility to group by department
const groupByDepartment = (members: EBMember[]) => {
  const departments: Record<string, EBMember[]> = {};
  
  // Define preferred order for common departments
  const preferredOrder = [
    "Governing Body",
    "Communication and Marketing",
    "Creative",
    "Event Management",
    "Finance",
    "Human Resources",
    "Press Release and Publication",
    "Press Release and Publications",
    "Research and Development",
    "Marketing"
  ];

  members.forEach((member) => {
    if (!departments[member.department]) {
      departments[member.department] = [];
    }
    departments[member.department].push(member);
  });

  // Sort departments: preferred order first, then alphabetical
  return Object.keys(departments).sort((a, b) => {
    const indexA = preferredOrder.indexOf(a);
    const indexB = preferredOrder.indexOf(b);
    
    if (indexA !== -1 && indexB !== -1) return indexA - indexB;
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;
    
    return a.localeCompare(b);
  }).map(dept => ({
    name: dept,
    members: departments[dept]
  }));
};

export default function ExecutiveBodyPage() {
  const years = Object.keys(allExecutiveBodies).sort((a, b) => b.localeCompare(a));
  const [selectedYear, setSelectedYear] = useState(years[0]);

  const groupedData = useMemo(() => {
    return groupByDepartment(allExecutiveBodies[selectedYear]);
  }, [selectedYear]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header Section */}
      <div className="text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-6">
            <Users className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 tracking-tight">
            Our Executive Body
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Meet the dedicated individuals who lead the BRAC University Computer Club 
            and work tirelessly to foster a thriving tech community.
          </p>
        </motion.div>
      </div>

      {/* Year Selector */}
      <div className="flex flex-wrap justify-center gap-3 mb-16">
        {years.map((year) => (
          <button
            key={year}
            onClick={() => setSelectedYear(year)}
            className={cn(
              "px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 border shadow-sm",
              selectedYear === year
                ? "bg-foreground text-background border-foreground scale-105 shadow-md"
                : "bg-background text-foreground border-border hover:border-foreground/30 hover:shadow-md"
            )}
          >
            {year}
          </button>
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedYear}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="space-y-24"
        >
          {groupedData.map((dept) => (
            <section key={dept.name} className="scroll-mt-20">
              <div className="flex items-center gap-6 mb-12">
                <h2 className="text-2xl md:text-3xl font-bold font-serif whitespace-nowrap">
                  {dept.name}
                </h2>
                <div className="h-px bg-gradient-to-r from-border to-transparent w-full" />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {dept.members.map((member, index) => (
                  <MemberCard key={`${member.fullName}-${index}`} member={member} />
                ))}
              </div>
            </section>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function MemberCard({ member }: { member: EBMember }) {
  return (
    <Card className="group overflow-hidden border-none bg-secondary/30 hover:bg-secondary/50 transition-all duration-500 rounded-xl">
      <CardContent className="p-0">
        <div className="relative aspect-[4/5] overflow-hidden bg-muted">
          <Image
            src={member.image}
            alt={member.fullName}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
            quality={60}
            priority={member.designation === "President" || member.designation === "Vice President"}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Social Links Overlay */}
          <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-4 translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out">
            {member.facebookURL && member.facebookURL !== "NULL" && (
              <SocialIcon href={member.facebookURL} icon={<Facebook size={20} />} label="Facebook" />
            )}
            {member.linkedinURL && member.linkedinURL !== "NULL" && (
              <SocialIcon 
                href={member.linkedinURL.startsWith('http') ? member.linkedinURL : `https://${member.linkedinURL}`} 
                icon={<Linkedin size={20} />} 
                label="LinkedIn" 
              />
            )}
            {member.gitHubURL && member.gitHubURL !== "NULL" && (
              <SocialIcon href={member.gitHubURL} icon={<Github size={20} />} label="GitHub" />
            )}
          </div>
        </div>
        
        <div className="p-6 text-center">
          <h3 className="font-bold text-lg leading-tight mb-2 group-hover:text-primary transition-colors duration-300">
            {member.fullName}
          </h3>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-[0.15em]">
            {member.designation}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function SocialIcon({ href, icon, label }: { href: string, icon: React.ReactNode, label: string }) {
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer"
      aria-label={label}
      className="w-11 h-11 flex items-center justify-center rounded-full bg-white text-black hover:bg-primary hover:text-white transition-all duration-300 shadow-xl"
    >
      {icon}
    </a>
  );
}
