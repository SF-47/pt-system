import Link from "next/link";
import { ArrowLeft } from "lucide-react";

type BackLinkProps = { href: string; children: React.ReactNode };

export default function BackLink({ href, children }: BackLinkProps) {
  return (
    <Link
      href={href}
      className="mb-4 inline-flex min-h-11 items-center gap-2 rounded-md text-sm font-medium text-muted transition-colors hover:text-primary-hover dark:hover:text-foreground"
    >
      <ArrowLeft className="size-5" aria-hidden="true" />
      {children}
    </Link>
  );
}
