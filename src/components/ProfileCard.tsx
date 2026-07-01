import { memo } from "react";
import { Link } from "react-router-dom";
import type { Platform, UserProfileSummary } from "@/types";
import {
  getPlatformLabel,
  getProfileHandle,
  getProfileIdentifier,
} from "@/utils/dataHelpers";
import { formatCompactNumber, formatEngagementRate } from "@/utils/formatters";
import { Avatar } from "./Avatar";
import { ShortlistButton } from "./ShortlistButton";
import { VerifiedBadge } from "./VerifiedBadge";

interface ProfileCardProps {
  profile: UserProfileSummary;
  platform: Platform;
}

export const ProfileCard = memo(function ProfileCard({
  profile,
  platform,
}: ProfileCardProps) {
  const identifier = getProfileIdentifier(profile);

  return (
    <article className="group relative flex h-full flex-col rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-[var(--text)] hover:shadow-[var(--card-shadow)]">
      {/* Stretched link — whole card navigates, keyboard-focusable */}
      <Link
        to={`/profile/${identifier}?platform=${platform}`}
        aria-label={`View ${profile.fullname}'s profile`}
        className="absolute inset-0 z-[1] rounded-xl"
      />

      {/* Top row */}
      <div className="flex items-center justify-between gap-2">
        <span className="inline-flex rounded-sm bg-[var(--surface-2)] px-2 py-1 font-meta text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
          {getPlatformLabel(platform)}
        </span>
        <div className="relative z-[2]">
          <ShortlistButton profile={profile} platform={platform} />
        </div>
      </div>

      {/* Identity */}
      <div className="mt-4 flex items-center gap-4">
        <Avatar
          src={profile.picture}
          name={profile.fullname}
          className="h-16 w-16"
          textClassName="text-xl"
        />
        <div className="min-w-0">
          <h3 className="flex items-center gap-1.5 truncate font-display text-lg font-bold leading-tight">
            <span className="truncate">{profile.fullname}</span>
            <VerifiedBadge verified={profile.is_verified} />
          </h3>
          <p className="mt-0.5 truncate font-meta text-xs text-[var(--text-muted)]">
            @{getProfileHandle(profile)}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-auto flex items-end justify-between border-t border-[var(--border)] pt-4">
        <div>
          <p className="font-display text-2xl font-bold leading-none">
            {formatCompactNumber(profile.followers)}
          </p>
          <p className="mt-1 font-meta text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">
            Followers
          </p>
        </div>
        <div className="text-right">
          <p className="font-display text-2xl font-bold leading-none text-[var(--accent-alt)]">
            {formatEngagementRate(profile.engagement_rate)}
          </p>
          <p className="mt-1 font-meta text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">
            Engagement
          </p>
        </div>
      </div>
    </article>
  );
});
