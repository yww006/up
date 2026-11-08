/**
 * UP - Daily Static Tools
 * Single-file non-module version for HTTP compatibility
 * Combines: main.js, theme.js, tools.js, search.js
 */

// ============================================================================
// Global State
// ============================================================================
window.UP = {
  tools: [],
  categories: [],
  currentTool: null,
  currentDate: null,
  init: false
};

// ============================================================================
// Utility Functions
// ============================================================================
window.UP.formatDate = function(date) {
  return (date || new Date()).toLocaleDateString('zh-CN', {
    year: 'numeric', month: 'long', day: 'numeric', weekday: 'long'
  });
};

window.UP.getTodayToolIndex = function() {
  const today = new Date();
  const start = new Date(today.getFullYear(), 0, 0);
  const diff = today - start;
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
};

window.UP.debounce = function(fn, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay || 250);
  };
};

window.UP.escapeHtml = function(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};

window.UP.searchTools = function(query) {
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.value = query;
    performSearch(query);
  }
};

// ============================================================================
// Theme Management
// ============================================================================
const THEME_KEY = 'up-theme';
const THEME_ATTR = 'data-theme';

function initTheme() {
  const toggle = document.getElementById('themeToggle');
  if (!toggle) return;

  const savedTheme = localStorage.getItem(THEME_KEY);
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (systemDark ? 'dark' : 'light');

  applyTheme(initialTheme);

  toggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute(THEME_ATTR) || 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
    localStorage.setItem(THEME_KEY, newTheme);
    announceThemeChange(newTheme);
  });

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem(THEME_KEY)) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });
}

function applyTheme(theme) {
  document.documentElement.setAttribute(THEME_ATTR, theme);
  const toggle = document.getElementById('themeToggle');
  if (toggle) {
    toggle.setAttribute('aria-label', theme === 'dark' ? '切换到浅色模式' : '切换到深色模式');
    toggle.setAttribute('title', theme === 'dark' ? '切换到浅色模式' : '切换到深色模式');
  }
  updateMetaThemeColor(theme);
  window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
}

function updateMetaThemeColor(theme) {
  let meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.name = 'theme-color';
    document.head.appendChild(meta);
  }
  meta.content = theme === 'dark' ? '#0f172a' : '#fafafa';
}

function announceThemeChange(theme) {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', 'polite');
  announcement.className = 'sr-only';
  announcement.textContent = `已切换到${theme === 'dark' ? '深色' : '浅色'}模式`;
  document.body.appendChild(announcement);
  setTimeout(() => announcement.remove(), 1000);
}

// ============================================================================
// Background Rotation
// ============================================================================
function initBackgroundRotation() {
  const bgImage = document.getElementById('bgImage');
  if (!bgImage) return;

  const backgrounds = [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1920&q=80',
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1920&q=80',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&q=80',
    'https://images.unsplash.com/photo-1504198458920-c5f3f7c9e7f3?w=1920&q=80',
    'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=1920&q=80',
    'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?w=1920&q=80',
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1920&q=80',
    'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=1920&q=80',
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1920&q=80',
  ];

  let currentIndex = 0;

  function setBackground(url) {
    const img = new Image();
    img.onload = () => { bgImage.style.backgroundImage = `url(${url})`; };
    img.src = url;
  }

  setBackground(backgrounds[currentIndex]);
  setInterval(() => {
    currentIndex = (currentIndex + 1) % backgrounds.length;
    setBackground(backgrounds[currentIndex]);
  }, 30000);
}

// ============================================================================
// Category Backgrounds & Icons
// ============================================================================
function getCategoryBackground(category) {
  const backgrounds = {
    '设计': 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=60',
    '开发': 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=60',
    '网络': 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=60',
    '安全': 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=60',
    '数据': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=60',
    '写作': 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=60',
    '运维': 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&q=60',
    '性能': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=60',
    '工具': 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=60',
    'SEO': 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=800&q=60',
    '法律': 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=60',
    '趣味': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=60'
  };
  return backgrounds[category] || backgrounds['开发'];
}

function getCategoryIcon(category) {
  const icons = {
    '设计': '🎨', '开发': '💻', '网络': '🌐', '安全': '🔒',
    '数据': '📊', '写作': '✍️', '运维': '⚙️', '性能': '🚀',
    '工具': '🔧', 'SEO': '📈', '法律': '⚖️', '趣味': '🎮'
  };
  return icons[category] || '📦';
}

// ============================================================================
// Tools Rendering
// ============================================================================
function renderFeaturedTool() {
  const { tools, getTodayToolIndex } = window.UP;
  if (!tools.length) return;

  const index = getTodayToolIndex() % tools.length;
  const tool = tools[index];
  window.UP.currentTool = tool;
  window.UP.currentDate = new Date();

  const elements = {
    category: document.getElementById('toolCategory'),
    date: document.getElementById('toolDate'),
    icon: document.getElementById('toolIcon'),
    name: document.getElementById('toolName'),
    desc: document.getElementById('toolDesc'),
    tags: document.getElementById('toolTags'),
    cta: document.getElementById('toolCta'),
    cardBg: document.querySelector('.tool-card.featured .tool-card-bg')
  };

  if (elements.category) elements.category.textContent = tool.category;
  if (elements.date) {
    elements.date.textContent = window.UP.formatDate(window.UP.currentDate);
    elements.date.dateTime = window.UP.currentDate.toISOString().split('T')[0];
  }
  if (elements.icon) elements.icon.textContent = tool.icon;
  if (elements.name) elements.name.textContent = tool.name;
  if (elements.desc) elements.desc.textContent = tool.description;
  if (elements.cta) {
    elements.cta.href = tool.url;
    elements.cta.setAttribute('aria-label', `打开 ${tool.name}`);
  }
  if (elements.tags) {
    elements.tags.innerHTML = tool.tags
      .map(tag => `<span class="tool-tag" role="listitem">${window.UP.escapeHtml(tag)}</span>`)
      .join('');
  }
  if (elements.cardBg) {
    elements.cardBg.style.backgroundImage = `url(${getCategoryBackground(tool.category)})`;
  }
}

function renderToolCard(tool, isSearchResult, highlightQuery) {
  const isFeatured = tool.featured ? '⭐ ' : '';
  const name = isSearchResult && highlightQuery ? highlightText(tool.name, highlightQuery) : window.UP.escapeHtml(tool.name);
  const desc = isSearchResult && highlightQuery ? highlightText(tool.description, highlightQuery) : window.UP.escapeHtml(tool.description);
  const category = window.UP.escapeHtml(tool.category);

  return `
    <article class="tool-card" role="listitem" data-tool-id="${tool.id}" data-category="${category}">
      <div class="tool-card-bg-sm" style="background-image: url(${getCategoryBackground(category)})" aria-hidden="true"></div>
      <div class="tool-card-content-sm">
        <div class="tool-card-header">
          <span class="tool-icon-sm" aria-hidden="true">${tool.icon}</span>
          <div class="tool-info">
            <h3 class="tool-name-sm">${isFeatured}${name}</h3>
            <span class="tool-category-sm">${category}</span>
          </div>
        </div>
        <p class="tool-desc-sm">${desc}</p>
        <div class="tool-tags-sm" role="list" aria-label="${tool.name} 的标签">
          ${tool.tags.slice(0, 4).map(tag => `
            <span class="tool-tag-sm" role="listitem">${isSearchResult && highlightQuery ? highlightText(tag, highlightQuery) : window.UP.escapeHtml(tag)}</span>
          `).join('')}
          ${tool.tags.length > 4 ? `<span class="tool-tag-sm">+${tool.tags.length - 4}</span>` : ''}
        </div>
        <div class="tool-card-footer">
          <a href="${tool.url}" class="tool-link" target="_blank" rel="noopener" aria-label="打开 ${tool.name}">
            <span>使用工具</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
        </div>
      </div>
    </article>
  `;
}

function renderAllTools() {
  const { tools } = window.UP;
  const grid = document.getElementById('toolsGrid');
  const countEl = document.getElementById('toolCount');
  if (!grid) return;

  if (countEl) countEl.textContent = `(${tools.length})`;

  if (!tools.length) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <div class="empty-icon">🔧</div>
        <h3>暂无工具数据</h3>
        <p>请检查 tools.json 是否正确加载</p>
      </div>
    `;
    return;
  }

  const sortedTools = [...tools].sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return a.name.localeCompare(b.name, 'zh-CN');
  });

  grid.innerHTML = sortedTools.map(tool => renderToolCard(tool)).join('');
}

function renderCategories() {
  const { tools, categories } = window.UP;
  const grid = document.getElementById('categoriesGrid');
  if (!grid) return;

  const categoryCounts = {};
  tools.forEach(tool => { categoryCounts[tool.category] = (categoryCounts[tool.category] || 0) + 1; });

  grid.innerHTML = categories.map(category => `
    <a href="#all" class="category-card" data-category="${category}" role="listitem">
      <span class="category-icon" aria-hidden="true">${getCategoryIcon(category)}</span>
      <h3 class="category-name">${window.UP.escapeHtml(category)}</h3>
      <span class="category-count">${categoryCounts[category] || 0} 个工具</span>
    </a>
  `).join('');

  grid.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      const category = card.dataset.category;
      filterByCategory(category);
      document.getElementById('all')?.scrollIntoView({ behavior: 'smooth' });
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      document.querySelector('.nav-link[data-tab="all"]')?.classList.add('active');
    });
  });
}

function initCategoryFilter() {
  const { categories } = window.UP;
  const select = document.getElementById('categoryFilter');
  if (!select) return;

  select.innerHTML = '<option value="">全部分类</option>' +
    categories.map(cat => `<option value="${window.UP.escapeHtml(cat)}">${window.UP.escapeHtml(cat)}</option>`).join('');

  select.addEventListener('change', (e) => { filterByCategory(e.target.value || null); });
}

function initSortFilter() {
  const select = document.getElementById('sortFilter');
  if (!select) return;
  select.addEventListener('change', (e) => { sortTools(e.target.value); });
}

function filterByCategory(category) {
  const grid = document.getElementById('toolsGrid');
  if (!grid) return;

  const cards = grid.querySelectorAll('.tool-card');
  let visibleCount = 0;

  cards.forEach(card => {
    const cardCategory = card.dataset.category;
    const shouldShow = !category || cardCategory === category;
    card.style.display = shouldShow ? 'flex' : 'none';
    if (shouldShow) visibleCount++;
  });

  const countEl = document.getElementById('toolCount');
  if (countEl) {
    const { tools } = window.UP;
    const total = category ? tools.filter(t => t.category === category).length : tools.length;
    countEl.textContent = `(${visibleCount} / ${total})`;
  }

  let emptyState = grid.querySelector('.empty-state');
  if (visibleCount === 0 && !emptyState) {
    emptyState = document.createElement('div');
    emptyState.className = 'empty-state';
    emptyState.style.gridColumn = '1 / -1';
    emptyState.innerHTML = `
      <div class="empty-icon">🔍</div>
      <h3>没有找到匹配的工具</h3>
      <p>尝试调整筛选条件或搜索关键词</p>
    `;
    grid.appendChild(emptyState);
  } else if (emptyState) {
    emptyState.remove();
  }
}

function sortTools(sortBy) {
  const { tools } = window.UP;
  const grid = document.getElementById('toolsGrid');
  if (!grid) return;

  let sorted = [...tools];
  switch (sortBy) {
    case 'name-asc':
      sorted.sort((a, b) => a.name.localeCompare(b.name, 'zh-CN')); break;
    case 'name-desc':
      sorted.sort((a, b) => b.name.localeCompare(a.name, 'zh-CN')); break;
    case 'category':
      sorted.sort((a, b) => {
        const catCompare = a.category.localeCompare(b.category, 'zh-CN');
        if (catCompare !== 0) return catCompare;
        return a.name.localeCompare(b.name, 'zh-CN');
      });
      break;
    case 'featured':
    default:
      sorted.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return a.name.localeCompare(b.name, 'zh-CN');
      });
  }
  grid.innerHTML = sorted.map(tool => renderToolCard(tool)).join('');
}

function highlightText(text, query) {
  if (!query) return window.UP.escapeHtml(text);
  const escaped = window.UP.escapeHtml(text);
  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escapedQuery})`, 'gi');
  return escaped.replace(regex, '<mark class="search-highlight">$1</mark>');
}

// ============================================================================
// Search
// ============================================================================
function initSearch() {
  const searchInput = document.getElementById('searchInput');
  if (!searchInput) return;

  const debouncedSearch = window.UP.debounce(performSearch, 200);

  searchInput.addEventListener('input', (e) => { debouncedSearch(e.target.value.trim()); });

  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      searchInput.value = '';
      performSearch('');
      searchInput.blur();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement !== searchInput && !e.target.closest('input, textarea, [contenteditable]')) {
      e.preventDefault();
      searchInput.focus();
    }
  });
}

function performSearch(query) {
  const { tools } = window.UP;
  const grid = document.getElementById('toolsGrid');
  const countEl = document.getElementById('toolCount');
  const categoryFilter = document.getElementById('categoryFilter');

  if (!grid) return;

  if (categoryFilter) categoryFilter.value = '';

  if (!query) {
    renderAllTools();
    return;
  }

  const lowerQuery = query.toLowerCase();
  const results = tools.filter(tool => {
    const searchableText = [tool.name, tool.description, tool.category, ...tool.tags].join(' ').toLowerCase();
    return searchableText.includes(lowerQuery);
  });

  grid.innerHTML = results.length
    ? results.map(tool => renderToolCard(tool, true, lowerQuery)).join('')
    : `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <div class="empty-icon">🔍</div>
        <h3>没有找到匹配的工具</h3>
        <p>尝试其他关键词，或 <button class="btn btn-ghost" onclick="document.getElementById('searchInput').value=''; performSearch('');">清空搜索</button></p>
      </div>
    `;

  if (countEl) { countEl.textContent = `(${results.length} / ${tools.length})`; }

  if (results.length) { highlightMatches(grid, lowerQuery); }
}

function highlightMatches(grid, query) {
  const cards = grid.querySelectorAll('.tool-card');
  cards.forEach(card => {
    const nameEl = card.querySelector('.tool-name-sm');
    const descEl = card.querySelector('.tool-desc-sm');
    const tags = card.querySelectorAll('.tool-tag-sm');
    [nameEl, descEl, ...tags].forEach(el => {
      if (el && !el.querySelector('.search-highlight')) {
        const text = el.textContent;
        const highlighted = highlightText(text, query);
        if (highlighted !== window.UP.escapeHtml(text)) { el.innerHTML = highlighted; }
      }
    });
  });
}

// ============================================================================
// Random Tool Button
// ============================================================================
function initRandomTool() {
  const btn = document.getElementById('randomTool');
  if (!btn) return;
  btn.addEventListener('click', () => {
    if (window.UP.tools.length === 0) return;
    const todayId = window.UP.currentTool?.id;
    const available = window.UP.tools.filter(t => t.id !== todayId);
    const randomTool = available[Math.floor(Math.random() * available.length)];
    if (randomTool) { window.location.href = randomTool.url; }
  });
}

// ============================================================================
// Error State
// ============================================================================
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

// ============================================================================
// Load Tools Data
// ============================================================================
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
    window.UP.tools = [];
    window.UP.categories = [];
  }
}

// ============================================================================
// Main Initialization
// ============================================================================
document.addEventListener('DOMContentLoaded', async () => {
  try {
    await loadToolsData();
    initTheme();
    initBackgroundRotation();
    renderFeaturedTool();
    renderAllTools();
    renderCategories();
    initCategoryFilter();
    initSortFilter();
    initSearch();
    initRandomTool();
    window.UP.init = true;
    console.log('[UP] Initialized successfully');
  } catch (error) {
    console.error('[UP] Initialization failed:', error);
    showErrorState();
  }
});