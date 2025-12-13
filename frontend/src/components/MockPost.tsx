import type { MockPostProp } from "../types";

export default function MockPost({ post }: MockPostProp) {
  return (
    <div
      key={post.id}
      className="relative bg-stone-900 border border-stone-800 p-2 flex flex-col gap-1"
    >
      <div className="flex justify-between items-center">
        <span className="text-[10px] font-mono text-stone-400">
          @{post.username}
        </span>
        <div className="flex gap-2">
          <div className="w-3 h-3 border border-stone-600 rounded-sm" />

          <div className="w-3 h-3 border border-stone-600 rounded-sm" />
        </div>
      </div>
      <p className="text-[11px] text-stone-300 font-light">{post.content}</p>
    </div>
  );
}
