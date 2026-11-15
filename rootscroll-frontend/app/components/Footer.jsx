import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-primary text-white dark:text-[#173F35] mt-24">

      <div className="max-w-7xl mx-auto px-5 md:px-8 py-16">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

          <div>
            <h2 className="font-editorial text-3xl font-bold">
              RootScroll.
            </h2>

            <p className="text-sm text-white/70 dark:text-[#173F35]/75 mt-4 leading-7 max-w-sm">
              A digital bridge to physical books exploring programming,
              computing and the art of building with code.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-5">Explore</h3>

            <div className="space-y-3 text-sm text-white/70 dark:text-[#173F35]/75 flex flex-col">
              <Link href="/" className="hover:text-white hover:dark:text-[#173F35] w-fit">Home</Link>
              <Link href="/explore" className=" hover:text-white dark:text-[#173F35] w-fit">Explore Library</Link>
              <Link href="/explore" className="hover:text-white hover:dark:text-[#173F35] w-fit">Collections</Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-5">Our Philosophy</h3>

            <p className="text-sm text-white/70 dark:text-[#173F35] leading-7">
              Technology evolves. The foundations of knowledge
              should never be forgotten.
            </p>
          </div>

        </div>

        <div className="border-t border-white/20 border-dark:text-[#173F35]/20 mt-14 pt-7 flex flex-col md:flex-row justify-between gap-4 text-xs text-white/60 dark:text-[#173F35]/70">

          <p>© {new Date().getFullYear()} RootScroll. All rights reserved.</p>

          <p>Discover the knowledge. Find the book. Explore the roots of code.</p>

        </div>

      </div>
    </footer>
  );
}