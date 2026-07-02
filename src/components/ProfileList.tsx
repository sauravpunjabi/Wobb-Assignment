import { motion, AnimatePresence } from "framer-motion";
import type { Platform, UserProfileSummary } from "@/types";
import { ProfileCard } from "./ProfileCard";

interface ProfileListProps {
  profiles: UserProfileSummary[];
  platform: Platform;
  query?: string;
}

export function ProfileList({ profiles, platform, query }: ProfileListProps) {
  if (profiles.length === 0) {
    return (
      <div className="mx-auto max-w-md rounded border border-dashed border-[var(--border)] px-6 py-16 text-center">
        <p className="font-meta text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-muted)]">
          No entries in the index
        </p>
        <p className="mt-3 font-editorial text-lg text-[var(--text-muted)]">
          {query
            ? `Nothing matches “${query}” — try a shorter name.`
            : "This page of the index is empty."}
        </p>
      </div>
    );
  }

  return (
    <motion.div
      layout
      className="grid gap-5 [grid-template-columns:repeat(auto-fill,minmax(260px,1fr))]"
    >
      <AnimatePresence mode="popLayout">
        {profiles.map((profile, index) => (
          <motion.div
            key={profile.user_id}
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="h-full"
          >
            <ProfileCard profile={profile} platform={platform} index={index} />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
