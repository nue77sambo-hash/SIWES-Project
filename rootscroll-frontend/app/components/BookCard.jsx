import Link from "next/link";

export default function BookCard({ book }) {
  const availableCopies = book.available_copies ?? 0;

  return (
    <article className="group bg-surface border border-border rounded-2xl overflow-hidden hover:-translate-y-1 hover:shadow-xl transition-all duration-300">

      {/* Book Cover */}

      <Link href={`/books/${book.id}`} className="block">

        <div className="relative h-64 bg-[#E9E4D8] overflow-hidden">

          {book.cover_image ? (
            <img
              src={book.cover_image}
              alt={book.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-[#777C78]">
              <span className="text-5xl">▤</span>
              <p className="text-xs mt-3">Cover unavailable</p>
            </div>
          )}

          <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] uppercase tracking-wider text-foreground">
            {book.category?.name || "Programming"}
          </div>

        </div>

      </Link>

      {/* Book Information */}

      <div className="p-5">

        <p className="text-xs text-muted mb-2">
          {book.author}
        </p>

        <Link href={`/books/${book.id}`}>
          <h3 className="font-editorial text-xl font-bold leading-snug hover:text-primary transition-colors line-clamp-2">
            {book.title}
          </h3>
        </Link>

        <div className="flex items-center justify-between mt-5 pt-4 border-t border-border">

          <span className={`text-xs font-medium ${
            availableCopies > 0
              ? "text-green-700 dark:text-green-400"
              : "text-red-600 dark:text-red-400"
          }`}>
            {availableCopies > 0
              ? `${availableCopies} available`
              : "Currently unavailable"}
          </span>

          <Link
            href={`/books/${book.id}`}
            className="text-xs font-semibold text-primary hover:underline"
          >
            View book →
          </Link>

        </div>

      </div>

    </article>
  );
}