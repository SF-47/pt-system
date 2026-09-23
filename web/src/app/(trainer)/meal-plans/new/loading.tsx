export default function Loading() {
  return (
    <div aria-label="Loading meal plan form" aria-busy="true" className="max-w-3xl animate-pulse">
      <div className="mb-5 h-5 w-36 rounded bg-border" />
      <div className="mb-5 h-9 w-52 rounded bg-border" />
      <div className="overflow-hidden rounded-xl border border-border bg-surface">
        <div className="space-y-6 p-5 sm:p-6">
          <div className="border-b border-border pb-5">
            <div className="h-6 w-32 rounded bg-border" />
            <div className="mt-2 h-4 w-72 max-w-full rounded bg-border" />
          </div>
          <div><div className="mb-2 h-4 w-24 rounded bg-border" /><div className="h-12 rounded-md bg-border" /></div>
          <div><div className="mb-2 h-4 w-24 rounded bg-border" /><div className="h-32 rounded-md bg-border" /></div>
        </div>
        <div className="flex gap-3 border-t border-border bg-primary-soft/40 px-5 py-4">
          <div className="h-11 w-36 rounded-md bg-border" />
          <div className="h-11 w-24 rounded-md bg-border" />
        </div>
      </div>
    </div>
  );
}
