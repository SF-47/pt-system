"use client";
import BackLink from "@/components/BackLink";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Avatar from "@/components/Avatar";
import Icon from "@/components/Icon";
import api from "@/lib/api";
import { Endpoints } from "@/lib/Endpoints";

type SelectedClientType = {
  id:number;
  fullName: string;
  username: string;
  email?: string;
  phoneNumber: string;
  isActive: boolean;
  createdAt: string;
};

export default function ClientDetailsPage() {
  const params = useParams<{ id: string }>();
  const clientId = Number(params.id);
  const [client, setClient] = useState<SelectedClientType>({
    id:0,
    fullName: "",
    username: "",
    email: "",
    phoneNumber: "",
    isActive: true,
    createdAt: "",
  });

  async function getClientById() {
    const response = await api.get(Endpoints.clientById(clientId));

    setClient(response.data);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    getClientById();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  return (
    <div>
      <BackLink href="/clients">Back to Clients</BackLink>
      <div className="mb-6 flex items-start gap-4 rounded-xl bg-surface p-5 sm:p-6 [&>span]:size-14 [&>span]:text-lg sm:gap-5 sm:[&>span]:size-16 [&_header]:mb-0">
        <Avatar name={client.fullName} />
        <div className="min-w-0 flex-1">
          <PageHeader title={client.fullName} description={client.email}>
            <Link
              href={`/clients/${client.id}/edit`}
              className="inline-flex min-h-11 items-center gap-2 rounded-md border border-border bg-surface px-4 py-2 font-medium hover:bg-hover"
            >
              <Icon name="edit" className="size-4" />
              Edit Client
            </Link>
          </PageHeader>
        </div>
      </div>
      <nav aria-label="Client views" className="mb-7 flex flex-wrap gap-2">
        <Link
          href={`/clients/${client.id}`}
          aria-current="page"
          className="inline-flex min-h-11 items-center rounded-md border border-primary bg-primary-soft px-4 font-medium text-primary-hover dark:text-foreground"
        >
          Overview
        </Link>
        <Link
          href={`/clients/${client.id}/progress`}
          className="inline-flex min-h-11 items-center gap-2 rounded-md px-4 text-muted hover:bg-hover"
        >
          <Icon name="dashboard" className="size-4" />
          View Progress
        </Link>
        <Link
          href={`/clients/${client.id}/daily-activity`}
          className="inline-flex min-h-11 items-center gap-2 rounded-md px-4 text-muted hover:bg-hover"
        >
          <Icon name="calendar" className="size-4" />
          Daily Activity
        </Link>
      </nav>
      <div className="grid items-start gap-7 xl:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="rounded-xl bg-surface">
          <section className="p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <Icon name="workout" className="text-muted" />
              <h2 className="text-lg font-semibold">Assigned Workout Plans</h2>
            </div>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">
              Assigned workouts will appear here with assignment dates and
              completion status.
            </p>
          </section>
          <section className="border-t border-border/50 p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <Icon name="meal" className="text-muted" />
              <h2 className="text-lg font-semibold">Assigned Meal Plans</h2>
            </div>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">
              Assigned meal plans will appear here with individual meal
              completion status.
            </p>
          </section>
          <section className="flex flex-wrap items-center justify-between gap-3 border-t border-border/50 p-5 sm:p-6">
            <div>
              <h2 className="text-base font-medium">Progress & activity</h2>
              <p className="mt-1 text-sm text-muted">
                Review completion and daily adherence.
              </p>
            </div>
            <Link
              href={`/clients/${client.id}/progress`}
              className="inline-flex min-h-11 items-center gap-2 rounded-md px-2 font-medium text-primary-hover dark:text-foreground hover:bg-primary-soft"
            >
              View Progress
              <Icon name="arrow" className="size-4" />
            </Link>
          </section>
        </div>
        <div className="grid gap-7">
          <section>
            <h2 className="pb-1 text-base font-semibold">
              Contact information
            </h2>
            <dl className="grid gap-5 pt-5">
              <div>
                <dt className="text-sm text-muted">Full name</dt>
                <dd className="mt-1 font-medium wrap-anywhere">
                  {client.fullName}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-muted">Email</dt>
                <dd className="mt-1 wrap-anywhere">{client.email}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted">Phone</dt>
                <dd className="mt-1 tabular-nums">{client.phoneNumber}</dd>
              </div>
            </dl>
          </section>
          <section className="rounded-xl bg-surface p-5">
            <h2 className="mb-3 text-base font-semibold">Payment Status</h2>
            {/* <StatusBadge status={client.paymentStatus} /> */}
          </section>
        </div>
      </div>
    </div>
  );
}
