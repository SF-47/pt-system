export default function Loading() {
  return (
    <div aria-label="Loading workout plan" aria-busy="true" className="max-w-5xl animate-pulse">
      <div className="mb-5 h-5 w-44 rounded bg-border" />
      <div className="mb-6 h-9 w-48 rounded bg-border" />
      <div className="mb-6 flex gap-8 border-b border-border pb-5">
        <div className="h-10 w-24 rounded bg-border" />
        <div className="h-10 w-24 rounded bg-border" />
      </div>
      <div className="mb-3 h-6 w-28 rounded bg-border" />
      <div className="overflow-hidden rounded-lg border border-border bg-surface">
        <div className="grid grid-cols-4 gap-4 bg-background px-5 py-4">
          {[0, 1, 2, 3].map((cell) => <div key={cell} className="h-4 w-16 rounded bg-border" />)}
        </div>
        {[0, 1, 2, 3].map((row) => (
          <div key={row} className="grid grid-cols-4 gap-4 border-t border-border px-5 py-5">
            {[0, 1, 2, 3].map((cell) => <div key={cell} className="h-5 w-4/5 rounded bg-border" />)}
          </div>
        ))}
      </div>
    </div>
  );
}
