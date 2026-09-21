import Image from "next/image";
import type { FavoriteMediaItem } from "@/data/favorites-media";

type MediaCardProps = {
  item: FavoriteMediaItem;
  creditLabel: "Director" | "Creator";
};

export function MediaCard({ item, creditLabel }: MediaCardProps) {
  const creditPrefix = creditLabel === "Director" ? "Dir." : "Creator";

  return (
    <article className="group relative aspect-2/3 w-full overflow-hidden rounded-[10px] bg-neutral-900 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.65)] ring-1 ring-white/[0.06] dark:ring-white/[0.08]">
      <Image
        src={item.poster}
        alt={`${item.title} poster`}
        fill
        sizes="(max-width: 640px) 30vw, 200px"
        className="object-cover transition duration-500 group-hover:scale-[1.04]"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-transparent opacity-100 transition-opacity duration-300 group-hover:from-black group-hover:via-black/55" />
      <div className="absolute inset-x-0 bottom-0 p-2 sm:p-2.5">
        <p className="text-[10px] font-semibold leading-snug text-white sm:text-[11px]">
          {item.title}
        </p>
        <p className="mt-0.5 text-[9px] leading-snug text-white/65 sm:text-[10px]">
          {creditPrefix} {item.director} · {item.year}
        </p>
      </div>
    </article>
  );
}
