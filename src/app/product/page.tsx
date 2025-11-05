"use client";

import medusaClient from "@/lib/medusa";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { StoreProduct, StoreRegion, HttpTypes, StoreProductTag } from "@medusajs/types"; // Import StoreProductTag
import { useEffect, useState, useMemo, Suspense } from "react";
import { Search, X } from "lucide-react";
import toast, { Toaster } from "react-hot-toast"; // Import Toaster
import Image from "next/image"; // Import Image

const styleTags = [
  { id: "tag_straight", value: "Straight" },
  { id: "tag_wavy", value: "Wavy" },
  { id: "tag_curly", value: "Curly" },
  { id: "tag_kinky_curly", value: "Kinky Curly" },
  { id: "tag_kinky_straight", value: "Kinky Straight" },
  { id: "tag_afro_curly", value: "Afro Curly" },
];

// Helper function to get region (for pricing)
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

// 1. RENAME your main component. This contains all your original logic.
function ShopPageClient() {
  // --- State Management ---
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [collections, setCollections] = useState<HttpTypes.StoreCollection[]>([]);
  const [region, setRegion] = useState<StoreRegion | null>(null);
  const [tags, setTags] = useState<HttpTypes.StoreProductTag[]>([]); // State for tags
  const [isLoading, setIsLoading] = useState(true);

  // Filter State
  const searchParams = useSearchParams(); // This hook is now safe
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("created_at_desc");

  // --- Data Fetching ---

  // 1. Fetch static data (collections, region) on component mount
  useEffect(() => {
    const fetchStaticData = async () => {
      try {
        const [regionData, collectionData] = await Promise.all([
          getRegionId().then(id => id ? medusaClient.store.region.retrieve(id) : null),
          medusaClient.store.collection.list()
        ]);

        if (regionData) {
          setRegion(regionData.region);
        }
        setCollections(collectionData.collections);
      } catch (error) {
        console.error("Failed to fetch initial data:", error);
      }
    };
    fetchStaticData();
  }, []);

  // 2. Fetch products whenever filters, search, or sorting changes
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

  // --- Handlers ---
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


  // --- Helper Functions ---
  const formatPrice = (product: StoreProduct) => {
    const variant = product.variants?.[0];
    const priceObject = variant?.calculated_price;
    const amount = priceObject?.calculated_amount;
    const currencyCode = region?.currency_code || 'USD';
    if (amount === undefined || amount === null) return "N/A";
    // FIX: Divide by 100
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
    }).format(Number(amount) / 100);
  };

  return (
    <div className="container mx-auto px-4 py-12 pt-28 lg:pt-32">
      <Toaster position="bottom-right" /> {/* Add Toaster */}
      <h1 className="text-4xl font-bold mb-8 text-center" style={{ fontFamily: 'var(--font-playfair-display)' }}>
        Shop All Products
      </h1>
      
      {/* Search and Sort Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <form onSubmit={handleSearch} className="relative w-full md:w-1/2">
            <input
              id="search-input"
              type="text"
              name="search"
              defaultValue={searchQuery}
              placeholder="Search for products..."
              className="w-full p-3 pl-10 border rounded-md shadow-sm text-gray-900"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            {searchQuery && (
                <button type="button" onClick={clearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800">
                    <X size={18} />
                </button>
            )}
        </form>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="p-3 border rounded-md shadow-sm w-full md:w-auto text-gray-900"
        >
          <option value="created_at_desc">Sort: Latest</option>
          <option value="price_asc">Sort: Price Low to High</option>
          <option value="price_desc">Sort: Price High to Low</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <aside className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md h-fit sticky top-28 space-y-6">
          {/* Collections Filter */}
          <div>
            <h3 className="font-semibold mb-3 text-lg text-gray-900">Collections</h3>
            <div className="space-y-2">
              {collections.map((collection) => (
                <label key={collection.id} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedCollections.includes(collection.id)}
                    onChange={() => handleCollectionToggle(collection.id)}
                    className="rounded text-brand-brown focus:ring-brand-pink"
                  />
                  <span className="text-sm text-gray-700">{collection.title}</span>
                </label>
              ))}
            </div>
          </div>
          
          {/* Style (Tags) Filter */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="font-semibold mb-3 text-lg text-gray-900">Style</h3>
            <div className="space-y-2">
              {/* Use the dynamically fetched tags */}
              {tags.map((tag) => (
                <label key={tag.id} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedTags.includes(tag.id)}
                    onChange={() => handleTagToggle(tag.id)}
                    className="rounded text-brand-brown focus:ring-brand-pink"
                  />
                  <span className="text-sm text-gray-700 capitalize">{tag.value.replace(/_/g, ' ')}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Products Grid */}
        <main className="lg:col-span-3">
          {isLoading ? (
            // Skeleton Loader
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="border rounded-lg p-4 shadow-md animate-pulse">
                  <div className="h-64 w-full rounded bg-gray-200 mb-4"></div>
                  <div className="h-6 rounded bg-gray-200 w-3/4 mb-2"></div>
                  <div className="h-4 rounded bg-gray-200 w-1/2"></div>
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            // Actual Product Grid
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {products.map((product: StoreProduct) => (
                <Link
                  key={product.id}
                  href={`/products/${product.handle}`} // FIX: Use /products/ (plural)
                  className="group block rounded-lg border bg-white p-4 shadow-md transition-transform hover:scale-105"
                >
                  {product.thumbnail && (
                    <Image // Use Next.js Image
                      src={product.thumbnail}
                      alt={product.title}
                      width={400}
                      height={400}
                      className="mb-4 h-64 w-full rounded object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  )}
                  <h2 className="text-xl font-semibold text-gray-800 transition-colors group-hover:text-brand-pink truncate" title={product.title}>
                    {product.title}
                  </h2>
                  <p className="mt-2 text-lg font-medium text-gray-700">
                    Starts at {formatPrice(product)}
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            // No Products Found
            <div className="text-center text-gray-500 py-16 bg-white rounded-lg shadow-md">
              <h3 className="text-2xl font-semibold">No Products Found</h3>
              <p className="mt-2">Try adjusting your search or filters.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

// 2. Create a Loading Skeleton component
function LoadingSkeleton() {
  return (
     <div className="container mx-auto px-4 py-12 pt-28 lg:pt-32">
      <h1 className="text-4xl font-bold mb-8 text-center" style={{ fontFamily: 'var(--font-playfair-display)' }}>
        Shop All Products
      </h1>
      
      {/* Skeleton for Search/Sort */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div className="h-12 bg-gray-200 rounded-md w-full md:w-1/2 animate-pulse"></div>
        <div className="h-12 bg-gray-200 rounded-md w-full md:w-40 animate-pulse"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Skeleton for Filters */}
        <aside className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md h-fit sticky top-28 space-y-6 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-3"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
           <div className="border-t pt-6 space-y-2">
             <div className="h-6 bg-gray-200 rounded w-1/3 mb-3"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </aside>
        
        {/* Skeleton for Products */}
        <main className="lg:col-span-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="border rounded-lg p-4 shadow-md animate-pulse">
                <div className="h-64 w-full rounded bg-gray-200 mb-4"></div>
                <div className="h-6 rounded bg-gray-200 w-3/4 mb-2"></div>
                <div className="h-4 rounded bg-gray-200 w-1/2"></div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

// 3. Create a new default export that wraps the client component in Suspense
export default function ShopPageWrapper() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <ShopPageClient />
    </Suspense>
  );
}