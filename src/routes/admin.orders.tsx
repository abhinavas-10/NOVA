import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AdminShell, DataTable, StatusPill } from "@/components/nova/AdminShell";
import { orderService } from "@/services/api";
import { cn } from "@/lib/utils";
import { formatDate, inr } from "@/lib/format";

export const Route = createFileRoute("/admin/orders")({
  head: () => ({
    meta: [
      { title: "Admin Orders — NØVA" },
      { name: "description", content: "Track and filter every NØVA order by fulfilment status." },
      { property: "og:title", content: "Admin Orders — NØVA" },
      { property: "og:description", content: "Track NØVA orders." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminOrders,
});

const TABS = ["All", "Confirmed", "Processing", "Shipped", "Delivered", "Cancelled"] as const;

function AdminOrders() {
  const orders = orderService.listSync();
  const [tab, setTab] = useState<(typeof TABS)[number]>("All");
  const rows = tab === "All" ? orders : orders.filter((o) => o.status === tab);

  return (
    <AdminShell title="Orders" subtitle={`${rows.length} orders`}>
      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={cn(
              "border px-4 py-2.5 text-[11px] uppercase tracking-widest transition-colors",
              tab === t ? "border-primary text-primary" : "border-border text-muted-foreground hover:text-foreground",
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-6">
        <DataTable headers={["Order", "Customer", "Date", "Items", "Payment", "Status", "Total"]}>
          {rows.map((o) => (
            <tr key={o.id}>
              <td className="px-4 py-4 font-semibold uppercase">{o.id}</td>
              <td className="px-4 py-4">
                <p>{o.customer}</p>
                <p className="text-xs text-muted-foreground">{o.email}</p>
              </td>
              <td className="px-4 py-4 text-muted-foreground">{formatDate(o.date)}</td>
              <td className="px-4 py-4 tabular-nums">{o.items.length}</td>
              <td className="px-4 py-4">
                <p className="text-xs uppercase tracking-widest">{o.payment}</p>
                <span className="text-xs text-muted-foreground">{o.paymentStatus}</span>
              </td>
              <td className="px-4 py-4">
                <StatusPill value={o.status} />
              </td>
              <td className="px-4 py-4 tabular-nums">{inr(o.total)}</td>
            </tr>
          ))}
        </DataTable>
      </div>
    </AdminShell>
  );
}