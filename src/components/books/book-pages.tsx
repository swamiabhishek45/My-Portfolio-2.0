import type { CSSProperties } from "react";
import type { Book } from "@/data/books";

/** Depth index: 0 sits just under the top page, 7 rests on the back board. */
const SHEETS = [0, 1, 2, 3, 4, 5, 6, 7];

/**
 * The page block: stacked sheets that splay towards the fore edge, topped by
 * the half-title page that the lifting cover uncovers.
 */
export function BookPages({ book }: { book: Book }) {
  return (
    <>
      {SHEETS.map((i) => (
        <div
          key={`sheet-${i}`}
          className="book3d-sheet"
          style={{ "--i": i } as CSSProperties}
        />
      ))}

      <div className="book3d-page book3d-paper">
        <div className="flex h-full w-full flex-col justify-between py-3 pr-2 pl-4 text-right">
          <p className="font-mono text-[6px] tracking-[0.2em] text-stone-500 uppercase">
            {book.year}
          </p>

          <div className="space-y-1">
            <h3 className="font-sans text-[9px] leading-[1.25] font-bold text-stone-900">
              {book.title}
            </h3>
            <p className="font-mono text-[6px] tracking-[0.16em] text-stone-600 uppercase">
              {book.author}
            </p>
          </div>

          <p className="font-sans text-[7px] leading-[1.5] text-stone-600 italic">
            &ldquo;{book.excerpt}&rdquo;
          </p>
        </div>
      </div>
    </>
  );
}
