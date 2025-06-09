"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function AllPostsPage({ initialPosts }) {
  const [posts, setPosts] = useState(initialPosts);
  const [filteredPosts, setFilteredPosts] = useState(initialPosts);
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [tag, setTag] = useState("");

  // Extract unique years, months, and tags from posts
  const years = Array.from(new Set(posts.map((post) => post.year))).sort((a, b) => b - a);
  const months = Array.from(new Set(posts.map((post) => post.month)));
  const tags = Array.from(new Set(posts.flatMap((post) => post.tags || [])));

  // Filter posts dynamically
  useEffect(() => {
    let filtered = posts;

    if (year) {
      filtered = filtered.filter((post) => post.year.toString() === year);
    }
    if (month) {
      filtered = filtered.filter((post) => post.month === month);
    }
    if (tag) {
      filtered = filtered.filter((post) => post.tags && post.tags.includes(tag));
    }

    setFilteredPosts(filtered);
  }, [year, month, tag]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Dropdown Filters */}
      <div className="flex flex-wrap sm:flex-row flex-col gap-4 mb-4">
        <select 
          value={year} 
          onChange={(e) => setYear(e.target.value)} 
          className="border p-2 rounded-md bg-white dark:bg-gray-800 text-black dark:text-white"
        >
          <option value="">Year</option>
          {years.map((yr) => (
            <option key={`year-${yr}`} value={yr}>{yr}</option>
          ))}
        </select>
        
        <select 
          value={month} 
          onChange={(e) => setMonth(e.target.value)} 
          className="border p-2 rounded-md bg-white dark:bg-gray-800 text-black dark:text-white"
        >
          <option value="">Month</option>
          {months.map((m) => (
            <option key={`month-${m}`} value={m}>{m}</option>
          ))}
        </select>
        
        <select 
          value={tag} 
          onChange={(e) => setTag(e.target.value)} 
          className="border p-2 rounded-md bg-white dark:bg-gray-800 text-black dark:text-white"
        >
          <option value="">Tag</option>
          {tags.map((t) => (
            <option key={`tag-${t}`} value={t}>{t}</option>
          ))}
        </select>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPosts.map((post) => (
          <Link 
            key={post.id}  // ✅ Ensured unique key for posts
            href={`/posts/${post.id}`} 
            className="border p-4 rounded-md shadow-md post-card transition"
          >
            <h2 className="text-lg font-bold">{post.title}</h2>
            <p className="text-sm text-gray-600">{post.date}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
