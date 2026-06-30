"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Code2, Users, Rocket, Cpu, Terminal, Shield, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function HistoryPage() {
  const milestones = [
    {
      year: "2001",
      title: "The Genesis",
      description: "Founded alongside the inception of BRAC University itself, BUCC became the very first student organization, setting the precedent for extracurricular life on campus.",
      icon: Terminal
    },
    {
      year: "2005 - 2010",
      title: "Establishing the Core",
      description: "Transitioned from a small group of enthusiasts to a structured body. Began hosting the university's first intra-department programming contests and tech seminars.",
      icon: Code2
    },
    {
      year: "2015",
      title: "The National Stage",
      description: "BUCC members began consistently representing BRAC University at national hackathons, competitive programming contests (NCPC, ICPC), and robotics Olympiads.",
      icon: Award
    },
    {
      year: "2020",
      title: "Digital Resilience",
      description: "During global lockdowns, BUCC successfully transitioned all operations online, launching virtual workshops, e-gaming tournaments, and the first digital recruitment phase.",
      icon: Shield
    },
    {
      year: "Present",
      title: "A New Era of Innovation",
      description: "With over 7 specialized departments and hundreds of active members, BUCC is now building production-grade software (like this portal) and leading AI/ML research initiatives.",
      icon: Rocket
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Cinematic Hero Section */}
      <section className="relative h-[70vh] md:h-[80vh] flex items-center justify-center overflow-hidden bg-black">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop"
            alt="Students coding together"
            fill
            sizes="100vw"
            className="object-cover opacity-40 grayscale"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
        </div>
        
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto space-y-6">
          <Badge className="bg-primary/20 text-primary hover:bg-primary/30 border-none px-4 py-1.5 text-xs font-bold uppercase tracking-[0.3em] backdrop-blur-md">
            Est. 2001
          </Badge>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-white tracking-tight leading-[1.1]">
            Our Legacy.
          </h1>
          <p className="text-xl md:text-2xl text-white/70 font-light max-w-2xl mx-auto leading-relaxed">
            The oldest, largest, and most prestigious student organization at BRAC University.
          </p>
        </div>
      </section>

      {/* Chapter 1: The Beginning */}
      <section className="py-24 md:py-32 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-5 space-y-8">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Chapter 01</h2>
            <h3 className="text-4xl md:text-5xl font-serif leading-tight">The First Lines of Code</h3>
            <div className="space-y-6 text-muted-foreground font-light leading-relaxed text-lg">
              <p>
                In 2001, BRAC University opened its doors with a vision to foster leaders. In that same year, a small but fiercely passionate group of computer science students realized they needed a space beyond the classroom to experiment, break things, and build. 
              </p>
              <p>
                Thus, the BRAC University Computer Club (BUCC) was born. As the very first club established at the university, BUCC didn't just create a community for tech enthusiasts; it laid the foundational blueprint for all extracurricular and co-curricular activities that would follow in the decades to come.
              </p>
            </div>
          </div>
          <div className="lg:col-span-7 relative">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-muted relative border border-border/50">
              <Image 
                src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop" 
                alt="Vintage computer setup"
                fill
                sizes="(max-width: 1024px) 100vw, 700px"
                className="object-cover grayscale hover:grayscale-0 transition-all duration-1000"
              />
            </div>
            {/* Decorative abstract elements */}
            <div className="absolute -bottom-8 -left-8 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10" />
          </div>
        </div>
      </section>

      {/* The Mission Statement (Full Width Break) */}
      <section className="bg-foreground text-background py-24 px-6 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center space-y-10 relative z-10">
          <Cpu className="w-12 h-12 mx-auto text-background/40" />
          <h2 className="text-3xl md:text-5xl font-serif leading-snug">
            "To empower the next generation of tech leaders by bridging the gap between academic theory and industry innovation."
          </h2>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-background/60">
            The BUCC Mission
          </p>
        </div>
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent opacity-50 pointer-events-none" />
      </section>

      {/* Chapter 2: The Timeline */}
      <section className="py-24 md:py-32 px-6 bg-muted/10">
        <div className="max-w-6xl mx-auto space-y-20">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">The Journey</h2>
            <h3 className="text-4xl md:text-5xl font-serif">Decades of Excellence</h3>
            <p className="text-muted-foreground font-light">From dial-up modems to artificial intelligence, BUCC has evolved alongside technology itself.</p>
          </div>

          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-[28px] md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-1/2" />
            
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className={`relative flex flex-col md:flex-row gap-8 md:gap-0 ${index % 2 === 0 ? "md:flex-row-reverse" : ""}`}>
                  
                  {/* Timeline Node */}
                  <div className="absolute left-0 md:left-1/2 w-14 h-14 bg-background border-2 border-primary rounded-full flex items-center justify-center md:-translate-x-1/2 z-10 shadow-lg shadow-background">
                    <milestone.icon className="w-5 h-5 text-primary" />
                  </div>

                  {/* Empty space for opposite side on desktop */}
                  <div className="hidden md:block md:w-1/2" />

                  {/* Content Card */}
                  <div className={`ml-20 md:ml-0 md:w-1/2 ${index % 2 === 0 ? "md:pl-16" : "md:pr-16 text-left md:text-right"}`}>
                    <Card className="border-border shadow-none bg-card hover:border-primary/20 transition-all duration-300">
                      <CardContent className="p-8 space-y-4">
                        <span className="inline-block px-3 py-1 bg-muted text-foreground text-xs font-bold font-mono rounded-sm">
                          {milestone.year}
                        </span>
                        <h4 className="text-2xl font-serif">{milestone.title}</h4>
                        <p className="text-muted-foreground font-light leading-relaxed">
                          {milestone.description}
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Chapter 3: The Modern Era (Departmental Structure) */}
      <section className="py-24 md:py-32 px-6">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Present Day</h2>
              <h3 className="text-4xl md:text-5xl font-serif leading-tight">A Structured Powerhouse</h3>
              <p className="text-muted-foreground font-light leading-relaxed text-lg">
                Today, BUCC operates not just as a club, but as a mini-tech company. To handle the scale of our operations, events, and development projects, we restructured into seven specialized departments.
              </p>
              <p className="text-muted-foreground font-light leading-relaxed text-lg">
                This structure allows members to hone specific skills—from software engineering in R&D to corporate communication in HR—preparing them directly for the corporate world.
              </p>
              <div className="pt-6">
                <Link href="/executive-body">
                  <Button variant="outline" className="h-12 px-8 border-border gap-3 text-xs font-bold uppercase tracking-widest hover:bg-foreground hover:text-background transition-all">
                    Meet the Leadership <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {[
                { name: "Research & Development", users: "150+" },
                { name: "Event Management", users: "120+" },
                { name: "Human Resources", users: "80+" },
                { name: "Creative", users: "60+" },
              ].map((dept, i) => (
                <div key={i} className="bg-muted/30 p-6 rounded-xl border border-border space-y-3">
                  <Users className="w-6 h-6 text-muted-foreground" />
                  <p className="font-serif text-lg leading-snug">{dept.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA / Join Section */}
      <section className="py-24 px-6 border-t border-border">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl font-serif">Be Part of History.</h2>
          <p className="text-xl text-muted-foreground font-light">
            We've been writing code, organizing events, and building leaders for over two decades. The next chapter is yours to write.
          </p>
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
             <Link href="/registration">
              <Button className="h-14 px-10 bg-foreground text-background font-bold uppercase tracking-widest text-[10px] hover:scale-105 transition-transform">
                Join BUCC Today
              </Button>
             </Link>
             <Link href="/projects">
              <Button variant="outline" className="h-14 px-10 border-border font-bold uppercase tracking-widest text-[10px] hover:bg-muted">
                View Our Work
              </Button>
             </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
