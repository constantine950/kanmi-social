export default function Explore() {
  return (
    <div className="min-h-screen bg-black text-stone-200 font-[Inter] px-6 md:px-14 pt-8">
      <h1 className="text-2xl md:text-3xl font-[Playfair_Display] mb-6">
        Explore
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="border border-stone-800 bg-stone-950 h-32 flex items-center justify-center text-stone-400 text-sm"
          >
            Trend #{i + 1}
          </div>
        ))}
      </div>
    </div>
  );
}
