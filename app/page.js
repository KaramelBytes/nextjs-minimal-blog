import { getSortedPostsData } from "../lib/posts";
import HomePage from "./components/HomePage";

/**
 * Generates metadata for the home page, including SEO and social media previews.
 * This function runs on the server side during build time.
 * 
 * @returns {Object} Metadata object containing SEO and social media information
 */
export async function generateMetadata() {
  return {
    title: "My Blog - A Minimalist Next.js Blog",
    description: "A clean, minimalist blog built with Next.js. Share your thoughts, stories, and experiences with the world.",
    keywords: "blog, next.js, minimal, clean, modern, web development",
    authors: [{ name: "Your Name" }],

    // OpenGraph Metadata (for social media preview)
    openGraph: {
      title: "My Blog - A Minimalist Next.js Blog",
      description: "A clean, minimalist blog built with Next.js. Share your thoughts, stories, and experiences with the world.",
      url: "https://yourblogurl.com",
      type: "website",
      images: [
        {
          url: "/og-home.png",
          width: 1200,
          height: 630,
          alt: "My Blog - A Minimalist Next.js Blog",
        },
      ],
    },

    // Twitter Card Metadata
    twitter: {
      card: "summary_large_image",
      title: "My Blog - A Minimalist Next.js Blog",
      description: "A clean, minimalist blog built with Next.js",
      images: ["/og-home.png"],
    },
  };
}

export default async function Page() {
  const initialPosts = await getSortedPostsData(); // ✅ Fetch posts on the server

  return <HomePage initialPosts={initialPosts} />;
}
