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