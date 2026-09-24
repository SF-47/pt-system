import { redirect } from "next/navigation";

type DailyActivityPageProps = { params: Promise<{ id: string }> };

// Daily Activity now lives in the Client Details "Daily Activity" tab.
export default async function ClientDailyActivityPage({
  params,
}: DailyActivityPageProps) {
  const { id } = await params;
  redirect(`/clients/${id}`);
}
