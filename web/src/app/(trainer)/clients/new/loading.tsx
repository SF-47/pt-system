export default function Loading() {
  return (
    <div
      aria-label="Loading new client form"
      aria-busy="true"
      className="w-full animate-pulse"
    >
      <div className="mb-5 h-5 w-32 rounded bg-border" />
      <div className="mb-3 h-9 w-44 rounded bg-border" />
      <div className="mb-6 h-4 w-full max-w-md rounded bg-border" />

      <div className="grid gap-5 xl:grid-cols-2">
        {[3, 2].map((fieldCount) => (
          <div
            key={fieldCount}
            className="overflow-hidden rounded-xl border border-border bg-surface"
          >
            <div className="border-b border-border px-5 py-4 sm:px-6">
              <div className="h-5 w-40 rounded bg-border" />
              <div className="mt-2 h-4 w-64 max-w-full rounded bg-border" />
            </div>

            <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6 xl:grid-cols-1 2xl:grid-cols-2">
              {Array.from({ length: fieldCount }).map((_, field) => (
                <div
                  key={field}
                  className={
                    fieldCount === 3 && field === 0
                      ? "sm:col-span-2 xl:col-span-1 2xl:col-span-2"
                      : ""
                  }
                >
                  <div className="mb-2 h-4 w-24 rounded bg-border" />
                  <div className="h-11 w-full rounded-md bg-border" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 flex justify-end gap-3 border-t border-border pt-5">
        <div className="h-10 w-20 rounded-md bg-border" />
        <div className="h-10 w-32 rounded-md bg-border" />
      </div>
    </div>
  );
}
