export default function Loading() {
  return (
    <div aria-label="Loading daily activity" aria-busy="true" className="w-full animate-pulse">
      <div className="mb-5 h-5 w-40 rounded bg-border" />
      <div className="mb-5 h-9 w-44 rounded bg-border" />
      <div className="mb-5 rounded-xl border border-border bg-surface p-5">
        <div className="h-4 w-16 rounded bg-border" />
        <div className="mt-2 h-11 w-60 rounded-md bg-border" />
      </div>
      {["Workouts", "Meals"].map((section) => (
        <div key={section} className="mb-5">
          <div className="mb-3 h-6 w-28 rounded bg-border" />
          <div className="divide-y divide-border rounded-xl border border-border bg-surface px-5">
            {[0, 1, 2].map((row) => (
              <div key={row} className="flex justify-between py-5">
                <div className="h-5 w-36 rounded bg-border" />
                <div className="h-6 w-20 rounded bg-border" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
