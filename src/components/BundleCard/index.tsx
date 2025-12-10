'use client';

import Image from 'next/image';
import { useCart } from "@/context/CartContext";
import toast from 'react-hot-toast';

interface BundleCardProps {
  title: string;
  description: string;
  price: string;
  image: string;
  items: { variant_id: string; quantity: number }[];
  discountCode?: string;
}

export default function BundleCard({ title, description, price, image, items, discountCode }: BundleCardProps) {
  const { addMultipleToCart } = useCart();

  const handleAddBundle = async () => {
    try {
      await addMultipleToCart(items);
      toast.success(`${title} added to cart!`);
      
      if (discountCode) {
        toast.success(`Use code: ${discountCode} at checkout`);
      }
    } catch (error) {
      console.error("Error adding bundle to cart:", error);
      toast.error("Failed to add bundle. Please try again.");
    }
  };

  return (
    <div className="group bg-white border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Image */}
      <div className="relative h-80 w-full overflow-hidden">
        <Image 
          src={image || '/placeholder.png'} 
          alt={title} 
          fill
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 
          className="text-2xl font-bold text-black mb-3 font-edwardian-first-letter"
          style={{ fontFamily: 'var(--font-caviar-dreams)' }}
        >
          {title}
        </h3>
        <p className="text-gray-600 mb-4 line-clamp-2">
          {description}
        </p>
        <div className="flex items-center justify-between mb-4">
          <span className="text-3xl font-bold text-black" style={{ fontFamily: 'var(--font-caviar-dreams)' }}>
            {price}
          </span>
          {discountCode && (
            <span className="text-sm bg-black text-white px-3 py-1 uppercase tracking-wider">
              {discountCode}
            </span>
          )}
        </div>
        <button
          onClick={handleAddBundle}
          className="w-full px-6 py-3 bg-black text-white font-bold text-sm uppercase tracking-widest hover:bg-gray-800 transition-colors"
        >
          Add Bundle to Cart
        </button>
      </div>
    </div>
  );
}
