import { useState } from "react";
import {
  createFileRoute,
  Link,
  useNavigate,
} from "@tanstack/react-router";
import { Check } from "lucide-react";

import { SiteLayout } from "@/components/nova/SiteLayout";
import { EmptyState } from "@/components/nova/primitives";

import { useShop } from "@/store/shop";

import {
  FREE_SHIPPING_THRESHOLD,
  inr,
} from "@/lib/format";

import { cn } from "@/lib/utils";

import type {
  Address,
  Order,
} from "@/types";

import { toast } from "sonner";


// =====================================================
// ROUTE
// =====================================================

export const Route = createFileRoute(
  "/checkout"
)({

  head: () => ({
    meta: [
      {
        title: "Checkout — NØVA",
      },
      {
        name: "description",
        content:
          "Complete your NØVA order: address, delivery and payment.",
      },
      {
        property: "og:title",
        content: "Checkout — NØVA",
      },
      {
        property: "og:description",
        content:
          "Complete your NØVA order.",
      },
      {
        name: "robots",
        content: "noindex",
      },
    ],
  }),

  component: CheckoutPage,

});


// =====================================================
// CHECKOUT STEPS
// =====================================================

const STEPS = [
  "Address",
  "Delivery",
  "Payment",
  "Confirm",
] as const;


const PAYMENTS = [
  "UPI",
  "Card",
  "Net Banking",
  "Cash on Delivery",
] as const;


// =====================================================
// FIELD COMPONENT
// =====================================================

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {

  const id =
    label
      .toLowerCase()
      .replace(/\s/g, "-");


  return (
    <div>

      <label
        htmlFor={id}
        className="
          label-xs
          text-muted-foreground
        "
      >
        {label}
      </label>


      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="
          mt-2
          w-full
          border
          border-border
          bg-transparent
          px-4
          py-3
          text-sm
          outline-none
          transition-colors
          focus:border-primary
        "
      />

    </div>
  );
}


// =====================================================
// CHECKOUT PAGE
// =====================================================

function CheckoutPage() {

  const {
    cartDetailed,
    subtotal,
    user,
    placeOrder,
  } = useShop();


  const navigate =
    useNavigate();


  // ===================================================
  // LOGIN REQUIRED
  // ===================================================

  if (!user) {

    return (
      <SiteLayout>

        <div
          className="
            mx-auto
            max-w-3xl
            px-5
            py-24
            text-center
            sm:px-8
          "
        >

          <p
            className="
              label-xs
              text-primary
            "
          >
            NØVA CHECKOUT
          </p>


          <h1
            className="
              display
              mt-4
              text-5xl
              sm:text-7xl
            "
          >
            Login Required
          </h1>


          <p
            className="
              mx-auto
              mt-5
              max-w-md
              text-sm
              text-muted-foreground
            "
          >
            Please log in to your NØVA
            account before completing
            your order.
          </p>


          <div
            className="
              mt-8
              flex
              justify-center
              gap-3
            "
          >

            <Link
              to="/login"
              className="
                label-xs
                bg-primary
                px-8
                py-4
                text-primary-foreground
                transition-opacity
                hover:opacity-85
              "
            >
              Login
            </Link>


            <Link
              to="/register"
              className="
                label-xs
                border
                border-border
                px-8
                py-4
                transition-colors
                hover:border-primary
                hover:text-primary
              "
            >
              Create Account
            </Link>

          </div>

        </div>

      </SiteLayout>
    );
  }


  // ===================================================
  // STATE
  // ===================================================

  const [step, setStep] =
    useState(0);


  const [speed, setSpeed] =
    useState<
      "standard" | "express"
    >("standard");


  const [payment, setPayment] =
    useState<
      (typeof PAYMENTS)[number]
    >("UPI");


  const [address, setAddress] =
    useState<Address>({

      id: "addr-new",

      name:
        user.name ?? "",

      phone: "",

      line1: "",

      city: "",

      state: "",

      pincode: "",

    });


  // ===================================================
  // SHIPPING
  // ===================================================

  const shipping =
    speed === "express"
      ? 199
      : subtotal >=
          FREE_SHIPPING_THRESHOLD
        ? 0
        : 99;


  const total =
    subtotal + shipping;


  // ===================================================
  // EMPTY CART
  // ===================================================

  if (cartDetailed.length === 0) {

    return (
      <SiteLayout>

        <div
          className="
            mx-auto
            max-w-3xl
            px-5
            py-24
            sm:px-8
          "
        >

          <EmptyState
            title="Nothing to check out."
            body="Add a piece to your bag first."
            actionLabel="Shop New Drops"
            actionTo="/shop"
          />

        </div>

      </SiteLayout>
    );
  }


  // ===================================================
  // NEXT STEP
  // ===================================================

  const next = () => {

    // ================================================
    // ADDRESS
    // ================================================

    if (step === 0) {

      const missing =
        !address.name ||
        !address.phone ||
        !address.line1 ||
        !address.city ||
        !address.state ||
        !/^\d{6}$/.test(
          address.pincode
        );


      if (missing) {

        toast.error(
          "Complete every address field (6-digit pincode)."
        );

        return;
      }

    }


    // ================================================
    // PLACE ORDER
    // ================================================

    if (step === 3) {

      // Extra protection
      // in case user state changes.

      if (!user) {

        toast.error(
          "Please log in before placing your order."
        );

        void navigate({
          to: "/login",
        });

        return;
      }


      const order: Order = {

        id:
          `NOVA-2026-${Math.floor(
            2000 +
              Math.random() *
                7999
          )}`,

        customer:
          address.name,

        email:
          user.email,

        date:
          new Date()
            .toISOString()
            .slice(0, 10),


        items:
          cartDetailed.map(
            ({
              item,
              product,
            }) => ({

              productId:
                product.id,

              name:
                product.name,

              brand:
                product.brand,

              image:
                product.images[0] ??
                "",

              size:
                item.size,

              color:
                item.color,

              quantity:
                item.quantity,

              price:
                product.price,

            })
          ),


        total,


        payment,


        paymentStatus:
          payment ===
          "Cash on Delivery"
            ? "Pending"
            : "Paid",


        status:
          "Confirmed",


        address,

      };


      placeOrder(order);


      toast.success(
        "Order placed successfully"
      );


      void navigate({
        to: "/orders/$id",
        params: {
          id: order.id,
        },
      });


      return;
    }


    // ================================================
    // NEXT
    // ================================================

    setStep(
      (s) => s + 1
    );
  };


  // ===================================================
  // UI
  // ===================================================

  return (

    <SiteLayout>

      <div
        className="
          mx-auto
          max-w-[1200px]
          px-5
          py-12
          sm:px-8
          sm:py-16
        "
      >

        {/* ============================================
            TITLE
        ============================================ */}

        <h1
          className="
            display
            text-5xl
            sm:text-7xl
          "
        >
          Checkout
        </h1>


        {/* ============================================
            STEPS
        ============================================ */}

        <ol
          className="
            mt-10
            grid
            grid-cols-2
            gap-3
            sm:grid-cols-4
          "
        >

          {STEPS.map(
            (label, i) => (

              <li
                key={label}
                className={cn(
                  `
                    border-t-2
                    pt-3
                    text-[11px]
                    uppercase
                    tracking-widest
                  `,
                  i <= step
                    ? `
                      border-primary
                      text-foreground
                    `
                    : `
                      border-border
                      text-muted-foreground
                    `
                )}
              >

                <span
                  className={cn(
                    i <= step &&
                      "text-primary"
                  )}
                >
                  0{i + 1}
                </span>{" "}

                {label}

              </li>

            )
          )}

        </ol>


        {/* ============================================
            MAIN
        ============================================ */}

        <div
          className="
            mt-12
            grid
            gap-12
            lg:grid-cols-[1.4fr_1fr]
          "
        >

          {/* ==========================================
              LEFT
          ========================================== */}

          <div>

            {/* ========================================
                ADDRESS
            ======================================== */}

            {step === 0 && (

              <div
                className="
                  grid
                  gap-5
                  sm:grid-cols-2
                "
              >

                <Field
                  label="Full Name"
                  value={address.name}
                  onChange={(v) =>
                    setAddress({
                      ...address,
                      name: v,
                    })
                  }
                />


                <Field
                  label="Phone"
                  value={address.phone}
                  onChange={(v) =>
                    setAddress({
                      ...address,
                      phone: v,
                    })
                  }
                  type="tel"
                />


                <div
                  className="
                    sm:col-span-2
                  "
                >

                  <Field
                    label="Address"
                    value={address.line1}
                    onChange={(v) =>
                      setAddress({
                        ...address,
                        line1: v,
                      })
                    }
                  />

                </div>


                <Field
                  label="City"
                  value={address.city}
                  onChange={(v) =>
                    setAddress({
                      ...address,
                      city: v,
                    })
                  }
                />


                <Field
                  label="State"
                  value={address.state}
                  onChange={(v) =>
                    setAddress({
                      ...address,
                      state: v,
                    })
                  }
                />


                <Field
                  label="Pincode"
                  value={address.pincode}
                  onChange={(v) =>
                    setAddress({
                      ...address,
                      pincode: v,
                    })
                  }
                  type="text"
                />

              </div>

            )}


            {/* ========================================
                DELIVERY
            ======================================== */}

            {step === 1 && (

              <div
                className="
                  space-y-3
                "
              >

                {([
                  {
                    key: "standard",
                    title: "Standard",
                    copy: "3–5 business days",
                    cost:
                      subtotal >=
                      FREE_SHIPPING_THRESHOLD
                        ? "Free"
                        : inr(99),
                  },

                  {
                    key: "express",
                    title: "Express",
                    copy: "Next business day",
                    cost: inr(199),
                  },

                ] as const).map(
                  (o) => (

                    <button
                      key={o.key}
                      type="button"
                      onClick={() =>
                        setSpeed(
                          o.key
                        )
                      }
                      className={cn(
                        `
                          flex
                          w-full
                          items-center
                          justify-between
                          border
                          p-5
                          text-left
                          transition-colors
                        `,
                        speed ===
                          o.key
                          ? "border-primary"
                          : `
                            border-border
                            hover:border-foreground/50
                          `
                      )}
                    >

                      <span>

                        <span
                          className="
                            label-xs
                            block
                          "
                        >
                          {o.title}
                        </span>

                        <span
                          className="
                            mt-1
                            block
                            text-xs
                            text-muted-foreground
                          "
                        >
                          {o.copy}
                        </span>

                      </span>


                      <span
                        className="
                          text-sm
                          tabular-nums
                        "
                      >
                        {o.cost}
                      </span>

                    </button>

                  )
                )}

              </div>

            )}


            {/* ========================================
                PAYMENT
            ======================================== */}

            {step === 2 && (

              <div
                className="
                  space-y-3
                "
              >

                {PAYMENTS.map(
                  (p) => (

                    <button
                      key={p}
                      type="button"
                      onClick={() =>
                        setPayment(p)
                      }
                      className={cn(
                        `
                          flex
                          w-full
                          items-center
                          justify-between
                          border
                          p-5
                          text-left
                          transition-colors
                        `,
                        payment === p
                          ? "border-primary"
                          : `
                            border-border
                            hover:border-foreground/50
                          `
                      )}
                    >

                      <span
                        className="
                          label-xs
                        "
                      >
                        {p}
                      </span>


                      {payment === p && (

                        <Check
                          width={16}
                          height={16}
                          className="
                            text-primary
                          "
                        />

                      )}

                    </button>

                  )
                )}


                <p
                  className="
                    text-[11px]
                    uppercase
                    tracking-widest
                    text-muted-foreground
                  "
                >
                  Demo checkout — no
                  payment is processed.
                </p>

              </div>

            )}


            {/* ========================================
                CONFIRM
            ======================================== */}

            {step === 3 && (

              <div
                className="
                  space-y-6
                  border
                  border-border
                  p-6
                "
              >

                <div>

                  <p
                    className="
                      label-xs
                      text-muted-foreground
                    "
                  >
                    Deliver to
                  </p>


                  <p
                    className="
                      mt-2
                      text-sm
                    "
                  >

                    {address.name}
                    {" · "}
                    {address.phone}

                    <br />

                    {address.line1},{" "}
                    {address.city},{" "}
                    {address.state}{" "}
                    {address.pincode}

                  </p>

                </div>


                <div>

                  <p
                    className="
                      label-xs
                      text-muted-foreground
                    "
                  >
                    Delivery
                  </p>


                  <p
                    className="
                      mt-2
                      text-sm
                      capitalize
                    "
                  >
                    {speed}
                  </p>

                </div>


                <div>

                  <p
                    className="
                      label-xs
                      text-muted-foreground
                    "
                  >
                    Payment
                  </p>


                  <p
                    className="
                      mt-2
                      text-sm
                    "
                  >
                    {payment}
                  </p>

                </div>

              </div>

            )}


            {/* ========================================
                BUTTONS
            ======================================== */}

            <div
              className="
                mt-10
                flex
                gap-3
              "
            >

              {step > 0 && (

                <button
                  type="button"
                  onClick={() =>
                    setStep(
                      (s) => s - 1
                    )
                  }
                  className="
                    label-xs
                    border
                    border-border
                    px-6
                    py-4
                    transition-colors
                    hover:border-primary
                    hover:text-primary
                  "
                >
                  Back
                </button>

              )}


              <button
                type="button"
                onClick={next}
                className="
                  label-xs
                  bg-primary
                  px-8
                  py-4
                  text-primary-foreground
                  transition-opacity
                  hover:opacity-85
                "
              >
                {step === 3
                  ? "Place Order"
                  : "Continue"}
              </button>

            </div>

          </div>


          {/* ==========================================
              ORDER SUMMARY
          ========================================== */}

          <aside
            className="
              h-fit
              border
              border-border
              p-6
            "
          >

            <h2
              className="
                label-xs
              "
            >
              Order Summary
            </h2>


            <ul
              className="
                mt-5
                space-y-4
              "
            >

              {cartDetailed.map(
                ({
                  item,
                  product,
                }) => (

                  <li
                    key={item.id}
                    className="
                      flex
                      gap-3
                    "
                  >

                    <img
                      src={
                        product.images[0]
                      }
                      alt=""
                      loading="lazy"
                      className="
                        h-20
                        w-16
                        object-cover
                      "
                    />


                    <div
                      className="
                        min-w-0
                        flex-1
                        text-xs
                      "
                    >

                      <p
                        className="
                          truncate
                          font-semibold
                          uppercase
                        "
                      >
                        {product.name}
                      </p>


                      <p
                        className="
                          mt-1
                          text-muted-foreground
                        "
                      >
                        {item.size}
                        {" · "}
                        {item.color}
                        {" · ×"}
                        {item.quantity}
                      </p>

                    </div>


                    <span
                      className="
                        text-xs
                        tabular-nums
                      "
                    >
                      {inr(
                        product.price *
                          item.quantity
                      )}
                    </span>

                  </li>

                )
              )}

            </ul>


            {/* TOTALS */}

            <dl
              className="
                mt-6
                space-y-2
                border-t
                border-border
                pt-5
                text-sm
              "
            >

              <div
                className="
                  flex
                  justify-between
                "
              >

                <dt
                  className="
                    text-muted-foreground
                  "
                >
                  Subtotal
                </dt>


                <dd
                  className="
                    tabular-nums
                  "
                >
                  {inr(subtotal)}
                </dd>

              </div>


              <div
                className="
                  flex
                  justify-between
                "
              >

                <dt
                  className="
                    text-muted-foreground
                  "
                >
                  Shipping
                </dt>


                <dd
                  className="
                    tabular-nums
                  "
                >
                  {shipping === 0
                    ? "Free"
                    : inr(shipping)}
                </dd>

              </div>


              <div
                className="
                  flex
                  justify-between
                  pt-3
                  text-base
                  font-semibold
                "
              >

                <dt>
                  Total
                </dt>


                <dd
                  className="
                    tabular-nums
                  "
                >
                  {inr(total)}
                </dd>

              </div>

            </dl>


            <Link
              to="/cart"
              className="
                label-xs
                mt-6
                block
                text-center
                text-muted-foreground
                hover:text-primary
              "
            >
              Edit bag
            </Link>

          </aside>

        </div>

      </div>

    </SiteLayout>
  );
}