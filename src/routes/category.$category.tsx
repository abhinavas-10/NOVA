import {
  createFileRoute,
  notFound,
} from "@tanstack/react-router";

import { SiteLayout } from "@/components/nova/SiteLayout";
import { ProductGrid } from "@/components/nova/ProductCard";
import { EmptyState } from "@/components/nova/primitives";

import { categories } from "@/data/catalog";
import { productService } from "@/services/api";

export const Route = createFileRoute(
  "/category/$category"
)({
  loader: async ({ params }) => {
    const category = categories.find(
      (c) => c.slug === params.category
    );

    if (!category) {
      throw notFound();
    }

    const products =
      await productService.byCategory(
        params.category
      );

    console.log(
      `[NØVA] ${params.category}:`,
      products
    );

    return {
      category,
      products,
    };
  },

  pendingComponent: CategoryPending,

  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          {
            title: "Category — NØVA",
          },
          {
            name: "robots",
            content: "noindex",
          },
        ],
      };
    }

    const { category } =
      loaderData;

    const title =
      `${category.name} — NØVA`;

    return {
      meta: [
        {
          title,
        },
        {
          name: "description",
          content: category.description,
        },
        {
          property: "og:title",
          content: title,
        },
        {
          property: "og:description",
          content: category.description,
        },
      ],
    };
  },

  component: CategoryPage,
});


function CategoryPending() {
  return (
    <SiteLayout>
      <div
        className="
          mx-auto
          max-w-[1600px]
          px-5
          py-12
          sm:px-8
          sm:py-16
        "
      >
        {/* CATEGORY HEADER SKELETON */}
        <header
          className="
            border-b
            border-border
            pb-8
          "
        >
          <div
            className="
              h-3
              w-20
              animate-pulse
              bg-muted
            "
          />

          <div
            className="
              mt-5
              h-16
              w-64
              animate-pulse
              bg-muted
              sm:h-24
              sm:w-96
            "
          />

          <div
            className="
              mt-5
              h-4
              w-full
              max-w-lg
              animate-pulse
              bg-muted
            "
          />

          <div
            className="
              mt-6
              h-3
              w-24
              animate-pulse
              bg-muted
            "
          />
        </header>

        {/* PRODUCT SKELETON */}
        <div
          className="
            mt-12
            grid
            grid-cols-2
            gap-x-4
            gap-y-12
            sm:gap-x-6
            md:grid-cols-3
            lg:grid-cols-4
          "
        >
          {Array.from({ length: 8 }).map(
            (_, index) => (
              <div
                key={index}
                className="flex flex-col"
              >
                {/* IMAGE */}
                <div
                  className="
                    aspect-[4/5]
                    w-full
                    animate-pulse
                    bg-muted
                  "
                />

                {/* BRAND */}
                <div
                  className="
                    mt-4
                    h-3
                    w-16
                    animate-pulse
                    bg-muted
                  "
                />

                {/* NAME */}
                <div
                  className="
                    mt-2
                    h-4
                    w-32
                    animate-pulse
                    bg-muted
                  "
                />

                {/* PRICE */}
                <div
                  className="
                    mt-3
                    h-4
                    w-20
                    animate-pulse
                    bg-muted
                  "
                />
              </div>
            )
          )}
        </div>
      </div>
    </SiteLayout>
  );
}


function CategoryPage() {
  const {
    category,
    products,
  } = Route.useLoaderData();

  return (
    <SiteLayout>
      <div
        className="
          mx-auto
          max-w-[1600px]
          px-5
          py-12
          sm:px-8
          sm:py-16
        "
      >
        <header
          className="
            border-b
            border-border
            pb-8
          "
        >
          <p
            className="
              label-xs
              text-primary
            "
          >
            Collection
          </p>

          <h1
            className="
              display
              mt-4
              text-6xl
              sm:text-8xl
            "
          >
            {category.name}
          </h1>

          <p
            className="
              mt-4
              max-w-lg
              text-sm
              text-muted-foreground
            "
          >
            {category.description}
          </p>

          <p
            className="
              label-xs
              mt-6
              text-muted-foreground
            "
          >
            {products.length} pieces
          </p>
        </header>

        <div className="mt-12">
          {products.length > 0 ? (
            <ProductGrid
              products={products}
            />
          ) : (
            <EmptyState
              title="Drop incoming."
              body="This category restocks soon."
              actionLabel="Shop all"
              actionTo="/shop"
            />
          )}
        </div>
      </div>
    </SiteLayout>
  );
}