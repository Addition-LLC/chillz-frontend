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
        <div className={`flex h-16 w-16 items-center justify-center rounded-full bg-brand-pink transition-transform duration-300 ${isHovered ? 'scale-110' : 'scale-100'}`}>
          <ArrowUpRight className="h-8 w-8 text-brand-brown" />
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
      <section className="bg-brand-secondary-bg py-20 lg:py-32 overflow-hidden text-brand-brown">
        <div className="container mx-auto px-4">
          {/* --- Desktop Layout --- */}
          <div className="hidden lg:grid grid-cols-3 gap-16 items-center">
            
            <div className="flex flex-col h-full space-y-8 animate-slide-in-left" style={{ animationDelay: '0.2s', opacity: 0 }}>
              <div>
                <h2 className="text-4xl tracking-wide font-bold" style={{ fontFamily: 'var(--font-playfair-display)' }}>
                  Experience The Difference
                </h2>
                <p className="mt-3 text-lg text-brand-brown/80">
                  Our wigs aren't just accessories; they're a statement of quality and confidence.
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4"><Leaf className="h-6 w-6 text-brand-pink" /><div><h3 className="font-bold">100% Human Hair</h3><p className="text-sm text-brand-brown/70">For the most natural look and feel.</p></div></div>
                <div className="flex items-center gap-4"><Heart className="h-6 w-6 text-brand-pink" /><div><h3 className="font-bold">Ethically Sourced</h3><p className="text-sm text-brand-brown/70">Beauty with a conscience.</p></div></div>
                <div className="flex items-center gap-4"><Gem className="h-6 w-6 text-brand-pink" /><div><h3 className="font-bold">Unmatched Quality</h3><p className="text-sm text-brand-brown/70">Crafted to last, designed to impress.</p></div></div>
              </div>
              
              <div className="relative group w-full h-56 mt-auto">
                <Image src="/images/wigcollection1.jpg" alt="Dark wavy wig style" fill className="rounded-2xl object-cover shadow-lg"/>
                <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"><button aria-label="Play video" className="flex h-12 w-12 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm transition-transform hover:scale-110"><Play className="ml-1 h-6 w-6 fill-brand-brown text-brand-brown" /></button></div>
              </div>
            </div>

            <div className="relative h-[32rem] w-full group animate-fade-in-up" style={{ animationDelay: '0.4s', opacity: 0 }}>
              <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl">
                <Image src="/images/wigcollection2.png" alt="Model with blonde wig" fill className="object-cover transition-transform duration-500 group-hover:scale-105"/>
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <Link href="/shop" className="group/button inline-flex items-center justify-center gap-4 rounded-full bg-white py-3 pl-8 pr-3 text-lg font-bold text-brand-brown transition-all duration-300 hover:bg-brand-brown hover:text-white">
                    <span className="transition-transform duration-300 group-hover/button:-translate-x-2 hover:text-black">Shop The Look</span>
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-pink transition-colors duration-300 group-hover/button:bg-black">
                      <ArrowUpRight className="h-5 w-5 text-brand-brown transition-colors duration-300 group-hover/button:text-brand-pink" />
                    </span>
                  </Link>
                </div>
              </div>
            </div>

            <div className="h-full flex flex-col items-center justify-between animate-slide-in-right" style={{ animationDelay: '0.6s', opacity: 0 }}>
              <Link href="/tools" className="self-center"><CircularText /></Link>
              <div className="relative w-full h-60"><Image src="/images/wigcollection3.jpg" alt="Two models with curly hair" fill className="rounded-3xl object-cover shadow-lg"/></div>
            </div>
          </div>
          
          <div className="flex flex-col items-center text-center lg:hidden space-y-10">
              <div>
                <h2 className="text-4xl tracking-wide font-bold" style={{ fontFamily: 'var(--font-playfair-display)' }}>
                  Experience The Difference
                </h2>
                <p className="mt-3 text-lg text-brand-brown/80 max-w-md mx-auto">
                  Our wigs aren't just accessories; they're a statement of quality and confidence.
                </p>
              </div>

              <div className="relative w-full max-w-sm h-[28rem] rounded-3xl overflow-hidden shadow-2xl group">
                <Image src="/images/wigcollection2.png" alt="Main wig style" fill className="object-cover"/>
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/20">
                    <Link href="/shop" className="group/button inline-flex items-center justify-center gap-4 rounded-full bg-white py-3 pl-8 pr-3 text-lg font-bold text-brand-brown">
                        Shop The Look
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-pink">
                            <ArrowUpRight className="h-5 w-5 text-brand-brown" />
                        </span>
                    </Link>
                </div>
              </div>
              
               <div className="space-y-4 max-w-sm">
                <div className="flex items-center text-left gap-4"><Leaf className="h-6 w-6 text-brand-pink flex-shrink-0" /><div><h3 className="font-bold">100% Human Hair</h3><p className="text-sm text-brand-brown/70">For the most natural look and feel.</p></div></div>
                <div className="flex items-center text-left gap-4"><Heart className="h-6 w-6 text-brand-pink flex-shrink-0" /><div><h3 className="font-bold">Ethically Sourced</h3><p className="text-sm text-brand-brown/70">Beauty with a conscience.</p></div></div>
              </div>

              <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                 <div className="relative h-48 rounded-2xl overflow-hidden shadow-lg"><Image src="/images/wigcollection1.jpg" alt="Dark wavy wig style" fill className="object-cover"/></div>
                 <div className="relative h-48 rounded-2xl overflow-hidden shadow-lg"><Image src="/images/wigcollection3.jpg" alt="Curly hair styles" fill className="object-cover"/></div>
              </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default WigCollection;

