type P = { size?: number; className?: string };

const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
});

export const GlobeIcon = ({ size = 18, className }: P) => (
  <svg {...base(size)} className={className}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
  </svg>
);

export const ChevronIcon = ({ size = 16, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export const PhoneIcon = ({ size = 18, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" />
  </svg>
);

export const MenuIcon = ({ size = 22, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
);

export const CloseIcon = ({ size = 22, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

export const CheckIcon = ({ size = 16, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

export const StarIcon = ({ size = 18 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z" />
  </svg>
);

/* Service icons */
export const KitchenIcon = ({ size = 28 }: P) => (
  <svg {...base(size)} strokeWidth={1.6}>
    <rect x="3" y="10" width="18" height="11" rx="1" />
    <path d="M3 14h18M8 10V6a2 2 0 0 1 4 0M16 4v6" />
  </svg>
);
export const BathIcon = ({ size = 28 }: P) => (
  <svg {...base(size)} strokeWidth={1.6}>
    <path d="M3 12h18v3a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5zM6 12V5a2 2 0 0 1 4 0M7 20l-1 2M17 20l1 2" />
  </svg>
);
export const StairsIcon = ({ size = 28 }: P) => (
  <svg {...base(size)} strokeWidth={1.6}>
    <path d="M3 21h5v-5h5v-5h5V6h3" />
  </svg>
);
export const FloorIcon = ({ size = 28 }: P) => (
  <svg {...base(size)} strokeWidth={1.6}>
    <path d="M3 3h18v18H3zM3 9h9M12 3v6M12 15h9M12 15v6M3 15h4M7 9v6M17 9v6M17 9h4" />
  </svg>
);
export const HouseIcon = ({ size = 28 }: P) => (
  <svg {...base(size)} strokeWidth={1.6}>
    <path d="M3 11 12 3l9 8M5 9.5V21h14V9.5M10 21v-6h4v6" />
  </svg>
);

/** Large line drawing of a house frame, used in the hero until a photo is added. */
export const HeroMark = ({ className }: P) => (
  <svg viewBox="0 0 360 300" fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" className={className} aria-hidden>
    <path d="M20 140 180 20l160 120" />
    <path d="M50 118V280h260V118" />
    <path d="M150 280v-90h60v90" />
    <path d="M80 160h44v44H80zM236 160h44v44h-44zM102 160v44M80 182h44M258 160v44M236 182h44" />
    <path d="M250 64V30h30v57" />
    <path d="M10 280h340" strokeDasharray="6 10" />
  </svg>
);
