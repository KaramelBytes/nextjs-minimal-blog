import Link from "next/link";

export function generateMetadata() {
  return {
    title: "About - My Blog",
    description: "Learn more about this blog and its author. Discover the story behind the content and what you can expect to find here.",
    
    openGraph: {
      title: "About - My Blog",
      description: "Get to know more about this blog and its purpose. Discover the story behind the content.",
      url: "https://yourblogurl.com/about",
      siteName: "My Blog",
      images: [
        {
          url: "/og-home.png",
          width: 1200,
          height: 630,
          alt: "About My Blog",
        },
      ],
      type: "website",
    },

    twitter: {
      card: "summary_large_image",
      title: "About - My Blog",
      description: "Learn more about this blog and its author. Discover the story behind the content.",
      images: ["/og-home.png"],
    },
  };
}

export default function About() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      {/* Title */}
      <h1 className="text-4xl font-light mb-8">About This Blog</h1>

      {/* Content */}
      <div className="prose prose-lg max-w-none">
        <p className="mb-6">
          Welcome to <strong>My Blog</strong>, a place where I share my thoughts, experiences, and knowledge on various topics that interest me. This blog was created as a way to document my journey and share what I learn along the way.
        </p>
      </div>

      {/* Contact Section */}
      <div className="mt-8 border-t pt-8">
        <h2 className="text-xl font-light mb-4">Get In Touch</h2>
        <p className="mb-4">
          I'd love to hear from you! Whether you have questions, feedback, or just want to say hello, feel free to reach out through any of these channels:
        </p>
        <ul className="space-y-3">
          <li>
            <a
              href="https://twitter.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Twitter: @yourusername
            </a>
          </li>
          <li>
            <a
              href="https://github.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              GitHub: yourusername
            </a>
          </li>
          <li>
            <a
              href="mailto:your.email@example.com"
              className="text-blue-600 hover:underline"
            >
              Email: your.email@example.com
            </a>
          </li>
        </ul>
      </div>

      {/* Links */}
      <div className="mt-12 border-t pt-8 text-sm">
        <Link href="/">← Back to Home</Link>
        <Link href="/posts/my-first-post" className="ml-6">
          Read My First Post →
        </Link>
        </div>
      </div>
  );
}
