import { Background } from "@/components/landing/background";
import { FAQ } from "@/components/landing/blocks/faq";
import { Features } from "@/components/landing/blocks/features";
import { Hero } from "@/components/landing/blocks/hero";
import { Logos } from "@/components/landing/blocks/logos";
import { Pricing } from "@/components/landing/blocks/pricing";
import { ResourceAllocation } from "@/components/landing/blocks/resource-allocation";
import { Testimonials } from "@/components/landing/blocks/testimonials";

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
  );
}
