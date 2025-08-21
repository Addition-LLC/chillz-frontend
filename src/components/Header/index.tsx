"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { menuData } from "./menuData";
import { usePathname } from "next/navigation";
import { User, ShoppingCart } from 'lucide-react';

const Header = () => {
  const [navbarOpen, setNavbarOpen] = useState(false);
  const navbarToggleHandler = () => setNavbarOpen(!navbarOpen);

  const [sticky, setSticky] = useState(false);
  const handleStickyNavbar = () => {
    if (window.scrollY >= 80) setSticky(true);
    else setSticky(false);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleStickyNavbar);
    return () => window.removeEventListener("scroll", handleStickyNavbar);
  }, []);

  const usePathName = usePathname();

  return (
    <header
      className={`header top-0 left-0 z-40 flex w-full items-center transition-all duration-300 ${
        sticky
          ? "fixed bg-black/80 shadow-md backdrop-blur-sm"
          : "absolute bg-transparent"
      }`}
    >
      <div className="container mx-auto">
        <div className="relative flex items-center justify-between">
          {/* Logo */}
          <div className="w-60 max-w-full px-4">
            <Link
              href="/"
              className="block w-full py-6 text-2xl font-bold text-[#636340]"
            >
              ChilzStyles
            </Link>
          </div>

        
          {/* Combined Menu Tabs + Icons */}
          <div className="hidden lg:flex items-center justify-end gap-x-6">
            {/* Menu Tabs */}
            {menuData.map((menuItem) => (
              <Link
                key={menuItem.id}
                href={menuItem.path ?? "#"}
                className={` font-medium text-white hover:underline hover:decoration-2 hover:decoration-[#636340] hover:underline-offset-6 ${
                  usePathName === menuItem.path && "!text-white"
                }`}
              style={{
                fontFamily: "'ARPDisplay', Arial, sans-serif",
                fontWeight: 400,
              }}
              >
                {menuItem.title}
              </Link>
            ))}

            {/* Icons */}
            <button className="relative text-white/80 hover:text-white">
              <ShoppingCart className="h-6 w-6 text-[#636340]" />
              <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                0
              </span>
            </button>
            <Link href="/signin" className="text-white/80 hover:text-white">
              <User className="h-6 w-6 text-[#636340]" />
            </Link>
          </div>


          {/* Hamburger Menu Button for Mobile */}
          <div className="lg:hidden">
            <button
              onClick={navbarToggleHandler}
              aria-label="Mobile Menu"
              className="block px-4 text-white"
            >
              <span className={`relative my-1.5 block h-0.5 w-7 bg-white transition-all duration-300 ${navbarOpen ? "top-[7px] rotate-45" : ""}`} />
              <span className={`relative my-1.5 block h-0.5 w-7 bg-white transition-all duration-300 ${navbarOpen ? "opacity-0" : ""}`} />
              <span className={`relative my-1.5 block h-0.5 w-7 bg-white transition-all duration-300 ${navbarOpen ? "top-[-8px] -rotate-45" : ""}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`absolute top-full left-0 w-full bg-black/90 py-4 transition-all duration-300 lg:hidden ${navbarOpen ? "block" : "hidden"}`}>
        <nav className="container mx-auto">
          <ul className="flex flex-col space-y-4 px-4">
            {menuData.map((menuItem) => (
              <li key={menuItem.id}>
                <Link
                  href={menuItem.path ?? "#"}
                  onClick={() => setNavbarOpen(false)}
                  className={`block text-center text-lg font-medium text-white/80 hover:text-white ${
                    usePathName === menuItem.path && "!text-white"
                  }`}
                >
                  {menuItem.title}
                </Link>
              </li>
            ))}
            <li className="flex justify-center space-x-6 mt-2">
              <button className="relative text-white/80 hover:text-white">
                <ShoppingCart className="h-6 w-6 text-[#636340]" />
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                  0
                </span>
              </button>
              <Link href="/signin" className="text-white/80 hover:text-white">
                <User className="h-6 w-6 text-[#636340]" />
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
