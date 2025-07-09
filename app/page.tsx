import HeroSection from '@/components/landing/hero-section';
import Testimonials from '@/components/landing/testimonials';

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <Testimonials />
    </main>
  );
}