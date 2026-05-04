import Hero from '@/components/sections/Hero';
import CategoryGrid from '@/components/sections/CategoryGrid';
import FeaturedProducts from '@/components/sections/FeaturedProducts';
import ShopTheLook from '@/components/sections/ShopTheLook';
import TrustBar from '@/components/sections/TrustBar';
import BrandStory from '@/components/sections/BrandStory';
import Testimonials from '@/components/sections/Testimonials';
import InstagramFeed from '@/components/sections/InstagramFeed';

export default function HomePage() {
  return (
    <>
      <Hero />
      <CategoryGrid />
      <FeaturedProducts />
      <TrustBar />
      <ShopTheLook />
      <BrandStory />
      <InstagramFeed />
      <Testimonials />
    </>
  );
}
