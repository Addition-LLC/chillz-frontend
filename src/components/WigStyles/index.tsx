'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

const stylesData = [
  {
    name: 'Wave',
    description: 'Embrace effortless, flowing textures.',
    href: '/tools?style=wave',
    imageSrc: '/images/wigstyles1.jpg', // Green Shirt
  },
  {
    name: 'Straight',
    description: 'Discover sleek, timeless elegance.',
    href: '/tools?style=straight',
    imageSrc: '/images/wigstyles2.jpg', // White Hoodie
  },
  {
    name: 'Curls',
    description: 'Define your look with bold, beautiful curls.',
    href: '/tools?style=curly',
    imageSrc: '/images/wigstyles3.jpg', // Red Shirt
  },
];

const WigStyles = () => {
  const [activeStyle, setActiveStyle] = useState(stylesData[0]); 

  return (
    <section 
      className="py-20 lg:py-32"
      style={{ backgroundColor: '#5C4033', color: '#F5F0E6' }} // Forced brand-brown bg & brand-tan text
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* --- Left Column: Interactive Text Links --- */}
          <div>
            <div className="mb-12">
              <h2 
                className="text-3xl lg:text-4xl font-bold"
                style={{ fontFamily: 'var(--font-caviar-dreams)' }}
              >
                Embrace Your Ethereal Beauty
              </h2>
              <p className="mt-4 text-lg text-brand-tan/70 max-w-lg" style={{fontFamily: 'var(--font-caviar-dreams)'}}>
              At Nhim Wën Lux Hair, we see embracing natural hair as reclaiming your identity. Our founder shares this journey against colonial beauty standards. We believe extensions are a tool to enhance your natural texture, not mask it, allowing for versatile self-expression. By celebrating your hair, you defy outdated norms and reclaim your crown with pride. Your hair is your heritage; let it shine boldly.
              </p>
            </div>
            
            {/* <div className="divide-y divide-brand-tan/20 border-t border-b border-brand-tan/20">
              {stylesData.map((style, index) => (
                <div 
                  key={style.name}
                  onMouseEnter={() => setActiveStyle(style)}
                  className="group"
                >
                  <Link href={style.href} className="flex justify-between items-center py-8 text-brand-tan transition-colors duration-300">
                    <div className="flex items-center gap-6">
                      <span className="text-sm font-semibold text-brand-tan/70">
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
                      <p className="hidden md:block text-brand-tan/80 transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                        {style.description}
                      </p>
                      <div className="h-14 w-14 rounded-full border-2 border-brand-tan flex items-center justify-center transition-all duration-300 group-hover:bg-brand-tan group-hover:text-brand-brown">
                        <ArrowUpRight className="h-6 w-6" />
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div> */}
          </div>

          {/* --- Right Column: Image Preview --- */}
          <div className="relative w-full h-[28rem] lg:h-[36rem] rounded-2xl overflow-hidden">
             <div className="absolute inset-0 bg-brand-secondary-bg"></div>
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

