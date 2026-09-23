export default function Loading() {
  return (
    <div aria-label="Loading meal plan" aria-busy="true" className="w-full animate-pulse">
      <div className="mb-5 h-5 w-36 rounded bg-border" />
      <div className="mb-5 h-9 w-52 rounded bg-border" />
      <div className="mb-5 flex gap-4 border-b border-border pb-5">
        <div className="h-10 w-24 rounded bg-border" />
        <div className="h-10 w-24 rounded bg-border" />
      </div>
      <div className="mb-3 h-6 w-20 rounded bg-border" />
      <div className="divide-y divide-border rounded-xl border border-border bg-surface px-6">
        {[0, 1, 2, 3].map((row) => (
          <div key={row} className="grid gap-4 py-6 sm:grid-cols-[14rem_minmax(0,1fr)]">
            <div className="h-6 w-36 rounded bg-border" />
            <div className="h-4 w-full max-w-md rounded bg-border" />
          </div>
        ))}
      </div>
    </div>
  );
}
