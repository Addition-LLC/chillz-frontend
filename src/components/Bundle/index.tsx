'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function Bundle() {
  return (
    <section className="w-full bg-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-12">
          {/* Image Side */}
          <div className="w-full md:w-1/2 relative h-[500px] md:h-[600px] overflow-hidden">
            <Image
              src="/images/wigcollection2.png"
              alt="Premium Hair Bundles"
              fill
              className="object-cover object-center hover:scale-105 transition-transform duration-700"
            />
          </div>

          {/* Content Side */}
          <div className="w-full md:w-1/2 flex flex-col items-start justify-center text-left space-y-6">
            <h2 
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-black leading-tight font-edwardian-first-letter"
              style={{ fontFamily: 'var(--font-caviar-dreams)' }}
            >
              LUXURY <br /> BUNDLES
            </h2>
            <p className="text-lg text-gray-600 max-w-md leading-relaxed">
              Experience the finest quality human hair bundles. Silky, smooth, and designed to blend perfectly for a flawless look. Elevate your style with our premium collection.
            </p>
            <div className="pt-4">
              <Link
                href="/bundles"
                className="inline-block px-10 py-4 bg-black text-white font-bold text-sm uppercase tracking-[0.2em] hover:bg-gray-800 transition-all duration-300 rounded-none"
              >
                Shop Bundles
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
