import { getPostData, getSortedPostsData } from "../../../lib/posts";
import Link from "next/link";

export async function generateStaticParams() {
  const posts = await getSortedPostsData();
  return posts.map((post) => ({ id: post.id.toString() }));
}

// ✅ Add SEO metadata support
export async function generateMetadata(props) {
  const params = await props.params;
  const id = await getId(params);
  if (!id) return {};

  try {
    const postData = await getPostData(id);

    return {
      title: postData.title,
      description: postData.excerpt || "Read this blog post on Your Tagline.",
      keywords: postData.tags ? postData.tags.join(", ") : "blog, article",
      authors: [{ name: "Your Name" }],

      // OpenGraph metadata
      openGraph: {
        title: postData.title,
        description: postData.excerpt || "Read this blog post on Your Tagline.",
        url: `https://your-name.com/posts/${id}`,
        type: "article",
        publishedTime: postData.date,
        images: postData.coverImage
          ? [{ url: postData.coverImage, width: 1200, height: 630, alt: postData.title }]
          : [],
      },

      // Twitter Card metadata
      twitter: {
        card: "summary_large_image",
        title: postData.title,
        description: postData.excerpt || "Read this blog post on Your Tagline.",
        images: postData.coverImage ? [postData.coverImage] : [],
      },
    };
  } catch {
    return {};
  }
}

export default async function Post(props) {
  const params = await props.params;
  // ✅ Ensure `params` is awaited correctly
  const id = await getId(params);

  if (!id) {
    return <p>Error: No Post ID Found</p>;
  }

  try {
    const postData = await getPostData(id); // Fetch post data

    return (
      <article className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-5xl font-semibold text-gray-900 dark:text-gray-200 leading-tight mb-6">
          {postData.title}
        </h1>

        <time className="block text-gray-600 dark:text-gray-400 text-sm mb-6">
          {postData.date}
        </time>

        <div
          className="max-w-2xl mx-auto px-6 py-12 text-gray-900 dark:text-gray-300 leading-relaxed space-y-6"
          dangerouslySetInnerHTML={{ __html: postData.contentHtml }}
        />

        <div className="mt-12 border-t border-gray-200 pt-8">
          <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline">
            ← Back to home
          </Link>
        </div>
      </article>
    );
  } catch (error) {
    return <p>Error loading post: {error.message}</p>;
  }
}

// ✅ Separate function to handle `params` resolution
async function getId(params) {
  if (!params || typeof params.id === "undefined") {
    return null; // Handle undefined case properly
  }
  return String(params.id); // Convert to string after ensuring it's defined
}
