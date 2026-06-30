"use client";

import React, { useState } from "react";
import Heading from "@/components/portal/heading";
import { 
  Mail, 
  MapPin, 
  Phone, 
  Clock, 
  Send, 
  MessageSquare,
  Facebook,
  Linkedin,
  Twitter,
  Instagram,
  Youtube,
  Github
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import Link from "next/link";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to send message");

      toast.success("Message sent successfully! We'll get back to you soon.");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Visit Us",
      details: ["Club Room: UB20401", "BRAC University New Campus", "Badda, Dhaka 1212"],
    },
    {
      icon: Mail,
      title: "Email Us",
      details: ["info.bucc@g.bracu.ac.bd", "press.bucc@g.bracu.ac.bd"],
    },
    {
      icon: Phone,
      title: "Call Us",
      details: ["+880 1712-345678", "(Sun-Thu, 10AM - 5PM)"],
    },
    {
      icon: Clock,
      title: "Working Hours",
      details: ["Sunday - Thursday", "10:00 AM - 05:00 PM"],
    }
  ];

  const socialLinks = [
    { icon: Facebook, href: "https://www.facebook.com/BRACUCC", label: "Facebook" },
    { icon: Linkedin, href: "https://www.linkedin.com/company/bracu-computer-club/", label: "LinkedIn" },
    { icon: Instagram, href: "https://www.instagram.com/bucc_official/", label: "Instagram" },
    { icon: Youtube, href: "https://www.youtube.com/@BUCCOfficial", label: "YouTube" },
    { icon: Github, href: "https://github.com/BUCC-Official", label: "GitHub" },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 border-b border-border bg-muted/10 overflow-hidden">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="max-w-3xl space-y-4">
            <h1 className="text-4xl md:text-6xl font-serif tracking-tight text-foreground">
              Get in Touch
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed">
              Have a question, feedback, or want to collaborate? We'd love to hear from you. 
              Reach out to us through the form or via our contact details.
            </p>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-1/4 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" />
      </section>

      <section className="max-w-6xl mx-auto px-6 -mt-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Contact Details */}
          <div className="lg:col-span-5 space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {contactInfo.map((info, i) => (
                <Card key={i} className="border-border shadow-none bg-card hover:border-primary/20 transition-all duration-300">
                  <CardContent className="p-6 space-y-4">
                    <div className="p-3 bg-muted w-fit rounded-sm text-primary">
                      <info.icon size={20} strokeWidth={1.5} />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-sm font-bold uppercase tracking-widest text-foreground">{info.title}</h3>
                      <div className="space-y-1">
                        {info.details.map((detail, j) => (
                          <p key={j} className="text-sm text-muted-foreground font-light">{detail}</p>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="border-border shadow-none bg-card">
              <CardContent className="p-8 space-y-6">
                <h3 className="text-sm font-bold uppercase tracking-widest text-foreground">Connect with our community</h3>
                <div className="flex flex-wrap gap-4">
                  {socialLinks.map((social, i) => (
                    <a 
                      key={i}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-muted hover:bg-primary hover:text-primary-foreground transition-all duration-300 rounded-sm group"
                      aria-label={social.label}
                    >
                      <social.icon size={20} strokeWidth={1.5} className="transition-transform group-hover:scale-110" />
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="aspect-video w-full bg-muted rounded-sm border border-border relative overflow-hidden group">
              {/* This would be an iframe or a custom map component */}
              <div className="absolute inset-0 flex items-center justify-center bg-muted group-hover:bg-muted/50 transition-colors">
                <div className="text-center space-y-2">
                  <MapPin className="w-8 h-8 mx-auto text-muted-foreground/40" />
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">BRAC University New Campus</p>
                </div>
              </div>
              <div className="absolute inset-0 pointer-events-none border border-foreground/5" />
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7">
            <Card className="border-border shadow-2xl shadow-foreground/5 bg-background h-full">
              <CardContent className="p-8 md:p-12 space-y-10">
                <div className="space-y-2">
                  <h2 className="text-2xl font-serif font-medium flex items-center gap-3">
                    <MessageSquare className="w-6 h-6 text-primary" /> Send us a message
                  </h2>
                  <p className="text-muted-foreground font-light">Fill out the form below and our team will get back to you within 24-48 hours.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Full Name</Label>
                      <Input 
                        id="name"
                        required
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="bg-muted/20 border-border focus:border-primary transition-all h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Email Address</Label>
                      <Input 
                        id="email"
                        type="email"
                        required
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="bg-muted/20 border-border focus:border-primary transition-all h-12"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Subject</Label>
                    <Input 
                      id="subject"
                      required
                      placeholder="Collaboration Inquiry"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="bg-muted/20 border-border focus:border-primary transition-all h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Message</Label>
                    <Textarea 
                      id="message"
                      required
                      placeholder="Tell us more about your inquiry..."
                      rows={6}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="bg-muted/20 border-border focus:border-primary transition-all p-4 resize-none"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full h-14 bg-foreground text-background hover:opacity-90 transition-all font-bold uppercase tracking-widest group"
                  >
                    {isSubmitting ? "Sending..." : (
                      <>
                        Send Message 
                        <Send className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                      </>
                    )}
                  </Button>
                </form>

                <div className="pt-6 border-t border-border/50 text-center">
                  <p className="text-xs text-muted-foreground font-light italic">
                    By submitting this form, you agree to our privacy policy. We will never share your information.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </section>

      {/* FAQ Link or Join CTA */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl font-serif tracking-tight">Frequently Asked Questions</h2>
          <p className="text-muted-foreground font-light max-w-2xl mx-auto leading-relaxed">
            Looking for quick answers about membership, events, or workshops? 
            Check our knowledge base or visit the portal.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/faq">
              <Button variant="outline" className="border-border px-8 h-12">Visit FAQ</Button>
            </Link>
            <Link href="/login">
              <Button className="bg-foreground text-background px-8 h-12">Portal Access</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
