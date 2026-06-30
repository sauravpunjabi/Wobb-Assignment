import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Platform, UserProfileSummary } from "@/types";

export interface ShortlistItem {
  /** `${platform}:${user_id}` — unique per creator per platform. */
  id: string;
  platform: Platform;
  profile: UserProfileSummary;
  addedAt: number;
}

/** Build the composite key one consistent way everywhere. */
export function makeShortlistId(
  platform: Platform,
  profile: UserProfileSummary
): string {
  return `${platform}:${profile.user_id}`;
}

interface ShortlistState {
  items: ShortlistItem[];
  add: (profile: UserProfileSummary, platform: Platform) => void;
  remove: (id: string) => void;
  toggle: (profile: UserProfileSummary, platform: Platform) => void;
  clear: () => void;
  isShortlisted: (id: string) => boolean;
}

export const useShortlistStore = create<ShortlistState>()(
  persist(
    (set, get) => ({
      items: [],

      add: (profile, platform) => {
        const id = makeShortlistId(platform, profile);
        if (get().items.some((item) => item.id === id)) return; // no duplicates
        set((state) => ({
          items: [...state.items, { id, platform, profile, addedAt: Date.now() }],
        }));
      },

      remove: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),

      toggle: (profile, platform) => {
        const id = makeShortlistId(platform, profile);
        if (get().isShortlisted(id)) {
          get().remove(id);
        } else {
          get().add(profile, platform);
        }
      },

      clear: () => set({ items: [] }),

      isShortlisted: (id) => get().items.some((item) => item.id === id),
    }),
    {
      name: "wobb-shortlist",
      version: 1,
      partialize: (state) => ({ items: state.items }),
    }
  )
);
