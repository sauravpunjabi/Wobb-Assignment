const compactFormatter = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});

/** Compact, locale-aware formatting for large counts (e.g. 678546942 -> "678.5M"). */
export function formatCompactNumber(count: number): string {
  return compactFormatter.format(count);
}

export function formatEngagementRate(rate: number | undefined): string {
  if (rate === undefined) return "N/A";
  return (rate * 100).toFixed(2) + "%";
}
