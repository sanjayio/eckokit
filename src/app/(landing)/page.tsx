import { Background } from '@/components/public/background'
import { FAQ } from '@/components/public/blocks/faq'
import { Features } from '@/components/public/blocks/features'
import { Hero } from '@/components/public/blocks/hero'
import { Logos } from '@/components/public/blocks/logos'
import { Pricing } from '@/components/public/blocks/pricing'
import { ResourceAllocation } from '@/components/public/blocks/resource-allocation'
import { Testimonials } from '@/components/public/blocks/testimonials'

export default function Home() {
  return (
    <>
      <Background className="via-muted to-muted/80">
        <Hero />
        <Logos />
        <Features />
        <ResourceAllocation />
      </Background>
      <Testimonials />
      <Background variant="bottom">
        <Pricing />
        <FAQ />
      </Background>
    </>
  )
}
