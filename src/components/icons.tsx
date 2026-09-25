import type { SVGProps } from 'react'

// Compact Lucide-style icon set (24×24, stroke=currentColor). Add paths as needed.
const paths = {
  sparkles: [
    'M12 3l1.6 4.8L18.4 9.4l-4.8 1.6L12 15.8l-1.6-4.8L5.6 9.4l4.8-1.6z',
    'M18 14.5l.6 1.8 1.8.6-1.8.6-.6 1.8-.6-1.8-1.8-.6 1.8-.6z',
  ],
  layers: ['M12 2 2 7l10 5 10-5-10-5z', 'M2 12l10 5 10-5', 'M2 17l10 5 10-5'],
  activity: ['M22 12h-4l-3 9L9 3l-3 9H2'],
  compass: ['M12 2a10 10 0 1 0 0 20 10 10 0 1 0 0-20z', 'm16.24 7.76-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z'],
  'file-text': ['M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z', 'M14 2v6h6', 'M8 13h8', 'M8 17h8', 'M8 9h2'],
  target: ['M12 2a10 10 0 1 0 0 20 10 10 0 1 0 0-20z', 'M12 6a6 6 0 1 0 0 12 6 6 0 1 0 0-12z', 'M12 10a2 2 0 1 0 0 4 2 2 0 1 0 0-4z'],
  users: [
    'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2',
    'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
    'M22 21v-2a4 4 0 0 0-3-3.87',
    'M16 3.13a4 4 0 0 1 0 7.75',
  ],
  plug: ['M12 22v-4', 'M9 8V3', 'M15 8V3', 'M7 8h10v3a5 5 0 0 1-10 0z'],
  'chevron-right': ['m9 18 6-6-6-6'],
  'chevron-down': ['m6 9 6 6 6-6'],
  search: ['M11 3a8 8 0 1 0 0 16 8 8 0 1 0 0-16z', 'm21 21-4.3-4.3'],
  x: ['M18 6 6 18', 'M6 6l12 12'],
  check: ['M20 6 9 17l-5-5'],
  'arrow-right': ['M5 12h14', 'M12 5l7 7-7 7'],
  'arrow-up-right': ['M7 17 17 7', 'M7 7h10v10'],
  plus: ['M12 5v14', 'M5 12h14'],
  bell: ['M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9', 'M10.3 21a1.94 1.94 0 0 0 3.4 0'],
  pin: ['M12 17v5', 'M9 3h6l-1 6 3 3v2H7v-2l3-3z'],
  filter: ['M22 3H2l8 9.46V19l4 2v-8.54z'],
  refresh: ['M3 12a9 9 0 0 1 15-6.7L21 8', 'M21 3v5h-5', 'M21 12a9 9 0 0 1-15 6.7L3 16', 'M3 21v-5h5'],
  'alert-triangle': ['m10.29 3.86-8.18 14a2 2 0 0 0 1.71 3h16.36a2 2 0 0 0 1.71-3l-8.18-14a2 2 0 0 0-3.42 0z', 'M12 9v4', 'M12 17h.01'],
  'trending-up': ['M22 7 13.5 15.5 8.5 10.5 2 17', 'M16 7h6v6'],
  'trending-down': ['M22 17 13.5 8.5 8.5 13.5 2 7', 'M16 17h6v-6'],
  external: ['M15 3h6v6', 'M10 14 21 3', 'M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6'],
  send: ['M22 2 11 13', 'M22 2 15 22l-4-9-9-4z'],
  sliders: ['M4 21v-7', 'M4 10V3', 'M12 21v-9', 'M12 8V3', 'M20 21v-5', 'M20 12V3', 'M1 14h6', 'M9 8h6', 'M17 16h6'],
  'book-open': ['M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z', 'M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z'],
  clock: ['M12 2a10 10 0 1 0 0 20 10 10 0 1 0 0-20z', 'M12 6v6l4 2'],
  mail: ['M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z', 'm22 7-10 6L2 7'],
  hash: ['M4 9h16', 'M4 15h16', 'M10 3 8 21', 'M16 3l-2 18'],
  'more-horizontal': ['M5 12h.01', 'M12 12h.01', 'M19 12h.01'],
  'circle-check': ['M12 2a10 10 0 1 0 0 20 10 10 0 1 0 0-20z', 'm9 12 2 2 4-4'],
  'arrow-down': ['M12 5v14', 'M19 12l-7 7-7-7'],
  grid: ['M3 3h8v8H3z', 'M13 3h8v8h-8z', 'M13 13h8v8h-8z', 'M3 13h8v8H3z'],
  eye: ['M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z', 'M12 9a3 3 0 1 0 0 6 3 3 0 1 0 0-6z'],
  zap: ['M13 2 3 14h8l-1 8 10-12h-8z'],
  flag: ['M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z', 'M4 22V4'],
  map: ['M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3z', 'M9 3v15', 'M15 6v15'],
  calendar: ['M4 5h16a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z', 'M16 3v4', 'M8 3v4', 'M3 10h18'],
  download: ['M12 3v12', 'M7 10l5 5 5-5', 'M4 21h16'],
  share: ['M4 12v8a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-8', 'M16 6l-4-4-4 4', 'M12 2v13'],
  moon: ['M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z'],
  sun: ['M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z', 'M12 2v2', 'M12 20v2', 'M4.9 4.9l1.4 1.4', 'M17.7 17.7l1.4 1.4', 'M2 12h2', 'M20 12h2', 'M4.9 19.1l1.4-1.4', 'M17.7 6.3l1.4-1.4'],
} satisfies Record<string, string[]>

export type IconName = keyof typeof paths

export function Icon({
  name,
  size = 20,
  strokeWidth = 1.75,
  ...props
}: { name: IconName; size?: number } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {paths[name].map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  )
}

export function Logo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <rect width="32" height="32" rx="7" fill="#1C1815" />
      <path d="M16 9 L28 4 M16 9 L28 14" stroke="#B4451F" strokeWidth="1.3" opacity="0.55" />
      <path d="M14.2 13 L17.8 13 L19 24 L13 24 Z" fill="#F7F3EC" />
      <rect x="13.4" y="15.6" width="5.2" height="2.6" fill="#B4451F" />
      <circle cx="16" cy="9" r="2.5" fill="#B4451F" />
      <rect x="10.5" y="24" width="11" height="3" rx="1" fill="#F7F3EC" />
    </svg>
  )
}
