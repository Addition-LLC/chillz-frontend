'use client';

import { useState } from 'react';
import { products, Product } from '../../tools/products';
import Image from 'next/image';
import { Star, ChevronLeft, ChevronRight, Minus, Plus } from 'lucide-react';

// --- Helper function to find a product by its ID ---
const getProductById = (id: number): Product | undefined => {
  return products.find(p => p.id === id);
};

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const productId = parseInt(params.id, 10);
  const product = getProductById(productId);

  const [selectedLength, setSelectedLength] = useState<number | undefined>(product?.lengths[0]);
  const [quantity, setQuantity] = useState(1);
  
  const images = [
      product?.imageUrl || '/images/placeholder.jpg',
      '/images/wigcollection2.png',
      '/images/wigstyles3.jpg',
      '/images/popular1.jpg',
  ];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };
  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };


  if (!product) {
    return (
      <div className="bg-brand-tan min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold text-brand-brown">Product not found.</h1>
      </div>
    );
  }

  return (
    <div className="bg-brand-tan text-brand-brown">
      <main className="container mx-auto px-4 py-24 sm:px-6 lg:px-8">
        <div className="pt-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            <ImageCarousel images={images} currentImageIndex={currentImageIndex} prevImage={prevImage} nextImage={nextImage} />

            <div>
              <h1 className="text-3xl lg:text-4xl font-bold">{product.name}</h1>
              <p className="text-2xl mt-2">${product.price.toFixed(2)}</p>
              <div className="mt-4 flex items-center">
                  <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-5 w-5 ${i < 4 ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" />
                      ))}
                  </div>
                  <p className="ml-2 text-sm text-brand-brown/70">12 Reviews</p>
              </div>

              <p className="mt-6 text-base leading-relaxed text-brand-brown/80">
                Experience unparalleled quality with our {product.collection}. This {product.style.toLowerCase()} style is crafted from the finest ethically sourced human hair for a natural look and feel.
              </p>

              {product.lengths.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-sm font-medium">Length: {selectedLength}"</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {product.lengths.map(length => (
                      <button 
                        key={length} 
                        onClick={() => setSelectedLength(length)}
                        className={`px-4 py-2 text-sm rounded-full border transition-colors ${selectedLength === length ? 'bg-brand-brown text-white border-brand-brown' : 'border-gray-300 hover:border-brand-brown'}`}
                      >
                        {length}"
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="mt-8 flex items-center gap-4">
                  <div className="flex items-center border border-gray-300 rounded-full">
                      <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="p-2"><Minus className="h-4 w-4" /></button>
                      <span className="px-4 text-lg font-semibold">{quantity}</span>
                      <button onClick={() => setQuantity(q => q + 1)} className="p-2"><Plus className="h-4 w-4" /></button>
                  </div>
                  <button className="flex-1 bg-brand-pink text-brand-brown font-bold py-3 px-8 rounded-full hover:opacity-90 transition-opacity">
                      Add to Cart
                  </button>
              </div>
            </div>
          </div>

          <div className="mt-24">
              <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
              <p className="text-brand-brown/70">Reviews are coming soon...</p>
          </div>
           <div className="mt-16">
              <h2 className="text-2xl font-bold mb-6">You Might Also Like</h2>
              <p className="text-brand-brown/70">Related products will be shown here...</p>
          </div>
        </div>
      </main>
    </div>
  );
}


function ImageCarousel({ images, currentImageIndex, prevImage, nextImage }: any) {
    return (
        <div className="relative w-full aspect-w-1 aspect-h-1">
            <div className="overflow-hidden rounded-lg">
                <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}>
                    {images.map((src: string, index: number) => (
                        <div key={index} className="w-full flex-shrink-0">
                             <Image src={src} alt={`Product image ${index + 1}`} width={800} height={1000} className="w-full h-full object-cover" />
                        </div>
                    ))}
                </div>
            </div>
            <button onClick={prevImage} className="absolute top-1/2 left-2 -translate-y-1/2 bg-white/50 rounded-full p-2 hover:bg-white transition">
                <ChevronLeft className="h-6 w-6 text-brand-brown" />
            </button>
            <button onClick={nextImage} className="absolute top-1/2 right-2 -translate-y-1/2 bg-white/50 rounded-full p-2 hover:bg-white transition">
                <ChevronRight className="h-6 w-6 text-brand-brown" />
            </button>
        </div>
    );
}