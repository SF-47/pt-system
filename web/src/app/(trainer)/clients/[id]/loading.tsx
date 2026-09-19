export default function Loading() {
  return (
    <div aria-label="Loading client details" aria-busy="true" className="animate-pulse">
      <div className="mb-5 h-5 w-32 rounded bg-border" />
      <div className="mb-6 flex items-center gap-4 rounded-xl bg-surface p-6">
        <div className="size-16 rounded-full bg-border" />
        <div className="flex-1">
          <div className="h-9 w-52 rounded bg-border" />
          <div className="mt-3 h-4 w-44 rounded bg-border" />
        </div>
        <div className="h-11 w-28 rounded-md bg-border" />
      </div>
      <div className="mb-7 flex gap-2">
        {[0, 1, 2].map((tab) => <div key={tab} className="h-11 w-32 rounded-md bg-border" />)}
      </div>
      <div className="grid gap-7 xl:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="space-y-6 rounded-xl bg-surface p-6">
          {[0, 1, 2].map((section) => (
            <div key={section} className="border-b border-border pb-6 last:border-0">
              <div className="h-6 w-48 rounded bg-border" />
              <div className="mt-4 h-4 w-full max-w-xl rounded bg-border" />
            </div>
          ))}
        </div>
        <div className="space-y-5">
          {[0, 1, 2].map((item) => <div key={item} className="h-14 rounded-md bg-border" />)}
        </div>
      </div>
    </div>
  );
}
