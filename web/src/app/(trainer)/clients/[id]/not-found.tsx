import EmptyState from "@/components/EmptyState";
import BackLink from "@/components/BackLink";
import PageHeader from "@/components/PageHeader";
export default function ClientNotFound() {
  return (
    <div>
      <BackLink href="/clients">Back to Clients</BackLink>
      <PageHeader title="Client Not Found" />
      <div className="rounded-lg border border-border bg-surface"><EmptyState icon="clients" title="Client unavailable" description="The client you are looking for does not exist. Return to Clients to choose another profile." /></div>
    </div>
  );
}
