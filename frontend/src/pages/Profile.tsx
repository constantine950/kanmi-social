import { useParams } from "react-router";

export default function Profile() {
  const { username } = useParams();

  return (
    <div className="min-h-screen bg-black text-stone-200 font-[Inter] px-6 md:px-14 pt-8">
      <h1 className="text-2xl md:text-3xl font-[Playfair_Display] mb-6">
        {username}'s Profile
      </h1>
      <div className="border border-stone-800 bg-stone-950 p-6 space-y-3">
        <p className="text-sm text-stone-400">
          Bio: This is a minimal profile for {username}.
        </p>
        <p className="text-sm text-stone-400">Posts: 12</p>
        <p className="text-sm text-stone-400">Followers: 48</p>
        <p className="text-sm text-stone-400">Following: 30</p>
      </div>
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="border border-stone-800 bg-stone-950 h-32 flex items-center justify-center text-stone-400 text-sm"
          >
            Post #{i + 1}
          </div>
        ))}
      </div>
    </div>
  );
}
