import React from 'react'

import { Background } from '@/components/public/background'
import { FAQ } from '@/components/public/blocks/faq'
import { Testimonials } from '@/components/public/blocks/testimonials'
import { DashedLine } from '@/components/public/dashed-line'

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
  )
}

export default Page
