"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { User, ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
// 1. Import motion and AnimatePresence
import { motion, AnimatePresence } from "framer-motion";

const collections = [
  { id: 'raw', title: 'Raw Hair', path: '/collections/raw-hair' },
  { id: 'virgin', title: 'Virgin Hair', path: '/collections/virgin-hair' },
  { id: 'closures', title: 'Lace Closures', path: '/collections/lace-closures' },
  { id: 'tools', title: 'Hair Tools', path: '/collections/hair-tools' },
];

const staticLinks = [
  {id: 'shop', title: 'Shop', path: '/product' },
  { id: 'about', title: 'About Us', path: '/about' },
  { id: 'blog', title: 'Blog', path: '/blog' },
  { id: 'contact', title: 'Contact Us', path: '/contact' },
];

const Header = () => {
  const { openCart, cartCount } = useCart();
  const { customer, logout } = useAuth();
  const router = useRouter();
  const [navbarOpen, setNavbarOpen] = useState(false);
  const navbarToggleHandler = () => setNavbarOpen(!navbarOpen);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const [sticky, setSticky] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const handleStickyNavbar = () => {
      setSticky(window.scrollY >= 80);
    };
    window.addEventListener("scroll", handleStickyNavbar);
    return () => window.removeEventListener("scroll", handleStickyNavbar);
  }, []);

  const currentPath = usePathname();
  const isSticky = isClient && sticky;

  const handleLogout = async () => {
    await logout();
    setIsUserMenuOpen(false);
    router.push("/");
  };

  return (
    <header
      className={`header top-0 left-0 z-40 flex w-full items-center transition-all duration-300 ${
        isSticky ? "fixed shadow-md" : "absolute"
      }`}
      style={ isSticky ? { backgroundColor: '#F5F0E6' } : { backgroundColor: '#5C4033' } }
    >
      <div className={`container mx-auto transition-colors ${isSticky ? 'text-brand-brown' : 'text-white'}`}>
        <div className="relative flex items-center justify-between">
          {/* Logo */}
          <div className="w-60 max-w-full px-4">
            <Link href="/" className="block py-5">
              <div className="flex flex-col -space-y-1">
                <span className="text-3xl font-bold leading-none" style={{ fontFamily: 'var(--font-playfair-display)' }}>
                  Nhim Wen
                </span>
                <span className="text-xs tracking-[0.2em] uppercase opacity-80" style={{ fontFamily: 'var(--font-lato)' }}>
                  L u x u r y   H a i r
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex flex-grow items-center justify-center">
            <nav className="flex space-x-8">
              <Link href="/" className={`py-6 font-semibold transition-colors hover:text-brand-pink ${ currentPath === "/" ? "!text-brand-pink" : "" }`}
              style={{fontFamily: 'var(--font-caviar-dreams)'}}>
                Home
              </Link>
              <div className="group relative">
                <span className={`py-6 font-semibold cursor-default flex items-center transition-colors hover:text-brand-pink ${ currentPath.startsWith("/collections") ? "!text-brand-pink" : "" }`}
                style={{fontFamily: 'var(--font-caviar-dreams)'}}>
                  Collections
                  <svg className="ml-1 h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </span>
                <div
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-0 p-4 shadow-lg rounded-md w-48 invisible opacity-0 translate-y-2 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
                  style={{ backgroundColor: '#F5F0E6', color: '#5C4033', fontFamily: 'var(--font-caviar-dreams)' }}
                >
                  <ul className="space-y-2">
                    {collections.map((col) => (
                      <li key={col.id}>
                        <Link href={col.path} className={`block px-2 py-1 text-sm rounded hover:bg-brand-brown/10 ${ currentPath === col.path ? "font-bold" : ""}`}>
                          {col.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              {staticLinks.map((link) => (
                 <Link key={link.id} href={link.path} className={`py-6 font-semibold transition-colors hover:text-brand-pink ${ currentPath === link.path ? "!text-brand-pink" : "" }`}
                 style={{fontFamily: 'var(--font-caviar-dreams)'}}>
                   {link.title}
                 </Link>
              ))}
            </nav>
          </div>

          {/* Icons */}
          <div className="flex items-center justify-end gap-x-6 px-4">
             <button className="relative" onClick={openCart} aria-label="Open Cart">
               <ShoppingCart className="h-6 w-6" />
               {isClient && cartCount > 0 && (
                 <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-brand-pink text-xs font-bold text-brand-brown">
                   {cartCount}
                 </span>
               )}
             </button>

             {/* --- User Icon Dropdown --- */}
             <div
                className="relative"
                onMouseEnter={() => setIsUserMenuOpen(true)}
                onMouseLeave={() => setIsUserMenuOpen(false)}
             >
                <Link href={customer ? "/account" : "/login"} aria-label={customer ? "Account" : "Login"} className="block p-1">
                  <User className="h-6 w-6" />
                </Link>
                <AnimatePresence> {/* Use AnimatePresence */}
                 {isUserMenuOpen && (
                   <motion.div // Use motion.div
                     initial={{ opacity: 0, y: -5 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, y: -5 }}
                     transition={{ duration: 0.15 }}
                     className="absolute top-full right-0 mt-1 w-48 rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 focus:outline-none"
                     style={{ backgroundColor: '#F5F0E6', color: '#5C4033' }}
                   >
                     {customer ? (
                       <>
                         <Link href="/account" className="block px-4 py-2 text-sm hover:bg-brand-brown/10" onClick={() => setIsUserMenuOpen(false)}>
                           My Account
                         </Link>
                         <button
                           onClick={handleLogout}
                           className="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-100"
                         >
                           Log Out
                         </button>
                       </>
                     ) : (
                       <>
                         <Link href="/login" className="block px-4 py-2 text-sm hover:bg-brand-brown/10" onClick={() => setIsUserMenuOpen(false)}>
                           Log In
                         </Link>
                         <Link href="/signup" className="block px-4 py-2 text-sm hover:bg-brand-brown/10" onClick={() => setIsUserMenuOpen(false)}>
                           Sign Up
                         </Link>
                       </>
                     )}
                   </motion.div>
                 )}
                </AnimatePresence> {/* Close AnimatePresence */}
             </div>
             {/* --- End User Icon Dropdown --- */}

          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button onClick={navbarToggleHandler} aria-label="Mobile Menu" className="block px-4">
              <span className={`relative my-1.5 block h-0.5 w-7 bg-current transition-all duration-300 ${navbarOpen ? "top-[7px] rotate-45" : ""}`} />
              <span className={`relative my-1.5 block h-0.5 w-7 bg-current transition-all duration-300 ${navbarOpen ? "opacity-0" : ""}`} />
              <span className={`relative my-1.5 block h-0.5 w-7 bg-current transition-all duration-300 ${navbarOpen ? "top-[-8px] -rotate-45" : ""}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <div className={`absolute top-full left-0 w-full bg-brand-tan/95 text-brand-brown py-4 transition-all duration-300 lg:hidden ${navbarOpen ? "block" : "hidden"}`}>
        <nav className="container mx-auto">
          <ul className="flex flex-col space-y-4 px-4">
             <li><Link href="/" onClick={() => setNavbarOpen(false)} className="block text-center text-lg font-medium">Home</Link></li>
             <li className="pt-2"><span className="block text-center text-sm font-semibold uppercase text-brand-brown/60">Collections</span></li>
             {collections.map((col) => (
               <li key={col.id}>
                 <Link href={col.path} onClick={() => setNavbarOpen(false)} className="block text-center text-lg font-medium">
                   {col.title}
                 </Link>
               </li>
             ))}
             <li className="pt-2"><span className="block text-center text-sm font-semibold uppercase text-brand-brown/60">More</span></li>
              {staticLinks.map((link) => (
                 <li key={link.id}>
                   <Link href={link.path} onClick={() => setNavbarOpen(false)} className="block text-center text-lg font-medium">
                     {link.title}
                   </Link>
                 </li>
              ))}
               {/* Add Auth links to mobile menu */}
               <li className="pt-4 border-t border-brand-brown/20 mt-4">
                {customer ? (
                  <>
                     <Link href="/account" onClick={() => setNavbarOpen(false)} className="block text-center text-lg font-medium">My Account</Link>
                     <button onClick={() => { handleLogout(); setNavbarOpen(false); }} className="block w-full text-center text-lg font-medium text-red-700 mt-2">Log Out</button>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setNavbarOpen(false)} className="block text-center text-lg font-medium">Log In</Link>
                    <Link href="/signup" onClick={() => setNavbarOpen(false)} className="block text-center text-lg font-medium mt-2">Sign Up</Link>
                  </>
                )}
               </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
