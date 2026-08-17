import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { SiteLayout } from "@/components/nova/SiteLayout";
import { EmptyState } from "@/components/nova/primitives";
import { useShop } from "@/store/shop";
import { orderService } from "@/services/api";
import { cn } from "@/lib/utils";
import { formatDate, inr } from "@/lib/format";

const TIMELINE = ["Confirmed", "Processing", "Shipped", "Delivered"] as const;

export const Route = createFileRoute("/orders/$id")({
  head: () => ({
    meta: [
      { title: "Order Details — NØVA" },
      { name: "description", content: "Track your NØVA order status and delivery." },
      { property: "og:title", content: "Order Details — NØVA" },
      { property: "og:description", content: "Track your NØVA order." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: OrderPage,
});

function OrderPage() {
  const { id } = Route.useParams();
  const { placedOrders } = useShop();
  const order = placedOrders.find((o) => o.id === id) ?? orderService.getSync(id);

  if (!order) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-3xl px-5 py-24 sm:px-8">
          <EmptyState
            title="Order not found."
            body="We couldn't find that order reference."
            actionLabel="Back to Account"
            actionTo="/account"
          />
        </div>
      </SiteLayout>
    );
  }

  const stage = Math.max(0, TIMELINE.indexOf(order.status as (typeof TIMELINE)[number]));

  return (
    <SiteLayout>
      <div className="mx-auto max-w-[1100px] px-5 py-12 sm:px-8 sm:py-16">
        <p className="label-xs text-primary">Order confirmed</p>
        <h1 className="display mt-3 text-5xl sm:text-7xl">{order.id}</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          Placed {formatDate(order.date)} · {order.payment} · {order.paymentStatus}
        </p>

        <ol className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {TIMELINE.map((label, i) => (
            <li key={label} className={cn("border-t-2 pt-3", i <= stage ? "border-primary" : "border-border")}>
              <span className="label-xs flex items-center gap-2">
                {i <= stage && <Check width={13} height={13} className="text-primary" />}
                <span className={i <= stage ? "text-foreground" : "text-muted-foreground"}>{label}</span>
              </span>
            </li>
          ))}
        </ol>

        <div className="mt-14 grid gap-12 lg:grid-cols-[1.5fr_1fr]">
          <ul className="divide-y divide-border border-y border-border">
            {order.items.map((it, i) => (
              <li key={`${it.productId}-${i}`} className="flex gap-4 py-5">
                <img src={it.image} alt="" loading="lazy" className="h-28 w-22 object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="label-xs text-muted-foreground">{it.brand}</p>
                  <Link
                    to="/product/$id"
                    params={{ id: it.productId }}
                    className="text-sm font-semibold uppercase hover:text-primary"
                  >
                    {it.name}
                  </Link>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {it.size} · {it.color} · ×{it.quantity}
                  </p>
                </div>
                <span className="text-sm tabular-nums">{inr(it.price * it.quantity)}</span>
              </li>
            ))}
          </ul>

          <aside className="h-fit space-y-8 border border-border p-6">
            <div>
              <p className="label-xs text-muted-foreground">Shipping to</p>
              <p className="mt-3 text-sm leading-relaxed">
                {order.address.name}
                <br />
                {order.address.line1}, {order.address.city}
                <br />
                {order.address.state} {order.address.pincode}
                <br />
                {order.address.phone}
              </p>
            </div>
            <div className="flex justify-between border-t border-border pt-5 text-base font-semibold">
              <span>Total paid</span>
              <span className="tabular-nums">{inr(order.total)}</span>
            </div>
            <Link
              to="/shop"
              className="label-xs block bg-primary py-4 text-center text-primary-foreground transition-opacity hover:opacity-85"
            >
              Continue Shopping
            </Link>
          </aside>
        </div>
      </div>
    </SiteLayout>
  );
}