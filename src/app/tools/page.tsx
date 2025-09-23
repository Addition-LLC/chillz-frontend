'use client';

import { useState, useMemo } from 'react';
import { products, Product } from './products';
import Image from 'next/image';
import { ChevronDown, X, Search } from 'lucide-react';

// (All helper functions and data definitions remain the same)
const collections = [...new Set(products.map(p => p.collection))];
const lengths = [...new Set(products.flatMap(p => p.lengths))].sort((a, b) => a - b);
const collectionCounts = (() => { const c: { [key: string]: number } = {}; products.forEach(p => c[p.collection] = (c[p.collection] || 0) + 1); return c; })();
const lengthCounts = (() => { const c: { [key: number]: number } = {}; products.forEach(p => p.lengths.forEach(l => c[l] = (c[l] || 0) + 1)); return c; })();


export default function ToolsPage() {
  const [filters, setFilters] = useState<{ collections: string[]; lengths: number[]; }>({ collections: [], lengths: [], });
  const [sort, setSort] = useState('newest');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const handleCollectionChange = (collection: string) => setFilters(prev => ({ ...prev, collections: prev.collections.includes(collection) ? prev.collections.filter(c => c !== collection) : [...prev.collections, collection] }));
  const handleLengthChange = (length: number) => setFilters(prev => ({ ...prev, lengths: prev.lengths.includes(length) ? prev.lengths.filter(l => l !== length) : [...prev.lengths, length] }));
  const clearFilters = () => setFilters({ collections: [], lengths: [] });

  const filteredProducts = useMemo(() => {
    let filtered = [...products];
    if (filters.collections.length > 0) filtered = filtered.filter(p => filters.collections.includes(p.collection));
    if (filters.lengths.length > 0) filtered = filtered.filter(p => p.lengths.some(l => filters.lengths.includes(l)));
    switch (sort) {
      case 'price-asc': filtered.sort((a, b) => a.price - b.price); break;
      case 'price-desc': filtered.sort((a, b) => b.price - a.price); break;
      case 'newest': default: filtered.sort((a, b) => (b.isNew ? 1 : -1)); break;
    }
    return filtered;
  }, [filters, sort]);

  return (
    <div className="bg-brand-tan min-h-screen">
      <main className="container mx-auto px-4 py-24 sm:px-6 lg:px-8">
        <div className="pt-12 text-center">
            <h1 className="text-4xl font-bold tracking-tight text-brand-brown sm:text-5xl" style={{fontFamily: 'var(--font-playfair-display)'}}>Hair Tools & Extensions</h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-brand-brown/80">Discover our premium collection of raw and virgin hair, closures, and essential styling tools.</p>
        </div>

        <section className="pt-12 pb-24 lg:grid lg:grid-cols-4 lg:gap-x-12">
          <aside className="hidden lg:block">
              <h2 className="sr-only">Filters</h2>
              <FilterControls 
                  filters={filters}
                  handleCollectionChange={handleCollectionChange}
                  handleLengthChange={handleLengthChange}
                  clearFilters={clearFilters}
              />
          </aside>

          <div className="lg:col-span-3 bg-brand-secondary-bg p-8 rounded-lg shadow-inner">
              <div className="flex items-baseline justify-between border-b border-brand-brown/20 pb-6">
                  <p className="text-sm text-brand-brown">{filteredProducts.length} results</p>
                  <div className="flex items-center">
                      <SortMenu sort={sort} setSort={setSort} />
                      <button type="button" className="-m-2 ml-4 p-2 text-brand-brown hover:text-brand-pink sm:ml-6 lg:hidden" onClick={() => setIsFiltersOpen(true)}>
                          <span className="sr-only">Filters</span>
                          <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M2.628 1.601C5.028 1.206 7.49 1 10 1s4.973.206 7.372.601a.75.75 0 01.628.74v2.288a2.25 2.25 0 01-.659 1.59l-4.682 4.683a2.25 2.25 0 00-.659 1.59v3.037c0 .684-.31 1.33-.844 1.757l-1.937 1.55A.75.75 0 018 18.25v-5.757a2.25 2.25 0 00-.659-1.59L2.659 6.22A2.25 2.25 0 012 4.629V2.34a.75.75 0 01.628-.74z" clipRule="evenodd" /></svg>
                      </button>
                  </div>
              </div>

              <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-3 pt-6">
                  {filteredProducts.map(product => (<ProductCard key={product.id} product={product} />))}
              </div>
               {filteredProducts.length === 0 && (
                  <div className="text-center py-20"><p className="text-xl font-semibold text-brand-brown">No products found</p><p className="mt-2 text-brand-brown/70">Try adjusting your filters.</p></div>
              )}
          </div>
        </section>
      </main>

        {isFiltersOpen && (
            <div className="relative z-40 lg:hidden" role="dialog" aria-modal="true">
                <div className="fixed inset-0 bg-black bg-opacity-25" onClick={() => setIsFiltersOpen(false)}></div>
                <div className="fixed inset-0 z-40 flex">
                    <div className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-brand-tan py-4 pb-12 shadow-xl">
                        <div className="flex items-center justify-between px-4"><h2 className="text-lg font-medium text-brand-brown">Filters</h2><button type="button" className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md p-2 text-brand-brown" onClick={() => setIsFiltersOpen(false)}><span className="sr-only">Close menu</span><X className="h-6 w-6" /></button></div>
                        <div className="mt-4 border-t border-brand-brown/20 px-4">
                           <FilterControls filters={filters} handleCollectionChange={handleCollectionChange} handleLengthChange={handleLengthChange} clearFilters={clearFilters} />
                        </div>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
}

// All sub-components (ProductCard, SortMenu, FilterControls) remain the same as the previous version.
// ... (You can copy them from the previous response)

// --- Sub-components ---

function ProductCard({ product }: { product: Product }) {
    return (
        <div className="group relative">
            <div className="relative aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:h-80">
                <Image
                    src={product.imageUrl}
                    alt={product.name}
                    width={400}
                    height={600}
                    className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <a href={`/product/${product.id}`} className="flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-semibold text-brand-brown backdrop-blur-sm hover:bg-white">
                        <Search className="h-4 w-4" />
                        Quick View
                    </a>
                </div>
            </div>
            <div className="mt-4 flex justify-between">
                <div>
                    <h3 className="text-sm text-brand-brown">
                        <a href={`/product/${product.id}`}>
                            <span aria-hidden="true" className="absolute inset-0"></span>
                            {product.name}
                        </a>
                    </h3>
                    <p className="mt-1 text-sm text-brand-brown/60">{product.collection}</p>
                </div>
                <p className="text-sm font-medium text-brand-brown">${product.price}</p>
            </div>
        </div>
    );
}

function SortMenu({ sort, setSort }: { sort: string; setSort: (value: string) => void; }) {
    const [isOpen, setIsOpen] = useState(false);
    const sortOptions = [
        { name: 'Newest', value: 'newest' },
        { name: 'Price: Low to High', value: 'price-asc' },
        { name: 'Price: High to Low', value: 'price-desc' },
    ];

    return (
        <div className="relative inline-block text-left">
            <div>
                <button type="button" onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)} className="group inline-flex justify-center text-sm font-medium text-brand-brown hover:text-brand-pink" id="menu-button">
                    Sort
                    <ChevronDown className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-brand-brown/60 group-hover:text-brand-pink/80" />
                </button>
            </div>
            {isOpen && (
                <div onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)} className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                        {sortOptions.map(option => (
                            <button key={option.name} onClick={() => { setSort(option.value); setIsOpen(false); }} className={`block w-full text-left px-4 py-2 text-sm ${sort === option.value ? 'font-medium text-gray-900 bg-gray-100' : 'text-gray-500 hover:bg-gray-50'}`}>
                                {option.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

function FilterControls({ filters, handleCollectionChange, handleLengthChange, clearFilters }: any) {
    return (
        <div className="space-y-8">
             <div>
                <button type="button" onClick={clearFilters} className="text-sm font-medium text-brand-brown/70 hover:text-brand-pink">
                    Clear all filters
                </button>
            </div>
            <div>
                <h3 className="text-lg font-semibold text-brand-brown pb-4">Collection</h3>
                <div className="flex flex-wrap gap-2">
                    {collections.map(collection => (
                        <button 
                            key={collection}
                            onClick={() => handleCollectionChange(collection)}
                            className={`px-4 py-2 text-sm rounded-full border transition-colors flex items-center gap-2 ${filters.collections.includes(collection) ? 'bg-brand-brown text-white border-brand-brown' : 'border-gray-300 hover:border-brand-brown'}`}
                        >
                           {collection}
                           <span className="text-xs font-mono bg-brand-tan/20 rounded-full px-2 py-0.5">{collectionCounts[collection]}</span>
                        </button>
                    ))}
                </div>
            </div>
             <div>
                <h3 className="text-lg font-semibold text-brand-brown pt-6 pb-4">Length</h3>
                <div className="flex flex-wrap gap-2">
                    {lengths.map(length => (
                        <button 
                            key={length}
                            onClick={() => handleLengthChange(length)}
                            className={`px-4 py-2 text-sm rounded-full border transition-colors flex items-center gap-2 ${filters.lengths.includes(length) ? 'bg-brand-brown text-white border-brand-brown' : 'border-gray-300 hover:border-brand-brown'}`}
                        >
                            {length}"
                            <span className="text-xs font-mono bg-brand-tan/20 rounded-full px-2 py-0.5">{lengthCounts[length]}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}