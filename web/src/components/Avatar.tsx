export default function Avatar({ name }: { name: string }) {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("");

  return (
    <span
      className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-soft text-[13px] font-bold text-primary dark:bg-[#173D2A] dark:text-[#86D5A9]"
      aria-hidden="true"
    >
      {initials}
    </span>
  );
}
