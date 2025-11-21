import Link from "next/link";

export default function ComingSoon({ title = "Coming Soon", message = "We are working hard to bring you this page. Stay tuned!" }: { title?: string, message?: string }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-brand-tan px-4 text-center">
      <h1 className="text-5xl md:text-7xl font-bold text-brand-brown mb-6" style={{ fontFamily: 'var(--font-caviar-dreams)' }}>
        {title}
      </h1>
      <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-md font-medium">
        {message}
      </p>
      <Link
        href="/"
        className="px-8 py-3 bg-brand-brown text-white rounded-full font-bold hover:bg-brand-pink transition-colors duration-300"
      >
        Back to Home
      </Link>
    </div>
  );
}
