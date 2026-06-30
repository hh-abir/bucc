"use client";

import * as React from "react";
import { X, Search, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type Option = {
  label: string;
  value: string;
};

interface MultipleSelectorProps {
  value?: Option[];
  onChange?: (value: Option[]) => void;
  defaultOptions?: Option[];
  placeholder?: string;
  emptyIndicator?: React.ReactNode;
  className?: string;
  badgeClassName?: string;
}

export default function MultipleSelector({
  value = [],
  onChange,
  defaultOptions = [],
  placeholder = "Select options...",
  emptyIndicator,
  className,
  badgeClassName,
}: MultipleSelectorProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");

  // Filter options based on input and already selected values
  const selectables = React.useMemo(() => {
    return defaultOptions.filter(
      (option) => 
        !value.find((s) => s.value === option.value) &&
        option.label.toLowerCase().includes(inputValue.toLowerCase())
    );
  }, [defaultOptions, value, inputValue]);

  const handleUnselect = React.useCallback((option: Option) => {
    onChange?.(value.filter((s) => s.value !== option.value));
  }, [onChange, value]);

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Backspace" && inputValue === "" && value.length > 0) {
        handleUnselect(value[value.length - 1]);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    },
    [handleUnselect, value, inputValue]
  );

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={cn("relative overflow-visible", className)}>
      <div
        className="group border-b border-border py-2 px-0 text-sm focus-within:border-primary transition-colors flex flex-wrap gap-1 items-center"
        onClick={() => {
          setOpen(true);
          inputRef.current?.focus();
        }}
      >
        {value.map((option) => (
          <Badge
            key={option.value}
            variant="secondary"
            className={cn("rounded-sm px-1 font-normal flex items-center gap-1", badgeClassName)}
          >
            {option.label}
            <button
              type="button"
              className="rounded-full outline-none hover:bg-muted"
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onClick={() => handleUnselect(option)}
            >
              <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
            </button>
          </Badge>
        ))}
        
        <input
          ref={inputRef}
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={value.length === 0 ? placeholder : ""}
          className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground min-w-[120px]"
        />
        
        <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", open && "rotate-180")} />
      </div>

      {open && (
        <div className="absolute top-full left-0 z-50 w-full mt-2 rounded-md border border-border bg-popover text-popover-foreground shadow-md outline-none animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
          <div className="max-h-64 overflow-auto p-1">
            {selectables.length > 0 ? (
              <div className="flex flex-col">
                {selectables.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onClick={() => {
                      setInputValue("");
                      onChange?.([...value, option]);
                      // Stay open if more options or close? usually better to stay open for multiple
                    }}
                    className="w-full text-left px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            ) : (
              <div className="px-2 py-4 text-center text-sm text-muted-foreground">
                {emptyIndicator || "No results found."}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
