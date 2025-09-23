"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { menuData } from "./menuData";
import { usePathname } from "next/navigation";
import { User, ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";

const Header = () => {
  const { openCart, cartCount } = useCart();
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
        sticky ? "fixed shadow-md" : "absolute"
      }`}
      style={
        sticky
          ? { backgroundColor: '#F5F0E6' /* brand-tan */ }
          : { backgroundColor: 'transparent' }
      }
    >
      <div className={`container mx-auto transition-colors ${sticky ? 'text-brand-brown' : 'text-white'}`}>
        <div className="relative flex items-center justify-between">
          <div className="w-60 max-w-full px-4">
            <Link href="/" className="block w-full py-6 text-2xl font-bold">
              ChilzStyles
            </Link>
          </div>

          <div className="hidden lg:flex items-center justify-end gap-x-8">
            {menuData.map((menuItem) => (
              <div key={menuItem.id} className="group relative">
                <Link
                  href={menuItem.path ?? "#"}
                  className={`py-6 font-semibold transition-colors hover:text-brand-pink ${
                    usePathName === menuItem.path && "!text-brand-pink"
                  }`}
                >
                  {menuItem.title}
                </Link>

                {menuItem.submenu && (
                  <div
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-0 p-8 shadow-lg rounded-md flex gap-12 invisible opacity-0 translate-y-2 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
                    style={{ backgroundColor: '#F5F0E6', color: '#5C4033' }}
                  >
                    {menuItem.submenu.categories.map((cat) => (
                      <div key={cat.title} className="min-w-[150px]">
                        <h3 className="font-bold mb-4">{cat.title}</h3>
                        <ul className="space-y-2">
                          {cat.items.map((item) => (
                            <li key={item.title}>
                              <Link href={item.href} className="text-sm hover:text-brand-pink">{item.title}</Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <div className="flex items-center gap-x-6">
              <button className="relative" onClick={openCart}>
                <ShoppingCart className="h-6 w-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-brand-pink text-xs font-bold text-brand-brown">
                    {cartCount}
                  </span>
                )}
              </button>
              <Link href="/signin">
                <User className="h-6 w-6" />
              </Link>
            </div>
          </div>
          
          <div className="lg:hidden">
            <button onClick={navbarToggleHandler} aria-label="Mobile Menu" className="block px-4">
              <span className={`relative my-1.5 block h-0.5 w-7 bg-current transition-all duration-300 ${navbarOpen ? "top-[7px] rotate-45" : ""}`} />
              <span className={`relative my-1.5 block h-0.5 w-7 bg-current transition-all duration-300 ${navbarOpen ? "opacity-0" : ""}`} />
              <span className={`relative my-1.5 block h-0.5 w-7 bg-current transition-all duration-300 ${navbarOpen ? "top-[-8px] -rotate-45" : ""}`} />
            </button>
          </div>
        </div>
      </div>
      
      <div className={`absolute top-full left-0 w-full bg-brand-tan/95 text-brand-brown py-4 transition-all duration-300 lg:hidden ${navbarOpen ? "block" : "hidden"}`}>
        <nav className="container mx-auto">
          <ul className="flex flex-col space-y-4 px-4">
            {menuData.map((menuItem) => (
              <li key={menuItem.id}>
                <Link href={menuItem.path ?? "#"} onClick={() => setNavbarOpen(false)} className="block text-center text-lg font-medium">
                  {menuItem.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;