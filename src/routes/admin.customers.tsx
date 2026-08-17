import { createFileRoute } from "@tanstack/react-router";
import { AdminShell, DataTable, StatusPill } from "@/components/nova/AdminShell";
import { customerService } from "@/services/api";
import { formatDate, inr } from "@/lib/format";

export const Route = createFileRoute("/admin/customers")({
  head: () => ({
    meta: [
      { title: "Admin Customers — NØVA" },
      { name: "description", content: "Customer list, lifetime spend and order counts for NØVA." },
      { property: "og:title", content: "Admin Customers — NØVA" },
      { property: "og:description", content: "NØVA customer base." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminCustomers,
});

function AdminCustomers() {
  const customers = customerService.listSync();
  return (
    <AdminShell title="Customers" subtitle={`${customers.length} registered customers`}>
      <DataTable headers={["Customer", "Orders", "Lifetime Spend", "Joined", "Status"]}>
        {customers.map((c) => (
          <tr key={c.id}>
            <td className="px-4 py-4">
              <p className="font-semibold uppercase">{c.name}</p>
              <p className="text-xs text-muted-foreground">{c.email}</p>
            </td>
            <td className="px-4 py-4 tabular-nums">{c.orders}</td>
            <td className="px-4 py-4 tabular-nums">{inr(c.totalSpent)}</td>
            <td className="px-4 py-4 text-muted-foreground">{formatDate(c.joinedAt)}</td>
            <td className="px-4 py-4">
              <StatusPill value={c.status} />
            </td>
          </tr>
        ))}
      </DataTable>
    </AdminShell>
  );
}