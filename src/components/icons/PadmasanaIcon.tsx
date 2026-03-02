/**
 * PadmasanaIcon — Custom SVG icon of a yogi sitting in padmasana (lotus pose).
 *
 * Props are identical to Lucide icons so it can be used as a drop-in
 * replacement in BottomNav and anywhere else.
 */

import { type SVGProps } from "react";

export function PadmasanaIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      width={24}
      height={24}
      {...props}
    >
      {/* Head */}
      <circle cx="12" cy="4" r="2" />

      {/* Body / torso */}
      <path d="M12 6v5" />

      {/* Arms in meditation mudra — hands resting on knees */}
      <path d="M8 9c-2 1-3 2.5-3 3.5" />
      <path d="M16 9c2 1 3 2.5 3 3.5" />

      {/* Crossed legs (padmasana / lotus pose) */}
      <path d="M7.5 16c1.5-2 3-3 4.5-3s3 1 4.5 3" />
      <path d="M6 19c1-1.5 3-3 6-3s5 1.5 6 3" />

      {/* Lotus petals under the yogi */}
      <path d="M8 21c1.5-1 2.5-1.5 4-1.5s2.5.5 4 1.5" />
    </svg>
  );
}
