"use client";

import medusaClient from "@/lib/medusa";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { StoreProduct, StoreRegion, HttpTypes} from "@medusajs/types";
import { useEffect, useState, Suspense } from "react";
import { Search, X } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import Image from "next/image";

const styleTags = [
  { id: "tag_straight", value: "Straight" },
  { id: "tag_wavy", value: "Wavy" },
  { id: "tag_curly", value: "Curly" },
  { id: "tag_kinky_curly", value: "Kinky Curly" },
  { id: "tag_kinky_straight", value: "Kinky Straight" },
  { id: "tag_afro_curly", value: "Afro Curly" },
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

  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("created_at_desc");

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

  const formatPrice = (product: StoreProduct) => {
    const variant = product.variants?.[0];
    const priceObject = variant?.calculated_price;
    const amount = priceObject?.calculated_amount;
    const currencyCode = region?.currency_code || 'USD';
    if (amount === undefined || amount === null) return "N/A";
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
    }).format(Number(amount));
  };

  return (
    <div className="min-h-screen bg-white pt-28 pb-12 lg:pt-32">
      <div className="container mx-auto px-4">
        <Toaster position="bottom-right" />
        <h1 className="text-4xl lg:text-5xl font-bold mb-10 text-center text-black" style={{ fontFamily: 'var(--font-caviar-dreams)' }}>
          Shop All Products
        </h1>
        
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <form onSubmit={handleSearch} className="relative w-full md:w-1/2">
              <input
                id="search-input"
                type="text"
                name="search"
                defaultValue={searchQuery}
                placeholder="Search for products..."
                className="w-full p-3 pl-10 border border-gray-300 rounded-none shadow-sm text-black focus:ring-black focus:border-black"
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
            className="p-3 border border-gray-300 rounded-none shadow-sm w-full md:w-auto text-black focus:ring-black focus:border-black"
          >
            <option value="created_at_desc">Sort: Latest</option>
            <option value="price_asc">Sort: Price Low to High</option>
            <option value="price_desc">Sort: Price High to Low</option>
          </select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1 bg-white p-6 rounded-none shadow-sm border border-gray-200 h-fit sticky top-32 space-y-8">
            <div>
              <h3 className="font-bold mb-4 text-xl text-black" style={{fontFamily: 'var(--font-caviar-dreams'}}>Collections</h3>
              <div className="space-y-2">
                {collections.map((collection) => (
                  <label key={collection.id} className="flex items-center space-x-2 cursor-pointer" style={{fontFamily: 'var(--font-caviar-dreams'}}>
                    <input
                      type="checkbox"
                      checked={selectedCollections.includes(collection.id)}
                      onChange={() => handleCollectionToggle(collection.id)}
                      className="rounded-none text-black focus:ring-black border-gray-300"
                    />
                    <span className="text-sm text-gray-700" style={{fontFamily: 'var(--font-caviar-dreams'}}>{collection.title}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-6">
              <h3 className="font-bold mb-4 text-xl text-black" style={{fontFamily: 'var(--font-caviar-dreams'}}>Style</h3>
              <div className="space-y-2">
                {styleTags.map((tag) => (
                  <label key={tag.id} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedTags.includes(tag.id)}
                      onChange={() => handleTagToggle(tag.id)}
                      className="rounded-none text-black focus:ring-black border-gray-300"
                    />
                    <span className="text-sm text-gray-700 capitalize">{tag.value.replace(/_/g, ' ')}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          <main className="lg:col-span-3">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="border border-gray-200 rounded-none p-4 shadow-sm animate-pulse bg-white">
                    <div className="h-64 w-full rounded-none bg-gray-100 mb-4"></div>
                    <div className="h-6 rounded-none bg-gray-100 w-3/4 mb-2"></div>
                    <div className="h-4 rounded-none bg-gray-100 w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {products.map((product: StoreProduct) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.handle}`}
                    className="group block rounded-none border border-gray-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-black"
                  >
                    {product.thumbnail && (
                      <Image
                        src={product.thumbnail}
                        alt={product.title}
                        width={400}
                        height={400}
                        className="mb-4 h-72 w-full rounded-none object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    )}
                    <h2 className="text-xl font-semibold text-black transition-colors group-hover:text-gray-600 truncate" title={product.title} style={{fontFamily: 'var(--font-caviar-dreams'}}>
                      {product.title}
                    </h2>
                    <p className="mt-2 text-lg font-medium text-gray-700">
                      Starts at <span className="text-black font-bold">{formatPrice(product)}</span>
                    </p>
                    <div className="mt-4 w-full rounded-none bg-black py-2 text-center text-sm font-bold text-white transition-colors duration-300 hover:bg-gray-800">
                      View Details
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-16 bg-white rounded-none shadow-sm border border-gray-200">
                <h3 className="text-2xl font-semibold text-black">No Products Found</h3>
                <p className="mt-2">Try adjusting your search or filters.</p>
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
     <div className="min-h-screen bg-white pt-28 pb-12 lg:pt-32">
      <div className="container mx-auto px-4">
      <h1 className="text-4xl font-bold mb-8 text-center text-black" style={{ fontFamily: 'var(--font-caviar-dreams)' }}>
        Shop All Products
      </h1>
      
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div className="h-12 bg-gray-100 rounded-none w-full md:w-1/2 animate-pulse"></div>
        <div className="h-12 bg-gray-100 rounded-none w-full md:w-40 animate-pulse"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1 bg-white p-6 rounded-none shadow-sm border border-gray-200 h-fit sticky top-32 space-y-8 animate-pulse">
          <div className="h-6 bg-gray-100 rounded-none w-1/2 mb-3"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-100 rounded-none w-3/4"></div>
            <div className="h-4 bg-gray-100 rounded-none w-2/3"></div>
            <div className="h-4 bg-gray-100 rounded-none w-3/4"></div>
          </div>
           <div className="border-t pt-6 space-y-2">
             <div className="h-6 bg-gray-100 rounded-none w-1/3 mb-3"></div>
            <div className="h-4 bg-gray-100 rounded-none w-3/4"></div>
            <div className="h-4 bg-gray-100 rounded-none w-2/3"></div>
          </div>
        </aside>
        
        <main className="lg:col-span-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="border border-gray-200 rounded-none p-4 shadow-sm animate-pulse">
                <div className="h-64 w-full rounded-none bg-gray-100 mb-4"></div>
                <div className="h-6 rounded-none bg-gray-100 w-3/4 mb-2"></div>
                <div className="h-4 rounded-none bg-gray-100 w-1/2"></div>
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
