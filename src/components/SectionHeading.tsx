import SectionBadge from "@/components/SectionBadge";

/** Headline in solid colors: everything in the main text color, last word in the soft tone. */
export function TwoTone({ text }: { text: string }) {
  const words = text.trim().split(" ");
  if (words.length < 2) return <span className="text-text">{text}</span>;
  const last = words.pop();
  return (
    <>
      <span className="text-text">{words.join(" ")}</span>{" "}
      <span className="text-text-turnery">{last}</span>
    </>
  );
}

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
      <h2 className="max-w-2xl text-3xl font-semibold leading-9 md:text-5xl md:leading-[1.25]">
        <TwoTone text={title} />
      </h2>
      {subtitle && (
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-text-secondary md:text-base">{subtitle}</p>
      )}
    </div>
  );
}