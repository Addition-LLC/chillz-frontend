'use client';

import { useState } from "react";
import Image from 'next/image';
import { Play } from 'lucide-react';

export default function VideoSection() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section className="bg-white py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* --- Text Content --- */}
          <div className="text-black text-center lg:text-left">
            <h2 
              className="text-3xl lg:text-4xl font-bold"
              style={{ fontFamily: 'var(--font-playfair-display)' }}
            >
              The Art of Transformation
            </h2>
            <p className="mt-4 text-lg text-black/80 max-w-xl mx-auto lg:mx-0">
              See the meticulous craftsmanship and passion that goes into every ChilzStyles piece. We believe in more than just wigs; we believe in empowering you through the art of hair.
            </p>
          </div>

          {/* --- Video Player --- */}
          <div className="relative h-[500px] w-full rounded-none overflow-hidden shadow-lg">
            {!isPlaying ? (
              <div
                className="relative w-full h-full cursor-pointer group"
                onClick={() => setIsPlaying(true)}
              >
                <Image
                  src="/images/custom-thumbnail.jpg"
                  alt="Video Thumbnail"
                  fill
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <div className="flex h-20 w-20 items-center justify-center rounded-none bg-white/80 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                    <Play className="w-10 h-10 text-black fill-current ml-1" />
                  </div>
                </div>
              </div>
            ) : (
              <video
                className="w-full h-full object-cover"
                controls
                autoPlay
              >
                <source src="/videos/features.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}