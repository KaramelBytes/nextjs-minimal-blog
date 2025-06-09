// app/social/page.js

import Link from "next/link";
import { getAllSocialPosts } from "../../lib/fetchSocialPosts";

// Revalidate every 3 hours (10800 seconds) to reduce API calls
export const revalidate = 10800;

export function generateMetadata() {
  return {
    title: "Social Feed - Your Name",
    description: "Check out the latest posts from Your Name on Bluesky and Pixelfed.",
    openGraph: {
      title: "Social Feed - Your Name",
      description: "Stay updated with Your Name's most recent social posts on Bluesky and Pixelfed.",
      url: "https://your-name.com/social",
      siteName: "Your Name",
      images: [
        {
          url: "/og-img.png",
          width: 1200,
          height: 630,
          alt: "Social Feed - Your Name",
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Social Feed - Your Name",
      description: "Follow Your Name's social updates on Bluesky and Pixelfed.",
      images: ["/og-img.png"],
    },
  };
}

export default async function Social() {
  const posts = await getAllSocialPosts();

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-light mb-8">Social Feed</h1>

      <div className="prose prose-lg max-w-none mb-8">
        <p>
          Welcome to my Social Feed! Below, you&apos;ll find my latest posts 
          from <strong>Bluesky</strong> and <strong>Pixelfed</strong> in
          chronological order. Click &quot;View on [Platform]&quot; to go directly to the post.
        </p>
      </div>

      {posts.length === 0 ? (
        <p>No recent posts found.</p>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <div key={post.id} className="border rounded-md p-4">
              <h2 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">
                {post.platform}
              </h2>

              {/* Text Content */}
              <p className="mb-2">{post.content}</p>

              {/* If Bluesky post has multiple images, map them. Otherwise, if it's Pixelfed, show single imageUrl. */}
              {post.imageUrls && post.imageUrls.length > 0 ? (
                <div className="space-y-2 mt-2 mb-2">
                  {post.imageUrls.map((src, idx) => (
                    <img
                      key={idx}
                      src={src}
                      alt=""
                      className="max-w-full h-auto rounded-md"
                    />
                  ))}
                </div>
              ) : post.imageUrl ? (
                <img
                  src={post.imageUrl}
                  alt=""
                  className="max-w-full h-auto rounded-md mt-2 mb-2"
                />
              ) : null}

              {/* Timestamp */}
              <p className="text-xs text-gray-500">
                Posted on: {new Date(post.timestamp).toLocaleString()}
              </p>

              {/* Link to the original post, if available */}
              {post.postUrl && (
                <a
                  href={post.postUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline inline-block mt-2"
                >
                  View on {post.platform}
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="mt-12 border-t pt-8 text-sm">
        <Link href="/">← Back to Home</Link>
        <Link href="/about" className="ml-6">
          About Jeremiah →
        </Link>
      </div>
    </div>
  );
}
