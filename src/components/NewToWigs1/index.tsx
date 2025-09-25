'use client';

import Image from 'next/image';
import { Leaf, Palette, HeartHandshake } from 'lucide-react';

// New, more aspirational content for the features
const featuresData = [
  {
    icon: Leaf,
    title: "Uncompromisingly Natural",
    description: "Every strand is 100% ethically sourced human hair, ensuring a flawless, natural look that moves and feels like your own."
  },
  {
    icon: Palette,
    title: "Artistry in Color",
    description: "Our master colorists use their artistry to create custom hues, from sun-kissed highlights to rich, vibrant tones, tailored to your vision."
  },
  {
    icon: HeartHandshake,
    title: "A Commitment to You",
    description: "We're more than a brand; we're your partners in style. Receive personalized guidance and passionate service every step of the way."
  }
];

export default function Features() {
  return (
    <section className="bg-brand-tan py-20 lg:py-32 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            
            {/* --- Left Column: Image --- */}
            <div className="relative h-[500px] lg:h-[650px] w-full">
              <div className="absolute w-full h-full lg:w-[120%] lg:h-[110%] lg:-top-[5%] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/promise1.jpg" 
                  alt="A close-up of beautiful, styled hair"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* --- Right Column: Content --- */}
            <div className="text-brand-brown z-10">
              <h2
                className="text-3xl lg:text-4xl font-bold mb-8"
                style={{ fontFamily: 'var(--font-playfair-display)' }}
              >
                The Nhim Wen Promise
              </h2>
              
              <div className="space-y-8 border-l-2 border-brand-pink pl-8">
                {featuresData.map((feature, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-pink/10 flex-shrink-0">
                      <feature.icon className="h-6 w-6 text-brand-pink" />
                    </div>
                    <div>
                      <h3
                        className="text-xl font-bold"
                        style={{ fontFamily: 'var(--font-playfair-display)' }}
                      >
                        {feature.title}
                      </h3>
                      <p className="text-base text-brand-brown/70 mt-1">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}