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
    // 3. Only redirect if customer is explicitly null (loaded, but not logged in)
    // Do nothing if customer is 'undefined' (still loading)
    if (customer === null) {
      router.push("/login");
    }
  }, [customer, router]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  // 4. Show a loading state while customer is 'undefined'
  if (customer === undefined) {
    return <div className="container mx-auto px-4 py-12 pt-28 lg:pt-32 text-center text-gray-500">Loading Account...</div>;
  }

  // 5. This check now correctly handles the 'null' state after loading
  if (customer === null) {
     return <div className="container mx-auto px-4 py-12 pt-28 lg:pt-32 text-center text-gray-500">Redirecting to login...</div>;
  }

  // Navigation links for the account section
  const navLinks = [
    { name: "Profile", href: "/account/profile", icon: User },
    { name: "Addresses", href: "/account/addresses", icon: MapPin },
    { name: "Order History", href: "/account", icon: List }
  ];

  return (
    <div className="container mx-auto px-4 py-12 pt-28 lg:pt-32" style={{ fontFamily: 'var(--font-caviar-dreams)' }}>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold" style={{ fontFamily: 'var(--font-caviar-dreams)' }}>
          My Account
        </h1>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-500 transition-colors"
        >
          <LogOut size={16} />
          Log Out
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12" style={{ fontFamily: 'var(--font-caviar-dreams)' }}>
        {/* Side Navigation */}
        <nav className="md:col-span-1">
          <ul className="space-y-2" style={{ fontFamily: 'var(--font-caviar-dreams)' }}>
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`flex items-center gap-3 p-3 rounded-md transition-colors ${
                    pathname === link.href
                      ? "bg-brand-brown text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}

                  style={{ fontFamily: 'var(--font-caviar-dreams)' }}
                >
                  <link.icon size={20} />
                  <span className="font-medium">{link.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Page Content */}
        <div className="md:col-span-3">
          {children}
        </div>
      </div>
    </div>
  );
}