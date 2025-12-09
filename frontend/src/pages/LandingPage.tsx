const mockPosts = [
  {
    id: 1,
    username: "jane_doe",
    content: "Just discovered this amazing coffee spot ☕️",
  },
  {
    id: 2,
    username: "alex_92",
    content: "Minimal design makes life cleaner ✨",
  },
  {
    id: 3,
    username: "kanmi_team",
    content: "Welcome to Kanmi! Share your moments silently.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-stone-200 font-[Inter] selection:bg-stone-800 selection:text-stone-200">
      {/* FONT */}
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />

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
              <a
                href="/register"
                className="px-6 py-2.5 text-[11px] uppercase tracking-wider bg-white text-black border border-stone-900 hover:bg-stone-300 transition-all"
              >
                Get Started
              </a>
              <a
                href="/login"
                className="px-6 py-2.5 text-[11px] uppercase tracking-wider text-white border border-stone-700 hover:bg-stone-900 transition-all"
              >
                Login
              </a>
            </div>
          </div>

          {/* KANMI PREVIEW */}
          <div className="relative h-80 border border-stone-800 bg-stone-950 overflow-hidden">
            {/* DITHER */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle,rgba(255,255,255,0.07)_1px,transparent_1px)] bg-[size:9px_9px] animate-[noise_5s_infinite]" />

            {/* MOCK FEED */}
            <div className="relative h-full w-full p-4 text-stone-400 flex flex-col justify-between overflow-y-auto">
              <div className="text-[10px] font-mono uppercase tracking-wide mb-4">
                Kanmi — Preview
              </div>

              {/* POSTS */}
              <div className="space-y-3">
                {mockPosts.map((post) => (
                  <div
                    key={post.id}
                    className="relative bg-stone-900 border border-stone-800 p-2 flex flex-col gap-1"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-mono text-stone-400">
                        @{post.username}
                      </span>
                      <div className="flex gap-2">
                        <div className="w-3 h-3 border border-stone-600 rounded-sm" />{" "}
                        {/* heart */}
                        <div className="w-3 h-3 border border-stone-600 rounded-sm" />{" "}
                        {/* comment */}
                      </div>
                    </div>
                    <p className="text-[11px] text-stone-300 font-light">
                      {post.content}
                    </p>
                  </div>
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
          {[
            {
              title: "Pure Posting",
              text: "No clutter. Just clean, crisp sharing.",
            },
            {
              title: "Direct Messaging",
              text: "Fast, sharp, modern chat style.",
            },
            {
              title: "Smart Discovery",
              text: "See more of what matters — less noise.",
            },
            {
              title: "Minimal Profiles",
              text: "Your identity, clean and beautifully structured.",
            },
          ].map((card, i) => (
            <div
              key={i}
              className="border border-stone-800 bg-stone-950 p-6 relative"
            >
              {/* Dither overlay */}
              <div className="absolute inset-0 opacity-[0.08] bg-[radial-gradient(circle,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:8px_8px]" />

              <div className="relative space-y-2">
                <h3 className="text-[13px] font-[Playfair_Display] tracking-tight text-white">
                  {card.title}
                </h3>
                <p className="text-[11px] text-stone-400 leading-relaxed font-light">
                  {card.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="px-6 md:px-14 pb-12 text-center text-[11px] text-stone-500 border-t border-stone-900 font-light">
        © 2025 Kanmi. Build quietly.
      </footer>
    </div>
  );
}
