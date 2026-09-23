export default function Loading() {
  return (
    <div aria-label="Loading client details" aria-busy="true" className="animate-pulse">
      <div className="mb-4 h-5 w-32 rounded bg-border" />

      {/* Client summary card */}
      <div className="mb-5 rounded-xl border border-border bg-surface p-5 sm:p-6">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,1.1fr)]">
          <div className="flex items-center gap-4">
            <div className="size-14 shrink-0 rounded-full bg-border sm:size-16" />
            <div className="min-w-0 flex-1">
              <div className="h-6 w-40 rounded bg-border" />
              <div className="mt-2 h-4 w-48 rounded bg-border" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 lg:grid-cols-1 lg:border-x lg:border-border lg:px-5">
            {[0, 1, 2].map((item) => (
              <div key={item}>
                <div className="h-3 w-14 rounded bg-border" />
                <div className="mt-2 h-4 w-20 rounded bg-border" />
              </div>
            ))}
          </div>

          <div>
            <div className="h-3 w-16 rounded bg-border" />
            <div className="mt-2 h-6 w-28 rounded bg-border" />
            <div className="mt-2 h-3 w-36 rounded bg-border" />
            <div className="mt-3 flex gap-2 border-t border-border pt-3">
              <div className="h-9 w-28 rounded-md bg-border" />
              <div className="h-9 w-32 rounded-md bg-border" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-5 flex gap-2">
        {[0, 1, 2].map((tab) => (
          <div key={tab} className="h-11 w-32 rounded-md bg-border" />
        ))}
      </div>

      {/* Weekly Schedule */}
      <div className="rounded-xl border border-border bg-surface p-4 sm:p-5">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="h-6 w-40 rounded bg-border" />
            <div className="mt-2 h-4 w-48 rounded bg-border" />
          </div>
          <div className="flex flex-col items-start gap-2 sm:items-end">
            <div className="h-9 w-52 rounded-md bg-border" />
            <div className="flex gap-2">
              <div className="h-9 w-36 rounded-md bg-border" />
              <div className="h-9 w-28 rounded-md bg-border" />
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-border">
          <div className="grid grid-cols-7 divide-x divide-border border-b border-border">
            {[0, 1, 2, 3, 4, 5, 6].map((day) => (
              <div key={day} className="p-2.5">
                <div className="h-4 w-8 rounded bg-border" />
                <div className="mt-1.5 h-3 w-10 rounded bg-border" />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 divide-x divide-border">
            {[0, 1, 2, 3, 4, 5, 6].map((day) => (
              <div key={day} className="space-y-2 p-2.5">
                {(day === 1 || day === 3 || day === 5) && (
                  <div className="h-12 rounded-md bg-border" />
                )}
                {(day === 2 || day === 4) && (
                  <div className="h-12 rounded-md bg-border" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
