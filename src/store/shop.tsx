import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { toast } from "sonner";

import type {
  CartItem,
  Order,
  Product,
  User,
} from "@/types";

import { productService } from "@/services/api";

import { orders as seedOrders } from "@/data/catalog";


// =====================================================
// STORAGE
// =====================================================

const KEY = "nova.state.v1";


// =====================================================
// PERSISTED STATE
// =====================================================

interface Persisted {
  cart: CartItem[];
  wishlist: string[];
  user: User | null;
  recent: string[];
  placedOrders: Order[];
}


const EMPTY: Persisted = {
  cart: [],
  wishlist: [],
  user: null,
  recent: [],
  placedOrders: [],
};


// =====================================================
// CONTEXT TYPE
// =====================================================

interface ShopContextValue extends Persisted {

  cartCount: number;

  cartDetailed: {
    item: CartItem;
    product: Product;
  }[];

  subtotal: number;

  mrpTotal: number;

  addToCart: (
    productId: string,
    size: string,
    color: string,
    quantity?: number
  ) => void;

  updateQty: (
    id: string,
    quantity: number
  ) => void;

  removeFromCart: (
    id: string
  ) => void;

  clearCart: () => void;

  toggleWishlist: (
    productId: string
  ) => void;

  isWishlisted: (
    productId: string
  ) => boolean;

  removeFromWishlist: (
    productId: string
  ) => void;

  markViewed: (
    productId: string
  ) => void;

  login: (
    email: string,
    name?: string
  ) => void;

  logout: () => void;

  placeOrder: (
    order: Order
  ) => void;

  searchOpen: boolean;

  setSearchOpen: (
    value: boolean
  ) => void;

  allOrders: Order[];
}


// =====================================================
// CONTEXT
// =====================================================

const ShopContext =
  createContext<ShopContextValue | null>(
    null
  );


// =====================================================
// PROVIDER
// =====================================================

export function ShopProvider({
  children,
}: {
  children: ReactNode;
}) {

  const [state, setState] =
    useState<Persisted>(EMPTY);

  const [searchOpen, setSearchOpen] =
    useState(false);


  // ===================================================
  // LOAD SAVED STATE
  // ===================================================

  useEffect(() => {

    try {

      const raw =
        localStorage.getItem(KEY);

      if (!raw) {
        return;
      }

      const saved =
        JSON.parse(raw) as Partial<Persisted>;

      setState({
        ...EMPTY,
        ...saved,
        cart: saved.cart ?? [],
        wishlist: saved.wishlist ?? [],
        recent: saved.recent ?? [],
        placedOrders:
          saved.placedOrders ?? [],
        user:
          saved.user ?? null,
      });

    } catch (error) {

      console.error(
        "Failed to load NØVA state:",
        error
      );

    }

  }, []);


  // ===================================================
  // SAVE STATE
  // ===================================================

  useEffect(() => {

    try {

      localStorage.setItem(
        KEY,
        JSON.stringify(state)
      );

    } catch (error) {

      console.error(
        "Failed to save NØVA state:",
        error
      );

    }

  }, [state]);


  // ===================================================
  // ADD TO CART
  // ===================================================

  const addToCart =
    useCallback(
      (
        productId: string,
        size: string,
        color: string,
        quantity = 1
      ) => {

        setState((current) => {

          const id =
            `${productId}__${size}__${color}`;

          const existing =
            current.cart.find(
              (item) =>
                item.id === id
            );


          if (existing) {

            return {

              ...current,

              cart:
                current.cart.map(
                  (item) =>
                    item.id === id
                      ? {
                          ...item,
                          quantity:
                            item.quantity +
                            quantity,
                        }
                      : item
                ),

            };

          }


          return {

            ...current,

            cart: [
              ...current.cart,

              {
                id,
                productId,
                size,
                color,
                quantity,
              },
            ],

          };

        });


        toast.success(
          "Added to bag"
        );

      },
      []
    );


  // ===================================================
  // UPDATE QUANTITY
  // ===================================================

  const updateQty =
    useCallback(
      (
        id: string,
        quantity: number
      ) => {

        setState((current) => ({

          ...current,

          cart:
            quantity <= 0

              ? current.cart.filter(
                  (item) =>
                    item.id !== id
                )

              : current.cart.map(
                  (item) =>
                    item.id === id
                      ? {
                          ...item,
                          quantity,
                        }
                      : item
                ),

        }));

      },
      []
    );


  // ===================================================
  // REMOVE FROM CART
  // ===================================================

  const removeFromCart =
    useCallback(
      (id: string) => {

        setState((current) => ({

          ...current,

          cart:
            current.cart.filter(
              (item) =>
                item.id !== id
            ),

        }));

        toast(
          "Removed from bag"
        );

      },
      []
    );


  // ===================================================
  // CLEAR CART
  // ===================================================

  const clearCart =
    useCallback(
      () => {

        setState((current) => ({
          ...current,
          cart: [],
        }));

      },
      []
    );


  // ===================================================
  // WISHLIST
  // ===================================================

  const toggleWishlist =
    useCallback(
      (productId: string) => {

        setState((current) => {

          const exists =
            current.wishlist.includes(
              productId
            );


          if (exists) {

            toast(
              "Removed from wishlist"
            );

          } else {

            toast(
              "Saved to wishlist"
            );

          }


          return {

            ...current,

            wishlist:

              exists

                ? current.wishlist.filter(
                    (id) =>
                      id !== productId
                  )

                : [
                    productId,
                    ...current.wishlist,
                  ],

          };

        });

      },
      []
    );


  // ===================================================
  // REMOVE FROM WISHLIST
  // ===================================================

  const removeFromWishlist =
    useCallback(
      (productId: string) => {

        setState((current) => ({

          ...current,

          wishlist:
            current.wishlist.filter(
              (id) =>
                id !== productId
            ),

        }));

      },
      []
    );


  // ===================================================
  // RECENTLY VIEWED
  // ===================================================

  const markViewed =
    useCallback(
      (productId: string) => {

        setState((current) => ({

          ...current,

          recent: [
            productId,

            ...current.recent.filter(
              (id) =>
                id !== productId
            ),

          ].slice(0, 8),

        }));

      },
      []
    );


  // ===================================================
  // LOGIN
  // ===================================================

  const login =
    useCallback(
      (
        email: string,
        name?: string
      ) => {

        setState((current) => ({

          ...current,

          user: {

            id: "usr-local",

            name:
              name ||
              email.split("@")[0] ||
              "NØVA Member",

            email,

            joinedAt:
              new Date().toISOString(),

            role:
              email
                .toLowerCase()
                .startsWith("admin")
                ? "admin"
                : "customer",

          },

        }));

      },
      []
    );


  // ===================================================
  // LOGOUT
  // ===================================================

  const logout =
    useCallback(
      () => {

        setState((current) => ({

          ...current,

          user: null,

        }));

      },
      []
    );


  // ===================================================
  // PLACE ORDER
  // ===================================================

  const placeOrder =
    useCallback(
      (order: Order) => {

        setState((current) => ({

          ...current,

          placedOrders: [
            order,
            ...current.placedOrders,
          ],

          cart: [],

        }));

      },
      []
    );


  // ===================================================
  // LOAD PRODUCTS FOR CART
  // ===================================================

  const [cartProducts, setCartProducts] =
    useState<Record<string, Product>>({});


  useEffect(() => {

    let cancelled = false;


    async function loadProducts() {

      if (state.cart.length === 0) {

        setCartProducts({});

        return;

      }


      const products: Record<
        string,
        Product
      > = {};


      for (
        const item of state.cart
      ) {

        try {

          const product =
            await productService.get(
              item.productId
            );


          if (
            product &&
            !cancelled
          ) {

            products[
              String(item.productId)
            ] = product;

          }

        } catch (error) {

          console.error(
            `Failed to load product ${item.productId}:`,
            error
          );

        }

      }


      if (!cancelled) {

        setCartProducts(
          products
        );

      }

    }


    loadProducts();


    return () => {

      cancelled = true;

    };

  }, [state.cart]);


  // ===================================================
  // CART DETAILED
  // ===================================================

  const cartDetailed =
    useMemo(() => {

      return state.cart

        .map((item) => {

          const product =
            cartProducts[
              String(item.productId)
            ];


          if (!product) {

            return null;

          }


          return {
            item,
            product,
          };

        })

        .filter(
          (
            value
          ): value is {
            item: CartItem;
            product: Product;
          } =>
            value !== null
        );

    }, [
      state.cart,
      cartProducts,
    ]);


  // ===================================================
  // SUBTOTAL
  // ===================================================

  const subtotal =
    cartDetailed.reduce(
      (
        total,
        { item, product }
      ) =>
        total +
        Number(product.price) *
          item.quantity,

      0
    );


  // ===================================================
  // MRP TOTAL
  // ===================================================

  const mrpTotal =
    cartDetailed.reduce(
      (
        total,
        { item, product }
      ) =>
        total +
        Number(product.originalPrice) *
          item.quantity,

      0
    );


  // ===================================================
  // CONTEXT VALUE
  // ===================================================

  const value: ShopContextValue = {

    ...state,

    cartCount:
      state.cart.reduce(
        (
          total,
          item
        ) =>
          total +
          item.quantity,

        0
      ),

    cartDetailed,

    subtotal,

    mrpTotal,

    addToCart,

    updateQty,

    removeFromCart,

    clearCart,

    toggleWishlist,

    isWishlisted:
      (productId) =>
        state.wishlist.includes(
          productId
        ),

    removeFromWishlist,

    markViewed,

    login,

    logout,

    placeOrder,

    searchOpen,

    setSearchOpen,

    allOrders: [
      ...state.placedOrders,
      ...seedOrders,
    ],

  };


  return (
    <ShopContext.Provider
      value={value}
    >
      {children}
    </ShopContext.Provider>
  );
}


// =====================================================
// USE SHOP
// =====================================================

export function useShop() {

  const context =
    useContext(
      ShopContext
    );


  if (!context) {

    throw new Error(
      "useShop must be used inside ShopProvider"
    );

  }


  return context;
}