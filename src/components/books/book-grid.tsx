import type { Book } from "@/data/books";
import { BookCard } from "./book-card";

export function BookGrid({ books }: { books: Book[] }) {
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-10 overflow-visible sm:grid-cols-3 sm:gap-x-8 sm:gap-y-12">
      {books.map((book) => (
        <BookCard key={book.slug} book={book} />
      ))}
    </div>
  );
}
