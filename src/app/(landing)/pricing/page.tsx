import React from "react";

import { Background } from "@/components/landing/background";
import { Pricing } from "@/components/landing/blocks/pricing";
import { PricingTable } from "@/components/landing/blocks/pricing-table";

const Page = () => {
  return (
    <Background>
      <Pricing className="py-28 text-center lg:pt-44 lg:pb-32" />
      <PricingTable />
    </Background>
  );
};

export default Page;
