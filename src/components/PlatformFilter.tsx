import { useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { Search, X } from "lucide-react";
import type { Platform } from "@/types";
import { PLATFORMS, extractProfiles, getPlatformLabel } from "@/utils/dataHelpers";

interface PlatformFilterProps {
  selected: Platform;
  onChange: (platform: Platform) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function PlatformFilter({
  selected,
  onChange,
  searchQuery,
  onSearchChange,
}: PlatformFilterProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Per-platform profile counts for the tab superscripts.
  const counts = useMemo(
    () =>
      Object.fromEntries(
        PLATFORMS.map((p) => [p, extractProfiles(p).length])
      ) as Record<Platform, number>,
    []
  );

  // Press "/" anywhere (outside a text field) to jump to search.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey) return;
      const el = document.activeElement;
      if (
        el instanceof HTMLElement &&
        (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable)
      ) {
        return;
      }
      e.preventDefault();
      inputRef.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="mx-auto w-full max-w-xl space-y-6">
      {/* Underline tabs */}
      <div
        className="flex justify-center gap-8"
        role="tablist"
        aria-label="Platform"
      >
        {PLATFORMS.map((p) => {
          const isActive = selected === p;
          return (
            <button
              key={p}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => {
                onChange(p);
                onSearchChange("");
              }}
              className={`relative cursor-pointer pb-2 font-display text-lg font-bold tracking-tight transition-colors ${
                isActive
                  ? "text-[var(--text)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text)]"
              }`}
            >
              {getPlatformLabel(p)}
              <sup
                className={`ml-1 font-meta text-[9px] font-bold tabular-nums ${
                  isActive ? "text-[var(--accent-alt)]" : "text-[var(--text-muted)]"
                }`}
              >
                {counts[p]}
              </sup>
              {isActive && (
                <motion.span
                  layoutId="activePlatform"
                  className="absolute inset-x-0 -bottom-px h-0.5 bg-[var(--accent)]"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Search — a crisp boxed field that lifts off the paper on focus */}
      <div className="group relative mx-auto max-w-md">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
          <Search
            size={16}
            className="text-[var(--text-muted)] transition-colors group-focus-within:text-[var(--accent)]"
          />
        </div>
        <label htmlFor="creator-search" className="sr-only">
          Search {getPlatformLabel(selected)} creators
        </label>
        <input
          id="creator-search"
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={`Search ${getPlatformLabel(selected)} creators…`}
          className="w-full rounded-sm border border-[var(--border)] bg-[var(--surface)] py-3 pl-10 pr-12 text-sm text-[var(--text)] transition-all placeholder:text-[var(--text-muted)]/60 focus:-translate-y-0.5 focus:border-[var(--text)] focus:shadow-[4px_4px_0_0_rgba(28,29,26,0.1)] focus:outline-none"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          {searchQuery ? (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              aria-label="Clear search"
              className="cursor-pointer p-0.5 text-[var(--text-muted)] transition-colors hover:text-[var(--text)]"
            >
              <X size={16} />
            </button>
          ) : (
            <kbd className="kbd" aria-hidden="true">
              /
            </kbd>
          )}
        </div>
      </div>
    </div>
  );
}
