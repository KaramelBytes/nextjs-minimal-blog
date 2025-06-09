
import { getSortedPostsData } from "../../../lib/posts";

/**
 * API route handler for fetching paginated blog posts.
 * Supports pagination via the 'page' query parameter.
 * 
 * @param {Request} req - The incoming request object
 * @returns {Response} JSON response containing:
 *   - posts: Array of post objects for the requested page
 *   - total: Total number of posts available
 *   - currentPage: Current page number
 *   - totalPages: Total number of pages available
 * @throws {Response} Returns 400 response for invalid page parameter
 */
export async function GET(req) {
  // Parse and validate page parameter
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = 5; // Number of posts per load
  
  // Validate page parameter
  if (isNaN(page) || page < 1) {
    return new Response(
      JSON.stringify({ 
        error: 'Invalid page parameter. Page must be a positive integer.' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  try {
    const allPosts = await getSortedPostsData();
    const totalPosts = allPosts.length;
    const totalPages = Math.ceil(totalPosts / limit);
    
    // Handle page number larger than total pages
    if (page > totalPages && totalPages > 0) {
      return new Response(
        JSON.stringify({ 
          error: 'Page out of range',
          totalPages,
          currentPage: page
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const startIndex = (page - 1) * limit;
    const paginatedPosts = allPosts.slice(startIndex, startIndex + limit);

    return Response.json({ 
      posts: paginatedPosts,
      total: totalPosts,
      currentPage: page,
      totalPages
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
