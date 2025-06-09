"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function TagFilter({ topTags }) {
  const searchParams = useSearchParams();
  const selectedTag = searchParams.get("tag") || null;

  return (
    <nav className="text-gray-600 flex flex-wrap sm:flex-row flex-col gap-2 sm:space-x-6 space-y-2 sm:space-y-0">
      {topTags.map((tag) => (
        <Link
          key={tag}
          href={`/?tag=${encodeURIComponent(tag)}`}
          className={`hover:text-black transition-colors px-2 py-1 rounded-md border border-gray-300 ${
            selectedTag === tag ? "font-bold text-black bg-gray-100" : ""
          }`}
        >
          #{tag}
        </Link>
      ))}
    </nav>
  );
}
