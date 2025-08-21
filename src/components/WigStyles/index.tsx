// app/components/WigStyles.tsx

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

// Define the data for the cards to keep the code clean
const stylesData = [
  {
    name: 'WAVE',
    description: 'Premium quality wave style wigs',
    href: '/shop/wave',
    imgSrc: '/images/shop3.jpg', 
  },
  {
    name: 'STRAIGHT',
    description: 'Premium quality straight style wigs',
    href: '/shop/straight',
    imgSrc: '/images/wigstyles2.jpg', 
  },
  {
    name: 'CURLS',
    description: 'Premium quality curls style wigs',
    href: '/shop/curls',
    imgSrc: '/images/wigstyles3.jpg', 
  },
];

const WigStyles = () => {
  return (
    <section className="py-10 bg-[#FBF6ED]">
      <div className="container mx-auto px-4 lg:px-0">
        {/* Grid container for the style cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-0">
          {stylesData.map((style) => (
            <div key={style.name} className="group relative h-96 w-full overflow-hidden rounded-2xl lg:rounded-none shadow-lg">
              {/* Background Image with Hover Zoom Effect */}
              <Image
                src={style.imgSrc}
                alt={`${style.name} style wig`}
                fill
                className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
              />
              
              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-black/40"></div>
              
              {/* Content */}
              <div className="relative h-full flex flex-col items-center justify-end text-center text-white p-8">
                <h3 className="text-4xl font-bold tracking-wider">{style.name}</h3>
                <p className=" text-white/90">{style.description}</p>
                
                {/* Shop Button */}
                <Link
                  href={style.href}
                  className="mt-6 inline-flex items-center justify-center gap-3 rounded-full border border-white/50 px-6 py-2 text-md  backdrop-blur-sm transition-colors hover:bg-white/10"
                >
                  Shop {style.name}
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white">
                    <ArrowUpRight className="h-4 w-4 text-black" />
                  </span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WigStyles;