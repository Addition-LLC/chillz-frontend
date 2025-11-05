import medusaClient from "@/lib/medusa";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { StoreProduct, StoreProductVariant, StoreRegion } from "@medusajs/types";

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

  const formatPrice = (product: StoreProduct, region: StoreRegion | undefined) => {
    const variant = product.variants?.[0] as StoreProductVariant | undefined;
    const priceObject = variant?.calculated_price;
    const amount = priceObject?.calculated_amount;
    const currencyCode = region?.currency_code || 'USD';

    if (amount === undefined || amount === null) {
        return "N/A";
    }

    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
    }).format(Number(amount));
  };

  // Fetch region details to get currency code for formatting
  const region = regionId ? (await medusaClient.store.region.retrieve(regionId)).region : undefined;

  return (
    <div className="container mx-auto px-4 py-24">
      <h1 className="text-4xl font-bold mb-4 text-center" style={{ fontFamily: 'var(--font-playfair-display)' }}>
        {collection.title}
      </h1>

      {/* FIX: Add introductory text */}
      <p className="text-lg text-center text-gray-600 mb-10">
        Browse products in the {collection.title} collection:
      </p>

      {products && products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product: StoreProduct) => (
            <Link
              key={product.id}
              href={`/product/${product.handle}`}
              className="group block rounded-lg border p-4 shadow-md transition-transform hover:scale-105"
            >
              {product.thumbnail && (
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  className="mb-4 h-64 w-full rounded object-cover"
                />
              )}
              <h2 className="text-xl font-semibold text-gray-800 transition-colors group-hover:text-blue-600">
                {product.title}
              </h2>
              <p className="mt-2 text-lg font-medium text-gray-700">
                Starts at {formatPrice(product, region)}
              </p>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No products found in this collection.</p>
      )}
    </div>
  );
}