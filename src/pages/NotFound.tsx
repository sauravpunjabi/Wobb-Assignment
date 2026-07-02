import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Layout } from "@/components/Layout";

export function NotFound() {
  return (
    <Layout>
      <div className="flex flex-col items-center py-20 text-center">
        <p className="font-meta text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--accent-alt)]">
          Error — not in the index
        </p>
        <h1 className="text-outline mt-4 font-display text-[clamp(96px,22vw,190px)] font-extrabold leading-none">
          404
        </h1>
        <p className="mt-5 max-w-sm font-editorial text-xl text-[var(--text-muted)]">
          This page slipped out of the ledger — or never made the cut.
        </p>
        <Link
          to="/"
          className="mt-9 inline-flex items-center gap-2 rounded-sm border border-[var(--text)] bg-[var(--text)] px-5 py-2.5 font-meta text-xs font-bold uppercase tracking-widest text-[var(--bg)] transition-all duration-200 hover:bg-transparent hover:text-[var(--text)]"
        >
          <ArrowLeft size={12} /> Back to the index
        </Link>
      </div>
    </Layout>
  );
}
