"use client";

import {  ArrowUpRightIcon } from "@heroicons/react/24/outline";

export default function ShopByCategory() {
  const products = [
    { id: 1, name: "Blonde Classic Style", type: "BLONDE STRAIGHT", img: "/images/shop1.jpg" },
    { id: 2, name: "Curly Dark Style", type: "BODY WAVE", img: "/images/shop2.jpg" },
    { id: 3, name: "Long Wavy Brunette", type: "LOOSE CURLS", img: "/images/shop3.jpg" },
    { id: 4, name: "Long Straight Brunette", type: "YAKI STRAIGHT", img: "/images/wigstyles2.jpg" },
  ];

  return (
    <section className="max-w-6xl mx-auto px-6 py-12 bg-[#FBF8F3]">
      <h2
        className="text-center text-3xl md:text-4xl font-bold mb-10"
        style={{
          fontFamily: "'ARPDisplay', Arial, sans-serif",
          fontWeight: 700,
        }}
      >
        SHOP BY CATEGORY
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
            <button
              className="md:absolute bottom-18 left-1/2 w-[236px] h-[40px] bg-[#636340] hover:bg-[#6b6b3e] transition transform -translate-x-1/2 text-white text-[16px] font-bold shadow-md hidden md:flex items-center justify-center z-10"
              style={{
                fontFamily: "'ARPDisplay', Arial, sans-serif",
                fontWeight: 700,
              }}
            >
              {product.type}
            </button>


              {/* Full View Button */}
              <button className="md:absolute bottom-3 left-1/2  transform -translate-x-1/2 w-[142px] h-[40px] bg-[#5E3B1E] text-white text-[16px] font-bold py-4 shadow-md hover:bg-[#4A2F17] transition hidden md:flex items-center justify-center"
                style={{
                  fontFamily: "'ARPDisplay', Arial, sans-serif",
                  fontWeight: 700,
                }}>
                SHOP NOW
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* See All Categories Button */}
    <div className=" flex items-center justify-center text-center mt-10">
      <button
        className="bg-[#636340] text-white text-[19px] py-2 px-6 h-[64px] rounded-full shadow-md hover:bg-[#5e5e43] transition flex items-center"
        style={{
          fontFamily: "'ARPDisplay', Arial, sans-serif",
          fontWeight: 700,
        }}
      >
        See All CATEGORY
        <span className="ml-3 flex items-center justify-center w-10 h-10 bg-white rounded-full">
          <ArrowUpRightIcon className="w-5 h-5 text-[#636340]" />
        </span>
      </button>
    </div>

    </section>
  );
}