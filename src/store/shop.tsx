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
  userWishlists?: Record<string, string[]>;
  user: User | null;
  recent: string[];
  placedOrders: Order[];
}


const EMPTY: Persisted = {
  cart: [],
  wishlist: [],
  userWishlists: {},
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

      const user = saved.user ?? null;
      const userWishlists = saved.userWishlists ?? {};

      let activeWishlist: string[] = [];
      if (user) {
        const userKey = user.email || user.id;
        activeWishlist = userWishlists[userKey] ?? saved.wishlist ?? [];
        userWishlists[userKey] = activeWishlist;
      }

      setState({
        ...EMPTY,
        ...saved,
        cart: saved.cart ?? [],
        wishlist: activeWishlist,
        userWishlists,
        recent: saved.recent ?? [],
        placedOrders:
          saved.placedOrders ?? [],
        user,
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

        const stringId = String(productId);

        setState((current) => {

          if (!current.user) {
            toast.error("Please sign in to save items to your wishlist.");
            return current;
          }

          const userKey = current.user.email || current.user.id || "default";
          const exists = current.wishlist.some(
            (id) => String(id) === stringId
          );

          if (exists) {

            toast("Removed from wishlist");

            const nextWishlist = current.wishlist.filter(
              (id) => String(id) !== stringId
            );

            return {
              ...current,
              wishlist: nextWishlist,
              userWishlists: {
                ...(current.userWishlists ?? {}),
                [userKey]: nextWishlist,
              },
            };

          } else {

            toast("Saved to wishlist");

            const nextWishlist = [
              stringId,
              ...current.wishlist.filter(
                (id) => String(id) !== stringId
              ),
            ];

            return {
              ...current,
              wishlist: nextWishlist,
              userWishlists: {
                ...(current.userWishlists ?? {}),
                [userKey]: nextWishlist,
              },
            };

          }

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

        const stringId = String(productId);

        setState((current) => {

          const nextWishlist = current.wishlist.filter(
            (id) => String(id) !== stringId
          );

          const userKey = current.user?.email || current.user?.id;
          const userWishlists = userKey
            ? {
                ...(current.userWishlists ?? {}),
                [userKey]: nextWishlist,
              }
            : (current.userWishlists ?? {});

          return {
            ...current,
            wishlist: nextWishlist,
            userWishlists,
          };

        });

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

        const newUser: User = {
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
        };

        setState((current) => {
          const userKey = newUser.email || newUser.id;
          const userWishlist = current.userWishlists?.[userKey] ?? [];

          return {
            ...current,
            user: newUser,
            wishlist: userWishlist,
          };
        });

      },
      []
    );


  // ===================================================
  // LOGOUT
  // ===================================================

  const logout =
    useCallback(
      () => {

        setState((current) => {
          const userKey = current.user?.email || current.user?.id;
          const userWishlists = userKey
            ? {
                ...(current.userWishlists ?? {}),
                [userKey]: current.wishlist,
              }
            : (current.userWishlists ?? {});

          return {
            ...current,
            user: null,
            wishlist: [],
            userWishlists,
          };
        });

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
      (productId) => {
        if (!state.user) {
          return false;
        }
        const stringId = String(productId);
        return state.wishlist.some(
          (id) => String(id) === stringId
        );
      },

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