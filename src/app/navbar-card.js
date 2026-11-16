export function initNavbarCard() {
  const topbar = document.querySelector('.topbar');
  const content = document.querySelector('#topbar-content');
  const toggle = document.querySelector('.topbar-card-toggle');
  const openingStage = document.querySelector('#opening-stage');
  if (!topbar || !content || !toggle) {
    console.error('Elemen kartu navbar tidak ditemukan.');
    return;
  }

  const scrollThreshold = 12;
  let expandedByClick = false;
  let previousScrollY = window.scrollY;
  let expansionTimer = 0;

  function setCollapsed(collapsed) {
    topbar.classList.toggle('is-collapsed', collapsed);
    content.inert = collapsed;
    toggle.inert = !collapsed;
    toggle.setAttribute('aria-hidden', String(!collapsed));
    if (collapsed && content.contains(document.activeElement)) {
      toggle.focus({ preventScroll: true });
    }
  }

  function handleScroll() {
    const scrollY = window.scrollY;
    if (scrollY <= scrollThreshold) {
      expandedByClick = false;
    } else if (expandedByClick && scrollY > previousScrollY) {
      expandedByClick = false;
    }

    setCollapsed(scrollY > scrollThreshold && !expandedByClick);
    previousScrollY = scrollY;
  }

  function expandNavbar() {
    if (!topbar.classList.contains('is-collapsed')) return;

    expandedByClick = true;
    topbar.classList.add('is-expanding');
    setCollapsed(false);
    content.querySelector('.brand')?.focus({ preventScroll: true });
    window.clearTimeout(expansionTimer);
    expansionTimer = window.setTimeout(() => {
      topbar.classList.remove('is-expanding');
      expansionTimer = 0;
    }, 750);
  }

  function handleWheel(event) {
    if (event.deltaY <= 0 || (openingStage && !openingStage.hidden)) return;
    expandedByClick = false;
    setCollapsed(true);
  }

  toggle.addEventListener('click', expandNavbar);
  window.addEventListener('scroll', handleScroll, { passive: true });
  window.addEventListener('wheel', handleWheel, { passive: true });
  handleScroll();

  window.addEventListener('pagehide', () => {
    toggle.removeEventListener('click', expandNavbar);
    window.removeEventListener('scroll', handleScroll);
    window.removeEventListener('wheel', handleWheel);
    if (expansionTimer) window.clearTimeout(expansionTimer);
  }, { once: true });
}
