interface VerifiedBadgeProps {
  verified: boolean;
}

/** Solid ink disc with a paper checkmark — editorial, matches the detail view. */
export function VerifiedBadge({ verified }: VerifiedBadgeProps) {
  if (!verified) return null;
  return (
    <span
      role="img"
      aria-label="Verified"
      title="Verified"
      className="inline-flex h-[15px] w-[15px] shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-[var(--accent-contrast)]"
    >
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-2.5 w-2.5">
        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
      </svg>
    </span>
  );
}
