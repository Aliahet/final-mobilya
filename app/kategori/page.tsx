import type { Metadata } from 'next';
import KategoriContent from './KategoriContent';

export const metadata: Metadata = {
  title: 'Tüm Kategoriler',
  description: 'Oturma odası, yatak odası, yemek odası ve daha fazlası için premium mobilya koleksiyonları.',
};

export default function KategoriPage() {
  return <KategoriContent />;
}
