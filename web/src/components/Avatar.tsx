export default function Avatar({ name }: { name: string }) {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("");

  return (
    <span
      className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-primary-soft text-sm font-semibold text-primary-hover dark:bg-primary-soft dark:text-foreground"
      aria-hidden="true"
    >
      {initials}
    </span>
  );
}
