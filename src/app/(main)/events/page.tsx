import dbConnect from "@/lib/dbConnect";
import Event from "@/model/Event";
import Link from "next/link";
import { Calendar, MapPin, ArrowRight } from "lucide-react";


type EventCard = {
  _id: string;
  title: string;
  venue: string;
  description: string;
  featuredImage?: string;
  type: string;
  startingDate: Date;
  endingDate: Date;
  allowedMembers: string;
};

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));

async function getEvents() {
  await dbConnect();
  const events = await Event.find({}).sort({ startingDate: -1 }).lean();

  return events.map((event: any) => ({
    ...event,
    _id: event._id.toString(),
  })) as EventCard[];
}

function EventItem({ event, isPast = false }: { event: EventCard; isPast?: boolean }) {
  return (
    <Link
      href={`/events/${event._id}`}
      className="group block space-y-6"
    >
      <div className={`aspect-[16/9] overflow-hidden bg-muted border border-border rounded-sm relative ${isPast ? 'grayscale' : ''}`}>
        {event.featuredImage ? (
          <img
            src={event.featuredImage}
            alt={event.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center px-8 text-center font-serif text-2xl text-muted-foreground/30 italic">
            {event.title}
          </div>
        )}
      </div>
      <article className="space-y-3">
        <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
          <span>{event.type}</span>
          <span className="h-1 w-1 bg-border rounded-full" />
          <span>{formatDate(event.startingDate)}</span>
        </div>
        <h2 className="font-serif text-3xl font-medium leading-tight group-hover:text-primary transition-colors">
          {event.title}
        </h2>
        <div className="flex items-center gap-4 text-xs text-muted-foreground font-light">
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" /> {event.venue}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" /> {new Date(event.startingDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        <p className="leading-relaxed text-muted-foreground font-light line-clamp-2 pt-2">{event.description}</p>
        <div className="pt-2 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-foreground group-hover:gap-4 transition-all">
          View Event Details <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </article>
    </Link>
  );
}

export default async function EventsPage() {
  const allEvents = await getEvents();
  const now = new Date();

  const upcomingEvents = allEvents
    .filter(e => new Date(e.startingDate) > now)
    .sort((a, b) => new Date(a.startingDate).getTime() - new Date(b.startingDate).getTime());

  const pastEvents = allEvents
    .filter(e => new Date(e.endingDate) < now)
    .sort((a, b) => new Date(b.startingDate).getTime() - new Date(a.startingDate).getTime());

  return (
    <div className="min-h-screen pb-32">
      {/* Page Header */}
      <section className="bg-muted/10 border-b border-border">
        <div className="mx-auto max-w-6xl px-8 py-24 md:py-32 space-y-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
            Official Calendar
          </p>
          <div className="max-w-3xl space-y-6">
            <h1 className="font-serif text-5xl md:text-7xl tracking-tight leading-tight">
              Events & <br /> Gatherings.
            </h1>
            <p className="text-xl text-muted-foreground font-light leading-relaxed">
              Explore upcoming workshops, seminars, and competitions, or browse our archive of past club activities.
            </p>
          </div>
        </div>
      </section>

      {/* Upcoming Section */}
      <section className="mx-auto max-w-6xl px-8 pt-24 space-y-12">
        <div className="flex items-center gap-4">
          <h2 className="font-serif text-3xl tracking-tight">Upcoming Activities</h2>
          <div className="h-px flex-1 bg-border" />
          <Badge variant="emerald">{upcomingEvents.length} Scheduled</Badge>
        </div>

        {upcomingEvents.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-border rounded-sm">
            <p className="text-muted-foreground font-serif italic text-lg">No upcoming events scheduled at the moment.</p>
          </div>
        ) : (
          <div className="grid gap-16 md:grid-cols-2">
            {upcomingEvents.map((event) => (
              <EventItem key={event._id} event={event} />
            ))}
          </div>
        )}
      </section>

      {/* Past Section */}
      <section className="mx-auto max-w-6xl px-8 pt-32 space-y-12">
        <div className="flex items-center gap-4">
          <h2 className="font-serif text-3xl tracking-tight text-muted-foreground/60">Past Archive</h2>
          <div className="h-px flex-1 bg-border/50" />
        </div>

        {pastEvents.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-muted-foreground font-serif italic">No past events recorded in the system.</p>
          </div>
        ) : (
          <div className="grid gap-12 md:grid-cols-3">
            {pastEvents.map((event) => (
              <EventItem key={event._id} event={event} isPast />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

// Internal Badge for the header
function Badge({ children, variant }: { children: React.ReactNode, variant: string }) {
  const colors = variant === "emerald" ? "bg-emerald-50 text-emerald-700 border-emerald-200/50" : "bg-muted text-muted-foreground border-border";
  return (
    <span className={`px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-widest ${colors}`}>
      {children}
    </span>
  );
}
