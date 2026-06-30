import dbConnect from "@/lib/dbConnect";
import Event from "@/model/Event";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  ExternalLink,
  Info
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const formatDateTime = (date: Date) =>
  new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date));

async function getEvent(id: string) {
  await dbConnect();
  const event = await Event.findById(id).lean();
  if (!event) return null;

  return {
    ...(event as any),
    _id: (event as any)._id.toString(),
  };
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  
  if (id.length !== 24) return { title: "Event Not Found" };
  
  const event = await getEvent(id);

  if (!event) {
    return {
      title: "Event Not Found",
    };
  }

  return {
    title: `${event.title} | BUCC Events`,
    description: event.description,
    openGraph: {
      title: event.title,
      description: event.description,
      type: "website",
      images: [
        {
          url: event.featuredImage || "/images/cover.png",
          width: 1200,
          height: 630,
          alt: event.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: event.title,
      description: event.description,
      images: [event.featuredImage || "/images/cover.png"],
    },
  };
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  if (id.length !== 24) {
    notFound();
  }

  const event = await getEvent(id);

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <h1 className="text-4xl font-serif">Event Not Found</h1>
        <p className="text-muted-foreground">The event you are looking for does not exist or has been removed.</p>
        <Link href="/events">
          <Button variant="outline" className="gap-2">
            <ArrowLeft size={16} /> Back to Events
          </Button>
        </Link>
      </div>
    );
  }

  const isUpcoming = new Date(event.startingDate) > new Date();

  return (
    <article className="min-h-screen bg-background pb-32">
      {/* Modern Event Hero */}
      <section className="pt-32 pb-16 px-6 border-b border-border bg-muted/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-background to-background pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <Link href="/events" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors mb-8 bg-muted px-4 py-2 rounded-full border border-border">
            <ArrowLeft size={14} /> Back to Events
          </Link>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Event Title & Brief */}
            <div className="space-y-8">
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-primary text-primary-foreground border-none px-4 py-1.5 text-[10px] uppercase font-bold tracking-widest hover:bg-primary">
                  {event.type}
                </Badge>
                {!isUpcoming && (
                  <Badge variant="outline" className="bg-muted text-muted-foreground border-border px-4 py-1.5 text-[10px] uppercase font-bold tracking-widest">
                    Past Event
                  </Badge>
                )}
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif tracking-tight leading-[1.1] text-foreground">
                {event.title}
              </h1>
              
              {/* Quick Info Grid */}
              <div className="grid grid-cols-2 gap-8 pt-8 border-t border-border/50">
                 <div className="space-y-2">
                   <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                     <Users size={14} className="text-primary" /> Audience
                   </div>
                   <p className="text-sm font-medium text-foreground">{event.allowedMembers}</p>
                 </div>
                 <div className="space-y-2">
                   <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                     <MapPin size={14} className="text-primary" /> Venue
                   </div>
                   <p className="text-sm font-medium text-foreground">{event.venue}</p>
                 </div>
              </div>
            </div>

            {/* Featured Image Card */}
            <div className="relative aspect-video rounded-2xl overflow-hidden border border-border shadow-xl shadow-foreground/5 bg-muted">
               <img 
                 src={event.featuredImage || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop"} 
                 alt={event.title} 
                 className={`w-full h-full object-cover transition-all duration-700 ${!isUpcoming ? 'grayscale opacity-90' : 'hover:scale-105'}`} 
               />
               
               {/* Date Overlay Badge */}
               <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-md border border-border rounded-xl p-3 text-center min-w-[80px] shadow-lg">
                  <p className="text-2xl font-serif font-bold text-primary leading-none">
                    {new Date(event.startingDate).getDate()}
                  </p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">
                    {new Date(event.startingDate).toLocaleString('en-US', { month: 'short' })}
                  </p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Registration & Status Action Bar */}
      <section className="border-b border-border bg-card">
         <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 w-full md:w-auto">
               <div className="flex items-center gap-3 w-full md:w-auto p-4 md:p-0 bg-muted md:bg-transparent rounded-lg md:rounded-none">
                 <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 hidden md:flex">
                   <Calendar className="w-4 h-4 text-primary" />
                 </div>
                 <div>
                   <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground md:hidden mb-1">Starts</p>
                   <p className="text-sm font-medium text-foreground">{formatDateTime(event.startingDate)}</p>
                 </div>
               </div>
               
               <div className="hidden md:block w-px h-8 bg-border" />
               
               <div className="flex items-center gap-3 w-full md:w-auto p-4 md:p-0 bg-muted md:bg-transparent rounded-lg md:rounded-none">
                 <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0 hidden md:flex border border-border">
                   <Clock className="w-4 h-4 text-muted-foreground" />
                 </div>
                 <div>
                   <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground md:hidden mb-1">Ends</p>
                   <p className="text-sm font-medium text-muted-foreground">Until {formatDateTime(event.endingDate)}</p>
                 </div>
               </div>
            </div>
            
            <div className="w-full md:w-auto flex justify-end">
              {isUpcoming ? (
                 event.registrationLink ? (
                   <a href={event.registrationLink} target="_blank" rel="noopener noreferrer" className="w-full md:w-auto">
                     <Button className="w-full md:w-auto gap-3 font-bold uppercase tracking-widest text-[10px] px-10 h-14 bg-foreground text-background hover:scale-[1.02] transition-transform">
                       Register Now <ExternalLink className="w-4 h-4" />
                     </Button>
                   </a>
                 ) : (
                   <div className="flex items-center justify-center gap-3 px-8 h-14 bg-muted/50 rounded-md border border-border w-full md:w-auto">
                     <Info className="w-4 h-4 text-muted-foreground" />
                     <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">No Registration Required</span>
                   </div>
                 )
              ) : (
                 <div className="flex items-center justify-center px-8 h-14 bg-muted/50 rounded-md border border-border border-dashed w-full md:w-auto">
                   <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Event Concluded</span>
                 </div>
              )}
            </div>
         </div>
      </section>

      {/* Main Content Section */}
      <section className="max-w-4xl mx-auto px-6 py-20 md:py-32 space-y-16">
        <div className="space-y-8">
          <h2 className="text-3xl font-serif border-b border-border pb-4">Event Details</h2>
          <div className="prose prose-neutral dark:prose-invert max-w-none text-muted-foreground font-light leading-relaxed md:text-lg">
            <p className="whitespace-pre-wrap">{event.description}</p>
          </div>
        </div>
        
        {event.notes && (
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8 md:p-12 space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-primary flex items-center gap-2">
              <Info className="w-5 h-5" /> Important Notes
            </h3>
            <p className="text-base md:text-lg text-foreground/80 font-light leading-relaxed whitespace-pre-wrap">
              {event.notes}
            </p>
          </div>
        )}
      </section>
    </article>
  );
}
