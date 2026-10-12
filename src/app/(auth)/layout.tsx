"use client";
import React, { ReactNode, useEffect, useState } from "react";
import Loader from "@/components/common/Loader";

export default function AuthLayout({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <main>
      {loading ? <Loader /> : children}
    </main>
  );
}
