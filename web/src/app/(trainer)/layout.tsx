import GlobalHeader from "@/components/GlobalHeader";
import Sidebar from "@/components/Sidebar";
import TrainerAuthGuard from "@/components/TrainerAuthGuard";

export default function TrainerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const today = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  return (
    <TrainerAuthGuard>
      <div className="min-h-dvh min-[761px]:grid min-[761px]:grid-cols-[270px_minmax(0,1fr)]">
        <a
          className="fixed -top-24 left-3 z-10 bg-primary p-3 text-white focus:top-3"
          href="#main-content"
        >
          Skip to content
        </a>
        <Sidebar />
        <div className="min-w-0">
          <GlobalHeader date={today} />
          <main
            id="main-content"
            className="w-full min-w-0 px-4 pt-6 pb-10 min-[761px]:p-6 min-[1001px]:px-14 min-[1001px]:pt-8 min-[1001px]:pb-10"
            tabIndex={-1}
          >
            {children}
          </main>
        </div>
      </div>
    </TrainerAuthGuard>
  );
}
