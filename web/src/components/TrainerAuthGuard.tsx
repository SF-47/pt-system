"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type TrainerAuthGuardProps = {
  children: React.ReactNode;
};

export default function TrainerAuthGuard({ children }: TrainerAuthGuardProps) {
  const router = useRouter();

  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
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
