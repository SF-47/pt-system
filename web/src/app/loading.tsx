export default function Loading() {
  return (
    <main
      aria-label="Loading"
      aria-busy="true"
      className="flex min-h-screen items-center justify-center bg-background px-4 py-12"
    >
      <div className="w-full max-w-md animate-pulse">
        <div className="mb-6 flex items-center justify-center gap-3">
          <div className="size-10 rounded-xl bg-border" />
          <div>
            <div className="h-6 w-28 rounded bg-border" />
            <div className="mt-1.5 h-4 w-32 rounded bg-border" />
          </div>
        </div>
        <div className="rounded-xl border border-border bg-surface p-5 sm:p-6">
          <div className="h-8 w-44 rounded-md bg-border" />
          <div className="mt-2 mb-5 h-4 w-56 rounded bg-border" />
          <div className="space-y-4">
            {[0, 1].map((field) => (
              <div key={field}>
                <div className="mb-1 h-4 w-20 rounded bg-border" />
                <div className="h-11 w-full rounded-md bg-border" />
              </div>
            ))}
            <div className="h-11 w-full rounded-md bg-border" />
          </div>
        </div>
        <div className="mx-auto mt-4 h-4 w-32 rounded bg-border" />
      </div>
    </main>
  );
}
