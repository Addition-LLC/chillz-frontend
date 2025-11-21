import Image from "next/image";
import Link from "next/link";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex bg-brand-tan">
      {/* Left Side - Image/Brand */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-brand-brown text-white">
        <div className="absolute inset-0 bg-black/20 z-10" />
        <Image
          src="/images/wigcollection1.jpg" // Using an existing image as placeholder
          alt="Nhim Wen Luxury Hair"
          fill
          className="object-cover"
          priority
        />
        <div className="relative z-20 flex flex-col justify-between p-12 w-full h-full">
          <Link href="/" className="text-3xl font-bold tracking-wider" style={{ fontFamily: 'var(--font-caviar-dreams)' }}>
            NHIM WEN
          </Link>
          <div className="max-w-md">
            <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: 'var(--font-caviar-dreams)' }}>
              Redefining Elegance.
            </h2>
            <p className="text-lg text-white/90 font-light">
              Join our community and experience the luxury of premium hair extensions designed for your unique style.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-24 bg-white lg:bg-brand-tan">
        <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-3xl shadow-xl lg:shadow-none lg:bg-transparent lg:p-0">
          <div className="text-center mb-10 lg:text-left">
            <h1 className="text-3xl lg:text-4xl font-bold text-brand-brown mb-3" style={{ fontFamily: 'var(--font-caviar-dreams)' }}>
              {title}
            </h1>
            {subtitle && (
              <p className="text-gray-600">
                {subtitle}
              </p>
            )}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
