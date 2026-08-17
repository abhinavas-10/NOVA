import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { LayoutGrid, List, SlidersHorizontal, X } from "lucide-react";
import { SiteLayout } from "@/components/nova/SiteLayout";
import { ProductCard } from "@/components/nova/ProductCard";
import { EmptyState } from "@/components/nova/primitives";
import { COLORS, SIZES, categories } from "@/data/catalog";
import { productService } from "@/services/api";
import type { CategorySlug, Product, ProductFilters } from "@/types";
import { inr } from "@/lib/format";
import { cn } from "@/lib/utils";

type Sort = NonNullable<ProductFilters["sort"]>;

interface ShopSearch {
  sort?: Sort;
  q?: string;
  category?: CategorySlug;
}

const SORTS: { value: Sort; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "new", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
  { value: "discount", label: "Biggest Discount" },
];

export const Route = createFileRoute("/shop")({
  validateSearch: (search: Record<string, unknown>): ShopSearch => {
    const out: ShopSearch = {};
    if (typeof search["sort"] === "string") out.sort = search["sort"] as Sort;
    if (typeof search["q"] === "string") out.q = search["q"];
    if (typeof search["category"] === "string") out.category = search["category"] as CategorySlug;
    return out;
  },
  head: () => ({
    meta: [
      { title: "Shop All — NØVA" },
      {
        name: "description",
        content:
          "Browse the full NØVA collection: outerwear, hoodies, tees, denim, sneakers and accessories. Filter by size, colour, price and rating.",
      },
      { property: "og:title", content: "Shop All — NØVA" },
      { property: "og:description", content: "Discover the latest NØVA collection." },
    ],
  }),
  component: ShopPage,
});

function Toggle({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "border px-3 py-1.5 text-[11px] uppercase tracking-widest transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border text-foreground/80 hover:border-primary hover:text-primary",
      )}
    >
      {label}
    </button>
  );
}

function FilterPanel({
  state,
  set,
  reset,
}: {
  state: ProductFilters;
  set: (f: Partial<ProductFilters>) => void;
  reset: () => void;
}) {
  const toggleIn = (key: "categories" | "sizes" | "colors", value: string) => {
    const current = (state[key] as string[] | undefined) ?? [];
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    set({ [key]: next } as Partial<ProductFilters>);
  };

  return (
    <div className="space-y-9">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <span className="label-xs">Filters</span>
        <button type="button" onClick={reset} className="text-[11px] uppercase tracking-widest text-primary">
          Clear
        </button>
      </div>

      <fieldset>
        <legend className="label-xs text-muted-foreground">Category</legend>
        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map((c) => (
            <Toggle
              key={c.slug}
              label={c.name}
              active={state.categories?.includes(c.slug) ?? false}
              onClick={() => toggleIn("categories", c.slug)}
            />
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="label-xs text-muted-foreground">Size</legend>
        <div className="mt-4 flex flex-wrap gap-2">
          {SIZES.map((s) => (
            <Toggle
              key={s}
              label={s}
              active={state.sizes?.includes(s) ?? false}
              onClick={() => toggleIn("sizes", s)}
            />
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="label-xs text-muted-foreground">Colour</legend>
        <div className="mt-4 flex flex-wrap gap-2">
          {COLORS.map((c) => (
            <Toggle
              key={c}
              label={c}
              active={state.colors?.includes(c) ?? false}
              onClick={() => toggleIn("colors", c)}
            />
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="label-xs text-muted-foreground">Price</legend>
        <p className="mt-4 text-xs text-muted-foreground">
          Up to <span className="text-foreground tabular-nums">{inr(state.maxPrice ?? 16000)}</span>
        </p>
        <input
          type="range"
          min={999}
          max={16000}
          step={500}
          value={state.maxPrice ?? 16000}
          onChange={(e) => set({ maxPrice: Number(e.target.value) })}
          aria-label="Maximum price"
          className="mt-3 w-full accent-[oklch(0.9_0.22_128)]"
        />
      </fieldset>

      <fieldset>
        <legend className="label-xs text-muted-foreground">Rating</legend>
        <div className="mt-4 flex flex-wrap gap-2">
          {[4.5, 4, 3.5].map((r) => (
            <Toggle
              key={r}
              label={`${r}+`}
              active={state.minRating === r}
              onClick={() => set({ minRating: state.minRating === r ? 0 : r })}
            />
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="label-xs text-muted-foreground">Discount</legend>
        <div className="mt-4 flex flex-wrap gap-2">
          {[10, 20, 30].map((d) => (
            <Toggle
              key={d}
              label={`${d}%+`}
              active={state.minDiscount === d}
              onClick={() => set({ minDiscount: state.minDiscount === d ? 0 : d })}
            />
          ))}
        </div>
      </fieldset>
    </div>
  );
}
function ShopPage() {
  const search = Route.useSearch();

  const [filters, setFilters] = useState<ProductFilters>({
    categories: search.category ? [search.category] : [],
    sizes: [],
    colors: [],
    maxPrice: 16000,
    minRating: 0,
    minDiscount: 0,
  });

  const [query, setQuery] = useState(search.q ?? "");
  const [sort, setSort] = useState<Sort>(search.sort ?? "featured");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [drawer, setDrawer] = useState(false);

  const [results, setResults] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);

  useEffect(() => {
    setProductsLoading(true);

    productService
      .list({
        ...filters,
        query,
        sort,
      })
      .then((products) => {
        setResults(Array.isArray(products) ? products : []);
      })
      .catch((error) => {
        console.error("Failed to load shop products:", error);
        setResults([]);
      })
      .finally(() => {
        setProductsLoading(false);
      });
  }, [filters, query, sort]);

  const set = (f: Partial<ProductFilters>) =>
    setFilters((s) => ({ ...s, ...f }));

  const reset = () =>
    setFilters({
      categories: [],
      sizes: [],
      colors: [],
      maxPrice: 16000,
      minRating: 0,
      minDiscount: 0,
    });

  return (
    <SiteLayout>
      <div className="mx-auto max-w-[1600px] px-5 py-12 sm:px-8 sm:py-16">
        <header className="border-b border-border pb-8">
          <h1 className="display text-6xl sm:text-8xl">Shop All</h1>
          <p className="mt-4 text-sm text-muted-foreground">
            Discover the latest NØVA collection.
          </p>
        </header>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search the collection"
            aria-label="Search the collection"
            className="min-w-0 flex-1 border border-border bg-transparent px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
          />
          <label className="sr-only" htmlFor="sort">
            Sort
          </label>
          <select
            id="sort"
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="border border-border bg-background px-4 py-3 text-[11px] uppercase tracking-widest outline-none focus:border-primary"
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setDrawer(true)}
            className="label-xs flex items-center gap-2 border border-border px-4 py-3 lg:hidden"
          >
            <SlidersHorizontal width={14} height={14} /> Filter
          </button>
          <div className="hidden border border-border lg:flex">
            <button
              type="button"
              aria-label="Grid view"
              onClick={() => setView("grid")}
              className={cn("grid h-11 w-11 place-items-center", view === "grid" && "bg-primary text-primary-foreground")}
            >
              <LayoutGrid width={15} height={15} />
            </button>
            <button
              type="button"
              aria-label="List view"
              onClick={() => setView("list")}
              className={cn("grid h-11 w-11 place-items-center", view === "list" && "bg-primary text-primary-foreground")}
            >
              <List width={15} height={15} />
            </button>
          </div>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[240px_1fr]">
          <aside className="hidden lg:block">
            <FilterPanel state={filters} set={set} reset={reset} />
          </aside>

          <div>
          <p className="label-xs mb-6 text-muted-foreground">
  {productsLoading ? "Loading products..." : `${results.length} products`}
</p>
           {productsLoading ? (
  <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
    {[1, 2, 3, 4].map((item) => (
      <div
        key={item}
        className="aspect-[4/5] animate-pulse bg-surface"
      />
    ))}
  </div>
) : results.length === 0 ?  (
              <EmptyState
                title="Nothing matches."
                body="Try widening your filters or clearing the search."
                actionLabel="Clear filters"
                actionTo="/shop"
              />
            ) : view === "grid" ? (
              <div className="grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-6 md:grid-cols-3 xl:grid-cols-4">
                {results.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2">
                {results.map((p) => (
                  <ProductCard key={p.id} product={p} showRating />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {drawer && (
        <div className="fixed inset-0 z-100 flex lg:hidden">
          <button
            type="button"
            aria-label="Close filters"
            className="flex-1 bg-ink/70"
            onClick={() => setDrawer(false)}
          />
          <div className="h-full w-[85%] max-w-sm overflow-y-auto border-l border-border bg-background p-6">
            <div className="mb-6 flex items-center justify-between">
              <span className="display text-2xl">Filters</span>
              <button type="button" onClick={() => setDrawer(false)} aria-label="Close">
                <X width={20} height={20} />
              </button>
            </div>
            <FilterPanel state={filters} set={set} reset={reset} />
            <button
              type="button"
              onClick={() => setDrawer(false)}
              className="label-xs mt-10 w-full bg-primary py-4 text-primary-foreground"
            >
              Show {results.length} products
            </button>
          </div>
        </div>
      )}
    </SiteLayout>
  );
}