import { createFileRoute, Link } from "@tanstack/react-router";
import { AdminShell, DataTable, StatCard, StatusPill } from "@/components/nova/AdminShell";
import { customerService, orderService, productService } from "@/services/api";
import { formatDate, inr } from "@/lib/format";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Admin Overview — NØVA" },
      { name: "description", content: "Revenue, orders and inventory overview for the NØVA store." },
      { property: "og:title", content: "Admin Overview — NØVA" },
      { property: "og:description", content: "NØVA store performance at a glance." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminOverview,
});

function AdminOverview() {
  const orders = orderService.listSync();
  const products = productService.all();
  const customers = customerService.listSync();
  const revenue = orders.reduce((s, o) => s + o.total, 0);
  const lowStock = products.filter((p) => p.stock < 8);

  return (
    <AdminShell title="Overview" subtitle="Store performance across the current season.">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Revenue" value={inr(revenue)} delta="+18.2% vs last month" />
        <StatCard label="Orders" value={String(orders.length)} delta="+6 this week" />
        <StatCard label="Products" value={String(products.length)} delta={`${lowStock.length} low stock`} />
        <StatCard label="Customers" value={String(customers.length)} delta="+4 new" />
      </div>

      <section className="mt-12">
        <div className="flex items-center justify-between">
          <h2 className="label-xs">Recent Orders</h2>
          <Link to="/admin/orders" className="label-xs text-primary">
            View all
          </Link>
        </div>
        <div className="mt-5">
          <DataTable headers={["Order", "Customer", "Date", "Status", "Total"]}>
            {orders.slice(0, 6).map((o) => (
              <tr key={o.id}>
                <td className="px-4 py-4 font-semibold uppercase">{o.id}</td>
                <td className="px-4 py-4 text-muted-foreground">{o.customer}</td>
                <td className="px-4 py-4 text-muted-foreground">{formatDate(o.date)}</td>
                <td className="px-4 py-4">
                  <StatusPill value={o.status} />
                </td>
                <td className="px-4 py-4 tabular-nums">{inr(o.total)}</td>
              </tr>
            ))}
          </DataTable>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="label-xs">Low Stock</h2>
        <div className="mt-5">
          <DataTable headers={["Product", "Category", "Stock", "Price"]}>
            {lowStock.slice(0, 6).map((p) => (
              <tr key={p.id}>
                <td className="px-4 py-4 font-semibold uppercase">{p.name}</td>
                <td className="px-4 py-4 capitalize text-muted-foreground">{p.category}</td>
                <td className="px-4 py-4 text-primary tabular-nums">{p.stock}</td>
                <td className="px-4 py-4 tabular-nums">{inr(p.price)}</td>
              </tr>
            ))}
          </DataTable>
        </div>
      </section>
    </AdminShell>
  );
}