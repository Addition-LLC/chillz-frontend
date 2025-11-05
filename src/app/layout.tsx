import { Playfair_Display, Geist } from 'next/font/google';
import localFont from 'next/font/local'; // 1. Import localFont
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import Cart from '@/components/Cart';
import './globals.css';

const playfair_display = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-playfair-display',
});

const lato = Geist({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-lato',
});

// 2. Define your local font
const caviarDreams = localFont({
  src: [
    {
      path: '../../public/fonts/CaviarDreams.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/CaviarDreams_Italic.ttf',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../../public/fonts/CaviarDreams_Bold.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../public/fonts/CaviarDreams_BoldItalic.ttf',
      weight: '700',
      style: 'italic',
    },
  ],
  variable: '--font-caviar-dreams', // This is the CSS variable we'll use
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head />
      {/* 3. Add the new font variable to the body */}
      <body className={`${playfair_display.variable} ${lato.variable} ${caviarDreams.variable}`}>
        <AuthProvider>
          <CartProvider>
            <Cart />
            <Header />
            <main>{children}</main>
            <ScrollToTop />
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}