export default function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-black px-6 md:px-14 pt-10 animate-pulse">
      <div className="flex items-center gap-5 mb-10">
        <div className="w-24 h-24 bg-stone-800 rounded-full" />
        <div className="space-y-3">
          <div className="w-48 h-6 bg-stone-800" />
          <div className="w-64 h-4 bg-stone-800" />
        </div>
      </div>

      <div className="space-y-4 max-w-2xl">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-32 bg-stone-800" />
        ))}
      </div>
    </div>
  );
}
