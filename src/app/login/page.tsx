"use client";
import { FormEvent, useState } from "react";
import { API_URL } from "@/lib/api";
import { useRouter } from "next/navigation";
export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("Admin123!");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  async function submit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const r = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!r.ok) throw new Error("Invalid username or password");
      const data = await r.json();
      localStorage.setItem("access_token", data.token);
      localStorage.setItem(
        "user",
        JSON.stringify({ username: data.username, role: data.role }),
      );
      router.push("/");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="login-page">
      <form className="login-card" onSubmit={submit}>
        <div className="brand login-brand">StockFlow</div>
        <h1>Sign in</h1>
        <p className="muted">JWT Authentication Demo</p>
        <div className="field">
          <label>Username</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
          />
        </div>
        <div className="field">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </div>
        {error && <div className="error">{error}</div>}
        <button className="btn btn-primary" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </button>
        <div className="demo">
          <b>Demo</b>
          <br />
          Admin: admin / Admin123!
          <br />
          User: user / User123!
        </div>
      </form>
    </div>
  );
}
