export default function Loading() {
  return (
    <div aria-label="Loading dashboard" aria-busy="true" className="animate-pulse">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="w-full max-w-md">
          <div className="h-9 w-48 rounded-md bg-border" />
          <div className="mt-3 h-4 w-full rounded bg-border" />
        </div>
        <div className="h-12 w-36 rounded-lg bg-border" />
      </div>
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[0, 1, 2, 3].map((item) => (
          <div key={item} className="min-h-28 rounded-lg border border-border bg-surface p-5">
            <div className="h-4 w-28 rounded bg-border" />
            <div className="mt-5 h-8 w-12 rounded bg-border" />
          </div>
        ))}
      </div>
      <div className="rounded-xl bg-primary-soft p-5">
        <div className="h-7 w-52 rounded bg-border" />
        <div className="mt-3 h-4 w-full max-w-lg rounded bg-border" />
        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          <div className="h-12 rounded-lg bg-surface" />
          <div className="h-12 rounded-lg bg-surface" />
        </div>
      </div>
    </div>
  );
}
