import { Playfair_Display, Geist, Pinyon_Script } from 'next/font/google';
import localFont from 'next/font/local';
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

const pinyonScript = Pinyon_Script({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-pinyon-script',
});

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
  variable: '--font-caviar-dreams',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head />
      <body className={`${playfair_display.variable} ${lato.variable} ${caviarDreams.variable} ${pinyonScript.variable}`}>
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