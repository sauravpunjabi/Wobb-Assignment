export type Platform = "instagram" | "youtube" | "tiktok";

export interface Language {
  code: string;
  name?: string;
}

/**
 * A profile as it appears in the platform search results.
 *
 * `username` is intentionally optional: not every account in the sample
 * data exposes one (several YouTube channels only have `handle` /
 * `custom_name`). Anything that needs a stable handle should resolve it
 * defensively rather than assuming `username` exists.
 */
export interface UserProfileSummary {
  user_id: string;
  username?: string;
  handle?: string;
  custom_name?: string;
  sec_uid?: string;
  url: string;
  picture: string;
  fullname: string;
  is_verified: boolean;
  account_type?: number;
  followers: number;
  engagements?: number;
  engagement_rate?: number;
  avg_views?: number;
}

export interface SearchAccount {
  account: {
    user_profile: UserProfileSummary;
    audience_source?: string;
  };
  match?: Record<string, unknown>;
  search_result_id?: string;
}

export interface SearchData {
  total: number;
  accounts: SearchAccount[];
}

export interface Hashtag {
  tag: string;
  weight: number;
}

export interface StatHistoryItem {
  month: string;
  followers: number;
  following?: number;
  avg_likes?: number;
}

/**
 * Extended profile loaded from the per-profile detail JSON files.
 * Only the fields the UI consumes are modelled explicitly; the source
 * data also carries top posts, audience breakdowns, etc. that we ignore.
 */
export interface FullUserProfile extends UserProfileSummary {
  type?: string;
  description?: string;
  is_business?: boolean;
  is_hidden?: boolean;
  language?: Language;
  posts_count?: number;
  avg_likes?: number;
  avg_comments?: number;
  avg_reels_plays?: number;
  gender?: string;
  age_group?: string;
  top_hashtags?: Hashtag[];
  stat_history?: StatHistoryItem[];
}

export interface ProfileDetailResponse {
  cached?: boolean;
  data: {
    success: boolean;
    user_profile: FullUserProfile;
  };
}
