import { useMemo, useState } from "react";
import type { Platform } from "@/types";
import { getInitials } from "@/utils/dataHelpers";

interface AvatarProps {
  src: string;
  /** Full name — used for the initials fallback and (optionally) alt text. */
  name: string;
  /** Platform + handle enable the unavatar.io mirror when `src` is dead. */
  platform?: Platform;
  handle?: string;
  /** Sizing/spacing classes for the circle wrapper (e.g. "h-16 w-16"). */
  className?: string;
  /** Font-size class for the fallback initials. */
  textClassName?: string;
}

/**
 * Circular avatar with a two-step fallback: several dataset image URLs are
 * dead / hotlink-blocked (esp. on YouTube), so when the primary photo fails
 * we retry via unavatar.io (which resolves a fresh avatar from the platform
 * handle) before settling on an initials monogram.
 */
export function Avatar({
  src,
  name,
  platform,
  handle,
  className = "",
  textClassName = "",
}: AvatarProps) {
  const candidates = useMemo(() => {
    const mirror =
      platform && handle
        ? `https://unavatar.io/${platform}/${encodeURIComponent(
            handle
          )}?fallback=false`
        : null;
    return [src, mirror].filter((url): url is string => Boolean(url));
  }, [src, platform, handle]);

  const [attempt, setAttempt] = useState(0);

  // New profile (new candidate list) — restart from the primary URL. State is
  // adjusted during render (not in an effect) per the React docs pattern.
  const key = candidates.join("|");
  const [prevKey, setPrevKey] = useState(key);
  if (prevKey !== key) {
    setPrevKey(key);
    setAttempt(0);
  }

  const current = candidates[attempt];

  return (
    <div
      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-[var(--border)] bg-[var(--surface-2)] ${className}`}
    >
      {current ? (
        <img
          key={current}
          src={current}
          alt=""
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => setAttempt((i) => i + 1)}
          className="h-full w-full object-cover"
        />
      ) : (
        <span
          className={`font-display font-bold text-[var(--text-muted)] ${textClassName}`}
        >
          {getInitials(name)}
        </span>
      )}
    </div>
  );
}
