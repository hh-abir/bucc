import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { departmentsInfo } from "@/constants/departments";
import { allExecutiveBodies } from "@/constants/all-executive-body";
import { ArrowLeft, Users, Target, Info, Sparkles } from "lucide-react";

export async function generateStaticParams() {
  return departmentsInfo.map((dept) => ({
    slug: dept.url.split("/").pop(),
  }));
}


export default async function DepartmentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const department = departmentsInfo.find((d) => d.url.split("/").pop() === slug);

  if (!department) {
    notFound();
  }

  // Get 2026 members for this department
  const currentMembers = allExecutiveBodies["2026"]?.filter(
    (m) => m.department.toLowerCase().includes(department.name.toLowerCase()) || 
           department.name.toLowerCase().includes(m.department.toLowerCase())
  ) || [];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Hero Section */}
      <section className="relative h-[65vh] min-h-[500px] w-full overflow-hidden border-b border-border">
        <Image
          src={department.image}
          alt={department.name}
          fill
          sizes="100vw"
          className="object-cover brightness-[0.7]"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-7xl mx-auto px-6 w-full pb-20 space-y-8">
            <Link 
              href="/" 
              className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-white/70 hover:text-white transition-colors group"
            >
              <ArrowLeft className="mr-2 w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Home
            </Link>
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-[0.4em] text-white/60">Department Overview</span>
              <h1 className="text-5xl md:text-8xl font-serif font-bold text-white tracking-tight leading-none">
                {department.name}
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 pt-24 space-y-32">
        
        {/* Mission Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          <div className="lg:col-span-8 space-y-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 border border-border bg-muted/30 rounded-full">
              <Target className="w-4 h-4 text-muted-foreground" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">The Mission</span>
            </div>
            <p className="text-2xl md:text-3xl text-foreground font-serif font-light leading-relaxed">
              {department.description}
            </p>
          </div>
          <div className="lg:col-span-4 space-y-8 p-10 bg-muted/20 border border-border rounded-xl">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-muted-foreground/60" />
              <h3 className="text-sm font-bold uppercase tracking-widest">Key Focus Areas</h3>
            </div>
            <ul className="space-y-6">
              {[
                "Strategic Collaboration",
                "Skill Enhancement",
                "Community Engagement",
                "Technical Innovation"
              ].map((item) => (
                <li key={item} className="flex items-center gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-foreground shrink-0" />
                  <span className="text-sm text-foreground/80 font-medium tracking-wide">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Highlighted Leadership Section */}
        <section className="space-y-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-border pb-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 border border-border bg-muted/30 rounded-full">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Leadership Team</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-serif font-medium">Driving Innovation in 2026</h2>
            </div>
            <p className="text-muted-foreground font-light max-w-sm text-right hidden md:block">
              Meet the visionary minds leading {department.name} towards excellence.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
            {currentMembers.length > 0 ? (
              currentMembers.map((member, i) => (
                <div key={i} className="group space-y-6">
                  <div className="relative aspect-[4/5] w-full overflow-hidden bg-muted border border-border">
                    <Image
                      src={member.image}
                      alt={member.fullName}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-xl font-serif font-medium group-hover:text-foreground transition-colors">
                      {member.fullName}
                    </h4>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
                      {member.designation}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center border border-dashed border-border rounded-xl">
                <p className="text-muted-foreground font-light italic">
                  Leadership information for this department is currently being finalized for 2026.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 border-t border-border">
          <div className="max-w-3xl mx-auto text-center space-y-12">
            <div className="space-y-6">
              <h3 className="text-3xl md:text-5xl font-serif font-light">Be part of the {department.name} legacy.</h3>
              <p className="text-muted-foreground font-light text-lg">
                Join our mission to push the boundaries of technology and creativity. 
                Applications for new memberships are currently open.
              </p>
            </div>
            <Link 
              href="/registration"
              className="inline-flex items-center justify-center px-12 py-5 bg-foreground text-background font-medium transition-all hover:opacity-90 active:scale-[0.98] text-lg"
            >
              Apply to Join
            </Link>
          </div>
        </section>

      </div>

      {/* Decorative Blur Elements */}
      <div className="fixed top-1/4 -left-24 w-96 h-96 bg-muted/20 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="fixed bottom-1/4 -right-24 w-96 h-96 bg-muted/20 rounded-full blur-3xl -z-10 pointer-events-none" />
    </div>
  );
}
