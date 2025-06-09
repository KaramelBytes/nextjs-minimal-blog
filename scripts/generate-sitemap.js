const fs = require("fs");
const path = require("path");

/**
 * Configuration for sitemap generation.
 * Update the domain to match your production environment.
 * @type {Object}
 * @property {string} domain - Base URL of the website
 * @property {string[]} staticPages - Array of static page URLs to include
 */
const config = {
  domain: process.env.NEXT_PUBLIC_SITE_URL || "https://your-name.com",
  staticPages: ["", "about", "posts", "social"], // Relative paths to static pages
  defaultPriority: "0.7",
  homePagePriority: "1.0",
  changefreq: "weekly"
};

/**
 * Generates a sitemap.xml file for better SEO.
 * This script should be run during the build process.
 * 
 * @throws {Error} If there's an issue reading directories or writing the sitemap
 */
function generateSitemap() {
  try {
    // Ensure the domain ends with a single slash
    const baseUrl = config.domain.endsWith('/') 
      ? config.domain.slice(0, -1) 
      : config.domain;

    // Generate full URLs for static pages
    const staticUrls = config.staticPages.map(page => 
      page ? `${baseUrl}/${page}` : baseUrl
    );

    // Locate blog posts
    const postsDir = path.join(__dirname, "../posts");
    
    // Check if posts directory exists
    if (!fs.existsSync(postsDir)) {
      console.warn("⚠️  Posts directory not found. Only static pages will be included.");
      writeSitemap(staticUrls, []);
      return;
    }

    const postFiles = fs.readdirSync(postsDir).filter(file => file.endsWith(".md"));
    
    // Generate URLs for blog posts
    const postUrls = postFiles.map(file => {
      const slug = file.replace(/\.md$/, "");
      return `${baseUrl}/posts/${slug}`;
    });

    writeSitemap(staticUrls, postUrls);
    
  } catch (error) {
    console.error("❌ Error generating sitemap:", error);
    process.exit(1);
  }
}

/**
 * Writes the sitemap XML to the public directory.
 * 
 * @param {string[]} staticUrls - Array of static page URLs
 * @param {string[]} postUrls - Array of blog post URLs
 */
function writeSitemap(staticUrls, postUrls) {
  const allUrls = [...staticUrls, ...postUrls];
  
  // Generate XML content
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
  ${allUrls
    .map(url => `
  <url>
    <loc>${url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${config.changefreq}</changefreq>
    <priority>${url === config.domain ? config.homePagePriority : config.defaultPriority}</priority>
  </url>`)
    .join("")}
</urlset>`;

  // Ensure public directory exists
  const publicDir = path.join(__dirname, "../public");
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // Write sitemap file
  const sitemapPath = path.join(publicDir, "sitemap.xml");
  fs.writeFileSync(sitemapPath, sitemap);
  
  console.log(`✅ Sitemap generated successfully at: ${sitemapPath}`);
  console.log(`📊 Total URLs included: ${allUrls.length} (${staticUrls.length} static, ${postUrls.length} posts)`);
}

// Run the sitemap generation
generateSitemap();
