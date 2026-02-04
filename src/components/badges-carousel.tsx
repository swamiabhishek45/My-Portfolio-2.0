"use client";

import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export function BadgeCarousel() {
  const badgeCount = 4; // 👈 total badges
  const badges = Array.from({ length: badgeCount }, (_, i) => i + 1).reverse(); // [1, 2, 3]

  return (
    <Carousel
      opts={{
        align: "start",
        loop: true, // 👈 optional for infinite looping
      }}
      className="w-full max-w-sm mx-auto"
    >
      <CarouselContent>
        {badges.map((num) => (
          <CarouselItem
            key={num}
            className="md:basis-1/2 lg:basis-1/3 flex justify-center"
          >
            <div className="p-2">
              <Image
                alt={`Badge ${num}`}
                src={`/leetcode-badges/${num}.png`}
                width={100}
                height={100}
                className="rounded-lg shadow-md"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="hidden md:flex">
        <CarouselPrevious />
        <CarouselNext />
      </div>
    </Carousel>
  );
}
