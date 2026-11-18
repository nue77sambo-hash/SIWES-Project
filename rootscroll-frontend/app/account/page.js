"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useAuth } from "../context/AuthContext";

import {
  getSavedBooks,
  getBookRequests,
} from "../lib/api";

import LoadingState from "../components/ui/LoadingState";
import LoadingButton from "../components/ui/LoadingButton";

export default function AccountPage() {
  const router = useRouter();

  const {
    user,
    loading: authLoading,
    logout,
  } = useAuth();

  const [savedCount, setSavedCount] = useState(0);
  const [requestCount, setRequestCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);

  const [dataLoading, setDataLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login?next=%2Faccount");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (!user) return;

    const fetchDashboardData = async () => {
      try {
        const [savedData, requestData] = await Promise.all([
          getSavedBooks(),
          getBookRequests(),
        ]);

        const saved = Array.isArray(savedData)
          ? savedData
          : savedData?.results || [];

        const requests = Array.isArray(requestData)
          ? requestData
          : requestData?.results || [];

        setSavedCount(saved.length);
        setRequestCount(requests.length);

        setPendingCount(
          requests.filter((item) => item.status === "pending").length
        );

      } catch (error) {
        setError(
          error.message || "Unable to retrieve your library activity."
        );
      } finally {
        setDataLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const handleLogout = async () => {
    setLoggingOut(true);

    try {
      await logout();
      router.replace("/");
    } catch (error) {
      setError("Unable to complete logout. Please try again.");
      setLoggingOut(false);
    }
  };

  if (authLoading || !user || dataLoading) {
    return <LoadingState message="Opening your account..." fullScreen />;
  }

  return (
    <main className="max-w-7xl mx-auto px-5 md:px-8 py-16">

      {/* Heading */}

      <div className="mb-12">

        <p className="text-accent uppercase tracking-[0.2em] text-xs font-semibold">
          Your RootScroll Space
        </p>

        <h1 className="font-editorial text-4xl md:text-5xl mt-4">
          Welcome back, {user.username}.
        </h1>

        <p className="text-muted mt-4 max-w-xl leading-7">
          Your reading interests, saved discoveries
          and borrowing activity live here.
        </p>

      </div>

      {/* Error */}

      {error && (
        <div className="mb-8 p-4 rounded-xl bg-red-100 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Account Information */}

      <section className="bg-primary text-background rounded-3xl p-7 md:p-10">

        <p className="text-xs uppercase tracking-[0.2em] opacity-70">
          Account Information
        </p>

        <h2 className="font-editorial text-2xl mt-5">
          {user.username}
        </h2>

        <p className="text-sm opacity-80 mt-2">
          {user.email}
        </p>

        <div className="mt-7 pt-6 border-t border-background/20">

          <p className="text-xs opacity-70">
            RootScroll Member
          </p>

        </div>

      </section>

      {/* Library Statistics */}

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-8">

        <div className="bg-surface border border-border rounded-2xl p-7">

          <p className="text-xs text-muted uppercase tracking-wider">
            Saved Books
          </p>

          <p className="font-editorial text-4xl mt-4">
            {savedCount}
          </p>

          <Link
            href="/saved-books"
            className="inline-block text-sm text-primary font-semibold mt-5 hover:opacity-70"
          >
            View Collection →
          </Link>

        </div>

        <div className="bg-surface border border-border rounded-2xl p-7">

          <p className="text-xs text-muted uppercase tracking-wider">
            Total Requests
          </p>

          <p className="font-editorial text-4xl mt-4">
            {requestCount}
          </p>

          <Link
            href="/my-requests"
            className="inline-block text-sm text-primary font-semibold mt-5 hover:opacity-70"
          >
            View History →
          </Link>

        </div>

        <div className="bg-surface border border-border rounded-2xl p-7">

          <p className="text-xs text-muted uppercase tracking-wider">
            Awaiting Approval
          </p>

          <p className="font-editorial text-4xl mt-4">
            {pendingCount}
          </p>

          <Link
            href="/my-requests"
            className="inline-block text-sm text-primary font-semibold mt-5 hover:opacity-70"
          >
            Track Requests →
          </Link>

        </div>

      </section>

      {/* Quick Actions */}

      <section className="mt-16">

        <div className="mb-7">

          <p className="text-accent uppercase tracking-[0.2em] text-xs font-semibold">
            Your Library
          </p>

          <h2 className="font-editorial text-3xl mt-3">
            Continue exploring.
          </h2>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <Link
            href="/explore"
            className="group bg-surface border border-border rounded-2xl p-8 hover:border-primary transition"
          >

            <span className="text-3xl text-accent">
              ⌕
            </span>

            <h3 className="font-editorial text-2xl mt-5">
              Explore the Library
            </h3>

            <p className="text-sm text-muted mt-3 leading-7">
              Discover programming books, computing literature
              and stories from the world of technology.
            </p>

            <span className="inline-block text-sm text-primary font-semibold mt-6">
              Discover Books →
            </span>

          </Link>

          <Link
            href="/saved-books"
            className="group bg-surface border border-border rounded-2xl p-8 hover:border-primary transition"
          >

            <span className="text-3xl text-accent">
              ♡
            </span>

            <h3 className="font-editorial text-2xl mt-5">
              Your Saved Collection
            </h3>

            <p className="text-sm text-muted mt-3 leading-7">
              Revisit books you've saved and keep track
              of the knowledge you want to explore.
            </p>

            <span className="inline-block text-sm text-primary font-semibold mt-6">
              Open Collection →
            </span>

          </Link>

        </div>

      </section>

      {/* Logout */}

      <div className="mt-16 pt-8 border-t border-border flex justify-between items-center gap-5">

        <div>

          <h3 className="font-semibold text-sm">
            Leaving already?
          </h3>

          <p className="text-xs text-muted mt-2">
            You can return to your collection whenever you like.
          </p>

        </div>

        <div className="w-36">

          <LoadingButton
            type="button"
            loading={loggingOut}
            loadingText="Signing out..."
            onClick={handleLogout}
            className="!w-auto !px-5 !py-3 bg-transparent border border-border text-surface hover:bg-background"
          >
            Sign Out
          </LoadingButton>

        </div>

      </div>

    </main>
  );
}