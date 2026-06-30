import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { ShortlistButton } from "@/components/ShortlistButton";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import type { FullUserProfile } from "@/types";
import { findProfile, getProfileHandle } from "@/utils/dataHelpers";
import { formatCompactNumber, formatEngagementRate } from "@/utils/formatters";
import { loadProfileDetail } from "@/utils/profileLoader";

type Status = "loading" | "ready" | "not-found";

export function ProfileDetailPage() {
  const { username: identifier } = useParams<{ username: string }>();
  const [searchParams] = useSearchParams();
  const platform = searchParams.get("platform");

  // The search summary is resolved from data (not router state) so the page
  // works on refresh and direct navigation.
  const found = useMemo(
    () => findProfile(identifier, platform),
    [identifier, platform]
  );
  const summary = found?.profile;
  const resolvedPlatform = found?.platform;
  const [detail, setDetail] = useState<FullUserProfile | null>(null);
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setStatus("loading");
      let detailProfile: FullUserProfile | null = null;

      if (identifier) {
        try {
          detailProfile = await loadProfileDetail(identifier);
        } catch {
          detailProfile = null;
        }
      }

      if (cancelled) return;
      setDetail(detailProfile);
      setStatus(detailProfile || summary ? "ready" : "not-found");
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [identifier, summary]);

  // The search summary is authoritative for card-visible identity/core fields,
  // so the numbers match what the user clicked. The detail JSON only supplies
  // the richer fields it uniquely provides.
  const user = useMemo<FullUserProfile | null>(() => {
    if (detail && summary) {
      return {
        ...detail,
        fullname: summary.fullname,
        username: summary.username,
        handle: summary.handle,
        custom_name: summary.custom_name,
        picture: summary.picture,
        followers: summary.followers,
        is_verified: summary.is_verified,
        engagement_rate: summary.engagement_rate,
        engagements: summary.engagements,
      };
    }
    return detail ?? summary ?? null;
  }, [detail, summary]);

  if (status === "loading") {
    return (
      <Layout title={identifier ? `@${identifier}` : undefined}>
        <p className="text-gray-400">Loading...</p>
      </Layout>
    );
  }

  if (status === "not-found" || !user) {
    return (
      <Layout title={identifier ? `@${identifier}` : undefined}>
        <p className="text-red-600 mb-4">Could not find this profile.</p>
        <Link to="/" className="text-blue-600 underline">
          Back to search
        </Link>
      </Layout>
    );
  }

  return (
    <Layout title={user.fullname}>
      <Link to="/" className="text-sm text-blue-600 mb-4 inline-block">
        ← Back to search
      </Link>

      <div className="flex gap-6 items-start text-left max-w-2xl mx-auto">
        <img
          src={user.picture}
          className="w-24 h-24 rounded-full border"
        />
        <div className="flex-1">
          <h2 className="text-xl font-bold">
            @{getProfileHandle(user)}
            <VerifiedBadge verified={user.is_verified} />
          </h2>
          <p className="text-gray-600">{user.fullname}</p>
          <p className="text-xs text-gray-400 mt-1">
            Platform: {platform ?? "unknown"}
          </p>

          {user.description && (
            <p className="mt-3 text-sm text-gray-700">{user.description}</p>
          )}

          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div className="border p-2 rounded">
              <div className="text-gray-500">Followers</div>
              <div className="font-semibold">
                {formatCompactNumber(user.followers)}
              </div>
            </div>
            <div className="border p-2 rounded">
              <div className="text-gray-500">Engagement Rate</div>
              <div className="font-semibold">
                {formatEngagementRate(user.engagement_rate)}
              </div>
            </div>
            {user.posts_count !== undefined && (
              <div className="border p-2 rounded">
                <div className="text-gray-500">Posts</div>
                <div className="font-semibold">{user.posts_count}</div>
              </div>
            )}
            {user.avg_likes !== undefined && (
              <div className="border p-2 rounded">
                <div className="text-gray-500">Avg Likes</div>
                <div className="font-semibold">
                  {formatCompactNumber(user.avg_likes)}
                </div>
              </div>
            )}
            {user.avg_comments !== undefined && (
              <div className="border p-2 rounded">
                <div className="text-gray-500">Avg Comments</div>
                <div className="font-semibold">{user.avg_comments}</div>
              </div>
            )}
            {user.avg_views !== undefined && user.avg_views > 0 && (
              <div className="border p-2 rounded">
                <div className="text-gray-500">Avg Views</div>
                <div className="font-semibold">
                  {formatCompactNumber(user.avg_views)}
                </div>
              </div>
            )}
            {user.engagements !== undefined && (
              <div className="border p-2 rounded">
                <div className="text-gray-500">Engagements</div>
                <div className="font-semibold">
                  {user.engagements.toLocaleString()}
                </div>
              </div>
            )}
          </div>

          {user.url && (
            <a
              href={user.url}
              target="_blank"
              className="inline-block mt-4 text-blue-600 text-sm"
            >
              View on platform →
            </a>
          )}

          {summary && resolvedPlatform && (
            <div className="mt-4">
              <ShortlistButton profile={summary} platform={resolvedPlatform} />
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
