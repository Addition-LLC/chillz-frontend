"use client";

import PromotionCard from "@/components/Promotions/PromotionCard";
import { Toaster } from "react-hot-toast";

// Configuration for active promotions
const PROMOTIONS = [
  {
    id: "promo_welcome",
    title: "Welcome Offer",
    description: "New to our store? Enjoy 10% off your first order of premium hair extensions and wigs.",
    code: "WELCOME10",
    bgColor: "bg-black text-white",
  },
  {
    id: "promo_bundle",
    title: "Bundle & Save",
    description: "Get 15% off when you purchase any of our curated bundles. Perfect for a complete look.",
    code: "BUNDLE15",
    bgColor: "bg-gray-100 text-black border border-gray-200", 
  },
  {
    id: "promo_shipping",
    title: "Free Shipping",
    description: "Free standard shipping on all orders over $200. No code needed, applied automatically.",
    code: "FREESHIP",
    bgColor: "bg-black text-white",
  },
];

export default function PromotionsPage() {
  return (
    <div className="min-h-screen bg-white pt-28 pb-12 lg:pt-32">
      <div className="container mx-auto px-4">
        <Toaster position="bottom-center" />
        
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-black" style={{ fontFamily: 'var(--font-caviar-dreams)' }}>
            Current Promotions
          </h1>
          <p className="text-black/70 max-w-2xl mx-auto text-lg">
            Exclusive offers and deals just for you. Grab a code and start saving on your favorite styles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {PROMOTIONS.map((promo) => (
            <PromotionCard
              key={promo.id}
              title={promo.title}
              description={promo.description}
              code={promo.code}
              bgColor={promo.bgColor}
            />
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-sm text-gray-500">
            *Terms and conditions apply. Promotions cannot be combined unless otherwise stated.
          </p>
        </div>
      </div>
    </div>
  );
}
