import type { Category, Coupon, Customer, Order, Review } from "@/types";
import { products } from "./products";

export const categories: Category[] = [
  { id: "c1", slug: "men", name: "Men", description: "Technical outerwear, heavyweight knits and everyday tailoring." },
  { id: "c2", slug: "women", name: "Women", description: "Sharp silhouettes, relaxed volumes and considered layering." },
  { id: "c3", slug: "unisex", name: "Unisex", description: "Shared essentials built without a gendered fit block." },
  { id: "c4", slug: "streetwear", name: "Streetwear", description: "Graphic-led pieces built for the street and the archive." },
  { id: "c5", slug: "sneakers", name: "Sneakers", description: "Runners, courts and lows engineered for urban distance." },
  { id: "c6", slug: "accessories", name: "Accessories", description: "Bags, caps and hardware that finish the system." },
];

export const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
export const COLORS = ["Black", "White", "Gray", "Green", "Blue", "Brown"];

const CUSTOMER_NAMES = [
  "Aarav Mehta", "Ishita Rao", "Kabir Nair", "Meera Sharma", "Rohan Kapoor",
  "Ananya Iyer", "Devansh Gill", "Tara Menon", "Zoya Khan", "Vikram Bose",
  "Nikita Joshi", "Arjun Sethi",
];

export const customers: Customer[] = CUSTOMER_NAMES.map((name, i) => ({
  id: `cus-${100 + i}`,
  name,
  email: `${name.split(" ")[0]!.toLowerCase()}@nova.style`,
  orders: 1 + ((i * 3) % 9),
  totalSpent: 4999 + i * 3175,
  status: i % 5 === 0 ? "New" : i % 7 === 3 ? "Dormant" : "Active",
  joinedAt: `2025-${String((i % 12) + 1).padStart(2, "0")}-1${i % 9}`,
}));

const STATUSES = ["Pending", "Confirmed", "Processing", "Shipped", "Delivered", "Cancelled"] as const;
const PAYMENTS = ["UPI", "Card", "Net Banking", "Cash on Delivery"] as const;

export const orders: Order[] = Array.from({ length: 14 }, (_, i) => {
  const customer = customers[i % customers.length]!;
  const picks = [products[i * 3]!, products[(i * 5 + 7) % products.length]!];
  const items = picks.map((p, j) => ({
    productId: p.id,
    name: p.name,
    brand: p.brand,
    image: p.images[0]!,
    size: p.sizes[(i + j) % p.sizes.length]!,
    color: p.colors[0]!,
    quantity: 1 + ((i + j) % 2),
    price: p.price,
  }));
  const total = items.reduce((s, it) => s + it.price * it.quantity, 0);
  const status = STATUSES[i % STATUSES.length]!;
  return {
    id: `NOVA-2026-${String(1041 + i)}`,
    customer: customer.name,
    email: customer.email,
    date: `2026-0${(i % 8) + 1}-${String((i % 27) + 1).padStart(2, "0")}`,
    items,
    total,
    payment: PAYMENTS[i % PAYMENTS.length]!,
    paymentStatus: status === "Cancelled" ? "Refunded" : status === "Pending" ? "Pending" : "Paid",
    status,
    address: {
      id: `addr-${i}`,
      name: customer.name,
      phone: `+91 98${String(10000000 + i * 7919).slice(0, 8)}`,
      line1: `${12 + i} Anand Villas, Linking Road`,
      city: ["Mumbai", "Bengaluru", "Delhi", "Pune"][i % 4]!,
      state: ["Maharashtra", "Karnataka", "Delhi", "Maharashtra"][i % 4]!,
      pincode: `4000${String(10 + i).slice(0, 2)}`,
    },
  } satisfies Order;
});

const REVIEW_BODIES = [
  "Fabric weight is genuinely heavy — holds its shape after several washes. Sizing runs oversized as described.",
  "Fit is exactly what the product page shows. Finishing on the seams is better than pieces at twice the price.",
  "Arrived in three days. Colour is a true matte black, not washed out under daylight.",
  "Wore it through monsoon week and the shell held up. Only wish the pockets were deeper.",
  "Second piece from this line. Consistent sizing across drops, which is rare.",
];

export const reviews: Review[] = Array.from({ length: 24 }, (_, i) => {
  const product = products[(i * 5) % products.length]!;
  return {
    id: `rev-${200 + i}`,
    productId: product.id,
    productName: product.name,
    customer: CUSTOMER_NAMES[i % CUSTOMER_NAMES.length]!,
    rating: 3 + (i % 3),
    title: ["Worth the drop", "Holds up", "Exactly as shown", "Great weight", "Would buy again"][i % 5]!,
    body: REVIEW_BODIES[i % REVIEW_BODIES.length]!,
    date: `2026-0${(i % 8) + 1}-${String((i % 27) + 1).padStart(2, "0")}`,
    status: i % 6 === 0 ? "Pending" : i % 11 === 4 ? "Hidden" : "Published",
  } satisfies Review;
});

export const coupons: Coupon[] = [
  { id: "cp1", code: "NOVA10", type: "percent", value: 10, minOrder: 2999, expiry: "2026-12-31", used: 412, status: "Active" },
  { id: "cp2", code: "FIRSTERA", type: "flat", value: 500, minOrder: 1999, expiry: "2026-10-01", used: 1298, status: "Active" },
  { id: "cp3", code: "DROP20", type: "percent", value: 20, minOrder: 6999, expiry: "2026-09-15", used: 233, status: "Active" },
  { id: "cp4", code: "AFTERDARK", type: "percent", value: 15, minOrder: 4999, expiry: "2026-03-01", used: 894, status: "Expired" },
  { id: "cp5", code: "STUDENT", type: "flat", value: 300, minOrder: 1499, expiry: "2026-12-31", used: 76, status: "Paused" },
];

export const TRENDING_SEARCHES = [
  "oversized hoodie", "cargo pants", "white sneakers", "streetwear", "denim jacket",
];