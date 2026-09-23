export default function Loading() {
  return (
    <div
      aria-label="Loading client form"
      aria-busy="true"
      className="w-full animate-pulse"
    >
      <div className="mb-5 h-5 w-36 rounded bg-border" />
      <div className="mb-3 h-9 w-40 rounded bg-border" />
      <div className="mb-5 h-4 w-full max-w-md rounded bg-border" />

      <div className="grid gap-5 xl:grid-cols-2">
        {[0, 1].map((card) => (
          <div
            key={card}
            className="overflow-hidden rounded-xl border border-border bg-surface"
          >
            <div className="border-b border-border px-5 py-4 sm:px-6">
              <div className="h-5 w-40 rounded bg-border" />
              <div className="mt-2 h-4 w-64 max-w-full rounded bg-border" />
            </div>

            <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6 xl:grid-cols-1 2xl:grid-cols-2">
              {Array.from({ length: 4 }).map((_, field) => (
                <div key={field}>
                  <div className="mb-2 h-4 w-24 rounded bg-border" />
                  <div className="h-11 w-full rounded-md bg-border" />
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3 border-t border-border px-5 py-4 sm:px-6">
              {card === 0 && <div className="h-10 w-20 rounded-md bg-border" />}
              <div className="h-10 w-32 rounded-md bg-border" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
