'use client';

import Link from 'next/link';
import { Twitter, Instagram, Youtube, Facebook, MapPin, Phone, Mail } from 'lucide-react';


const footerLinks = [
  {
    title: 'Categories',
    links: [
      { name: 'Blonde Wigs', href: '/category/blonde' },
      { name: 'Brown Wigs', href: '/category/brown' },
      { name: 'Black Wigs', href: '/category/black' },
      { name: 'Toppers', href: '/category/toppers' },
      { name: 'Accessories', href: '/category/accessories' },
    ],
  },
  {
    title: 'Quick Links',
    links: [
      { name: 'My Account', href: '/account' },
      { name: 'Track My Order', href: '/track-order' },
      { name: 'Wishlist', href: '/wishlist' },
      { name: 'Customer Service', href: '/customer-service' },
      { name: 'Returns & Exchanges', href: '/returns' },
      { name: 'FAQs', href: '/faq' },
    ],
  },
];

const socials = [
  { href: '#', label: 'Facebook', icon: Facebook },
  { href: '#', label: 'Twitter', icon: Twitter },
  { href: '#', label: 'Instagram', icon: Instagram },
  { href: '#', label: 'YouTube', icon: Youtube },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-10 bg-brand-tan pt-16 text-brand-brown md:pt-20 lg:pt-24">
      <div className="container mx-auto px-4">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4 md:w-1/2 lg:w-4/12 xl:w-5/12">
            <div className="mb-12 max-w-[360px] lg:mb-16">
              <Link href="/" className="mb-8 inline-block text-3xl font-bold text-brand-brown">
                Nhim Wen Luxury Hair
              </Link>
              <p className="mb-9 text-base leading-relaxed">
                Premium quality wigs made from ethically sourced human hair. Designed for comfort, style, and confidence.
              </p>
              <div className="flex items-center space-x-4">
                {socials.map((social) => (
                  <Link
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-brand-pink transition-colors"
                  >
                    <social.icon className="h-6 w-6" />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {footerLinks.map((column) => (
            <div key={column.title} className="w-full px-4 sm:w-1/2 md:w-1/2 lg:w-2/12 xl:w-2/12">
              <div className="mb-12 lg:mb-16">
                <h2 className="mb-10 text-xl font-bold">{column.title}</h2>
                <ul>
                  {column.links.map((link) => (
                    <li key={link.name}>
                      <Link href={link.href} className="mb-4 inline-block text-base duration-300 hover:text-brand-pink">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}

          <div className="w-full px-4 md:w-1/2 lg:w-4/12 xl:w-3/12">
            <div className="mb-12 lg:mb-16">
              <h2 className="mb-10 text-xl font-bold">CONTACT US</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-brand-pink mt-1 flex-shrink-0" />
                  <p>123 Fashion Street, Beauty City, Style Country 12345</p>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-brand-pink flex-shrink-0" />
                  <p>+1 (555) 987-6543</p>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-brand-pink flex-shrink-0" />
                  <p>info@nhimwenluxuryhair.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="h-px w-full bg-brand-brown/20"></div>
        <div className="py-8">
          <p className="text-center text-base">
            &copy; {currentYear} Nhim Wen Luxury Hair. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;