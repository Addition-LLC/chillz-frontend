"use client";

import medusaClient from "@/lib/medusa";
import { useCart } from "@/context/CartContext"; 
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { StoreProduct, StoreProductVariant, StoreRegion } from "@medusajs/types";
import toast from 'react-hot-toast';


async function getRegionId() {
  try {
    const { regions } = await medusaClient.store.region.list({ limit: 1 });
    return regions[0]?.id || null;
  } catch (error) {
    console.error("Failed to fetch regions:", error);
    return null;
  }
}

export default function ProductPage() {
  const { handle } = useParams();
  // Get cart, setCart, and openCart from the updated context
  const { cart, setCart, openCart } = useCart();

  const [product, setProduct] = useState<StoreProduct | null>(null);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [region, setRegion] = useState<StoreRegion | null>(null);

  useEffect(() => {
    const fetchProductAndRegion = async () => {
      setIsLoading(true);
      try {
        const regionId = await getRegionId();
        if (regionId) {
          const { region: regionData } = await medusaClient.store.region.retrieve(regionId);
          setRegion(regionData);
        } else {
          console.warn("No region found for pricing.");
        }

        if (typeof handle === "string") {
          const { products } = await medusaClient.store.product.list({
            handle,
            fields: "*variants.calculated_price", // Request prices
            region_id: regionId || undefined, // Provide context
          });
          const productData = products[0];

          if (productData) {
            setProduct(productData);
            setSelectedVariantId(productData.variants?.[0]?.id || null);
          }
        }
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProductAndRegion();
  }, [handle]);

  // Updated handleAddToCart function
  const handleAddToCart = async () => { // Make async
    const selectedVariant = product?.variants?.find(
      (v) => v.id === selectedVariantId
    );

    if (selectedVariantId && cart?.id && product) { // Ensure cart exists
      try {
        // 1. Call the Medusa SDK method directly
        const { cart: updatedCart } = await medusaClient.store.cart.createLineItem(cart.id, {
          variant_id: selectedVariantId,
          quantity: 1,
        });

        // 2. Update the global context state
        setCart(updatedCart);
        openCart(); // Open the cart panel
        toast.success(`${product.title} (${selectedVariant?.title || ''}) added to cart!`); // Use toast

      } catch (error) {
        console.error("Failed to add item to cart:", error);
        toast.error("Could not add item to cart.");
      }
    } else if (!cart?.id) {
        toast.error("Cart not available. Please refresh.");
    } else {
        toast.error("Please select a variant option.");
    }
  };

  // Find the currently selected variant object for price display
  const selectedVariant = product?.variants?.find(
    (v) => v.id === selectedVariantId
  ) as StoreProductVariant | undefined;

  // Updated formatPrice function
  const formatPrice = (variant: StoreProductVariant | undefined) => {
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

  if (isLoading) {
    return <div className="text-center py-20 pt-32 lg:pt-40">Loading product...</div>; // Adjusted padding
  }

  if (!product) {
    return <div className="text-center py-20 pt-32 lg:pt-40">Product not found.</div>; // Adjusted padding
  }

  return (
    <div className="container mx-auto px-4 py-12 pt-28 lg:pt-32"> {/* Consistent padding */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        <div>
          {product.thumbnail && (
            <img
              src={product.thumbnail}
              alt={product.title}
              className="w-full rounded-lg shadow-lg"
            />
          )}
          {/* Optional: Add gallery for more images */}
          {/* <div className="mt-4 grid grid-cols-4 gap-4">
              {product.images?.map((img) => (
                  <img key={img.id} src={img.url} alt="Product image" className="rounded cursor-pointer border-2 border-transparent hover:border-gray-400"/>
              ))}
          </div> */}
        </div>
        <div>
          <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: 'var(--font-playfair-display)' }}>{product.title}</h1>
          <p className="text-2xl font-semibold text-gray-800 mb-6">
            {formatPrice(selectedVariant)} {/* Display price of the selected variant */}
          </p>
          <p className="text-gray-600 mb-8">{product.description}</p>

          {/* Render variant selection only if variants exist */}
          {product.variants && product.variants.length > 0 && (
            <div className="mb-8">
              <label htmlFor="variant-select" className="block text-sm font-medium text-gray-700 mb-2">
                 {/* Dynamically get option title, default to 'Select Option' */}
                 {product.options?.[0]?.title || 'Select Option'}
              </label>
              <select
                id="variant-select"
                value={selectedVariantId || ''}
                onChange={(e) => setSelectedVariantId(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                {/* Default placeholder option */}
                {!selectedVariantId && <option value="" disabled>Select {product.options?.[0]?.title || 'an option'}</option>}

                {product.variants.map((variant: StoreProductVariant) => (
                  <option key={variant.id} value={variant.id}>
                    {variant.title} - {formatPrice(variant)}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            onClick={handleAddToCart}
            // Disable button if no variant is selected
            disabled={!selectedVariantId || isLoading}
            className="w-full bg-brand-brown text-white font-bold py-3 px-4 rounded-md hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}