'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

export default function Highlight() {
  // Self-contained animation styles for the slide-in effect
  const animationStyles = `
    @keyframes slide-in-from-left {
      from { opacity: 0; transform: translateX(-30px); }
      to { opacity: 1; transform: translateX(0); }
    }
    .animate-slide-in {
      animation: slide-in-from-left 1s ease-out forwards;
    }
  `;

  return (
    <>
      <style>{animationStyles}</style>
      <section className="relative h-[90vh] lg:h-screen w-full">
        {/* --- Background Image --- */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/newtowigs1.jpg"
            alt="Highlight Wig Collection"
            fill
            className="object-cover"
          />
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-brand-brown/40"></div>
        </div>

        {/* --- Content Card --- */}
        {/* In a real app, you would use an Intersection Observer to trigger this animation on scroll */}
        <div className="relative z-10 h-full flex items-center">
          <div className="container mx-auto px-4">
            <div 
              className="bg-brand-tan/90 text-brand-brown p-8 lg:p-12 rounded-2xl shadow-2xl max-w-lg backdrop-blur-sm animate-slide-in"
              style={{ opacity: 0 }} // Start hidden for animation
            >
              <h3 className="text-lg font-semibold text-brand-pink">Collection Spotlight</h3>
              <h2
                className="text-4xl lg:text-5xl font-bold mt-2 font-edwardian-first-letter"
                style={{ fontFamily: 'var(--font-caviar-dreams)' }}
              >
                The Wave Collection
              </h2>
              <p className="mt-4 text-base text-brand-brown/80 leading-relaxed">
                Experience the art of movement. Our Wave Collection features soft, natural-looking waves that provide a style that&apos;s effortlessly chic and undeniably glamorous.
              </p>
              <p className="mt-4 text-base text-brand-brown/80 leading-relaxed">
                Crafted from 100% ethically sourced human hair, each piece offers unparalleled comfort and confidence.
              </p>
              <div className="mt-8">
                <Link
                  href="/product"
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
        </div>
      </section>
    </>
  );
}