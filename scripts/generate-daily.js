#!/usr/bin/env node
/**
 * Generate daily tool data for GitHub Pages
 * Creates a JSON file with today's featured tool
 */

import fs from 'fs';
import path from 'path';

const TOOLS_FILE = path.join(process.cwd(), 'tools.json');
const OUTPUT_FILE = path.join(process.cwd(), 'daily-tool.json');

function getTodayToolIndex() {
  const today = new Date();
  const start = new Date(today.getFullYear(), 0, 0);
  const diff = today - start;
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  return dayOfYear;
}

function main() {
  try {
    // Load tools
    const toolsData = JSON.parse(fs.readFileSync(TOOLS_FILE, 'utf-8'));
    const tools = toolsData.tools || [];

    if (!tools.length) {
      console.error('No tools found in tools.json');
      process.exit(1);
    }

    // Get today's tool
    const index = getTodayToolIndex() % tools.length;
    const tool = tools[index];

    // Create daily tool data
    const dailyData = {
      date: new Date().toISOString().split('T')[0],
      dateFormatted: new Date().toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
      }),
      tool: {
        id: tool.id,
        name: tool.name,
        description: tool.description,
        category: tool.category,
        tags: tool.tags,
        icon: tool.icon,
        url: tool.url,
        featured: tool.featured
      },
      totalTools: tools.length,
      dayOfYear: getTodayToolIndex() + 1
    };

    // Write output
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(dailyData, null, 2));
    console.log(`✅ Generated daily-tool.json for ${dailyData.dateFormatted}`);
    console.log(`   Featured: ${tool.name} (${tool.category})`);

  } catch (error) {
    console.error('❌ Failed to generate daily tool:', error);
    process.exit(1);
  }
}

main();