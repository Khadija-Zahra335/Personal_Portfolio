/** Globe video at 6% opacity + shooting-star streaks behind the hero. */

// Free Pexels clip. For production, download into /public/videos and use "/videos/hero-bg.mp4".
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
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[1065px] overflow-hidden">
      <video
        src={VIDEO_SRC}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="mask-fade-b absolute inset-0 h-full w-full object-cover opacity-[0.06] grayscale"
      />

      <div className="container-site relative h-full">
        {STARS.map((star, i) => (
          <span
            key={i}
            className="absolute h-px w-[100px] rotate-[5deg] overflow-hidden rounded-sm opacity-0 animate-shooting"
            style={{ left: star.left, top: star.top, animationDelay: star.delay }}
          >
            <span className="relative block h-full w-full rounded-sm bg-gradient-to-l from-white/50 to-transparent">
              <span className="absolute right-0 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-white/20 shadow-[0_0_6px_1px_rgba(255,255,255,0.6)]" />
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}