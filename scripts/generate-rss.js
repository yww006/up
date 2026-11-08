#!/usr/bin/env node
/**
 * Generate RSS feed for daily tools
 */

import fs from 'fs';
import path from 'path';

const TOOLS_FILE = path.join(process.cwd(), 'tools.json');
const OUTPUT_FILE = path.join(process.cwd(), 'feed.xml');
const SITE_URL = 'https://yww006.github.io/up';

function getTodayToolIndex() {
  const today = new Date();
  const start = new Date(today.getFullYear(), 0, 0);
  const diff = today - start;
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

function formatRFC822(date) {
  return date.toUTCString();
}

function formatISO(date) {
  return date.toISOString();
}

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

    if (!tools.length) {
      console.error('No tools found');
      process.exit(1);
    }

    const todayIndex = getTodayToolIndex();
    const items = [];

    // Generate items for last 30 days
    for (let i = 0; i < 30; i++) {
      const dayIndex = (todayIndex - i) % tools.length;
      if (dayIndex < 0) continue;

      const tool = tools[dayIndex];
      const toolDate = new Date();
      toolDate.setDate(toolDate.getDate() - i);
      toolDate.setHours(8, 0, 0, 0); // 8 AM Beijing time

      const itemUrl = `${SITE_URL}/${tool.url}`;
      const title = `${tool.icon} ${tool.name} — ${tool.category}`;

      items.push(`
    <item>
      <title>${escapeXml(title)}</title>
      <link>${itemUrl}</link>
      <guid isPermaLink="true">${itemUrl}</guid>
      <pubDate>${formatRFC822(toolDate)}</pubDate>
      <description><![CDATA[
        <p><strong>${escapeXml(tool.name)}</strong> (${escapeXml(tool.category)})</p>
        <p>${escapeXml(tool.description)}</p>
        <p>标签: ${tool.tags.map(t => escapeXml(t)).join(', ')}</p>
        <p><a href="${itemUrl}">立即使用 →</a></p>
      ]]></description>
      <category>${escapeXml(tool.category)}</category>
    </item>
      `);
    }

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
     xmlns:content="http://purl.org/rss/1.0/modules/content/"
     xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>UP - 每日一个静态工具</title>
    <link>${SITE_URL}</link>
    <description>每天推荐一个实用的在线静态工具，涵盖开发、设计、网络、数据、性能、法律等分类，提升工作效率</description>
    <language>zh-CN</language>
    <lastBuildDate>${formatRFC822(new Date())}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
    <generator>UP Daily Tools Generator</generator>
    <ttl>1440</ttl>
    ${items.join('\n')}
  </channel>
</rss>`;

    fs.writeFileSync(OUTPUT_FILE, rss);
    console.log(`✅ Generated feed.xml with ${items.length} items`);

  } catch (error) {
    console.error('❌ Failed to generate RSS:', error);
    process.exit(1);
  }
}

main();