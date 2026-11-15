"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useAuth } from "../context/AuthContext";

import {
  getBookRequests,
  cancelBookRequest,
} from "../lib/api";

import LoadingState from "../components/ui/LoadingState";

const statusStyles = {
  pending: "bg-amber-100 text-amber-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  cancelled: "bg-gray-100 text-gray-700",
  completed: "bg-blue-100 text-blue-800",
};

const statusDescriptions = {
  pending: "Your request is awaiting administrator approval.",
  approved: "Your reservation has been approved.",
  rejected: "Your reservation request was declined.",
  cancelled: "You cancelled this reservation request.",
  completed: "This reservation has been completed.",
};

export default function MyRequestsPage() {
  const router = useRouter();

  const { user, loading: authLoading } = useAuth();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace(
        `/login?next=${encodeURIComponent("/my-requests")}`
      );
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (!user) return;

    const fetchRequests = async () => {
      try {
        const data = await getBookRequests();

        setRequests(
          Array.isArray(data) ? data : data?.results || []
        );
      } catch (error) {
        setError(error.message || "Unable to retrieve your requests.");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [user]);

  const handleCancel = async (requestId) => {
    setCancellingId(requestId);
    setError("");
    setMessage("");

    try {
      await cancelBookRequest(requestId);

      setRequests((previous) =>
        previous.map((item) =>
          item.id === requestId
            ? { ...item, status: "cancelled" }
            : item
        )
      );

      setMessage("Your reservation request has been cancelled.");
    } catch (error) {
      setError(error.message || "Unable to cancel this request.");
    } finally {
      setCancellingId(null);
    }
  };

  if (authLoading || !user || loading) {
    return <LoadingState message="Retrieving your requests..." fullScreen />;
  }

  return (
    <main className="max-w-6xl mx-auto px-5 md:px-8 py-16">

      {/* Heading */}

      <div className="mb-12">

        <Link
          href="/account"
          className="text-xs text-muted hover:text-primary transition"
        >
          ← My Account
        </Link>

        <p className="text-accent uppercase tracking-[0.2em] text-xs font-semibold mt-8">
          Reservation History
        </p>

        <h1 className="font-editorial text-4xl md:text-5xl mt-4">
          My Requests
        </h1>

        <p className="text-muted mt-4 max-w-xl leading-7">
          Keep track of your borrowing requests,
          their approval status and reservation history.
        </p>

      </div>

      {/* Feedback */}

      {message && (
        <div className="mb-6 p-4 rounded-xl bg-green-100 text-green-800 text-sm">
          {message}
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-100 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Empty State */}

      {requests.length === 0 ? (

        <div className="border border-border rounded-3xl bg-surface px-6 py-20 text-center">

          <div className="text-5xl text-accent">
            ◷
          </div>

          <h2 className="font-editorial text-2xl mt-6">
            No reservations yet.
          </h2>

          <p className="text-muted text-sm mt-3 max-w-md mx-auto leading-7">
            Your borrowing history will appear here
            once you request a physical book.
          </p>

          <Link
            href="/explore"
            className="inline-flex mt-8 px-7 py-3 rounded-full bg-primary text-background text-sm font-semibold hover:opacity-90 transition"
          >
            Explore Books
          </Link>

        </div>

      ) : (

        <div className="space-y-5">

          <p className="text-sm text-muted mb-6">
            {requests.length}{" "}
            {requests.length === 1 ? "request" : "requests"} found
          </p>

          {requests.map((item) => {

            const book = item.book;

            return (
              <article
                key={item.id}
                className="bg-surface border border-border rounded-2xl p-5 md:p-7"
              >

                <div className="flex flex-col md:flex-row gap-6">

                  {/* Book Cover */}

                  <div className="w-full md:w-28 h-40 shrink-0 rounded-xl overflow-hidden bg-[#E9E4D8]">

                    {book?.cover_image ? (
                      <img
                        src={book.cover_image}
                        alt={book.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="h-full flex items-center justify-center text-4xl text-[#777C78]">
                        ▤
                      </div>
                    )}

                  </div>

                  {/* Request Information */}

                  <div className="flex-1">

                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">

                      <div>

                        <p className="text-xs uppercase tracking-wider text-accent">
                          {book?.category?.name || "Programming Literature"}
                        </p>

                        <Link href={`/books/${book?.id}`}>

                          <h2 className="font-editorial text-xl md:text-2xl mt-2 hover:text-primary transition">
                            {book?.title || "Book unavailable"}
                          </h2>

                        </Link>

                        <p className="text-sm text-muted mt-2">
                          {book?.author}
                        </p>

                      </div>

                      <span
                        className={`inline-flex w-fit px-4 py-2 rounded-full text-xs font-semibold capitalize ${
                          statusStyles[item.status] ||
                          "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {item.status}
                      </span>

                    </div>

                    <p className="text-sm text-muted mt-5 leading-6">
                      {statusDescriptions[item.status] ||
                        "Request status unavailable."}
                    </p>

                    <div className="flex flex-wrap gap-6 mt-6 pt-5 border-t border-border text-xs text-muted">

                      <div>
                        <span className="block mb-1">
                          Request ID
                        </span>

                        <span className="text-foreground font-medium">
                          #{item.id}
                        </span>
                      </div>

                      <div>
                        <span className="block mb-1">
                          Requested on
                        </span>

                        <span className="text-foreground font-medium">
                          {new Date(item.requested_at).toLocaleDateString()}
                        </span>
                      </div>

                    </div>

                    {/* Assigned Copy */}

                    {item.assigned_copy && (
                      <div className="mt-5 p-4 rounded-xl bg-background border border-border">

                        <p className="text-xs text-muted">
                          Assigned physical copy
                        </p>

                        <p className="text-sm font-semibold mt-2">
                          {item.assigned_copy.copy_code}
                        </p>

                      </div>
                    )}

                    {/* Cancel Action */}

                    {item.status === "pending" && (
                      <button
                        onClick={() => handleCancel(item.id)}
                        disabled={cancellingId === item.id}
                        className="mt-6 text-sm text-red-600 font-semibold hover:underline disabled:opacity-50"
                      >
                        {cancellingId === item.id
                          ? "Cancelling..."
                          : "Cancel Request"}
                      </button>
                    )}

                  </div>

                </div>

              </article>
            );
          })}

        </div>

      )}

    </main>
  );
}