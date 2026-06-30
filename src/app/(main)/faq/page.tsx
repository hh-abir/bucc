"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle, Users, Calendar, Briefcase, Mail } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const faqCategories = [
  {
    id: "membership",
    title: "Membership & Recruitment",
    icon: Users,
    questions: [
      {
        q: "When does BUCC usually recruit new members?",
        a: "BUCC typically opens its recruitment phase at the beginning of the major academic semesters (usually Spring and Fall). Keep an eye on our official Facebook page and this portal's homepage for exact dates and announcements."
      },
      {
        q: "Do I have to be a Computer Science student to join?",
        a: "Not at all! While we are the Computer Club, we welcome students from all disciplines. Departments like Creative, Event Management, Human Resources, and Finance heavily rely on skills outside of programming. Passion and dedication are what matter most."
      },
      {
        q: "What is the recruitment process like?",
        a: "The process generally involves filling out a pre-registration form, attending an introductory seminar, and participating in an interview or evaluation session based on the department you wish to join."
      },
      {
        q: "Can I be in multiple departments?",
        a: "Generally, members are assigned to one primary department where they focus their efforts and develop specialized skills. However, inter-departmental collaboration is highly encouraged during major events."
      }
    ]
  },
  {
    id: "departments",
    title: "Departments & Operations",
    icon: Briefcase,
    questions: [
      {
        q: "What are the different departments in BUCC?",
        a: "BUCC operates through 7 specialized departments: Communication & Marketing, Creative, Event Management, Finance, Human Resources, Press Release & Publications, and Research & Development."
      },
      {
        q: "What does the Research & Development (R&D) department do?",
        a: "R&D is the technical core of BUCC. Members work on software development (like building this very portal), competitive programming, hardware projects, and research in emerging fields like AI and Machine Learning."
      },
      {
        q: "I don't know how to code but I want to learn. Should I join?",
        a: "Absolutely. BUCC is a place for learning. We regularly host workshops, bootcamps, and training sessions for our members. Being part of the club gives you access to a massive network of senior students and alumni who can mentor you."
      }
    ]
  },
  {
    id: "events",
    title: "Events & Activities",
    icon: Calendar,
    questions: [
      {
        q: "What kind of events does BUCC organize?",
        a: "We organize a wide range of events including national hackathons, intra-university programming contests, tech seminars, skill development workshops, and social networking sessions for members."
      },
      {
        q: "Are BUCC events open to non-members?",
        a: "Most of our major seminars, workshops, and flagship competitions are open to all students of BRAC University. However, certain internal training sessions and social gatherings are exclusive to registered BUCC members."
      },
      {
        q: "How can I stay updated on upcoming events?",
        a: "All official events are listed on the 'Events' page of this portal. You can also follow our official Facebook and Instagram pages for real-time updates and registration links."
      }
    ]
  }
];

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState("membership");
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);

  const toggleQuestion = (q: string) => {
    setOpenQuestion(openQuestion === q ? null : q);
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Hero Section */}
      <section className="relative pt-40 pb-24 px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-muted/30" />
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
          <div className="p-4 bg-muted/50 rounded-full w-fit mx-auto border border-border">
            <HelpCircle className="w-8 h-8 text-primary" />
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-serif tracking-tight leading-[1.1] text-foreground">
              Frequently Asked Questions
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground font-light max-w-2xl mx-auto leading-relaxed">
              Everything you need to know about joining, participating, and growing with the BRAC University Computer Club.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Sidebar / Category Selection */}
          <div className="lg:col-span-4">
            <div className="sticky top-32 space-y-8">
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-6">
                Categories
              </h3>
              <div className="flex flex-col space-y-2">
                {faqCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => {
                      setActiveCategory(category.id);
                      setOpenQuestion(null);
                    }}
                    className={cn(
                      "flex items-center gap-3 px-4 py-4 rounded-md text-left transition-all duration-300",
                      activeCategory === category.id 
                        ? "bg-foreground text-background shadow-md" 
                        : "bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground border border-transparent hover:border-border"
                    )}
                  >
                    <category.icon className="w-5 h-5" />
                    <span className="font-medium text-sm">{category.title}</span>
                  </button>
                ))}
              </div>

              <div className="mt-12 bg-muted/50 border border-border p-6 rounded-xl text-center space-y-4">
                <Mail className="w-6 h-6 mx-auto text-muted-foreground" />
                <h4 className="font-serif text-lg">Still have questions?</h4>
                <p className="text-xs text-muted-foreground font-light leading-relaxed">
                  If you couldn't find the answer you were looking for, our team is always ready to help.
                </p>
                <Link href="/contact" className="block pt-2">
                  <Button variant="outline" className="w-full text-[10px] font-bold uppercase tracking-widest">
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Main FAQ Content */}
          <div className="lg:col-span-8 min-h-[500px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                {faqCategories.find(c => c.id === activeCategory)?.questions.map((faq, index) => (
                  <div 
                    key={index}
                    className="border border-border rounded-xl bg-card overflow-hidden hover:border-primary/30 transition-colors"
                  >
                    <button
                      onClick={() => toggleQuestion(faq.q)}
                      className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                    >
                      <span className="font-serif text-lg md:text-xl pr-8">{faq.q}</span>
                      <ChevronDown 
                        className={cn(
                          "w-5 h-5 text-muted-foreground transition-transform duration-300 flex-shrink-0",
                          openQuestion === faq.q ? "rotate-180 text-primary" : ""
                        )} 
                      />
                    </button>
                    
                    <AnimatePresence>
                      {openQuestion === faq.q && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                          <div className="px-6 pb-6 pt-2">
                            <div className="w-full h-px bg-border/50 mb-6" />
                            <p className="text-muted-foreground font-light leading-relaxed">
                              {faq.a}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
          
        </div>
      </section>
    </div>
  );
}
