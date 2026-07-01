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
      <div className="mx-auto max-w-md rounded-xl border border-dashed border-[var(--border)] py-16 text-center">
        <p className="font-meta text-sm text-[var(--text-muted)]">
          No creators found{query ? ` for “${query}”` : ""}.
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
        {profiles.map((profile) => (
          <motion.div
            key={profile.user_id}
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="h-full"
          >
            <ProfileCard profile={profile} platform={platform} />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
