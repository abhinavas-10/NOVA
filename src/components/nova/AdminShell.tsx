import { Link, useRouterState } from "@tanstack/react-router";
import {
  BarChart3,
  LayoutDashboard,
  Package,
  ReceiptText,
  Star,
  Tag,
  Users,
} from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/orders", label: "Orders", icon: ReceiptText },
  { to: "/admin/customers", label: "Customers", icon: Users },
  { to: "/admin/coupons", label: "Coupons", icon: Tag },
  { to: "/admin/reviews", label: "Reviews", icon: Star },
  { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
] as const;

export function AdminShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen bg-background lg:flex">
      <aside className="border-b border-border lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between p-6">
          <Link to="/" className="display text-2xl">
            NØVA
          </Link>
          <span className="label-xs text-primary">Admin</span>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-4 pb-4 lg:flex-col lg:overflow-visible">
          {NAV.map((n) => {
            const active = pathname === n.to;
            return (
              <Link
                key={n.to}
                to={n.to}
                className={cn(
                  "flex shrink-0 items-center gap-3 px-3 py-3 text-[11px] uppercase tracking-widest transition-colors",
                  active ? "bg-secondary text-primary" : "text-muted-foreground hover:text-foreground",
                )}
              >
                <n.icon width={15} height={15} />
                {n.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <main className="min-w-0 flex-1 px-5 py-10 sm:px-8">
        <header className="border-b border-border pb-6">
          <h1 className="display text-4xl sm:text-5xl">{title}</h1>
          {subtitle && <p className="mt-3 text-sm text-muted-foreground">{subtitle}</p>}
        </header>
        <div className="mt-8">{children}</div>
      </main>
    </div>
  );
}

export function StatCard({
  label,
  value,
  delta,
}: {
  label: string;
  value: string;
  delta?: string;
}) {
  return (
    <div className="border border-border p-6">
      <p className="label-xs text-muted-foreground">{label}</p>
      <p className="display mt-3 text-3xl tabular-nums">{value}</p>
      {delta && <p className="mt-2 text-[11px] uppercase tracking-widest text-primary">{delta}</p>}
    </div>
  );
}

export function StatusPill({ value }: { value: string }) {
  const tone =
    ["Delivered", "Paid", "Active", "Published"].includes(value)
      ? "border-primary text-primary"
      : ["Cancelled", "Refunded", "Expired", "Hidden"].includes(value)
        ? "border-destructive text-destructive"
        : "border-border text-muted-foreground";
  return (
    <span className={cn("border px-2.5 py-1 text-[10px] uppercase tracking-widest", tone)}>
      {value}
    </span>
  );
}

export function DataTable({
  headers,
  children,
}: {
  headers: string[];
  children: ReactNode;
}) {
  return (
    <div className="overflow-x-auto border border-border">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead>
          <tr className="border-b border-border">
            {headers.map((h) => (
              <th key={h} className="label-xs px-4 py-4 font-normal text-muted-foreground">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">{children}</tbody>
      </table>
    </div>
  );
}