'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

export default function Highlight() {
  // Self-contained animation styles
  const animationStyles = `
    @keyframes slide-in-from-left {
      from { opacity: 0; transform: translateX(-30px); }
      to { opacity: 1; transform: translateX(0); }
    }
    @keyframes slide-in-from-right {
      from { opacity: 0; transform: translateX(30px); }
      to { opacity: 1; transform: translateX(0); }
    }
    .animate-slide-in-left { animation: slide-in-from-left 1s ease-out forwards; }
    .animate-slide-in-right { animation: slide-in-from-right 1s ease-out forwards; }
  `;

  return (
    <>
      <style>{animationStyles}</style>
      <section className="bg-brand-tan py-20 lg:py-32 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            
            {/* --- Text Card (Left Side) --- */}
            {/* In a real app, you would use an Intersection Observer to trigger this animation on scroll */}
            <div 
              className="relative z-10 animate-slide-in-left"
              style={{ opacity: 0 }} // Start hidden for animation
            >
              <div className="bg-brand-secondary-bg text-brand-brown p-8 lg:p-12 rounded-2xl shadow-lg">
                <h3 className="text-lg font-semibold text-brand-pink">Collection Spotlight</h3>
                <h2
                  className="text-4xl lg:text-5xl font-bold mt-2"
                  style={{ fontFamily: 'var(--font-playfair-display)' }}
                >
                  The Wave Collection
                </h2>
                <p className="mt-4 text-base text-brand-brown/80 leading-relaxed">
                  Experience the art of movement. Our Wave Collection features soft, natural-looking waves that provide a style that's both effortlessly chic and undeniably glamorous.
                </p>
                <p className="mt-4 text-base text-brand-brown/80 leading-relaxed">
                  Crafted from 100% ethically sourced human hair, each piece offers unparalleled comfort and confidence.
                </p>
                <div className="mt-8">
                  <Link
                    href="/tools?style=wave"
                    className="group inline-flex items-center gap-3 rounded-full bg-brand-brown py-3 px-6 text-base font-bold text-brand-tan transition-all duration-300 hover:scale-105 hover:bg-brand-pink hover:text-brand-brown"
                  >
                    Shop The Look
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-tan text-brand-brown transition-transform group-hover:rotate-45 group-hover:bg-white">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </Link>
                </div>
              </div>
            </div>

            {/* --- Image (Right Side) --- */}
            <div 
              className="relative h-[600px] w-full animate-slide-in-right"
              style={{ opacity: 0, animationDelay: '0.2s' }} // Staggered animation
            >
              <div className="absolute top-0 right-0 w-full lg:w-[90%] h-full rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/highlights.jpg"
                  alt="Highlight Wig Collection"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            
          </div>
        </div>
      </section>
    </>
  );
}

