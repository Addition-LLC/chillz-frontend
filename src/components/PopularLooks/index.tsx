'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, Star, Search } from 'lucide-react';

const products = [
  {
    id: 1,
    name: 'Blonde Classic Style',
    price: 49,
    img: '/images/shop1.jpg',
    href: '/product/1',
  },
  { id: 2, name: 'Curly Dark Style', price: 49, img: '/images/shop2.jpg', href: '/product/2' },
  { id: 3, name: 'Long Wavy Brunette', price: 49, img: '/images/shop3.jpg', href: '/product/3' },
  { id: 4, name: 'Long Straight Brunette', price: 49, img: '/images/wigstyles2.jpg', href: '/product/4' },
];

export default function PopularLooks() {
  const [favorites, setFavorites] = useState<number[]>([2]); // Example: one item is favorited by default

  const toggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  };

  return (
    <section className="bg-brand-secondary-bg py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2
            className="text-3xl sm:text-4xl font-bold text-brand-brown"
            style={{ fontFamily: 'var(--font-playfair-display)' }}
          >
            Popular Looks
          </h2>
          <p className="mt-4 text-lg text-brand-brown/80 max-w-2xl mx-auto">
            Discover the styles our customers are loving right now.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div key={product.id} className="group relative text-center transition-all duration-300 hover:-translate-y-2">
              <div className="relative h-[400px] w-full overflow-hidden rounded-lg shadow-sm bg-white">
                <Image
                  src={product.img}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Link href={product.href} className="flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-semibold text-brand-brown backdrop-blur-sm hover:bg-white">
                    <Search className="h-4 w-4" />
                    Quick View
                  </Link>
                </div>
                <button
                  onClick={() => toggleFavorite(product.id)}
                  className="absolute top-3 right-3 z-20 bg-white/70 rounded-full p-2 backdrop-blur-sm transition-colors hover:bg-white"
                  aria-label="Toggle Favorite"
                >
                  <Heart className={`w-5 h-5 transition-all ${favorites.includes(product.id) ? 'text-red-500 fill-current' : 'text-brand-brown/70'}`} />
                </button>
              </div>
              
              <div className="mt-4">
                <h3 className="text-lg font-bold text-brand-brown" style={{fontFamily: 'var(--font-playfair-display)'}}>
                  <Link href={product.href}>
                    <span aria-hidden="true" className="absolute inset-0"></span>
                    {product.name}
                  </Link>
                </h3>
                <div className="mt-1 flex justify-center text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="mt-1 text-md font-semibold text-brand-brown">${product.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

