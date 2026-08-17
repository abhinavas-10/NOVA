import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Search, X } from "lucide-react";
import { productService } from "@/services/api";
import { TRENDING_SEARCHES, categories } from "@/data/catalog";
import { inr } from "@/lib/format";
import { useShop } from "@/store/shop";

const RECENT_KEY = "nova.recent-searches";

export function SearchOverlay() {
  const { searchOpen, setSearchOpen } = useShop();
  const [query, setQuery] = useState("");
  const [recent, setRecent] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      setRecent(JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]") as string[]);
    } catch {
      setRecent([]);
    }
  }, [searchOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSearchOpen(false);
    };
    if (searchOpen) {
      document.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [searchOpen, setSearchOpen]);

  const results = useMemo(
    () => (query.trim().length > 1 ? productService.listSync({ query }).slice(0, 6) : []),
    [query],
  );

  const commit = (q: string) => {
    const next = [q, ...recent.filter((r) => r !== q)].slice(0, 6);
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
    setSearchOpen(false);
    setQuery("");
    void navigate({ to: "/search", search: { q } });
  };

  if (!searchOpen) return null;

  return (
    <div className="fixed inset-0 z-100 bg-ink/97 backdrop-blur-md">
      <div className="reveal mx-auto flex h-full max-w-5xl flex-col px-5 py-6 sm:px-8">
        <div className="flex items-center justify-between">
          <span className="label-xs text-primary">Search NØVA</span>
          <button
            type="button"
            onClick={() => setSearchOpen(false)}
            aria-label="Close search"
            className="grid h-10 w-10 place-items-center border border-border transition-colors hover:border-primary"
          >
            <X width={18} height={18} />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (query.trim()) commit(query.trim());
          }}
          className="mt-8 flex items-center gap-4 border-b border-border pb-4"
        >
          <Search width={22} height={22} className="text-muted-foreground" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, categories, drops"
            aria-label="Search products"
            className="w-full bg-transparent text-2xl font-semibold uppercase tracking-tight outline-none placeholder:text-muted-foreground/60 sm:text-4xl"
          />
        </form>

        <div className="no-scrollbar mt-8 flex-1 overflow-y-auto">
          {results.length > 0 ? (
            <ul className="divide-y divide-border border-y border-border">
              {results.map((p) => (
                <li key={p.id}>
                  <Link
                    to="/product/$id"
                    params={{ id: p.id }}
                    onClick={() => setSearchOpen(false)}
                    className="flex items-center gap-4 py-3 transition-colors hover:bg-secondary/40"
                  >
                    <img src={p.images[0]} alt="" className="h-16 w-14 object-cover" loading="lazy" />
                    <div className="min-w-0 flex-1">
                      <p className="label-xs text-muted-foreground">{p.brand}</p>
                      <p className="truncate text-sm font-semibold uppercase">{p.name}</p>
                    </div>
                    <span className="text-sm tabular-nums">{inr(p.price)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="grid gap-10 sm:grid-cols-3">
              <div>
                <p className="label-xs text-muted-foreground">Recent</p>
                <ul className="mt-4 space-y-2">
                  {(recent.length ? recent : ["No recent searches"]).map((r) => (
                    <li key={r}>
                      <button
                        type="button"
                        onClick={() => recent.length && commit(r)}
                        className="text-sm uppercase transition-colors hover:text-primary"
                      >
                        {r}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="label-xs text-muted-foreground">Trending</p>
                <ul className="mt-4 space-y-2">
                  {TRENDING_SEARCHES.map((t) => (
                    <li key={t}>
                      <button
                        type="button"
                        onClick={() => commit(t)}
                        className="text-sm uppercase transition-colors hover:text-primary"
                      >
                        {t}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="label-xs text-muted-foreground">Categories</p>
                <ul className="mt-4 space-y-2">
                  {categories.map((c) => (
                    <li key={c.id}>
                      <Link
                        to="/category/$category"
                        params={{ category: c.slug }}
                        onClick={() => setSearchOpen(false)}
                        className="text-sm uppercase transition-colors hover:text-primary"
                      >
                        {c.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}