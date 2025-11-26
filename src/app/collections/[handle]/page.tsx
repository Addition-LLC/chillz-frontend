import medusaClient from "@/lib/medusa";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { StoreProduct, StoreProductVariant, StoreRegion } from "@medusajs/types";
import Image from "next/image";
import ProductCard from "@/components/ProductCard";

export const revalidate = 60;

type Props = {
  params: { handle: string };
};

// Helper function to fetch the first region ID
async function getRegionId() {
  try {
    const { regions } = await medusaClient.store.region.list({ limit: 1 });
    return regions[0]?.id || null;
  } catch (error) {
    console.error("Failed to fetch regions:", error);
    return null;
  }
}

export default async function CollectionPage({ params }: Props) {
  const { handle } = await params;

  // --- Fetch Collection Details ---
  const { collections } = await medusaClient.store.collection.list({ handle: [handle] });
  const collection = collections[0];

  if (!collection) {
    notFound();
  }

  // --- Fetch Region ID for Pricing Context ---
  const regionId = await getRegionId();
  if (!regionId) {
    console.warn("No region found, prices might not include tax.");
  }

  // --- Fetch Products in the Collection with Price Fields ---
  const { products } = await medusaClient.store.product.list({
    collection_id: [collection.id],
    fields: "*variants.calculated_price",
    region_id: regionId || undefined,
  });

  // Fetch region details to get currency code for formatting
  const region = regionId ? (await medusaClient.store.region.retrieve(regionId)).region : undefined;

  return (
    <div className="bg-white min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl lg:text-7xl font-bold text-black mb-6" style={{ fontFamily: 'var(--font-caviar-dreams)' }}>
            {collection.title}
          </h1>
          <div className="w-24 h-1 bg-black mx-auto mb-8"></div>
          <p className="text-xl text-black/70 max-w-2xl mx-auto font-light" style={{ fontFamily: 'var(--font-caviar-dreams)' }}>
            Discover our exclusive selection of {collection.title.toLowerCase()}.
          </p>
        </div>

        {products && products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 lg:gap-12">
            {products.map((product: StoreProduct) => (
              <ProductCard key={product.id} product={product} region={region} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-2xl text-gray-400 mb-4" style={{ fontFamily: 'var(--font-caviar-dreams)' }}>No products found in this collection.</p>
            <Link href="/product" className="px-8 py-3 bg-black text-white font-bold hover:bg-gray-800 transition-colors">
              CONTINUE SHOPPING
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}