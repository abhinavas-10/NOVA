import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, X } from "lucide-react";
import { SiteLayout } from "@/components/nova/SiteLayout";
import { EmptyState } from "@/components/nova/primitives";
import { useShop } from "@/store/shop";
import { productService } from "@/services/api";
import { inr } from "@/lib/format";
import type { Product } from "@/types";

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
  const { user, wishlist, removeFromWishlist, addToCart } = useShop();

  const [items, setItems] = useState<Product[]>(() => {
    return wishlist
      .map((id) => productService.getSync(id))
      .filter((p): p is Product => Boolean(p));
  });
  const [loading, setLoading] = useState(items.length === 0 && wishlist.length > 0);

  useEffect(() => {
    let cancelled = false;

    if (wishlist.length === 0) {
      setItems([]);
      setLoading(false);
      return;
    }

    productService
      .getMany(wishlist)
      .then((loaded) => {
        if (!cancelled) {
          setItems(loaded);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Failed to load wishlist products:", err);
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [wishlist]);

  if (!user) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-3xl px-5 py-24 sm:px-8">
          <EmptyState
            title="Sign in to view your wishlist."
            body="Save the pieces you love and keep track of them here."
            actionLabel="Sign In"
            actionTo="/login"
            icon={<Heart width={28} height={28} />}
          />
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <div className="mx-auto max-w-[1600px] px-5 py-12 sm:px-8 sm:py-16">
        <header className="border-b border-border pb-8">
          <h1 className="display text-6xl sm:text-8xl">Wishlist</h1>
          <p className="mt-4 text-sm text-muted-foreground">{wishlist.length} saved pieces</p>
        </header>

        <div className="mt-12">
          {loading && items.length === 0 ? (
            <div className="py-24 text-center">
              <p className="label-xs text-muted-foreground">Loading saved pieces...</p>
            </div>
          ) : items.length === 0 ? (
            <EmptyState
              title="Nothing saved yet."
              body="Save the pieces you're watching and they'll wait here."
              actionLabel="Explore New Drops"
              actionTo="/shop"
              icon={<Heart width={28} height={28} />}
            />
          ) : (
            <ul className="divide-y divide-border border-y border-border">
              {items.map((p) => {
                const imageSrc =
                  (Array.isArray(p.images) && p.images[0]) ||
                  p.image ||
                  "/coming-soon.png";

                return (
                  <li key={p.id} className="flex flex-col gap-5 py-6 sm:flex-row sm:items-center">
                    <Link to="/product/$id" params={{ id: p.id }} className="shrink-0">
                      <img
                        src={imageSrc}
                        alt={p.name}
                        loading="lazy"
                        className="h-40 w-32 object-cover"
                      />
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
                        Sizes — {p.sizes?.length > 0 ? p.sizes.join(" · ") : "—"}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          addToCart(
                            p.id,
                            p.sizes?.[1] ?? p.sizes?.[0] ?? "M",
                            p.colors?.[0] ?? "Black"
                          );
                          removeFromWishlist(p.id);
                          setItems((cur) =>
                            cur.filter((item) => String(item.id) !== String(p.id))
                          );
                        }}
                        className="label-xs bg-primary px-5 py-3 text-primary-foreground transition-opacity hover:opacity-85"
                      >
                        Move to Bag
                      </button>
                      <button
                        type="button"
                        aria-label={`Remove ${p.name}`}
                        onClick={() => {
                          removeFromWishlist(p.id);
                          setItems((cur) =>
                            cur.filter((item) => String(item.id) !== String(p.id))
                          );
                        }}
                        className="grid h-11 w-11 place-items-center border border-border transition-colors hover:border-primary"
                      >
                        <X width={16} height={16} />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </SiteLayout>
  );
}