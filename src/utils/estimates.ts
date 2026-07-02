import type { StatHistoryItem, UserProfileSummary } from "@/types";

/**
 * Only 6 of 30 profiles ship deep analytics in the sample dataset. For the
 * rest, we model the missing figures from the profile's REAL summary metrics
 * (followers + engagement rate) instead of leaving the page empty. Everything
 * produced here is flagged "est." in the UI — modeled, not measured.
 *
 * The generator is seeded from user_id, so a profile's estimates are stable
 * across visits and reloads.
 */

function hashSeed(str: string): number {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return h >>> 0;
}

/** Small deterministic PRNG (mulberry32). */
function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface EstimatedStats {
  avg_likes?: number;
  avg_comments?: number;
  stat_history: StatHistoryItem[];
}

export function estimateProfileStats(
  profile: UserProfileSummary
): EstimatedStats {
  const rand = mulberry32(hashSeed(profile.user_id));

  // "engagements" in this dataset is the per-post average; derive it from the
  // engagement rate when the summary doesn't carry it directly.
  const engagements =
    profile.engagements ??
    (profile.engagement_rate !== undefined
      ? profile.engagement_rate * profile.followers
      : undefined);

  // Typical like/comment split of total engagements.
  const avg_likes =
    engagements !== undefined
      ? Math.round(engagements * (0.9 + rand() * 0.05))
      : undefined;
  const avg_comments =
    engagements !== undefined
      ? Math.round(engagements * (0.03 + rand() * 0.03))
      : undefined;

  // Walk backwards from today's real follower count using a monthly growth
  // rate proportional to engagement (more engaged audiences grow faster).
  const engagementRate = profile.engagement_rate ?? 0.01;
  const baseMonthlyGrowth = Math.min(0.035, 0.004 + engagementRate * 0.6);
  const stat_history: StatHistoryItem[] = [];
  let followers = profile.followers;
  const now = new Date();
  for (let i = 0; i < 8; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    stat_history.unshift({
      month: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
      followers: Math.round(followers),
    });
    followers /= 1 + baseMonthlyGrowth * (0.6 + rand() * 0.8);
  }

  return { avg_likes, avg_comments, stat_history };
}
