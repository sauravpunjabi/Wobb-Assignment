import { makeShortlistId, useShortlistStore } from "@/store/shortlistStore";
import type { Platform, UserProfileSummary } from "@/types";

interface ShortlistButtonProps {
  profile: UserProfileSummary;
  platform: Platform;
}

export function ShortlistButton({ profile, platform }: ShortlistButtonProps) {
  const id = makeShortlistId(platform, profile);
  const shortlisted = useShortlistStore((state) =>
    state.items.some((item) => item.id === id)
  );
  const toggle = useShortlistStore((state) => state.toggle);

  return (
    <button
      type="button"
      aria-pressed={shortlisted}
      onClick={(e) => {
        e.stopPropagation();
        toggle(profile, platform);
      }}
      className={`px-3 py-1.5 text-[10px] font-meta font-extrabold uppercase tracking-wider rounded-sm border transition-all duration-200 cursor-pointer ${
        shortlisted
          ? "border-[var(--accent-alt)] bg-[var(--accent-alt-soft)] text-[var(--accent-alt)]"
          : "border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] hover:border-[var(--text)] hover:text-[var(--text)] active:scale-[0.96]"
      }`}
    >
      {shortlisted ? "Added ✓" : "Add to List"}
    </button>
  );
}
