import Link from "next/link";

export default function AuthLayout({
  eyebrow = "ROOTSCROLL ACCOUNT",
  title,
  description,
  children,
  footer,
}) {
  return (
    <main className="flex-1 flex items-center justify-center px-5 py-16 sm:px-8">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">

        {/* Left: Editorial Section */}
        <section className="hidden lg:flex flex-col justify-between bg-primary p-12 text-white">
          <div>
            <Link
              href="/"
              className="font-editorial text-3xl font-semibold tracking-tight"
            >
              RootScroll<span className="text-accent">.</span>
            </Link>

            <p className="mt-3 text-sm text-white/65">
              A Library of Code & Thought
            </p>
          </div>

          <div className="max-w-md py-12">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              The Knowledge Archive
            </span>

            <h2 className="mt-5 font-editorial text-4xl leading-tight">
              Before the prompt, there was the programmer.
            </h2>

            <p className="mt-6 text-sm leading-7 text-white/70">
              Explore the ideas, people, principles, and craftsmanship
              that shaped the world of programming. Some things are worth
              reading beyond the screen.
            </p>
          </div>

          <div className="border-t border-white/15 pt-6">
            <p className="text-xs text-white/50">
              Discover the knowledge. Find the book. Explore the roots of code.
            </p>
          </div>
        </section>

        {/* Right: Form Section */}
        <section className="flex flex-col justify-center px-6 py-10 sm:px-12 lg:px-14">
          <div className="mb-9">
            <Link
              href="/"
              className="font-editorial text-2xl font-semibold text-primary lg:hidden"
            >
              RootScroll<span className="text-accent">.</span>
            </Link>

            <p className="mt-7 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              {eyebrow}
            </p>

            <h1 className="mt-3 font-editorial text-3xl font-semibold text-foreground sm:text-4xl">
              {title}
            </h1>

            <p className="mt-3 max-w-md text-sm leading-6 text-muted">
              {description}
            </p>
          </div>

          {children}

          {footer && (
            <div className="mt-8 border-t border-border pt-6 text-center text-sm text-muted">
              {footer}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}