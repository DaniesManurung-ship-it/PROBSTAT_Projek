const routes = [
  {
    id: 'home',
    label: 'Beranda',
    sectionIds: ['home', 'dashboard'],
  },
  {
    id: 'dice',
    label: 'Dadu & Simulasi',
    sectionIds: ['lab', 'experiment'],
  },
  {
    id: 'coin',
    label: 'Koin',
    sectionIds: ['coin-lab'],
  },
  {
    id: 'cards',
    label: 'Kartu',
    sectionIds: ['cards-lab'],
  },
  {
    id: 'balls',
    label: 'Bola',
    sectionIds: ['balls-lab'],
  },
  {
    id: 'solver',
    label: 'AI Solver',
    sectionIds: ['ai-solver', 'guided-learning'],
  },
  {
    id: 'quiz',
    label: 'Quiz & Evaluasi',
    sectionIds: ['quiz-system'],
  },
  {
    id: 'distributions',
    label: 'Distribusi Diskrit',
    sectionIds: ['distributions'],
  },
  {
    id: 'continuous',
    label: 'Distribusi Kontinu',
    sectionIds: ['continuous-distributions'],
  },
  {
    id: 'learning',
    label: 'Materi & Panduan',
    sectionIds: ['materials', 'guide', 'how-it-works'],
  },
];

const routeByTarget = new Map();
const pages = new Map();
const main = document.querySelector('.page-shell');
const navLinks = [...document.querySelectorAll('.top-nav [data-page-link]')];

if (main && navLinks.length) {
  for (const route of routes) {
    /* Jika route ID sudah ada (duplikat), tambahkan sectionIds ke page yang sudah ada */
    if (!pages.has(route.id)) {
      const page = document.createElement('div');
      page.className = 'route-page';
      page.id = `page-${route.id}`;
      page.dataset.page = route.id;
      page.setAttribute('aria-label', route.label);
      page.hidden = route.id !== 'home';
      pages.set(route.id, page);
      routeByTarget.set(page.id, route.id);
    }

    const page = pages.get(route.id);
    route.sectionIds.forEach((sectionId) => {
      const section = document.getElementById(sectionId);
      if (section) {
        page.appendChild(section);
        routeByTarget.set(sectionId, route.id);
      }
    });
  }

  const footer = main.querySelector(':scope > footer');
  if (footer) pages.get('learning').appendChild(footer);
  /* Gunakan [...pages.values()] agar tidak duplikat meski ada route ID yang sama */
  main.replaceChildren(...[...pages.values()]);

  function getRouteFromHash() {
    const targetId = decodeURIComponent(window.location.hash.slice(1));
    return routeByTarget.get(targetId) ?? 'home';
  }

  function renderRoute({ scrollTarget = null } = {}) {
    const activeRoute = getRouteFromHash();
    for (const [routeId, page] of pages) {
      page.hidden = routeId !== activeRoute;
    }

    navLinks.forEach((link) => {
      const isActive = link.dataset.pageLink === activeRoute;
      link.classList.toggle('active', isActive);
      if (isActive) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });

    if (scrollTarget) {
      requestAnimationFrame(() => {
        document.getElementById(scrollTarget)?.scrollIntoView({ block: 'start' });
      });
    } else {
      window.scrollTo(0, 0);
    }
  }

  document.addEventListener('click', (event) => {
    const link = event.target instanceof Element
      ? event.target.closest('a[href^="#"]')
      : null;
    if (!link) return;

    const targetId = decodeURIComponent(link.getAttribute('href').slice(1));
    const routeId = routeByTarget.get(targetId);
    if (!routeId) return;

    event.preventDefault();
    const hash = `#${targetId}`;
    if (window.location.hash === hash) {
      renderRoute({ scrollTarget: targetId.startsWith('page-') ? null : targetId });
      return;
    }

    window.history.pushState(null, '', hash);
    renderRoute({ scrollTarget: targetId.startsWith('page-') ? null : targetId });
  });

  window.addEventListener('popstate', () => renderRoute());
  window.addEventListener('hashchange', () => renderRoute());
  renderRoute();
}
