import React from "react";

const ScrollingTicker = () => {
  const activities = "Hackathons • Tech Seminars • Workshops • Competitive Programming • Skill Development Bootcamps • Industry Talks • Project Showcases • Alumni Networking • E-Gaming Tournaments • Robotics • Open Source Contributions •";
  
  return (
    <div className="w-full bg-muted/50 py-4 overflow-hidden border-y border-border">
      <div className="relative flex whitespace-nowrap">
        {/* The marquee container duplicates the text to ensure no gaps */}
        <div className="flex animate-marquee shrink-0 items-center gap-8 px-4">
          <span className="text-xl md:text-2xl font-semibold uppercase tracking-widest text-foreground">
            {activities}
          </span>
          <span className="text-xl md:text-2xl font-semibold uppercase tracking-widest text-foreground">
            {activities}
          </span>
        </div>
        
        <div className="flex animate-marquee shrink-0 items-center gap-8 px-4">
          <span className="text-xl md:text-2xl font-semibold uppercase tracking-widest text-foreground">
            {activities}
          </span>
          <span className="text-xl md:text-2xl font-semibold uppercase tracking-widest text-foreground">
            {activities}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ScrollingTicker;
