import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, X } from "lucide-react";
import { SiteLayout } from "@/components/nova/SiteLayout";
import { EmptyState } from "@/components/nova/primitives";
import { useShop } from "@/store/shop";
import { couponService } from "@/services/api";
import { FREE_SHIPPING_THRESHOLD, inr } from "@/lib/format";
import { toast } from "sonner";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Bag — NØVA" },
      { name: "description", content: "Review the pieces in your NØVA bag and checkout." },
      { property: "og:title", content: "Your Bag — NØVA" },
      { property: "og:description", content: "Review your NØVA bag." },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { cartDetailed, subtotal, mrpTotal, updateQty, removeFromCart, toggleWishlist } = useShop();
  const [code, setCode] = useState("");
  const [couponValue, setCouponValue] = useState(0);

  const delivery = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : 99;
  const discount = mrpTotal - subtotal;
  const total = subtotal + delivery - couponValue;
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <SiteLayout>
      <div className="mx-auto max-w-[1600px] px-5 py-12 sm:px-8 sm:py-16">
        <header className="border-b border-border pb-8">
          <h1 className="display text-6xl sm:text-8xl">Your Bag</h1>
          <p className="mt-4 text-sm text-muted-foreground">{cartDetailed.length} items</p>
        </header>

        {cartDetailed.length === 0 ? (
          <div className="mt-12">
            <EmptyState
              title="Your bag is empty."
              body="Everything you add will be held here for 30 days."
              actionLabel="Shop New Drops"
              actionTo="/shop"
              icon={<ShoppingBag width={28} height={28} />}
            />
          </div>
        ) : (
          <div className="mt-10 grid gap-12 lg:grid-cols-[1.6fr_1fr]">
            <div>
              <div className="border border-border p-4">
                <p className="text-xs uppercase tracking-widest">
                  {remaining > 0 ? (
                    <>
                      <span className="text-primary tabular-nums">{inr(remaining)}</span> more to
                      unlock free shipping
                    </>
                  ) : (
                    <span className="text-primary">Free shipping unlocked</span>
                  )}
                </p>
                <div className="mt-3 h-1 w-full bg-secondary">
                  <div className="h-full bg-primary transition-[width] duration-500" style={{ width: `${progress}%` }} />
                </div>
              </div>

              <ul className="mt-8 divide-y divide-border border-y border-border">
                {cartDetailed.map(({ item, product }) => (
                  <li key={item.id} className="flex gap-5 py-6">
                    <Link to="/product/$id" params={{ id: product.id }} className="shrink-0">
                      <img src={product.images[0]} alt={product.name} loading="lazy" className="h-36 w-28 object-cover" />
                    </Link>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="label-xs text-muted-foreground">{product.brand}</p>
                          <Link
                            to="/product/$id"
                            params={{ id: product.id }}
                            className="text-sm font-semibold uppercase hover:text-primary"
                          >
                            {product.name}
                          </Link>
                          <p className="label-xs mt-2 text-muted-foreground">
                            Size {item.size} · {item.color}
                          </p>
                        </div>
                        <button
                          type="button"
                          aria-label="Remove item"
                          onClick={() => removeFromCart(item.id)}
                          className="text-muted-foreground transition-colors hover:text-primary"
                        >
                          <X width={16} height={16} />
                        </button>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center border border-border">
                          <button
                            type="button"
                            aria-label="Decrease quantity"
                            onClick={() => updateQty(item.id, item.quantity - 1)}
                            className="grid h-9 w-9 place-items-center hover:text-primary"
                          >
                            <Minus width={13} height={13} />
                          </button>
                          <span className="w-8 text-center text-sm tabular-nums">{item.quantity}</span>
                          <button
                            type="button"
                            aria-label="Increase quantity"
                            onClick={() => updateQty(item.id, item.quantity + 1)}
                            className="grid h-9 w-9 place-items-center hover:text-primary"
                          >
                            <Plus width={13} height={13} />
                          </button>
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className="font-semibold tabular-nums">
                            {inr(product.price * item.quantity)}
                          </span>
                          <span className="text-xs text-muted-foreground line-through tabular-nums">
                            {inr(product.originalPrice * item.quantity)}
                          </span>
                          <span className="text-xs text-primary">{product.discount}% off</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          toggleWishlist(product.id);
                          removeFromCart(item.id);
                        }}
                        className="label-xs mt-4 border-b border-border pb-0.5 text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                      >
                        Move to wishlist
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <aside className="h-fit border border-border p-6 lg:sticky lg:top-32">
              <h2 className="label-xs">Price Summary</h2>
              <dl className="mt-6 space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Total MRP</dt>
                  <dd className="tabular-nums">{inr(mrpTotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Discount</dt>
                  <dd className="text-primary tabular-nums">−{inr(discount)}</dd>
                </div>
                {couponValue > 0 && (
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Coupon</dt>
                    <dd className="text-primary tabular-nums">−{inr(couponValue)}</dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Delivery</dt>
                  <dd className="tabular-nums">{delivery === 0 ? "Free" : inr(delivery)}</dd>
                </div>
                <div className="flex justify-between border-t border-border pt-4 text-base font-semibold">
                  <dt>Total</dt>
                  <dd className="tabular-nums">{inr(total)}</dd>
                </div>
              </dl>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const res = couponService.validate(code, subtotal);
                  if (!res.ok) {
                    setCouponValue(0);
                    toast.error(res.message);
                    return;
                  }
                  setCouponValue(res.amount);
                  toast.success(`${res.coupon.code} applied`);
                }}
                className="mt-6 flex gap-2"
              >
                <label htmlFor="coupon" className="sr-only">
                  Coupon code
                </label>
                <input
                  id="coupon"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Coupon code"
                  className="w-full border border-border bg-transparent px-3 py-2.5 text-sm uppercase outline-none focus:border-primary"
                />
                <button type="submit" className="label-xs border border-border px-4 hover:border-primary hover:text-primary">
                  Apply
                </button>
              </form>
              <p className="mt-2 text-[11px] uppercase tracking-widest text-muted-foreground">
                Try NOVA10 or FIRSTERA
              </p>

              <Link
                to="/checkout"
                className="label-xs mt-8 block bg-primary py-4 text-center text-primary-foreground transition-opacity hover:opacity-85"
              >
                Proceed to Checkout
              </Link>
            </aside>
          </div>
        )}
      </div>
    </SiteLayout>
  );
}