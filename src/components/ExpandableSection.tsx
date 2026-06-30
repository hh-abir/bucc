"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

// For Work Experience or long text blocks (Height-based with gradient fade)
export function ExpandableHeight({ 
  children, 
  maxCollapsedHeight = 160 
}: { 
  children: React.ReactNode; 
  maxCollapsedHeight?: number; 
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [shouldShowButton, setShouldShowButton] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      // Show button only if scroll height exceeds collapsed limit with a small buffer
      if (contentRef.current.scrollHeight > maxCollapsedHeight + 25) {
        setShouldShowButton(true);
      } else {
        setShouldShowButton(false);
      }
    }
  }, [children, maxCollapsedHeight]);

  return (
    <div className="relative">
      <div 
        ref={contentRef}
        style={{ maxHeight: isExpanded ? "none" : `${maxCollapsedHeight}px` }}
        className="overflow-hidden transition-all duration-300 relative"
      >
        {children}
        
        {shouldShowButton && !isExpanded && (
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-card via-card/85 to-transparent pointer-events-none" />
        )}
      </div>

      {shouldShowButton && (
        <div className="pt-4 flex justify-center mt-2">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors py-1.5 px-3 border border-border/80 rounded-sm bg-background/50"
          >
            {isExpanded ? (
              <>
                Show Less <ChevronUp className="w-3 h-3" />
              </>
            ) : (
              <>
                Read More <ChevronDown className="w-3 h-3" />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

// For Recent Activity list (Item-count based)
export function ExpandableList({ 
  children, 
  limit = 3 
}: { 
  children: React.ReactNode; 
  limit?: number; 
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const childrenArray = React.Children.toArray(children);
  const hasMore = childrenArray.length > limit;
  const displayedChildren = isExpanded ? childrenArray : childrenArray.slice(0, limit);

  return (
    <div className="space-y-4">
      <ul className="space-y-3.5">
        {displayedChildren}
      </ul>

      {hasMore && (
        <div className="pt-2 flex justify-center">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors py-1.5 px-3 border border-border/80 rounded-sm bg-background/50"
          >
            {isExpanded ? (
              <>
                Show Less <ChevronUp className="w-3 h-3" />
              </>
            ) : (
              <>
                Show More Updates <ChevronDown className="w-3 h-3" />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
