"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect } from "react";
import { List, User, MapPin, LogOut } from "lucide-react";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { customer, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (customer === null) {
      router.push("/login");
    }
  }, [customer, router]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (customer === undefined) {
    return <div className="min-h-screen bg-white pt-32 pb-12 flex items-center justify-center text-black font-caviar">Loading Account...</div>;
  }

  if (customer === null) {
     return <div className="min-h-screen bg-white pt-32 pb-12 flex items-center justify-center text-black font-caviar">Redirecting to login...</div>;
  }

  const navLinks = [
    { name: "Profile", href: "/account/profile", icon: User },
    { name: "Addresses", href: "/account/addresses", icon: MapPin },
    { name: "Order History", href: "/account", icon: List }
  ];

  return (
    <div className="min-h-screen bg-white pt-28 lg:pt-32 pb-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex justify-between items-center mb-8 sm:mb-12">
          <h1 className="text-4xl font-bold text-black" style={{ fontFamily: 'var(--font-caviar-dreams)' }}>
            My Account
          </h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-red-500 transition-colors uppercase tracking-wider"
          >
            <LogOut size={16} />
            Log Out
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Side Navigation */}
          <nav className="lg:col-span-3">
            <ul className="space-y-3 sticky top-32">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`flex items-center gap-4 p-4 rounded-none transition-all duration-300 group ${
                        isActive
                          ? "bg-black text-white shadow-lg"
                          : "bg-gray-50 text-black hover:bg-gray-100"
                      }`}
                    >
                      <span className={`p-1 rounded-none transition-colors ${isActive ? 'bg-white/20' : 'bg-gray-200 group-hover:bg-gray-300'}`}>
                        <link.icon size={20} className={isActive ? "text-white" : "text-black"} />
                      </span>
                      <span className="font-bold tracking-wide" style={{ fontFamily: 'var(--font-caviar-dreams)' }}>{link.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Page Content */}
          <div className="lg:col-span-9">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}