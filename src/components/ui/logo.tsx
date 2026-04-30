"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

/* ── Logo Mark — "TA" monogram ───────────────────────────────
   Horizontal badge: 48 × 36 viewBox gives each letter
   room to breathe. Navy field · Gold letterforms.
   Classic geometric shapes, nothing cramped.
─────────────────────────────────────────────────────────── */
export function LogoMark({ size = 40, className }: { size?: number; className?: string }) {
  /* Scale to any rendered size while keeping 4:3 aspect ratio */
  const h = size;
  const w = Math.round(size * (48 / 36));

  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 48 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="TalentAxiss logo mark"
    >
      {/* ── Background — deep navy, refined radius ── */}
      <rect width="48" height="36" rx="9" fill="#0f2440" />

      {/* Subtle inner highlight ring */}
      <rect
        x="0.6" y="0.6" width="46.8" height="34.8" rx="8.4"
        stroke="rgba(255,255,255,0.09)" strokeWidth="1"
      />

      {/* ── "T" — left zone (x: 5 → 21.5) ── */}
      {/* Horizontal cap — full zone width */}
      <rect x="5" y="9.5" width="16.5" height="3.2" rx="1.6" fill="#c9a84c" />
      {/* Vertical stem — centered in zone */}
      <rect x="11.25" y="9.5" width="4" height="14" rx="2" fill="#c9a84c" />

      {/* ── "A" — right zone (x: 26.5 → 43) ── */}
      {/* Left diagonal — base-left to apex */}
      <line
        x1="26.5" y1="23.5"
        x2="34.75" y2="9.5"
        stroke="#c9a84c" strokeWidth="3.5" strokeLinecap="round"
      />
      {/* Right diagonal — apex to base-right */}
      <line
        x1="34.75" y1="9.5"
        x2="43" y2="23.5"
        stroke="#c9a84c" strokeWidth="3.5" strokeLinecap="round"
      />
      {/* Crossbar */}
      <line
        x1="29.2" y1="18.2"
        x2="40.3" y2="18.2"
        stroke="#c9a84c" strokeWidth="2.6" strokeLinecap="round"
      />
    </svg>
  );
}

/* ── Wordmark ────────────────────────────────────────────────
   "Talent" navy · "Axiss" gold
   onDark = true → "Talent" near-white
─────────────────────────────────────────────────────────── */
export function LogoWordmark({
  size   = "md",
  onDark = false,
  className,
}: {
  size?:   "sm" | "md" | "lg";
  onDark?: boolean;
  className?: string;
}) {
  const fontSize =
    size === "sm" ? "1rem"
    : size === "lg" ? "1.5rem"
    : "1.2rem";

  return (
    <span
      className={cn("font-bold leading-none select-none tracking-tight", className)}
      style={{ fontSize, letterSpacing: "-0.03em" }}
    >
      <span style={{ color: onDark ? "#e2e8f0" : "#0f2440" }}>Talent</span>
      <span style={{ color: "#c9a84c" }}>Axiss</span>
    </span>
  );
}

/* ── Full Logo — mark + wordmark ─────────────────────────── */
export function Logo({
  size   = "md",
  onDark = false,
  href,
  className,
}: {
  size?:   "sm" | "md" | "lg";
  onDark?: boolean;
  href?:   string;
  className?: string;
}) {
  const markHeight = size === "sm" ? 26 : size === "lg" ? 44 : 34;
  const gap = size === "sm" ? "gap-2" : "gap-2.5";

  const inner = (
    <span className={cn("inline-flex items-center", gap, className)}>
      <LogoMark size={markHeight} />
      <LogoWordmark size={size} onDark={onDark} />
    </span>
  );

  return href ? (
    <Link href={href} className="inline-flex items-center">
      {inner}
    </Link>
  ) : inner;
}

/* ── Icon-only (collapsed sidebar, favicons, etc.) ───────── */
export function LogoIcon({ size = 36 }: { size?: number }) {
  return <LogoMark size={size} />;
}
