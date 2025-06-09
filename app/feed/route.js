import { getSortedPostsData } from '../../lib/posts';
export const revalidate = 86400  
export async function GET() {
  const posts = await getSortedPostsData();
  const siteUrl = process.env.SITE_URL || 'http://localhost:3000';

  const rssFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Your Tagline</title>
    <description>"Join Your Name Here"</description>
    <link>${siteUrl}</link>
    <atom:link href="${siteUrl}/feed" rel="self" type="application/rss+xml" />
    ${posts.map(post => `
      <item>
        <title>${post.title}</title>
        <description>${post.excerpt}</description>
        <link>${siteUrl}/posts/${post.id}</link>
        <guid isPermaLink="true">${siteUrl}/posts/${post.id}</guid>
        <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      </item>
    `).join('')}
  </channel>
</rss>`;

  return new Response(rssFeed, {
    headers: {
      'Content-Type': 'application/rss+xml',
    },
  });
}