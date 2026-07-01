import { motion } from "framer-motion";
import { Search, X } from "lucide-react";
import type { Platform } from "@/types";
import { PLATFORMS, getPlatformLabel } from "@/utils/dataHelpers";

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
              className={`relative pb-2 font-display text-lg font-bold tracking-tight transition-colors ${
                isActive
                  ? "text-[var(--text)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text)]"
              }`}
            >
              {getPlatformLabel(p)}
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

      {/* Search */}
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
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={`Search ${getPlatformLabel(selected)} creators…`}
          className="w-full rounded-full border border-[var(--border)] bg-[var(--surface)] py-3 pl-10 pr-10 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)]/60 transition-colors focus:border-[var(--accent)] focus:outline-none"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            aria-label="Clear search"
            className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-[var(--text-muted)] transition-colors hover:text-[var(--text)]"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
