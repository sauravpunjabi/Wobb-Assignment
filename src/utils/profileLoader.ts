import type { FullUserProfile, ProfileDetailResponse } from "@/types";

const profileModules = import.meta.glob<ProfileDetailResponse>(
  "../assets/data/profiles/*.json"
);

/**
 * Load the extended profile for a route identifier (usually a username, but
 * could be a handle/custom_name/user_id). Returns null when no matching
 * detail file exists — the caller then falls back to the search summary.
 */
export async function loadProfileDetail(
  identifier: string
): Promise<FullUserProfile | null> {
  const loader = profileModules[`../assets/data/profiles/${identifier}.json`];
  if (!loader) return null;

  const result = await loader();
  const response =
    (result as { default?: ProfileDetailResponse }).default ?? result;
  return (response as ProfileDetailResponse).data?.user_profile ?? null;
}
