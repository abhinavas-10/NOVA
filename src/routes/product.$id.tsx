import { useEffect, useState } from "react";
import {
  createFileRoute,
  Link,
  notFound,
  useNavigate,
} from "@tanstack/react-router";

import {
  ChevronDown,
  Heart,
  Maximize2,
  Minus,
  Plus,
  Truck,
  X,
} from "lucide-react";

import { SiteLayout } from "@/components/nova/SiteLayout";
import { ProductGrid } from "@/components/nova/ProductCard";
import {
  ColorDots,
  RatingStars,
} from "@/components/nova/primitives";

import {
  productService,
  reviewService,
} from "@/services/api";

import { inr } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useShop } from "@/store/shop";
import { toast } from "sonner";


// =====================================================
// ROUTE
// =====================================================

export const Route = createFileRoute(
  "/product/$id"
)({

  // ===================================================
  // LOAD PRODUCT
  // ===================================================

  loader: async ({ params }) => {

    const product =
      await productService.get(
        params.id
      );

    if (!product) {
      throw notFound();
    }


    // Load related products
    const related =
      await productService.related(
        product.id,
        4
      );


    // Load reviews
    let reviews: any[] = [];

    try {

      reviews =
        await reviewService.forProduct(
          product.id
        );

    } catch (error) {

      console.error(
        "Failed to load reviews:",
        error
      );

      reviews = [];

    }


    return {
      product,
      related,
      reviews,
    };
  },


  // ===================================================
  // SEO
  // ===================================================

  head: ({ loaderData }) => {

    if (!loaderData) {

      return {
        meta: [
          {
            title:
              "Unavailable — NØVA",
          },
          {
            name: "robots",
            content: "noindex",
          },
        ],
      };

    }


    const product =
      loaderData.product;


    const title =
      `${product.name} — ${product.brand} | NØVA`;


    const description =
      `${product.name} at ${inr(
        product.price
      )}. Free shipping over ₹999.`;


    return {

      meta: [

        {
          title,
        },

        {
          name: "description",
          content: description,
        },

        {
          property: "og:title",
          content: title,
        },

        {
          property: "og:description",
          content: description,
        },

        {
          property: "og:type",
          content: "product",
        },

      ],

    };
  },


  component: ProductPage,
});


// =====================================================
// ACCORDION
// =====================================================

function Accordion({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {

  const [open, setOpen] =
    useState(false);


  return (

    <div className="border-b border-border">

      <button
        type="button"
        onClick={() =>
          setOpen(
            (value) => !value
          )
        }
        aria-expanded={open}
        className="
          label-xs
          flex
          w-full
          items-center
          justify-between
          py-4
          text-left
        "
      >

        {title}

        <ChevronDown
          width={16}
          height={16}
          className={cn(
            "transition-transform",
            open &&
              "rotate-180 text-primary"
          )}
        />

      </button>


      {open && (

        <div
          className="
            pb-5
            text-sm
            leading-relaxed
            text-muted-foreground
          "
        >
          {children}
        </div>

      )}

    </div>

  );
}


// =====================================================
// PRODUCT PAGE
// =====================================================

function ProductPage() {

  const {
    product,
    related,
    reviews,
  } =
    Route.useLoaderData();


  const {
    addToCart,
    toggleWishlist,
    isWishlisted,
    markViewed,
  } = useShop();


  const navigate =
    useNavigate();


  const [active, setActive] =
    useState(0);


  const [size, setSize] =
    useState(
      product.sizes[1] ??
      product.sizes[0] ??
      "M"
    );


  const [color, setColor] =
    useState(
      product.colors[0] ??
      "Black"
    );


  const [qty, setQty] =
    useState(1);


  const [zoom, setZoom] =
    useState(false);


  const [pincode, setPincode] =
    useState("");


  const [delivery, setDelivery] =
    useState<string | null>(
      null
    );


  const wished =
    isWishlisted(
      product.id
    );


  // ===================================================
  // PRODUCT CHANGE
  // ===================================================

  useEffect(() => {

    setActive(0);

    setSize(
      product.sizes[1] ??
      product.sizes[0] ??
      "M"
    );

    setColor(
      product.colors[0] ??
      "Black"
    );

    setQty(1);

    markViewed(
      product.id
    );

  }, [
    product.id,
    product.sizes,
    product.colors,
    markViewed,
  ]);


  // ===================================================
  // SAFE IMAGES
  // ===================================================

  const images =
    product.images?.length
      ? product.images
      : [
          product.image ??
          "",
        ];


  const activeImage =
    images[active] ??
    images[0] ??
    "";


  return (

    <SiteLayout>

      <div
        className="
          mx-auto
          max-w-[1600px]
          px-5
          py-8
          sm:px-8
          sm:py-12
        "
      >

        {/* ==========================================
            BREADCRUMB
        ========================================== */}

        <nav
          aria-label="Breadcrumb"
          className="
            label-xs
            text-muted-foreground
          "
        >

          <Link
            to="/shop"
            className="hover:text-primary"
          >
            Shop
          </Link>

          <span className="px-2">
            /
          </span>

          <Link
            to="/category/$category"
            params={{
              category:
                product.category,
            }}
            className="hover:text-primary"
          >
            {product.category}
          </Link>

        </nav>


        {/* ==========================================
            PRODUCT
        ========================================== */}

        <div
          className="
            mt-8
            grid
            gap-12
            lg:grid-cols-[1.15fr_1fr]
          "
        >

          {/* ========================================
              IMAGE GALLERY
          ======================================== */}

          <div
            className="
              flex
              flex-col-reverse
              gap-4
              sm:flex-row
            "
          >

            {/* THUMBNAILS */}

            <div
              className="
                flex
                gap-3
                sm:flex-col
              "
            >

              {images.map(
                (img, i) => (

                  <button
                    key={`${img}-${i}`}
                    type="button"
                    onClick={() =>
                      setActive(i)
                    }
                    aria-label={`View image ${
                      i + 1
                    }`}
                    className={cn(
                      `
                        h-20
                        w-16
                        shrink-0
                        overflow-hidden
                        border
                        transition-colors
                        sm:h-24
                        sm:w-20
                      `,
                      i === active
                        ? "border-primary"
                        : "border-border"
                    )}
                  >

                    {img ? (

                      <img
                        src={img}
                        alt=""
                        className="
                          h-full
                          w-full
                          object-cover
                        "
                        loading="lazy"
                      />

                    ) : (

                      <div
                        className="
                          h-full
                          w-full
                          bg-surface
                        "
                      />

                    )}

                  </button>

                )
              )}

            </div>


            {/* MAIN IMAGE */}

            <div
              className="
                group
                relative
                flex-1
                overflow-hidden
                bg-surface
              "
            >

              {activeImage ? (

                <img
                  src={activeImage}
                  alt={product.name}
                  className="
                    aspect-[4/5]
                    w-full
                    object-cover
                    transition-transform
                    duration-700
                    group-hover:scale-105
                  "
                />

              ) : (

                <div
                  className="
                    aspect-[4/5]
                    w-full
                    bg-surface
                  "
                />

              )}


              {/* ZOOM */}

              <button
                type="button"
                onClick={() =>
                  setZoom(true)
                }
                aria-label="Open fullscreen viewer"
                className="
                  absolute
                  right-4
                  top-4
                  grid
                  h-10
                  w-10
                  place-items-center
                  border
                  border-border
                  bg-background/70
                  backdrop-blur-sm
                  transition-colors
                  hover:border-primary
                "
              >

                <Maximize2
                  width={16}
                  height={16}
                />

              </button>

            </div>

          </div>


          {/* ========================================
              PRODUCT INFORMATION
          ======================================== */}

          <div>

            <p
              className="
                label-xs
                text-muted-foreground
              "
            >
              {product.brand}
            </p>


            <h1
              className="
                display
                mt-3
                text-4xl
                sm:text-5xl
              "
            >
              {product.name}
            </h1>


            {/* RATING */}

            <div
              className="
                mt-4
                flex
                items-center
                gap-4
              "
            >

              <RatingStars
                value={
                  product.rating
                }
                count={
                  product.reviewCount
                }
                size={14}
              />

              <span
                className="
                  text-xs
                  text-muted-foreground
                "
              >
                {reviews.length} written reviews
              </span>

            </div>


            {/* PRICE */}

            <div
              className="
                mt-6
                flex
                items-baseline
                gap-3
              "
            >

              <span
                className="
                  text-3xl
                  font-bold
                  tabular-nums
                "
              >
                {inr(product.price)}
              </span>


              {product.originalPrice >
                product.price && (

                <span
                  className="
                    text-sm
                    text-muted-foreground
                    line-through
                    tabular-nums
                  "
                >
                  {inr(
                    product.originalPrice
                  )}
                </span>

              )}


              {product.discount > 0 && (

                <span
                  className="
                    label-xs
                    text-primary
                  "
                >
                  {product.discount}% off
                </span>

              )}

            </div>


            <p
              className="
                mt-1
                text-[11px]
                uppercase
                tracking-widest
                text-muted-foreground
              "
            >
              Inclusive of all taxes
            </p>


            {/* ======================================
                COLOR
            ====================================== */}

            <div className="mt-9">

              <div
                className="
                  flex
                  items-center
                  justify-between
                "
              >

                <span
                  className="
                    label-xs
                    text-muted-foreground
                  "
                >
                  Colour — {color}
                </span>

                <ColorDots
                  colors={
                    product.colors
                  }
                />

              </div>


              <div
                className="
                  mt-3
                  flex
                  flex-wrap
                  gap-2
                "
              >

                {product.colors.map(
                  (c) => (

                    <button
                      key={c}
                      type="button"
                      onClick={() =>
                        setColor(c)
                      }
                      className={cn(
                        `
                          border
                          px-4
                          py-2
                          text-[11px]
                          uppercase
                          tracking-widest
                          transition-colors
                        `,
                        c === color
                          ? "border-primary text-primary"
                          : "border-border hover:border-foreground/60"
                      )}
                    >
                      {c}
                    </button>

                  )
                )}

              </div>

            </div>


            {/* ======================================
                SIZE
            ====================================== */}

            <div className="mt-8">

              <div
                className="
                  flex
                  items-center
                  justify-between
                "
              >

                <span
                  className="
                    label-xs
                    text-muted-foreground
                  "
                >
                  Size
                </span>


                <button
                  type="button"
                  className="
                    text-[11px]
                    uppercase
                    tracking-widest
                    text-primary
                  "
                >
                  Size Guide
                </button>

              </div>


              <div
                className="
                  mt-3
                  flex
                  flex-wrap
                  gap-2
                "
              >

                {product.sizes.length > 0 ? (

                  product.sizes.map(
                    (s) => (

                      <button
                        key={s}
                        type="button"
                        onClick={() =>
                          setSize(s)
                        }
                        className={cn(
                          `
                            min-w-14
                            border
                            px-4
                            py-3
                            text-[11px]
                            uppercase
                            tracking-widest
                            transition-colors
                          `,
                          s === size
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border hover:border-foreground/60"
                        )}
                      >
                        {s}
                      </button>

                    )
                  )

                ) : (

                  <span
                    className="
                      text-sm
                      text-muted-foreground
                    "
                  >
                    One size
                  </span>

                )}

              </div>

            </div>


            {/* ======================================
                QUANTITY
            ====================================== */}

            <div
              className="
                mt-8
                flex
                items-center
                gap-6
              "
            >

              <div
                className="
                  flex
                  items-center
                  border
                  border-border
                "
              >

                <button
                  type="button"
                  aria-label="Decrease quantity"
                  onClick={() =>
                    setQty(
                      (q) =>
                        Math.max(
                          1,
                          q - 1
                        )
                    )
                  }
                  className="
                    grid
                    h-11
                    w-11
                    place-items-center
                    hover:text-primary
                  "
                >
                  <Minus
                    width={14}
                    height={14}
                  />
                </button>


                <span
                  className="
                    w-10
                    text-center
                    text-sm
                    tabular-nums
                  "
                >
                  {qty}
                </span>


                <button
                  type="button"
                  aria-label="Increase quantity"
                  onClick={() =>
                    setQty(
                      (q) =>
                        Math.min(
                          10,
                          q + 1
                        )
                    )
                  }
                  className="
                    grid
                    h-11
                    w-11
                    place-items-center
                    hover:text-primary
                  "
                >
                  <Plus
                    width={14}
                    height={14}
                  />
                </button>

              </div>


              <p
                className={cn(
                  `
                    text-xs
                    uppercase
                    tracking-widest
                  `,
                  product.stock < 6
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                {product.stock < 6
                  ? `Only ${product.stock} left`
                  : "In stock"}
              </p>

            </div>


            {/* ======================================
                CART BUTTONS
            ====================================== */}

            <div
              className="
                mt-8
                grid
                gap-3
                sm:grid-cols-2
              "
            >

              <button
                type="button"
                onClick={() => {

                  addToCart(
                    product.id,
                    size,
                    color,
                    qty
                  );

                  toast.success(
                    "Added to bag"
                  );

                }}
                className="
                  label-xs
                  bg-primary
                  py-4
                  text-primary-foreground
                  transition-opacity
                  hover:opacity-85
                "
              >
                Add to Bag
              </button>


              <button
                type="button"
                onClick={() => {

                  addToCart(
                    product.id,
                    size,
                    color,
                    qty
                  );

                  void navigate({
                    to: "/checkout",
                  });

                }}
                className="
                  label-xs
                  border
                  border-foreground/40
                  py-4
                  transition-colors
                  hover:border-primary
                  hover:text-primary
                "
              >
                Buy Now
              </button>


              <button
                type="button"
                onClick={() =>
                  toggleWishlist(
                    product.id
                  )
                }
                className={cn(
                  `
                    label-xs
                    flex
                    items-center
                    justify-center
                    gap-2
                    border
                    py-4
                    transition-colors
                    sm:col-span-2
                  `,
                  wished
                    ? "border-primary text-primary"
                    : "border-border hover:border-foreground/60"
                )}
              >

                <Heart
                  width={14}
                  height={14}
                  className={cn(
                    wished &&
                      "fill-primary"
                  )}
                />

                {wished
                  ? "Saved to Wishlist"
                  : "Add to Wishlist"}

              </button>

            </div>


            {/* ======================================
                DELIVERY
            ====================================== */}

            <div
              className="
                mt-8
                border
                border-border
                p-5
              "
            >

              <div
                className="
                  flex
                  items-center
                  gap-2
                "
              >

                <Truck
                  width={15}
                  height={15}
                  className="text-primary"
                />

                <span className="label-xs">
                  Delivery
                </span>

              </div>


              <form
                onSubmit={(e) => {

                  e.preventDefault();


                  if (
                    !/^\d{6}$/.test(
                      pincode
                    )
                  ) {

                    toast.error(
                      "Enter a valid 6-digit pincode"
                    );

                    return;
                  }


                  setDelivery(
                    "Delivered in 3–5 business days. Free returns within 14 days."
                  );

                }}
                className="
                  mt-3
                  flex
                  gap-2
                "
              >

                <label
                  htmlFor="pincode"
                  className="sr-only"
                >
                  Pincode
                </label>


                <input
                  id="pincode"
                  value={pincode}
                  onChange={(e) =>
                    setPincode(
                      e.target.value
                    )
                  }
                  placeholder="Enter pincode to check delivery"
                  className="
                    w-full
                    border
                    border-border
                    bg-transparent
                    px-3
                    py-2.5
                    text-sm
                    outline-none
                    focus:border-primary
                  "
                />


                <button
                  type="submit"
                  className="
                    label-xs
                    border
                    border-border
                    px-4
                    hover:border-primary
                    hover:text-primary
                  "
                >
                  Check
                </button>

              </form>


              {delivery && (

                <p
                  className="
                    mt-3
                    text-xs
                    text-muted-foreground
                  "
                >
                  {delivery}
                </p>

              )}

            </div>


            {/* ======================================
                DETAILS
            ====================================== */}

            <div className="mt-10">

              <Accordion
                title="Product Details"
              >
                {product.description ||
                  "Premium NØVA product."}
              </Accordion>


              <Accordion
                title="Material & Care"
              >

                {product.material ||
                  "Premium fabric."}

                <br />

                {product.care ||
                  "Follow the care label instructions."}

              </Accordion>


              <Accordion
                title="Size & Fit"
              >

                {product.fit ||
                  "Regular NØVA fit."}

              </Accordion>


              <Accordion
                title="Shipping & Returns"
              >

                Free shipping on orders
                over ₹999. Dispatched within
                24 hours. 14-day returns on
                unworn pieces with tags
                attached.

              </Accordion>


              <Accordion
                title={`Reviews (${reviews.length})`}
              >

                {reviews.length === 0 ? (

                  <p>
                    No written reviews yet
                    for this piece.
                  </p>

                ) : (

                  <ul className="space-y-5">

                    {reviews.map(
                      (review: any) => (

                        <li
                          key={
                            review.id
                          }
                        >

                          <div
                            className="
                              flex
                              items-center
                              gap-3
                            "
                          >

                            <RatingStars
                              value={
                                review.rating
                              }
                            />

                            <span
                              className="
                                text-xs
                                uppercase
                                tracking-widest
                                text-foreground
                              "
                            >
                              {
                                review.customer
                              }
                            </span>

                          </div>


                          <p
                            className="
                              mt-2
                              text-sm
                              font-semibold
                              uppercase
                              text-foreground
                            "
                          >
                            {
                              review.title
                            }
                          </p>


                          <p className="mt-1">
                            {
                              review.body
                            }
                          </p>

                        </li>

                      )
                    )}

                  </ul>

                )}

              </Accordion>

            </div>

          </div>

        </div>


        {/* ==========================================
            RELATED PRODUCTS
        ========================================== */}

        {related.length > 0 && (

          <section className="mt-24">

            <h2
              className="
                display
                border-b
                border-border
                pb-5
                text-3xl
                sm:text-5xl
              "
            >
              You May Also Like
            </h2>


            <div className="mt-10">

              <ProductGrid
                products={related}
              />

            </div>

          </section>

        )}

      </div>


      {/* ============================================
          FULLSCREEN IMAGE
      ============================================ */}

      {zoom && (

        <div
          className="
            fixed
            inset-0
            z-100
            grid
            place-items-center
            bg-ink/95
            p-6
          "
        >

          <button
            type="button"
            onClick={() =>
              setZoom(false)
            }
            aria-label="Close viewer"
            className="
              absolute
              right-6
              top-6
              grid
              h-11
              w-11
              place-items-center
              border
              border-border
            "
          >

            <X
              width={20}
              height={20}
            />

          </button>


          {activeImage && (

            <img
              src={activeImage}
              alt={product.name}
              className="
                max-h-[88vh]
                w-auto
                max-w-full
                object-contain
              "
            />

          )}

        </div>

      )}

    </SiteLayout>

  );
}