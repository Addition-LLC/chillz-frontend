'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function Hero() {
  const animationStyles = `
    @keyframes fade-in-up {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;

  return (
    <>
      <style>{animationStyles}</style>

      <section className="relative h-screen w-full overflow-hidden">
        {/* Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute left-0 top-0 z-0 h-full w-full object-cover brightness-50"
        >
          <source src="/videos/hero-video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Centered Logo */}
        <div className="relative z-10 flex flex-col h-full w-full items-center justify-center p-6 gap-8">
          <Image
            src="/logo-white.png"
            alt="Femmez Lace & Wigs Logo"
            width={500}
            height={300}
            className="h-auto w-3/4 max-w-md drop-shadow-lg"
            style={{
              animation: 'fade-in-up 0.8s ease-out forwards',
              opacity: 0,
            }}
            priority // Helps with faster loading for this important image
          />
          
          <Link 
            href="/bundles"
            className="px-8 py-3 bg-white/10 backdrop-blur-md border border-white/30 text-white font-bold rounded-none hover:bg-white hover:text-black transition-all duration-300 transform hover:scale-105 hover:shadow-lg uppercase tracking-widest text-sm"
            style={{
              animation: 'fade-in-up 0.8s ease-out 0.3s forwards',
              opacity: 0,
              fontFamily: 'var(--font-caviar-dreams)'
            }}
          >
            Shop Bundles
          </Link>
        </div>
      </section>
    </>
  );
}