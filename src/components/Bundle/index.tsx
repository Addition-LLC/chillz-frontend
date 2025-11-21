"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import medusaClient from "@/lib/medusa";
import { ShoppingBag } from "lucide-react";
import Image from "next/image";

interface BundleItem {
  variant_id: string;
  quantity: number;
}

interface BundleProps {
  title: string;
  description?: string;
  price: string;
  image: string;
  items: BundleItem[];
  discountCode?: string;
}

export default function BundleComponent({
  title,
  description,
  price,
  image,
  items,
  discountCode,
}: BundleProps) {
  const { cart, setCart, addDiscount, openCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddBundle = async () => {
    if (!cart?.id) return;
    setIsAdding(true);

    try {
      // Add all items to cart sequentially
      // Note: In a real app, you might want to use a custom endpoint to add multiple items at once for atomicity
      for (const item of items) {
        await medusaClient.store.cart.createLineItem(cart.id, {
          variant_id: item.variant_id,
          quantity: item.quantity,
        });
      }

      // Apply discount code if provided
      if (discountCode) {
        await addDiscount(discountCode);
      }

      // Refresh cart state
      const { cart: updatedCart } = await medusaClient.store.cart.retrieve(cart.id);
      setCart(updatedCart);
      openCart();
    } catch (error) {
      console.error("Failed to add bundle to cart:", error);
      // Handle error (e.g., show toast)
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-brand-brown/10 group hover:shadow-xl transition-all duration-300">
      <div className="relative h-64 overflow-hidden">
        <Image 
          src={image} 
          alt={title} 
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60"></div>
        <div className="absolute bottom-4 left-4 text-white">
          <h3 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-caviar-dreams)' }}>{title}</h3>
          <p className="text-sm opacity-90">{price}</p>
        </div>
      </div>
      
      <div className="p-6">
        {description && <p className="text-brand-brown/70 mb-6 text-sm leading-relaxed">{description}</p>}
        
        <button
          onClick={handleAddBundle}
          disabled={isAdding}
          className="w-full bg-brand-brown text-white font-bold py-3 px-6 rounded-full hover:bg-brand-pink transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group-hover:translate-y-[-2px]"
        >
          {isAdding ? (
            <div className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
          ) : (
            <>
              <ShoppingBag size={18} />
              Add Bundle
            </>
          )}
        </button>
      </div>
    </div>
  );
}
