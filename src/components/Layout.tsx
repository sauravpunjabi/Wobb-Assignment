import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Bookmark } from "lucide-react";
import { useShortlistStore } from "@/store/shortlistStore";
import { PLATFORMS, extractProfiles } from "@/utils/dataHelpers";
import { ShortlistDrawer } from "./ShortlistDrawer";

interface LayoutProps {
  children: ReactNode;
}

/** Total creators in the static index — shown in the masthead and colophon. */
const TOTAL_CREATORS = PLATFORMS.reduce(
  (total, platform) => total + extractProfiles(platform).length,
  0
);

/** Six-spoke asterisk — the wordmark glyph (SVG, so it never renders as emoji). */
function AsteriskMark() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      aria-hidden="true"
      className="h-[18px] w-[18px]"
    >
      <path d="M12 3v18M4.2 7.5l15.6 9M19.8 7.5l-15.6 9" />
    </svg>
  );
}

export function Layout({ children }: LayoutProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const count = useShortlistStore((state) => state.items.length);

  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg)] text-[var(--text)]">
      <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--bg)]/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link
            to="/"
            aria-label="Influencer Search — back to the index"
            className="group flex items-center gap-3"
          >
            <span
              aria-hidden="true"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-[var(--text)] text-[var(--bg)] transition-colors duration-200 group-hover:bg-[var(--accent)]"
            >
              <AsteriskMark />
            </span>
            <span className="leading-none">
              <span className="block font-display text-[15px] font-extrabold tracking-tight">
                Influencer Search
              </span>
              <span className="mt-1 block font-meta text-[9px] font-bold uppercase tracking-[0.24em] text-[var(--text-muted)]">
                Creator index · {TOTAL_CREATORS} profiles
              </span>
            </span>
          </Link>

          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="relative inline-flex cursor-pointer items-center gap-2 rounded-sm border border-[var(--text)] bg-[var(--surface)] px-4 py-2 font-meta text-xs font-bold uppercase tracking-wider text-[var(--text)] transition-all duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0_0_var(--text)] active:translate-x-0 active:translate-y-0 active:shadow-none"
          >
            <Bookmark size={14} fill={count > 0 ? "currentColor" : "none"} />
            <span className="hidden sm:inline">Shortlist</span>
            <b
              className={`font-bold tabular-nums ${
                count > 0 ? "text-[var(--accent-alt)]" : ""
              }`}
            >
              {count}
            </b>
          </button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        {children}
      </main>

      <footer className="mt-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="rule-double" />
          <div className="flex flex-col items-start gap-2 py-6 font-meta text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--text-muted)] sm:flex-row sm:items-center sm:justify-between">
            <span>Influencer Search — Vol. 01 / 2026</span>
            <span className="font-editorial text-sm font-normal normal-case tracking-normal">
              search, shortlist, ship.
            </span>
            <span>
              {TOTAL_CREATORS} creators · {PLATFORMS.length} platforms
            </span>
          </div>
        </div>
      </footer>

      <ShortlistDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  );
}
