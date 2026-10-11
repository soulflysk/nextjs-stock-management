export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
export type Product = {
  id: number;
  sku: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  lowStockThreshold: number;
  updatedAt: string;
};
export type Transaction = {
  id: number;
  productId: number;
  product?: Product;
  type: "In" | "Out";
  quantity: number;
  note?: string;
  createdByUser?: { username: string };
  createdAt: string;
};
export function token() {
  return typeof window === "undefined"
    ? null
    : localStorage.getItem("access_token");
}
export async function api<T>(path: string, options: RequestInit = {}) {
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");
  const t = token();
  if (t) headers.set("Authorization", `Bearer ${t}`);
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    cache: "no-store",
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Request failed (${res.status})`);
  }
  return res.status === 204 ? (undefined as T) : ((await res.json()) as T);
}
