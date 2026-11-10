const navLinks = [...document.querySelectorAll('.top-nav a[href^="#"]')];
const observedSections = navLinks
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

if ('IntersectionObserver' in window && observedSections.length) {
  const observer = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;

    navLinks.forEach((link) => {
      const isActive = link.getAttribute('href') === `#${visible.target.id}`;
      link.classList.toggle('active', isActive);
    });
  }, {
    rootMargin: '-20% 0px -60% 0px',
    threshold: [0, 0.15, 0.35, 0.6],
  });

  observedSections.forEach((section) => observer.observe(section));
}
