"use client";

import PromotionCard from "@/components/Promotions/PromotionCard";
import { Toaster } from "react-hot-toast";

// Configuration for active promotions
const PROMOTIONS: { id: string; title: string; description: string; code: string; bgColor: string }[] = [
  // {
  //   id: "promo_welcome",
  //   title: "Welcome Offer",
  //   description: "New to our store? Enjoy 10% off your first order of premium hair extensions and wigs.",
  //   code: "WELCOME10",
  //   bgColor: "bg-black text-white",
  // },
];

export default function PromotionsPage() {
  return (
    <div className="min-h-screen bg-white pt-28 pb-12 lg:pt-32">
      <div className="container mx-auto px-4">
        <Toaster position="bottom-center" />
        
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-black font-edwardian-first-letter" style={{ fontFamily: 'var(--font-caviar-dreams)' }}>
            Current Promotions
          </h1>
          <p className="text-black/70 max-w-2xl mx-auto text-lg">
            Exclusive offers and deals just for you. Grab a code and start saving on your favorite styles.
          </p>
        </div>

        {PROMOTIONS.length > 0 ? (
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
        ) : (
          <div className="flex flex-col items-center justify-center py-16">
            <p className="text-xl text-gray-500 mb-4">No active promotions at the moment.</p>
            <p className="text-gray-400">Check back later for exciting deals!</p>
          </div>
        )}

        <div className="mt-16 text-center">
          <p className="text-sm text-gray-500">
            *Terms and conditions apply. Promotions cannot be combined unless otherwise stated.
          </p>
        </div>
      </div>
    </div>
  );
}
