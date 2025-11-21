export default function Newsletter() {
  return (
    <section className="flex flex-col md:flex-row items-center justify-between bg-[#5E3B1E] mb-1 py-12 px-4 md:px-16 lg:px-24 gap-6 md:gap-12">
      <h3
        className="text-white text-2xl md:text-3xl font-bold text-center md:text-left font-edwardian-first-letter"
        style={{
          fontFamily: 'var(--font-caviar-dreams)',
          fontWeight: 700,
        }}
      >
        SIGN UP AND SAVE
      </h3>

      <div className="w-full md:w-[454px] h-[48px] bg-white rounded-full flex flex-row overflow-hidden">
        <input
          type="email"
          placeholder="Your email address"
          className="flex-1 h-full px-4 placeholder:text-[#9CA3AF] bg-white focus:outline-none"
        />
        <button className="w-[120px] md:w-[134px] h-full bg-[#636340] text-white text-[16px] font-bold hover:bg-[#5e5e43] transition">
          SUBSCRIBE
        </button>
      </div>
    </section>
  );
}
