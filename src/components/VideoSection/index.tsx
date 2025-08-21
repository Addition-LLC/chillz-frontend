"use client";
import { useState } from "react";

export default function VideoSection() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section className="max-w-6xl mx-auto p-6 md:p-12 text-white">
      <div className="relative h-[530px]">
        {!isPlaying ? (
          <div
            className="relative w-full h-full cursor-pointer"
            onClick={() => setIsPlaying(true)}
          >
            {/* Poster Image */}
            <img
              src="/images/custom-thumbnail.jpg"
              alt="Video Thumbnail"
              className="w-full h-full object-cover rounded-[16px]"
            />

            {/* Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white/80 rounded-full p-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-12 h-12 text-black"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </div>
        ) : (
          <video
            className="w-full h-full object-cover rounded-[16px]"
            controls
            autoPlay
          >
            <source src="/videos/features.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
      </div>
    </section>
  );
}
