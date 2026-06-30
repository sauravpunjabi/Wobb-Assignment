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
      className={
        shortlisted
          ? "px-3 py-1 text-sm rounded border border-green-600 text-green-700 bg-green-50 hover:bg-green-100"
          : "px-3 py-1 text-sm rounded border border-gray-400 text-gray-800 hover:bg-gray-100"
      }
    >
      {shortlisted ? "Added ✓" : "Add to List"}
    </button>
  );
}
