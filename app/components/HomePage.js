"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import DynamicExcerpt from "./DynamicExcerpt";

/**
 * HomePage component that displays a paginated list of blog posts.
 * Implements infinite scroll using Intersection Observer for better UX.
 * 
 * @param {Object} props - Component props
 * @param {Array} props.initialPosts - Array of initial posts to display
 * @returns {JSX.Element} The rendered home page with posts list
 */
export default function HomePage({ initialPosts }) {
  const [posts, setPosts] = useState(initialPosts); // Stores loaded posts
  const [page, setPage] = useState(1); // Tracks current page
  const [loading, setLoading] = useState(false);
  const observer = useRef();
  const limit = 5; // Number of posts per page

  useEffect(() => {
    observer.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1 }
    );
    if (observer.current && document.querySelector("#loadMore")) {
      observer.current.observe(document.querySelector("#loadMore"));
    }
  }, []);

  useEffect(() => {
    if (page === 1) return; // Prevent reloading the first page
    async function loadMorePosts() {
      setLoading(true);
      const newPosts = initialPosts.slice(0, page * limit); // ✅ Simulate pagination
      setPosts(newPosts);
      setLoading(false);
    }
    loadMorePosts();
  }, [page, initialPosts]);

  return (
    <div className="py-12">
      {/* Header */}
      <header className="mb-16 text-center">
        <h1 className="text-4xl font-semibold text-gray-900 dark:text-gray-200 mb-4">Your Tagline</h1>
      </header>

      {/* Posts List */}
      <main className="max-w-2xl mx-auto px-6">
        {posts.map(({ id, title, date, excerpt, tags }) => (
          <article key={id} className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-200">
              <Link href={`/posts/${id}`}>{title}</Link>
            </h2>
            <time className="block text-gray-600 dark:text-gray-400 text-sm mb-2">{date}</time>

            {/* Display Tags */}
            {tags && tags.length > 0 && (
              <div className="mb-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-block bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 text-xs px-2 py-1 rounded-full mr-2"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* ✅ Excerpt now rendered only on the client */}
            <DynamicExcerpt excerpt={excerpt} />

            <Link href={`/posts/${id}`} className="text-blue-600 dark:text-blue-400 hover:underline mt-2 inline-block">
              Read more →
            </Link>
          </article>
        ))}
        <div id="loadMore" className="h-10"></div>
        {loading && <p>Loading more posts...</p>}
      </main>
    </div>
  );
}
