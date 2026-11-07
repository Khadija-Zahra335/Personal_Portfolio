/**
 * Decorative layer behind the page.
 *  HexaFolio palettes: grayscale globe video at 6% opacity
 *  NexFolio palettes:  teal glow (dark only) + faint teal grid
 *  All palettes:       shooting-star streaks
 */

// Free stock clip from Pexels. For production, download it into /public/videos
// and change the src to "/videos/hero-bg.mp4".
const VIDEO_SRC = "https://videos.pexels.com/video-files/9694443/9694443-hd_1920_1080_25fps.mp4";

const STARS = [
  { left: "2%", top: "4%", delay: "0s" },
  { left: "30%", top: "10%", delay: "1s" },
  { left: "12%", top: "38%", delay: "2.5s" },
  { left: "45%", top: "24%", delay: "4s" },
  { left: "20%", top: "52%", delay: "7s" },
];

export default function BackgroundEffects() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {/* ---------- NexFolio: teal glow fading into black ---------- */}
      <div className="nex-glow absolute inset-x-0 top-0 h-[1400px] bg-gradient-to-b from-highlight/25 via-highlight/10 to-transparent" />

      {/* ---------- NexFolio: grid (32px mobile, 65px desktop), faded at the edges ---------- */}
      <div className="nex-only absolute inset-x-0 top-0 h-[1400px] bg-[linear-gradient(to_right,var(--color-highlight)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-highlight)_1px,transparent_1px)] bg-size-[32px_32px] opacity-[0.12] [mask-image:radial-gradient(90%_90%_at_50%_0%,black_40%,transparent_100%)] md:bg-size-[65px_65px]" />

      {/* ---------- HexaFolio: globe video ---------- */}
      <video
        src={VIDEO_SRC}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="hexa-only mask-fade-b absolute inset-x-0 top-0 h-[1065px] w-full object-cover opacity-[0.06] grayscale"
      />

      {/* ---------- Shooting stars (all palettes) ---------- */}
      <div className="container-site relative h-[1065px]">
        {STARS.map((star, i) => (
          <span
            key={i}
            className="absolute h-px w-[100px] rotate-[5deg] overflow-hidden rounded-sm opacity-0 animate-shooting"
            style={{ left: star.left, top: star.top, animationDelay: star.delay }}
          >
            <span className="relative block h-full w-full rounded-sm bg-gradient-to-l from-highlight/70 to-transparent">
              <span className="absolute right-0 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-highlight/40 shadow-[0_0_6px_1px_var(--color-highlight)]" />
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}