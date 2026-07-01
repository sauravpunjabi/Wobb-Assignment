import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Bookmark } from "lucide-react";
import { useShortlistStore } from "@/store/shortlistStore";
import { ShortlistDrawer } from "./ShortlistDrawer";

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

export function Layout({ children, title }: LayoutProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const count = useShortlistStore((state) => state.items.length);

  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg)] text-[var(--text)]">
      <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--bg)]/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link
            to="/"
            className="font-meta text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--text-muted)] transition-colors hover:text-[var(--text)]"
          >
            <span className="text-[var(--text)]">Wobb</span> / Creator Directory
          </Link>

          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="relative inline-flex items-center gap-2 rounded-full border border-[var(--text)] px-4 py-2 font-meta text-xs font-semibold uppercase tracking-wider text-[var(--text)] transition-colors duration-200 hover:bg-[var(--accent)] hover:text-[var(--accent-contrast)] hover:border-[var(--accent)] cursor-pointer"
          >
            <Bookmark size={14} fill={count > 0 ? "currentColor" : "none"} />
            <span className="hidden sm:inline">Shortlist</span>
            <b className="font-bold">{count}</b>
          </button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        {title && (
          <h1 className="mb-8 text-3xl font-bold tracking-tight sm:text-4xl">
            {title}
          </h1>
        )}
        {children}
      </main>

      <footer className="mt-12 border-t border-[var(--border)] py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-2 px-4 font-meta text-[11px] uppercase tracking-[0.12em] text-[var(--text-muted)] sm:flex-row sm:items-center sm:px-6">
          <span>Wobb — Creator Directory / 2026</span>
          <span>Search · Shortlist · Ship</span>
        </div>
      </footer>

      <ShortlistDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  );
}
