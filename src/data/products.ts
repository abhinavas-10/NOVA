import type { CategorySlug, Product } from "@/types";
import { imagesFor } from "./images";

type Row = [
  name: string,
  brand: string,
  category: CategorySlug,
  subcategory: string,
  family: string,
  price: number,
  mrp: number,
];

const ROWS: Row[] = [
  ["NØVA System Jacket", "NØVA LAB", "men", "Technical Jackets", "jacket", 8499, 11999],
  ["Void Heavyweight Hoodie", "NØVA", "unisex", "Hoodies", "hoodie", 4299, 5999],
  ["Core Oversized Tee", "NØVA", "unisex", "Oversized T-Shirts", "tee", 1499, 1999],
  ["Vector Cargo Pant", "NØVA LAB", "men", "Cargo Pants", "pant", 3999, 5499],
  ["After Dark Bomber", "NØVA", "men", "Bomber Jackets", "dark", 9299, 12999],
  ["Shift Wide-Leg Denim", "NØVA DENIM", "women", "Denim", "denim", 4599, 6299],
  ["NØVA 01 Runner", "NØVA 01", "sneakers", "Sneakers", "sneaker", 7999, 10999],
  ["Mono Crossbody", "NØVA", "accessories", "Bags", "accessory", 2799, 3499],
  ["Signal Cap", "NØVA", "accessories", "Caps", "accessory", 1299, 1699],
  ["Static Graphic Tee", "NØVA", "unisex", "Graphic T-Shirts", "tee", 1699, 2299],
  ["Concrete Heavyweight Tee", "NØVA", "men", "Heavyweight T-Shirts", "tee", 1899, 2499],
  ["Grid Panel Hoodie", "NØVA LAB", "unisex", "Hoodies", "hoodie", 4899, 6499],
  ["Fold Utility Jacket", "NØVA LAB", "men", "Technical Jackets", "jacket", 8999, 11499],
  ["Ember Washed Hoodie", "NØVA", "women", "Hoodies", "hoodie", 4199, 5799],
  ["Pulse Track Pant", "NØVA", "men", "Joggers", "pant", 2999, 3999],
  ["Halo Wide Trouser", "NØVA", "women", "Wide-Leg Trousers", "pant", 3799, 4999],
  ["Riot Cargo Short", "NØVA", "men", "Shorts", "pant", 2299, 2999],
  ["Drift Denim Jacket", "NØVA DENIM", "unisex", "Denim Jackets", "denim", 5999, 7999],
  ["Ash Boxy Sweatshirt", "NØVA", "unisex", "Sweatshirts", "hoodie", 3599, 4699],
  ["Frame Longline Tee", "NØVA", "men", "Oversized T-Shirts", "tee", 1599, 2199],
  ["Noir Technical Shell", "NØVA LAB", "unisex", "Technical Jackets", "dark", 11499, 14999],
  ["Orbit Puffer", "NØVA", "women", "Technical Jackets", "jacket", 10499, 13999],
  ["Anchor Straight Denim", "NØVA DENIM", "men", "Denim", "denim", 4299, 5599],
  ["Loop Relaxed Jean", "NØVA DENIM", "women", "Denim", "denim", 4499, 5999],
  ["NØVA 02 Trail", "NØVA 01", "sneakers", "Sneakers", "sneaker", 8999, 11999],
  ["Blank Low Sneaker", "NØVA 01", "sneakers", "Sneakers", "sneaker", 5999, 7999],
  ["Mass Chunky Runner", "NØVA 01", "sneakers", "Sneakers", "sneaker", 9499, 12499],
  ["Slate Court Sneaker", "NØVA 01", "sneakers", "Sneakers", "sneaker", 6499, 8499],
  ["Beam Utility Backpack", "NØVA", "accessories", "Backpacks", "accessory", 4299, 5499],
  ["Line Webbing Belt", "NØVA", "accessories", "Belts", "accessory", 1499, 1999],
  ["Eclipse Sunglasses", "NØVA", "accessories", "Sunglasses", "accessory", 2599, 3499],
  ["Fog Ribbed Beanie", "NØVA", "accessories", "Beanies", "accessory", 999, 1399],
  ["Sector Overshirt", "NØVA LAB", "men", "Technical Jackets", "jacket", 5499, 6999],
  ["Muted Crew Sweatshirt", "NØVA", "women", "Sweatshirts", "hoodie", 3299, 4399],
  ["Trace Graphic Tee", "NØVA", "women", "Graphic T-Shirts", "tee", 1599, 2199],
  ["Base Heavyweight Tee", "NØVA", "unisex", "Heavyweight T-Shirts", "tee", 1799, 2399],
  ["Rift Parachute Pant", "NØVA LAB", "unisex", "Cargo Pants", "pant", 4399, 5799],
  ["Nomad Cargo Pant", "NØVA", "women", "Cargo Pants", "pant", 3899, 5199],
  ["Column Tailored Trouser", "NØVA", "women", "Wide-Leg Trousers", "pant", 4199, 5499],
  ["Static Jogger", "NØVA", "unisex", "Joggers", "pant", 2799, 3699],
  ["Onyx Zip Hoodie", "NØVA", "men", "Hoodies", "hoodie", 4699, 6299],
  ["Vault Heavy Hoodie", "NØVA", "unisex", "Hoodies", "hoodie", 5199, 6999],
  ["Signal Graphic Hoodie", "NØVA", "streetwear", "Hoodies", "hoodie", 4999, 6499],
  ["Blackout Cargo Set", "NØVA LAB", "streetwear", "Cargo Pants", "dark", 6999, 9499],
  ["Marker Oversized Tee", "NØVA", "streetwear", "Oversized T-Shirts", "tee", 1699, 2299],
  ["Fracture Print Tee", "NØVA", "streetwear", "Graphic T-Shirts", "tee", 1799, 2399],
  ["Underpass Bomber", "NØVA", "streetwear", "Bomber Jackets", "jacket", 8299, 10999],
  ["Ridge Denim Short", "NØVA DENIM", "streetwear", "Shorts", "denim", 2499, 3299],
  ["Meridian Coach Jacket", "NØVA LAB", "streetwear", "Technical Jackets", "jacket", 6299, 8299],
  ["Tunnel Wide Denim", "NØVA DENIM", "streetwear", "Denim", "denim", 4799, 6299],
  ["Grain Washed Tee", "NØVA", "men", "Oversized T-Shirts", "tee", 1599, 2099],
  ["Cell Utility Vest", "NØVA LAB", "unisex", "Technical Jackets", "jacket", 5799, 7499],
  ["Nightshift Trouser", "NØVA", "streetwear", "Wide-Leg Trousers", "dark", 4599, 5999],
  ["Halftone Sweatshirt", "NØVA", "streetwear", "Sweatshirts", "hoodie", 3899, 4999],
  ["NØVA 03 Court", "NØVA 01", "sneakers", "Sneakers", "sneaker", 7499, 9999],
  ["Volt Mesh Runner", "NØVA 01", "sneakers", "Sneakers", "sneaker", 8499, 10999],
  ["Cinder Skate Low", "NØVA 01", "sneakers", "Sneakers", "sneaker", 5499, 7299],
  ["Plate Crossbody", "NØVA", "accessories", "Bags", "accessory", 3199, 4199],
  ["Depot Duffle", "NØVA", "accessories", "Bags", "accessory", 5499, 6999],
  ["Mono Trucker Cap", "NØVA", "accessories", "Caps", "accessory", 1399, 1799],
  ["Void Balaclava Beanie", "NØVA", "accessories", "Beanies", "accessory", 1199, 1599],
  ["Frame Metal Sunglasses", "NØVA", "accessories", "Sunglasses", "accessory", 2999, 3999],
  ["Origin Boxy Tee", "NØVA", "women", "Oversized T-Shirts", "tee", 1499, 1999],
  ["Contour Crop Hoodie", "NØVA", "women", "Hoodies", "hoodie", 3999, 5299],
  ["Slate Technical Anorak", "NØVA LAB", "men", "Technical Jackets", "jacket", 9799, 12999],
  ["Deep Field Overcoat", "NØVA", "women", "Technical Jackets", "dark", 12499, 15999],
];

const APPAREL_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const SNEAKER_SIZES = ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"];
const ONE_SIZE = ["One Size"];

const COLOR_SETS = [
  ["Black", "Gray"],
  ["Black", "White", "Gray"],
  ["Black", "Green"],
  ["White", "Gray", "Brown"],
  ["Black", "Blue"],
  ["Gray", "White"],
];

const MATERIALS: Record<string, string> = {
  tee: "240 GSM combed cotton, garment washed",
  hoodie: "480 GSM heavyweight fleece, brushed interior",
  jacket: "Ripstop nylon shell with matte water-repellent finish",
  dark: "Coated technical twill with matte black hardware",
  pant: "Cotton-nylon blend ripstop with articulated knee",
  denim: "13.5 oz rigid Japanese denim",
  sneaker: "Engineered mesh upper on compression-moulded EVA midsole",
  accessory: "Recycled nylon with anodised hardware",
};

const FITS: Record<string, string> = {
  tee: "Oversized drop-shoulder. Size down for a relaxed regular fit.",
  hoodie: "Boxy oversized fit with dropped armhole.",
  jacket: "Relaxed technical fit designed for layering.",
  dark: "Elongated silhouette with a sharp shoulder line.",
  pant: "Wide straight leg with adjustable hem.",
  denim: "High rise, wide straight leg.",
  sneaker: "True to size. Half sizes — take the larger.",
  accessory: "One size, adjustable.",
};

function slugify(v: string) {
  return v
    .toLowerCase()
    .replace(/ø/g, "o")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export const products: Product[] = ROWS.map((row, i) => {
  const [name, brand, category, subcategory, family, price, mrp] = row;
  const isSneaker = family === "sneaker";
  const isAccessory = family === "accessory";
  const rating = Number((3.8 + ((i * 7) % 12) / 10).toFixed(1));
  const day = ((i * 3) % 27) + 1;
  return {
    id: `nova-${String(i + 1).padStart(3, "0")}`,
    slug: slugify(name),
    name,
    brand,
    category,
    subcategory,
    description: `${name} from the NØVA ${category === "sneakers" ? "01" : "System"} line. Cut for movement, finished with considered detailing and a matte, tonal palette. Designed in-house and produced in limited runs.`,
    material: MATERIALS[family] ?? MATERIALS["tee"]!,
    care: "Cold machine wash with like colours. Do not bleach. Line dry in shade.",
    fit: FITS[family] ?? FITS["tee"]!,
    price,
    originalPrice: mrp,
    discount: Math.round(((mrp - price) / mrp) * 100),
    rating,
    reviewCount: 24 + ((i * 37) % 480),
    images: imagesFor(name, subcategory),
    sizes: isSneaker ? SNEAKER_SIZES : isAccessory ? ONE_SIZE : APPAREL_SIZES,
    colors: COLOR_SETS[i % COLOR_SETS.length]!,
    stock: (i * 13) % 7 === 0 ? (i % 5) + 1 : 12 + ((i * 11) % 60),
    isNew: i % 5 === 0,
    isTrending: i % 4 === 1,
    status: i % 17 === 5 ? "draft" : "active",
    createdAt: `2026-0${(i % 6) + 1}-${String(day).padStart(2, "0")}`,
  } satisfies Product;
});

export const productById = (id: string) =>
  products.find((p) => p.id === id || p.slug === id);