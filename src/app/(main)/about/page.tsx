"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  const coreValues = [
    {
      title: "Innovation",
      description: "We constantly push boundaries, embracing new technologies and creative solutions to solve complex problems.",
      glow: "from-amber-500/20 to-orange-500/20",
      textColor: "text-amber-500"
    },
    {
      title: "Collaboration",
      description: "Great things are never built alone. We foster a culture of teamwork, knowledge sharing, and mutual support.",
      glow: "from-sky-500/20 to-blue-500/20",
      textColor: "text-sky-500"
    },
    {
      title: "Excellence",
      description: "From code quality to event execution, we strive for the highest standards in everything we do.",
      glow: "from-emerald-500/20 to-teal-500/20",
      textColor: "text-emerald-500"
    },
    {
      title: "Integrity",
      description: "We operate with transparency, accountability, and respect for our peers, university, and community.",
      glow: "from-indigo-500/20 to-purple-500/20",
      textColor: "text-indigo-500"
    }
  ];

  const stats = [
    { value: "15+", label: "Years of Legacy" },
    { value: "2,500+", label: "Active Members" },
    { value: "120+", label: "Tech Events & Seminars" },
    { value: "7", label: "Core Departments" }
  ];

  const journeySteps = [
    {
      phase: "01",
      title: "Discover",
      subtitle: "Mind Expansion",
      description: "Join the fold and discover new horizons in technology. Attend orientation bootcamps, connect with brilliant peers, and map your interests across code, design, writing, or management.",
      color: "border-sky-500/30"
    },
    {
      phase: "02",
      title: "Learn & Build",
      subtitle: "Career Acceleration",
      description: "Engage in hands-on workshops, build collaborative projects (like this student portal!), and receive direct mentoring from seniors and prestigious industry alumni.",
      color: "border-purple-500/30"
    },
    {
      phase: "03",
      title: "Lead & Connect",
      subtitle: "Social Leadership",
      description: "Organize nationwide hackathons, step into coordinator and executive roles, run departments, and refine your management and interpersonal skills.",
      color: "border-pink-500/30"
    },
    {
      phase: "04",
      title: "Launch",
      subtitle: "Soul & Professional Impact",
      description: "Step into the tech world as a seasoned professional. Our alumni lead at global tech giants (Google, Meta), spearhead impactful startups, and achieve high academic milestones globally.",
      color: "border-emerald-500/30"
    }
  ];

  return (
    <div className="min-h-screen bg-background pb-32 text-foreground overflow-hidden relative">
      {/* Background ambient light */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[800px] right-1/4 w-[600px] h-[600px] bg-sky-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[400px] left-1/3 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-36 pb-20 px-6 border-b border-border/40">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8 lg:col-span-7"
          >
            <Badge className="bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.3em] backdrop-blur-md">
              Who We Are
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-sans font-bold tracking-tight leading-[1.1]">
              Empowering the <br />
              <span className="bg-gradient-to-r from-primary via-indigo-400 to-sky-400 bg-clip-text text-transparent">
                Tech Leaders
              </span> of Tomorrow.
            </h1>
            <p className="text-base md:text-lg text-muted-foreground font-light leading-relaxed max-w-xl">
              The BRAC University Computer Club (BUCC) is the premier student organization dedicated to fostering innovation, technical excellence, and professional growth in a rapidly evolving digital landscape.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link href="/history">
                <Button className="h-12 px-8 bg-primary hover:bg-primary/95 text-primary-foreground font-semibold tracking-wider text-xs rounded-xl shadow-lg shadow-primary/25 transition-all hover:translate-y-[-2px]">
                  Our History <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" className="h-12 px-8 border-border hover:bg-muted/50 font-semibold tracking-wider text-xs rounded-xl transition-all hover:translate-y-[-2px]">
                  Get in Touch
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="lg:col-span-5 relative w-full aspect-[4/3] lg:aspect-auto lg:h-[480px] group"
          >
            {/* Glowing effect behind image */}
            <div className="absolute -inset-1.5 bg-gradient-to-r from-primary via-indigo-500 to-sky-500 rounded-2xl blur-md opacity-25 group-hover:opacity-40 transition duration-700 pointer-events-none" />
            
            <div className="relative w-full h-full bg-muted/40 rounded-2xl overflow-hidden border border-border/50">
              <Image 
                src="https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=2070&auto=format&fit=crop" 
                alt="BUCC Tech Collaboration"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover transition-all duration-700 scale-100 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />
            </div>
          </motion.div>

        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 border-b border-border/30 relative">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative group p-6 rounded-2xl bg-card/25 hover:bg-card/40 border border-border/40 hover:border-primary/20 transition-all duration-300 backdrop-blur-sm"
              >
                <h4 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent group-hover:from-primary group-hover:to-indigo-300 transition-all duration-300">
                  {stat.value}
                </h4>
                <p className="text-xs md:text-sm text-muted-foreground mt-2 font-medium tracking-wide">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative group bg-card/30 border border-border/50 p-8 md:p-12 space-y-6 rounded-2xl hover:border-primary/30 transition-all duration-300 backdrop-blur-md"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <h2 className="text-3xl font-sans font-bold tracking-tight">Our Mission</h2>
            <p className="text-muted-foreground font-light leading-relaxed text-sm md:text-base">
              To bridge the gap between academic theory and industry practice by providing a dynamic platform for students to develop technical skills, engage in real-world software engineering, and build an exceptional professional network.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="relative group bg-card/30 border border-border/50 p-8 md:p-12 space-y-6 rounded-2xl hover:border-indigo-500/30 transition-all duration-300 backdrop-blur-md"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <h2 className="text-3xl font-sans font-bold tracking-tight">Our Vision</h2>
            <p className="text-muted-foreground font-light leading-relaxed text-sm md:text-base">
              To be the leading tech incubator and student community in the nation, nurturing innovative leaders, engineers, and creators who shape the future of technology and build systems with lasting social impact.
            </p>
          </motion.div>

        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 px-6 bg-muted/5 border-y border-border/30 relative">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <Badge className="bg-primary/5 text-primary border border-primary/20 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em]">
              Foundations
            </Badge>
            <h3 className="text-3xl md:text-4xl font-sans font-bold tracking-tight text-foreground">
              What Drives Our Community
            </h3>
            <p className="text-muted-foreground font-light text-sm max-w-md mx-auto">
              These fundamental principles guide our daily operations, workshop syllabus, and leadership culture.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreValues.map((value, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
              >
                <Card className="border-border/50 relative overflow-hidden h-full shadow-none bg-card/20 hover:bg-card/45 hover:border-primary/20 transition-all duration-300 group backdrop-blur-sm">
                  {/* Hover light up background */}
                  <div className={`absolute inset-0 bg-gradient-to-b ${value.glow} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />
                  
                  <CardContent className="p-8 space-y-4 relative z-10">
                    <h4 className="text-xl font-bold tracking-tight group-hover:text-primary transition-colors">{value.title}</h4>
                    <p className="text-xs md:text-sm text-muted-foreground font-light leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* The BUCCian Journey */}
      <section className="py-24 px-6 max-w-5xl mx-auto relative">
        <div className="text-center space-y-4 max-w-2xl mx-auto mb-20">
          <Badge className="bg-sky-500/10 text-sky-400 border border-sky-500/20 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em]">
            Roadmap
          </Badge>
          <h3 className="text-3xl md:text-4xl font-sans font-bold tracking-tight text-foreground">
            The BUCCian Student Journey
          </h3>
          <p className="text-muted-foreground font-light text-sm max-w-md mx-auto">
            How we guide students through progressive steps of personal, career, and leadership growth.
          </p>
        </div>

        <div className="relative border-l border-border/80 ml-4 md:ml-8 space-y-12">
          {journeySteps.map((step, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="relative pl-8 md:pl-12 group"
            >
              {/* Timeline marker */}
              <div className="absolute left-[-13px] top-0 w-6 h-6 rounded-full bg-background border-2 border-primary flex items-center justify-center group-hover:scale-125 transition-transform duration-300 z-10">
                <div className="w-2 h-2 rounded-full bg-primary" />
              </div>
              
              <div className={`p-6 md:p-8 rounded-2xl bg-card/20 hover:bg-card/30 border ${step.color} transition-all duration-300 backdrop-blur-sm relative overflow-hidden`}>
                <div className="absolute top-4 right-6 text-5xl font-extrabold text-foreground/5 font-mono select-none">
                  {step.phase}
                </div>
                <div className="flex flex-col gap-2 mb-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary/80">
                    {step.subtitle}
                  </span>
                  <h4 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                    {step.title}
                  </h4>
                </div>
                <p className="text-sm text-muted-foreground font-light leading-relaxed max-w-3xl">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* The Ecosystem (Links to other sections) */}
      <section className="py-24 px-6 max-w-6xl mx-auto space-y-16 border-t border-border/30">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <Badge className="bg-purple-500/10 text-purple-400 border border-purple-500/20 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em]">
            Governance
          </Badge>
          <h3 className="text-3xl md:text-4xl font-sans font-bold tracking-tight text-foreground">
            A Structured Ecosystem
          </h3>
          <p className="text-muted-foreground font-light text-sm max-w-md mx-auto">
            BUCC operates as a professional, multi-tiered organization led by dedicated student heads and academic advisors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/executive-body" className="group block h-full">
              <div className="relative overflow-hidden bg-card/20 hover:bg-card/45 border border-border/60 p-8 rounded-2xl h-full flex flex-col justify-between hover:border-primary/20 transition-all duration-300 backdrop-blur-sm">
                <div className="space-y-4">
                  <h4 className="text-xl font-bold tracking-tight group-hover:text-primary transition-colors">Executive Body</h4>
                  <p className="text-xs md:text-sm text-muted-foreground font-light leading-relaxed">
                    Meet the panel and student leaders coordinating club operations, communications, and strategy.
                  </p>
                </div>
                <div className="flex items-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors pt-6 border-t border-border/40 mt-8">
                  Meet the Team <ArrowRight className="ml-2 w-3 h-3 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Link href="/advisors" className="group block h-full">
              <div className="relative overflow-hidden bg-card/20 hover:bg-card/45 border border-border/60 p-8 rounded-2xl h-full flex flex-col justify-between hover:border-indigo-500/20 transition-all duration-300 backdrop-blur-sm">
                <div className="space-y-4">
                  <h4 className="text-xl font-bold tracking-tight group-hover:text-indigo-400 transition-colors">Faculty Advisors</h4>
                  <p className="text-xs md:text-sm text-muted-foreground font-light leading-relaxed">
                    Learn about the distinguished faculty panel offering mentorship and continuous guidance to the club.
                  </p>
                </div>
                <div className="flex items-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors pt-6 border-t border-border/40 mt-8">
                  Meet the Advisors <ArrowRight className="ml-2 w-3 h-3 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="relative overflow-hidden bg-card/20 hover:bg-card/45 border border-border/60 p-8 rounded-2xl h-full flex flex-col justify-between hover:border-sky-500/20 transition-all duration-300 backdrop-blur-sm group">
              <div className="space-y-4">
                <h4 className="text-xl font-bold tracking-tight group-hover:text-sky-400 transition-colors">Departments & Wings</h4>
                <p className="text-xs md:text-sm text-muted-foreground font-light leading-relaxed">
                  Explore our active divisions spanning Development, Creative Design, Marketing, and Operations.
                </p>
              </div>
              <Link href="/#departments-and-wings" className="flex items-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors pt-6 border-t border-border/40 mt-8 cursor-pointer">
                Explore on Home <ArrowRight className="ml-2 w-3 h-3 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6 border-t border-border/30 relative">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
          <h2 className="text-4xl md:text-5xl font-sans font-bold tracking-tight">
            Ready to Begin Your Story?
          </h2>
          <p className="text-base md:text-lg text-muted-foreground font-light max-w-2xl mx-auto leading-relaxed">
            Become a part of the most dynamic tech community at BRAC University. Upgrade your mind, build your career, and discover your potential.
          </p>
          <div className="pt-4">
             <Link href="/registration">
              <Button className="h-14 px-10 bg-primary hover:bg-primary/95 text-primary-foreground font-bold uppercase tracking-widest text-xs rounded-xl shadow-lg shadow-primary/25 transition-transform hover:scale-[1.03]">
                Apply for Membership
              </Button>
             </Link>
          </div>
        </div>
      </section>
    </div>
  );
}


