"use client";

import { useState } from "react";
import { HeartIcon as HeartSolid, StarIcon } from "@heroicons/react/24/solid";
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";

export default function PopularLooks() {
  const [favorites, setFavorites] = useState<number[]>([]);

  const products = [
    { id: 1, name: "Blonde Classic Style", price: 49, img: "/images/shop1.jpg" },
    { id: 2, name: "Curly Dark Style", price: 49, img: "/images/shop2.jpg" },
    { id: 3, name: "Long Wavy Brunette", price: 49, img: "/images/shop3.jpg" },
    { id: 4, name: "Long Straight Brunette", price: 49, img: "/images/wigstyles2.jpg" },
  ];

  const toggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  };

  return (
    <section className="max-w-6xl mx-auto px-6 py-12">
      <h2
        className="text-center text-3xl md:text-4xl font-bold mb-10"
        style={{
          fontFamily: "'ARPDisplay', Arial, sans-serif",
          fontWeight: 700,
        }}
      >
        POPULAR LOOKS
      </h2>

      {/* Responsive Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.id} className="overflow-hidden">
            {/* Image Container */}
            <div className="relative shadow h-[455px] rounded-[16px] overflow-hidden">
              <img
                src={product.img}
                alt={product.name}
                className="w-full h-full object-cover"
              />

              {/* Favorite Button */}
              <button
                onClick={() => toggleFavorite(product.id)}
                className="absolute top-4 right-4 bg-white/50 rounded-full p-2 shadow-md hover:scale-110 transition"
              >
                {favorites.includes(product.id) ? (
                  <HeartSolid className="w-6 h-6 text-red-500" />
                ) : (
                  <HeartOutline className="w-6 h-6 text-gray-600" />
                )}
              </button>

              {/* Full View Button */}
               <button className="md:absolute bottom-3 left-1/2  transform -translate-x-1/2 w-[142px] h-[40px] bg-[#5E3B1E] text-white text-[16px] font-bold py-4 shadow-md hover:bg-[#4A2F17] transition hidden md:flex items-center justify-center"
                style={{
                  fontFamily: "'ARPDisplay', Arial, sans-serif",
                  fontWeight: 700,
                }}>
                FULL VIEW
              </button>
            </div>

            {/* Content */}
            <div className="p-4 text-center">
              <h3 className="font-semibold text-lg truncate">{product.name}</h3>
              <div className="flex justify-center my-2 text-yellow-500">
                {Array.from({ length: 5 }, (_, i) => (
                  <StarIcon key={i} className="w-5 h-5 " />
                ))}
              </div>
              <p className="text-lg font-bold">${product.price}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}