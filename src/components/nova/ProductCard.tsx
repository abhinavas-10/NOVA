import { Link } from "@tanstack/react-router";
import { Heart, Plus } from "lucide-react";
import type { Product } from "@/types";
import { inr } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useShop } from "@/store/shop";
import { ColorDots, RatingStars } from "./primitives";

const COMING_SOON_IMAGE =
  "http://127.0.0.1:8000/media/products/coming-soon.png";

export function WishlistButton({
  productId,
  className,
}: {
  productId: string;
  className?: string;
}) {
  const { isWishlisted, toggleWishlist } = useShop();
  const active = isWishlisted(productId);

  return (
    <button
      type="button"
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
      aria-pressed={active}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist(productId);
      }}
      className={cn(
        "grid h-9 w-9 place-items-center border border-border/70 bg-background/70 backdrop-blur-sm transition-colors hover:border-primary",
        active && "border-primary text-primary",
        className,
      )}
    >
      <Heart
        width={15}
        height={15}
        className={cn(active && "fill-primary")}
      />
    </button>
  );
}

export function ProductCard({
  product,
  size = "md",
  showRating = false,
}: {
  product: Product;
  size?: "md" | "lg";
  showRating?: boolean;
}) {
  const { addToCart } = useShop();

  // Check whether the product actually has an image.
  const hasImage =
    Array.isArray(product.images) &&
    product.images.length > 0 &&
    Boolean(product.images[0]);

  const first = hasImage
    ? product.images[0]
    : COMING_SOON_IMAGE;

  const second = hasImage
    ? product.images[1] ?? product.images[0]
    : COMING_SOON_IMAGE;

  return (
    <article className="group relative flex h-full flex-col">
      <Link
        to="/product/$id"
        params={{ id: product.id }}
        className="relative block overflow-hidden bg-surface"
      >
        <div
          className={cn(
            "relative",
            size === "lg" ? "aspect-[4/5]" : "aspect-[4/5]",
          )}
        >
          {hasImage ? (
            <>
              <img
                src={first}
                alt={product.name}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03] group-hover:opacity-0"
              />

              <img
                src={second}
                alt=""
                aria-hidden
                loading="lazy"
                className="absolute inset-0 h-full w-full scale-[1.03] object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
              />
            </>
          ) : (
            <div className="absolute inset-0">
              <img
                src={COMING_SOON_IMAGE}
                alt={`${product.name} coming soon`}
                loading="lazy"
                className="h-full w-full object-cover"
              />

              <div className="absolute inset-x-0 bottom-0 bg-black/60 px-3 py-3 text-center backdrop-blur-sm">
                <span className="label-xs text-primary">
                  COMING SOON
                </span>
              </div>
            </div>
          )}
        </div>

        {product.discount > 0 && hasImage && (
          <span className="label-xs absolute left-0 top-0 bg-primary px-2 py-1 text-primary-foreground">
            −{product.discount}%
          </span>
        )}

        {product.isNew && hasImage && (
          <span className="label-xs absolute right-0 top-0 border-b border-l border-border bg-background/85 px-2 py-1 backdrop-blur-sm">
            New
          </span>
        )}

        {hasImage && (
          <>
            <WishlistButton
              productId={product.id}
              className="absolute bottom-3 right-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100 focus-visible:opacity-100"
            />

            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();

                addToCart(
                  product.id,
                  product.sizes[1] ?? product.sizes[0] ?? "M",
                  product.colors[0] ?? "Black",
                );
              }}
              className="label-xs absolute bottom-0 left-0 flex w-[calc(100%-3.5rem)] translate-y-full items-center justify-center gap-2 bg-primary py-3 text-primary-foreground transition-transform duration-300 group-hover:translate-y-0 focus-visible:translate-y-0"
            >
              <Plus width={13} height={13} />
              Quick Add
            </button>
          </>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-1.5 pt-4">
        <span className="label-xs text-muted-foreground">
          {product.brand}
        </span>

        <Link
          to="/product/$id"
          params={{ id: product.id }}
          className={cn(
            "font-semibold uppercase tracking-tight transition-colors hover:text-primary",
            size === "lg" ? "text-lg" : "text-sm",
          )}
        >
          {product.name}
        </Link>

        {showRating && (
          <RatingStars
            value={product.rating}
            count={product.reviewCount}
          />
        )}

        <div className="mt-auto flex items-center justify-between gap-3 pt-2">
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-semibold tabular-nums">
              {inr(product.price)}
            </span>

            <span className="text-xs text-muted-foreground line-through tabular-nums">
              {inr(product.originalPrice)}
            </span>

            <span className="text-xs font-semibold text-primary">
              {product.discount}% off
            </span>
          </div>

          <ColorDots colors={product.colors} />
        </div>
      </div>
    </article>
  );
}

export function ProductGrid({
  products,
  cols = 4,
  showRating,
}: {
  products: Product[];
  cols?: 3 | 4;
  showRating?: boolean;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-6",
        cols === 4
          ? "lg:grid-cols-4 md:grid-cols-3"
          : "lg:grid-cols-3 md:grid-cols-3",
      )}
    >
      {products.map((p) => (
        <ProductCard
          key={p.id}
          product={p}
          showRating={!!showRating}
        />
      ))}
    </div>
  );
}