export default function Loading() {
  return (
    <div aria-label="Loading dashboard" aria-busy="true" className="animate-pulse">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div className="w-full max-w-md">
          <div className="h-9 w-48 rounded-md bg-border" />
          <div className="mt-3 h-4 w-full rounded bg-border" />
        </div>
        <div className="h-12 w-36 rounded-lg bg-border" />
      </div>
      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[0, 1, 2, 3].map((item) => (
          <div key={item} className="min-h-28 rounded-xl border border-border bg-surface px-5 py-4">
            <div className="h-4 w-28 rounded bg-border" />
            <div className="mt-5 h-8 w-12 rounded bg-border" />
          </div>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-[1.4fr_0.6fr]">
        <div className="rounded-xl border border-border bg-surface p-4">
          <div className="h-[23px] w-36 rounded bg-border" />
          <div className="mt-2 h-4 w-40 rounded bg-border" />
          <div className="mt-3 h-48 rounded-lg bg-background" />
        </div>
        <div className="rounded-xl border border-border bg-surface p-4">
          <div className="h-[23px] w-32 rounded bg-border" />
          <div className="mt-2 h-4 w-44 rounded bg-border" />
          <div className="mt-3 h-48 rounded-lg bg-background" />
        </div>
      </div>
      <div className="mt-4 rounded-xl bg-primary-soft p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="h-7 w-52 rounded bg-surface" />
            <div className="mt-2 h-4 w-full max-w-lg rounded bg-surface" />
          </div>
          <div className="size-8 shrink-0 rounded bg-surface" />
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
          {[0, 1, 2, 3].map((button) => (
            <div key={button} className="h-11 rounded-lg bg-surface" />
          ))}
        </div>
      </div>
    </div>
  );
}
