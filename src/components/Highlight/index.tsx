// components/Highlight.tsx
import Image from 'next/image';
import { Lexend_Deca } from 'next/font/google';

const lexendDeca = Lexend_Deca({
  weight: '400',
  subsets: ['latin'],
});

export default function Highlight() {
  return (
    <section className="px-6 md:px-16 lg:px-32 flex flex-col-reverse lg:flex-row items-center md:items-start gap-10 md:gap-16 bg-[#16120F]">
      {/* Image */}
      <Image
        src="/images/highlight.jpg"
        alt="Highlight Wig"
        width={531}
        height={400}
        className="rounded-lg object-cover w-full md:w-[531px] h-auto"
      />

      {/* Text */}
      <div className="flex flex-col items-start md:items-center justify-center gap-6 max-w-2xl py-12">
        <h2
          className="text-[22px] md:text-[35px] font-bold text-white"
          style={{
            fontFamily: "'ARP', Arial, sans-serif",
            fontWeight: 700,
          }}
        >
          Girls Love Wave Looks
        </h2>

        <p
          className="text-[#DDCAB5] "
          style={{ fontFamily: lexendDeca.style.fontFamily }}
        >
          Our wave collection features soft, natural-looking waves that add
          volume and movement to your look. These wigs are perfect for everyday
          wear or special occasions, providing versatility and style.
        </p>

        <p
          className=" text-[#DDCAB5] "
          style={{ fontFamily: lexendDeca.style.fontFamily }}
        >
          Our wigs are made from premium human hair, ethically sourced and
          professionally crafted to ensure the highest quality and most natural
          appearance. Each piece is designed to provide comfort, style, and
          confidence.
        </p>
      </div>
    </section>
  );
}
