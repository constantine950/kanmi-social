export default function Messages() {
  return (
    <div className="min-h-screen bg-black text-stone-200 font-[Inter] px-6 md:px-14 pt-8">
      <h1 className="text-2xl md:text-3xl font-[Playfair_Display] mb-6">
        Messages
      </h1>
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="border border-stone-800 bg-stone-950 p-4 flex justify-between items-center"
          >
            <span className="text-sm text-stone-400">User #{i}</span>
            <span className="text-xs text-stone-500">2 new messages</span>
          </div>
        ))}
      </div>
    </div>
  );
}
