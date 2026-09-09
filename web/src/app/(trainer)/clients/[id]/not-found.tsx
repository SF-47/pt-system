import BackLink from "@/components/BackLink";
import PageHeader from "@/components/PageHeader";
export default function ClientNotFound() {
  return (
    <div>
      <BackLink href="/clients">Back to Clients</BackLink>
      <PageHeader title="Client Not Found" />
      <p className="mt-2 text-muted">
        The client you are looking for does not exist.
      </p>
    </div>
  );
}
