'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Scissors, Palette, HeartHandshake, Plus, Minus } from 'lucide-react';

const featuresData = [
  {
    icon: Scissors,
    title: "Perfectly Tailored",
    description: "Whether you desire a sleek, modern bob or long, flowing locks, our master stylists will help you achieve the perfect cut, tailored exclusively for you.",
    imageSrc: "/images/features1.jpg"
  },
  {
    icon: Palette,
    title: "Artistry in Color",
    description: "From subtle, sun-kissed highlights to bold, vibrant hues, our colorists use their artistry to create a look that perfectly matches your unique style and personality.",
    imageSrc: "/images/wigcollection3.jpg"
  },
  {
    icon: HeartHandshake,
    title: "A Service of Passion",
    description: "We believe in beauty with a conscience. Whether you need styling advice or help selecting the perfect piece, we're here to serve you with passion and expertise.",
    imageSrc: "/images/features2.jpg"
  }
];

export default function Features() {
  const [openIndex, setOpenIndex] = useState(0); // Default first item to be open

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? -1 : index); // Allows closing by clicking again
  };

  return (
    <section className="bg-brand-tan py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2
            className="text-3xl sm:text-4xl font-bold text-brand-brown"
            style={{ fontFamily: 'var(--font-caviar-dreams)' }}
          >
            Our Commitment to Perfection
          </h2>
          <p className="mt-4 text-lg text-brand-brown/80 max-w-2xl mx-auto">
            Discover the core principles that make ChilzStyles a leader in luxury hair.
          </p>
        </div>

        <div className="max-w-4xl mx-auto border-t border-b border-brand-brown/20">
          {featuresData.map((feature, index) => (
            <div key={index} className="border-b border-brand-brown/20">
              <button
                onClick={() => handleToggle(index)}
                className="w-full flex justify-between items-center text-left py-6"
              >
                <div className="flex items-center gap-4">
                  <feature.icon className="h-8 w-8 text-brand-pink flex-shrink-0" />
                  <h3
                    className="text-2xl lg:text-3xl font-bold text-brand-brown"
                    style={{ fontFamily: 'var(--font-caviar-dreams)' }}
                  >
                    {feature.title}
                  </h3>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-secondary-bg">
                  {openIndex === index ? <Minus className="h-5 w-5 text-brand-brown" /> : <Plus className="h-5 w-5 text-brand-brown" />}
                </div>
              </button>
              <div
                className={`grid transition-all duration-500 ease-in-out ${
                  openIndex === index ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                }`}
              >
                <div className="overflow-hidden">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4 pb-8">
                    <p className="text-base text-brand-brown/80">
                      {feature.description}
                    </p>
                    <div className="relative h-48 w-full rounded-lg overflow-hidden">
                      <Image 
                        src={feature.imageSrc}
                        alt={feature.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}