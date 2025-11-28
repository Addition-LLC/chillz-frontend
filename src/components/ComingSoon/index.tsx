import Link from "next/link";

export default function ComingSoon({ title = "Coming Soon", message = "We are working hard to bring you this page. Stay tuned!" }: { title?: string, message?: string }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 text-center">
      <h1 className="text-5xl md:text-7xl font-bold text-black mb-6" style={{ fontFamily: 'var(--font-caviar-dreams)' }}>
        {title}
      </h1>
      <p className="text-lg md:text-xl text-black/70 mb-8 max-w-md font-medium">
        {message}
      </p>
      <Link
        href="/"
        className="px-8 py-3 bg-black text-white rounded-none font-bold hover:bg-gray-800 transition-colors duration-300 uppercase tracking-widest text-sm"
      >
        Back to Home
      </Link>
    </div>
  );
}
