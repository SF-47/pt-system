import Sidebar from "@/components/Sidebar";

export default function TrainerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh min-[761px]:grid min-[761px]:grid-cols-[240px_minmax(0,1fr)] min-[1251px]:grid-cols-[256px_minmax(0,1fr)]">
      <a
        className="fixed -top-24 left-3 z-10 bg-primary p-3 text-white focus:top-3"
        href="#main-content"
      >
        Skip to content
      </a>
      <Sidebar />
      <main
        id="main-content"
        className="mx-auto w-full min-w-0 max-w-[1600px] px-[18px] pt-[22px] pb-10 min-[761px]:p-6 min-[1001px]:px-8 min-[1001px]:pt-[30px] min-[1001px]:pb-10"
        tabIndex={-1}
      >
        {children}
      </main>
    </div>
  );
}
