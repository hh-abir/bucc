import dbConnect from "@/lib/dbConnect";
import User from "@/model/User";
import Project from "@/model/Project";
import Blog from "@/model/Blog";
import Testimonial from "@/model/Testimonial";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import TestimonialDialog from "@/components/TestimonialDialog";
import ReactMarkdown from "react-markdown";
import { ExpandableHeight, ExpandableList } from "@/components/ExpandableSection";
import { 
  User as UserIcon, 
  MapPin, 
  Briefcase, 
  Mail, 
  Phone,
  ArrowRight,
  Globe, 
  Facebook, 
  Github, 
  Linkedin, 
  FileText, 
  ExternalLink,
  Code,
  Calendar,
  ChevronRight,
  Quote
} from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const decodeObfuscatedId = (obfuscated: string): string => {
  if (!obfuscated || obfuscated.length !== 24) return "";
  const hex = "0123456789abcdef";
  const reversed = obfuscated.toLowerCase().split("").reverse().join("");
  let original = "";
  for (let i = 0; i < reversed.length; i++) {
    const char = reversed[i];
    const index = hex.indexOf(char);
    if (index !== -1) {
      original += hex[(index + 11) % 16];
    } else {
      original += char;
    }
  }
  return original;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    await dbConnect();
    let queryCondition: any = {
      $or: [
        { profileSlug: slug.toLowerCase(), isPublicProfile: true }
      ]
    };
    if (slug.length === 24) {
      const decodedId = decodeObfuscatedId(slug);
      if (/^[0-9a-fA-F]{24}$/.test(decodedId)) {
        queryCondition.$or.push({ _id: decodedId });
      }
    }
    if (slug.toLowerCase().startsWith("bucc-")) {
      const parts = slug.split("-");
      if (parts.length >= 3) {
        const year = parts[1];
        const suffix = parts[2];
        const shortYear = year.slice(-2);
        queryCondition.$or.push(
          { studentId: { $regex: new RegExp(`^${shortYear}.*${suffix}$`) } },
          { studentId: { $regex: new RegExp(`^${year}.*${suffix}$`) } }
        );
      }
    }
    const user = await User.findOne(queryCondition).lean() as any;
    if (!user) {
      return {
        title: "Profile Not Found | BUCC",
      };
    }
    return {
      title: `${user.name} | BUCC Profile`,
      description: user.bio || `Explore projects, publications, and club activities of ${user.name} (${user.designation} at BUCC).`,
      openGraph: {
        title: `${user.name} - BUCC Member Profile`,
        description: user.bio || `${user.designation} in the ${user.buccDepartment} Department at BRAC University Computer Club.`,
        type: "profile",
        images: [
          {
            url: user.image || "/assets/bucc-icon.svg",
            width: 400,
            height: 400,
            alt: user.name,
          },
        ],
      },
    };
  } catch (e) {
    return {
      title: "Member Profile | BUCC",
    };
  }
}

export default async function MemberProfilePage({ params }: PageProps) {
  const { slug } = await params;

  await dbConnect();

  let queryCondition: any = {
    $or: [
      { profileSlug: slug.toLowerCase(), isPublicProfile: true }
    ]
  };
  if (slug.length === 24) {
    const decodedId = decodeObfuscatedId(slug);
    if (/^[0-9a-fA-F]{24}$/.test(decodedId)) {
      queryCondition.$or.push({ _id: decodedId });
    }
  }
  if (slug.toLowerCase().startsWith("bucc-")) {
    const parts = slug.split("-");
    if (parts.length >= 3) {
      const year = parts[1];
      const suffix = parts[2];
      const shortYear = year.slice(-2);
      queryCondition.$or.push(
        { studentId: { $regex: new RegExp(`^${shortYear}.*${suffix}$`) } },
        { studentId: { $regex: new RegExp(`^${year}.*${suffix}$`) } }
      );
    }
  }
  // 1. Fetch User details
  const user = await User.findOne(queryCondition).lean() as any;

  if (!user) {
    return notFound();
  }

  const githubUsername = user.memberSocials?.Github
    ? user.memberSocials.Github.replace(/^https?:\/\/(www\.)?github\.com\//, "").replace(/\/$/, "").trim()
    : null;

  // 2. Fetch Projects (approved only) if enabled
  const projects = (user.showProjects ?? true)
    ? await Project.find({ $or: [{ author: user._id }, { contributors: user._id }], status: "approved" }).sort({ createdAt: -1 }).lean() as any[]
    : [];
  const displayedProjects = projects.slice(0, 4);
  const hasMoreProjects = projects.length > 4;

  // 3. Fetch Blogs (published only) if enabled
  const blogs = (user.showBlogs ?? true)
    ? await Blog.find({ "author.authorId": user._id, status: "published" }).sort({ createdDate: -1 }).lean() as any[]
    : [];
  const displayedBlogs = blogs.slice(0, 4);
  const hasMoreBlogs = blogs.length > 4;

  // 4. Fetch Testimonials (approved only) if enabled
  const testimonials = (user.showTestimonials ?? true)
    ? await Testimonial.find({ targetMember: user._id, isApproved: true }).populate({
        path: "author",
        select: "name designation image buccDepartment"
      }).sort({ createdAt: -1 }).lean() as any[]
    : [];

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Cover Image Banner */}
      {user.coverImage ? (
        <div className="h-60 md:h-80 w-full relative border-b border-border bg-muted overflow-hidden">
          <img 
            src={user.coverImage} 
            alt={`${user.name}'s Cover`} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />
        </div>
      ) : (
        <div className="h-32 w-full bg-muted/20 border-b border-border" />
      )}

      {/* Hero Section */}
      <section className="bg-muted/10 border-b border-border relative">
        <div className="mx-auto max-w-6xl px-6 pb-12 pt-6">
          <div className="flex flex-col md:flex-row gap-10 items-start md:items-end -mt-20 md:-mt-24 relative z-10">
            
            {/* Avatar */}
            <div className="h-32 w-32 md:h-40 md:w-40 rounded-full border-4 border-background overflow-hidden bg-muted flex-shrink-0 relative shadow-md">
              {user.image ? (
                <Image 
                  src={user.image} 
                  alt={user.name} 
                  fill 
                  sizes="(max-width: 768px) 128px, 160px"
                  className="object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center">
                  <UserIcon className="w-12 h-12 text-muted-foreground/30" />
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="space-y-4 flex-1">
              <div className="space-y-1.5">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary md:text-white/80 md:drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                  BUCC Member Profile
                </p>
                <h1 className="font-serif text-4xl md:text-5xl tracking-tight leading-none text-foreground font-bold md:text-white md:drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
                  {user.name}
                </h1>
                <p className="text-lg text-muted-foreground font-light md:text-white/90 md:drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                  {user.designation} • {user.buccDepartment}
                  {user.currentJob && ` | ${user.currentJob}`}
                </p>
              </div>

              {/* Socials & Actions */}
              <div className="flex flex-wrap items-center gap-4 pt-1">
                {user.cvLink && (
                  <a 
                    href={user.cvLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-foreground text-background text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-all rounded-sm"
                  >
                    <FileText className="w-3.5 h-3.5" /> View CV
                  </a>
                )}

                {(user.showTestimonials ?? true) && (
                  <TestimonialDialog 
                    targetMemberId={user._id.toString()} 
                    targetMemberName={user.name} 
                  />
                )}

                {/* Social media icons */}
                <div className="flex items-center gap-3 text-muted-foreground">
                  {user.memberSocials?.Github && (
                    <a 
                      href={user.memberSocials.Github.startsWith("http") ? user.memberSocials.Github : `https://github.com/${user.memberSocials.Github}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:text-foreground transition-colors p-1"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                  {user.memberSocials?.Linkedin && (
                    <a 
                      href={user.memberSocials.Linkedin.startsWith("http") ? user.memberSocials.Linkedin : `https://linkedin.com/in/${user.memberSocials.Linkedin}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:text-foreground transition-colors p-1"
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                  )}
                  {user.memberSocials?.Facebook && (
                    <a 
                      href={user.memberSocials.Facebook.startsWith("http") ? user.memberSocials.Facebook : `https://facebook.com/${user.memberSocials.Facebook}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:text-foreground transition-colors p-1"
                    >
                      <Facebook className="w-4 h-4" />
                    </a>
                  )}
                  {user.email && (
                    <a 
                      href={`mailto:${user.personalEmail && user.showPersonalEmail ? user.personalEmail : user.email}`}
                      className="hover:text-foreground transition-colors p-1"
                      title={user.personalEmail && user.showPersonalEmail ? user.personalEmail : user.email}
                    >
                      <Mail className="w-4 h-4" />
                    </a>
                  )}
                  {user.showPhoneNumber && user.phoneNumber && (
                    <a 
                      href={`tel:${user.phoneNumber}`}
                      className="hover:text-foreground transition-colors p-1"
                      title={user.phoneNumber}
                    >
                      <Phone className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Quick stats / Monospace metadata */}
            <div className="w-full md:w-auto shrink-0 bg-muted/40 p-5 border border-border/60 rounded-sm font-mono text-xs space-y-2">
              {user.email && (
                <div>
                  <span className="text-muted-foreground block text-[9px] uppercase tracking-wider font-bold">Email</span>
                  <a href={`mailto:${user.personalEmail && user.showPersonalEmail ? user.personalEmail : user.email}`} className="text-foreground font-bold block mt-0.5 hover:underline">
                    {user.personalEmail && user.showPersonalEmail ? user.personalEmail : user.email}
                  </a>
                </div>
              )}
              {user.showPhoneNumber && user.phoneNumber && (
                <div>
                  <span className="text-muted-foreground block text-[9px] uppercase tracking-wider font-bold">Phone</span>
                  <a href={`tel:${user.phoneNumber}`} className="text-foreground font-bold block mt-0.5 hover:underline">
                    {user.phoneNumber}
                  </a>
                </div>
              )}
              {user.joinedBucc && (
                <div>
                  <span className="text-muted-foreground block text-[9px] uppercase tracking-wider font-bold">Joined Club</span>
                  <span className="text-foreground font-bold block mt-0.5">{user.joinedBucc}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <div className="mx-auto max-w-6xl px-6 pt-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Side: Bio & Skills */}
        <div className="lg:col-span-4 space-y-12">
          {/* Biography */}
          {user.bio && (
            <section className="space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground border-b border-border pb-2">
                Biography
              </h2>
              <p className="text-muted-foreground leading-relaxed font-light text-sm whitespace-pre-line">
                {user.bio}
              </p>
            </section>
          )}

          {/* Skills */}
          {user.memberSkills && user.memberSkills.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground border-b border-border pb-2">
                Skills & Expertise
              </h2>
              <div className="flex flex-wrap gap-2 pt-1">
                {user.memberSkills.map((skill: string, i: number) => (
                  <span 
                    key={i} 
                    className="px-2.5 py-1 border border-border/80 text-[10px] uppercase font-bold tracking-wider text-foreground/80 hover:border-foreground/30 transition-all cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Recent Activity Section */}
          {(user.showRecentActivity ?? true) && user.recentActivity && (
            <section className="space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground border-b border-border pb-2">
                Recent Activity
              </h2>
              <div className="pt-2">
                <ExpandableList limit={3}>
                  {user.recentActivity
                    .split("\n")
                    .map((line: string) => line.trim())
                    .filter((line: string) => line !== "")
                    .map((line: string, idx: number) => {
                      const cleanLine = line.replace(/^[-*•]\s*/, "");
                      return (
                        <li key={idx} className="flex items-start gap-3 text-sm text-muted-foreground font-light leading-relaxed">
                          <span className="w-1.5 h-1.5 bg-foreground/60 rounded-full mt-2 shrink-0" />
                          <div className="flex-1">
                            <ReactMarkdown
                              allowedElements={["p", "strong", "em", "code", "a"]}
                              components={{
                                p: ({ children }) => <span className="inline">{children}</span>,
                                a: ({ node, ...props }) => <a className="underline hover:text-foreground transition-colors" target="_blank" rel="noopener noreferrer" {...props} />,
                                strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
                                code: ({ children }) => <code className="bg-muted px-1 py-0.5 rounded font-mono text-xs text-foreground">{children}</code>,
                              }}
                            >
                              {cleanLine}
                            </ReactMarkdown>
                          </div>
                        </li>
                      );
                    })}
                </ExpandableList>
              </div>
            </section>
          )}

          {/* GitHub Coding Activity Widget */}
          {(user.showGithubStats ?? true) && githubUsername && (
            <section className="space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground border-b border-border pb-2">
                Coding Activity
              </h2>
              <div className="pt-2 border border-border/80 bg-card p-4 rounded-sm flex flex-col items-center justify-center">
                <img 
                  src={`https://ghchart.rshah.org/000000/${githubUsername}`}
                  alt={`${user.name}'s GitHub Contributions`}
                  className="w-full h-auto dark:invert transition-all"
                  loading="lazy"
                />
                <span className="text-[9px] text-muted-foreground/60 font-mono mt-2.5 block text-center">
                  @github/{githubUsername} contributions
                </span>
              </div>
            </section>
          )}
        </div>

        {/* Right Side: Showcase (Projects, Blogs, Testimonials) */}
        <div className="lg:col-span-8 space-y-16">
          
          {/* Experience Section */}
          {(user.showExperience ?? true) && user.experience && (
            <section className="space-y-6">
              <div className="flex items-center gap-4">
                <h2 className="font-serif text-2xl font-bold tracking-tight text-foreground shrink-0">Work & Experience</h2>
                <div className="h-px w-full bg-border/60" />
              </div>
              <div className="p-6 border border-border bg-card rounded-sm">
                <ExpandableHeight maxCollapsedHeight={320}>
                  <div className="text-muted-foreground leading-relaxed font-light text-sm">
                    <ReactMarkdown 
                      components={{
                        h1: ({ node, ...props }) => <h3 className="font-serif text-xl font-bold text-foreground mt-6 mb-3 border-b border-border pb-1" {...props} />,
                        h2: ({ node, ...props }) => <h4 className="font-serif text-lg font-bold text-foreground mt-5 mb-2" {...props} />,
                        h3: ({ node, ...props }) => <h5 className="font-serif text-base font-bold text-foreground mt-4 mb-2" {...props} />,
                        p: ({ node, ...props }) => <p className="mb-4 last:mb-0" {...props} />,
                        ul: ({ node, ...props }) => <ul className="list-disc pl-5 my-4 space-y-2 text-muted-foreground" {...props} />,
                        ol: ({ node, ...props }) => <ol className="list-decimal pl-5 my-4 space-y-2 text-muted-foreground" {...props} />,
                        li: ({ node, ...props }) => <li className="pl-1" {...props} />,
                        strong: ({ node, ...props }) => <strong className="font-bold text-foreground" {...props} />,
                        em: ({ node, ...props }) => <em className="italic" {...props} />,
                        a: ({ node, ...props }) => <a className="underline hover:text-foreground transition-colors font-medium" target="_blank" rel="noopener noreferrer" {...props} />,
                        code: ({ node, ...props }) => <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-xs text-foreground" {...props} />,
                      }}
                    >
                      {user.experience}
                    </ReactMarkdown>
                  </div>
                </ExpandableHeight>
              </div>
            </section>
          )}

          {/* Education Section */}
          {(user.showEducation ?? true) && user.education && (
            <section className="space-y-6">
              <div className="flex items-center gap-4">
                <h2 className="font-serif text-2xl font-bold tracking-tight text-foreground shrink-0">Education</h2>
                <div className="h-px w-full bg-border/60" />
              </div>
              <div className="p-6 border border-border bg-card rounded-sm">
                <ExpandableHeight maxCollapsedHeight={200}>
                  <div className="text-muted-foreground leading-relaxed font-light text-sm">
                    <ReactMarkdown 
                      components={{
                        h1: ({ node, ...props }) => <h3 className="font-serif text-xl font-bold text-foreground mt-6 mb-3 border-b border-border pb-1" {...props} />,
                        h2: ({ node, ...props }) => <h4 className="font-serif text-lg font-bold text-foreground mt-5 mb-2" {...props} />,
                        h3: ({ node, ...props }) => <h5 className="font-serif text-base font-bold text-foreground mt-4 mb-2" {...props} />,
                        p: ({ node, ...props }) => <p className="mb-4 last:mb-0" {...props} />,
                        ul: ({ node, ...props }) => <ul className="list-disc pl-5 my-4 space-y-2 text-muted-foreground" {...props} />,
                        ol: ({ node, ...props }) => <ol className="list-decimal pl-5 my-4 space-y-2 text-muted-foreground" {...props} />,
                        li: ({ node, ...props }) => <li className="pl-1" {...props} />,
                        strong: ({ node, ...props }) => <strong className="font-bold text-foreground" {...props} />,
                        em: ({ node, ...props }) => <em className="italic" {...props} />,
                        a: ({ node, ...props }) => <a className="underline hover:text-foreground transition-colors font-medium" target="_blank" rel="noopener noreferrer" {...props} />,
                        code: ({ node, ...props }) => <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-xs text-foreground" {...props} />,
                      }}
                    >
                      {user.education}
                    </ReactMarkdown>
                  </div>
                </ExpandableHeight>
              </div>
            </section>
          )}

          {/* Achievements Section */}
          {(user.showAchievements ?? true) && user.achievements && (
            <section className="space-y-6">
              <div className="flex items-center gap-4">
                <h2 className="font-serif text-2xl font-bold tracking-tight text-foreground shrink-0">Achievements</h2>
                <div className="h-px w-full bg-border/60" />
              </div>
              <div className="p-6 border border-border bg-card rounded-sm">
                <ExpandableHeight maxCollapsedHeight={200}>
                  <div className="text-muted-foreground leading-relaxed font-light text-sm">
                    <ReactMarkdown 
                      components={{
                        h1: ({ node, ...props }) => <h3 className="font-serif text-xl font-bold text-foreground mt-6 mb-3 border-b border-border pb-1" {...props} />,
                        h2: ({ node, ...props }) => <h4 className="font-serif text-lg font-bold text-foreground mt-5 mb-2" {...props} />,
                        h3: ({ node, ...props }) => <h5 className="font-serif text-base font-bold text-foreground mt-4 mb-2" {...props} />,
                        p: ({ node, ...props }) => <p className="mb-4 last:mb-0" {...props} />,
                        ul: ({ node, ...props }) => <ul className="list-disc pl-5 my-4 space-y-2 text-muted-foreground" {...props} />,
                        ol: ({ node, ...props }) => <ol className="list-decimal pl-5 my-4 space-y-2 text-muted-foreground" {...props} />,
                        li: ({ node, ...props }) => <li className="pl-1" {...props} />,
                        strong: ({ node, ...props }) => <strong className="font-bold text-foreground" {...props} />,
                        em: ({ node, ...props }) => <em className="italic" {...props} />,
                        a: ({ node, ...props }) => <a className="underline hover:text-foreground transition-colors font-medium" target="_blank" rel="noopener noreferrer" {...props} />,
                        code: ({ node, ...props }) => <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-xs text-foreground" {...props} />,
                      }}
                    >
                      {user.achievements}
                    </ReactMarkdown>
                  </div>
                </ExpandableHeight>
              </div>
            </section>
          )}

          {/* Certifications Section */}
          {(user.showCertifications ?? true) && user.certifications && (
            <section className="space-y-6">
              <div className="flex items-center gap-4">
                <h2 className="font-serif text-2xl font-bold tracking-tight text-foreground shrink-0">Certifications</h2>
                <div className="h-px w-full bg-border/60" />
              </div>
              <div className="p-6 border border-border bg-card rounded-sm">
                <ExpandableHeight maxCollapsedHeight={200}>
                  <div className="text-muted-foreground leading-relaxed font-light text-sm">
                    <ReactMarkdown 
                      components={{
                        h1: ({ node, ...props }) => <h3 className="font-serif text-xl font-bold text-foreground mt-6 mb-3 border-b border-border pb-1" {...props} />,
                        h2: ({ node, ...props }) => <h4 className="font-serif text-lg font-bold text-foreground mt-5 mb-2" {...props} />,
                        h3: ({ node, ...props }) => <h5 className="font-serif text-base font-bold text-foreground mt-4 mb-2" {...props} />,
                        p: ({ node, ...props }) => <p className="mb-4 last:mb-0" {...props} />,
                        ul: ({ node, ...props }) => <ul className="list-disc pl-5 my-4 space-y-2 text-muted-foreground" {...props} />,
                        ol: ({ node, ...props }) => <ol className="list-decimal pl-5 my-4 space-y-2 text-muted-foreground" {...props} />,
                        li: ({ node, ...props }) => <li className="pl-1" {...props} />,
                        strong: ({ node, ...props }) => <strong className="font-bold text-foreground" {...props} />,
                        em: ({ node, ...props }) => <em className="italic" {...props} />,
                        a: ({ node, ...props }) => <a className="underline hover:text-foreground transition-colors font-medium" target="_blank" rel="noopener noreferrer" {...props} />,
                        code: ({ node, ...props }) => <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-xs text-foreground" {...props} />,
                      }}
                    >
                      {user.certifications}
                    </ReactMarkdown>
                  </div>
                </ExpandableHeight>
              </div>
            </section>
          )}

          {/* Projects Showcased */}
          {(user.showProjects ?? true) && (
            <section className="space-y-8">
              <div className="flex items-center gap-4">
                <h2 className="font-serif text-2xl font-bold tracking-tight text-foreground shrink-0">Projects Showcase</h2>
                <div className="h-px w-full bg-border/60" />
              </div>

              {projects.length === 0 ? (
                <div className="py-10 text-center border border-dashed border-border rounded-sm">
                  <p className="text-sm text-muted-foreground font-serif italic">No projects showcase added yet.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {displayedProjects.map((project) => (
                      <div key={project._id.toString()} className="group border border-border p-5 hover:border-primary/30 transition-colors flex flex-col justify-between bg-card">
                        <div className="space-y-4">
                          {project.coverImage && (
                            <div className="aspect-[16/9] w-full bg-muted overflow-hidden relative border border-border">
                              <img 
                                src={project.coverImage} 
                                alt={project.title} 
                                className="object-cover h-full w-full transition-transform duration-500 group-hover:scale-102"
                              />
                            </div>
                          )}
                          <div className="space-y-2">
                            <h3 className="font-serif text-lg font-bold group-hover:text-primary transition-colors">
                              {project.title}
                            </h3>
                            <p className="text-xs text-muted-foreground font-light line-clamp-2 leading-relaxed">
                              {project.shortDescription}
                            </p>
                          </div>
                        </div>

                        <div className="pt-4 flex items-center justify-between mt-auto">
                          <div className="flex flex-wrap gap-1">
                            {project.techStack?.slice(0, 3).map((tech: string, j: number) => (
                              <span key={j} className="text-[9px] font-mono px-1.5 py-0.5 bg-muted text-muted-foreground/80">
                                {tech}
                              </span>
                            ))}
                          </div>
                          <Link 
                            href={`/projects/${project.slug}`} 
                            className="inline-flex items-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
                          >
                            View Project <ChevronRight className="w-3 h-3 ml-0.5" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {hasMoreProjects && (
                    <div className="pt-2 flex justify-center">
                      <Link 
                        href={`/projects?author=${user._id.toString()}`}
                        className="inline-flex items-center gap-2 px-6 py-3 border border-border text-[10px] font-bold uppercase tracking-widest hover:bg-muted/40 transition-all text-foreground bg-background rounded-sm"
                      >
                        View All Projects ({projects.length}) <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </section>
          )}

          {/* Blogs Published */}
          {(user.showBlogs ?? true) && (
            <section className="space-y-8">
              <div className="flex items-center gap-4">
                <h2 className="font-serif text-2xl font-bold tracking-tight text-foreground shrink-0">Publications</h2>
                <div className="h-px w-full bg-border/60" />
              </div>

              {blogs.length === 0 ? (
                <div className="py-10 text-center border border-dashed border-border rounded-sm">
                  <p className="text-sm text-muted-foreground font-serif italic">No publications recorded yet.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {displayedBlogs.map((blog) => (
                    <div key={blog._id.toString()} className="group flex flex-col md:flex-row gap-6 p-4 border border-border hover:border-primary/20 bg-muted/10 transition-colors">
                      {blog.featuredImage && (
                        <div className="aspect-[16/10] md:w-32 bg-muted overflow-hidden relative border border-border shrink-0">
                          <img 
                            src={blog.featuredImage} 
                            alt={blog.title} 
                            className="object-cover h-full w-full group-hover:scale-102 transition-transform duration-500"
                          />
                        </div>
                      )}
                      <div className="flex flex-col justify-between flex-grow space-y-2">
                        <div className="space-y-1">
                          <span className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground">
                            {blog.category || "Article"} • {new Date(blog.createdDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </span>
                          <h3 className="font-serif text-lg font-bold group-hover:text-primary transition-colors leading-tight">
                            {blog.title}
                          </h3>
                          <p className="text-xs text-muted-foreground font-light line-clamp-2">
                            {blog.description}
                          </p>
                        </div>
                        <Link 
                          href={`/blogs/${blog._id.toString()}`} 
                          className="inline-flex items-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors self-start border-b border-transparent hover:border-foreground/30 pb-0.5 pt-2"
                        >
                          Read Article <ChevronRight className="w-3 h-3 ml-0.5" />
                        </Link>
                      </div>
                    </div>
                  ))}

                  {hasMoreBlogs && (
                    <div className="pt-2 flex justify-center">
                      <Link 
                        href={`/blogs?author=${user._id.toString()}`}
                        className="inline-flex items-center gap-2 px-6 py-3 border border-border text-[10px] font-bold uppercase tracking-widest hover:bg-muted/40 transition-all text-foreground bg-background rounded-sm"
                      >
                        View All Publications ({blogs.length}) <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </section>
          )}

          {/* Testimonials section */}
          {(user.showTestimonials ?? true) && testimonials.length > 0 && (
            <section className="space-y-8">
              <div className="flex items-center gap-4">
                <h2 className="font-serif text-2xl font-bold tracking-tight text-foreground shrink-0">Recommendations</h2>
                <div className="h-px w-full bg-border/60" />
              </div>

              <div className="grid grid-cols-1 gap-6">
                {testimonials.map((testimonial) => {
                  const author = testimonial.author || {};
                  return (
                    <div 
                      key={testimonial._id.toString()} 
                      className="border border-border p-6 bg-card relative space-y-4"
                    >
                      <Quote className="absolute top-4 right-4 w-8 h-8 text-muted-foreground/10" />
                      <p className="text-sm text-muted-foreground font-light leading-relaxed italic pr-8">
                        "{testimonial.content}"
                      </p>
                      
                      <div className="flex items-center gap-3 pt-2 border-t border-border/40">
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-muted relative shrink-0 border border-border">
                          {author.image ? (
                            <img src={author.image} alt={author.name} className="object-cover h-full w-full" />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center">
                              <UserIcon className="w-4 h-4 text-muted-foreground/30" />
                            </div>
                          )}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-foreground">{author.name || "BUCC Representative"}</h4>
                          <p className="text-[10px] text-muted-foreground tracking-tight">
                            {testimonial.relationship}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
          
        </div>
      </div>
    </div>
  );
}
