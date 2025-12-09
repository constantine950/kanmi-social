export default function Notifications() {
  return (
    <div className="min-h-screen bg-black text-stone-200 font-[Inter] px-6 md:px-14 pt-8">
      <h1 className="text-2xl md:text-3xl font-[Playfair_Display] mb-6">
        Notifications
      </h1>
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="border border-stone-800 bg-stone-950 p-3 text-sm text-stone-400"
          >
            Notification #{i} — Minimal content placeholder.
          </div>
        ))}
      </div>
    </div>
  );
}
