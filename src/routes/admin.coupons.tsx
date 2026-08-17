import { createFileRoute } from "@tanstack/react-router";
import { AdminShell, DataTable, StatusPill } from "@/components/nova/AdminShell";
import { coupons } from "@/data/catalog";
import { formatDate, inr } from "@/lib/format";

export const Route = createFileRoute("/admin/coupons")({
  head: () => ({
    meta: [
      { title: "Admin Coupons — NØVA" },
      { name: "description", content: "Promo codes, discount values and redemption counts for NØVA." },
      { property: "og:title", content: "Admin Coupons — NØVA" },
      { property: "og:description", content: "NØVA promo codes." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminCoupons,
});

function AdminCoupons() {
  return (
    <AdminShell title="Coupons" subtitle={`${coupons.length} promo codes`}>
      <DataTable headers={["Code", "Discount", "Min Order", "Used", "Expiry", "Status"]}>
        {coupons.map((c) => (
          <tr key={c.id}>
            <td className="px-4 py-4 font-semibold uppercase text-primary">{c.code}</td>
            <td className="px-4 py-4">{c.type === "percent" ? `${c.value}%` : inr(c.value)}</td>
            <td className="px-4 py-4 tabular-nums">{inr(c.minOrder)}</td>
            <td className="px-4 py-4 tabular-nums">{c.used}</td>
            <td className="px-4 py-4 text-muted-foreground">{formatDate(c.expiry)}</td>
            <td className="px-4 py-4">
              <StatusPill value={c.status} />
            </td>
          </tr>
        ))}
      </DataTable>
    </AdminShell>
  );
}