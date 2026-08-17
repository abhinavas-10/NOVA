import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, X } from "lucide-react";
import { SiteLayout } from "@/components/nova/SiteLayout";
import { EmptyState } from "@/components/nova/primitives";
import { useShop } from "@/store/shop";
import { productService } from "@/services/api";
import { inr } from "@/lib/format";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [
      { title: "Wishlist — NØVA" },
      { name: "description", content: "Pieces you've saved from the NØVA collection." },
      { property: "og:title", content: "Wishlist — NØVA" },
      { property: "og:description", content: "Your saved NØVA pieces." },
    ],
  }),
  component: WishlistPage,
});

function WishlistPage() {
  const { wishlist, removeFromWishlist, addToCart } = useShop();
  const items = wishlist
    .map((id) => productService.getSync(id))
    .filter((p): p is NonNullable<typeof p> => p !== null);

  return (
    <SiteLayout>
      <div className="mx-auto max-w-[1600px] px-5 py-12 sm:px-8 sm:py-16">
        <header className="border-b border-border pb-8">
          <h1 className="display text-6xl sm:text-8xl">Wishlist</h1>
          <p className="mt-4 text-sm text-muted-foreground">{items.length} saved pieces</p>
        </header>

        <div className="mt-12">
          {items.length === 0 ? (
            <EmptyState
              title="Nothing saved yet."
              body="Save the pieces you're watching and they'll wait here."
              actionLabel="Explore New Drops"
              actionTo="/shop"
              icon={<Heart width={28} height={28} />}
            />
          ) : (
            <ul className="divide-y divide-border border-y border-border">
              {items.map((p) => (
                <li key={p.id} className="flex flex-col gap-5 py-6 sm:flex-row sm:items-center">
                  <Link to="/product/$id" params={{ id: p.id }} className="shrink-0">
                    <img src={p.images[0]} alt={p.name} loading="lazy" className="h-40 w-32 object-cover" />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <p className="label-xs text-muted-foreground">{p.brand}</p>
                    <Link
                      to="/product/$id"
                      params={{ id: p.id }}
                      className="text-lg font-semibold uppercase hover:text-primary"
                    >
                      {p.name}
                    </Link>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="font-semibold tabular-nums">{inr(p.price)}</span>
                      <span className="text-xs text-muted-foreground line-through">
                        {inr(p.originalPrice)}
                      </span>
                      <span className="text-xs text-primary">{p.discount}% off</span>
                    </div>
                    <p className="label-xs mt-3 text-muted-foreground">
                      Sizes — {p.sizes.join(" · ")}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        addToCart(p.id, p.sizes[1] ?? p.sizes[0] ?? "M", p.colors[0] ?? "Black");
                        removeFromWishlist(p.id);
                      }}
                      className="label-xs bg-primary px-5 py-3 text-primary-foreground transition-opacity hover:opacity-85"
                    >
                      Move to Bag
                    </button>
                    <button
                      type="button"
                      aria-label={`Remove ${p.name}`}
                      onClick={() => removeFromWishlist(p.id)}
                      className="grid h-11 w-11 place-items-center border border-border transition-colors hover:border-primary"
                    >
                      <X width={16} height={16} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </SiteLayout>
  );
}