import { useParams } from "react-router";

export default function Post() {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-black text-stone-200 font-[Inter] px-6 md:px-14 pt-8">
      <h1 className="text-2xl md:text-3xl font-[Playfair_Display] mb-6">
        Post #{id}
      </h1>
      <div className="border border-stone-800 bg-stone-950 p-6">
        <p className="text-sm text-stone-400">
          This is the content of post #{id}. Minimalist layout with clean
          spacing.
        </p>
      </div>
    </div>
  );
}
