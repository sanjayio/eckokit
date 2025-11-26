import { Background } from '@/components/public/background'
import About from '@/components/public/blocks/about'
import { AboutHero } from '@/components/public/blocks/about-hero'
import { Investors } from '@/components/public/blocks/investors'
import { DashedLine } from '@/components/public/dashed-line'

export default function AboutPage() {
  return (
    <Background>
      <div className="py-28 lg:py-32 lg:pt-44">
        <AboutHero />

        <About />
        <div className="pt-28 lg:pt-32">
          <DashedLine className="container max-w-5xl scale-x-115" />
          <Investors />
        </div>
      </div>
    </Background>
  )
}
