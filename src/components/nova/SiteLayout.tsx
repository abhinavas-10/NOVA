import { useEffect, useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Heart,
  Home,
  Menu,
  Search,
  ShoppingBag,
  User,
  X,
  Grid2x2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useShop } from "@/store/shop";
import { SearchOverlay } from "./SearchOverlay";

const NAV = [
  { label: "Men", to: "/category/$category", param: "men" },
  { label: "Women", to: "/category/$category", param: "women" },
  { label: "Unisex", to: "/category/$category", param: "unisex" },
  { label: "Sneakers", to: "/category/$category", param: "sneakers" },
  { label: "Streetwear", to: "/category/$category", param: "streetwear" },
  { label: "Accessories", to: "/category/$category", param: "accessories" },
] as const;

function Announcement() {
  return (
    <div className="border-b border-border bg-ink">
      <p className="label-xs mx-auto max-w-[1600px] px-5 py-2.5 text-center text-muted-foreground sm:px-8">
        Free shipping on orders over ₹999 · <span className="text-primary">New season / 2026</span>
      </p>
    </div>
  );
}

function Wordmark({ className }: { className?: string }) {
  return (
    <Link
      to="/"
      className={cn("display text-2xl tracking-[-0.06em] sm:text-3xl", className)}
      aria-label="NØVA home"
    >
      NØVA
    </Link>
  );
}

export function Navbar() {
  const { cartCount, wishlist, user, setSearchOpen } = useShop();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => setMenuOpen(false), [pathname]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50">
      <Announcement />
      <nav
        aria-label="Primary"
        className={cn(
          "border-b border-border transition-colors duration-300",
          scrolled ? "bg-background/92 backdrop-blur-md" : "bg-background",
        )}
      >
        <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between gap-6 px-5 sm:px-8">
          <Wordmark />

          <ul className="hidden items-center gap-7 lg:flex">
            {NAV.map((n) => (
              <li key={n.param}>
                <Link
                  to={n.to}
                  params={{ category: n.param }}
                  className="label-xs relative py-2 text-foreground/80 transition-colors hover:text-primary"
                  activeProps={{ className: "text-primary" }}
                >
                  {n.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                to="/shop"
                search={{ sort: "new" }}
                className="label-xs text-primary transition-opacity hover:opacity-70"
              >
                New Drops
              </Link>
            </li>
          </ul>

          <div className="flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Open search"
              className="grid h-10 w-10 place-items-center transition-colors hover:text-primary"
            >
              <Search width={18} height={18} />
            </button>
            <Link
              to="/wishlist"
              aria-label="Wishlist"
              className="relative hidden h-10 w-10 place-items-center transition-colors hover:text-primary sm:grid"
            >
              <Heart width={18} height={18} />
              {wishlist.length > 0 && (
                <span className="absolute right-1 top-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
              )}
            </Link>
            <Link
              to={user ? "/account" : "/login"}
              aria-label="Account"
              className="hidden h-10 w-10 place-items-center transition-colors hover:text-primary sm:grid"
            >
              <User width={18} height={18} />
            </Link>
            <Link
              to="/cart"
              aria-label={`Cart, ${cartCount} items`}
              className="relative grid h-10 w-10 place-items-center transition-colors hover:text-primary"
            >
              <ShoppingBag width={18} height={18} />
              {cartCount > 0 && (
                <span className="absolute -right-0.5 top-1 grid h-4 min-w-4 place-items-center bg-primary px-1 text-[10px] font-bold text-primary-foreground tabular-nums">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Menu"
              aria-expanded={menuOpen}
              className="grid h-10 w-10 place-items-center transition-colors hover:text-primary lg:hidden"
            >
              {menuOpen ? <X width={20} height={20} /> : <Menu width={20} height={20} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="border-t border-border bg-background lg:hidden">
            <ul className="mx-auto max-w-[1600px] px-5 py-4 sm:px-8">
              {NAV.map((n) => (
                <li key={n.param} className="border-b border-border/60 last:border-0">
                  <Link
                    to={n.to}
                    params={{ category: n.param }}
                    className="display block py-3 text-2xl"
                  >
                    {n.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/shop" search={{ sort: "new" }} className="display block py-3 text-2xl text-primary">
                  New Drops
                </Link>
              </li>
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
}

function MobileNavigation() {
  const { cartCount } = useShop();
  const items = [
    { to: "/", label: "Home", icon: Home },
    { to: "/shop", label: "Shop", icon: Grid2x2 },
    { to: "/wishlist", label: "Wishlist", icon: Heart },
    { to: "/cart", label: "Cart", icon: ShoppingBag },
    { to: "/account", label: "Account", icon: User },
  ] as const;

  return (
    <nav
      aria-label="Mobile"
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur-md sm:hidden"
    >
      <ul className="grid grid-cols-5">
        {items.map(({ to, label, icon: Icon }) => (
          <li key={to}>
            <Link
              to={to}
              className="relative flex flex-col items-center gap-1 py-2.5 text-muted-foreground"
              activeProps={{ className: "text-primary" }}
              activeOptions={{ exact: to === "/" }}
            >
              <Icon width={18} height={18} />
              <span className="text-[10px] uppercase tracking-widest">{label}</span>
              {to === "/cart" && cartCount > 0 && (
                <span className="absolute right-4 top-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
              )}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

const FOOTER_SHOP = [
  ["Men", "men"],
  ["Women", "women"],
  ["Unisex", "unisex"],
  ["Streetwear", "streetwear"],
  ["Sneakers", "sneakers"],
  ["Accessories", "accessories"],
] as const;

export function Footer() {
  return (
    <footer className="border-t border-border bg-ink">
      <div className="mx-auto max-w-[1600px] px-5 py-16 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div>
            <p className="display text-5xl sm:text-6xl">NØVA</p>
            <p className="label-xs mt-3 text-primary">Wear your era.</p>
            <p className="mt-6 max-w-xs text-sm text-muted-foreground">
              Contemporary essentials produced in limited runs. Designed in Mumbai, worn everywhere.
            </p>
          </div>

          <div>
            <p className="label-xs text-muted-foreground">Shop</p>
            <ul className="mt-5 space-y-2.5 text-sm">
              {FOOTER_SHOP.map(([label, slug]) => (
                <li key={slug}>
                  <Link
                    to="/category/$category"
                    params={{ category: slug }}
                    className="transition-colors hover:text-primary"
                  >
                    {label}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/shop" search={{ sort: "new" }} className="transition-colors hover:text-primary">
                  New Drops
                </Link>
              </li>
              <li>
                <Link to="/shop" search={{ sort: "discount" }} className="transition-colors hover:text-primary">
                  Sale
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="label-xs text-muted-foreground">Help</p>
            <ul className="mt-5 space-y-2.5 text-sm text-foreground/80">
              {["Contact", "Shipping", "Returns", "FAQ", "Size Guide"].map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
          </div>

          <div>
            <p className="label-xs text-muted-foreground">Company</p>
            <ul className="mt-5 space-y-2.5 text-sm text-foreground/80">
              {["About NØVA", "Careers", "Privacy", "Terms"].map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
          </div>

          <div>
            <p className="label-xs text-muted-foreground">Social</p>
            <ul className="mt-5 space-y-2.5 text-sm text-foreground/80">
              {["Instagram", "Pinterest", "X"].map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-border pt-6 text-[11px] uppercase tracking-widest text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 NØVA Studio</span>
          <span>Made for those who define their own style</span>
        </div>
      </div>
    </footer>
  );
}

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 pb-16 sm:pb-0">{children}</main>
      <Footer />
      <MobileNavigation />
      <SearchOverlay />
    </div>
  );
}