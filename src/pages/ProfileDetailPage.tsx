import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ExternalLink, Calendar, Users, Eye } from "lucide-react";
import { Layout } from "@/components/Layout";
import { Avatar } from "@/components/Avatar";
import { ShortlistButton } from "@/components/ShortlistButton";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import type { FullUserProfile, StatHistoryItem, Platform } from "@/types";
import { findProfile, getProfileHandle, getPlatformLabel } from "@/utils/dataHelpers";
import { formatCompactNumber, formatEngagementRate } from "@/utils/formatters";
import { loadProfileDetail } from "@/utils/profileLoader";

type Status = "loading" | "ready" | "not-found";

export function ProfileDetailPage() {
  const { username: identifier } = useParams<{ username: string }>();
  const [searchParams] = useSearchParams();
  const platform = searchParams.get("platform");

  // Lookup the profile in summary files
  const found = useMemo(
    () => findProfile(identifier, platform),
    [identifier, platform]
  );
  const summary = found?.profile;
  const resolvedPlatform = found?.platform;
  
  const [detail, setDetail] = useState<FullUserProfile | null>(null);
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setStatus("loading");
      let detailProfile: FullUserProfile | null = null;

      if (identifier) {
        try {
          detailProfile = await loadProfileDetail(identifier);
        } catch {
          detailProfile = null;
        }
      }

      if (cancelled) return;
      setDetail(detailProfile);
      setStatus(detailProfile || summary ? "ready" : "not-found");
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [identifier, summary]);

  // Combine detail and summary
  const user = useMemo<FullUserProfile | null>(() => {
    if (detail && summary) {
      return {
        ...detail,
        fullname: summary.fullname,
        username: summary.username,
        handle: summary.handle,
        custom_name: summary.custom_name,
        picture: summary.picture,
        followers: summary.followers,
        is_verified: summary.is_verified,
        engagement_rate: summary.engagement_rate,
        engagements: summary.engagements,
      };
    }
    return detail ?? summary ?? null;
  }, [detail, summary]);

  if (status === "loading") {
    return (
      <Layout>
        <div className="py-24 text-center space-y-4">
          <div className="h-6 w-6 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm text-[var(--text-muted)] font-meta uppercase tracking-wider">
            Loading profile statistics...
          </p>
        </div>
      </Layout>
    );
  }

  if (status === "not-found" || !user) {
    return (
      <Layout>
        <div className="py-16 text-center max-w-md mx-auto space-y-6">
          <div className="h-12 w-12 rounded bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)] flex items-center justify-center mx-auto text-xl">
            ✕
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold">Creator Profile Not Found</h2>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed">
              We couldn't locate details for this creator. The profile data may not exist in our static indexes.
            </p>
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-xs font-meta font-semibold uppercase tracking-wider text-[var(--text)] transition-colors hover:bg-[var(--surface-2)]"
          >
            <ArrowLeft size={12} /> Back to index
          </Link>
        </div>
      </Layout>
    );
  }

  // Only surface stats the dataset actually provides — no empty "—".
  const stats: { label: string; value: string }[] = [
    { label: "Followers", value: formatCompactNumber(user.followers) },
    ...(user.engagement_rate !== undefined
      ? [
          {
            label: "Engagement Rate",
            value: formatEngagementRate(user.engagement_rate),
          },
        ]
      : []),
    ...(user.posts_count !== undefined
      ? [{ label: "Posts", value: user.posts_count.toLocaleString() }]
      : []),
    ...(user.engagements !== undefined
      ? [
          {
            label: "Total Engagements",
            value: formatCompactNumber(user.engagements),
          },
        ]
      : []),
  ];

  // Whether we have anything beyond the summary stats to show on the right.
  const hasDeepData = Boolean(
    user.avg_likes !== undefined ||
      user.avg_comments !== undefined ||
      (user.avg_views !== undefined && user.avg_views > 0) ||
      (user.stat_history && user.stat_history.length > 1) ||
      (user.top_hashtags && user.top_hashtags.length > 0)
  );

  return (
    <Layout>
      {/* Back Button */}
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-xs font-meta font-extrabold uppercase tracking-widest text-[var(--text-muted)] hover:text-[var(--text)] transition-colors mb-6 cursor-pointer"
      >
        <ArrowLeft size={12} /> Back to index
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Creator Identity Slab */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded p-6 text-center space-y-4">
            <Avatar
              src={user.picture}
              name={user.fullname}
              className="mx-auto h-28 w-28"
              textClassName="text-4xl"
            />

            <div className="space-y-1">
              <h2 className="text-xl font-extrabold justify-center flex items-center gap-1">
                @{getProfileHandle(user)}
                <VerifiedBadge verified={user.is_verified} />
              </h2>
              <p className="text-sm text-[var(--text-muted)] font-medium">
                {user.fullname}
              </p>
            </div>

            <div className="flex justify-center">
              <span className="inline-flex px-2.5 py-1 text-[10px] font-meta font-extrabold uppercase tracking-widest bg-[var(--surface-2)] text-[var(--text-muted)] border border-[var(--border)] rounded-sm">
                {getPlatformLabel(resolvedPlatform ?? (platform as Platform) ?? "instagram")}
              </span>
            </div>

            {user.description && (
              <p className="text-xs text-[var(--text-muted)] italic leading-relaxed pt-2 border-t border-[var(--border)] text-left px-2">
                "{user.description}"
              </p>
            )}

            <div className="pt-4 border-t border-[var(--border)] space-y-3">
              {summary && resolvedPlatform && (
                <div className="flex justify-center">
                  <ShortlistButton profile={summary} platform={resolvedPlatform} />
                </div>
              )}

              {user.url && (
                <a
                  href={user.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 rounded border border-[var(--text)] bg-[var(--text)] text-[var(--accent-contrast)] px-4 py-2.5 text-xs font-meta font-bold uppercase tracking-widest transition-colors duration-200 hover:bg-transparent hover:text-[var(--text)] active:scale-95 cursor-pointer"
                >
                  <span>Visit Platform</span>
                  <ExternalLink size={12} />
                </a>
              )}
            </div>
          </div>

          {/* Demographics Detail Box */}
          {(user.gender || user.age_group || user.language) && (
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded p-5 space-y-4 text-left">
              <h3 className="text-xs font-meta font-extrabold uppercase tracking-widest text-[var(--text-muted)] border-b border-[var(--border)] pb-2">
                Demographics
              </h3>
              <div className="space-y-3 text-xs">
                {user.gender && (
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--text-muted)] font-medium">Gender Focus</span>
                    <span className="font-bold uppercase font-meta text-[var(--accent-alt)]">{user.gender}</span>
                  </div>
                )}
                {user.age_group && (
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--text-muted)] font-medium">Primary Age Group</span>
                    <span className="font-bold font-meta">{user.age_group}</span>
                  </div>
                )}
                {user.language && (
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--text-muted)] font-medium">Language</span>
                    <span className="font-bold">{user.language.name ?? user.language.code}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Statistics Grid & Interactive Graph */}
        <div className="lg:col-span-8 space-y-6 text-left">
          {/* Main Statistics Slabs — only what the dataset provides */}
          <div className="grid grid-cols-2 gap-4 sm:[grid-template-columns:repeat(auto-fit,minmax(150px,1fr))]">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-[var(--surface)] border border-[var(--border)] rounded p-4"
              >
                <span className="text-[10px] font-meta font-bold uppercase tracking-widest text-[var(--text-muted)]">
                  {stat.label}
                </span>
                <p className="text-2xl font-extrabold font-display mt-1">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          {/* Secondary Stats Row */}
          {(user.avg_likes !== undefined || user.avg_comments !== undefined || (user.avg_views !== undefined && user.avg_views > 0)) && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {user.avg_likes !== undefined && (
                <div className="bg-[var(--surface)] border border-[var(--border)] rounded p-4 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-meta font-bold uppercase tracking-widest text-[var(--text-muted)]">
                      Avg Likes
                    </span>
                    <p className="text-lg font-extrabold font-meta">
                      {formatCompactNumber(user.avg_likes)}
                    </p>
                  </div>
                  <Users className="text-[var(--text-muted)] opacity-25" size={24} />
                </div>
              )}

              {user.avg_comments !== undefined && (
                <div className="bg-[var(--surface)] border border-[var(--border)] rounded p-4 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-meta font-bold uppercase tracking-widest text-[var(--text-muted)]">
                      Avg Comments
                    </span>
                    <p className="text-lg font-extrabold font-meta">
                      {formatCompactNumber(user.avg_comments)}
                    </p>
                  </div>
                  <Calendar className="text-[var(--text-muted)] opacity-25" size={24} />
                </div>
              )}

              {user.avg_views !== undefined && user.avg_views > 0 && (
                <div className="bg-[var(--surface)] border border-[var(--border)] rounded p-4 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-meta font-bold uppercase tracking-widest text-[var(--text-muted)]">
                      Avg Views
                    </span>
                    <p className="text-lg font-extrabold font-meta">
                      {formatCompactNumber(user.avg_views)}
                    </p>
                  </div>
                  <Eye className="text-[var(--text-muted)] opacity-25" size={24} />
                </div>
              )}
            </div>
          )}

          {/* Growth chart section */}
          {user.stat_history && user.stat_history.length > 1 && (
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded p-6 space-y-4">
              <FollowerGrowthChart history={user.stat_history} />
            </div>
          )}

          {/* Top Hashtags Cloud */}
          {user.top_hashtags && user.top_hashtags.length > 0 && (
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded p-6">
              <h3 className="text-xs font-meta font-extrabold uppercase tracking-widest text-[var(--text-muted)] border-b border-[var(--border)] pb-2 mb-4">
                Core Topic Focus
              </h3>
              <div className="flex flex-wrap gap-2.5">
                {user.top_hashtags.slice(0, 15).map((tagItem) => (
                  <span
                    key={tagItem.tag}
                    className="inline-flex px-3 py-1.5 border border-[var(--border)] rounded bg-[var(--surface-2)] text-xs font-meta font-medium tracking-wide text-[var(--text)] transition-colors hover:border-[var(--text)] cursor-default"
                  >
                    #{tagItem.tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* No deep analytics available for this creator in the dataset */}
          {!hasDeepData && (
            <div className="bg-[var(--surface)] border border-dashed border-[var(--border)] rounded p-8 text-center">
              <p className="mb-2 font-meta text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">
                Limited dataset
              </p>
              <p className="mx-auto max-w-md text-sm leading-relaxed text-[var(--text-muted)]">
                Deeper analytics — follower growth, top topics, and post-level
                metrics — aren't available for this creator in the sample data.
                The summary metrics above come from the platform search index.
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

/* Custom interactive SVG Growth Chart Component */
function FollowerGrowthChart({ history }: { history: StatHistoryItem[] }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Filter history to ensure values are correct
  const validData = useMemo(() => {
    return (history || [])
      .filter((item) => item && item.month && typeof item.followers === "number")
      .sort((a, b) => a.month.localeCompare(b.month));
  }, [history]);

  // Calculate Growth Stat safely
  const growthInfo = useMemo(() => {
    if (validData.length <= 1) return { diff: 0, percent: 0, duration: 0 };
    const firstVal = validData[0].followers;
    const lastVal = validData[validData.length - 1].followers;
    const diff = lastVal - firstVal;
    const percent = (diff / firstVal) * 100;
    return {
      diff,
      percent,
      duration: validData.length,
    };
  }, [validData]);

  // Coordinate Calculations
  const width = 600;
  const height = 220;
  
  const padLeft = 62;
  const padRight = 20;
  const padTop = 20;
  const padBottom = 35;

  const plotWidth = width - padLeft - padRight;
  const plotHeight = height - padTop - padBottom;

  const minFollowers = useMemo(() => {
    return validData.length > 0 ? Math.min(...validData.map((d) => d.followers)) : 0;
  }, [validData]);

  const maxFollowers = useMemo(() => {
    return validData.length > 0 ? Math.max(...validData.map((d) => d.followers)) : 0;
  }, [validData]);
  
  const valRange = maxFollowers - minFollowers;
  const paddingVal = valRange * 0.1 || 1000;
  
  const yMin = Math.max(0, minFollowers - paddingVal);
  const yMax = maxFollowers + paddingVal;

  const points = useMemo(() => {
    if (validData.length <= 1) return [];
    const n = validData.length;
    return validData.map((item, i) => {
      const x = padLeft + (i / (n - 1)) * plotWidth;
      const y = padTop + (1 - (item.followers - yMin) / (yMax - yMin)) * plotHeight;
      return { x, y, item, i };
    });
  }, [validData, yMin, yMax, plotWidth, plotHeight]);

  // Generate SVG path string
  const linePath = useMemo(() => {
    return points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  }, [points]);

  // Generate background area path
  const areaPath = useMemo(() => {
    if (points.length === 0) return "";
    const startX = points[0].x;
    const endX = points[points.length - 1].x;
    const bottomY = padTop + plotHeight;
    return `${linePath} L ${endX} ${bottomY} L ${startX} ${bottomY} Z`;
  }, [points, linePath, plotHeight]);

  // Horizontal Gridline values
  const gridLines = useMemo(() => {
    const lines = 3; // high, mid, low
    return Array.from({ length: lines }).map((_, i) => {
      const val = yMax - (i / (lines - 1)) * (yMax - yMin);
      const y = padTop + (i / (lines - 1)) * plotHeight;
      return { y, value: val };
    });
  }, [yMin, yMax, plotHeight]);

  // Early return after all hooks have executed
  if (validData.length <= 1) return null;

  return (
    <div className="space-y-4">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <span className="text-[10px] font-meta font-bold uppercase tracking-widest text-[var(--text-muted)]">
            Historical Growth
          </span>
          <h4 className="text-base font-extrabold mt-0.5">Follower Growth Trend</h4>
        </div>
        
        <div className="text-left sm:text-right">
          <p className="text-sm font-extrabold font-meta text-[var(--accent)]">
            +{formatCompactNumber(growthInfo.diff)} Followers
          </p>
          <p className="text-[10px] font-meta font-bold text-[var(--text-muted)] uppercase tracking-wider">
            +{growthInfo.percent.toFixed(2)}% over {growthInfo.duration} months
          </p>
        </div>
      </div>

      {/* SVG Container */}
      <div className="relative bg-[var(--surface)] border border-[var(--border)] rounded p-2">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto select-none overflow-visible"
        >
          {/* Horizontal Gridlines */}
          {gridLines.map((line, idx) => (
            <g key={idx} className="opacity-45">
              <line
                x1={padLeft}
                y1={line.y}
                x2={width - padRight}
                y2={line.y}
                stroke="var(--border)"
                strokeWidth={1.5}
                strokeDasharray="4 4"
              />
              <text
                x={padLeft - 10}
                y={line.y + 4}
                textAnchor="end"
                className="fill-[var(--text-muted)] text-[10px] font-meta font-bold"
              >
                {formatCompactNumber(line.value)}
              </text>
            </g>
          ))}

          {/* Area under the line */}
          <path
            d={areaPath}
            fill="var(--accent)"
            className="opacity-5"
          />

          {/* Trend Line */}
          <path
            d={linePath}
            fill="none"
            stroke="var(--accent)"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Vertical Hover Line */}
          {hoveredIndex !== null && (
            <line
              x1={points[hoveredIndex].x}
              y1={padTop}
              x2={points[hoveredIndex].x}
              y2={padTop + plotHeight}
              stroke="var(--accent-alt)"
              strokeWidth={1.5}
              className="opacity-70"
            />
          )}

          {/* Interaction Circles */}
          {points.map((p, idx) => {
            const isHovered = hoveredIndex === idx;
            return (
              <g key={idx}>
                {/* Visual Circle Point */}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isHovered ? 6 : 4}
                  className="transition-all duration-150"
                  fill={isHovered ? "var(--accent-alt)" : "var(--surface)"}
                  stroke={isHovered ? "var(--accent-contrast)" : "var(--accent)"}
                  strokeWidth={2}
                />

                {/* X Axis label (Months) */}
                <text
                  x={p.x}
                  y={height - padBottom + 18}
                  textAnchor="middle"
                  className={`fill-[var(--text-muted)] text-[9px] font-meta font-bold transition-all duration-150 ${
                    isHovered ? "fill-[var(--text)] text-[10px] font-extrabold" : ""
                  }`}
                >
                  {p.item.month}
                </text>

                {/* Invisible larger hover region */}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={22}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />
              </g>
            );
          })}
        </svg>

        {/* Floating Tooltip Card */}
        <AnimatePresence>
          {hoveredIndex !== null && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute bg-[var(--text)] text-[var(--bg)] border border-[var(--border)] rounded px-3 py-2 text-xs text-left shadow-lg pointer-events-none font-meta z-10"
              style={{
                left: `${(points[hoveredIndex].x / width) * 100}%`,
                top: `${(points[hoveredIndex].y / height) * 100 - 15}%`,
                transform: "translate(-50%, -100%)",
              }}
            >
              <p className="font-extrabold text-[10px] text-[var(--accent-alt)] uppercase tracking-wider">
                {points[hoveredIndex].item.month}
              </p>
              <p className="font-bold mt-0.5">
                {points[hoveredIndex].item.followers.toLocaleString()} followers
              </p>
              {points[hoveredIndex].item.avg_likes && (
                <p className="text-[10px] opacity-75 mt-0.5">
                  Avg Likes: {formatCompactNumber(points[hoveredIndex].item.avg_likes)}
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}