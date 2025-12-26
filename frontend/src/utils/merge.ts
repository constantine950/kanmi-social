import type { Post } from "../types";

export const mergePosts = (existing: Post[], incoming: Post[]) => {
  const seen = new Set(existing.map((p) => p._id));
  return [...existing, ...incoming.filter((p) => !seen.has(p._id))];
};
