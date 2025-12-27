import { Link } from "react-router";
import Footer from "../components/Footer";
import { features, mockPosts } from "../mockData/data";
import Feature from "../components/Feature";
import MockPost from "../components/MockPost";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-stone-200 font-[Inter] selection:bg-stone-800 selection:text-stone-200">
      <style>{`
        @keyframes noise {
          0%,100% { opacity: .12; }
          50% { opacity: .18; }
        }
      `}</style>

      {/* HERO */}
      <header className="px-6 md:px-14 pt-24 pb-24 border-b border-stone-900">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          {/* TEXT */}
          <div className="space-y-6">
            <h1 className="text-[2.9rem] md:text-[3.3rem] leading-[1.05] text-white tracking-tight font-[Playfair_Display]">
              Share. Connect.
              <br />
              Scroll in Silence.
            </h1>

            <p className="text-[13px] text-stone-400 max-w-sm leading-relaxed font-light">
              Kanmi reduces social noise to its purest form — elegant posts,
              quiet UI, and a distraction-free feed.
            </p>

            <div className="flex gap-3 pt-3">
              <Link
                to="/register"
                className="px-6 py-2.5 text-[11px] uppercase tracking-wider bg-white text-black border border-stone-900 hover:bg-stone-300 transition-all"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="px-6 py-2.5 text-[11px] uppercase tracking-wider text-white border border-stone-700 hover:bg-stone-900 transition-all"
              >
                Login
              </Link>
            </div>
          </div>

          {/* KANMI PREVIEW */}
          <div className="relative h-80 border border-stone-800 bg-stone-950 overflow-hidden">
            {/* DITHER */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle,rgba(255,255,255,0.07)_1px,transparent_1px)] bg-size-[9px_9px] animate-[noise_5s_infinite]" />

            {/* MOCK FEED */}
            <div className="relative h-full w-full p-4 text-stone-400 flex flex-col justify-between overflow-y-auto">
              <div className="text-[10px] font-mono uppercase tracking-wide mb-4">
                Kanmi — Preview
              </div>

              {/* POSTS */}
              <div className="space-y-3">
                {mockPosts.map((post) => (
                  <MockPost post={post} key={post.id} />
                ))}
              </div>

              {/* Small scrollbar indicator */}
              <div className="absolute right-2 top-6 h-[60%] w-0.5 bg-stone-700 rounded-full" />
            </div>
          </div>
        </div>
      </header>

      {/* FEATURES SECTION */}
      <section className="px-6 md:px-14 py-20">
        <div className="max-w-6xl mx-auto grid gap-4 md:grid-cols-4">
          {features.map((card, i) => (
            <Feature card={card} i={i} key={i} />
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
