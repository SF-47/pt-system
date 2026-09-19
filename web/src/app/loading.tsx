export default function Loading() {
  return (
    <main
      aria-label="Loading"
      aria-busy="true"
      className="flex min-h-screen items-center justify-center bg-background px-6 py-12"
    >
      <div className="w-full max-w-md animate-pulse">
        <div className="mx-auto size-11 rounded-lg bg-border" />
        <div className="mx-auto mt-5 h-9 w-24 rounded-md bg-border" />
        <div className="mt-8 space-y-4">
          {[0, 1].map((field) => (
            <div key={field}>
              <div className="mb-2 h-5 w-20 rounded bg-border" />
              <div className="h-12 w-full rounded-md bg-border" />
            </div>
          ))}
          <div className="h-12 w-full rounded-md bg-border" />
        </div>
        <div className="mx-auto mt-12 h-5 w-64 max-w-full rounded bg-border" />
      </div>
    </main>
  );
}
