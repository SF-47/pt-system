"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type TrainerAuthGuardProps = {
  children: React.ReactNode;
};


const roleClaimKey =
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";

type JwtPayload = {
  exp?: number;
  role?: string;
  [roleClaimKey]?: string;
};

function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const payload = token.split(".")[1];

    if (!payload) {
      return null;
    }

    const normalizedPayload = payload.replace(/-/g, "+").replace(/_/g, "/");

    const decoded = atob(normalizedPayload);

    return JSON.parse(decoded) as JwtPayload;
  } catch {
    return null;
  }
}

export default function TrainerAuthGuard({ children }: TrainerAuthGuardProps) {
  const router = useRouter();

  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/login");
      return;
    }

    const payload = decodeJwtPayload(token);

    if (!payload) {
      localStorage.removeItem("token");
      router.replace("/login");
      return;
    }

    const currentTime = Math.floor(Date.now() / 1000);

    if (!payload.exp || payload.exp <= currentTime) {
      localStorage.removeItem("token");
      router.replace("/login");
      return;
    }

    if ((payload.role ?? payload[roleClaimKey]) !== "Trainer") {
      localStorage.removeItem("token");
      router.replace("/login");
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsChecking(false);
  }, [router]);

  if (isChecking) {
    return <div>Loading...</div>;
  }

  return children;
}
