import { Playfair_Display, Geist } from 'next/font/google';
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head />
      <body className={`${playfair_display.variable} ${lato.variable}`}>
        <CartProvider>
          <Cart />
          <Header />
          <main>{children}</main>
          <ScrollToTop />
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}