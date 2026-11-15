"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { getBooks } from "../lib/api";
import BookCard from "./BookCard";

export default function FeaturedBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const data = await getBooks();

        const results = Array.isArray(data)
          ? data
          : data.results || [];

        setBooks(results.slice(0, 4));
      } catch (error) {
        console.error("Unable to load featured books:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-5 md:px-8 py-20">

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-10">

        <div>
          <p className="text-accent text-xs uppercase tracking-[0.2em] font-semibold">
            The collection
          </p>

          <h2 className="font-editorial text-4xl md:text-5xl mt-3">
            Knowledge worth <br className="hidden md:block" />
            returning to.
          </h2>
        </div>

        <Link
          href="/explore"
          className="text-sm text-primary font-semibold hover:underline"
        >
          Explore the entire collection →
        </Link>

      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-96 rounded-2xl bg-border/60 animate-pulse"
            />
          ))}
        </div>
      ) : books.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      ) : (
        <div className="bg-surface border border-border rounded-2xl p-10 text-center">
          <p className="font-editorial text-2xl">
            The shelves are waiting.
          </p>

          <p className="text-muted text-sm mt-3">
            Our featured collection will appear here once books have been added.
          </p>
        </div>
      )}

    </section>
  );
}