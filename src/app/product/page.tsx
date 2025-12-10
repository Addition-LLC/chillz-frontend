"use client";

import medusaClient from "@/lib/medusa";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { StoreProduct, StoreRegion, HttpTypes} from "@medusajs/types";
import { useEffect, useState, Suspense } from "react";
import { Search, X } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import Image from "next/image";
import ProductCard from "@/components/ProductCard";

const styleTagValues = [
  "Straight",
  "Wavy",
  "Curly",
  "Kinky Curly",
  "Kinky Straight",
  "Afro Curly",
];

async function getRegionId() {
  try {
    const { regions } = await medusaClient.store.region.list({ limit: 1 });
    return regions[0]?.id || null;
  } catch (error) {
    console.error("Failed to fetch regions:", error);
    toast.error("Failed to load region data.");
    return null;
  }
}

function ShopPageClient() {
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [collections, setCollections] = useState<HttpTypes.StoreCollection[]>([]);
  const [region, setRegion] = useState<StoreRegion | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [availableTags, setAvailableTags] = useState<Array<{ id: string; value: string }>>([]);

  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("created_at_desc");

  useEffect(() => {
    const fetchStaticData = async () => {
      try {
        const [regionData, collectionData, productsData] = await Promise.all([
          getRegionId().then(id => id ? medusaClient.store.region.retrieve(id) : null),
          medusaClient.store.collection.list(),
          medusaClient.store.product.list({ limit: 250, fields: "*tags" })
        ]);

        if (regionData) {
          setRegion(regionData.region);
        }
        setCollections(collectionData.collections);

        // Extract unique tags from products that match style tag values
        const tagMap = new Map<string, string>();
        productsData.products.forEach((product: StoreProduct) => {
          if (product.tags && Array.isArray(product.tags)) {
            product.tags.forEach((tag: any) => {
              // Handle different tag structures
              const tagId = tag.id || tag;
              const tagValue = typeof tag === 'string' ? tag : (tag.value || tag.name || tag.title || "");
              
              if (!tagId || !tagValue) return;
              
              // Find matching style value (case-insensitive, partial match)
              const matchingStyleValue = styleTagValues.find(styleValue =>
                tagValue.toLowerCase().includes(styleValue.toLowerCase()) ||
                styleValue.toLowerCase().includes(tagValue.toLowerCase())
              );
              if (matchingStyleValue && !tagMap.has(matchingStyleValue)) {
                tagMap.set(matchingStyleValue, tagId);
              }
            });
          }
        });

        // Create style tags array with actual tag IDs from products
        const styleTags = styleTagValues
          .map(value => {
            // Try exact match first
            let tagId = tagMap.get(value);
            // If no exact match, try case-insensitive or partial match
            if (!tagId) {
              const entry = Array.from(tagMap.entries()).find(([key]) => 
                key.toLowerCase() === value.toLowerCase()
              );
              tagId = entry?.[1];
            }
            return tagId ? { id: tagId, value } : null;
          })
          .filter((tag): tag is { id: string; value: string } => tag !== null);

        setAvailableTags(styleTags);
      } catch (error) {
        console.error("Failed to fetch initial data:", error);
      }
    };
    fetchStaticData();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!region) return; 

      setIsLoading(true);
      
      const params: HttpTypes.StoreProductListParams = {
        region_id: region.id,
        fields: "*variants.calculated_price",
      };

      if (searchQuery) {
        params.q = searchQuery;
      }
      if (selectedCollections.length > 0) {
        params.collection_id = selectedCollections;
      }
      if (selectedTags.length > 0) {
        params.tag_id = selectedTags;
      }

      switch (sortBy) {
        case "price_asc":
          params.order = "variants.calculated_price";
          break;
        case "price_desc":
          params.order = "-variants.calculated_price";
          break;
        case "created_at_desc":
        default:
          params.order = "-created_at";
          break;
      }

      try {
        const { products } = await medusaClient.store.product.list(params);
        setProducts(products);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        toast.error("Failed to load products.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [searchQuery, selectedCollections, selectedTags, sortBy, region]);

  const handleCollectionToggle = (collectionId: string) => {
    setSelectedCollections((prev) =>
      prev.includes(collectionId)
        ? prev.filter((id) => id !== collectionId)
        : [...prev, collectionId]
    );
  };

  const handleTagToggle = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };
  
  const handleSearch = (e: React.FormEvent) => {
      e.preventDefault();
      const formData = new FormData(e.target as HTMLFormElement);
      const query = formData.get("search") as string;
      setSearchQuery(query);
  };
  
  const clearSearch = () => {
      setSearchQuery("");
      (document.getElementById("search-input") as HTMLInputElement).value = "";
  };



  return (
    <div className="min-h-screen bg-white pt-32 pb-20">
      <div className="container mx-auto px-4">
        <Toaster position="bottom-right" />
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl lg:text-7xl font-bold text-black mb-6" style={{ fontFamily: 'var(--font-caviar-dreams)' }}>
            Shop All Products
          </h1>
          <div className="w-24 h-1 bg-black mx-auto mb-8"></div>
          <p className="text-xl text-black/70 max-w-2xl mx-auto font-light" style={{ fontFamily: 'var(--font-caviar-dreams)' }}>
            Explore our complete collection of premium hair extensions and wigs.
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <form onSubmit={handleSearch} className="relative w-full md:w-1/2">
              <input
                id="search-input"
                type="text"
                name="search"
                defaultValue={searchQuery}
                placeholder="Search for products..."
                className="w-full p-4 pl-12 border-b border-gray-300 bg-transparent text-black focus:border-black focus:ring-0 placeholder-gray-400 transition-colors"
                style={{ fontFamily: 'var(--font-caviar-dreams)' }}
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              {searchQuery && (
                  <button type="button" onClick={clearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black">
                      <X size={18} />
                  </button>
              )}
          </form>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="p-4 border-b border-gray-300 bg-transparent text-black focus:border-black focus:ring-0 cursor-pointer w-full md:w-auto"
            style={{ fontFamily: 'var(--font-caviar-dreams)' }}
          >
            <option value="created_at_desc">Sort: Latest</option>
            <option value="price_asc">Sort: Price Low to High</option>
            <option value="price_desc">Sort: Price High to Low</option>
          </select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          <aside className="lg:col-span-1 h-fit sticky top-32 space-y-12">
            <div>
              <h3 className="font-bold mb-6 text-xl text-black uppercase tracking-widest" style={{fontFamily: 'var(--font-caviar-dreams'}}>Collections</h3>
              <div className="space-y-3">
                {collections.map((collection) => (
                  <label key={collection.id} className="flex items-center space-x-3 cursor-pointer group">
                    <div className={`w-4 h-4 border border-gray-400 flex items-center justify-center transition-colors ${selectedCollections.includes(collection.id) ? 'bg-black border-black' : 'group-hover:border-black'}`}>
                      {selectedCollections.includes(collection.id) && <div className="w-2 h-2 bg-white"></div>}
                    </div>
                    <input
                      type="checkbox"
                      checked={selectedCollections.includes(collection.id)}
                      onChange={() => handleCollectionToggle(collection.id)}
                      className="hidden"
                    />
                    <span className={`text-base transition-colors ${selectedCollections.includes(collection.id) ? 'text-black font-bold' : 'text-gray-600 group-hover:text-black'}`} style={{fontFamily: 'var(--font-caviar-dreams'}}>{collection.title}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-8">
              <h3 className="font-bold mb-6 text-xl text-black uppercase tracking-widest" style={{fontFamily: 'var(--font-caviar-dreams'}}>Style</h3>
              <div className="space-y-3">
                {availableTags.length > 0 ? (
                  availableTags.map((tag) => (
                    <label key={tag.id} className="flex items-center space-x-3 cursor-pointer group">
                      <div className={`w-4 h-4 border border-gray-400 flex items-center justify-center transition-colors ${selectedTags.includes(tag.id) ? 'bg-black border-black' : 'group-hover:border-black'}`}>
                        {selectedTags.includes(tag.id) && <div className="w-2 h-2 bg-white"></div>}
                      </div>
                      <input
                        type="checkbox"
                        checked={selectedTags.includes(tag.id)}
                        onChange={() => handleTagToggle(tag.id)}
                        className="hidden"
                      />
                      <span className={`text-base capitalize transition-colors ${selectedTags.includes(tag.id) ? 'text-black font-bold' : 'text-gray-600 group-hover:text-black'}`} style={{fontFamily: 'var(--font-caviar-dreams'}}>{tag.value}</span>
                    </label>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">Loading styles...</p>
                )}
              </div>
            </div>
          </aside>

          <main className="lg:col-span-3">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-[3/4] w-full bg-gray-100 mb-4"></div>
                    <div className="h-6 bg-gray-100 w-3/4 mb-2 mx-auto"></div>
                    <div className="h-4 bg-gray-100 w-1/2 mx-auto"></div>
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 lg:gap-10">
                {products.map((product: StoreProduct) => (
                  <ProductCard key={product.id} product={product} region={region} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <h3 className="text-2xl font-semibold text-black mb-2" style={{fontFamily: 'var(--font-caviar-dreams'}}>No Products Found</h3>
                <p className="text-gray-500">Try adjusting your search or filters.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
     <div className="min-h-screen bg-white pt-32 pb-20">
      <div className="container mx-auto px-4">
      <div className="text-center mb-16 animate-pulse">
        <div className="h-12 bg-gray-100 w-1/2 mx-auto mb-6"></div>
        <div className="h-1 bg-gray-200 w-24 mx-auto mb-8"></div>
        <div className="h-6 bg-gray-100 w-1/3 mx-auto"></div>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6 animate-pulse">
        <div className="h-12 bg-gray-100 w-full md:w-1/2"></div>
        <div className="h-12 bg-gray-100 w-full md:w-40"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <aside className="lg:col-span-1 h-fit sticky top-32 space-y-12 animate-pulse">
          <div className="h-6 bg-gray-100 w-1/2 mb-6"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-100 w-3/4"></div>
            <div className="h-4 bg-gray-100 w-2/3"></div>
            <div className="h-4 bg-gray-100 w-3/4"></div>
          </div>
           <div className="border-t pt-8 space-y-4">
             <div className="h-6 bg-gray-100 w-1/3 mb-6"></div>
            <div className="h-4 bg-gray-100 w-3/4"></div>
            <div className="h-4 bg-gray-100 w-2/3"></div>
          </div>
        </aside>
        
        <main className="lg:col-span-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] w-full bg-gray-100 mb-4"></div>
                <div className="h-6 bg-gray-100 w-3/4 mb-2 mx-auto"></div>
                <div className="h-4 bg-gray-100 w-1/2 mx-auto"></div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
    </div>
  );
}

export default function ShopPageWrapper() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <ShopPageClient />
    </Suspense>
  );
}
