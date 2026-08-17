import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/nova/SiteLayout";
import { EmptyState } from "@/components/nova/primitives";
import { useShop } from "@/store/shop";
import { productService } from "@/services/api";
import { formatDate, inr } from "@/lib/format";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "My Account — NØVA" },
      { name: "description", content: "Your NØVA orders, saved pieces and recently viewed products." },
      { property: "og:title", content: "My Account — NØVA" },
      { property: "og:description", content: "Manage your NØVA account." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AccountPage,
});

function AccountPage() {
  const { user, logout, placedOrders, wishlist, recent } = useShop();

  if (!user) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-3xl px-5 py-24 sm:px-8">
          <EmptyState
            title="You're signed out."
            body="Sign in to see your orders, saved pieces and addresses."
            actionLabel="Sign In"
            actionTo="/login"
          />
        </div>
      </SiteLayout>
    );
  }

  const recentProducts = recent
    .map((id) => productService.getSync(id))
    .filter((p): p is NonNullable<typeof p> => p !== null)
    .slice(0, 6);

  return (
    <SiteLayout>
      <div className="mx-auto max-w-[1600px] px-5 py-12 sm:px-8 sm:py-16">
        <header className="flex flex-wrap items-end justify-between gap-6 border-b border-border pb-8">
          <div>
            <p className="label-xs text-primary">Member</p>
            <h1 className="display mt-3 text-6xl sm:text-8xl">{user.name}</h1>
            <p className="mt-3 text-sm text-muted-foreground">{user.email}</p>
          </div>
          <button
            type="button"
            onClick={logout}
            className="label-xs border border-border px-6 py-3 transition-colors hover:border-primary hover:text-primary"
          >
            Sign Out
          </button>
        </header>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {[
            { label: "Orders", value: String(placedOrders.length) },
            { label: "Wishlist", value: String(wishlist.length) },
            { label: "Recently Viewed", value: String(recent.length) },
          ].map((s) => (
            <div key={s.label} className="border border-border p-6">
              <p className="label-xs text-muted-foreground">{s.label}</p>
              <p className="display mt-3 text-4xl">{s.value}</p>
            </div>
          ))}
        </div>

        <section className="mt-16">
          <h2 className="display border-b border-border pb-4 text-3xl">Order History</h2>
          {placedOrders.length === 0 ? (
            <p className="mt-6 text-sm text-muted-foreground">
              No orders yet.{" "}
              <Link to="/shop" className="text-primary">
                Start shopping
              </Link>
              .
            </p>
          ) : (
            <ul className="mt-6 divide-y divide-border border-b border-border">
              {placedOrders.map((o) => (
                <li key={o.id} className="flex flex-wrap items-center justify-between gap-4 py-5">
                  <div>
                    <Link
                      to="/orders/$id"
                      params={{ id: o.id }}
                      className="text-sm font-semibold uppercase hover:text-primary"
                    >
                      {o.id}
                    </Link>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatDate(o.date)} · {o.items.length} items · {o.status}
                    </p>
                  </div>
                  <span className="text-sm font-semibold tabular-nums">{inr(o.total)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {recentProducts.length > 0 && (
          <section className="mt-16">
            <h2 className="display border-b border-border pb-4 text-3xl">Recently Viewed</h2>
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {recentProducts.map((p) => (
                <Link key={p.id} to="/product/$id" params={{ id: p.id }} className="group">
                  <img
                    src={p.images[0]}
                    alt={p.name}
                    loading="lazy"
                    className="aspect-[3/4] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <p className="mt-3 truncate text-xs uppercase tracking-widest">{p.name}</p>
                  <p className="text-xs text-muted-foreground tabular-nums">{inr(p.price)}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </SiteLayout>
  );
}