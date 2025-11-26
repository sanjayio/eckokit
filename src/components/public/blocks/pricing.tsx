'use client'

import { useState } from 'react'

import Link from 'next/link'

import { Check } from 'lucide-react'

import { Button } from '@/components/public/ui/button'
import { Card, CardContent } from '@/components/public/ui/card'
import { Switch } from '@/components/public/ui/switch'
import { cn } from '@/lib/utils'

const plans = [
  {
    name: 'Starter',
    monthlyPrice: '$149',
    yearlyPrice: '$1490',
    description: 'For micro businesses and freelancers',
    features: [
      '1 Voice Agent',
      '5 Calls per day',
      '3 Workflows',
      'Phone and Web Channels',
      'Simple Analytics',
      'Email Support',
    ],
  },
  {
    name: 'Pro',
    monthlyPrice: '$399',
    yearlyPrice: '$3990',
    description: 'For small businesses and startups',
    features: [
      '1 Voice Agent',
      '20 Calls per day',
      '10 Workflows',
      'Phone and Web Channels',
      'Advanced Analytics',
      'Email and Slack Support',
    ],
  },
  {
    name: 'Custom',
    monthlyPrice: "Let's talk",
    yearlyPrice: "Let's talk",
    description: 'For scale-ups and enterprises',
    features: [
      'Unlimited Voice Agents',
      'Unlimited Calls per day',
      'Unlimited Workflows',
      'Phone and Web Channels',
      'Advanced Analytics',
      'Email, Slack and Phone Support',
    ],
  },
]

export const Pricing = ({ className }: { className?: string }) => {
  const [isAnnual, setIsAnnual] = useState(true)

  return (
    <section className={cn('py-28 lg:py-32', className)}>
      <div className="container max-w-5xl">
        <div className="space-y-4 text-center">
          <h2 className="font-light text-2xl tracking-tight md:text-4xl lg:text-5xl">
            Pricing
          </h2>
          <p className="text-muted-foreground mx-auto max-w-xl leading-snug text-balance">
            Use Mainline for free with your whole team. Upgrade to enable
            unlimited issues, enhanced security controls, and additional
            features.
          </p>
        </div>

        <div className="mt-8 space-y-4 text-center md:mt-12 lg:mt-20">
          <div className="flex items-center justify-center gap-2">
            <span className="text-sm font-medium">Billed monthly</span>
            <Switch
              checked={isAnnual}
              onCheckedChange={() => setIsAnnual(!isAnnual)}
              aria-label="Toggle annual billing"
            />
            <span className="text-sm font-medium">Billed annually</span>
          </div>
        </div>

        <div className="mt-8 grid items-start gap-5 text-start md:mt-12 md:grid-cols-3 lg:mt-20">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`${
                plan.name === 'Pro'
                  ? 'outline-primary origin-top outline-4'
                  : ''
              }`}
            >
              <CardContent className="flex flex-col gap-7 px-6 py-5">
                <div className="space-y-2">
                  <h3 className="text-foreground font-regular text-3xl">
                    {plan.name}
                  </h3>
                  <div className="space-y-1">
                    <span className="text-muted-foreground text-sm">
                      {plan.description}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="text-lg font-medium">
                      {isAnnual ? plan.yearlyPrice : plan.monthlyPrice}
                      {plan.name !== 'Custom' && (
                        <span className="text-muted-foreground">
                          {' '}
                          per {isAnnual ? 'year' : 'month'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {plan.features.map((feature) => (
                    <div
                      key={feature}
                      className="text-muted-foreground flex items-center gap-1.5"
                    >
                      <Check className="size-5 shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button
                  className="w-fit"
                  variant={plan.name === 'Startup' ? 'default' : 'outline'}
                  asChild
                >
                  <Link href="/book-a-demo">Book a demo</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
