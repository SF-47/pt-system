import { redirect } from "next/navigation";

type ProgressPageProps = { params: Promise<{ id: string }> };

// Progress now lives in the Client Details "Progress" tab.
export default async function ClientProgressPage({
  params,
}: ProgressPageProps) {
  const { id } = await params;
  redirect(`/clients/${id}`);
}
