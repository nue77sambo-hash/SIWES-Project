import Link from "next/link";

export default function AuthLayout({
  eyebrow = "ROOTSCROLL ACCOUNT",
  title,
  description,
  children,
  footer,
  image = "/images/auth/auth-student.jpg",
}) {
  return (
    <main className="flex-1 flex items-center justify-center px-4 py-10 sm:px-8 sm:py-16">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 overflow-hidden rounded-3xl border border-border bg-surface shadow-xl shadow-black/5">

        {/* Left: Editorial Image Panel */}
        <section
          className="relative flex min-h-[320px] flex-col justify-between overflow-hidden p-7 sm:p-10 lg:min-h-[680px] lg:p-12 text-white"
          style={{
            backgroundImage: `
              linear-gradient(
                180deg,
                rgba(15, 43, 35, 0.72) 0%,
                rgba(15, 43, 35, 0.50) 45%,
                rgba(15, 43, 35, 0.92) 100%
              ),
              url('${image}')
            `,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Decorative background detail */}
          <div className="absolute inset-0 pointer-events-none opacity-20">
            <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full border border-white/40" />
            <div className="absolute -right-12 -top-12 h-56 w-56 rounded-full border border-white/30" />
          </div>

          <div className="relative z-10">
            <Link
              href="/"
              className="font-editorial text-3xl font-semibold tracking-tight"
            >
              RootScroll<span className="text-accent">.</span>
            </Link>

            <p className="mt-2 text-sm text-white/75">
              A Library of Code & Thought
            </p>
          </div>

          <div className="relative z-10 max-w-md py-10 lg:py-12">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#E2B653]">
              <span className="h-px w-7 bg-[#E2B653]" />
              The Knowledge Archive
            </span>

            <h2 className="mt-6 font-editorial text-4xl leading-tight sm:text-5xl">
              Before the prompt, there was the programmer.
            </h2>

            <p className="mt-6 max-w-sm text-sm leading-7 text-white/80">
              Explore the ideas, people, principles, and craftsmanship
              that shaped the world of programming. Some things are worth
              reading beyond the screen.
            </p>
          </div>

          <div className="relative z-10 border-t border-white/20 pt-6">
            <p className="text-xs leading-6 text-white/65">
              Discover the knowledge. Find the book. Explore the roots of code.
            </p>
          </div>
        </section>

        {/* Right: Authentication Form */}
        <section className="flex flex-col justify-center px-6 py-10 sm:px-12 lg:px-14 lg:py-16">
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

            <p className="mt-3 max-w-md text-sm leading-7 text-muted">
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