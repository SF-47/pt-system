import Link from "next/link";
import { ArrowLeft } from "lucide-react";

type BackLinkProps = { href: string; children: React.ReactNode };

export default function BackLink({ href, children }: BackLinkProps) {
  return (
    <Link
      href={href}
      className="mb-3 inline-flex min-h-11 items-center gap-2 rounded-sm font-semibold text-primary transition-colors hover:text-primary-hover"
    >
      <ArrowLeft className="size-5" aria-hidden="true" />
      {children}
    </Link>
  );
}
