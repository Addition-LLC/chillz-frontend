'use client';

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
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 z-0 h-full w-full object-cover brightness-40"
        >
          <source src="/videos/hero-video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <div className="relative z-10 flex h-full flex-col items-center justify-center p-6 text-center text-white">
          <p
            className="text-3xl font-bold text-brand-pink drop-shadow-lg"
            style={{
              animation: 'fade-in-up 0.5s ease-out forwards',
              animationDelay: '0.2s',
              opacity: 0, 
            }}
          >
            UP TO 40% OFF
          </p>
          <p
            className="mb-2 text-lg drop-shadow-lg"
            style={{
              animation: 'fade-in-up 0.5s ease-out forwards',
              animationDelay: '0.3s',
              opacity: 0,
            }}
          >
            ON NEW WIGS
          </p>
          <h1
            className="text-4xl font-bold drop-shadow-lg md:text-5xl lg:text-6xl"
            style={{
              animation: 'fade-in-up 0.5s ease-out forwards',
              animationDelay: '0.4s',
              opacity: 0,
            }}
          >
            Natural Human Hair Wigs for Women
          </h1>
          <p
            className="mt-3 text-sm opacity-80 drop-shadow-lg"
            style={{
              animation: 'fade-in-up 0.5s ease-out forwards',
              animationDelay: '0.5s',
              opacity: 0,
            }}
          >
            Femmez Lace & Wigs, the premium lace wig specialist
          </p>

          <Link
            href="/tools"
            className="group mt-8 rounded-full border-2 border-white px-8 py-3 text-lg font-bold text-white transition-all duration-300 hover:scale-105 hover:border-brand-pink hover:bg-brand-pink hover:text-brand-brown"
            style={{
              animation: 'fade-in-up 0.5s ease-out forwards',
              animationDelay: '0.6s',
              opacity: 0,
            }}
          >
            Shop Now
          </Link>
        </div>
      </section>
    </>
  );
}