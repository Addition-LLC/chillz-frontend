'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Play, ArrowUpRight, Leaf, Heart, Gem } from 'lucide-react';

const CircularText = () => {
  const [isHovered, setIsHovered] = useState(false);
  const text = " • Shop The Collection • Discover Your Style";
  return (
    <div 
      className="relative w-32 h-32"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        className="absolute inset-0 animate-spin-slow"
        style={{ animationPlayState: isHovered ? 'paused' : 'running' }}
      >
        <svg viewBox="0 0 100 100" width="128" height="128">
          <defs>
            <path id="circlePath" d="M 50, 50 m -45, 0 a 45,45 0 1,1 90,0 a 45,45 0 1,1 -90,0" />
          </defs>
          <text fill="currentColor" fontSize="9" fontWeight="bold" letterSpacing="1.5">
            <textPath href="#circlePath">{text}</textPath>
          </text>
        </svg>
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className={`flex h-16 w-16 items-center justify-center rounded-full bg-black transition-transform duration-300 ${isHovered ? 'scale-110' : 'scale-100'}`}>
          <ArrowUpRight className="h-8 w-8 text-white" />
        </div>
      </div>
    </div>
  );
};

const WigCollection = () => {
  const animationStyles = `
    @keyframes slide-in-left { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
    @keyframes slide-in-right { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
    @keyframes fade-in-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    .animate-slide-in-left { animation: slide-in-left 0.8s ease-out forwards; }
    .animate-slide-in-right { animation: slide-in-right 0.8s ease-out forwards; }
    .animate-fade-in-up { animation: fade-in-up 0.8s ease-out forwards; }
  `;

  return (
    <>
      <style>{animationStyles}</style>
      <section className="relative bg-white py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="hidden lg:grid grid-cols-3 gap-10">
            <div className="flex flex-col justify-between space-y-10 animate-slide-in-left" style={{ animationDelay: '0.2s', opacity: 0 }}>
              <div className="mb-8">
                <h2 className="text-5xl tracking-wide font-bold text-black" style={{ fontFamily: 'var(--font-caviar-dreams)' }}>
                  Experience The <i className="font-edwardian-first-letter text-6xl not-italic">Difference</i>
                </h2>
                <p className="mt-6 text-lg text-black/80 leading-relaxed">
                  Our wigs aren&apos;t just accessories; they&apos;re a statement of quality and confidence.
                </p>
              </div>

              <div className="space-y-5 pb-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-none bg-black text-white">
                    <Leaf className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-black">100% Natural Hair</h3>
                    <p className="text-sm text-black/70">Ethically sourced for unmatched quality.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-none bg-black text-white">
                    <Heart className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-black">Comfort Fit</h3>
                    <p className="text-sm text-black/70">Designed for all-day wear.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-none bg-black text-white">
                    <Gem className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-black">Premium Craftsmanship</h3>
                    <p className="text-sm text-black/70">Hand-crafted to perfection.</p>
                  </div>
                </div>
              </div>

              <Link href="/product" className="relative group w-full h-56 mt-auto block">
                <Image src="/images/wigcollection1.jpg" alt="Dark wavy wig style" fill className="rounded-none object-cover shadow-lg"/>
                <div className="absolute inset-0 flex items-center justify-center rounded-none bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button aria-label="Play video" className="flex h-12 w-12 items-center justify-center rounded-none bg-white/80 backdrop-blur-sm transition-transform hover:scale-110">
                    <Play className="ml-1 h-6 w-6 fill-black text-black" />
                  </button>
                </div>
              </Link>
            </div>

            <div className="relative h-[32rem] w-full group animate-fade-in-up" style={{ animationDelay: '0.4s', opacity: 0 }}>
              <Link href="/product" className="relative w-full h-full rounded-none overflow-hidden shadow-2xl block">
                <Image src="/images/wigcollection2.png" alt="Model with blonde wig" fill className="object-cover transition-transform duration-500 group-hover:scale-105"/>
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="group/button inline-flex items-center justify-center gap-4 rounded-none bg-white py-3 pl-8 pr-3 text-lg font-bold text-black transition-all duration-300 hover:bg-black hover:text-white">
                    <span className="transition-colors duration-300">Shop The Look</span>
                    <span className="flex h-10 w-10 items-center justify-center rounded-none bg-black text-white transition-colors duration-300 group-hover/button:bg-white group-hover/button:text-black">
                      <ArrowUpRight className="h-5 w-5" />
                    </span>
                  </div>
                </div>
              </Link>
            </div>

            <div className="h-full flex flex-col items-center justify-between animate-slide-in-right" style={{ animationDelay: '0.6s', opacity: 0 }}>
              <Link href="/product" className="self-center"><CircularText /></Link>
              <Link href="/product" className="relative w-full h-60 block"><Image src="/images/wigcollection3.jpg" alt="Two models with curly hair" fill className="rounded-none object-cover shadow-lg"/></Link>
            </div>
          </div>
          
          <div className="flex flex-col items-center text-center lg:hidden space-y-10">
              <div>
                <h2 className="text-4xl tracking-wide font-bold font-edwardian-first-letter" style={{ fontFamily: 'var(--font-caviar-dreams)' }}>
                  Experience The Difference
                </h2>
                <p className="mt-3 text-lg text-black/80 max-w-md mx-auto">
                  Our wigs aren&apos;t just accessories; they&apos;re a statement of quality and confidence.
                </p>
              </div>

              <Link href="/product" className="relative w-full max-w-sm h-[28rem] rounded-none overflow-hidden shadow-2xl group block">
                <Image src="/images/wigcollection2.png" alt="Main wig style" fill className="object-cover"/>
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/20">
                    <div className="group/button inline-flex items-center justify-center gap-4 rounded-none bg-white py-3 pl-8 pr-3 text-lg font-bold text-black transition-all duration-300 hover:bg-black hover:text-white">
                        <span className="transition-colors duration-300">Shop The Look</span>
                        <span className="flex h-10 w-10 items-center justify-center rounded-none bg-black text-white transition-colors duration-300 group-hover/button:bg-white group-hover/button:text-black">
                            <ArrowUpRight className="h-5 w-5" />
                        </span>
                    </div>
                </div>
              </Link>
              
                <div className="space-y-4 max-w-sm">
                 <div className="flex items-center text-left gap-4"><Leaf className="h-6 w-6 text-black flex-shrink-0" /><div><h3 className="font-bold">100% Human Hair</h3><p className="text-sm text-black/70">For the most natural look and feel.</p></div></div>
                 <div className="flex items-center text-left gap-4"><Heart className="h-6 w-6 text-black flex-shrink-0" /><div><h3 className="font-bold">Ethically Sourced</h3><p className="text-sm text-black/70">Beauty with a conscience.</p></div></div>
                </div>

                <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                    <Link href="/product" className="relative h-48 rounded-none overflow-hidden shadow-lg block"><Image src="/images/wigcollection1.jpg" alt="Dark wavy wig style" fill className="object-cover"/></Link>
                    <Link href="/product" className="relative h-48 rounded-none overflow-hidden shadow-lg block"><Image src="/images/wigcollection3.jpg" alt="Curly hair styles" fill className="object-cover"/></Link>
                </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default WigCollection;