export default function Loading() {
  return (
    <div aria-label="Loading meal plan" aria-busy="true" className="w-full animate-pulse">
      <div className="mb-5 h-5 w-44 rounded bg-border" />
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="w-full max-w-xl">
          <div className="h-4 w-24 rounded bg-border" />
          <div className="mt-2 h-8 w-56 rounded bg-border" />
          <div className="mt-2 h-4 w-full rounded bg-border" />
          <div className="mt-3 flex gap-5">
            <div className="h-4 w-32 rounded bg-border" />
            <div className="h-4 w-40 rounded bg-border" />
          </div>
        </div>
        <div className="h-11 w-28 rounded-md bg-border" />
      </div>
      <div className="mb-3 flex items-end justify-between gap-4 border-t border-border pt-4">
        <div>
          <div className="h-7 w-20 rounded bg-border" />
          <div className="mt-2 h-4 w-72 max-w-full rounded bg-border" />
        </div>
        <div className="h-7 w-20 rounded-md bg-border" />
      </div>
      <div className="overflow-hidden rounded-xl border border-border bg-surface">
        <div className="grid grid-cols-[1fr_2fr_0.5fr] gap-4 bg-background px-4 py-3">
          {[0, 1, 2].map((cell) => <div key={cell} className="h-4 w-16 rounded bg-border" />)}
        </div>
        {[0, 1, 2, 3].map((row) => (
          <div key={row} className="grid grid-cols-[1fr_2fr_0.5fr] gap-4 border-t border-border px-4 py-3">
            {[0, 1, 2].map((cell) => <div key={cell} className="h-5 w-4/5 rounded bg-border" />)}
          </div>
        ))}
      </div>
    </div>
  );
}
