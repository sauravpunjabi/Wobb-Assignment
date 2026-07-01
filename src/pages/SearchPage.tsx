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

const HEADLINE = ["Find", "the", "right", "creator."];

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
      {/* Hero — words stagger up on load */}
      <h1
        aria-label={HEADLINE.join(" ")}
        className="mt-3 font-display text-[clamp(48px,8vw,90px)] font-bold leading-[0.9] tracking-[-0.03em] text-center"
      >
        {HEADLINE.map((word, i) => (
          <span
            key={word}
            className="headline-word"
            style={{
              animationDelay: `${i * 0.07}s`,
              marginRight: i < HEADLINE.length - 1 ? "0.22em" : undefined,
              color: word === "right" ? "var(--text-muted)" : undefined,
            }}
          >
            {word}
          </span>
        ))}
      </h1>

      <div className="mt-8">
        <PlatformFilter
          selected={platform}
          onChange={handlePlatformChange}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </div>

      <p className="mt-3 font-meta text-[11px] tracking-[0.05em] text-[var(--text-muted)] text-center mb-6">
        {filtered.length} shown / {allProfiles.length} indexed on{" "}
        {getPlatformLabel(platform)}
      </p>

      <ProfileList
        profiles={filtered}
        platform={platform}
        query={searchQuery}
      />
    </Layout>
  );
}