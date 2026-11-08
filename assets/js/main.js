/**
 * UP - Daily Static Tools
 * Main Entry Point
 */

import { initTheme } from './theme.js';
import { initTools } from './tools.js';
import { initSearch } from './search.js';

// Global state
window.UP = {
  tools: [],
  categories: [],
  currentTool: null,
  currentDate: null,
  init: false
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Load tools data
    await loadToolsData();

    // Initialize modules
    initTheme();
    initTools();
    initSearch();

    // Initialize random tool button
    initRandomTool();

    // Initialize background image rotation
    initBackgroundRotation();

    window.UP.init = true;
    console.log('[UP] Initialized successfully');
  } catch (error) {
    console.error('[UP] Initialization failed:', error);
    showErrorState();
  }
});

/**
 * Load tools data from JSON
 */
async function loadToolsData() {
  try {
    const response = await fetch('tools.json');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    window.UP.tools = data.tools || [];
    window.UP.categories = [...new Set(window.UP.tools.map(t => t.category))].sort();
    console.log(`[UP] Loaded ${window.UP.tools.length} tools in ${window.UP.categories.length} categories`);
  } catch (error) {
    console.error('[UP] Failed to load tools:', error);
    // Fallback to empty array
    window.UP.tools = [];
    window.UP.categories = [];
  }
}

/**
 * Initialize random tool button
 */
function initRandomTool() {
  const btn = document.getElementById('randomTool');
  if (!btn) return;

  btn.addEventListener('click', () => {
    if (window.UP.tools.length === 0) return;

    // Pick a random tool (excluding today's featured)
    const todayId = window.UP.currentTool?.id;
    const available = window.UP.tools.filter(t => t.id !== todayId);
    const randomTool = available[Math.floor(Math.random() * available.length)];

    if (randomTool) {
      // Navigate to tool or show in featured area
      window.location.href = randomTool.url;
    }
  });
}

/**
 * Initialize background image rotation
 */
function initBackgroundRotation() {
  const bgImage = document.getElementById('bgImage');
  if (!bgImage) return;

  // Curated Unsplash collections for backgrounds
  const backgrounds = [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80', // mountains
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1920&q=80', // forest
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1920&q=80', // ocean
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&q=80', // forest path
    'https://images.unsplash.com/photo-1504198458920-c5f3f7c9e7f3?w=1920&q=80', // lake
    'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=1920&q=80', // space
    'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?w=1920&q=80', // city night
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1920&q=80', // nature
    'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=1920&q=80', // sunrise
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1920&q=80', // misty forest
  ];

  let currentIndex = 0;

  // Set initial background
  setBackground(backgrounds[currentIndex]);

  // Rotate every 30 seconds
  setInterval(() => {
    currentIndex = (currentIndex + 1) % backgrounds.length;
    setBackground(backgrounds[currentIndex]);
  }, 30000);

  function setBackground(url) {
    // Preload
    const img = new Image();
    img.onload = () => {
      bgImage.style.backgroundImage = `url(${url})`;
    };
    img.src = url;
  }
}

/**
 * Show error state when initialization fails
 */
function showErrorState() {
  const heroContent = document.getElementById('heroContent');
  const toolsGrid = document.getElementById('toolsGrid');
  const categoriesGrid = document.getElementById('categoriesGrid');

  const errorHtml = `
    <div class="error-state" role="alert">
      <div class="error-icon">⚠️</div>
      <h3>加载失败</h3>
      <p>无法加载工具数据，请稍后刷新重试</p>
      <button class="btn btn-primary" onclick="location.reload()" style="margin-top: 16px;">重新加载</button>
    </div>
  `;

  if (heroContent) heroContent.innerHTML = errorHtml;
  if (toolsGrid) toolsGrid.innerHTML = errorHtml;
  if (categoriesGrid) categoriesGrid.innerHTML = '';
}

/**
 * Utility: Format date
 */
window.UP.formatDate = (date = new Date()) => {
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  });
};

/**
 * Utility: Get today's tool index (deterministic based on date)
 */
window.UP.getTodayToolIndex = () => {
  const today = new Date();
  const start = new Date(today.getFullYear(), 0, 0);
  const diff = today - start;
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  return dayOfYear % window.UP.tools.length;
};

/**
 * Utility: Debounce
 */
window.UP.debounce = (fn, delay = 250) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(null, args), delay);
  };
};

/**
 * Utility: Escape HTML
 */
window.UP.escapeHtml = (text) => {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};