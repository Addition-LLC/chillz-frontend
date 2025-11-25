"use client";

import medusaClient from "@/lib/medusa";
import { useCart } from "@/context/CartContext";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { StoreProduct, StoreProductVariant, StoreRegion } from "@medusajs/types";
import toast, { Toaster } from 'react-hot-toast';
import Image from "next/image"; 
import { Check } from "lucide-react"; 

// Helper function to get region (can be moved to a shared util)
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
  const { cart, setCart, openCart } = useCart();

  const [product, setProduct] = useState<StoreProduct | null>(null);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [region, setRegion] = useState<StoreRegion | null>(null);
  const [activeImage, setActiveImage] = useState<string | null>(null);

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
            fields: "*variants.calculated_price,*images", 
            region_id: regionId || undefined,
          });
          const productData = products[0];

          if (productData) {
            setProduct(productData);
            setSelectedVariantId(productData.variants?.[0]?.id || null);
            setActiveImage(productData.thumbnail || productData.images?.[0]?.url || null);
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

  const handleAddToCart = async () => {
    const selectedVariant = product?.variants?.find(
      (v) => v.id === selectedVariantId
    );

    if (selectedVariantId && cart?.id && product) {
      try {
        const { cart: updatedCart } = await medusaClient.store.cart.createLineItem(cart.id, {
          variant_id: selectedVariantId,
          quantity: 1,
        });
        setCart(updatedCart);
        openCart();
        toast.success(`${product.title} (${selectedVariant?.title || ''}) added to cart!`);
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

  const selectedVariant = product?.variants?.find(
    (v) => v.id === selectedVariantId
  ) as StoreProductVariant | undefined;

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
    return (
      <div className="container mx-auto px-4 py-12 pt-28 lg:pt-32 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <div>
            <div className="w-full h-[400px] lg:h-[550px] bg-gray-200 rounded-none"></div>
            <div className="mt-4 grid grid-cols-4 gap-4">
              <div className="w-full h-24 bg-gray-200 rounded-none"></div>
              <div className="w-full h-24 bg-gray-200 rounded-none"></div>
            </div>
          </div>
          <div>
            <div className="h-10 bg-gray-200 rounded-none w-3/4 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded-none w-1/4 mb-6"></div>
            <div className="h-20 bg-gray-200 rounded-none w-full mb-8"></div>
            <div className="h-6 bg-gray-200 rounded-none w-1/3 mb-4"></div>
            <div className="flex gap-2">
              <div className="h-10 w-20 bg-gray-200 rounded-none"></div>
              <div className="h-10 w-20 bg-gray-200 rounded-none"></div>
              <div className="h-10 w-20 bg-gray-200 rounded-none"></div>
            </div>
            <div className="h-14 bg-gray-200 rounded-none mt-8"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return <div className="text-center py-20 pt-32 lg:pt-40">Product not found.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-12 pt-28 lg:pt-32">
      <Toaster position="bottom-right" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-start">
        {/* Image Gallery */}
        <div>
          <div className="relative w-full h-[400px] lg:h-[550px] rounded-none overflow-hidden shadow-none border border-gray-100">
            {activeImage && (
              <Image
                src={activeImage}
                alt={product.title}
                fill
                priority
                className="object-cover transition-opacity duration-300"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            )}
          </div>
          <div className="mt-4 grid grid-cols-4 gap-4">
            {product.thumbnail && (
              <div 
                className={`relative w-full h-24 rounded-none cursor-pointer overflow-hidden border-2 transition-all duration-200 ${activeImage === product.thumbnail ? 'border-black' : 'border-transparent opacity-70 hover:opacity-100'}`}
                onClick={() => setActiveImage(product.thumbnail!)}
              >
                <Image src={product.thumbnail} alt="Thumbnail" fill className="object-cover" />
              </div>
            )}
            {product.images?.map((img) => (
              <div 
                key={img.id}
                className={`relative w-full h-24 rounded-none cursor-pointer overflow-hidden border-2 transition-all duration-200 ${activeImage === img.url ? 'border-black' : 'border-transparent opacity-70 hover:opacity-100'}`}
                onClick={() => setActiveImage(img.url)}
              >
                <Image src={img.url} alt="Product image" fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-4xl font-bold mb-4 text-black" style={{ fontFamily: 'var(--font-caviar-dreams)' }}>{product.title}</h1>
          <p className="text-3xl font-semibold text-black mb-6" style={{ fontFamily: 'var(--font-lato)' }}>
            {formatPrice(selectedVariant)}
          </p>
          <p className="text-gray-600 mb-8 leading-relaxed">{product.description}</p>

          {product.variants && product.variants.length > 0 && (
            <div className="mb-8">
              <label className="block text-sm font-bold text-black mb-3 uppercase tracking-wider">
                 {product.options?.[0]?.title || 'Select Option'}
              </label>
              <div className="flex flex-wrap gap-3">
                {product.variants.map((variant: StoreProductVariant) => {
                  const isSelected = variant.id === selectedVariantId;
                  return (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariantId(variant.id)}
                      className={`relative px-6 py-3 rounded-none text-sm font-bold border
                        transition-all duration-200 
                        ${isSelected
                          ? 'bg-black text-white border-black shadow-lg' 
                          : 'bg-white text-black border-gray-200 hover:border-black hover:bg-gray-50'
                        }
                      `}
                    >
                      {isSelected && (
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                          <span className="relative inline-flex rounded-none h-3 w-3 bg-white border border-black items-center justify-center">
                          </span>
                        </span>
                      )}
                      {variant.title}
                    </button>
                  );
                })}
              </div>
            </div>
          )}


          <button
            onClick={handleAddToCart}
            disabled={!selectedVariantId || isLoading}
            className="w-full bg-black text-white font-bold py-4 px-6 rounded-none hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg shadow-lg hover:shadow-xl"
            style={{fontFamily: 'var(--font-caviar-dreams'}}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}