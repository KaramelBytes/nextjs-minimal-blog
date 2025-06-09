/**
 * Fetches posts from the Bluesky social network.
 * Requires BLUESKY_HANDLE and BLUESKY_APP_PASSWORD environment variables.
 * 
 * @returns {Promise<Array<Object>>} Array of formatted Bluesky posts
 */
async function fetchBlueskyPosts() {
  const identifier = process.env.BLUESKY_HANDLE;      // e.g. "myhandle.bsky.social"
  const password = process.env.BLUESKY_APP_PASSWORD; // e.g. "app-password-xyz"

  if (!identifier || !password) {
    console.error("Missing Bluesky credentials in environment variables.");
    return [];
  }

  try {
    // 1. Log in to get your session token
    const sessionRes = await fetch("https://bsky.social/xrpc/com.atproto.server.createSession", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier, password }),
    });

    if (!sessionRes.ok) {
      console.error("Bluesky session creation failed:", sessionRes.statusText);
      return [];
    }

    const sessionData = await sessionRes.json();
    if (!sessionData?.accessJwt) {
      console.error("No accessJwt returned from Bluesky:", sessionData);
      return [];
    }

    // 2. Fetch your author feed
    const authorFeedUrl = `https://bsky.social/xrpc/app.bsky.feed.getAuthorFeed?actor=${encodeURIComponent(identifier)}`;
    const feedRes = await fetch(authorFeedUrl, {
      headers: {
        Authorization: `Bearer ${sessionData.accessJwt}`,
      },
    });

    if (!feedRes.ok) {
      console.error("Bluesky feed fetch failed:", feedRes.statusText);
      return [];
    }

    const feedData = await feedRes.json();
    const feedItems = feedData?.feed || [];

    // 3. Transform feed items into a common structure
    const posts = feedItems.map((item) => {
      const postId = item.post?.uri ?? item.post?.cid;
      const content = item.post?.record?.text ?? "";
      const timestamp = item.post?.record?.createdAt ?? "";

      // Collect all images in an array (in case a single post has multiple)
      let imageUrls = [];

      // A) Check if there's a single embed under record.embed
      //    (common in single-image posts)
      const singleEmbed = item.post?.record?.embed;
      if (singleEmbed?.images && Array.isArray(singleEmbed.images)) {
        singleEmbed.images.forEach((img) => {
          // Prefer full image if available, else thumb
          imageUrls.push(img.full || img.thumb);
        });
      }

      // B) Check if there's an array of embeds in post.embeds
      //    (could indicate multiple images or multiple embed types)
      const multipleEmbeds = item.post?.embeds;
      if (Array.isArray(multipleEmbeds) && multipleEmbeds.length > 0) {
        multipleEmbeds.forEach((embed) => {
          if (embed.images && Array.isArray(embed.images)) {
            embed.images.forEach((img) => {
              imageUrls.push(img.full || img.thumb);
            });
          }
        });
      }

      // Remove any null or undefined entries
      imageUrls = imageUrls.filter(Boolean);

      // Build a link to the post on bsky.app (example logic)
      let postUrl = null;
      const uri = item.post?.uri; // e.g. at://did:plc:abcdef1234/app.bsky.feed.post/XYZrkey
      if (uri && uri.startsWith("at://")) {
        const parts = uri.split("/");
        // e.g. parts = [ 'at:', '', 'did:plc:abcdef1234', 'app.bsky.feed.post', 'XYZrkey' ]
        const rkey = parts[4];
        postUrl = `https://bsky.app/profile/${identifier}/post/${rkey}`;
      }

      return {
        id: `bluesky-${postId}`,
        platform: "Bluesky",
        timestamp,
        content,
        imageUrls, // now an array (could be multiple images)
        postUrl,   // direct link to post on bsky.app
      };
    });

    return posts;
  } catch (error) {
    console.error("Error fetching Bluesky posts:", error);
    return [];
  }
}

/**
 * Fetches posts from a Pixelfed instance.
 * Requires PIXELFED_INSTANCE, PIXELFED_USER_ID, and PIXELFED_ACCESS_TOKEN environment variables.
 * 
 * @returns {Promise<Array<Object>>} Array of formatted Pixelfed posts
 */
async function fetchPixelfedPosts() {
  const instance = process.env.PIXELFED_INSTANCE;    // e.g. "https://pixelfed.social"
  const userId = process.env.PIXELFED_USER_ID;       // e.g. "12345"
  const token = process.env.PIXELFED_ACCESS_TOKEN;   // e.g. "abcdef123456"

  if (!instance || !userId || !token) {
    console.error("Missing Pixelfed credentials in environment variables.");
    return [];
  }

  try {
    // Example endpoint for user statuses
    //   GET /api/v1/accounts/:id/statuses?limit=10
    const url = `${instance}/api/v1/accounts/${userId}/statuses?limit=10`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.error("Pixelfed fetch failed:", response.statusText);
      return [];
    }

    const data = await response.json();
    if (!Array.isArray(data)) {
      console.error("Unexpected Pixelfed response:", data);
      return [];
    }

    const posts = data.map((status) => {
      // 'content' can be HTML; parse or strip if needed
      const content = status.content ?? "";

      // We'll grab only the first image, but you can adapt for multiple
      let imageUrl = null;
      if (status.media_attachments && status.media_attachments.length > 0) {
        imageUrl = status.media_attachments[0].url;
      }

      // Direct link to the post
      const postUrl = status.url;

      return {
        id: `pixelfed-${status.id}`,
        platform: "Pixelfed",
        timestamp: status.created_at,
        content,
        // Single image for now. To support multiple, store an array of 'imageUrls' similarly.
        imageUrl,
        postUrl,
      };
    });

    return posts;
  } catch (error) {
    console.error("Error fetching Pixelfed posts:", error);
    return [];
  }
}

/**
 * Fetches and combines posts from all configured social platforms.
 * Currently supports Bluesky and Pixelfed.
 * 
 * @returns {Promise<Array<Object>>} Combined and sorted array of social media posts
 */
export async function getAllSocialPosts() {
  const [bluesky, pixelfed] = await Promise.all([
    fetchBlueskyPosts(),
    fetchPixelfedPosts(),
  ]);

  // Merge the arrays
  const combined = [...bluesky, ...pixelfed];

  // Sort descending by timestamp (newest first)
  combined.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return combined;
}
