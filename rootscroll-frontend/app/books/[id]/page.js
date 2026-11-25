"use client";

import { Suspense } from "react";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

import {
  getBookDetails,
  requestBook,
  saveBook,
} from "../../lib/api";

import { getToken } from "../../lib/auth";
import LoadingButton from "@/app/components/ui/LoadingButton";

export default function BookDetails() {
  const params = useParams();
  const router = useRouter();

  const id = params.id;

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [requesting, setRequesting] = useState(false);
  const [saving, setSaving] = useState(false);

  const [requestSubmitted, setRequestSubmitted] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const data = await getBookDetails(id);
        setBook(data);
      } catch (error) {
        setError(error.message || "Unable to retrieve this book.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBook();
    }
  }, [id]);

  const handleRequest = async () => {
    if (!getToken()) {
      router.push(`/login?next=${encodeURIComponent(`/books/${id}`)}`);
      return;
    }

    setRequesting(true);
    setMessage("");
    setError("");

    try {
      await requestBook(book.id);

      setRequestSubmitted(true);

      setMessage(
        "Your borrowing request has been submitted successfully. It is now awaiting approval."
      );

    } catch (error) {
      setError(
        error.message || "Unable to submit your borrowing request."
      );
    } finally {
      setRequesting(false);
    }
  };

  const handleSave = async () => {
    if (!getToken()) {
      router.push(`/login?next=${encodeURIComponent(`/books/${id}`)}`);
      return;
    }

    setSaving(true);
    setMessage("");
    setError("");

    try {
      await saveBook(book.id);

      setMessage("This book has been added to your saved collection.");

    } catch (error) {
      if (error.status === 400) {
        setError(
          "This book may already be in your saved collection."
        );
      } else {
        setError(
          error.message || "Unable to save this book."
        );
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-5 py-24">
        <div className="h-96 bg-border/60 rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (error && !book) {
    return (
      <div className="max-w-3xl mx-auto px-5 py-24 text-center">

        <h1 className="font-editorial text-3xl">
          Book unavailable.
        </h1>

        <p className="text-muted mt-4">
          {error}
        </p>

        <Link
          href="/explore"
          className="inline-block mt-7 text-primary font-semibold"
        >
          ← Return to Library
        </Link>

      </div>
    );
  }

  if (!book) return null;

  const availableCopies = book.available_copies ?? 0;

  return (
    <Suspense fallback={LoadingButton}>
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-14">

        {/* Breadcrumb */}

        <div className="flex items-center gap-2 text-xs text-muted mb-12">

          <Link href="/" className="hover:text-primary">
            Home
          </Link>

          <span>/</span>

          <Link href="/explore" className="hover:text-primary">
            Library
          </Link>

          <span>/</span>

          <span className="text-foreground">
            Book Details
          </span>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-start">

          {/* Book Cover */}

          <div className="bg-surface border border-border rounded-3xl p-8 md:p-12">

            <div className="max-w-sm mx-auto h-[430px] bg-[#E9E4D8] rounded-xl overflow-hidden shadow-xl">

              {book.cover_image ? (
                <img
                  src={book.cover_image}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-[#777C78]">
                  <span className="text-6xl">▤</span>
                  <p className="text-sm mt-4">Cover unavailable</p>
                </div>
              )}

            </div>

            <p className="text-center text-xs text-muted mt-6">
              Physical book · RootScroll Collection
            </p>

          </div>

          {/* Book Information */}

          <div>

            <p className="text-accent uppercase tracking-[0.2em] text-xs font-semibold">
              {book.category?.name || "Programming Literature"}
            </p>

            <h1 className="font-editorial text-4xl md:text-5xl leading-tight mt-5">
              {book.title}
            </h1>

            <p className="text-muted mt-4">
              Written by <span className="text-foreground font-medium">{book.author}</span>
            </p>

            {/* Availability */}

            <div className="mt-8 p-5 rounded-xl bg-surface border border-border">

              <p className="text-xs text-muted uppercase tracking-wider">
                Physical copy availability
              </p>

              <div className="flex items-center justify-between mt-3">

                <span className="font-editorial text-2xl">
                  {availableCopies > 0
                    ? `${availableCopies} available`
                    : "Currently unavailable"}
                </span>

                <span className={`h-3 w-3 rounded-full ${availableCopies > 0
                    ? "bg-green-500"
                    : "bg-red-500"
                  }`} />

              </div>

            </div>

            {/* Description */}

            <div className="mt-10">

              <h2 className="font-editorial text-2xl">
                About this book
              </h2>

              <p className="text-muted leading-8 mt-4">
                {book.description || "No description has been added yet."}
              </p>

            </div>

            {/* Publication Details */}

            <div className="grid grid-cols-2 gap-6 mt-10 py-7 border-y border-border">

              <div>
                <p className="text-xs text-muted">Publisher</p>
                <p className="text-sm font-medium mt-2">
                  {book.publisher || "Not specified"}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted">Publication Year</p>
                <p className="text-sm font-medium mt-2">
                  {book.publication_year || "Not specified"}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted">Edition</p>
                <p className="text-sm font-medium mt-2">
                  {book.edition || "Not specified"}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted">Author</p>
                <p className="text-sm font-medium mt-2">
                  {book.author}
                </p>
              </div>

            </div>

            {/* Tags */}

            {book.tags?.length > 0 && (
              <div className="mt-7">

                <p className="text-xs text-muted mb-3">
                  Related topics
                </p>

                <div className="flex flex-wrap gap-2">

                  {book.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="px-3 py-2 rounded-full border border-border text-xs"
                    >
                      {tag.name}
                    </span>
                  ))}

                </div>

              </div>
            )}

            {/* Messages */}

            {message && (
              <div className="mt-7 p-4 rounded-xl bg-green-100 text-green-800 text-sm">
                {message}
              </div>
            )}

            {error && (
              <div className="mt-7 p-4 rounded-xl bg-red-100 text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Actions */}

            <div className="flex flex-col sm:flex-row gap-4 mt-9">

              <button
                onClick={handleRequest}
                disabled={
                  availableCopies < 1 ||
                  requesting ||
                  requestSubmitted
                }
                className="flex-1 py-4 px-6 rounded-full bg-primary text-background text-sm font-semibold disabled:opacity-40 hover:opacity-90 transition"
              >
                {requesting
                  ? "Submitting request..."
                  : requestSubmitted
                    ? "Request Submitted"
                    : "Request to Borrow"}
              </button>

              <button
                onClick={handleSave}
                disabled={saving}
                className="py-4 px-6 rounded-full border border-border text-sm font-semibold hover:border-primary transition disabled:opacity-50"
              >
                {saving ? "Saving..." : "♡ Save Book"}
              </button>

            </div>
            <p className="text-xs text-muted mt-5 leading-6">
              RootScroll does not sell or distribute digital copies.
              Borrowing requests are subject to physical copy availability
              and administrator approval.
            </p>

          </div>

        </div>

      </div>
    </Suspense>
  );
}