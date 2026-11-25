// A still of the room in the 3D's place: shown while the 3D code downloads, and under the
// canvas until the live scene has drawn, then faded out. One picture per framing (xl with
// the film shift, tablet, phone); each device downloads only its own.
// Re-capture public/images/hero-room-*.webp whenever the room changes.
const HeroPoster = ({ visible = true }) => (
  <picture aria-hidden="true">
    <source media="(min-width: 1280px)" srcSet="/images/hero-room-wide.webp" />
    <source media="(min-width: 768px)" srcSet="/images/hero-room-tablet.webp" />
    <img
      src="/images/hero-room-mobile.webp"
      alt=""
      decoding="async"
      className={`pointer-events-none absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${visible ? "opacity-100" : "opacity-0"}`}
    />
  </picture>
);

export default HeroPoster;
