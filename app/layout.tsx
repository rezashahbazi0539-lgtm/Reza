import './globals.css';
import { Poppins, Playfair_Display } from 'next/font/google';
import Providers from '@/components/Providers';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata = {
  title: 'City Nail - Premium Nail Art & Beauty Store',
  description: 'Türkiye\'nin premium nail art markası. Jel oje, press on nails, nail art ürünleri ve daha fazlası.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr" className={`${poppins.variable} ${playfair.variable}`}>
      <body><Providers>{children}</Providers></body>
    </html>
  );
}
