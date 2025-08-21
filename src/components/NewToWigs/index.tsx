import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

const NewToWigs = () => {
  return (
    <section className="bg-[#FBF8F3] lg:py-6">
      <div className="container mx-auto px-4">
        {/* Main container: flex for mobile, grid for desktop */}
        <div className="flex flex-col items-center lg:grid lg:grid-cols-2 gap-8 lg:gap-16 lg:items-center">
          
          {/* --- Image Column --- */}
          <div className="order-1 lg:order-1 w-full">
            {/* Flex container for the two images */}
            <div className="flex justify-center gap-4">
              
              {/* First image, pushed down with a top margin */}
              <div className="w-1/2 mt-12 pl-12">
                <div className="overflow-hidden rounded-2xl shadow-lg">
                  <Image
                    src="/images/newtowigs1.jpg" // Replace with your image path
                    alt="Woman trying on a wig"
                    width={300}
                    height={400}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
              
              {/* Second image, pushed up with a bottom margin */}
              <div className="w-1/2 mb-12">
                <div className="overflow-hidden rounded-2xl shadow-lg">
                  <Image
                    src="/images/newtowigs2.jpg" // Replace with your image path
                    alt="A selection of different wig styles"
                    width={300}
                    height={400}
                    className="h-full w-full "
                  />
                </div>
              </div>
            </div>
          </div>

          {/* --- Text Column --- */}
          <div className="order-2  lg:text-left xl:pr-36 lg:mt-0">
            <h2 className="text-2xl lg:text-3xl xl:text-4xl font-bold ">
              NEW TO WIGS OR TOPPERS?
            </h2>
            <div className="mt-4 text-lg text-gray-600 lg:mx-0 space-y-4">
              <p>
                Our expert stylists are here to guide you through the process of finding the perfect wig for your needs. Whether you&apos;re looking for a natural look or something more dramatic, we have options for everyone.
              </p>
              <p>
                Our wigs are made from premium human hair, ethically sourced and professionally crafted to ensure the highest quality and most natural appearance. Each piece is designed to provide comfort, style, and confidence.
              </p>
            </div>

            <div className="mt-8">
              <Link
                href="/shop"
                className="group inline-flex items-center  gap-2 rounded-full bg-[#6a693e] py-2 px-8 text-sm font-bold text-white"
              >
                Learn More
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white">
                  <ArrowUpRight className="h-4 w-3 text-[#6a693e]" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewToWigs;