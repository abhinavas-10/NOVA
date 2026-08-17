import { createFileRoute } from "@tanstack/react-router";
import { AdminShell, StatCard } from "@/components/nova/AdminShell";
import { customerService, orderService, productService } from "@/services/api";
import { inr } from "@/lib/format";

export const Route = createFileRoute("/admin/analytics")({
  head: () => ({
    meta: [
      { title: "Admin Analytics — NØVA" },
      { name: "description", content: "Revenue trends, category mix and best sellers for NØVA." },
      { property: "og:title", content: "Admin Analytics — NØVA" },
      { property: "og:description", content: "NØVA revenue and category analytics." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminAnalytics,
});

const MONTHS = [
  { month: "Jan", value: 412000 },
  { month: "Feb", value: 486000 },
  { month: "Mar", value: 528000 },
  { month: "Apr", value: 497000 },
  { month: "May", value: 613000 },
  { month: "Jun", value: 702000 },
  { month: "Jul", value: 664000 },
  { month: "Aug", value: 781000 },
];

function AdminAnalytics() {
  const orders = orderService.listSync();
  const products = productService.all();
  const customers = customerService.listSync();
  const revenue = orders.reduce((s, o) => s + o.total, 0);
  const peak = Math.max(...MONTHS.map((m) => m.value));

  const byCategory = products.reduce<Record<string, number>>((acc, p) => {
    acc[p.category] = (acc[p.category] ?? 0) + 1;
    return acc;
  }, {});
  const maxCat = Math.max(...Object.values(byCategory));

  const bestSellers = [...products].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 5);

  return (
    <AdminShell title="Analytics" subtitle="Trends across the last eight months.">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Revenue" value={inr(revenue)} delta="+18.2%" />
        <StatCard label="Avg Order Value" value={inr(Math.round(revenue / Math.max(1, orders.length)))} />
        <StatCard label="Conversion" value="3.8%" delta="+0.4pt" />
        <StatCard label="Repeat Customers" value={`${Math.round((customers.filter((c) => c.orders > 1).length / customers.length) * 100)}%`} />
      </div>

      <section className="mt-12 border border-border p-6">
        <h2 className="label-xs">Monthly Revenue</h2>
        <div className="mt-8 flex h-56 items-end gap-3">
          {MONTHS.map((m) => (
            <div key={m.month} className="flex flex-1 flex-col items-center gap-3">
              <div
                className="w-full bg-primary/80 transition-all hover:bg-primary"
                style={{ height: `${(m.value / peak) * 100}%` }}
                title={inr(m.value)}
              />
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{m.month}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <section className="border border-border p-6">
          <h2 className="label-xs">Catalogue by Category</h2>
          <ul className="mt-6 space-y-4">
            {Object.entries(byCategory).map(([cat, count]) => (
              <li key={cat}>
                <div className="flex justify-between text-xs uppercase tracking-widest">
                  <span>{cat}</span>
                  <span className="tabular-nums text-muted-foreground">{count}</span>
                </div>
                <div className="mt-2 h-1 w-full bg-secondary">
                  <div className="h-full bg-primary" style={{ width: `${(count / maxCat) * 100}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="border border-border p-6">
          <h2 className="label-xs">Best Sellers</h2>
          <ul className="mt-6 space-y-4">
            {bestSellers.map((p) => (
              <li key={p.id} className="flex items-center gap-4">
                <img src={p.images[0]} alt="" loading="lazy" className="h-14 w-11 object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold uppercase">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.reviewCount} reviews</p>
                </div>
                <span className="text-sm tabular-nums">{inr(p.price)}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </AdminShell>
  );
}