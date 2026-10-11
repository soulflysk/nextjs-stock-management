"use client";
import { useEffect, useState } from "react";
import { api, Product, Transaction } from "@/lib/api";
export default function Stock() {
  const [products, setProducts] = useState<Product[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [product, setProduct] = useState(0);
  const [type, setType] = useState<"in" | "out">("in");
  const [qty, setQty] = useState(1);
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  async function load() {
    try {
      const [p, t] = await Promise.all([
        api<Product[]>("/api/products"),
        api<Transaction[]>("/api/stock/transactions"),
      ]);
      setProducts(p);
      setTransactions(t);
      if (!product && p[0]) setProduct(p[0].id);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    }
  }
  useEffect(() => {
    load();
  }, []);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const p = products.find((x) => x.id === product);
      await api(`/api/stock/${product}/${type}`, {
        method: "POST",
        body: JSON.stringify({ quantity: qty, note }),
      });
      setMessage(
        `${type === "in" ? "Stock In" : "Stock Out"} recorded for ${p?.name}`,
      );
      setNote("");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Transaction failed");
    }
  }
  return (
    <>
      <div className="topbar">
        <div>
          <h1 className="title">Stock Transactions</h1>
          <div className="muted">
            Transactional stock updates with EF Core and SQL Server
          </div>
        </div>
      </div>
      {error && <div className="error">{error}</div>}
      {message && <div className="success-message">{message}</div>}
      <div className="panel" style={{ maxWidth: 720 }}>
        <form onSubmit={submit}>
          <div className="form-grid">
            <div className="field">
              <label>Product</label>
              <select
                value={product}
                onChange={(e) => setProduct(Number(e.target.value))}
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.sku} - {p.name} (stock {p.stock})
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Transaction Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as "in" | "out")}
              >
                <option value="in">Stock In</option>
                <option value="out">Stock Out</option>
              </select>
            </div>
            <div className="field">
              <label>Quantity</label>
              <input
                type="number"
                min={1}
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
              />
            </div>
            <div className="field">
              <label>Reference / Note</label>
              <input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="PO-2026-001"
              />
            </div>
          </div>
          <div className="actions">
            <button className="btn btn-primary">Save Transaction</button>
          </div>
        </form>
      </div>
      <div style={{ height: 16 }} />
      <div className="panel">
        <h2>Recent Transactions</h2>
        <div className="activity">
          {transactions.map((t) => (
            <div className="activity-item" key={t.id}>
              <span>
                <strong>{t.type}</strong> · {t.product?.name} · {t.quantity}{" "}
                units {t.note && `· ${t.note}`}
              </span>
              <span className="muted">
                {new Date(t.createdAt).toLocaleString("th-TH")}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
