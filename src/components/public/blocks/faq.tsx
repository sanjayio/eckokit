import Link from 'next/link'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/public/ui/accordion'
import { cn } from '@/lib/utils'

const categories = [
  {
    title: 'Platform',
    questions: [
      {
        question: 'How do I integrate my agent with my website?',
        answer:
          'You can integrate your agent with your website by using our web widget. Check out our documentation for more information.',
      },
      {
        question: 'How do I add a new agent?',
        answer:
          'You can add a new agent by going to the agents page and requesting a new agent. We will then build a custom agent for you and you can start using it immediately.',
      },
      {
        question: 'How do I add a new workflow?',
        answer:
          'You can add a new workflow by going to the workflows page and requesting a new workflow. We will then build a custom workflow for you and you can start using it immediately.',
      },
      {
        question: 'How long would it take to build a new agent or workflow?',
        answer:
          'It depends on the complexity of the agent or workflow. But we can usually build a new agent or workflow in 1 - 7 business days. We are working on a faster self service way to do this.',
      },
      {
        question: 'Can I bring my own phone number?',
        answer:
          'Yes, you can, as long as it is a twilio phone number and you have the appropriate permissions to use it.',
      },
      {
        question: "I don't like how my agent sounds, can I change it?",
        answer:
          'Yes, you can change the voice of your agent by going to the agent settings and selecting a different voice.',
      },
    ],
  },
  {
    title: 'Support',
    questions: [
      {
        question: 'How do I get support?',
        answer:
          'You can get support by contacting us via email, slack or phone, depending on your plan. We are available 24/7 to help you with any questions you may have.',
      },
      {
        question: 'Do you offer a free trial?',
        answer:
          "No, unfortunately we don't offer a free trial. But we do offer a free demo call.",
      },
    ],
  },
  {
    title: 'Your account',
    questions: [
      {
        question: 'Can I cancel the subscription at any time?',
        answer:
          'Yes, you can cancel the subscription at any time, from your account settings.',
      },
      {
        question: 'Can I change my plan at any time?',
        answer:
          'Yes, you can upgrade or downgrade your plan at any time, from your account settings.',
      },
      {
        question:
          'Can I delete my account at any time and get my data removed?',
        answer:
          'Yes, you can delete your account at any time and get your data removed from your account settings.',
      },
    ],
  },
]

export const FAQ = ({
  headerTag = 'h2',
  className,
  className2,
}: {
  headerTag?: 'h1' | 'h2'
  className?: string
  className2?: string
}) => {
  return (
    <section className={cn('py-28 lg:py-32', className)}>
      <div className="container max-w-5xl">
        <div className={cn('mx-auto grid gap-16 lg:grid-cols-2', className2)}>
          <div className="space-y-4">
            {headerTag === 'h1' ? (
              <h1 className="font-light text-2xl tracking-tight md:text-4xl lg:text-5xl">
                Got Questions?
              </h1>
            ) : (
              <h2 className="font-light text-2xl tracking-tight md:text-4xl lg:text-5xl">
                Got Questions?
              </h2>
            )}
            <p className="text-muted-foreground max-w-md leading-snug lg:mx-auto">
              If you can&apos;t find what you&apos;re looking for,{' '}
              <Link
                href="/book-a-demo"
                className="underline underline-offset-4"
              >
                get in touch
              </Link>
              .
            </p>
          </div>

          <div className="grid gap-6 text-start">
            {categories.map((category, categoryIndex) => (
              <div key={category.title} className="">
                <h3 className="text-muted-foreground border-b py-4">
                  {category.title}
                </h3>
                <Accordion type="single" collapsible className="w-full">
                  {category.questions.map((item, i) => (
                    <AccordionItem key={i} value={`${categoryIndex}-${i}`}>
                      <AccordionTrigger>{item.question}</AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
