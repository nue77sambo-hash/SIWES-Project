"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useAuth } from "../context/AuthContext";

import {
  getSavedBooks,
  removeSavedBook,
} from "../lib/api";

import LoadingState from "../components/ui/LoadingState";

export default function SavedBooksPage() {
  const router = useRouter();

  const { user, loading: authLoading } = useAuth();

  const [savedBooks, setSavedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace(
        `/login?next=${encodeURIComponent("/saved-books")}`
      );
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (!user) return;

    const fetchSavedBooks = async () => {
      try {
        const data = await getSavedBooks();

        setSavedBooks(
          Array.isArray(data) ? data : data?.results || []
        );
      } catch (error) {
        setError(error.message || "Unable to load saved books.");
      } finally {
        setLoading(false);
      }
    };

    fetchSavedBooks();
  }, [user]);

  const handleRemove = async (savedBookId) => {
    setRemovingId(savedBookId);
    setError("");

    try {
      await removeSavedBook(savedBookId);

      setSavedBooks((previous) =>
        previous.filter((item) => item.id !== savedBookId)
      );
    } catch (error) {
      setError(error.message || "Unable to remove this book.");
    } finally {
      setRemovingId(null);
    }
  };

  if (authLoading || !user || loading) {
    return <LoadingState message="Opening your collection..." fullScreen />;
  }

  return (
    <main className="max-w-7xl mx-auto px-5 md:px-8 py-16">

      {/* Heading */}

      <div className="mb-12">

        <Link
          href="/account"
          className="text-xs text-muted hover:text-primary transition"
        >
          ← My Account
        </Link>

        <p className="text-accent uppercase tracking-[0.2em] text-xs font-semibold mt-8">
          Your Personal Collection
        </p>

        <h1 className="font-editorial text-4xl md:text-5xl mt-4">
          Saved Books
        </h1>

        <p className="text-muted mt-4 max-w-xl leading-7">
          A collection of books worth returning to.
          Keep track of the knowledge you intend to explore.
        </p>

      </div>

      {/* Error */}

      {error && (
        <div className="mb-8 p-4 rounded-xl bg-red-100 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Empty State */}

      {savedBooks.length === 0 ? (

        <div className="border border-border rounded-3xl bg-surface px-6 py-20 text-center">

          <div className="text-5xl text-accent">
            ▤
          </div>

          <h2 className="font-editorial text-2xl mt-6">
            Your collection is waiting.
          </h2>

          <p className="text-muted text-sm mt-3 max-w-md mx-auto leading-7">
            You haven't saved any books yet.
            Explore the library and collect the titles
            that catch your attention.
          </p>

          <Link
            href="/explore"
            className="inline-flex mt-8 px-7 py-3 rounded-full bg-primary text-background text-sm font-semibold hover:opacity-90 transition"
          >
            Explore the Library
          </Link>

        </div>

      ) : (

        <>
          <div className="flex items-center justify-between mb-7">

            <p className="text-sm text-muted">
              {savedBooks.length} saved{" "}
              {savedBooks.length === 1 ? "book" : "books"}
            </p>

            <Link
              href="/explore"
              className="text-sm text-primary font-semibold hover:opacity-70"
            >
              Discover more books →
            </Link>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">

            {savedBooks.map((item) => {
              const book = item.book;

              if (!book) return null;

              return (
                <article
                  key={item.id}
                  className="bg-surface border border-border rounded-2xl overflow-hidden group"
                >

                  <Link href={`/books/${book.id}`}>

                    <div className="h-64 bg-[#E9E4D8] overflow-hidden">

                      {book.cover_image ? (
                        <img
                          src={book.cover_image}
                          alt={book.title}
                          className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="h-full flex items-center justify-center text-5xl text-[#777C78]">
                          ▤
                        </div>
                      )}

                    </div>

                  </Link>

                  <div className="p-6">

                    <p className="text-xs text-accent uppercase tracking-wider">
                      {book.category?.name || "Programming Literature"}
                    </p>

                    <Link href={`/books/${book.id}`}>

                      <h2 className="font-editorial text-xl mt-3 hover:text-primary transition">
                        {book.title}
                      </h2>

                    </Link>

                    <p className="text-sm text-muted mt-2">
                      {book.author}
                    </p>

                    <div className="flex items-center justify-between mt-6 pt-5 border-t border-border">

                      <Link
                        href={`/books/${book.id}`}
                        className="text-sm font-semibold text-primary"
                      >
                        View Details →
                      </Link>

                      <button
                        onClick={() => handleRemove(item.id)}
                        disabled={removingId === item.id}
                        className="text-xs text-red-600 hover:underline disabled:opacity-50"
                      >
                        {removingId === item.id
                          ? "Removing..."
                          : "Remove"}
                      </button>

                    </div>

                  </div>

                </article>
              );
            })}

          </div>
        </>

      )}

    </main>
  );
}