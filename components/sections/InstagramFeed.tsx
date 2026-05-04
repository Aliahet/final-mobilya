import Image from 'next/image';
import { Instagram } from 'lucide-react';

const INSTAGRAM_POSTS = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=500&q=80',
    likes: 342,
    comments: 12,
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=500&q=80',
    likes: 512,
    comments: 24,
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&q=80',
    likes: 289,
    comments: 8,
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=500&q=80',
    likes: 421,
    comments: 15,
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&q=80',
    likes: 673,
    comments: 31,
  },
];

export default function InstagramFeed() {
  return (
    <section className="py-20 md:py-32 bg-cream overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center">
        <div className="inline-flex items-center justify-center gap-2 mb-4">
          <Instagram className="w-5 h-5 text-gold" />
          <span className="text-sm font-medium tracking-widest uppercase text-gold">Sosyal Medya</span>
        </div>
        <h2 className="font-serif text-display-sm md:text-display-md text-charcoal mb-4">
          Bizi Instagram'da Takip Edin
        </h2>
        <p className="text-brown/70 max-w-2xl mx-auto">
          En yeni koleksiyonlarımızı, ilham verici dekorasyon fikirlerini ve kampanya haberlerini ilk öğrenen siz olun.
          <br />
          <a href="https://instagram.com/finalmobilya" target="_blank" rel="noopener noreferrer" className="text-charcoal font-medium hover:text-gold transition-colors mt-2 inline-block">
            @finalmobilya
          </a>
        </p>
      </div>

      <div className="flex gap-4 px-4 overflow-x-auto pb-8 snap-x snap-mandatory hide-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {INSTAGRAM_POSTS.map((post) => (
          <a
            key={post.id}
            href="https://instagram.com/finalmobilya"
            target="_blank"
            rel="noopener noreferrer"
            className="relative group flex-none w-[280px] sm:w-[320px] aspect-square rounded-2xl overflow-hidden snap-center"
          >
            <Image
              src={post.image}
              alt="Instagram gönderisi"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 640px) 280px, 320px"
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-charcoal/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
              <div className="flex items-center gap-6 text-white transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                <div className="flex items-center gap-2">
                  <HeartIcon className="w-5 h-5 fill-current" />
                  <span className="font-medium">{post.likes}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CommentIcon className="w-5 h-5 fill-current" />
                  <span className="font-medium">{post.comments}</span>
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

// Custom icons to match Instagram's filled style
function HeartIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
}

function CommentIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
    </svg>
  );
}
