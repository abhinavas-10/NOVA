import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ArrowLeft } from "lucide-react";

import { SiteLayout } from "@/components/nova/SiteLayout";
import { ProductCard } from "@/components/nova/ProductCard";
import { Reveal, SectionHeading } from "@/components/nova/primitives";

import { productService } from "@/services/api";
import { IMG } from "@/data/images";

import { toast } from "sonner";

import type { Product } from "@/types";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "NØVA — Wear Your Era | Premium Streetwear",
      },
      {
        name: "description",
        content:
          "Shop NØVA: technical outerwear, heavyweight hoodies, cargo pants and urban sneakers. New season 2026 drops, free shipping over ₹999.",
      },
      {
        property: "og:title",
        content: "NØVA — Wear Your Era",
      },
      {
        property: "og:description",
        content:
          "New season 2026. Contemporary essentials for people who define their own style.",
      },
    ],
  }),

  component: Index,
});


const SECTION = "mx-auto max-w-[1600px] px-5 sm:px-8";


// =====================================================
// HERO
// =====================================================

function Hero() {
  return (
    <section className="relative isolate min-h-[88vh] overflow-hidden bg-ink sm:min-h-screen">

      <video
        className="absolute inset-0 h-full w-full object-cover object-[68%_center]"
        autoPlay
        muted
        loop
        playsInline
        poster={IMG.heroImg}
      >
        <source
          src="/videos/nova-hero.mp4"
          type="video/mp4"
        />
      </video>

      <div className="absolute inset-0 bg-gradient-to-r from-ink/75 via-ink/10 to-transparent" />

      <div className="absolute inset-0 bg-gradient-to-t from-ink/35 via-transparent to-transparent" />

      <div
        className={`${SECTION} relative flex min-h-[88vh] flex-col justify-end pb-16 pt-24 sm:min-h-screen sm:pb-24`}
      >
        <div className="max-w-3xl">

          <p className="label-xs reveal text-primary">
            New Season / 2026
          </p>

          <h1 className="display reveal mt-6 text-[19vw] leading-[0.82] sm:text-[13vw] lg:text-[10.5rem]">
            Wear
            <br />
            Your
            <br />
            <span className="text-primary">
              Era.
            </span>
          </h1>

          <p className="reveal mt-8 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
            Contemporary essentials built for people who define their own
            style.
          </p>

          <div className="reveal mt-10 flex flex-wrap gap-3">

            <Link
              to="/shop"
              search={{ sort: "new" }}
              className="label-xs bg-primary px-7 py-4 text-primary-foreground transition-opacity hover:opacity-85"
            >
              Shop New Drops
            </Link>

            <Link
              to="/shop"
              className="label-xs border border-foreground/40 px-7 py-4 transition-colors hover:border-primary hover:text-primary"
            >
              Explore Collection
            </Link>

          </div>
        </div>
      </div>
    </section>
  );
}
// =====================================================
// NEW DROPS
// =====================================================

function NewDrops() {
  const [drops, setDrops] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNewDrops = async () => {
      try {
        // Get more products so we have enough products
        // with real images to display.
        const data = await productService.list();

        const products = Array.isArray(data)
          ? data
          : [];

        // Keep ONLY products that actually have images.
        const productsWithImages = products.filter(
          (product) =>
            Array.isArray(product.images) &&
            product.images.some(
              (image) =>
                typeof image === "string" &&
                image.trim().length > 0
            )
        );

        // Remove duplicate products.
        const uniqueProducts = Array.from(
          new Map(
            productsWithImages.map((product) => [
              String(product.id),
              product,
            ])
          ).values()
        );

        // If New Drops contains products without images,
        // don't show them as "COMING SOON".
        setDrops(uniqueProducts.slice(0, 6));
      } catch (error) {
        console.error(
          "Failed to load new drops:",
          error
        );

        setDrops([]);
      } finally {
        setLoading(false);
      }
    };

    loadNewDrops();
  }, []);

  if (loading) {
    return (
      <section
        className={`${SECTION} py-24 sm:py-32`}
      >
        <SectionHeading
          title="New Drops"
          index="01 / 06"
          action="View all"
          actionTo="/shop"
        />

        <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="aspect-[3/4] animate-pulse bg-surface"
            />
          ))}
        </div>
      </section>
    );
  }

  const [featured, ...rest] = drops;

  if (!featured) {
    return (
      <section
        className={`${SECTION} py-24 sm:py-32`}
      >
        <SectionHeading
          title="New Drops"
          index="01 / 06"
          action="View all"
          actionTo="/shop"
        />

        <p className="mt-10 text-sm text-muted-foreground">
          No products with images available right now.
        </p>
      </section>
    );
  }

  return (
    <section
      className={`${SECTION} py-24 sm:py-32`}
    >
      <SectionHeading
        title="New Drops"
        index="01 / 06"
        action="View all"
        actionTo="/shop"
      />

      <div className="mt-12 grid gap-x-6 gap-y-14 lg:grid-cols-12">

        {/* =========================================
            FEATURED PRODUCT
        ========================================= */}
        <Reveal className="lg:col-span-7">
          <ProductCard
            product={featured}
            size="lg"
          />
        </Reveal>

        {/* =========================================
            RIGHT SIDE PRODUCTS
        ========================================= */}
        <div className="grid grid-cols-2 gap-6 lg:col-span-5">

          {rest.slice(0, 4).map(
            (product, index) => (
              <Reveal
                key={product.id}
                delay={80 * (index + 1)}
                className="self-start"
              >
                <ProductCard
                  product={product}
                />
              </Reveal>
            )
          )}

        </div>

        {/* =========================================
            REMAINING PRODUCTS
        ========================================= */}
        {rest.slice(4).map(
          (product, index) => (
            <Reveal
              key={product.id}
              delay={60 * index}
              className="col-span-6 sm:col-span-4 lg:col-span-4"
            >
              <ProductCard
                product={product}
              />
            </Reveal>
          )
        )}

      </div>
    </section>
  );
}



// =====================================================
// ERA CAMPAIGN
// =====================================================

function EraCampaign() {

  return (
    <section className="relative isolate overflow-hidden bg-ink">

      <div className="relative h-[70vh] w-full overflow-hidden sm:h-[88vh]">

        <img
          src={IMG.heroImg}
          alt="NØVA fashion campaign"
          loading="lazy"
          width={1920}
          height={1080}
          className="h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />

      </div>


      <div
        className={`${SECTION} absolute inset-0 flex items-end pb-16 sm:pb-24`}
      >

        <Reveal>

          <p className="label-xs text-primary">
            NØVA / 2026
          </p>

          <h2 className="display mt-4 text-[15vw] leading-[0.84] sm:text-[8.5rem]">
            The New
            <br />
            <span className="text-primary">
              Era.
            </span>
          </h2>

          <p className="mt-6 max-w-sm text-sm text-muted-foreground">
            A new generation of streetwear.
            Designed for movement.
          </p>

          <Link
            to="/shop"
            search={{ sort: "new" }}
            className="label-xs mt-8 inline-flex items-center gap-3 bg-primary px-7 py-4 text-primary-foreground transition-opacity hover:opacity-85"
          >
            Discover NØVA
            <ArrowRight width={14} height={14} />
          </Link>

        </Reveal>

      </div>

    </section>
  );
}


// =====================================================
// SHOP BY STYLE
// =====================================================

const STYLE_TILES = [
  {
    name: "Streetwear",
    copy: "Built for the city.",
    to: "streetwear",
    img: IMG.campaignStreet,
    cls: "lg:col-span-4 lg:row-span-2",
  },
  {
    name: "Outerwear",
    copy: "Technical layers.",
    to: "outerwear",
    img: IMG.pJacket,
    cls: "lg:col-span-2",
  },
  {
    name: "Essentials",
    copy: "Heavyweight comfort.",
    to: "hoodies",
    img: IMG.pHoodie,
    cls: "lg:col-span-2",
  },
  {
    name: "Sneakers",
    copy: "Move different.",
    to: "sneakers",
    img: IMG.pSneaker,
    cls: "lg:col-span-4",
  },
];


function ShopByStyle() {

  return (
    <section className={`${SECTION} py-24 sm:py-32`}>

      <SectionHeading
        title="Find Your Era."
        index="Shop by style"
      />

      <div className="mt-12 grid auto-rows-[minmax(0,1fr)] gap-4 lg:grid-cols-8">

        {STYLE_TILES.map((t, i) => (

          <Reveal
            key={t.name}
            delay={i * 70}
            className={t.cls}
          >

            <Link
              to="/category/$category"
              params={{ category: t.to }}
              className="group relative block h-full w-full overflow-hidden bg-surface"
            >

              <img
                src={t.img}
                alt={t.name}
                loading="lazy"
                className="h-full min-h-56 w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/10 to-transparent" />

              <div className="absolute inset-x-0 bottom-0 p-5">

                <h3 className="display text-2xl sm:text-3xl">
                  {t.name}
                </h3>

                <p className="mt-1 text-xs text-muted-foreground">
                  {t.copy}
                </p>

                <span className="label-xs mt-3 inline-flex items-center gap-2 text-primary opacity-0 transition-opacity group-hover:opacity-100">
                  Explore
                  <ArrowRight width={13} height={13} />
                </span>

              </div>

            </Link>

          </Reveal>

        ))}

      </div>

    </section>
  );
}


// =====================================================
// STREET CAMPAIGN
// =====================================================

function StreetCampaign() {

  return (
    <section className="relative isolate overflow-hidden bg-ink">

      <div className="relative h-[80vh] w-full overflow-hidden sm:h-[95vh]">

        <img
          src={IMG.campaignStreet}
          alt="Model in oversized hoodie walking through an urban underpass"
          loading="lazy"
          width={1920}
          height={1080}
          className="h-[112%] w-full -translate-y-[6%] object-cover"
        />

        <div className="absolute inset-0 bg-ink/55" />

      </div>


      <div className={`${SECTION} absolute inset-0 flex items-center`}>

        <Reveal>

          <h2 className="display text-[15vw] leading-[0.84] sm:text-[8.5rem]">

            The Street
            <br />

            Is Your
            <br />

            <span className="text-primary">
              Runway.
            </span>

          </h2>

          <p className="mt-6 max-w-sm text-sm text-muted-foreground">
            Built for movement. Designed for expression.
          </p>

          <Link
            to="/category/$category"
            params={{ category: "streetwear" }}
            className="label-xs mt-8 inline-block bg-primary px-7 py-4 text-primary-foreground transition-opacity hover:opacity-85"
          >
            Explore Streetwear
          </Link>

        </Reveal>

      </div>

    </section>
  );
}


// =====================================================
// PRODUCT STORY
// =====================================================

function ProductStory() {

  const picks = [
    {
      idx: "01",
      label: "Technical Outerwear",
      img: IMG.pJacket,
    },
    {
      idx: "02",
      label: "Heavyweight Essentials",
      img: IMG.pHoodie,
    },
    {
      idx: "03",
      label: "Urban Footwear",
      img: IMG.pSneaker,
    },
  ];


  return (
    <section className={`${SECTION} py-24 sm:py-32`}>

      <div className="grid gap-10 lg:grid-cols-12">

        <div className="lg:col-span-4">

          <h2 className="display text-5xl sm:text-7xl">
            Built
            <br />
            Different.
          </h2>

          <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Technical construction. Everyday movement. Designed without
            compromise.
          </p>

          <Link
            to="/shop"
            className="label-xs mt-8 inline-block border border-foreground/40 px-7 py-4 transition-colors hover:border-primary hover:text-primary"
          >
            Shop the System
          </Link>

        </div>


        <div className="grid gap-4 sm:grid-cols-3 lg:col-span-8">

          {picks.map((p, i) => (

            <Reveal
              key={p.idx}
              delay={i * 90}
            >

              <div className="group relative overflow-hidden bg-surface">

                <img
                  src={p.img}
                  alt={p.label}
                  loading="lazy"
                  className="aspect-[3/4] w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />

              </div>

              <p className="label-xs mt-4 text-primary">
                {p.idx}
              </p>

              <p className="mt-1 text-sm font-semibold uppercase">
                {p.label}
              </p>

            </Reveal>

          ))}

        </div>

      </div>

    </section>
  );
}


// =====================================================
// TRENDING
// =====================================================

function Trending() {

  const [items, setItems] = useState<Product[]>([]);

  const ref = useRef<HTMLDivElement>(null);


  useEffect(() => {

    productService
      .trending(8)
      .then((data) => {

        setItems(
          Array.isArray(data)
            ? data
            : []
        );

      })
      .catch((error) => {

        console.error(
          "Failed to load trending products:",
          error
        );

        setItems([]);

      });

  }, []);


  const scrollBy = (dir: 1 | -1) => {

    if (!ref.current) return;

    ref.current.scrollBy({
      left:
        dir *
        (ref.current.clientWidth * 0.7),
      behavior: "smooth",
    });

  };


  return (
    <section className="py-24 sm:py-32">

      <div className={SECTION}>

        <div className="flex items-end justify-between gap-6 border-b border-border pb-5">

          <h2 className="display text-3xl sm:text-5xl lg:text-6xl">
            Trending Now
          </h2>

          <div className="flex gap-2">

            <button
              type="button"
              aria-label="Scroll left"
              onClick={() => scrollBy(-1)}
              className="grid h-10 w-10 place-items-center border border-border transition-colors hover:border-primary hover:text-primary"
            >
              <ArrowLeft width={16} height={16} />
            </button>

            <button
              type="button"
              aria-label="Scroll right"
              onClick={() => scrollBy(1)}
              className="grid h-10 w-10 place-items-center border border-border transition-colors hover:border-primary hover:text-primary"
            >
              <ArrowRight width={16} height={16} />
            </button>

          </div>

        </div>

      </div>


      <div
        ref={ref}
        className="no-scrollbar mt-10 flex snap-x snap-mandatory gap-6 overflow-x-auto px-5 sm:px-8"
      >

        {items.map((p) => (

          <div
            key={p.id}
            className="w-[68vw] shrink-0 snap-start sm:w-[38vw] lg:w-[22vw]"
          >
            <ProductCard
              product={p}
              showRating
            />
          </div>

        ))}

      </div>

    </section>
  );
}


// =====================================================
// AFTER DARK
// =====================================================

function AfterDark() {

  return (
    <section className="relative isolate overflow-hidden bg-ink">

      <img
        src={IMG.catAfterDark}
        alt="Model in a sharp black silhouette on a night street"
        loading="lazy"
        width={1920}
        height={912}
        className="h-[70vh] w-full object-cover sm:h-[80vh]"
      />

      <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/70 to-transparent" />

      <div className={`${SECTION} absolute inset-0 flex items-center`}>

        <Reveal>

          <p className="label-xs text-primary">
            Collection
          </p>

          <h2 className="display mt-4 text-6xl sm:text-8xl">
            After Dark
          </h2>

          <p className="mt-6 text-sm uppercase leading-relaxed tracking-[0.2em] text-muted-foreground">
            Sharp silhouettes.
            <br />
            Deep tones.
            <br />
            <span className="text-primary">
              No rules.
            </span>
          </p>

          <Link
            to="/shop"
            search={{ sort: "featured" }}
            className="label-xs mt-8 inline-block border border-primary px-7 py-4 text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            Shop the Collection
          </Link>

        </Reveal>

      </div>

    </section>
  );
}


// =====================================================
// SNEAKER DROP
// =====================================================

function SneakerDrop() {

  const [sneakers, setSneakers] = useState<Product[]>([]);


  useEffect(() => {

    productService
      .byCategory("sneakers", 4)
      .then((data) => {

        setSneakers(
          Array.isArray(data)
            ? data
            : []
        );

      })
      .catch((error) => {

        console.error(
          "Failed to load sneakers:",
          error
        );

        setSneakers([]);

      });

  }, []);


  return (
    <section className={`${SECTION} py-24 sm:py-32`}>

      <div className="relative overflow-hidden bg-surface">

        <img
          src={IMG.sneakerHero}
          alt="Technical running sneaker on a dark concrete backdrop"
          loading="lazy"
          width={1600}
          height={1000}
          className="h-[46vh] w-full object-cover sm:h-[64vh]"
        />

        <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-14">

          <p className="label-xs text-primary">
            NØVA 01
          </p>

          <h2 className="display mt-3 text-6xl sm:text-8xl lg:text-9xl">
            Move
            <br />
            Different.
          </h2>

        </div>

      </div>


      <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-6 lg:grid-cols-4">

        {sneakers.map((p) => (

          <ProductCard
            key={p.id}
            product={p}
          />

        ))}

      </div>


      <div className="mt-12 flex justify-center">

        <Link
          to="/category/$category"
          params={{ category: "sneakers" }}
          className="label-xs bg-primary px-8 py-4 text-primary-foreground transition-opacity hover:opacity-85"
        >
          Shop Sneakers
        </Link>

      </div>

    </section>
  );
}


// =====================================================
// BRAND STATEMENT
// =====================================================

function BrandStatement() {

  return (
    <section className="border-y border-border bg-ink py-32 sm:py-48">

      <div className={SECTION}>

        <Reveal>

          <p className="display text-[22vw] leading-[0.8] sm:text-[13rem]">
            NØVA
          </p>

          <h2 className="display mt-10 text-5xl leading-[0.9] sm:text-8xl">
            Not For
            <br />
            Everyone.
          </h2>

          <p className="editorial mt-10 max-w-lg text-2xl text-muted-foreground sm:text-3xl">
            For those who don't follow the trend. They create it.
          </p>

        </Reveal>

      </div>

    </section>
  );
}


// =====================================================
// NEWSLETTER
// =====================================================

function Newsletter() {

  const [email, setEmail] = useState("");


  return (
    <section className={`${SECTION} py-24 sm:py-32`}>

      <div className="grid gap-10 border border-border p-8 sm:p-14 lg:grid-cols-2 lg:items-end">

        <div>

          <h2 className="display text-5xl sm:text-7xl">
            Join the Drop
          </h2>

          <p className="mt-5 max-w-md text-sm text-muted-foreground">
            Get first access to new collections, limited drops and exclusive
            offers.
          </p>

        </div>


        <form
          onSubmit={(e) => {

            e.preventDefault();

            if (!email.includes("@")) {

              toast.error(
                "Enter a valid email"
              );

              return;
            }

            setEmail("");

            toast.success(
              "You're on the list."
            );

          }}
          className="flex flex-col gap-3 sm:flex-row"
        >

          <label
            htmlFor="newsletter"
            className="sr-only"
          >
            Email address
          </label>

          <input
            id="newsletter"
            type="email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            placeholder="your@email.com"
            className="w-full border border-border bg-transparent px-5 py-4 text-sm outline-none transition-colors focus:border-primary"
          />

          <button
            type="submit"
            className="label-xs shrink-0 bg-primary px-8 py-4 text-primary-foreground transition-opacity hover:opacity-85"
          >
            Join NØVA
          </button>

        </form>

      </div>

    </section>
  );
}


// =====================================================
// HOME PAGE
// =====================================================

function Index() {

  return (
    <SiteLayout>

      <Hero />

      <NewDrops />

      <EraCampaign />

      <ShopByStyle />

      <StreetCampaign />

      <ProductStory />

      <Trending />

      <AfterDark />

      <SneakerDrop />

      <BrandStatement />

      <Newsletter />

    </SiteLayout>
  );
}