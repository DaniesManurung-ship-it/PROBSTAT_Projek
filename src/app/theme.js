const STORAGE_KEY = 'probability-3d-theme';
const THEME_CHANGE_EVENT = 'probability-theme-change';

function updateTheme(theme) {
  const isDark = theme === 'dark';
  document.documentElement.dataset.theme = isDark ? 'dark' : 'light';
  document.querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', isDark ? '#0b1220' : '#f3fbf5');

  const toggle = document.querySelector('#theme-toggle');
  if (toggle) {
    const label = isDark ? 'Ganti ke mode terang' : 'Ganti ke mode gelap';
    toggle.setAttribute('aria-label', label);
    toggle.setAttribute('title', label);
    toggle.setAttribute('aria-pressed', String(isDark));
  }

  window.dispatchEvent(new CustomEvent(THEME_CHANGE_EVENT, {
    detail: { theme: isDark ? 'dark' : 'light' },
  }));
}

export function getSceneThemeColors() {
  const styles = getComputedStyle(document.documentElement);
  return {
    background: styles.getPropertyValue('--scene-background').trim(),
    fog: styles.getPropertyValue('--scene-background').trim(),
    floor: styles.getPropertyValue('--scene-floor').trim(),
    platform: styles.getPropertyValue('--scene-platform').trim(),
  };
}

export function subscribeToThemeChange(listener) {
  const handler = (event) => listener(event.detail.theme, getSceneThemeColors());
  window.addEventListener(THEME_CHANGE_EVENT, handler);
  return () => window.removeEventListener(THEME_CHANGE_EVENT, handler);
}

export function initTheme() {
  let savedTheme = 'light';
  try {
    const storedTheme = window.localStorage.getItem(STORAGE_KEY);
    if (storedTheme === 'light' || storedTheme === 'dark') savedTheme = storedTheme;
  } catch (error) {
    console.warn('Preferensi tema tidak dapat dibaca dari penyimpanan browser.', error);
  }

  updateTheme(savedTheme);

  const toggle = document.querySelector('#theme-toggle');
  if (!toggle) {
    console.error('Tombol pergantian tema #theme-toggle tidak ditemukan.');
    return;
  }

  toggle.addEventListener('click', () => {
    const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    try {
      window.localStorage.setItem(STORAGE_KEY, nextTheme);
    } catch (error) {
      console.warn('Preferensi tema tidak dapat disimpan di browser.', error);
    }
    updateTheme(nextTheme);
  });
}
