/**
 * UP - Daily Static Tools
 * Search Module
 */

export function initSearch() {
  const searchInput = document.getElementById('searchInput');
  if (!searchInput) return;

  // Debounced search
  const debouncedSearch = window.UP.debounce(performSearch, 200);

  searchInput.addEventListener('input', (e) => {
    debouncedSearch(e.target.value.trim());
  });

  // Clear search on Escape
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      searchInput.value = '';
      performSearch('');
      searchInput.blur();
    }
  });

  // Focus search on / key (when not in input)
  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement !== searchInput && !e.target.closest('input, textarea, [contenteditable]')) {
      e.preventDefault();
      searchInput.focus();
    }
  });
}

/**
 * Perform search across tools
 */
function performSearch(query) {
  const { tools } = window.UP;
  const grid = document.getElementById('toolsGrid');
  const countEl = document.getElementById('toolCount');
  const categoryFilter = document.getElementById('categoryFilter');

  if (!grid) return;

  // Reset category filter when searching
  if (categoryFilter) categoryFilter.value = '';

  if (!query) {
    // Show all tools
    renderAllTools();
    return;
  }

  const lowerQuery = query.toLowerCase();
  const results = tools.filter(tool => {
    const searchableText = [
      tool.name,
      tool.description,
      tool.category,
      ...tool.tags
    ].join(' ').toLowerCase();
    return searchableText.includes(lowerQuery);
  });

  // Render results
  grid.innerHTML = results.length
    ? results.map(tool => renderToolCard(tool, true, lowerQuery)).join('')
    : `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <div class="empty-icon">🔍</div>
        <h3>没有找到匹配的工具</h3>
        <p>尝试其他关键词，或 <button class="btn btn-ghost" onclick="document.getElementById('searchInput').value=''; performSearch('');">清空搜索</button></p>
      </div>
    `;

  // Update count
  if (countEl) {
    countEl.textContent = `(${results.length} / ${tools.length})`;
  }

  // Highlight matches in visible cards
  if (results.length) {
    highlightMatches(grid, lowerQuery);
  }
}

/**
 * Render tool card (shared with tools.js)
 */
function renderToolCard(tool, isSearchResult = false, highlightQuery = '') {
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

/**
 * Highlight matching text
 */
function highlightText(text, query) {
  if (!query) return window.UP.escapeHtml(text);
  const escaped = window.UP.escapeHtml(text);
  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escapedQuery})`, 'gi');
  return escaped.replace(regex, '<mark class="search-highlight">$1</mark>');
}

/**
 * Highlight matches in already rendered cards
 */
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
        if (highlighted !== window.UP.escapeHtml(text)) {
          el.innerHTML = highlighted;
        }
      }
    });
  });
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
 * Search tools programmatically (for external use)
 */
window.UP.searchTools = (query) => {
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.value = query;
    performSearch(query);
  }
};