"use client";

import medusaClient from "@/lib/medusa";
import { HttpTypes } from "@medusajs/types";
import React, { createContext, useContext, useEffect, useState } from "react";

interface CartContextType {
  cart?: HttpTypes.StoreCart;
  setCart: React.Dispatch<React.SetStateAction<HttpTypes.StoreCart | undefined>>; 
  refreshCart: () => void; 

  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  cartCount: number;
  totalPrice: number;
  addDiscount: (code: string) => Promise<HttpTypes.StoreCart | undefined>;
  removeDiscount: (code: string) => Promise<HttpTypes.StoreCart | undefined>;
  addMultipleToCart: (items: { variant_id: string; quantity: number }[]) => Promise<void>;
}

const CartContext = createContext<CartContextType | null>(null);

type CartProviderProps = {
  children: React.ReactNode;
};

export const CartProvider = ({ children }: CartProviderProps) => {
  const [cart, setCart] = useState<HttpTypes.StoreCart | undefined>();
  const [isCartOpen, setIsCartOpen] = useState(false);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  useEffect(() => {
    if (cart) {
      return;
    }

    const cartId = localStorage.getItem("cart_id");

    const initialize = async () => {
      if (!cartId) {
        try {
          console.log("No cart_id found, creating new cart...");
          const { cart: newCart } = await medusaClient.store.cart.create({});
          if (newCart) {
            localStorage.setItem("cart_id", newCart.id);
            setCart(newCart);
            console.log("New cart created:", newCart);
          }
        } catch (err: any) {
          console.error("Failed to create cart:", err);
          localStorage.removeItem("cart_id");
        }
      } else {
        try {
          console.log("Found cart_id, retrieving cart:", cartId);
          const { cart: retrievedCart } = await medusaClient.store.cart.retrieve(cartId);
          setCart(retrievedCart);
          console.log("Cart retrieved:", retrievedCart);
        } catch (err: any) {
          console.error("Failed to retrieve cart, removing cart_id:", err);
          localStorage.removeItem("cart_id");
          setCart(undefined); 
        }
      }
    };

    initialize();
  }, [cart]);

  const refreshCart = () => {
    console.log("Refreshing cart (clearing state and local storage)...");
    localStorage.removeItem("cart_id");
    setCart(undefined);
  };

  const addDiscount = async (code: string) => {
    if (!cart?.id) return;
    try {
      const { cart: updatedCart } = await medusaClient.store.cart.update(cart.id, {
        promo_codes: [code],
      });
      setCart(updatedCart);
      return updatedCart;
    } catch (error) {
      console.error("Error adding discount:", error);
      throw error;
    }
  };

  const removeDiscount = async (code: string) => {
    if (!cart?.id) return;
    try {
      // Filter out the code we want to remove
      const currentCodes = cart.promotions?.map(p => p.code).filter((c): c is string => c !== undefined) || [];
      const newCodes = currentCodes.filter(c => c !== code);
      
      const { cart: updatedCart } = await medusaClient.store.cart.update(cart.id, {
        promo_codes: newCodes,
      });
      setCart(updatedCart);
      return updatedCart;
    } catch (error) {
      console.error("Error removing discount:", error);
      throw error;
    }
  };

  const addMultipleToCart = async (items: { variant_id: string; quantity: number }[]) => {
    if (!cart?.id) {
      console.error("No cart available");
      throw new Error("No cart available");
    }
    
    try {
      // Add each item to the cart sequentially
      for (const item of items) {
        await medusaClient.store.cart.createLineItem(cart.id, {
          variant_id: item.variant_id,
          quantity: item.quantity,
        });
      }
      
      // Refresh cart after adding all items
      const { cart: updatedCart } = await medusaClient.store.cart.retrieve(cart.id);
      setCart(updatedCart);
    } catch (error) {
      console.error("Error adding multiple items to cart:", error);
      throw error;
    }
  };

  const cartCount = cart?.items?.reduce((acc: number, item: HttpTypes.StoreCartLineItem) => acc + Number(item.quantity), 0) || 0;
  const totalPrice = cart ? Number(cart.subtotal) : 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        refreshCart,
        isCartOpen,
        openCart,
        closeCart,
        cartCount,
        totalPrice,
        addDiscount,
        removeDiscount,
        addMultipleToCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};