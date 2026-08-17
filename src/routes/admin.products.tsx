import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { AdminShell, DataTable, StatusPill } from "@/components/nova/AdminShell";
import { productService } from "@/services/api";
import { inr } from "@/lib/format";

export const Route = createFileRoute("/admin/products")({
  head: () => ({
    meta: [
      { title: "Admin Products — NØVA" },
      { name: "description", content: "Manage the NØVA product catalogue, pricing and stock." },
      { property: "og:title", content: "Admin Products — NØVA" },
      { property: "og:description", content: "Manage the NØVA catalogue." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminProducts,
});

function AdminProducts() {
  const all = productService.all();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");

  const rows = useMemo(
    () =>
      all.filter(
        (p) =>
          (cat === "all" || p.category === cat) &&
          (q === "" || p.name.toLowerCase().includes(q.toLowerCase())),
      ),
    [all, q, cat],
  );

  const cats = Array.from(new Set(all.map((p) => p.category)));

  return (
    <AdminShell title="Products" subtitle={`${rows.length} of ${all.length} products`}>
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-60">
          <Search width={15} height={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <label htmlFor="admin-product-search" className="sr-only">
            Search products
          </label>
          <input
            id="admin-product-search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search products"
            className="w-full border border-border bg-transparent py-3 pl-10 pr-4 text-sm outline-none focus:border-primary"
          />
        </div>
        <label htmlFor="admin-cat" className="sr-only">
          Filter category
        </label>
        <select
          id="admin-cat"
          value={cat}
          onChange={(e) => setCat(e.target.value)}
          className="border border-border bg-background px-4 py-3 text-sm capitalize outline-none focus:border-primary"
        >
          <option value="all">All categories</option>
          {cats.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-6">
        <DataTable headers={["Product", "Category", "Price", "Stock", "Rating", "Status"]}>
          {rows.slice(0, 40).map((p) => (
            <tr key={p.id}>
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <img src={p.images[0]} alt="" loading="lazy" className="h-12 w-10 object-cover" />
                  <div>
                    <p className="font-semibold uppercase">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.brand}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 capitalize text-muted-foreground">{p.category}</td>
              <td className="px-4 py-3 tabular-nums">{inr(p.price)}</td>
              <td className="px-4 py-3 tabular-nums">{p.stock}</td>
              <td className="px-4 py-3 tabular-nums">{p.rating.toFixed(1)}</td>
              <td className="px-4 py-3">
                <StatusPill value={p.status === "active" ? "Active" : p.status} />
              </td>
            </tr>
          ))}
        </DataTable>
      </div>
    </AdminShell>
  );
}