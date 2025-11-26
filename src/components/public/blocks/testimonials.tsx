import Image from "next/image";

import { DashedLine } from "../dashed-line";

import { Card, CardContent } from "@/components/public/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/public/ui/carousel";
import { cn } from "@/lib/utils";

const items = [
  {
    quote: "My students are misusing the helpline and it still works!",
    role: "English Teacher",
    location: "Melbourne, Australia",
    image: "placeholder.svg",
  },
  {
    quote: "My clients never forget to leave a review, thanks to Eckokit.",
    role: "Electrician",
    location: "Newcastle, Australia",
    image: "placeholder.svg",
  },
  {
    quote:
      "Founder mode is hard enough without having a really nice AI assistant.",
    role: "Agency Founder",
    location: "Perth, Australia",
    image: "placeholder.svg",
  },
  {
    quote: "I never miss a call from my students asking for my time.",
    role: "Yoga Instructor",
    location: "Sydney, Australia",
    image: "placeholder.svg",
  },
];

export const Testimonials = ({
  className,
  dashedLineClassName,
}: {
  className?: string;
  dashedLineClassName?: string;
}) => {
  return (
    <>
      <section className={cn("overflow-hidden py-28 lg:py-32", className)}>
        <div className="container">
          <div className="space-y-4">
            <h2 className="max-w-md font-light text-2xl tracking-tight md:text-4xl lg:text-5xl">
              Trusted by people, not just businesses
            </h2>
            <p className="text-muted-foreground max-w-md leading-snug">
              We&apos;re fortunate to have a lot of small business owners as
              customers, and we&apos;re proud to serve them. Here are some ways
              Eckokit is helping our customers.
            </p>
          </div>

          <div className="relative mt-8 -mr-[max(3rem,calc((100vw-80rem)/2+3rem))] md:mt-12 lg:mt-20">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="">
                {items.map((testimonial, index) => (
                  <CarouselItem
                    key={index}
                    className="xl:basis-1/3.5 grow basis-4/5 sm:basis-3/5 md:basis-2/5 lg:basis-[28%] 2xl:basis-[24%]"
                  >
                    <Card className="bg-muted h-full overflow-hidden border-none">
                      <CardContent className="flex h-full flex-col p-0">
                        <div className="relative h-[288px] lg:h-[328px]">
                          <Image
                            src={testimonial.image}
                            alt={testimonial.role}
                            fill
                            className="object-cover object-top"
                          />
                        </div>
                        <div className="flex flex-1 flex-col justify-between gap-10 p-6">
                          <blockquote className="font-display text-lg leading-none! font-medium md:text-xl lg:text-2xl">
                            {testimonial.quote}
                          </blockquote>
                          <div className="space-y-0.5">
                            <div className="text-primary font-semibold">
                              {testimonial.role}
                            </div>
                            <div className="text-muted-foreground text-sm">
                              {testimonial.location}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="mt-8 flex gap-3">
                <CarouselPrevious className="bg-muted hover:bg-muted/80 static size-14.5 translate-x-0 translate-y-0 transition-colors [&>svg]:size-6 lg:[&>svg]:size-8" />
                <CarouselNext className="bg-muted hover:bg-muted/80 static size-14.5 translate-x-0 translate-y-0 transition-colors [&>svg]:size-6 lg:[&>svg]:size-8" />
              </div>
            </Carousel>
          </div>
        </div>
      </section>
      <DashedLine
        orientation="horizontal"
        className={cn("mx-auto max-w-[80%]", dashedLineClassName)}
      />
    </>
  );
};
