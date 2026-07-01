import { useMemo, useState } from "react";
import type { Platform } from "@/types";
import { Layout } from "@/components/Layout";
import { PlatformFilter } from "@/components/PlatformFilter";
import { ProfileList } from "@/components/ProfileList";
import {
  extractProfiles,
  filterProfiles,
  getPlatformLabel,
} from "@/utils/dataHelpers";

const HEADLINE = ["Find", "the", "right", "creator."];

export function SearchPage() {
  const [platform, setPlatform] = useState<Platform>("instagram");
  const [searchQuery, setSearchQuery] = useState("");

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
          onChange={setPlatform}
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