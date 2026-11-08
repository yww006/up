#!/usr/bin/env node
/**
 * Generate sitemap.xml for SEO
 */

import fs from 'fs';
import path from 'path';

const TOOLS_FILE = path.join(process.cwd(), 'tools.json');
const OUTPUT_FILE = path.join(process.cwd(), 'sitemap.xml');
const SITE_URL = 'https://yww006.github.io/up';

function escapeXml(text) {
  return text
    .replace(/&/g, '&')
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/"/g, '"')
    .replace(/'/g, '&apos;');
}

function main() {
  try {
    // Load tools
    const toolsData = JSON.parse(fs.readFileSync(TOOLS_FILE, 'utf-8'));
    const tools = toolsData.tools || [];

    const today = new Date();
    const lastmod = today.toISOString().split('T')[0];

    // Static pages
    const staticUrls = [
      { url: SITE_URL, changefreq: 'daily', priority: '1.0' },
      { url: `${SITE_URL}/archive.html`, changefreq: 'daily', priority: '0.8' },
      { url: `${SITE_URL}/feed.xml`, changefreq: 'daily', priority: '0.5' },
    ];

    // Tool pages (if they exist as individual pages, otherwise link to external)
    const toolUrls = tools.map(tool => ({
      url: `${SITE_URL}/${tool.url}`,
      changefreq: 'weekly',
      priority: tool.featured ? '0.7' : '0.5',
      lastmod
    }));

    const allUrls = [...staticUrls, ...toolUrls];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  ${allUrls.map(page => `
  <url>
    <loc>${escapeXml(page.url)}</loc>
    <lastmod>${page.lastmod || lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    fs.writeFileSync(OUTPUT_FILE, sitemap);
    console.log(`✅ Generated sitemap.xml with ${allUrls.length} URLs`);

  } catch (error) {
    console.error('❌ Failed to generate sitemap:', error);
    process.exit(1);
  }
}

main();