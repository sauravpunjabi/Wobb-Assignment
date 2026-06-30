import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
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
    <div className="p-4 min-h-screen">
      <header className="mb-6 border-b pb-4">
        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="text-xl font-semibold text-gray-900">
            Influencer Search
          </Link>
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="px-3 py-1.5 text-sm rounded border border-gray-400 hover:bg-gray-100"
          >
            Shortlist
            {count > 0 && (
              <span className="ml-2 inline-flex items-center justify-center rounded-full bg-gray-900 text-white text-xs px-2 py-0.5">
                {count}
              </span>
            )}
          </button>
        </div>
        {title && <h1 className="text-2xl mt-2">{title}</h1>}
      </header>
      <main>{children}</main>

      <ShortlistDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  );
}
