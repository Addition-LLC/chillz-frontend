"use client";

import { useEffect, useState } from "react";
import medusaClient from "@/lib/medusa";
import BundleComponent from "@/components/BundleCard";
import { StoreProduct } from "@medusajs/types";

// Define bundle configurations
// In a real app, this might come from a CMS or backend service
const BUNDLE_DEFINITIONS = [
  {
    id: "bundle_starter",
    title: "The Essentials Starter Kit",
    description: "Everything you need to get started. Includes our premium wig and essential care items.",
    discountCode: "STARTER10", // Example code
    image: "/images/bundles/starter.jpg", // Placeholder, will use product image if not found
    items: [
      { keywords: ["straight", "body wave"], quantity: 1 },
      { keywords: ["curly", "deep wave"], quantity: 1 }
    ]
  },
  {
    id: "bundle_glam",
    title: "Ultimate Glamour Set",
    description: "Turn heads with this full volume set. Perfect for special occasions.",
    discountCode: "GLAM20",
    image: "/images/bundles/glam.jpg",
    items: [
      { keywords: ["blonde", "613"], quantity: 1 },
      { keywords: ["closure", "frontal"], quantity: 1 }
    ]
  },
  {
    id: "bundle_bulk",
    title: "Stylist Bulk Pack",
    description: "Stock up and save. Get 3 of our best-selling textures.",
    discountCode: "BULK15",
    image: "/images/bundles/bulk.jpg",
    items: [
      { keywords: ["straight"], quantity: 1 },
      { keywords: ["body wave"], quantity: 1 },
      { keywords: ["deep wave"], quantity: 1 }
    ]
  }
];

export default function BundlesPage() {
  const [loading, setLoading] = useState(true);
  const [bundles, setBundles] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { products } = await medusaClient.store.product.list({
          limit: 100,
          fields: "*variants.calculated_price,*variants.prices"
        });
        generateBundles(products);
      } catch (error) {
        console.error("Error fetching products for bundles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const generateBundles = (availableProducts: StoreProduct[]) => {
    const generatedBundles = BUNDLE_DEFINITIONS.map(def => {
      const bundleItems: { variant_id: string; quantity: number }[] = [];
      let totalPrice = 0;
      let currencyCode = "USD";
      let mainImage = "";

      // Try to find products matching keywords
      for (const itemDef of def.items) {
        const match = availableProducts.find(p => 
          itemDef.keywords.some(k => p.title?.toLowerCase().includes(k) || p.handle?.toLowerCase().includes(k))
        );

        if (match && match.variants?.[0]) {
          bundleItems.push({
            variant_id: match.variants[0].id,
            quantity: itemDef.quantity
          });
          
          // Calculate price (simplified)
          const price = match.variants[0].calculated_price?.calculated_amount || 0;
          totalPrice += price * itemDef.quantity;
          currencyCode = match.variants[0].calculated_price?.currency_code || "USD";
          
          if (!mainImage) mainImage = match.thumbnail || "";
        }
      }

      // Only create bundle if we found at least one item
      if (bundleItems.length > 0) {
        return {
          ...def,
          price: new Intl.NumberFormat('en-US', { style: 'currency', currency: currencyCode }).format(totalPrice),
          image: mainImage || def.image, // Fallback to product image if bundle image missing
          items: bundleItems
        };
      }
      return null;
    }).filter(Boolean);

    // If no specific bundles could be made (e.g. no matching keywords), create a generic one from first 2 products
    if (generatedBundles.length === 0 && availableProducts.length >= 2) {
      const p1 = availableProducts[0];
      const p2 = availableProducts[1];
      
      if (p1.variants?.[0] && p2.variants?.[0]) {
         const price1 = p1.variants[0].calculated_price?.calculated_amount || 0;
         const price2 = p2.variants[0].calculated_price?.calculated_amount || 0;
         const total = price1 + price2;
         const currency = p1.variants[0].calculated_price?.currency_code || "USD";

         generatedBundles.push({
           id: "bundle_generic",
           title: "Best Sellers Duo",
           description: `Get our popular ${p1.title} and ${p2.title} together!`,
           price: new Intl.NumberFormat('en-US', { style: 'currency', currency: currency }).format(total),
           image: p1.thumbnail || "",
           discountCode: "", // No discount for generic bundle
           items: [
             { variant_id: p1.variants[0].id, quantity: 1 },
             { variant_id: p2.variants[0].id, quantity: 1 }
           ]
         });
      }
    }

    setBundles(generatedBundles);
  };

  return (
    <div className="min-h-screen bg-white pt-28 pb-12 lg:pt-32">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-black" style={{ fontFamily: 'var(--font-caviar-dreams)' }}>
            Curated Bundles
          </h1>
          <p className="text-black/70 max-w-2xl mx-auto">
            Save more when you buy together. Explore our hand-picked sets designed for the perfect look.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {[1, 2, 3].map(i => (
               <div key={i} className="h-96 bg-white rounded-none animate-pulse shadow-sm border border-gray-100"></div>
             ))}
          </div>
        ) : bundles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {bundles.map((bundle, index) => (
              <BundleComponent
                key={index}
                title={bundle.title}
                description={bundle.description}
                price={bundle.price}
                image={bundle.image}
                items={bundle.items}
                discountCode={bundle.discountCode}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-none shadow-sm border border-gray-100">
            <h3 className="text-2xl font-bold text-black mb-2">Coming Soon</h3>
            <p className="text-gray-500">We are currently curating new bundles for you. Check back later!</p>
          </div>
        )}
      </div>
    </div>
  );
}
