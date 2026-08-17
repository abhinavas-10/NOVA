import { createFileRoute } from "@tanstack/react-router";
import { AdminShell, DataTable, StatusPill } from "@/components/nova/AdminShell";
import { RatingStars } from "@/components/nova/primitives";
import { reviews } from "@/data/catalog";
import { formatDate } from "@/lib/format";

export const Route = createFileRoute("/admin/reviews")({
  head: () => ({
    meta: [
      { title: "Admin Reviews — NØVA" },
      { name: "description", content: "Moderate customer reviews across the NØVA catalogue." },
      { property: "og:title", content: "Admin Reviews — NØVA" },
      { property: "og:description", content: "Moderate NØVA reviews." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminReviews,
});

function AdminReviews() {
  return (
    <AdminShell title="Reviews" subtitle={`${reviews.length} customer reviews`}>
      <DataTable headers={["Product", "Customer", "Rating", "Review", "Date", "Status"]}>
        {reviews.map((r) => (
          <tr key={r.id}>
            <td className="px-4 py-4 font-semibold uppercase">{r.productName}</td>
            <td className="px-4 py-4 text-muted-foreground">{r.customer}</td>
            <td className="px-4 py-4">
              <RatingStars value={r.rating} />
            </td>
            <td className="max-w-xs px-4 py-4">
              <p className="font-semibold uppercase">{r.title}</p>
              <p className="truncate text-xs text-muted-foreground">{r.body}</p>
            </td>
            <td className="px-4 py-4 text-muted-foreground">{formatDate(r.date)}</td>
            <td className="px-4 py-4">
              <StatusPill value={r.status} />
            </td>
          </tr>
        ))}
      </DataTable>
    </AdminShell>
  );
}