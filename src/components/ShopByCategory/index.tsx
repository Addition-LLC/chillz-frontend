'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const categories = [
  {
    id: 1,
    name: 'Blonde Straight',
    href: '/tools?category=blonde',
    imgSrc: '/images/shop1.jpg',
  },
  {
    id: 2,
    name: 'Body Wave',
    href: '/tools?style=wave',
    imgSrc: '/images/shop2.jpg',
  },
  {
    id: 3,
    name: 'Loose Curls',
    href: '/tools?style=curly',
    imgSrc: '/images/shop3.jpg',
  },
  {
    id: 4,
    name: 'Yaki Straight',
    href: '/tools?style=straight',
    imgSrc: '/images/wigstyles2.jpg',
  },
];

const ShopByCategory = () => {
  const [hoveredCategory, setHoveredCategory] = useState<{ id: number; imgSrc: string } | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <section className="relative min-h-screen bg-brand-brown text-brand-tan flex flex-col justify-center py-20 lg:py-0">
      <div
        className="pointer-events-none absolute z-0 transition-opacity duration-300 hidden lg:block"
        style={{
          top: mousePosition.y,
          left: mousePosition.x,
          transform: 'translate(-50%, -50%)',
          opacity: hoveredCategory ? 1 : 0,
        }}
      >
        {categories.map(category => (
           <div key={category.id} className={`relative h-64 w-48 rounded-lg overflow-hidden shadow-2xl transition-opacity duration-300 ${hoveredCategory?.id === category.id ? 'opacity-100' : 'opacity-0'}`}>
             <Image
                src={category.imgSrc}
                alt={category.name}
                fill
                className="object-cover"
             />
           </div>
        ))}
      </div>
      
      <div className="container mx-auto px-4 relative z-20">
        <div className="text-center mb-12 lg:mb-16">
          <h2 
            className="text-3xl lg:text-4xl font-bold"
            style={{ fontFamily: 'var(--font-playfair-display)' }}
          >
            Explore The Collections
          </h2>
          <p className="mt-4 text-lg text-brand-tan/70 max-w-2xl mx-auto">
            Each style is a new identity. Hover to reveal the essence of each collection.
          </p>
        </div>
        
        <div className="divide-y divide-brand-tan/20 max-w-4xl mx-auto hidden lg:block">
          {categories.map((category) => (
            <div 
              key={category.id}
              onMouseEnter={() => setHoveredCategory(category)}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              <Link 
                href={category.href} 
                className="group block text-center py-8"
              >
                <h3 
                  className="text-5xl lg:text-8xl font-bold text-brand-tan/60 transition-all duration-300 group-hover:text-brand-tan group-hover:scale-105"
                  style={{ fontFamily: 'var(--font-playfair-display)' }}
                >
                  {category.name}
                </h3>
              </Link>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 lg:hidden">
          {categories.map((category) => (
            <Link key={category.id} href={category.href} className="group relative block text-center">
              <div className="relative h-96 w-full overflow-hidden rounded-lg shadow-lg">
                <Image
                  src={category.imgSrc}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              </div>
              <h3 className="mt-4 text-2xl font-bold text-brand-tan" style={{fontFamily: 'var(--font-playfair-display)'}}>
                {category.name}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopByCategory;

