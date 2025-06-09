import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import remarkGfm from "remark-gfm";
import remarkEmbedder from "@remark-embedder/core";
import oembedTransformer from "@remark-embedder/transformer-oembed";

// Directory where markdown blog posts are stored
const postsDirectory = path.join(process.cwd(), "posts");

/**
 * Retrieves and sorts all blog posts from the filesystem.
 * Extracts metadata and generates excerpts for each post.
 * 
 * @returns {Array<Object>} Array of post objects sorted by date (newest first)
 */
export function getSortedPostsData() {
  const fileNames = fs.readdirSync(postsDirectory);
  const markdownFiles = fileNames.filter((fileName) => fileName.endsWith(".md"));

  const allPostsData = markdownFiles.map((fileName) => {
    const id = fileName.replace(/\.md$/, "");
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    const postDate = new Date(data.date);
    const year = postDate.getFullYear();
    const month = postDate.toLocaleString("default", { month: "long" });

    const tags = data.tags || [];

    let excerpt = "";
    if (data.excerpt) {
      excerpt = data.excerpt; // Use the front matter excerpt if available
    } else {
      excerpt = content.split("\n").filter((line) => line.trim() !== "")[0]; // First non-empty line
    }

    return {
      id,
      title: data.title,
      date: data.date,
      year,      
      month,     
      tags,
      excerpt,      
    };
  });

  return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1));
}

/**
 * Fetches and processes a single blog post by its ID.
 * Converts markdown to HTML and handles embedded content.
 * 
 * @param {string} id - The ID of the post to fetch (filename without .md extension)
 * @returns {Promise<Object>} Processed post data including HTML content
 * @throws {Error} If the post ID is invalid or post is not found
 */
export async function getPostData(id) {
  if (!id || typeof id !== "string") {
    throw new Error("Invalid post ID");
  }

  const fullPath = path.join(postsDirectory, `${id}.md`);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Post not found: ${id}`);
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");
  
  // ✅ Correctly extracts `data` and `content` before using them
  const { data, content } = matter(fileContents);

  try {
    const processedContent = await remark()
      .use(remarkGfm)
      .use(remarkEmbedder, { transformers: [oembedTransformer] })
      .use(html, { sanitize: false }) // ✅ Allows YouTube embeds by preventing iframe removal
      .process(content);

    console.log("\n✅ Processed Markdown Output (before HTML conversion):\n", processedContent.value); // Log raw result

    return {
      id,
      contentHtml: processedContent.toString(),
      title: data.title,
      date: data.date,
      year: data.year,
      month: data.month,
      tags: data.tags || [],
    };
  } catch (error) {
    console.error("❌ Error processing post content:", error);

    // Fallback processing without embedding
    const fallbackProcessedContent = await remark()
      .use(remarkGfm)
      .use(html, { sanitize: false }) // ✅ Ensures fallback also allows embeds
      .process(content);

    return {
      id,
      contentHtml: fallbackProcessedContent.toString(),
      title: data.title,
      date: data.date,
      year: data.year,
      month: data.month,
      tags: data.tags || [],
    };
  }
}
