"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const path = usePathname();
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (path === "/login") {
      setReady(true);
      return;
    }
    if (!localStorage.getItem("access_token")) router.replace("/login");
    else setReady(true);
  }, [path, router]);
  if (!ready) return null;
  if (path === "/login") return <>{children}</>;
  return (
    <div className="app">
      <Sidebar />
      <main className="main">{children}</main>
    </div>
  );
}
