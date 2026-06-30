import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useShortlistStore } from "@/store/shortlistStore";
import type { ShortlistItem } from "@/store/shortlistStore";
import {
  getPlatformLabel,
  getProfileHandle,
  getProfileIdentifier,
} from "@/utils/dataHelpers";
import { formatCompactNumber } from "@/utils/formatters";

interface ShortlistDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function ShortlistDrawer({ open, onClose }: ShortlistDrawerProps) {
  const items = useShortlistStore((state) => state.items);
  const remove = useShortlistStore((state) => state.remove);
  const clear = useShortlistStore((state) => state.clear);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const openProfile = (item: ShortlistItem) => {
    const id = getProfileIdentifier(item.profile);
    navigate(`/profile/${id}?platform=${item.platform}`);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50"
      role="dialog"
      aria-modal="true"
      aria-label="Shortlist"
    >
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <aside className="absolute right-0 top-0 h-full w-full max-w-sm bg-white shadow-xl flex flex-col text-left">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Shortlist ({items.length})</h2>
          <div className="flex items-center gap-3">
            {items.length > 0 && (
              <button
                type="button"
                onClick={clear}
                className="text-sm text-red-600 hover:underline"
              >
                Clear all
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close shortlist"
              className="text-gray-500 hover:text-gray-800 text-2xl leading-none"
            >
              ×
            </button>
          </div>
        </div>

        {items.length === 0 ? (
          <p className="p-6 text-sm text-gray-500">
            No profiles yet. Add some from the search.
          </p>
        ) : (
          <ul className="flex-1 overflow-y-auto divide-y">
            {items.map((item) => (
              <li key={item.id} className="flex items-center gap-3 p-3">
                <img
                  src={item.profile.picture}
                  alt={`${item.profile.fullname} profile picture`}
                  className="w-10 h-10 rounded-full shrink-0"
                />
                <button
                  type="button"
                  onClick={() => openProfile(item)}
                  className="flex-1 text-left min-w-0"
                >
                  <div className="font-medium text-sm truncate">
                    @{getProfileHandle(item.profile)}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {getPlatformLabel(item.platform)} ·{" "}
                    {formatCompactNumber(item.profile.followers)} followers
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => remove(item.id)}
                  aria-label={`Remove ${getProfileHandle(
                    item.profile
                  )} from shortlist`}
                  className="text-sm text-gray-400 hover:text-red-600 shrink-0"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </aside>
    </div>
  );
}
