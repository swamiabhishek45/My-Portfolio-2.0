"use client";

import Image from "next/image";
import { useState } from "react";
import type { Book } from "@/data/books";

/**
 * The front board. Its inner face is plain stock, since the cover only lifts
 * part way and never lies flat.
 */
export function BookCover({ book }: { book: Book }) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <div className="book3d-cover">
      <div className="book3d-face book3d-face--front relative">
        {imageFailed ? (
          <div
            className="flex h-full w-full flex-col justify-between p-3 text-left"
            style={{
              backgroundImage: `linear-gradient(155deg, ${book.accent} 0%, #0b0b0b 78%)`,
            }}
          >
            <span className="font-mono text-[7px] tracking-[0.18em] text-white/45 uppercase">
              {book.year}
            </span>
            <span className="font-sans text-[11px] leading-tight font-bold text-white/90">
              {book.title}
            </span>
            <span className="font-mono text-[7px] tracking-[0.16em] text-white/55 uppercase">
              {book.author}
            </span>
          </div>
        ) : (
          <Image
            src={book.cover}
            alt=""
            aria-hidden
            fill
            sizes="120px"
            quality={75}
            draggable={false}
            className="object-cover"
            onError={() => setImageFailed(true)}
          />
        )}
        <div className="book3d-sheen" />
      </div>

      <div className="book3d-face book3d-face--back book3d-paper book3d-paper--left" />
    </div>
  );
}
