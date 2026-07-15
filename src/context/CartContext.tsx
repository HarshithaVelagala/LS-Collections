"use client";

import { createContext, useContext, useState, useEffect } from "react";

export interface CartItem {
  productId: string;
  name: string;
  image: string;
  slug: string;
  price: number;
  quantity: number;
  variantSku?: string;
  variantName?: string;
  personalization?: Record<string, string>;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string, variantSku?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantSku?: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("ls_collections_cart");
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (e) {
      console.error("Failed to load cart from localStorage", e);
    }
    setIsLoaded(true);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem("ls_collections_cart", JSON.stringify(cart));
    } catch (e) {
      console.error("Failed to save cart to localStorage", e);
    }
  }, [cart, isLoaded]);

  const addToCart = (newItem: CartItem) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(
        (item) =>
          item.productId === newItem.productId && item.variantSku === newItem.variantSku
      );

      if (existingItemIndex > -1) {
        // Item exists, update quantity
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: updatedCart[existingItemIndex].quantity + newItem.quantity,
        };
        return updatedCart;
      }

      // New item, append
      return [...prevCart, newItem];
    });
    setIsCartOpen(true); // Open drawer for immediate feedback
  };

  const removeFromCart = (productId: string, variantSku?: string) => {
    setCart((prevCart) =>
      prevCart.filter(
        (item) => !(item.productId === productId && item.variantSku === variantSku)
      )
    );
  };

  const updateQuantity = (productId: string, quantity: number, variantSku?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, variantSku);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.productId === productId && item.variantSku === variantSku
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
