import instagramData from "@/assets/data/search/instagram.json";
import youtubeData from "@/assets/data/search/youtube.json";
import tiktokData from "@/assets/data/search/tiktok.json";
import type { Platform, SearchData, UserProfileSummary } from "@/types";

const platformData: Record<Platform, SearchData> = {
  instagram: instagramData as SearchData,
  youtube: youtubeData as SearchData,
  tiktok: tiktokData as SearchData,
};

export function getSearchData(platform: Platform): SearchData {
  return platformData[platform];
}

export function extractProfiles(platform: Platform): UserProfileSummary[] {
  const data = getSearchData(platform);
  return data.accounts.map((item) => item.account.user_profile);
}

/** A human-facing handle for the profile (caller prepends "@" if wanted). */
export function getProfileHandle(profile: UserProfileSummary): string {
  return (
    profile.username ??
    profile.handle ??
    profile.custom_name ??
    profile.fullname
  );
}

/** Two-letter monogram from a name (avatar fallback when a photo fails). */
export function getInitials(name: string): string {
  // Split on any non-alphanumeric run so "T-Series" -> "TS", "khaby.lame" -> "KL".
  const words = name.split(/[^A-Za-z0-9]+/).filter(Boolean);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return name.trim().slice(0, 2).toUpperCase();
}

/** A stable identifier for routing and detail lookups. */
export function getProfileIdentifier(profile: UserProfileSummary): string {
  return (
    profile.username ??
    profile.handle ??
    profile.custom_name ??
    profile.user_id
  );
}

export function filterProfiles(
  profiles: UserProfileSummary[],
  query: string
): UserProfileSummary[] {
  const q = query.trim().toLowerCase();
  if (!q) return profiles;
  return profiles.filter((p) =>
    [p.username, p.handle, p.custom_name, p.fullname].some((field) =>
      field?.toLowerCase().includes(q)
    )
  );
}

export const PLATFORMS: Platform[] = ["instagram", "youtube", "tiktok"];

export function getPlatformLabel(platform: Platform): string {
  if (platform === "instagram") return "Instagram";
  if (platform === "youtube") return "YouTube";
  return "TikTok";
}

/**
 * Find a profile's search summary by the identifier used in its route.
 * Tries the given platform first; if it is missing or invalid, scans all
 * platforms. Matches using the same getProfileIdentifier used to build URLs,
 * so the lookup round-trips and works on refresh / direct navigation.
 */
export function findProfile(
  identifier: string | undefined,
  platform?: string | null
): { profile: UserProfileSummary; platform: Platform } | undefined {
  if (!identifier) return undefined;
  const platformsToSearch =
    platform && PLATFORMS.includes(platform as Platform)
      ? [platform as Platform]
      : PLATFORMS;
  for (const p of platformsToSearch) {
    const match = extractProfiles(p).find(
      (profile) => getProfileIdentifier(profile) === identifier
    );
    if (match) return { profile: match, platform: p };
  }
  return undefined;
}
