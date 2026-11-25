// Phone-sized screens (below Tailwind's md), checked once at load. Phones skip the
// small decorative point lights and redraw the monitor screens less often.
export const isPhone = typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches;
