"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { FileText, ArrowRight, Megaphone, Calendar } from "lucide-react";
import SpinnerComponent from "@/components/SpinnerComponent";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import RefreshButton from "@/components/public/RefreshButton";
import { revalidatePressReleases } from "@/actions/revalidate";

const getPublishedReleases = async () => {
  const res = await fetch("/api/press-releases");
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
};

export default function PressReleasesPublicPage() {
  const { data: releases, isLoading } = useQuery({
    queryKey: ["public-press-releases"],
    queryFn: getPublishedReleases,
  });

  if (isLoading) return <SpinnerComponent />;

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 border-b border-border bg-muted/10 overflow-hidden">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="max-w-3xl space-y-4">
            <div className="flex items-center gap-3">
              <h1 className="text-4xl md:text-6xl font-serif tracking-tight text-foreground leading-[1.1]">
                Press Releases
              </h1>
              <div className="mt-2 md:mt-4">
                <RefreshButton revalidateAction={revalidatePressReleases} label="Press Releases" />
              </div>
            </div>
            <p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed">
              Official statements, media announcements, and historical records from the BRAC University Computer Club.
            </p>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-1/4 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" />
      </section>

      <section className="max-w-6xl mx-auto px-6 py-20">
        {releases?.length === 0 ? (
          <div className="py-32 text-center border-2 border-dashed border-border rounded-lg bg-muted/10">
            <div className="space-y-4 max-w-xs mx-auto">
              <div className="p-4 bg-muted rounded-full w-fit mx-auto">
                <Megaphone className="w-8 h-8 text-muted-foreground/40" />
              </div>
              <div className="space-y-1">
                <p className="font-serif text-lg text-muted-foreground">No statements issued</p>
                <p className="text-xs text-muted-foreground/60">Official press releases will appear here.</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground border-b border-border pb-4">
              <Megaphone size={14} /> Official Statements
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              {releases?.map((release: any) => (
                <Card key={release._id} className="group border-border shadow-none overflow-hidden bg-card hover:border-primary/20 transition-all duration-500 flex flex-col">
                  <Link href={`/publications/press-releases/${release._id}`}>
                    <div className="aspect-[16/9] overflow-hidden relative bg-muted">
                      {release.featuredImage ? (
                        <img 
                          src={release.featuredImage} 
                          alt={release.title} 
                          className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-muted/50 transition-transform duration-700 group-hover:scale-105">
                          <FileText className="w-12 h-12 text-muted-foreground/20" />
                        </div>
                      )}
                      <div className="absolute top-4 left-4">
                         <Badge className="bg-primary/90 backdrop-blur-md text-primary-foreground border-none text-[9px] font-bold uppercase tracking-widest">
                           Media Release
                         </Badge>
                      </div>
                    </div>
                  </Link>
                  <CardContent className="p-8 flex flex-col flex-1 space-y-6">
                    <div className="space-y-3 flex-1">
                      <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                        <Calendar size={12} />
                        <span>{new Date(release.createdDate).toLocaleDateString("en-US", { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                        <span className="h-1 w-1 bg-border rounded-full" />
                        <span>ID: {release._id.substring(0, 8)}</span>
                      </div>
                      <Link href={`/publications/press-releases/${release._id}`}>
                        <h2 className="font-serif text-2xl group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                          {release.title}
                        </h2>
                      </Link>
                      <p className="text-sm text-muted-foreground font-light line-clamp-3 leading-relaxed">
                        {release.description}
                      </p>
                    </div>
                    
                    <div className="pt-6 border-t border-border/50">
                      <Link href={`/publications/press-releases/${release._id}`}>
                        <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-foreground group-hover:text-primary transition-colors">
                          Read Statement <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
