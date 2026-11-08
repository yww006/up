/**
 * UP - Daily Static Tools
 * Theme Management Module
 */

const THEME_KEY = 'up-theme';
const THEME_ATTR = 'data-theme';

export function initTheme() {
  const toggle = document.getElementById('themeToggle');
  if (!toggle) return;

  // Get saved theme or detect system preference
  const savedTheme = localStorage.getItem(THEME_KEY);
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (systemDark ? 'dark' : 'light');

  applyTheme(initialTheme);

  // Toggle button click
  toggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute(THEME_ATTR) || 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
    localStorage.setItem(THEME_KEY, newTheme);

    // Announce to screen readers
    announceThemeChange(newTheme);
  });

  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem(THEME_KEY)) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });
}

/**
 * Apply theme to document
 */
function applyTheme(theme) {
  document.documentElement.setAttribute(THEME_ATTR, theme);

  // Update toggle button icon
  const toggle = document.getElementById('themeToggle');
  if (toggle) {
    toggle.setAttribute('aria-label', theme === 'dark' ? '切换到浅色模式' : '切换到深色模式');
    toggle.setAttribute('title', theme === 'dark' ? '切换到浅色模式' : '切换到深色模式');
  }

  // Update meta theme-color
  updateMetaThemeColor(theme);

  // Dispatch custom event for other modules
  window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
}

/**
 * Update meta theme-color for browser UI
 */
function updateMetaThemeColor(theme) {
  let meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.name = 'theme-color';
    document.head.appendChild(meta);
  }
  meta.content = theme === 'dark' ? '#0f172a' : '#fafafa';
}

/**
 * Announce theme change to screen readers
 */
function announceThemeChange(theme) {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', 'polite');
  announcement.className = 'sr-only';
  announcement.textContent = `已切换到${theme === 'dark' ? '深色' : '浅色'}模式`;
  document.body.appendChild(announcement);
  setTimeout(() => announcement.remove(), 1000);
}

/**
 * Get current theme
 */
export function getCurrentTheme() {
  return document.documentElement.getAttribute(THEME_ATTR) || 'light';
}

/**
 * Check if dark mode
 */
export function isDarkMode() {
  return getCurrentTheme() === 'dark';
}

/**
 * Toggle theme programmatically
 */
export function toggleTheme() {
  const current = getCurrentTheme();
  const newTheme = current === 'dark' ? 'light' : 'dark';
  applyTheme(newTheme);
  localStorage.setItem(THEME_KEY, newTheme);
  return newTheme;
}