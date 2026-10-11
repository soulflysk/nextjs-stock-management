import "./globals.css";
import AuthGuard from "@/components/AuthGuard";
export const metadata = {
  title: "StockFlow - Inventory Management",
  description: "Full-stack Next.js + ASP.NET Core portfolio project",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthGuard>{children}</AuthGuard>;
}
