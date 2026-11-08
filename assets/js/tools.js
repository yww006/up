/**
 * UP - Daily Static Tools
 * Tools Rendering Module
 */

export function initTools() {
  renderFeaturedTool();
  renderAllTools();
  renderCategories();
  initCategoryFilter();
  initSortFilter();
}

/**
 * Render today's featured tool
 */
function renderFeaturedTool() {
  const { tools, getTodayToolIndex } = window.UP;
  if (!tools.length) return;

  const index = getTodayToolIndex();
  const tool = tools[index];
  window.UP.currentTool = tool;
  window.UP.currentDate = new Date();

  // Update featured tool card
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
    // Use a category-specific background
    elements.cardBg.style.backgroundImage = `url(${getCategoryBackground(tool.category)})`;
  }
}

/**
 * Render all tools grid
 */
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

  // Sort: featured first, then by name
  const sortedTools = [...tools].sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return a.name.localeCompare(b.name, 'zh-CN');
  });

  grid.innerHTML = sortedTools.map(tool => renderToolCard(tool)).join('');

  // Add click handlers for tool links
  grid.querySelectorAll('.tool-link').forEach(link => {
    link.addEventListener('click', (e) => {
      // Let default navigation happen
    });
  });
}

/**
 * Render a single tool card
 */
function renderToolCard(tool) {
  const isFeatured = tool.featured ? '⭐ ' : '';
  return `
    <article class="tool-card" role="listitem" data-tool-id="${tool.id}" data-category="${tool.category}">
      <div class="tool-card-bg-sm" style="background-image: url(${getCategoryBackground(tool.category)})" aria-hidden="true"></div>
      <div class="tool-card-content-sm">
        <div class="tool-card-header">
          <span class="tool-icon-sm" aria-hidden="true">${tool.icon}</span>
          <div class="tool-info">
            <h3 class="tool-name-sm">${isFeatured}${window.UP.escapeHtml(tool.name)}</h3>
            <span class="tool-category-sm">${window.UP.escapeHtml(tool.category)}</span>
          </div>
        </div>
        <p class="tool-desc-sm">${window.UP.escapeHtml(tool.description)}</p>
        <div class="tool-tags-sm" role="list" aria-label="${tool.name} 的标签">
          ${tool.tags.slice(0, 4).map(tag => `
            <span class="tool-tag-sm" role="listitem">${window.UP.escapeHtml(tag)}</span>
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

/**
 * Render categories grid
 */
function renderCategories() {
  const { tools, categories } = window.UP;
  const grid = document.getElementById('categoriesGrid');
  if (!grid) return;

  const categoryCounts = {};
  tools.forEach(tool => {
    categoryCounts[tool.category] = (categoryCounts[tool.category] || 0) + 1;
  });

  grid.innerHTML = categories.map(category => `
    <a href="#all" class="category-card" data-category="${category}" role="listitem">
      <span class="category-icon" aria-hidden="true">${getCategoryIcon(category)}</span>
      <h3 class="category-name">${window.UP.escapeHtml(category)}</h3>
      <span class="category-count">${categoryCounts[category] || 0} 个工具</span>
    </a>
  `).join('');

  // Add click handlers for category cards
  grid.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      const category = card.dataset.category;
      filterByCategory(category);
      // Scroll to tools section
      document.getElementById('all')?.scrollIntoView({ behavior: 'smooth' });
      // Update active nav
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      document.querySelector('.nav-link[data-tab="all"]')?.classList.add('active');
    });
  });
}

/**
 * Initialize category filter dropdown
 */
function initCategoryFilter() {
  const { categories } = window.UP;
  const select = document.getElementById('categoryFilter');
  if (!select) return;

  select.innerHTML = '<option value="">全部分类</option>' +
    categories.map(cat => `<option value="${window.UP.escapeHtml(cat)}">${window.UP.escapeHtml(cat)}</option>`).join('');

  select.addEventListener('change', (e) => {
    filterByCategory(e.target.value || null);
  });
}

/**
 * Initialize sort filter dropdown
 */
function initSortFilter() {
  const select = document.getElementById('sortFilter');
  if (!select) return;

  select.addEventListener('change', (e) => {
    sortTools(e.target.value);
  });
}

/**
 * Filter tools by category
 */
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

  // Update count
  const countEl = document.getElementById('toolCount');
  if (countEl) {
    const { tools } = window.UP;
    const total = category ? tools.filter(t => t.category === category).length : tools.length;
    countEl.textContent = `(${visibleCount} / ${total})`;
  }

  // Show empty state if no results
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

/**
 * Sort tools
 */
function sortTools(sortBy) {
  const { tools } = window.UP;
  const grid = document.getElementById('toolsGrid');
  if (!grid) return;

  let sorted = [...tools];

  switch (sortBy) {
    case 'name-asc':
      sorted.sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'));
      break;
    case 'name-desc':
      sorted.sort((a, b) => b.name.localeCompare(a.name, 'zh-CN'));
      break;
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

/**
 * Get category background image
 */
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

/**
 * Get category icon
 */
function getCategoryIcon(category) {
  const icons = {
    '设计': '🎨',
    '开发': '💻',
    '网络': '🌐',
    '安全': '🔒',
    '数据': '📊',
    '写作': '✍️',
    '运维': '⚙️',
    '性能': '🚀',
    '工具': '🔧',
    'SEO': '📈',
    '法律': '⚖️',
    '趣味': '🎮'
  };
  return icons[category] || '📦';
}

/**
 * Get tool by ID
 */
window.UP.getToolById = (id) => {
  return window.UP.tools.find(t => t.id === id);
};

/**
 * Render tool detail page (for individual tool pages)
 */
window.UP.renderToolDetail = (toolId) => {
  const tool = window.UP.getToolById(toolId);
  if (!tool) return null;

  return `
    <article class="tool-detail" role="main">
      <header class="tool-detail-header">
        <span class="tool-detail-category">${tool.category}</span>
        <h1 class="tool-detail-name">${tool.icon} ${tool.name}</h1>
        <p class="tool-detail-desc">${tool.description}</p>
        <div class="tool-detail-tags">
          ${tool.tags.map(tag => `<span class="tool-tag">${tag}</span>`).join('')}
        </div>
        <a href="${tool.url}" class="tool-cta" target="_blank" rel="noopener">
          立即使用 →
        </a>
      </header>
      <div class="tool-detail-content">
        <iframe src="${tool.url}" title="${tool.name}" sandbox="allow-scripts allow-same-origin allow-forms allow-popups" loading="lazy"></iframe>
      </div>
    </article>
  `;
};