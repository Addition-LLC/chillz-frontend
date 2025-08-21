// app/components/Hero/index.tsx

"use client";

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';

export default function Hero() {
  return (
    <section className="relative h-screen w-full">
      {/* Background Image - positioned to the left on larger screens */}
      <Image
        src="/images/hero.png" 
        alt="Woman with long, styled brown hair"
        fill
        priority
        quality={100}
        className="object-cover object-center lg:object-left-center"
      />

      {/* Content Grid */}
      <div className="relative z-10 grid h-full grid-cols-1 items-center sm:grid-cols-2">
        {/* Left Column (empty, for spacing on desktop) */}
        <div className="hidden sm:block" />

        {/* Right Column (contains all text and button) */}
        <div className="flex flex-col  px-6 items-center ">
          <p className="text-2xl font-semibold  text-[#a6a57a] text-center">
            UP TO 40% OFF
          </p>
          <p className="mb-2 text-lg font-semibold text-white text-center">
            ON NEW WIGS
          </p>

          <h1 className="text-xl font-extrabold leading-tight text-white md:text-3xl lg:text-5xl text-center ">
              Natural Human Hair Wig For Women
          </h1>
          
          <p className="mt-4  text-white/90 text-center">
            Femmez Lace & Wigs, the premium lace wig specialist
          </p>

          <Link
            href="/shop"
            className="group mt-8 inline-flex items-center justify-center gap-3 rounded-full bg-[#6a693e] py-2 px-6 text-lg font-bold text-white transition-colors hover:bg-[#585734] max-w-[250px] w-full sm:w-auto"
          >
            Shop Now
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white transition-transform group-hover:scale-110">
              <ArrowUpRight className="h-6 w-4 text-[#6a693e]" />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}