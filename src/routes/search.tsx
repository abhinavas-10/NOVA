import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/nova/SiteLayout";
import { ProductGrid } from "@/components/nova/ProductCard";
import { EmptyState } from "@/components/nova/primitives";
import { productService } from "@/services/api";
import { TRENDING_SEARCHES } from "@/data/catalog";

interface SearchParams {
  q?: string;
}

export const Route = createFileRoute("/search")({
  validateSearch: (search: Record<string, unknown>): SearchParams =>
    typeof search["q"] === "string" ? { q: search["q"] } : {},
  head: () => ({
    meta: [
      { title: "Search — NØVA" },
      { name: "description", content: "Search the NØVA collection by product, category or drop." },
      { property: "og:title", content: "Search — NØVA" },
      { property: "og:description", content: "Find your next piece." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SearchPage,
});

function SearchPage() {
  const { q } = Route.useSearch();
  const results = q ? productService.listSync({ query: q }) : [];

  return (
    <SiteLayout>
      <div className="mx-auto max-w-[1600px] px-5 py-12 sm:px-8 sm:py-16">
        <header className="border-b border-border pb-8">
          <p className="label-xs text-primary">Results</p>
          <h1 className="display mt-4 text-5xl sm:text-7xl">{q ? `"${q}"` : "Search"}</h1>
          <p className="mt-4 text-sm text-muted-foreground">{results.length} products found</p>
        </header>

        <div className="mt-12">
          {results.length ? (
            <ProductGrid products={results} />
          ) : (
            <div>
              <EmptyState
                title="No matches."
                body="Try one of the searches everyone else is running."
                actionLabel="Shop all"
                actionTo="/shop"
              />
              <ul className="mt-8 flex flex-wrap justify-center gap-2">
                {TRENDING_SEARCHES.map((t) => (
                  <li key={t}>
                    <Link
                      to="/search"
                      search={{ q: t }}
                      className="label-xs border border-border px-4 py-2 transition-colors hover:border-primary hover:text-primary"
                    >
                      {t}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </SiteLayout>
  );
}