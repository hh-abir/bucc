"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Linkedin, Globe, GraduationCap, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { advisorsData, coAdvisorsData } from "@/constants/advisors";

export default function AdvisorsPage() {
  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Cinematic Hero Section */}
      <section className="relative pt-40 pb-24 px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-muted/30" />
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
        </div>
        
        <div className="relative z-10 max-w-6xl mx-auto space-y-8">
          <div className="space-y-4">
            <Badge className="bg-primary/10 text-primary border-none px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.3em] backdrop-blur-md">
              Faculty Leadership
            </Badge>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif tracking-tight leading-[1.1] text-foreground">
              Our Advisors.
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground font-light max-w-2xl leading-relaxed">
              Meet the distinguished faculty members who guide, mentor, and inspire the BRAC University Computer Club.
            </p>
          </div>
        </div>
      </section>

      {/* Main Advisor Section */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="space-y-16">
          <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground border-b border-border pb-4">
            <Award size={14} className="text-primary" /> Club Advisor
          </div>

          {advisorsData.map((advisor, index) => (
            <Card key={index} className="group border-border shadow-sm overflow-hidden bg-card hover:shadow-md transition-all duration-500">
              <div className="grid grid-cols-1 lg:grid-cols-12">
                <div className="lg:col-span-5 relative aspect-[3/4] lg:aspect-auto min-h-[400px] overflow-hidden bg-muted">
                  <Image 
                    src={advisor.image || "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=2070&auto=format&fit=crop"} 
                    alt={advisor.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 400px"
                    className="object-cover object-top grayscale group-hover:grayscale-0 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 lg:opacity-100 pointer-events-none" />
                </div>
                
                <CardContent className="lg:col-span-7 p-8 md:p-12 flex flex-col justify-center space-y-8">
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-3xl md:text-5xl font-serif font-medium leading-tight text-foreground">{advisor.name}</h2>
                      <p className="text-lg text-primary font-medium mt-1">{advisor.designation}</p>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-muted-foreground">
                      <GraduationCap size={16} /> {advisor.bracu_designation}
                    </div>
                  </div>

                  <div className="prose prose-neutral dark:prose-invert max-w-none">
                    <p className="text-base font-light leading-loose text-muted-foreground/90 text-justify">
                      {advisor.bio}
                    </p>
                  </div>

                  <div className="pt-8 border-t border-border/50 flex flex-wrap gap-4">
                    {advisor.linkedin && (
                      <a href={advisor.linkedin} target="_blank" rel="noreferrer">
                        <button className="flex items-center gap-2 bg-[#0A66C2]/10 hover:bg-[#0A66C2]/20 text-[#0A66C2] px-6 py-3 rounded-md text-[10px] font-bold uppercase tracking-widest transition-colors">
                          <Linkedin size={16} /> LinkedIn Profile
                        </button>
                      </a>
                    )}
                    {advisor.website && (
                      <a href={advisor.website} target="_blank" rel="noreferrer">
                        <button className="flex items-center gap-2 bg-muted hover:bg-muted/80 text-foreground px-6 py-3 rounded-md text-[10px] font-bold uppercase tracking-widest transition-colors border border-border">
                          <Globe size={16} /> Faculty Profile
                        </button>
                      </a>
                    )}
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Co-Advisors Section */}
      <section className="max-w-6xl mx-auto px-6 py-24 space-y-12">
        <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground border-b border-border pb-4">
          <Award size={14} className="text-primary" /> Co-Advisors
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {coAdvisorsData.map((advisor, index) => (
            <Card key={index} className="group border-border shadow-sm overflow-hidden bg-card flex flex-col hover:border-primary/20 transition-all duration-500">
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                <Image 
                  src={advisor.image || "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=2070&auto=format&fit=crop"} 
                  alt={advisor.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-top grayscale group-hover:grayscale-0 transition-all duration-700"
                />
              </div>
              
              <CardContent className="p-8 flex flex-col flex-1 space-y-6">
                <div className="space-y-3">
                  <div>
                    <h3 className="text-2xl font-serif font-medium leading-tight text-foreground">{advisor.name}</h3>
                    <p className="text-sm text-primary font-medium mt-1">{advisor.designation}</p>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    <GraduationCap size={14} /> {advisor.bracu_designation}
                  </div>
                </div>

                <div className="flex-1">
                  <p className="text-sm font-light leading-relaxed text-muted-foreground/90 line-clamp-6 text-justify">
                    {advisor.bio}
                  </p>
                </div>

                <div className="pt-6 border-t border-border/50 flex flex-wrap gap-3">
                  {advisor.linkedin && (
                    <a href={advisor.linkedin} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-[#0A66C2] transition-colors p-2 bg-muted rounded-md">
                      <Linkedin size={18} />
                    </a>
                  )}
                  {advisor.website && (
                    <a href={advisor.website} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground transition-colors p-2 bg-muted rounded-md border border-border">
                      <Globe size={18} />
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
