import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import type { Platform } from "@/types";
import { Layout } from "@/components/Layout";
import { PlatformFilter } from "@/components/PlatformFilter";
import { ProfileList } from "@/components/ProfileList";
import {
  PLATFORMS,
  extractProfiles,
  filterProfiles,
  getPlatformLabel,
} from "@/utils/dataHelpers";

// One italic-serif word inside the grotesque headline — the editorial accent.
const HEADLINE: { word: string; accent?: boolean }[] = [
  { word: "Find" },
  { word: "the" },
  { word: "right", accent: true },
  { word: "creator." },
];

const TOTAL_CREATORS = PLATFORMS.reduce(
  (total, platform) => total + extractProfiles(platform).length,
  0
);

export function SearchPage() {
  // Keep the active platform in the URL so it survives navigating into a
  // profile and back — the tab you were on is restored, not reset to default.
  const [searchParams, setSearchParams] = useSearchParams();
  const platformParam = searchParams.get("platform");
  const platform: Platform = PLATFORMS.includes(platformParam as Platform)
    ? (platformParam as Platform)
    : "instagram";

  const [searchQuery, setSearchQuery] = useState("");

  const handlePlatformChange = (next: Platform) => {
    setSearchParams(
      (prev) => {
        const params = new URLSearchParams(prev);
        params.set("platform", next);
        return params;
      },
      { replace: true }
    );
  };

  const allProfiles = useMemo(() => extractProfiles(platform), [platform]);
  const filtered = useMemo(
    () => filterProfiles(allProfiles, searchQuery),
    [allProfiles, searchQuery]
  );

  return (
    <Layout>
      {/* Kicker — small mono index line flanked by hairline rules */}
      <p className="mt-4 text-center font-meta text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--text-muted)]">
        <span
          className="headline-word inline-flex items-center gap-3"
          style={{ animationDelay: "0s" }}
        >
          <span aria-hidden="true" className="h-px w-8 bg-[var(--text)]" />
          Creator index · Vol. 01
          <span aria-hidden="true" className="h-px w-8 bg-[var(--text)]" />
        </span>
      </p>

      {/* Hero — words stagger up on load */}
      <h1
        aria-label={HEADLINE.map((item) => item.word).join(" ")}
        className="mt-4 text-center font-display text-[clamp(48px,8vw,90px)] font-bold leading-[0.9] tracking-[-0.03em]"
      >
        {HEADLINE.map((item, i) => (
          <span
            key={item.word}
            className={`headline-word ${
              item.accent
                ? "font-editorial pr-[0.05em] font-medium tracking-normal text-[var(--accent-alt)]"
                : ""
            }`}
            style={{
              animationDelay: `${0.08 + i * 0.07}s`,
              marginRight: i < HEADLINE.length - 1 ? "0.22em" : undefined,
            }}
          >
            {item.word}
          </span>
        ))}
      </h1>

      {/* Sub-line — editorial serif aside */}
      <p className="mt-5 text-center">
        <span
          className="headline-word max-w-xl font-editorial text-lg text-[var(--text-muted)] sm:text-xl"
          style={{ animationDelay: "0.44s" }}
        >
          {TOTAL_CREATORS} creators across Instagram, YouTube and TikTok —
          indexed, searchable, one click from your shortlist.
        </span>
      </p>

      <div className="mt-9">
        <PlatformFilter
          selected={platform}
          onChange={handlePlatformChange}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </div>

      {/* Ledger rule — section label left, live tally right */}
      <div className="mt-10 mb-6 flex items-baseline justify-between gap-4 border-b border-[var(--text)] pb-2 font-meta text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--text-muted)]">
        <span>Index / {getPlatformLabel(platform)}</span>
        <span aria-live="polite" className="tabular-nums">
          {filtered.length} of {allProfiles.length} shown
        </span>
      </div>

      <ProfileList
        profiles={filtered}
        platform={platform}
        query={searchQuery}
      />
    </Layout>
  );
}
