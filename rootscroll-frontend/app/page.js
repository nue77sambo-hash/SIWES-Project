import Link from "next/link";
import FeaturedBooks from "./components/FeaturedBooks";

import {
  FiArrowRight,
  FiArrowUpRight,
  FiBookOpen,
  FiCode,
  FiCpu,
  FiDatabase,
  FiFeather,
  FiGlobe,
  FiLayers,
  FiStar
} from "react-icons/fi";

const collections = [
  {
    number: "01",
    title: "Learn to Code",
    description:
      "Hands-on guides, tutorials and foundational resources for learning programming languages and development.",
    image: "/images/collections/coder.jpg",
    icon: FiCode,
    label: "THE FOUNDATIONS"
  },
  {
    number: "02",
    title: "Understand the Code",
    description:
      "Explore algorithms, data structures and the principles behind how software systems work.",
    image: "/images/collections/markus-spiske-JBfE4vFLCis-unsplash.jpg",
    icon: FiDatabase,
    label: "THE INNER WORKINGS"
  },
  {
    number: "03",
    title: "The History of Programming",
    description:
      "Discover the pioneers, breakthroughs and stories that shaped the evolution of computing.",
    image: "/images/collections/yuheng-ouyang-okgMMgpliIk-unsplash.jpg",
    icon: FiCpu,
    label: "THE ARCHIVES"
  },
  {
    number: "04",
    title: "Beyond the Syntax",
    description:
      "Explore software craftsmanship, engineering culture, problem-solving and the philosophy of technology.",
    image: "/images/collections/A-software-engineering-culture-Wie96.png",
    icon: FiLayers,
    label: "THE CRAFT"
  },
  {
    number: "05",
    title: "Fiction & Imagination",
    description:
      "Enter imaginative worlds exploring artificial intelligence, digital futures and the relationship between humanity and technology.",
    image: "/images/collections/techod.jpg",
    icon: FiGlobe,
    label: "THE POSSIBILITIES"
  }
];

export default function Home() {
  return (
    <main>

      {/* HERO SECTION */}

      <section className="relative overflow-hidden">

        <div className="max-w-7xl mx-auto px-5 md:px-8 py-20 md:py-28">

          <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">

            {/* Hero Content */}

            <div className="animate-fade-up">

              <div className="flex items-center gap-3 mb-8">

                <span className="w-10 h-px bg-accent" />

                <p className="text-xs uppercase tracking-[0.22em] text-muted">
                  A digital library for physical knowledge
                </p>

              </div>

              <h1 className="font-editorial text-5xl md:text-6xl xl:text-7xl leading-[1.08] tracking-tight">

                Some things are worth reading

                <span className="italic text-primary block mt-2">
                  beyond the screen.
                </span>

              </h1>

              <p className="text-muted leading-8 mt-8 max-w-xl">

                Discover a curated collection of physical books exploring
                programming, computing and the art of building with code.

                Because the foundations of knowledge deserve more than a scroll.

              </p>

              <div className="flex flex-wrap items-center gap-4 mt-10">

                <Link
                  href="/explore"
                  className="inline-flex items-center gap-3 px-7 py-4 bg-primary text-background rounded-full text-sm font-semibold hover:opacity-90 transition"
                >
                  Explore the Library

                  <FiArrowUpRight size={18} />

                </Link>

                <a
                  href="#philosophy"
                  className="inline-flex items-center gap-2 px-7 py-4 border border-border rounded-full text-sm hover:border-primary transition"
                >
                  Our Philosophy

                  <FiArrowRight size={16} />

                </a>

              </div>

              {/* Archive Statistics */}

              <div className="flex items-center gap-8 mt-14 pt-8 border-t border-border">

                <div>
                  <p className="font-editorial text-3xl">05</p>

                  <p className="text-xs text-muted mt-1">
                    Curated collections
                  </p>
                </div>

                <div className="h-10 w-px bg-border" />

                <div>
                  <p className="font-editorial text-3xl">∞</p>

                  <p className="text-xs text-muted mt-1">
                    Ideas to explore
                  </p>
                </div>

                <div className="h-10 w-px bg-border" />

                <div>
                  <FiBookOpen className="text-accent text-2xl mb-2" />

                  <p className="text-xs text-muted">
                    Physical books
                  </p>
                </div>

              </div>

            </div>


            {/* Hero Image */}

            <div className="relative">

              <div className="relative h-[420px] md:h-[540px] rounded-[2rem] overflow-hidden shadow-2xl">

                <img
                  src="/images/hero/large-collection-old-books-wooden-shelves-generated-by-ai (1).jpg"
                  alt="An atmospheric archive representing the connection between ancient knowledge and future technology"
                  className="w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/10" />

                <div className="absolute top-7 left-7 flex items-center gap-2">

                  <span className="w-2 h-2 rounded-full bg-accent" />

                  <span className="text-white text-xs uppercase tracking-[0.2em]">
                    The RootScroll Archive
                  </span>

                </div>

                <div className="absolute bottom-8 left-8 right-8">

                  <p className="text-accent text-xs uppercase tracking-[0.2em] mb-4">
                    Knowledge • Memory • Craft
                  </p>

                  <h2 className="font-editorial text-4xl md:text-5xl text-white leading-tight max-w-md">
                    Where old knowledge meets new possibilities.
                  </h2>

                </div>

              </div>

              {/* Floating Archive Label */}

              <div className="absolute -bottom-6 -left-3 md:-left-8 bg-surface border border-border shadow-xl rounded-2xl p-5">

                <div className="flex items-center gap-3">

                  <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center">

                    <FiFeather className="text-primary text-xl" />

                  </div>

                  <div>

                    <p className="font-editorial text-lg">
                      Read. Think. Create.
                    </p>

                    <p className="text-xs text-muted mt-1">
                      The knowledge continues.
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* PHILOSOPHY SECTION */}

      <section
        id="philosophy"
        className="bg-primary text-white py-24 md:py-32"
      >

        <div className="max-w-7xl mx-auto px-5 md:px-8">

          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Philosophy Image */}

            <div className="relative h-[350px] md:h-[460px] rounded-3xl overflow-hidden">

              <img
                src="/images/hero/kevin-canlas-QYHehJ9Iovs-unsplash.jpg"
                alt="An open book representing the foundations of human knowledge"
                className="w-full h-full object-cover"
              />

              <div className="absolute inset-0 bg-black/30" />

              <div className="absolute bottom-7 left-7">

                <p className="text-accent text-xs uppercase tracking-[0.2em]">
                  The human element
                </p>

                <p className="font-editorial italic text-2xl mt-3">
                  Understanding is an art.
                </p>

              </div>

            </div>


            {/* Philosophy Content */}

            <div>

              <div className="flex items-center gap-3">

                <FiStar className="text-accent text-xl" />

                <p className="text-accent text-xs uppercase tracking-[0.25em]">
                  Why RootScroll exists
                </p>

              </div>

              <h2 className="font-editorial text-4xl md:text-5xl xl:text-6xl leading-tight mt-7">

                Before the prompt, there was the programmer.

              </h2>

              <p className="text-white/70 leading-8 mt-8">

                Technology continues to evolve, and artificial intelligence
                is changing how we build software.

                But the ability to think, understand, experiment and create
                remains fundamental.

              </p>

              <p className="text-white/70 leading-8 mt-5">

                RootScroll encourages us to preserve the knowledge and
                craftsmanship behind the code — one physical book at a time.

              </p>

              <div className="w-16 h-px bg-accent mt-9" />

              <p className="font-editorial italic text-xl mt-7 text-accent">

                The tools may change. The value of understanding remains.

              </p>

            </div>

          </div>

        </div>

      </section>


      {/* COLLECTIONS SECTION */}

      <section className="max-w-7xl mx-auto px-5 md:px-8 py-24 md:py-32">

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-14">

          <div className="max-w-2xl">

            <p className="text-accent text-xs uppercase tracking-[0.2em] font-semibold">
              Explore the archive
            </p>

            <h2 className="font-editorial text-4xl md:text-5xl mt-4">
              Five paths into the world of computing.
            </h2>

            <p className="text-muted leading-7 mt-5">
              From your first line of code to the history and philosophy
              of computing, find a collection that speaks to your curiosity.
            </p>

          </div>

          <Link
            href="/explore"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-4 transition-all"
          >
            Browse all books

            <FiArrowUpRight size={18} />

          </Link>

        </div>


        {/* Collection Cards */}

        <div className="grid sm:grid-cols-2 lg:grid-cols-6 gap-6">

          {collections.map((collection, index) => {

            const Icon = collection.icon;

            return (

              <Link
                href="/explore"
                key={collection.number}
                className={`group relative h-[390px] md:h-[430px] rounded-2xl overflow-hidden bg-surface border border-border ${
                  index === 0 || index === 3
                    ? "lg:col-span-3"
                    : "lg:col-span-3"
                }`}
              >

                {/* Collection Image */}

                <img
                  src={collection.image}
                  alt={collection.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Image Overlay */}

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/5 group-hover:from-black/95 transition-all duration-500" />


                {/* Collection Number */}

                <div className="absolute top-6 left-6 flex items-center gap-3">

                  <span className="text-white/70 text-xs tracking-widest">
                    COLLECTION {collection.number}
                  </span>

                  <span className="w-8 h-px bg-accent" />

                </div>


                {/* Collection Icon */}

                <div className="absolute top-6 right-6 w-11 h-11 rounded-full border border-white/30 bg-black/20 backdrop-blur-md flex items-center justify-center">

                  <Icon className="text-white text-xl" />

                </div>


                {/* Collection Content */}

                <div className="absolute bottom-0 left-0 right-0 p-7 md:p-9">

                  <p className="text-accent text-xs uppercase tracking-[0.2em] font-semibold">
                    {collection.label}
                  </p>

                  <h3 className="font-editorial text-3xl md:text-4xl text-white mt-3">
                    {collection.title}
                  </h3>

                  <p className="text-white/70 text-sm leading-7 mt-4 max-w-lg">
                    {collection.description}
                  </p>

                  <div className="flex items-center justify-between mt-7 pt-5 border-t border-white/20">

                    <span className="text-white text-sm font-medium">
                      Explore collection
                    </span>

                    <span className="w-10 h-10 rounded-full border border-white/40 flex items-center justify-center text-white group-hover:bg-white group-hover:text-primary transition-all">

                      <FiArrowUpRight size={19} />

                    </span>

                  </div>

                </div>

              </Link>

            );

          })}

        </div>

      </section>


      {/* FEATURED BOOKS */}

      <FeaturedBooks />


      {/* CLOSING CTA */}

      <section className="max-w-7xl mx-auto px-5 md:px-8 pb-24">

        <div className="relative overflow-hidden bg-primary rounded-[2rem] p-10 md:p-20 text-center">

          <div className="absolute top-0 right-0 w-72 h-72 rounded-full border border-white/10 -translate-y-1/2 translate-x-1/3" />

          <div className="absolute bottom-0 left-0 w-60 h-60 rounded-full border border-white/10 translate-y-1/2 -translate-x-1/3" />

          <div className="relative z-10 max-w-2xl mx-auto">

            <FiBookOpen className="text-accent text-3xl mx-auto mb-6" />

            <p className="text-accent text-xs uppercase tracking-[0.2em]">
              Your next discovery awaits
            </p>

            <h2 className="font-editorial text-4xl md:text-5xl text-white mt-5">
              Find something worth remembering.
            </h2>

            <p className="text-white/70 leading-7 mt-6">
              Explore the shelves, discover new perspectives and reconnect
              with the foundations of programming.
            </p>

            <Link
              href="/explore"
              className="inline-flex items-center gap-3 mt-9 px-8 py-4 rounded-full bg-white text-primary text-sm font-semibold hover:bg-accent hover:text-white transition"
            >
              Enter the Library

              <FiArrowUpRight size={18} />

            </Link>

          </div>

        </div>

      </section>

    </main>
  );
}