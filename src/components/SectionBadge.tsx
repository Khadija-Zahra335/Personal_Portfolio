/** Dark pill with a ringed dot. Sits above every section title. */
export default function SectionBadge({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`shadow-badge relative flex w-fit items-center gap-3 rounded-[20px] bg-tgc px-4 py-1.5 ${className}`}>
      <span className="h-2 w-2 rounded-full bg-white outline outline-1 outline-offset-[3px] outline-white" />
      <span className="text-sm text-text">{children}</span>
    </div>
  );
}