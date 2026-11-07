import SectionBadge from "@/components/SectionBadge";

export default function SectionHeading({
  badge,
  title,
  subtitle,
  align = "center",
}: {
  badge: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
}) {
  const centered = align === "center";
  return (
    <div className={`flex flex-col ${centered ? "items-center text-center" : "items-start text-left"}`}>
      <SectionBadge className="mb-4">{badge}</SectionBadge>
      <h2 className="text-gradient max-w-2xl text-3xl font-semibold leading-9 md:text-5xl md:leading-[1.25]">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-text-secondary md:text-base">{subtitle}</p>
      )}
    </div>
  );
}