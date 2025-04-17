import { HeroSection } from "@/components/home/hero-section"
import { FeaturesSection } from "@/components/home/features-section"
import { HowItWorks } from "@/components/home/how-it-works"
import { TestimonialsSection } from "@/components/home/testimonials-section"
import { PricingSection } from "@/components/home/pricing-section"
import { Navbar } from "@/components/home/navbar"
import { Footer } from "@/components/home/footer"
import { CTASection } from "@/components/home/CtaSection"

export default function HomePage() {
  return (
    <div>
    <main className="px-[5%]">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorks />
      <TestimonialsSection />
      <PricingSection />
      </main>
      <CTASection/>
      <Footer />
    </div>
  )
}
