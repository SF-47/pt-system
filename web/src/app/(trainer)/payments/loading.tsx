export default function Loading() {
  return (
    <div
      aria-label="Loading payments"
      aria-busy="true"
      className="animate-pulse"
    >
      <div className="mb-5 flex items-center justify-between gap-4">
        <div className="w-full max-w-lg">
          <div className="h-9 w-40 rounded-md bg-border" />
          <div className="mt-3 h-4 w-full rounded bg-border" />
        </div>
        <div className="h-11 w-36 rounded-md bg-border" />
      </div>
      <div className="mb-2 h-4 w-48 rounded bg-border" />
      <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {[0, 1].map((card) => (
          <div
            key={card}
            className="min-h-28 rounded-xl border border-border bg-surface p-5"
          >
            <div className="h-4 w-28 rounded bg-border" />
            <div className="mt-4 h-7 w-24 rounded bg-border" />
          </div>
        ))}
      </div>
      <div className="mb-4 grid grid-cols-2 gap-3 rounded-xl border border-border bg-surface p-4 sm:grid-cols-[minmax(0,1fr)_10rem_8rem_9rem]">
        {[0, 1, 2, 3].map((control) => (
          <div key={control} className={control === 0 ? "col-span-2 sm:col-span-1" : ""}>
            <div className="mb-1 h-4 w-20 rounded bg-border" />
            <div className="h-11 w-full rounded-md bg-border" />
          </div>
        ))}
      </div>
      <div className="mb-2 h-4 w-64 rounded bg-border" />
      <div className="overflow-hidden rounded-xl border border-border bg-surface">
        <div className="grid min-w-190 grid-cols-6 gap-4 bg-background px-5 py-4">
          {[0, 1, 2, 3, 4, 5].map((cell) => (
            <div key={cell} className="h-4 w-16 rounded bg-border" />
          ))}
        </div>
        {[0, 1, 2, 3, 4].map((row) => (
          <div
            key={row}
            className="grid min-w-190 grid-cols-6 gap-4 border-t border-border px-5 py-5"
          >
            {[0, 1, 2, 3, 4, 5].map((cell) => (
              <div key={cell} className="h-5 w-4/5 rounded bg-border" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
