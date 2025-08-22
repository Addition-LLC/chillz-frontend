import Image from 'next/image';
import { Lexend_Deca } from 'next/font/google';

const lexendDeca = Lexend_Deca({
  weight: '400',
  subsets: ['latin'],
});

export default function Features() {
  return (
    <section className="py-16 px-6 sm:px-10 lg:px-16 bg-[#5E3B1E] text-white text-center">
      <div className="flex flex-col items-center gap-4">
        <h2
          className="text-3xl sm:text-4xl font-bold mb-2 font-arpd"
          style={{
            fontFamily: "'ARP', Arial, sans-serif",
            fontWeight: 700,
          }}
        >
          FEATURES
        </h2>
        <p
          className="text-base sm:text-lg mb-10 max-w-xl"
          style={{ fontFamily: lexendDeca.style.fontFamily }}
        >
          We handpick only the best brands and styles to ensure you find wigs
          that are beautiful, comfortable, and 100% natural human hair.
        </p>
      </div>

      {/* Responsive layout */}
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-center lg:items-start justify-center">
        {/* Feature 1 */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-4 max-w-sm">
          <div className="flex flex-col items-center gap-6">
            <Image
              src="/images/comb.png"
              alt="Comb Icon"
              width={48}
              height={48}
            />
            <h3
              className="text-lg sm:text-xl font-semibold"
              style={{
                fontFamily: "'ARP', Arial, sans-serif",
                fontWeight: 700,
              }}
            >
              Cut it as you need
            </h3>
          </div>
          <p
            className="text-sm text-white/60 text-center"
            style={{
              fontFamily: ' Arial, sans-serif',
            }}
          >
            You&apos;re looking for a sleek bob or long, flowing locks, our
            expert stylists will help you achieve the perfect cut tailored just
            for you.
          </p>
        </div>

        {/* Feature 2 */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-4 max-w-sm">
          <div className="flex flex-col items-center gap-6">
            <Image
              src="/images/hairdryer.png"
              alt="Hairdryer Icon"
              width={48}
              height={48}
            />
            <h3
              className="text-lg sm:text-xl font-semibold"
              style={{
                fontFamily: "'ARP', Arial, sans-serif",
                fontWeight: 700,
              }}
            >
              Apply custom colors
            </h3>
          </div>
          <p
            className="text-sm text-white/60 text-center"
            style={{
              fontFamily: ' Arial, sans-serif',
            }}
          >
            From subtle highlights to bold, vibrant hues, our team of
            professionals can help you find the right color to match your style
            and personality.
          </p>
        </div>

        {/* Feature 3 */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-4 max-w-sm">
          <div className="flex flex-col items-center gap-6">
            <Image
              src="/images/hair-brush.png"
              alt="Hair Brush Icon"
              width={48}
              height={48}
            />
            <h3
              className="text-lg sm:text-xl font-semibold"
              style={{
                fontFamily: "'ARP', Arial, sans-serif",
                fontWeight: 700,
              }}
            >
              We love to serve
            </h3>
          </div>
          <p
            className="text-sm text-white/60 text-center"
            style={{
              fontFamily: ' Arial, sans-serif',
            }}
          >
            Whether you need styling advice or help selecting the perfect piece,
            we&apos;re always ready to serve you with passion and expertise.
          </p>
        </div>
      </div>
    </section>
  );
}
