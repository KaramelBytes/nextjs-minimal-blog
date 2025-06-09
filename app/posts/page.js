import { getSortedPostsData } from "../../lib/posts";
import AllPostsPage from "../components/AllPostsPage";

export async function generateMetadata() {
  const allPostsData = await getSortedPostsData();

  return {
    title: "All Blog Posts - Your Name",
    description: "Your site description here",
    keywords: "Your keywords here",
    authors: [{ name: "Your Name" }],

    // OpenGraph Metadata
    openGraph: {
      title: "All Blog Posts - Your Name",
      description: "Browse all posts from Your Name about life",
      url: "https://your-name.com/posts",
      type: "website",
      images: [
        {
          url: "/og-home.png", // ✅ Ensure this image exists in /public
          width: 1200,
          height: 630,
          alt: "All Blog Posts - Your Name",
        },
      ],
    },

    // Twitter Card Metadata
    twitter: {
      card: "summary_large_image",
      title: "All Blog Posts - Your Name",
      description: "Read all posts from Your Name, covering life",
      images: ["/og-home.png"], // ✅ Ensure this image exists in /public
    },

    // JSON-LD Structured Data
    other: {
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "All Blog Posts - Your Name",
        "description": "Explore all blog posts from Your Name.",
        "url": "https://your-name.com/posts",
        "hasPart": allPostsData.map(post => ({
          "@type": "BlogPosting",
          "headline": post.title,
          "url": `https://your-name.com/posts/${post.id}`,
          "datePublished": post.date
        }))
      }
    }
  };
}


export default async function Page() {
  const allPostsData = await getSortedPostsData(); // ✅ Runs on the server

  return <AllPostsPage initialPosts={allPostsData} />;
}
