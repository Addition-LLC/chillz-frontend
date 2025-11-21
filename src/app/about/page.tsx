// import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-brand-tan pt-28 pb-12 lg:pt-32">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl lg:text-7xl font-bold text-brand-brown mb-6" style={{ fontFamily: 'var(--font-caviar-dreams)' }}>
            About Nhim Wen
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto font-light">
            Where luxury meets authenticity. Discover the story behind the brand that is redefining hair elegance.
          </p>
        </div>

        {/* Our Story Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
          <div className="order-2 md:order-1">
            <div className="relative h-[500px] w-full rounded-2xl overflow-hidden shadow-xl">
               {/* Placeholder for owner image - using a generic luxury hair image for now or a placeholder color */}
               <div className="absolute inset-0 bg-brand-brown/20 flex items-center justify-center text-brand-brown font-bold text-xl">
                  [Owner Image Placeholder]
               </div>
            </div>
          </div>
          <div className="order-1 md:order-2 space-y-6">
            <h2 className="text-3xl lg:text-4xl font-bold text-brand-brown" style={{ fontFamily: 'var(--font-caviar-dreams)' }}>
              Our Story
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Founded in the heart of Minnesota, Nhim Wen Luxury Hair was born from a passion for beauty and a commitment to quality. Our journey began with a simple vision: to provide women with hair extensions that are not just accessories, but expressions of their true selves.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Chellina Achol, the visionary behind Nhim Wen, started this brand with a deep understanding of the transformative power of great hair. Frustrated by the lack of consistent quality in the market, she set out to curate a collection that meets the highest standards of texture, durability, and natural appeal.
            </p>
            <p className="text-gray-700 leading-relaxed">
              What started as a local endeavor in Minnesota has grown into a brand cherished by women who refuse to compromise on elegance. Nhim Wen is more than a hair shop; it is a celebration of confidence, style, and the beauty of being uniquely you.
            </p>
          </div>
        </div>

        {/* Mission Section */}
        <div className="bg-white rounded-3xl p-10 md:p-16 shadow-sm text-center mb-20">
          <h2 className="text-3xl lg:text-4xl font-bold text-brand-brown mb-8" style={{ fontFamily: 'var(--font-caviar-dreams)' }}>
            Our Mission
          </h2>
          <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed font-light">
            &quot;To empower every woman to feel unapologetically beautiful by providing premium, ethically sourced hair extensions that blend seamlessly with her natural grace. We believe that luxury is not just a price point, but an experience—one that we are dedicated to delivering with every bundle.&quot;
          </p>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6">
            <h3 className="text-2xl font-bold text-brand-brown mb-4" style={{ fontFamily: 'var(--font-caviar-dreams)' }}>Quality First</h3>
            <p className="text-gray-600">We meticulously source only the finest raw and virgin hair to ensure longevity and natural luster.</p>
          </div>
          <div className="p-6">
            <h3 className="text-2xl font-bold text-brand-brown mb-4" style={{ fontFamily: 'var(--font-caviar-dreams)' }}>Authenticity</h3>
            <p className="text-gray-600">Rooted in Minnesota, we stay true to our values of honesty, transparency, and genuine care for our customers.</p>
          </div>
          <div className="p-6">
            <h3 className="text-2xl font-bold text-brand-brown mb-4" style={{ fontFamily: 'var(--font-caviar-dreams)' }}>Elegance</h3>
            <p className="text-gray-600">Every product is curated to add a touch of sophistication and glamour to your everyday look.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
