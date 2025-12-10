'use client';

import { useState } from 'react';
import Image from 'next/image';
// import Link from 'next/link';
// import { ArrowUpRight } from 'lucide-react';

const stylesData = [
  {
    name: 'Wave',
    description: 'Embrace effortless, flowing textures.',
    href: '/product',
    imageSrc: '/images/wigstyles1.jpg', // Green Shirt
  },
  {
    name: 'Straight',
    description: 'Discover sleek, timeless elegance.',
    href: '/product',
    imageSrc: '/images/wigstyles2.jpg', // White Hoodie
  },
  {
    name: 'Curls',
    description: 'Define your look with bold, beautiful curls.',
    href: '/product',
    imageSrc: '/images/wigstyles3.jpg', // Red Shirt
  },
];

const WigStyles = () => {
  const [activeStyle] = useState(stylesData[0]); 

  return (
    <section 
      className="py-20 lg:py-32"
      style={{ backgroundColor: '#000000', color: '#FFFFFF' }} // Forced black bg & white text
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* --- Left Column: Interactive Text Links --- */}
          <div>
            <div className="mb-12">
              <h2 
                className="text-3xl lg:text-4xl font-bold font-edwardian-first-letter"
                style={{ fontFamily: 'var(--font-caviar-dreams)' }}
              >
                Embrace Your Ethereal Beauty
              </h2>
              <p className="mt-4 text-lg text-white/70 max-w-lg" style={{fontFamily: 'var(--font-caviar-dreams)'}}>
              At Nhïëm Wën Lux Hair, we see embracing natural hair as reclaiming your identity. Our founder shares this journey against colonial beauty standards. We believe extensions are a tool to enhance your natural texture, not mask it, allowing for versatile self-expression. By celebrating your hair, you defy outdated norms and reclaim your crown with pride. Your hair is your heritage; let it shine boldly.
              </p>
            </div>
            
            {/* <div className="divide-y divide-white/20 border-t border-b border-white/20">
              {stylesData.map((style, index) => (
                <div 
                  key={style.name}
                  onMouseEnter={() => setActiveStyle(style)}
                  className="group"
                >
                  <Link href={style.href} className="flex justify-between items-center py-8 text-white transition-colors duration-300">
                    <div className="flex items-center gap-6">
                      <span className="text-sm font-semibold text-white/70">
                        0{index + 1}
                      </span>
                      <h3 
                        className="text-4xl lg:text-6xl font-bold transition-transform duration-300 group-hover:translate-x-2"
                        style={{ fontFamily: 'var(--font-playfair-display)' }}
                      >
                        {style.name}
                      </h3>
                    </div>
                    <div className="text-right flex items-center gap-4">
                      <p className="hidden md:block text-white/80 transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                        {style.description}
                      </p>
                      <div className="h-14 w-14 rounded-none border-2 border-white flex items-center justify-center transition-all duration-300 group-hover:bg-white group-hover:text-black">
                        <ArrowUpRight className="h-6 w-6" />
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div> */}
          </div>

          {/* --- Right Column: Image Preview --- */}
          <div className="relative w-full h-[28rem] lg:h-[36rem] rounded-none overflow-hidden">
             <div className="absolute inset-0 bg-white"></div>
             {stylesData.map((style) => (
                <Image
                    key={style.name}
                    src={style.imageSrc}
                    alt={style.name}
                    fill
                    className={`object-cover object-center transition-opacity duration-700 ease-in-out ${
                    activeStyle.name === style.name ? 'opacity-100' : 'opacity-0'
                    }`}
                />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default WigStyles;

