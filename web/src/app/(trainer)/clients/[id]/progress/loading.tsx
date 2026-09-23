export default function Loading() {
  return (
    <div aria-label="Loading client progress" aria-busy="true" className="w-full animate-pulse">
      <div className="mb-5 h-5 w-40 rounded bg-border" />
      <div className="mb-5 h-9 w-48 rounded bg-border" />
      <div className="rounded-xl border border-border bg-surface p-6">
        <div className="h-6 w-48 rounded bg-border" />
        <div className="mt-5 h-10 w-32 rounded bg-border" />
        <div className="mt-5 h-2 w-full rounded bg-border" />
      </div>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((card) => (
          <div key={card} className="min-h-32 rounded-xl border border-border bg-surface p-5">
            <div className="h-6 w-24 rounded bg-border" />
            <div className="mt-4 h-4 w-full rounded bg-border" />
            <div className="mt-5 h-9 w-12 rounded bg-border" />
          </div>
        ))}
      </div>
    </div>
  );
}
