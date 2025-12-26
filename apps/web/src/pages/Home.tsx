// ABOUTME: Home page component
// ABOUTME: Landing page with all sections

import {
  Header,
  HeroSection,
  StatsBar,
  FeaturesSection,
  TestimonialsSection,
  PricingSection,
  FAQSection,
  CTASection,
  Footer,
} from '@/components/landing'

export function HomePage() {
  return (
    <div className="flex flex-col">
      <Header />
      <HeroSection />
      <StatsBar />
      <FeaturesSection />
      <TestimonialsSection />
      <PricingSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </div>
  )
}
