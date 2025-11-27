import React from "react";

import { Background } from "@/components/landing/background";
import { FAQ } from "@/components/landing/blocks/faq";
import { Testimonials } from "@/components/landing/blocks/testimonials";
import { DashedLine } from "@/components/landing/dashed-line";

const Page = () => {
  return (
    <Background>
      <FAQ
        className="py-28 text-center lg:pt-44 lg:pb-32"
        className2="max-w-xl lg:grid-cols-1"
        headerTag="h1"
      />
      <DashedLine className="mx-auto max-w-xl" />
      <Testimonials dashedLineClassName="hidden" />
    </Background>
  );
};

export default Page;
