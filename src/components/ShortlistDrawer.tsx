import { useEffect, useRef } from "react";
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
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Escape closes the drawer.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Lock background scroll while the drawer is open.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  // Move focus into the dialog when it opens.
  useEffect(() => {
    if (open) closeButtonRef.current?.focus();
  }, [open]);

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
            className="relative z-10 flex w-full max-w-sm flex-col border-l border-[var(--border)] bg-[var(--surface)] text-left shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[var(--border)] p-5">
              <div>
                <span className="font-meta text-[10px] font-extrabold uppercase tracking-widest text-[var(--accent-alt)]">
                  Selected creators
                </span>
                <h2 className="mt-0.5 text-lg font-extrabold">
                  Shortlist{" "}
                  <span className="tabular-nums">({items.length})</span>
                </h2>
              </div>
              <div className="flex items-center gap-3">
                {items.length > 0 && (
                  <button
                    type="button"
                    onClick={clear}
                    className="flex cursor-pointer items-center gap-1 font-meta text-xs font-semibold uppercase tracking-wider text-[var(--accent-alt)] transition-colors hover:text-red-500"
                  >
                    <Trash2 size={12} />
                    <span>Clear</span>
                  </button>
                )}
                <button
                  type="button"
                  ref={closeButtonRef}
                  onClick={onClose}
                  aria-label="Close shortlist"
                  className="flex h-7 w-7 cursor-pointer items-center justify-center rounded border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] transition-all duration-200 hover:bg-[var(--surface-2)]"
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* List Content */}
            <div className="scroll-ledger flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center space-y-3 p-8 text-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded border border-[var(--border)] bg-[var(--surface-2)] text-base text-[var(--text-muted)]">
                    ✦
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold">Your list is empty</p>
                    <p className="mx-auto max-w-[220px] font-editorial text-sm leading-relaxed text-[var(--text-muted)]">
                      Add creators from the index to start compiling your
                      shortlist.
                    </p>
                  </div>
                </div>
              ) : (
                <ul className="divide-y divide-[var(--border)]">
                  <AnimatePresence>
                    {items.map((item, i) => (
                      <motion.li
                        key={item.id}
                        layout
                        exit={{ opacity: 0, x: 20 }}
                        className="group flex items-center gap-3 p-4 transition-colors duration-250 hover:bg-[var(--surface-2)]"
                      >
                        <span className="w-5 shrink-0 font-meta text-[10px] font-extrabold tracking-widest text-[var(--text-muted)] tabular-nums">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <Avatar
                          src={item.profile.picture}
                          name={item.profile.fullname}
                          platform={item.platform}
                          handle={getProfileHandle(item.profile)}
                          className="h-10 w-10"
                          textClassName="text-xs"
                        />
                        <button
                          type="button"
                          onClick={() => openProfile(item)}
                          className="min-w-0 flex-1 cursor-pointer text-left"
                        >
                          <div className="truncate text-sm font-extrabold transition-colors group-hover:text-[var(--accent-alt)]">
                            @{getProfileHandle(item.profile)}
                          </div>
                          <div className="mt-0.5 truncate font-meta text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                            {getPlatformLabel(item.platform)} ·{" "}
                            {formatCompactNumber(item.profile.followers)}{" "}
                            followers
                          </div>
                        </button>
                        <button
                          type="button"
                          onClick={() => remove(item.id)}
                          aria-label={`Remove ${getProfileHandle(
                            item.profile
                          )} from shortlist`}
                          className="shrink-0 cursor-pointer font-meta text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] transition-colors hover:text-red-500"
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
