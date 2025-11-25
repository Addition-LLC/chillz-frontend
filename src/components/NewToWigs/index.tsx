'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Leaf, Gem } from 'lucide-react';

const NewToWigs = () => {
  return (
    <section className="bg-white py-20 lg:py-32 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
          
          <div className="lg:col-span-3 text-black text-center lg:text-left">
            <h2 
              className="text-4xl lg:text-5xl font-bold leading-tight font-bold font-edwardian-first-letter"
              style={{ fontFamily: 'var(--font-caviar-dreams)' }}
            >
              Beyond Beauty.
              <br />
              An Expression of You.
            </h2>
            <p className="mt-4 text-lg text-black/80 max-w-xl mx-auto lg:mx-0" style={{fontFamily: 'var(--font-caviar-dreams)'}}>
              At Nhïëm Wën, we believe hair is a statement of confidence. Our collections are designed to empower you to be unapologetically you.
            </p>
            
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-8 text-left">
              <div className="flex items-start gap-4">
                <Leaf className="h-8 w-8 text-black flex-shrink-0" />
                <div>
                  <h3 className="font-bold" style={{fontFamily: 'var(--font-caviar-dreams)'}}>Expert Guidance</h3>
                  <p className="text-sm text-black/70" style={{fontFamily: 'var(--font-caviar-dreams)'}}>Personalized consultations to find your perfect match.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Gem className="h-8 w-8 text-black flex-shrink-0" />
                <div>
                  <h3 className="font-bold" style={{fontFamily: 'var(--font-caviar-dreams)'}}>Premium Quality</h3>
                  <p className="text-sm text-black/70" style={{fontFamily: 'var(--font-caviar-dreams)'}}>100 % ethically sourced human hair, crafted for a flawless look.</p>
                </div>
              </div>
            </div>
            
            <div className="mt-10">
               <Link
                href="/product"
                className="group inline-flex items-center gap-3 rounded-none bg-black py-3 px-6 text-base font-bold text-white transition-all duration-300 hover:scale-105 hover:bg-white hover:text-black hover:border-black border border-transparent hover:border"
                style={{fontFamily: 'var(--font-caviar-dreams)'}}
              >
                Find Your Signature Style
                <span className="flex h-8 w-8 items-center justify-center rounded-none bg-white text-black transition-transform group-hover:rotate-45 group-hover:bg-black group-hover:text-white">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </Link>
            </div>
          </div>
          
          <div className="lg:col-span-2 relative h-[550px] w-full">
            <Link href="/product" className="absolute top-0 left-0 w-full h-full rounded-none overflow-hidden shadow-2xl block">
              <Image
                src="/images/newtowigs1.jpg"
                alt="Woman with beautiful wavy hair"
                fill
                className="object-cover"
              />
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
};

export default NewToWigs;