"use client";

import { authClient } from "@/lib/auth-client";
import { canManageEvents } from "@/lib/permissions";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Calendar, MapPin, Users, Upload, X } from "lucide-react";
import { uploadImage } from "@/lib/client-cloudinary";
import Image from "next/image";

interface Event {
  _id: string;
  title: string;
  venue: string;
  description: string;
  type: string;
  startingDate: string;
  endingDate: string;
  allowedMembers: string;
  featuredImage?: string;
  registrationLink?: string;
}

export default function EventManagement() {
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/events");
      const data = await res.json();
      setEvents(data);
    } catch (error) {
      toast.error("Failed to load events");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  if (sessionPending || isLoading) {
    return <div className="p-8 text-muted-foreground animate-pulse font-serif">Loading event management...</div>;
  }

  const user = session?.user as any;
  const canEdit = user && canManageEvents(user);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    try {
      const res = await fetch(`/api/events/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Event deleted");
        fetchEvents();
      } else {
        toast.error("Failed to delete event");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-6">
        <div>
          <h1 className="text-4xl font-serif tracking-tight text-foreground">Event Management</h1>
          <p className="text-muted-foreground mt-2 text-lg">View and manage upcoming club activities.</p>
        </div>
        {canEdit && (
          <button 
            onClick={() => { setEditingEvent(null); setShowForm(true); }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" /> Add Event
          </button>
        )}
      </div>

      {showForm && canEdit && (
        <EventForm 
          event={editingEvent} 
          onClose={() => setShowForm(false)} 
          onSuccess={() => { setShowForm(false); fetchEvents(); }} 
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.length === 0 ? (
          <div className="col-span-2 p-12 border border-dashed border-border rounded-md text-center text-muted-foreground font-serif">
            No events found.
          </div>
        ) : (
          events.map((event) => (
            <div key={event._id} className="overflow-hidden border border-border rounded-lg bg-card shadow-sm group relative flex flex-col">
              {event.featuredImage && (
                <div className="relative h-48 w-full">
                  <Image 
                    src={event.featuredImage} 
                    alt={event.title} 
                    fill 
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-6 space-y-4 flex-1">
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest bg-muted px-2 py-0.5 rounded">
                      {event.type}
                    </span>
                    {canEdit && (
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => { setEditingEvent(event); setShowForm(true); }}
                          className="p-1.5 hover:bg-muted rounded-md text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(event._id)}
                          className="p-1.5 hover:bg-destructive/10 rounded-md text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                  <h2 className="text-2xl font-serif font-bold text-foreground group-hover:underline underline-offset-4 decoration-1">{event.title}</h2>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 shrink-0" />
                    <span>{new Date(event.startingDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 shrink-0" />
                    <span className="truncate">{event.venue}</span>
                  </div>
                  <div className="flex items-center gap-2 col-span-2">
                    <Users className="w-4 h-4 shrink-0" />
                    <span>Allowed: {event.allowedMembers}</span>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                  {event.description}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function EventForm({ event, onClose, onSuccess }: { event: Event | null, onClose: () => void, onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    title: event?.title || "",
    venue: event?.venue || "",
    description: event?.description || "",
    type: event?.type || "Workshop",
    startingDate: event?.startingDate ? new Date(event.startingDate).toISOString().slice(0, 16) : "",
    endingDate: event?.endingDate ? new Date(event.endingDate).toISOString().slice(0, 16) : "",
    allowedMembers: event?.allowedMembers || "Any",
    featuredImage: event?.featuredImage || "",
    registrationLink: event?.registrationLink || "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const url = await uploadImage(file, "events");
      setFormData({ ...formData, featuredImage: url });
      toast.success("Image uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const url = event ? `/api/events/${event._id}` : "/api/events";
      const method = event ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        toast.success(event ? "Event updated" : "Event created");
        onSuccess();
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to save event");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl bg-card border border-border p-8 rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-serif font-bold mb-6">{event ? "Edit Event" : "Create New Event"}</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Featured Image</label>
            <div className="flex flex-col gap-4">
              {formData.featuredImage ? (
                <div className="relative h-48 w-full rounded-md overflow-hidden border border-border">
                  <Image 
                    src={formData.featuredImage} 
                    alt="Preview" 
                    fill 
                    sizes="(max-width: 768px) 100vw, 672px"
                    className="object-cover"
                  />
                  <button 
                    type="button"
                    onClick={() => setFormData({ ...formData, featuredImage: "" })}
                    className="absolute top-2 right-2 p-1 bg-background/80 rounded-full hover:bg-background transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-border border-dashed rounded-lg cursor-pointer bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      {isUploading ? (
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                      ) : (
                        <>
                          <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                          <p className="mb-2 text-sm text-muted-foreground">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-muted-foreground">SVG, PNG, JPG (MAX. 800x400px)</p>
                        </>
                      )}
                    </div>
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isUploading}
                    />
                  </label>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-sm font-medium">Title</label>
              <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-3 py-2 border border-border rounded-md bg-background" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Venue</label>
              <input required value={formData.venue} onChange={e => setFormData({...formData, venue: e.target.value})} className="w-full px-3 py-2 border border-border rounded-md bg-background" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Type</label>
              <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full px-3 py-2 border border-border rounded-md bg-background">
                <option>Workshop</option>
                <option>Competition</option>
                <option>Seminar</option>
                <option>Flagship Event</option>
                <option>Networking</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Allowed Members</label>
              <select value={formData.allowedMembers} onChange={e => setFormData({...formData, allowedMembers: e.target.value})} className="w-full px-3 py-2 border border-border rounded-md bg-background">
                <option>Any</option>
                <option>BUCC Members</option>
                <option>BRACU Students</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Starting Date</label>
              <input type="datetime-local" required value={formData.startingDate} onChange={e => setFormData({...formData, startingDate: e.target.value})} className="w-full px-3 py-2 border border-border rounded-md bg-background" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Ending Date</label>
              <input type="datetime-local" required value={formData.endingDate} onChange={e => setFormData({...formData, endingDate: e.target.value})} className="w-full px-3 py-2 border border-border rounded-md bg-background" />
            </div>
            <div className="space-y-1 col-span-2">
              <label className="text-sm font-medium">Registration Link (Optional)</label>
              <input type="url" placeholder="https://forms.gle/..." value={formData.registrationLink} onChange={e => setFormData({...formData, registrationLink: e.target.value})} className="w-full px-3 py-2 border border-border rounded-md bg-background" />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Description</label>
            <textarea required rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-3 py-2 border border-border rounded-md bg-background resize-none" />
          </div>
          <div className="flex justify-end gap-4 pt-4 border-t border-border">
            <button type="button" onClick={onClose} className="px-4 py-2 hover:bg-muted rounded-md transition-colors">Cancel</button>
            <button disabled={isSubmitting || isUploading} type="submit" className="px-6 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:opacity-90 transition-opacity disabled:opacity-50">
              {isSubmitting ? "Saving..." : (event ? "Update Event" : "Create Event")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
