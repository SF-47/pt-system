type PaginationProps = {
  page: number;
  totalPages: number;
  isLoading?: boolean;
  onPrevious: () => void;
  onNext: () => void;
};

export default function Pagination({
  page,
  totalPages,
  isLoading = false,
  onPrevious,
  onNext,
}: PaginationProps) {
  const buttonClasses =
    "min-h-11 rounded-md border border-border bg-surface px-3 py-2 font-medium transition-colors hover:bg-hover disabled:cursor-not-allowed disabled:opacity-50 sm:px-4";
  return (
    <nav
      aria-label="Pagination"
      className="mt-2 flex flex-wrap items-center justify-between gap-3 py-4"
    >
      <button
        type="button"
        onClick={onPrevious}
        disabled={page <= 1 || isLoading}
        className={buttonClasses}
      >
        Previous
      </button>
      <span
        className="text-sm text-muted tabular-nums sm:text-sm"
        aria-live="polite"
      >
        {totalPages > 0 ? `Page ${page} of ${totalPages}` : "No pages"}
      </span>
      <button
        type="button"
        onClick={onNext}
        disabled={page >= totalPages || isLoading}
        className={buttonClasses}
      >
        Next
      </button>
    </nav>
  );
}
