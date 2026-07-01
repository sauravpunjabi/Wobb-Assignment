import { useState } from "react";
import { getInitials } from "@/utils/dataHelpers";

interface AvatarProps {
  src: string;
  /** Full name — used for the initials fallback and (optionally) alt text. */
  name: string;
  /** Sizing/spacing classes for the circle wrapper (e.g. "h-16 w-16"). */
  className?: string;
  /** Font-size class for the fallback initials. */
  textClassName?: string;
}

/**
 * Circular avatar with a graceful fallback: if the photo is missing or fails to
 * load (several dataset image URLs are dead / rate-limited, esp. on YouTube),
 * it shows an initials monogram instead of a broken image.
 */
export function Avatar({
  src,
  name,
  className = "",
  textClassName = "",
}: AvatarProps) {
  const [failed, setFailed] = useState(false);
  const showFallback = failed || !src;

  return (
    <div
      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-[var(--border)] bg-[var(--surface-2)] ${className}`}
    >
      {showFallback ? (
        <span className={`font-display font-bold text-[var(--text-muted)] ${textClassName}`}>
          {getInitials(name)}
        </span>
      ) : (
        <img
          src={src}
          alt=""
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => setFailed(true)}
          className="h-full w-full object-cover"
        />
      )}
    </div>
  );
}
