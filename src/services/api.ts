import type {
  Coupon,
  Order,
  Product,
  ProductFilters,
  Review,
} from "@/types";

export const API_BASE =
  "http://127.0.0.1:8000/api";


// =====================================================
// DJANGO PRODUCT → FRONTEND PRODUCT
// =====================================================

function mapDjangoProduct(
  product: any
): Product {

  // ---------------------------------------------------
  // IMAGES
  // ---------------------------------------------------

  const images =
    product.images
      ?.map((image: any) => image.image)
      .filter(Boolean) ?? [];


  const primaryImage =
    product.images?.find(
      (image: any) =>
        image.is_primary
    );


  // ---------------------------------------------------
  // SIZES
  // ---------------------------------------------------

  const sizes = [
    ...new Set(
      (product.variants ?? [])
        .map(
          (variant: any) =>
            variant.size
        )
        .filter(Boolean)
    ),
  ] as string[];


  // ---------------------------------------------------
  // COLORS
  // ---------------------------------------------------

  const colors = [
    ...new Set(
      (product.variants ?? [])
        .map(
          (variant: any) =>
            variant.color
        )
        .filter(Boolean)
    ),
  ] as string[];


  // ---------------------------------------------------
  // PRICE
  // ---------------------------------------------------

  const price =
    Number(product.price) || 0;


  const originalPrice =
    product.original_price != null
      ? Number(
          product.original_price
        )
      : price;


  const discount =
    originalPrice > price
      ? Math.round(
          ((originalPrice - price) /
            originalPrice) *
            100
        )
      : 0;


  // ---------------------------------------------------
  // CATEGORY
  // ---------------------------------------------------

  const categorySlug =
    product.category?.slug ??
    product.category?.name ??
    "";


  const subcategory =
    product.subcategory?.slug ??
    product.subcategory?.name ??
    product.subcategory ??
    "";


  // ---------------------------------------------------
  // RETURN PRODUCT
  // ---------------------------------------------------

  return {
    id: String(product.id),

    name:
      product.name ??
      "NØVA Product",

    slug:
      product.slug ??
      String(product.id),

    description:
      product.description ??
      "",

    price,

    originalPrice,

    brand:
      product.brand ??
      "NØVA",

    category:
      String(categorySlug),

    subcategory:
      String(subcategory),

    status:
      product.is_active
        ? "active"
        : "inactive",

    sizes,

    colors,

    rating:
      Number(product.rating) || 0,

    reviewCount:
      Number(
        product.review_count
      ) || 0,

    discount,

    createdAt:
      product.created_at ??
      "",

    isNew:
      Boolean(product.is_new),

    isTrending:
      Boolean(
        product.is_trending
      ),

    image:
      primaryImage?.image ??
      images[0] ??
      "",

    images,

  } as Product;
}


// =====================================================
// NORMALIZE CATEGORY
// =====================================================

function normalizeCategory(
  value: unknown
): string {

  return String(value ?? "")
    .toLowerCase()
    .trim()
    .replace(
      /[-_\s]+/g,
      ""
    );
}


// =====================================================
// CATEGORY ALIASES
// =====================================================

const CATEGORY_ALIASES:
  Record<string, string[]> = {

  men: [
    "men",
    "mens",
    "man",
    "male",
  ],

  women: [
    "women",
    "womens",
    "woman",
    "female",
  ],

  unisex: [
    "unisex",
    "uni",
  ],

  sneakers: [
    "sneakers",
    "sneaker",
    "shoes",
    "shoe",
    "footwear",
  ],

  streetwear: [
    "streetwear",
    "street",
  ],

  accessories: [
    "accessories",
    "accessory",
  ],

};


// =====================================================
// CHECK CATEGORY
// =====================================================

function categoryMatches(
  product: any,
  requestedSlug: string
): boolean {

  const requested =
    normalizeCategory(
      requestedSlug
    );


  // ---------------------------------------------------
  // GENDER
  // ---------------------------------------------------

  const gender =
    normalizeCategory(
      product.gender
    );


  // Men
  if (
    CATEGORY_ALIASES.men.includes(
      requested
    )
  ) {

    return (
      CATEGORY_ALIASES.men.includes(
        gender
      ) ||
      CATEGORY_ALIASES.men.includes(
        normalizeCategory(
          product.category?.slug
        )
      ) ||
      CATEGORY_ALIASES.men.includes(
        normalizeCategory(
          product.category?.name
        )
      )
    );

  }


  // Women
  if (
    CATEGORY_ALIASES.women.includes(
      requested
    )
  ) {

    return (
      CATEGORY_ALIASES.women.includes(
        gender
      ) ||
      CATEGORY_ALIASES.women.includes(
        normalizeCategory(
          product.category?.slug
        )
      ) ||
      CATEGORY_ALIASES.women.includes(
        normalizeCategory(
          product.category?.name
        )
      )
    );

  }


  // Unisex
  if (
    CATEGORY_ALIASES.unisex.includes(
      requested
    )
  ) {

    return (
      CATEGORY_ALIASES.unisex.includes(
        gender
      ) ||
      CATEGORY_ALIASES.unisex.includes(
        normalizeCategory(
          product.category?.slug
        )
      ) ||
      CATEGORY_ALIASES.unisex.includes(
        normalizeCategory(
          product.category?.name
        )
      )
    );

  }


  // ---------------------------------------------------
  // NORMAL CATEGORY
  // ---------------------------------------------------

  const djangoSlug =
    normalizeCategory(
      product.category?.slug
    );


  const djangoName =
    normalizeCategory(
      product.category?.name
    );


  // Exact match

  if (
    djangoSlug === requested ||
    djangoName === requested
  ) {

    return true;

  }


  // Aliases

  const aliases =
    CATEGORY_ALIASES[
      requestedSlug.toLowerCase()
    ] ?? [
      requested,
    ];


  return (
    aliases.includes(
      djangoSlug
    ) ||
    aliases.includes(
      djangoName
    )
  );
}


// =====================================================
// FILTER PRODUCTS
// =====================================================

function filterProducts(
  products: Product[],
  filters: ProductFilters = {}
): Product[] {

  let result =
    products.filter(
      (product) =>
        product.status ===
        "active"
    );


  // ===================================================
  // CATEGORY
  // ===================================================

  if (
    filters.categories?.length
  ) {

    result =
      result.filter(
        (product) =>
          filters.categories!.some(
            (category) =>
              categoryMatches(
                product,
                category
              )
          )
      );

  }


  // ===================================================
  // SIZE
  // ===================================================

  if (
    filters.sizes?.length
  ) {

    result =
      result.filter(
        (product) => {

          if (
            !product.sizes ||
            product.sizes.length === 0
          ) {

            return true;

          }


          return product.sizes.some(
            (size) =>
              filters.sizes!.includes(
                size
              )
          );

        }
      );

  }


  // ===================================================
  // COLOR
  // ===================================================

  if (
    filters.colors?.length
  ) {

    result =
      result.filter(
        (product) => {

          if (
            !product.colors ||
            product.colors.length === 0
          ) {

            return true;

          }


          return product.colors.some(
            (color) =>
              filters.colors!.includes(
                color
              )
          );

        }
      );

  }


  // ===================================================
  // MIN PRICE
  // ===================================================

  if (
    filters.minPrice != null
  ) {

    result =
      result.filter(
        (product) =>
          product.price >=
          filters.minPrice!
      );

  }


  // ===================================================
  // MAX PRICE
  // ===================================================

  if (
    filters.maxPrice != null
  ) {

    result =
      result.filter(
        (product) =>
          product.price <=
          filters.maxPrice!
      );

  }


  // ===================================================
  // RATING
  // ===================================================

  if (
    filters.minRating
  ) {

    result =
      result.filter(
        (product) =>
          product.rating >=
          filters.minRating!
      );

  }


  // ===================================================
  // DISCOUNT
  // ===================================================

  if (
    filters.minDiscount
  ) {

    result =
      result.filter(
        (product) =>
          product.discount >=
          filters.minDiscount!
      );

  }


  // ===================================================
  // SEARCH
  // ===================================================

  if (
    filters.query
  ) {

    const query =
      filters.query
        .toLowerCase()
        .trim();


    result =
      result.filter(
        (product) =>
          [
            product.name,
            product.brand,
            product.category,
            product.subcategory,
            product.description,
          ]
            .join(" ")
            .toLowerCase()
            .includes(query)
      );

  }


  // ===================================================
  // SORT
  // ===================================================

  switch (
    filters.sort
  ) {

    case "price-asc":

      result.sort(
        (a, b) =>
          a.price -
          b.price
      );

      break;


    case "price-desc":

      result.sort(
        (a, b) =>
          b.price -
          a.price
      );

      break;


    case "rating":

      result.sort(
        (a, b) =>
          b.rating -
          a.rating
      );

      break;


    case "discount":

      result.sort(
        (a, b) =>
          b.discount -
          a.discount
      );

      break;


    case "new":

      result.sort(
        (a, b) =>
          new Date(
            b.createdAt
          ).getTime() -
          new Date(
            a.createdAt
          ).getTime()
      );

      break;

  }


  return result;
}


// =====================================================
// PRODUCTS
// =====================================================

export const productService = {

  // ---------------------------------------------------
  // ALL PRODUCTS
  // ---------------------------------------------------

  list: async (
    filters?: ProductFilters
  ): Promise<Product[]> => {

    const response =
      await fetch(
        `${API_BASE}/products/`
      );


    if (!response.ok) {

      throw new Error(
        "Failed to fetch products"
      );

    }


    const data =
      await response.json();


    if (
      !Array.isArray(data)
    ) {

      console.error(
        "Products API returned invalid data:",
        data
      );

      return [];

    }


    const products =
      data
        .filter(
          (product: any) =>
            product.is_active
        )
        .map(
          mapDjangoProduct
        );


    return filterProducts(
      products,
      filters
    );

  },


  // ---------------------------------------------------
  // SYNC
  // ---------------------------------------------------

  listSync: () => {

    console.warn(
      "listSync() is deprecated. Use await productService.list()."
    );

    return [] as Product[];

  },


  // ---------------------------------------------------
  // GET PRODUCT
  // ---------------------------------------------------

  get: async (
    id: string
  ): Promise<Product | null> => {

    try {

      const response =
        await fetch(
          `${API_BASE}/products/`
        );


      if (!response.ok) {

        throw new Error(
          "Failed to fetch products"
        );

      }


      const data =
        await response.json();


      if (
        !Array.isArray(data)
      ) {

        return null;

      }


      const product =
        data.find(
          (item: any) =>
            String(item.id) ===
              String(id) ||
            item.slug === id
        );


      if (!product) {

        return null;

      }


      return mapDjangoProduct(
        product
      );

    } catch (error) {

      console.error(
        "Failed to get product:",
        error
      );

      return null;

    }

  },


  // ---------------------------------------------------
  // SYNC GET
  // ---------------------------------------------------

  getSync: () => {

    console.warn(
      "getSync() is deprecated. Use await productService.get()."
    );

    return null;

  },


  // ---------------------------------------------------
  // NEW DROPS
  // ---------------------------------------------------

 newDrops: async (n = 6): Promise<Product[]> => {
  const products = await productService.list();

  return products.slice(
    0,
    n
  );
},


  // ---------------------------------------------------
  // TRENDING
  // ---------------------------------------------------

  trending: async (
    n = 8
  ): Promise<Product[]> => {

    const products =
      await productService.list();


    return products.slice(
      0,
      n
    );

  },


  // ---------------------------------------------------
  // CATEGORY
  // ---------------------------------------------------

  byCategory: async (
    slug: string,
    n?: number
  ): Promise<Product[]> => {

    const response =
      await fetch(
        `${API_BASE}/products/`
      );


    if (!response.ok) {

      throw new Error(
        "Failed to fetch products"
      );

    }


    const data =
      await response.json();


    if (
      !Array.isArray(data)
    ) {

      return [];

    }


    const requested =
      String(slug)
        .toLowerCase()
        .trim();


    const filtered =
      data.filter(
        (product: any) =>
          product.is_active === true &&
          categoryMatches(
            product,
            requested
          )
      );


    const products =
      filtered.map(
        mapDjangoProduct
      );


    console.log(
      "CATEGORY:",
      requested,
      "PRODUCTS:",
      products.length
    );


    return n
      ? products.slice(
          0,
          n
        )
      : products;

  },


  // ---------------------------------------------------
  // RELATED
  // ---------------------------------------------------

  related: async (
    id: string,
    n = 4
  ): Promise<Product[]> => {

    const products =
      await productService.list();


    const current =
      products.find(
        (product) =>
          String(product.id) ===
          String(id)
      );


    if (!current) {

      return [];

    }


    return products
      .filter(
        (product) =>
          String(product.id) !==
            String(current.id) &&
          product.category ===
            current.category
      )
      .slice(
        0,
        n
      );

  },


  // ---------------------------------------------------
  // ALL
  // ---------------------------------------------------

  all: async (): Promise<Product[]> => {

    return productService.list();

  },

};


// =====================================================
// CATEGORIES
// =====================================================

export const categoryService = {

  list: async () => {

    const response =
      await fetch(
        `${API_BASE}/products/categories/`
      );


    if (!response.ok) {

      throw new Error(
        "Failed to fetch categories"
      );

    }


    return response.json();

  },


  listSync: () => {

    console.warn(
      "categoryService.listSync() is deprecated."
    );

    return [];

  },

};


// =====================================================
// ORDERS
// =====================================================

export const orderService = {

  list: async (): Promise<Order[]> => {

    const response =
      await fetch(
        `${API_BASE}/orders/`
      );


    if (!response.ok) {

      throw new Error(
        "Failed to fetch orders"
      );

    }


    return response.json();

  },


  listSync: () => {

    return [];

  },


  get: async (
    id: string
  ) => {

    const response =
      await fetch(
        `${API_BASE}/orders/${id}/`
      );


    if (!response.ok) {

      return null;

    }


    return response.json();

  },


  getSync: () => null,

};


// =====================================================
// REVIEWS
// =====================================================

export const reviewService = {

  list: async (): Promise<Review[]> => {

    const response =
      await fetch(
        `${API_BASE}/reviews/`
      );


    if (!response.ok) {

      throw new Error(
        "Failed to fetch reviews"
      );

    }


    return response.json();

  },


  forProduct: async (
    productId: string
  ) => {

    const response =
      await fetch(
        `${API_BASE}/reviews/?product=${productId}`
      );


    if (!response.ok) {

      throw new Error(
        "Failed to fetch product reviews"
      );

    }


    return response.json();

  },

};


// =====================================================
// COUPONS
// =====================================================

export const couponService = {

  list: async (): Promise<Coupon[]> => {

    const response =
      await fetch(
        `${API_BASE}/coupons/`
      );


    if (!response.ok) {

      throw new Error(
        "Failed to fetch coupons"
      );

    }


    return response.json();

  },


  validate: async (
    code: string,
    subtotal: number
  ) => {

    const response =
      await fetch(
        `${API_BASE}/coupons/validate/`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            code,
            subtotal,
          }),

        }
      );


    return response.json();

  },

};


// =====================================================
// CUSTOMERS
// =====================================================

export const customerService = {

  list: async () => {

    const response =
      await fetch(
        `${API_BASE}/customers/`
      );


    if (!response.ok) {

      throw new Error(
        "Failed to fetch customers"
      );

    }


    return response.json();

  },


  listSync: () => {

    return [];

  },

};