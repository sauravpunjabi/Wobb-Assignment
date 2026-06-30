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
