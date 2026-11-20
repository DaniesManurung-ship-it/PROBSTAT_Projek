const routes = [
  {
    id: 'home',
    label: 'Beranda',
    sectionIds: ['home', 'dashboard', 'home-lab', 'home-materials', 'home-guide'],
  },
  {
    id: 'dice',
    label: 'Dadu & Simulasi',
    sectionIds: ['lab', 'experiment'],
    hero: {
      eyebrow: 'LABORATORIUM & SIMULASI INTERAKTIF',
      title: 'Eksperimen Virtual &',
      emphasis: 'Probabilitas Dadu',
      description: 'Simulasikan pelemparan dadu 3D, petakan matriks ruang sampel, telusuri alur penalaran matematika, dan uji empiris hukum bilangan besar.',
      primaryLabel: 'Mulai Eksperimen Dadu',
      primaryTarget: 'lab',
      secondaryLabel: 'Simulasi Frekuensi',
      secondaryTarget: 'experiment',
    },
  },
  {
    id: 'coin',
    label: 'Koin',
    sectionIds: ['coin-lab'],
    hero: {
      variant: 'coin',
      eyebrow: '06 / EKSPERIMEN KOIN 3D',
      title: 'Jelajahi peluang dengan sampai 3 koin',
      description: 'Tentukan jumlah koin dan banyak sisi ANGKA yang dicari. Lihat peluang teoritisnya, lalu bandingkan dengan hasil pelemparan.',
      symbol: '🪙',
    },
  },
  {
    id: 'cards',
    label: 'Kartu',
    sectionIds: ['cards-lab'],
    hero: {
      eyebrow: 'LABORATORIUM & SIMULASI INTERAKTIF',
      title: 'Eksperimen Virtual &',
      emphasis: 'Probabilitas Kartu',
      description: 'Ambil kartu dari satu dek, telusuri peluang setiap kejadian, dan amati bagaimana hasil eksperimen berubah dari waktu ke waktu.',
      primaryLabel: 'Mulai Eksperimen Kartu',
      primaryTarget: 'cards-lab',
      secondaryLabel: 'Coba Eksperimen Bola',
      secondaryTarget: 'page-balls',
    },
  },
  {
    id: 'balls',
    label: 'Bola',
    sectionIds: ['balls-lab'],
    hero: {
      eyebrow: 'LABORATORIUM & SIMULASI INTERAKTIF',
      title: 'Eksperimen Virtual &',
      emphasis: 'Probabilitas Bola',
      description: 'Atur komposisi bola, pilih warna yang dicari, lalu amati peluang pengambilan melalui visualisasi dan simulasi interaktif.',
      primaryLabel: 'Mulai Eksperimen Bola',
      primaryTarget: 'balls-lab',
      secondaryLabel: 'Coba Eksperimen Kartu',
      secondaryTarget: 'page-cards',
    },
  },
  {
    id: 'solver',
    label: 'AI Solver',
    sectionIds: ['ai-solver', 'guided-learning'],
    hero: {
      variant: 'solver',
      eyebrow: '09 / INTELLIGENT PROBABILITY ENGINE',
      title: 'Biarkan Sistem',
      emphasis: 'Membantu Memahami',
      suffix: 'Soalmu',
      description: 'Masukkan soal peluang. Sistem akan menganalisis objek, menghitung probabilitas teoritis dengan rumus matematis, dan menyajikan diagram 2D sesuai soal.',
      badges: ['✦ AI Reasoning', 'Step-by-Step'],
    },
  },
  {
    id: 'quiz',
    label: 'Quiz & Evaluasi',
    sectionIds: ['quiz-system'],
    hero: {
      variant: 'quiz',
      eyebrow: '★ 10 / KNOWLEDGE ASSESSMENT',
      title: 'Uji Pemahaman',
      emphasis: 'Probabilitasmu',
      description: 'Kerjakan latihan, periksa pemahaman, dan pelajari setiap kesalahan melalui pembahasan analitis langkah demi langkah.',
      badges: ['🎯 Uji Mandiri', '⚡ 10 Soal Variatif'],
    },
  },
  {
    id: 'distributions',
    label: 'Distribusi Diskrit',
    sectionIds: ['distributions'],
    hero: {
      variant: 'distributions',
      eyebrow: 'KALKULATOR PROBABILITAS',
      title: 'Distribusi Diskrit',
      description: 'Pelajari konsep, rumus, dan komponen distribusi, lalu ubah parameternya untuk menghitung peluang sendiri.',
      symbol: 'P(x)',
    },
  },
  {
    id: 'continuous',
    label: 'Distribusi Kontinu',
    sectionIds: ['continuous-distributions'],
    hero: {
      eyebrow: 'KALKULATOR & EKSPLORASI STATISTIKA',
      title: 'Pahami Kurva &',
      emphasis: 'Distribusi Kontinu',
      description: 'Pelajari PDF dan CDF, pahami peluang sebagai luas di bawah kurva, serta coba kalkulator distribusi interaktif.',
      primaryLabel: 'Jelajahi Distribusi',
      primaryTarget: 'continuous-distributions',
      secondaryLabel: 'Pelajari Distribusi Diskrit',
      secondaryTarget: 'page-distributions',
    },
  },
  {
    id: 'learning',
    label: 'Materi',
    sectionIds: ['materials'],
    hero: {
      eyebrow: 'PETA BELAJAR INTERAKTIF',
      title: 'Bangun Dasar &',
      emphasis: 'Pahami Probabilitas',
      description: 'Jelajahi materi probabilitas dan statistika secara bertahap, coba kalkulator, serta pantau progres belajarmu.',
      primaryLabel: 'Cari Materi',
      primaryTarget: 'materials',
      secondaryLabel: 'Uji Pemahaman',
      secondaryTarget: 'page-quiz',
    },
  },
  {
    id: 'guide',
    label: 'Panduan',
    sectionIds: ['guide', 'how-it-works'],
    hero: {
      eyebrow: 'PANDUAN PENGGUNA',
      title: 'Mulai Belajar &',
      emphasis: 'Jelajahi Laboratorium',
      description: 'Kenali cara menggunakan eksperimen, visualisasi 3D, ruang sampel, dan pembahasan langkah demi langkah.',
      primaryLabel: 'Lihat Panduan',
      primaryTarget: 'guide',
      secondaryLabel: 'Mulai Eksperimen Dadu',
      secondaryTarget: 'page-dice',
    },
  },
];

function createRouteHero(route) {
  const { hero } = route;
  const section = document.createElement('section');
  section.className = `route-hero${hero.variant ? ` route-hero--${hero.variant}` : ''}`;
  section.setAttribute('aria-labelledby', `route-hero-${route.id}-title`);

  if (!hero.variant) {
    [
      { className: 'route-hero-doodle route-hero-doodle-left', text: '✦' },
      { className: 'route-hero-doodle route-hero-doodle-right', text: '✿' },
      { className: 'route-hero-doodle route-hero-doodle-spark', text: '✧' },
    ].forEach(({ className, text }) => {
      const doodle = document.createElement('span');
      doodle.className = className;
      doodle.setAttribute('aria-hidden', 'true');
      doodle.textContent = text;
      section.append(doodle);
    });
  }

  if (hero.symbol) {
    const symbol = document.createElement('span');
    symbol.className = 'route-hero-symbol';
    symbol.setAttribute('aria-hidden', 'true');
    symbol.textContent = hero.symbol;
    section.append(symbol);
  }

  const eyebrow = document.createElement('span');
  eyebrow.className = 'route-hero-eyebrow';
  eyebrow.textContent = hero.eyebrow;

  if (hero.badges?.length) {
    const badges = document.createElement('div');
    badges.className = 'route-hero-badges';
    hero.badges.forEach((text) => {
      const badge = document.createElement('span');
      badge.className = 'route-hero-badge';
      badge.textContent = text;
      badges.append(badge);
    });
    section.append(badges);
  }

  const title = document.createElement('h1');
  title.className = 'route-hero-title';
  title.id = `route-hero-${route.id}-title`;
  title.append(document.createTextNode(`${hero.title}${hero.emphasis ? ' ' : ''}`));
  if (hero.emphasis) {
    const emphasis = document.createElement('span');
    emphasis.className = 'route-hero-title-emphasis';
    emphasis.textContent = hero.emphasis;
    title.append(emphasis);
  }
  if (hero.suffix) {
    const suffix = document.createElement('span');
    suffix.className = 'route-hero-title-suffix';
    suffix.textContent = hero.suffix;
    title.append(suffix);
  }

  const description = document.createElement('p');
  description.className = 'route-hero-description';
  description.textContent = hero.description;

  section.append(eyebrow, title, description);
  if (hero.primaryTarget && hero.secondaryTarget) {
    const actions = document.createElement('div');
    actions.className = 'route-hero-actions';
    [
      { label: hero.primaryLabel, target: hero.primaryTarget, className: 'route-hero-button route-hero-button-primary' },
      { label: hero.secondaryLabel, target: hero.secondaryTarget, className: 'route-hero-button route-hero-button-secondary' },
    ].forEach(({ label, target, className }) => {
      const link = document.createElement('a');
      link.className = className;
      link.href = `#${target}`;
      link.textContent = label;
      actions.append(link);
    });
    section.append(actions);
  }
  return section;
}

const routeByTarget = new Map();
const pages = new Map();
const main = document.querySelector('.page-shell');
const navLinks = [...document.querySelectorAll('.top-nav [data-page-link]')];
const navMenuToggle = document.querySelector('#nav-menu-toggle');
const topbar = document.querySelector('.topbar');

if (main && navLinks.length) {
  function setNavMenuOpen(isOpen) {
    if (!navMenuToggle || !topbar) return;
    topbar.classList.toggle('is-menu-open', isOpen);
    navMenuToggle.setAttribute('aria-expanded', String(isOpen));
    navMenuToggle.setAttribute(
      'aria-label',
      isOpen ? 'Tutup navigasi utama' : 'Buka navigasi utama',
    );
  }

  navMenuToggle?.addEventListener('click', () => {
    setNavMenuOpen(navMenuToggle.getAttribute('aria-expanded') !== 'true');
  });
  navLinks.forEach((link) => link.addEventListener('click', () => setNavMenuOpen(false)));

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && navMenuToggle?.getAttribute('aria-expanded') === 'true') {
      setNavMenuOpen(false);
      navMenuToggle.focus();
    }
  });
  document.addEventListener('click', (event) => {
    if (
      event.target instanceof Node
      && topbar
      && !topbar.contains(event.target)
      && navMenuToggle?.getAttribute('aria-expanded') === 'true'
    ) {
      setNavMenuOpen(false);
    }
  });

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

  for (const route of routes) {
    if (route.hero) pages.get(route.id).prepend(createRouteHero(route));
  }

  const footer = main.querySelector(':scope > footer');
  if (footer) pages.get('home').appendChild(footer);
  /* Gunakan [...pages.values()] agar tidak duplikat meski ada route ID yang sama */
  main.replaceChildren(...[...pages.values()]);

  function getRouteFromHash() {
    const targetId = decodeURIComponent(window.location.hash.slice(1));
    return routeByTarget.get(targetId) ?? 'home';
  }

  function renderRoute({ scrollTarget = null } = {}) {
    const activeRoute = getRouteFromHash();
    document.documentElement.dataset.activePage = activeRoute;
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
    } else if (activeRoute === 'home') {
      window.scrollTo(0, 0);
    } else {
      document.querySelector('.topbar')?.scrollIntoView({ block: 'start' });
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

document.addEventListener('click', (event) => {
  if (!(event.target instanceof Element)) return;

  const spinButton = event.target.closest('#guide-spin-dice');
  if (spinButton) {
    const dice = document.getElementById('guide-demo-dice');
    if (!dice) return;
    const faces = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
    spinButton.disabled = true;
    dice.classList.add('is-spinning');
    window.setTimeout(() => {
      dice.textContent = faces[Math.floor(Math.random() * faces.length)];
      dice.classList.remove('is-spinning');
      spinButton.disabled = false;
    }, 350);
  }

  const matrixCell = event.target.closest('#guide-mini-matrix i');
  if (matrixCell) {
    document.querySelectorAll('#guide-mini-matrix i').forEach((cell) => {
      cell.classList.remove('is-selected');
    });
    matrixCell.classList.add('is-selected');
  }
});
