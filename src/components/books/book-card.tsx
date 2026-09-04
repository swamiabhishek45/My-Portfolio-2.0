"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Book } from "@/data/books";
import { BookCover } from "./book-cover";
import { BookPages } from "./book-pages";

const canHover = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(hover: hover) and (pointer: fine)").matches;

export function BookCard({ book }: { book: Book }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setOpen(false), []);

  // Touch devices keep the book open until something else is tapped.
  useEffect(() => {
    if (!open || canHover()) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!ref.current?.contains(event.target as Node)) close();
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open, close]);

  return (
    <div ref={ref} className="book-card" data-open={open}>
      <button
        type="button"
        aria-expanded={open}
        aria-label={`${book.title} by ${book.author}. ${book.status}.`}
        onPointerEnter={(e) => e.pointerType === "mouse" && setOpen(true)}
        onPointerLeave={(e) => e.pointerType === "mouse" && close()}
        onFocus={() => setOpen(true)}
        onBlur={close}
        onClick={() => {
          if (!canHover()) setOpen((value) => !value);
        }}
        className="book-scene block aspect-2/3 w-full cursor-pointer rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-4 focus-visible:ring-offset-black"
      >
        <div className="book3d">
          <div className="book3d-shadow" />
          <div className="book3d-backcover" />
          <div className="book3d-spine" />
          <BookPages book={book} />
          <BookCover book={book} />
        </div>

        <div className="book3d-caption">
          <p className="truncate font-sans text-[9px] font-bold text-neutral-800 dark:text-neutral-200">
            {book.title}
          </p>
          <p className="truncate font-mono text-[8px] tracking-[0.12em] text-neutral-500 uppercase">
            {book.author} · {book.status}
          </p>
        </div>

        {/* Shown instead of the 3D lift when motion is reduced. */}
        <div className="book3d-flat absolute inset-0 rounded-sm bg-black/85 p-3 text-left backdrop-blur-[1px]">
          <p className="font-sans text-[10px] leading-tight font-bold text-white">
            {book.title}
          </p>
          <p className="mt-1 font-mono text-[7px] tracking-[0.16em] text-white/60 uppercase">
            {book.author}
          </p>
          <p className="mt-2 font-sans text-[8px] leading-[1.5] text-white/75 italic">
            &ldquo;{book.excerpt}&rdquo;
          </p>
        </div>
      </button>
    </div>
  );
}
