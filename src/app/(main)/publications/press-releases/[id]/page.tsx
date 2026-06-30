import { ArrowLeft, Calendar, User, Share2, ArrowRight } from "lucide-react";
import BlockContent from "@/components/public/BlockContent";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import dbConnect from "@/lib/dbConnect";
import PressRelease from "@/model/PressRelease";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const revalidate = 7200; // Revalidate every 2 hours

async function getPressReleaseData(id: string) {
  await dbConnect();
  
  const release = await PressRelease.findById(id).lean() as any;
  if (!release || release.status !== "published") return null;

  const otherReleases = await PressRelease.find({ _id: { $ne: id }, status: "published" })
    .sort({ createdDate: -1 })
    .limit(5)
    .select("title _id createdDate")
    .lean();

  return {
    release: { ...release, _id: (release as any)._id.toString() } as any,
    otherReleases: otherReleases.map((r: any) => ({ ...r, _id: r._id.toString() })),
  };
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  
  // We need to catch invalid ID formats for Mongoose
  if (id.length !== 24) return { title: "Not Found" };
  
  const data = await getPressReleaseData(id);

  if (!data || !data.release) {
    return {
      title: "Press Release Not Found",
    };
  }

  const { release } = data;

  return {
    title: release.title,
    description: release.description || "Read this official press release from the BRAC University Computer Club.",
    openGraph: {
      title: release.title,
      description: release.description,
      type: "article",
      publishedTime: release.createdDate,
      authors: [release.author?.authorName || "BUCC PR"],
      images: [
        {
          url: release.featuredImage || "/images/cover.png",
          width: 1200,
          height: 630,
          alt: release.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: release.title,
      description: release.description,
      images: [release.featuredImage || "/images/cover.png"],
    },
  };
}

export default async function PressReleaseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  if (id.length !== 24) {
    notFound();
  }

  const data = await getPressReleaseData(id);

  if (!data || !data.release) {
    return (
      <div className="max-w-6xl mx-auto px-8 py-32 text-center space-y-4">
        <h1 className="text-3xl font-serif">Statement Not Found</h1>
        <p className="text-muted-foreground">The press release you are looking for does not exist or has been removed.</p>
        <Link href="/publications/press-releases">
          <Button variant="outline">Go Back</Button>
        </Link>
      </div>
    );
  }

  const { release, otherReleases } = data;

  return (
    <article className="min-h-screen bg-background pb-32">
      {/* Cover Image Header */}
      <section className="relative h-[50vh] md:h-[60vh] overflow-hidden bg-muted">
        <img
          src={release.featuredImage || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop"}
          alt={release.title}
          className="w-full h-full object-cover grayscale-[0.2]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute top-8 left-8 z-10">
          <Link href="/publications/press-releases">
            <button className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest bg-black/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
              <ArrowLeft size={14} /> Back to Releases
            </button>
          </Link>
        </div>
      </section>

      {/* Main Content Split Layout */}
      <section className="max-w-7xl mx-auto px-6 -mt-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Left Column: Title & Body */}
          <div className="lg:col-span-8 space-y-10">
            <div className="space-y-6">
              <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                <Badge className="bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20">Official Media Release</Badge>
                <span className="h-1 w-1 bg-primary/30 rounded-full" />
                <span className="text-muted-foreground">ID: {release._id.substring(0, 8)}</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif tracking-tight leading-[1.1] text-foreground">
                {release.title}
              </h1>
              
              <div className="flex flex-wrap items-center justify-between gap-6 py-6 border-y border-border/50 text-xs text-muted-foreground font-light">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <User size={14} className="text-primary" />
                    <span>Issued By <span className="font-medium text-foreground">{release.author?.authorName}</span></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-primary" />
                    <span>{new Date(release.createdDate).toLocaleDateString("en-US", { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                </div>
                
                <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest hover:text-foreground transition-colors">
                  <Share2 size={12} /> Share
                </button>
              </div>
            </div>

            <div className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-serif prose-a:text-primary">
              <BlockContent content={release.content} />
            </div>
            
            <div className="mt-24 pt-12 border-t border-border flex flex-col items-center text-center space-y-6">
              <div className="h-12 w-px bg-border" />
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground">
                End of Official Release
              </p>
              <div className="space-y-2">
                <p className="text-sm font-serif italic text-muted-foreground">For media inquiries, please contact</p>
                <p className="text-sm font-medium">{release.author?.authorEmail}</p>
              </div>
            </div>
          </div>

          {/* Right Column: Sidebar */}
          <div className="lg:col-span-4">
            <div className="space-y-12">
              
              {/* Short Description Card */}
              <div className="bg-card border border-border rounded-xl p-8 space-y-4 shadow-sm border-l-4 border-l-primary">
                <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Executive Summary</h3>
                <p className="text-sm font-light leading-relaxed text-foreground/80 italic">
                  "{release.description}"
                </p>
              </div>

              {/* Related/Random Releases */}
              {otherReleases.length > 0 && (
                <div className="space-y-6">
                  <h3 className="text-sm font-serif border-b border-border pb-2 flex items-center justify-between">
                    Recent Releases
                  </h3>
                  <div className="space-y-4 flex flex-col">
                    {otherReleases.map((otherRelease: any) => (
                      <Link 
                        key={otherRelease._id} 
                        href={`/publications/press-releases/${otherRelease._id}`}
                        className="group block space-y-2 p-3 rounded-md hover:bg-muted transition-colors border border-transparent hover:border-border/50"
                      >
                        <h4 className="text-sm font-medium leading-snug group-hover:text-primary transition-colors line-clamp-2">
                          {otherRelease.title}
                        </h4>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider flex items-center gap-1">
                          <Calendar size={10} /> {new Date(otherRelease.createdDate).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </Link>
                    ))}
                  </div>
                  <Link href="/publications/press-releases" className="block pt-4">
                     <button className="w-full flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors py-3 border border-border rounded-md hover:bg-muted">
                       View All Releases <ArrowRight size={14} />
                     </button>
                  </Link>
                </div>
              )}

            </div>
          </div>

        </div>
      </section>
    </article>
  );
}
