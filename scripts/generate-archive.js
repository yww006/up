#!/usr/bin/env node
/**
 * Generate archive page with all historical daily tools
 */

import fs from 'fs';
import path from 'path';

const TOOLS_FILE = path.join(process.cwd(), 'tools.json');
const OUTPUT_FILE = path.join(process.cwd(), 'archive.html');
const TEMPLATE_FILE = path.join(process.cwd(), 'index.html');

function getTodayToolIndex() {
  const today = new Date();
  const start = new Date(today.getFullYear(), 0, 0);
  const diff = today - start;
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

function formatDate(date) {
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  });
}

function getCategoryIcon(category) {
  const icons = {
    '设计': '🎨', '开发': '💻', '网络': '🌐', '安全': '🔒',
    '数据': '📊', '写作': '✍️', '运维': '⚙️', '性能': '🚀',
    '工具': '🔧', 'SEO': '📈', '法律': '⚖️', '趣味': '🎮'
  };
  return icons[category] || '📦';
}

function getCategoryBackground(category) {
  const backgrounds = {
    '设计': 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&q=60',
    '开发': 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&q=60',
    '网络': 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&q=60',
    '安全': 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&q=60',
    '数据': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=60',
    '写作': 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&q=60',
    '运维': 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=400&q=60',
    '性能': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=60',
    '工具': 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&q=60',
    'SEO': 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=400&q=60',
    '法律': 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&q=60',
    '趣味': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=60'
  };
  return backgrounds[category] || backgrounds['开发'];
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&')
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/"/g, '"')
    .replace(/'/g, '&#039;');
}

function generateArchiveCards(tools) {
  const todayIndex = getTodayToolIndex();
  const cards = [];

  // Generate cards for the last 365 days (or all tools if fewer)
  const daysToShow = Math.min(365, tools.length * 2);

  for (let i = 0; i < daysToShow; i++) {
    const dayIndex = (todayIndex - i) % tools.length;
    if (dayIndex < 0) continue; // Skip future days

    const tool = tools[dayIndex];
    const toolDate = new Date();
    toolDate.setDate(toolDate.getDate() - i);

    cards.push(`
      <article class="archive-card" data-date="${toolDate.toISOString().split('T')[0]}">
        <div class="archive-card-bg" style="background-image: url(${getCategoryBackground(tool.category)})" aria-hidden="true"></div>
        <div class="archive-card-content">
          <div class="archive-card-header">
            <time class="archive-date" datetime="${toolDate.toISOString().split('T')[0]}">${formatDate(toolDate)}</time>
            <span class="archive-category" style="background: var(--color-primary-light); color: var(--color-primary);">${tool.category}</span>
          </div>
          <div class="archive-card-body">
            <span class="archive-icon" aria-hidden="true">${tool.icon}</span>
            <div>
              <h3 class="archive-name">${escapeHtml(tool.name)}</h3>
              <p class="archive-desc">${escapeHtml(tool.description)}</p>
            </div>
          </div>
          <div class="archive-tags">
            ${tool.tags.slice(0, 3).map(tag => `<span class="archive-tag">${escapeHtml(tag)}</span>`).join('')}
          </div>
          <a href="${tool.url}" class="archive-link" target="_blank" rel="noopener">使用工具 →</a>
        </div>
      </article>
    `);
  }

  return cards.join('\n');
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

    // Load template
    let template = fs.readFileSync(TEMPLATE_FILE, 'utf-8');

    // Generate archive content
    const archiveCards = generateArchiveCards(tools);
    const stats = `
      <div class="archive-stats">
        <div class="stat">
          <span class="stat-value">${tools.length}</span>
          <span class="stat-label">总工具数</span>
        </div>
        <div class="stat">
          <span class="stat-value">${Math.min(365, tools.length * 2)}</span>
          <span class="stat-label">历史记录</span>
        </div>
        <div class="stat">
          <span class="stat-value">${new Set(tools.map(t => t.category)).size}</span>
          <span class="stat-label">分类数</span>
        </div>
      </div>
    `;

    // Replace hero content with archive
    const archiveHtml = `
      <section class="hero archive-hero">
        <div class="container">
          <header class="archive-header">
            <h1>历史归档</h1>
            <p>浏览过往每日推荐的工具</p>
          </header>
          ${stats}
        </div>
      </section>
      <section class="section archive-section">
        <div class="container">
          <div class="archive-grid" role="list" aria-label="历史工具列表">
            ${archiveCards}
          </div>
        </div>
      </section>
    `;

    // Replace the hero section and everything after until footer
    const heroStart = template.indexOf('<section class="hero"');
    const footerStart = template.indexOf('<footer class="footer"');

    const newHtml = template.slice(0, heroStart) + archiveHtml + template.slice(footerStart);

    // Write archive page
    fs.writeFileSync(OUTPUT_FILE, newHtml);
    const daysShown = Math.min(365, tools.length * 2);
    console.log(`✅ Generated archive.html with ${daysShown} historical entries`);

  } catch (error) {
    console.error('❌ Failed to generate archive:', error);
    process.exit(1);
  }
}

main();