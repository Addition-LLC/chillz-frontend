'use client';
import Link from 'next/link';

const Footer = () => {
  return (
    <>
      <footer className="relative z-10 bg-[#FBF6ED] pt-16 md:pt-20 lg:pt-24">
        <div className="container">
          <div className="-mx-4 flex flex-wrap">
            {/* ChilzStyles Column */}
            <div className="w-full px-4 lg:px-16 md:w-1/2 lg:w-4/12 xl:w-5/12">
              <div className="mb-12 max-w-[360px] lg:mb-16">
                <Link href="/" className="mb-8 inline-block">
                  <span
                    className="text-2xl font-bold text-[#F59E0B]"
                    style={{
                      fontFamily: "'ARP', Arial, sans-serif",
                      fontWeight: 800,
                    }}
                  >
                    ChilzStyles
                  </span>
                </Link>
                <p className="mb-9 text-base leading-relaxed text-gray-600">
                  Premium quality wigs made from ethically sourced human hair.
                  Designed for comfort, style, and confidence.
                </p>
                <div className="flex items-center space-x-4">
                  <a
                    href="#"
                    aria-label="Facebook"
                    className="text-gray-600 hover:text-green-600 transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </a>
                  <a
                    href="#"
                    aria-label="Twitter"
                    className="text-gray-600 hover:text-green-600 transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                    </svg>
                  </a>
                  <a
                    href="#"
                    aria-label="Instagram"
                    className="text-gray-600 hover:text-green-600 transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.418-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.928.875 1.418 2.026 1.418 3.323s-.49 2.448-1.418 3.244c-.875.807-2.026 1.297-3.323 1.297zm7.718-1.297c-.875.807-2.026 1.297-3.323 1.297s-2.448-.49-3.323-1.297c-.928-.796-1.418-1.947-1.418-3.244s.49-2.448 1.418-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.928.875 1.418 2.026 1.418 3.323s-.49 2.448-1.418 3.244z" />
                    </svg>
                  </a>
                  <a
                    href="#"
                    aria-label="Pinterest"
                    className="text-gray-600 hover:text-green-600 transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.418-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.928.875 1.418 2.026 1.418 3.323s-.49 2.448-1.418 3.244c-.875.807-2.026 1.297-3.323 1.297zm7.718-1.297c-.875.807-2.026 1.297-3.323 1.297s-2.448-.49-3.323-1.297c-.928-.796-1.418-1.947-1.418-3.244s.49-2.448 1.418-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.928.875 1.418 2.026 1.418 3.323s-.49 2.448-1.418 3.244z" />
                    </svg>
                  </a>
                  <a
                    href="#"
                    aria-label="YouTube"
                    className="text-gray-600 hover:text-green-600 transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Categories Column */}
            <div className="w-full px-4 sm:w-1/2 md:w-1/2 lg:w-2/12 xl:w-2/12">
              <div className="mb-12 lg:mb-16">
                <h2
                  className="mb-10 text-xl font-bold text-[#1F2937]"
                  style={{
                    fontFamily: "'ARP', Arial, sans-serif",
                    fontWeight: 800,
                  }}
                >
                  CATEGORIES
                </h2>
                <ul>
                  <li>
                    <Link
                      href="/category/blonde"
                      className="mb-4 inline-block text-base text-gray-600 duration-300 hover:text-green-600"
                    >
                      Blonde Wigs
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/category/brown"
                      className="mb-4 inline-block text-base text-gray-600 duration-300 hover:text-green-600"
                    >
                      Brown Wigs
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/category/black"
                      className="mb-4 inline-block text-base text-gray-600 duration-300 hover:text-green-600"
                    >
                      Black Wigs
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/category/toppers"
                      className="mb-4 inline-block text-base text-gray-600 duration-300 hover:text-green-600"
                    >
                      Toppers
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/category/accessories"
                      className="mb-4 inline-block text-base text-gray-600 duration-300 hover:text-green-600"
                    >
                      Accessories
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Quick Links Column */}
            <div className="w-full px-4 sm:w-1/2 md:w-1/2 lg:w-2/12 xl:w-2/12">
              <div className="mb-12 lg:mb-16">
                <h2
                  className="mb-10 text-xl font-bold text-[#1F2937]"
                  style={{
                    fontFamily: "'ARP', Arial, sans-serif",
                    fontWeight: 800,
                  }}
                >
                  QUICK LINKS
                </h2>
                <ul>
                  <li>
                    <Link
                      href="/account"
                      className="mb-4 inline-block text-base text-gray-600 duration-300 hover:text-green-600"
                    >
                      My Account
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/track-order"
                      className="mb-4 inline-block text-base text-gray-600 duration-300 hover:text-green-600"
                    >
                      Track My Order
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/wishlist"
                      className="mb-4 inline-block text-base text-gray-600 duration-300 hover:text-green-600"
                    >
                      Wishlist
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/customer-service"
                      className="mb-4 inline-block text-base text-gray-600 duration-300 hover:text-green-600"
                    >
                      Customer Service
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/returns"
                      className="mb-4 inline-block text-base text-gray-600 duration-300 hover:text-green-600"
                    >
                      Returns & Exchanges
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/faq"
                      className="mb-4 inline-block text-base text-gray-600 duration-300 hover:text-green-600"
                    >
                      FAQs
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Contact Us Column */}
            <div className="w-full px-4 md:w-1/2 lg:w-4/12 xl:w-3/12">
              <div className="mb-12 lg:mb-16">
                <h2
                  className="mb-10 text-xl font-bold text-[#1F2937]"
                  style={{
                    fontFamily: "'ARP', Arial, sans-serif",
                    fontWeight: 800,
                  }}
                >
                  CONTACT US
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <svg
                      className="w-5 h-5 text-[#F59E0B] mt-1"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                    </svg>
                    <p className="text-gray-600">
                      123 Fashion Street, Beauty City, Style Country 12345
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <svg
                      className="w-5 h-5 text-[#F59E0B]"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                    </svg>
                    <p className="text-gray-600">+1 (555) 987-6543</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <svg
                      className="w-5 h-5 text-[#F59E0B]"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                    </svg>
                    <p className="text-gray-600">info@chilzstyles.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="h-px w-full bg-gray-300"></div>
          <div className="py-8">
            <p className="text-center text-base text-gray-600">
              © Copyright 2023 ChilzStyles. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
