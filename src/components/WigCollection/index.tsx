// app/components/WigCollection.tsx

import Image from 'next/image';
import Link from 'next/link';
import { Play, ArrowUpRight } from 'lucide-react';



// app/components/CircularTextSpinner.tsx

const CircularTextSpinner = () => {
  return (
    <svg
      viewBox="0 0 100 100"
      width="128"
      height="128"
      className="text-gray-800"
    >
      {/* 1. Define the circular path */}
      <defs>
        <path
          id="circlePath"
          d="
            M 50, 50
            m -42, 0
            a 42,42 0 1,1 84,0
            a 42,42 0 1,1 -84,0
          "
        />
      </defs>

      {/* 2. Text that follows the full circle path */}
      {/* Increased font size and letter spacing to ensure it fills the circle */}
      <text
        fill="currentColor"
        fontSize="10"
        fontWeight="500"
        letterSpacing="2.8"
      >
        <textPath href="#circlePath">
          Develop your product with us
        </textPath>
      </text>

      {/* 3. The full, static arrow in the center (No Animation) */}
      <path
        d="M 40 60 L 60 40 M 45 40 L 60 40 L 60 55"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
};




const WigCollection = () => {
  return (
    <section className="bg-[#FBF6ED] py-20 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Main 3-column grid container for desktop */}
        <div className="hidden lg:grid grid-cols-3 2xl:px-4 gap-12 items-center" >
          
          {/* --- COLUMN 1: Text & First Image --- */}
          <div className="flex flex-col  h-120 pt-4">
            {/* Top Text */}
            <div className='mb-6'>
              <h2 className="text-2xl 2xl:text-3xl font-bold text-gray-800">
                SOME AMAZING WIGS COLLECTION
              </h2>
              <p className=" text-md text-gray-600">
                Natural wigs made from 100% human hair.
              </p>
            </div>
            
            {/* Image 1: wigcollection1.jpg */}
            <div className="relative w-64 xl:w-84 h-56 mb-16">
              <Image
                src="/images/wigcollection1.jpg"
                alt="Dark wavy wig style"
                fill
                className="rounded-2xl object-cover shadow-lg"
              />
              <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/20">
                <button 
                  aria-label="Play video" 
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm transition-transform hover:scale-110"
                >
                  <Play className="ml-1 h-5 w-5 fill-gray-800 text-gray-800" />
                </button>
              </div>
            </div>

            {/* Bottom Text */}
            <p className="text-gray-600 max-w-sm">
              With over 25 years of experience, we offer a wide range of styles to help you find your perfect look.
            </p>
          </div>

          {/* --- COLUMN 2: Main Image --- */}
          <div className="relative ">
            {/* We make the image larger than the column and use z-index to place it behind others */}
                <div className="relative w-80 h-110 rounded-3xl overflow-hidden" >
                  <Image
                    src="/images/wigcollection2.png"
                    alt="Hero"
                    fill
                    className="object-cover"
                  />
                  {/* Overlay mask on bottom-left */}
                  <div className="absolute  bottom-0 left-0 w-32 h-32 bg-[#FBF8F3] rounded-tr-4xl"></div>

                </div>
            {/* Shop Now Button */}
            {/* Positioned at the bottom, but visually shifted left with a negative margin to appear centered */}
              <div className="absolute bottom-[14%] xl:left-[-20%] left-[-35%] z-30">
                <Link
                  href="/shop"
                  className="group mt-8 inline-flex items-center justify-center gap-3 rounded-full bg-[#6a693e] py-2 px-6 text-lg font-bold text-white transition-colors hover:bg-[#585734] max-w-[250px] w-full sm:w-auto"
                >
                  Shop Now
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white transition-transform group-hover:scale-110">
                    <ArrowUpRight className="h-6 w-4 text-[#6a693e]" />
                  </span>
                </Link>
              </div>
          </div>

          {/* --- COLUMN 3: Images & Button --- */}
          <div className=" h-120 flex flex-col items-center xl:items-start gap-8">
            {/* Spinner Image */}
               <div className="mb-12">
              <CircularTextSpinner />
            </div>


            {/* Image 3: wigcollection3.jpg */}

    <div className="relative w-64 h-48 xl:w-80 xl:h-60 rounded-3xl overflow-hidden">
  <Image
    src="/images/wigcollection3.jpg"
    alt="Hero"
    fill
    className="object-cover"
  />
            </div>
            

          </div>
        </div>

      {/* --- NEW MOBILE LAYOUT (FOR SCREENS BELOW LG) --- */}
        <div className="flex flex-col items-center text-center lg:hidden">
          {/* Top Text */}
          <div className='mb-8 w-full max-w-md'>
            <h2 className="text-3xl font-bold text-gray-800">
              SOME AMAZING WIGS COLLECTION
            </h2>
            <p className="mt-2 text-md text-gray-600">
              Natural wigs made from 100% human hair.
            </p>
          </div>

          {/* Top Image (Main) */}
          <div className="relative w-full max-w-md h-[450px] mb-4">
            <div className="relative w-full h-full rounded-3xl overflow-hidden">
              <Image
                src="/images/wigcollection2.png"
                alt="Main wig style"
                fill
                className="object-cover"
              />
             
            </div>
          
          </div>

          {/* Bottom two images */}
          <div className="grid grid-cols-2 gap-4 w-full max-w-md">
            <div className="relative h-48 rounded-2xl overflow-hidden">
              <Image
                src="/images/wigcollection1.jpg"
                alt="Dark wavy wig style"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/20">
                <button 
                  aria-label="Play video" 
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm"
                >
                  <Play className="ml-1 h-5 w-5 fill-gray-800 text-gray-800" />
                </button>
              </div>
            </div>
            <div className="relative h-48 rounded-2xl overflow-hidden">
              <Image
                src="/images/wigcollection3.jpg"
                alt="Curly hair styles"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Bottom Text (No Spinner) */}
          <p className="text-gray-600 max-w-md my-8">
            With over 25 years of experience, we offer a wide range of styles to help you find your perfect look.
          </p>
            <div className="">
              <Link
                href="/shop"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#6a693e] py-2 px-6 text-sm font-bold text-white"
              >
                Shop Now
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white">
                  <ArrowUpRight className="h-4 w-3 text-[#6a693e]" />
                </span>
              </Link>
            </div>
        </div>

      </div>
    </section>
  );
};

export default WigCollection;