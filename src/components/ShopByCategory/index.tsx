'use client';

import Image from 'next/image';
import Link from 'next/link';

// Use category names and handles that match your Medusa setup
const categories = [
  {
    id: 1,
    name: 'The D Collection', // Example Category Name
    href: '/products/the-d-collection', // Example Link (use product handle or collection path)
    imgSrc: '/images/shop1.jpg', // Replace with your image path
  },
  {
    id: 2,
    name: 'Curly',
    href: '/products/curly-hair', // Example Link
    imgSrc: '/images/shop3.jpg', // Replace with your image path
  },
  {
    id: 3,
    name: 'Straight',
    href: '/products/straight-hair', // Example Link
    imgSrc: '/images/wigstyles2.jpg', // Replace with your image path
  },
  {
    id: 4,
    name: 'Wavy',
    href: '/products/wavy-hair', // Example Link
    imgSrc: '/images/shop2.jpg', // Replace with your image path
  },
];

const ShopByCategory = () => {
  return (
    <section className="bg-brand-brown text-brand-tan py-16 lg:py-20"> {/* Reverted background */}
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 lg:mb-16">
          <h2
            className="text-7xl lg:text-4xl font-bold text-brand-tan"
            style={{ fontFamily: 'var(--font-caviar-dreams)', fontWeight: '700', fontSize: '36px' }}
          >
            Shop By Style
          </h2>
          <p className="mt-4 text-lg text-brand-tan/70 max-w-2xl mx-auto font-caviar font-normal">
            Find the perfect texture for your look.
          </p>
        </div>

        {/* Grid for all screen sizes */}
        {/* FIX: Reduced gap using gap-1 or gap-2 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 md:gap-2 max-w-7xl mx-auto">
          {categories.map((category) => (
            <Link key={category.id} href={category.href} className="group relative block text-center overflow-hidden"> {/* Removed shadow-sm and rounded-md */}
              {/* Image Container */}
              <div className="relative aspect-[3/4] w-full"> {/* Aspect ratio for consistency */}
                <Image
                  src={category.imgSrc}
                  alt={category.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 25vw, 25vw" // Adjusted sizes
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent"></div>
                {/* Text Overlay */}
                <div className="absolute inset-0 flex items-end justify-center p-4">
                  <h3
                    className="text-white text-lg sm:text-xl lg:text-2xl font-semibold transition-opacity duration-300 group-hover:opacity-80"
                    style={{ fontFamily: 'var(--font-caviar-dreams)' }}
                  >
                    {category.name}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopByCategory;