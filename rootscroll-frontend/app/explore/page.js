"use client";

import { useEffect, useState } from "react";

import BookCard from "../components/BookCard";
import { getBooks, getCategories } from "../lib/api";

export default function ExploreLibrary() {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [availability, setAvailability] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();

        setCategories(
          Array.isArray(data) ? data : data.results || []
        );
      } catch (error) {
        console.error("Unable to load categories:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    const fetchBooks = async () => {
      setLoading(true);
      setError("");

      try {
        const params = new URLSearchParams();

        if (search.trim()) {
          params.append("search", search.trim());
        }

        if (selectedCategory) {
          params.append("category", selectedCategory);
        }

        if (availability === "available") {
          params.append("available", "true");
        }

        const query = params.toString();

        const data = await getBooks(
          query ? `?${query}` : ""
        );

        if (controller.signal.aborted) return;

        setBooks(
          Array.isArray(data) ? data : data.results || []
        );

      } catch (error) {
        if (controller.signal.aborted) return;

        setError(error.message || "Unable to load the library.");
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    const timer = setTimeout(fetchBooks, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };

  }, [search, selectedCategory, availability]);

  return (
    <div className="max-w-7xl mx-auto px-5 md:px-8 py-16">

      {/* Page Heading */}

      <section className="mb-12">

        <p className="text-accent text-xs uppercase tracking-[0.2em] font-semibold">
          The RootScroll Catalogue
        </p>

        <h1 className="font-editorial text-5xl md:text-6xl mt-4">
          Explore the Library.
        </h1>

        <p className="text-muted leading-7 mt-5 max-w-2xl">
          Browse physical books covering programming, software development,
          computer science and the ideas shaping our digital world.
        </p>

      </section>

      {/* Search and Filters */}

      <section className="bg-surface border border-border rounded-2xl p-5 md:p-7 mb-10">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* Search */}

          <div className="md:col-span-1">

            <label className="text-xs text-muted block mb-2">
              Search the collection
            </label>

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search title, author..."
              className="w-full px-4 py-3 rounded-xl bg-background border border-border outline-none focus:border-primary transition text-sm"
            />

          </div>

          {/* Category */}

          <div>

            <label className="text-xs text-muted block mb-2">
              Collection
            </label>

            <select
              value={selectedCategory}
              onChange={(event) => setSelectedCategory(event.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-background border border-border outline-none focus:border-primary transition text-sm"
            >

              <option value="">All Collections</option>

              {categories.map((category) => (
                <option key={category.id} value={category.slug}>
                  {category.name}
                </option>
              ))}

            </select>

          </div>

          {/* Availability */}

          <div>

            <label className="text-xs text-muted block mb-2">
              Availability
            </label>

            <select
              value={availability}
              onChange={(event) => setAvailability(event.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-background border border-border outline-none focus:border-primary transition text-sm"
            >

              <option value="">All Books</option>
              <option value="available">Available Books</option>

            </select>

          </div>

        </div>

        <div className="flex justify-end mt-5">

          <button
            onClick={() => {
              setSearch("");
              setSelectedCategory("");
              setAvailability("");
            }}
            className="text-xs font-semibold text-primary hover:underline"
          >
            Clear filters
          </button>

        </div>

      </section>

      {/* Catalogue */}

      <section>

        <div className="flex justify-between items-center mb-7">

          <h2 className="font-editorial text-2xl">
            {search || selectedCategory
              ? "Search results"
              : "The Collection"}
          </h2>

          <p className="text-xs text-muted">
            {loading ? "Loading..." : `${books.length} books found`}
          </p>

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

        ) : error ? (

          <div className="bg-surface border border-red-300 rounded-2xl p-10 text-center">

            <h3 className="font-editorial text-2xl">
              Something interrupted our search.
            </h3>

            <p className="text-muted text-sm mt-3">
              {error}
            </p>

            <button
              onClick={() => window.location.reload()}
              className="mt-5 text-sm text-primary font-semibold"
            >
              Try again
            </button>

          </div>

        ) : books.length > 0 ? (

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}

          </div>

        ) : (

          <div className="bg-surface border border-border rounded-2xl p-14 text-center">

            <span className="text-4xl">⌕</span>

            <h3 className="font-editorial text-2xl mt-5">
              No books found.
            </h3>

            <p className="text-muted text-sm mt-3">
              Try another search or adjust your filters.
            </p>

          </div>

        )}

      </section>

    </div>
  );
}