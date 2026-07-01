import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2 } from "lucide-react";
import { useShortlistStore } from "@/store/shortlistStore";
import type { ShortlistItem } from "@/store/shortlistStore";
import { Avatar } from "./Avatar";
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

  const openProfile = (item: ShortlistItem) => {
    const id = getProfileIdentifier(item.profile);
    navigate(`/profile/${id}?platform=${item.platform}`);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-50 flex justify-end"
          role="dialog"
          aria-modal="true"
          aria-label="Shortlist"
        >
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/45 backdrop-blur-xs cursor-pointer"
          />

          {/* Drawer Sheet */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            className="relative w-full max-w-sm bg-[var(--surface)] border-l border-[var(--border)] shadow-2xl flex flex-col text-left z-10"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-[var(--border)]">
              <div>
                <span className="text-[10px] font-meta font-extrabold uppercase tracking-widest text-[var(--accent-alt)]">
                  Selected Creators
                </span>
                <h2 className="text-lg font-extrabold mt-0.5">
                  Shortlist ({items.length})
                </h2>
              </div>
              <div className="flex items-center gap-3">
                {items.length > 0 && (
                  <button
                    type="button"
                    onClick={clear}
                    className="flex items-center gap-1 text-xs font-meta font-semibold uppercase tracking-wider text-[var(--accent-alt)] hover:text-red-500 transition-colors cursor-pointer"
                  >
                    <Trash2 size={12} />
                    <span>Clear</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close shortlist"
                  className="flex h-7 w-7 items-center justify-center rounded border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] hover:bg-[var(--surface-2)] transition-all duration-200 cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* List Content */}
            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="p-8 text-center h-full flex flex-col justify-center items-center space-y-3">
                  <div className="h-10 w-10 rounded bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] text-base">
                    ✦
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold">Your list is empty</p>
                    <p className="text-xs text-[var(--text-muted)] max-w-[200px] mx-auto leading-relaxed">
                      Add creators from the search page to compile your shortlist.
                    </p>
                  </div>
                </div>
              ) : (
                <ul className="divide-y divide-[var(--border)]">
                  <AnimatePresence>
                    {items.map((item) => (
                      <motion.li
                        key={item.id}
                        layout
                        exit={{ opacity: 0, x: 20 }}
                        className="flex items-center gap-3.5 p-4 hover:bg-[var(--surface-2)] transition-colors duration-250 group"
                      >
                        <Avatar
                          src={item.profile.picture}
                          name={item.profile.fullname}
                          className="h-10 w-10"
                          textClassName="text-xs"
                        />
                        <button
                          type="button"
                          onClick={() => openProfile(item)}
                          className="flex-1 text-left min-w-0 cursor-pointer"
                        >
                          <div className="font-extrabold text-sm truncate group-hover:text-[var(--accent-alt)] transition-colors">
                            @{getProfileHandle(item.profile)}
                          </div>
                          <div className="text-[10px] font-meta font-bold uppercase tracking-wider text-[var(--text-muted)] truncate mt-0.5">
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
                          className="text-xs font-meta font-semibold uppercase tracking-wider text-[var(--text-muted)] hover:text-red-500 transition-colors cursor-pointer shrink-0"
                        >
                          Remove
                        </button>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
