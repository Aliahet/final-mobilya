import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/layout/CartDrawer';
import CampaignBar from '@/components/layout/CampaignBar';
import Providers from './Providers';

export const metadata: Metadata = {
  title: {
    default: 'Final Mobilya — Premium Mobilya',
    template: '%s | Final Mobilya',
  },
  description:
    'Final Mobilya — Yaşam alanlarınıza anlam katan premium mobilya koleksiyonları. El işçiliği, sürdürülebilir malzemeler ve zamansız tasarım.',
  keywords: ['mobilya', 'kanepe', 'yemek masası', 'yatak odası', 'premium mobilya', 'final mobilya', 'Türkiye'],
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    siteName: 'Final Mobilya',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body className="bg-cream text-charcoal antialiased">
        <Providers>
          <CampaignBar />
          <Header />
          <CartDrawer />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
