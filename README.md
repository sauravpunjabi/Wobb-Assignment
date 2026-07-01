# Influencer Search

A small influencer‑discovery app: search creators across Instagram, YouTube and
TikTok, open a detailed profile, and build a **shortlist** that survives a page
refresh.

This repo is my submission for the Wobb "Vibe Coder" frontend take‑home. It
started from the provided buggy starter; I fixed the bugs, added the shortlist
feature, rebuilt the UI, and tightened the code.

- **Live demo:** https://influencer-search-three.vercel.app/
- **Stack:** React 19 · TypeScript · Vite 8 · Tailwind CSS v4 · Zustand · React Router 7 · Framer Motion · Lucide React

---

## Getting started

```bash
npm install
npm run dev      # start the dev server
npm run build    # type-check (tsc -b) + production build — must pass
npm run lint     # eslint
npm run preview  # preview the production build
```

Requires Node 18+.

---

## What I changed (at a glance)

1. **Fixed the intentional bugs** — including two that crash to a blank screen
   (see below).
2. **Built the shortlist feature** in **Zustand** with `localStorage`
   persistence (add, de‑duplicate, view, remove, clear — survives refresh).
3. **Redesigned the UI/UX** into a responsive, accessible editorial layout.
4. **Improved code quality** — real types, consolidated helpers, removed dead
   code and debug leftovers, graceful loading/empty/error states.
5. **Optimised performance** — memoised derived data, memoised list items, and
   lazy‑loaded per‑profile detail JSON (loaded only when a profile is opened).

---

## Libraries added

- **Zustand** — the app's single global store; holds the shortlist and uses the
  `persist` middleware for `localStorage`.
- **Framer Motion** — small UI transitions (headline reveal, card hover, list
  enter/exit, shortlist "pop"), all gated behind `prefers-reduced-motion`.
- **Lucide React** — lightweight, tree‑shakeable icons for UI actions.

---

## Bugs fixed

**Crashes / broken core behaviour**
- **Blank screen when searching YouTube** — filtering called `.includes()` on
  `username`, but several YouTube channels have no `username` (only `handle` /
  `custom_name`), throwing and unmounting the app. Filtering is now
  undefined‑safe, trimmed, case‑insensitive, and matches
  username/handle/custom_name/fullname.
- **Dead‑end profile pages** — only 6 of 30 profiles ship a detail JSON file, so
  every other profile errored out. The detail page now **falls back to the
  search summary** it already has, so every profile opens.
- **`npm install` failed** — an unused, React‑19‑incompatible dependency
  (`react-beautiful-dnd`) was removed.

**Wrong data / formatting**
- Engagement rate was multiplied by **10000** (showing e.g. `125.51%` instead of
  `1.26%`); now uses the correct `×100` formatter.
- The "Engagements" stat rendered the *rate* instead of the *count*.
- Card and detail page showed **different follower numbers** for the same
  creator (two data snapshots). The card summary is now the single source of
  truth for shared fields; the detail file only supplies fields it uniquely has.
- Three inconsistent follower formatters consolidated into one
  `Intl.NumberFormat` compact formatter.

**Accessibility / security**
- Added `alt` handling on all images and an **initials‑monogram fallback** for
  broken image URLs.
- Cards are now real, keyboard‑focusable links (stretched `<Link>`), not
  click‑only `<div>`s.
- External links use `rel="noopener noreferrer"`.

**Robustness / quality**
- Types now model the real data (`username` optional; added `handle`,
  `custom_name`, `account_type`, etc.).
- Profile loader wrapped in try/catch with a `loading | ready | not-found`
  status (no more infinite spinner on failure).
- Added a **404 catch‑all route** and a real page `<title>` + meta description.
- Removed debug code (`console.log`, `clickCount`, `data-search`), a duplicated
  TODO, and a dead unused component.
- Search query is trimmed (a whitespace‑only query no longer "matches nothing").

**Layout / navigation / performance**
- Removed the hard‑coded `700px` card width and the fixed `1126px` centered app
  shell — the layout is now fluid and responsive.
- The selected **platform tab is stored in the URL** (`?platform=`), so it's
  restored when you open a profile and hit back (previously it reset to
  Instagram); the search view is also shareable/bookmarkable.
- `extractProfiles` / `filterProfiles` are memoised; `ProfileCard` is
  `React.memo`’d.

---

## The shortlist feature

State lives in a single **Zustand** store (`src/store/shortlistStore.ts`) wrapped
in the `persist` middleware (`localStorage` key `wobb-shortlist`).

- **Add / remove** from anywhere via a toggle button (cards + detail page).
- **De‑duplication** uses a composite id `` `${platform}:${user_id}` `` so the
  same creator can't be added twice, and the same person on two platforms is
  treated as distinct.
- **View / manage** in a slide‑out drawer (list, remove one, clear all, empty
  state) opened from the header, which shows a live count badge.
- **Persists across refresh** — verified: add → reload → still there → remove →
  reload → clear.

> **Note on "replace Context with Zustand":** the starter shipped no React
> Context or global state at all, so there was nothing to replace. I introduced
> Zustand as the app's single global store — which is the state‑management
> approach the brief asked for.

---

## Design approach

The redesign focuses on a clean **editorial dashboard** experience — stronger
visual hierarchy, responsive profile cards, clearer shortlist actions, better
fallback states, and improved readability across screen sizes. Key choices:

- **Type:** Bricolage Grotesque (display) · Space Grotesk (body/UI) · JetBrains
  Mono (labels & metrics) — distinctive, non‑generic.
- **Palette:** alabaster canvas, charcoal ink, **solid forest‑green + terracotta**
  accents (no gradients). Light theme only.
- **Motion:** staggered headline reveal, card hover‑lift, list enter/exit and a
  shortlist "pop" (Framer Motion), all respecting `prefers-reduced-motion`.
- **Detail page:** stat cards, a hand‑built SVG **follower‑growth chart** with an
  interactive tooltip, and a **topic‑tags** section (for profiles that have that
  data).

Design tokens are CSS variables in `src/index.css`; base element rules live in
`@layer base` so Tailwind utilities always win (this fixed an invisible
ink‑on‑ink button).

---

## Accessibility & performance

- Keyboard‑navigable cards and controls, visible `:focus-visible` rings,
  `aria-label` / `aria-pressed` on interactive elements, `role="dialog"` +
  Escape‑to‑close drawer, labelled search input, `prefers-reduced-motion` honored.
- No horizontal overflow at 375px; cards reflow to a single column.
- Per‑profile detail JSON is lazy‑loaded via `import.meta.glob`, so each detail
  file is its own code‑split chunk instead of bloating the main bundle.

---

## Assumptions & trade‑offs

- **Only 6 of 30 profiles have deep data.** The dataset ships detail JSON
  (posts, follower history, top topics) for just 6 creators; the rest only have
  summary metrics. Rather than fabricate numbers, summary‑only profiles show
  their real metrics plus a small "limited dataset" note.
- **Several image URLs are dead.** Some avatar URLs (notably a few YouTube
  channels) return 404 or are hotlink‑blocked. These fall back to a clean
  initials monogram; I chose not to edit the provided data to swap them.
- **No search debounce.** The dataset is tiny and in‑memory, so filtering on
  each keystroke is instant; a debounce would add complexity for no gain.
- **Light theme only.** A dark mode was prototyped then removed to keep the
  visual language focused.

---

## Possible improvements

- Deploy to Vercel and add the live link above.
- Unit tests for the shortlist store (add / dedupe / remove / persist).
- A formal accessibility audit (colour‑contrast / tab‑order).
- Fetch fresh avatar URLs (or proxy them) to recover the broken images.

---

## Project structure

```
src/
  components/   Layout, ProfileCard, ProfileList, PlatformFilter, Avatar,
                ShortlistButton, ShortlistDrawer, VerifiedBadge
  pages/        SearchPage, ProfileDetailPage, NotFound
  store/        shortlistStore (Zustand + persist)
  utils/        dataHelpers, formatters, profileLoader
  types/        shared TypeScript types
  assets/data/  search/*.json (summaries) + profiles/*.json (details)
```

---

_Built with assistance from AI tools, as permitted by the brief. I reviewed,
tested, and made the final implementation decisions._
