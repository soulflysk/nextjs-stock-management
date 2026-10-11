"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
export default function Sidebar() {
  const router = useRouter();
  const [user, setUser] = useState<{ username: string; role: string } | null>(
    null,
  );
  useEffect(() => {
    const raw = localStorage.getItem("user");
    if (raw) setUser(JSON.parse(raw));
  }, []);
  function logout() {
    localStorage.clear();
    router.push("/login");
  }
  return (
    <aside className="sidebar">
      <div className="brand">StockFlow</div>
      <nav className="nav">
        <Link href="/">📊 Dashboard</Link>
        <Link href="/products">📦 Products</Link>
        <Link href="/stock">🔄 Stock Transactions</Link>
      </nav>
      <div className="sidebar-user">
        {user && (
          <>
            <strong>{user.username}</strong>
            <span>{user.role}</span>
            <button onClick={logout}>Logout</button>
          </>
        )}
      </div>
    </aside>
  );
}
