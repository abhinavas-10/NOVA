export type CategorySlug =
  | "men"
  | "women"
  | "unisex"
  | "streetwear"
  | "sneakers"
  | "accessories"
  | "jackets"
  | "hoodies"
  | "t-shirts"
  | "pants"
  | "shorts";


export interface Category {
  id: string;
  slug: CategorySlug;
  name: string;
  description: string;
  productCount?: number;
}


export interface Brand {
  id: string;
  name: string;
  slug: string;
}


export interface ProductVariant {
  size: string;
  color: string;
  stock: number;
}


export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;

  // NEW
  gender: "men" | "women" | "unisex";

  category: CategorySlug;
  subcategory: string;

  description: string;
  material: string;
  care: string;
  fit: string;

  price: number;
  originalPrice: number;
  discount: number;

  rating: number;
  reviewCount: number;

  images: string[];

  sizes: string[];
  colors: string[];

  stock: number;

  isNew: boolean;
  isTrending: boolean;

  status:
    | "active"
    | "draft"
    | "archived";

  createdAt: string;
}


export interface CartItem {
  id: string;
  productId: string;
  size: string;
  color: string;
  quantity: number;
}


export interface WishlistItem {
  productId: string;
  addedAt: string;
}


export interface Address {
  id: string;
  name: string;
  phone: string;
  line1: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}


export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  joinedAt: string;
  role: "customer" | "admin";
}


export interface OrderItem {
  productId: string;
  name: string;
  brand: string;
  image: string;
  size: string;
  color: string;
  quantity: number;
  price: number;
}


export type OrderStatus =
  | "Pending"
  | "Confirmed"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Cancelled";


export interface Order {
  id: string;
  customer: string;
  email: string;
  date: string;

  items: OrderItem[];

  total: number;

  payment:
    | "UPI"
    | "Card"
    | "Net Banking"
    | "Cash on Delivery";

  paymentStatus:
    | "Paid"
    | "Pending"
    | "Refunded";

  status: OrderStatus;

  address: Address;
}


export interface Review {
  id: string;
  productId: string;
  productName: string;
  customer: string;

  rating: number;
  title: string;
  body: string;
  date: string;

  status:
    | "Published"
    | "Pending"
    | "Hidden";
}


export interface Coupon {
  id: string;
  code: string;

  type:
    | "percent"
    | "flat";

  value: number;
  minOrder: number;
  expiry: string;
  used: number;

  status:
    | "Active"
    | "Expired"
    | "Paused";
}


export interface Customer {
  id: string;
  name: string;
  email: string;

  orders: number;
  totalSpent: number;

  status:
    | "Active"
    | "New"
    | "Dormant";

  joinedAt: string;
}


export interface Inventory {
  productId: string;
  sku: string;
  stock: number;
  lowStockThreshold: number;
}


export interface ProductFilters {
  categories?: CategorySlug[];

  sizes?: string[];

  colors?: string[];

  minPrice?: number;

  maxPrice?: number;

  minRating?: number;

  minDiscount?: number;

  query?: string;

  sort?:
    | "featured"
    | "new"
    | "price-asc"
    | "price-desc"
    | "rating"
    | "discount";
}