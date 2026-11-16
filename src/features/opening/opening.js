const stage = document.querySelector('#opening-stage');

if (stage) {
  const screen = stage.querySelector('.opening-screen');
  const artwork = stage.querySelector('.opening-art');
  const scrollButton = stage.querySelector('.opening-scroll');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let progress = 0;
  let pointerX = 0;
  let pointerY = 0;
  let frame = 0;
  let finishTimer = 0;
  let transitionStarted = false;
  let openingFinished = false;

  window.history.scrollRestoration = 'manual';
  if (window.location.hash) {
    window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
  }

  function render() {
    frame = 0;
    if (reduceMotion.matches) {
      [
        '--opening-title-y',
        '--opening-title-x',
        '--opening-title-scale',
        '--opening-title-opacity',
        '--opening-art-y',
        '--opening-art-scale',
        '--opening-art-opacity',
        '--opening-background-opacity',
        '--opening-card-opacity',
        '--opening-card-y',
        '--opening-card-rotation',
        '--opening-card-tilt',
        '--opening-scroll-opacity',
      ].forEach((property) => stage.style.removeProperty(property));
      artwork.style.removeProperty('--opening-pointer-x');
      return;
    }

    const clamp = (value) => Math.min(1, Math.max(0, value));
    const cardEntrance = clamp((progress - 0.12) / 0.2);
    const cardRotation = clamp((progress - 0.08) / 0.9);

    stage.style.setProperty('--opening-title-y', `${-progress * 92 + pointerY * -5}px`);
    stage.style.setProperty('--opening-title-x', `${pointerX * -6}px`);
    stage.style.setProperty('--opening-title-scale', String(1 - progress * 0.1));
    stage.style.setProperty('--opening-title-opacity', String(Math.max(0, 1 - Math.max(0, progress - 0.32) * 1.48)));
    stage.style.setProperty('--opening-art-y', `${progress * 115 + pointerY * 13}px`);
    stage.style.setProperty('--opening-art-scale', String(1 - progress * 0.055));
    stage.style.setProperty('--opening-art-opacity', String(Math.max(0.05, 1 - progress * 0.94)));
    stage.style.setProperty('--opening-background-opacity', String(1 - progress * 0.72));
    stage.style.setProperty('--opening-card-opacity', String(cardEntrance));
    stage.style.setProperty('--opening-card-y', `${(1 - cardEntrance) * 120}px`);
    stage.style.setProperty('--opening-card-rotation', `${cardRotation * 360}deg`);
    stage.style.setProperty('--opening-card-tilt', `${8 * (1 - cardEntrance)}deg`);
    stage.style.setProperty('--opening-scroll-opacity', String(1 - clamp(progress / 0.16)));
    artwork.style.setProperty('--opening-pointer-x', `${pointerX * 15}px`);
  }

  function scheduleRender() {
    if (!frame) frame = window.requestAnimationFrame(render);
  }

  function updateProgress() {
    if (openingFinished || transitionStarted) return;
    const stageRect = stage.getBoundingClientRect();
    const scrollDistance = stage.offsetHeight - window.innerHeight;
    progress = scrollDistance > 0
      ? Math.min(1, Math.max(0, -stageRect.top / scrollDistance))
      : 1;
    scheduleRender();

    if (stageRect.bottom <= 0 || (!reduceMotion.matches && progress >= 0.985)) beginHomeTransition();
  }

  function beginHomeTransition() {
    if (transitionStarted || openingFinished) return;
    transitionStarted = true;
    render();
    stage.inert = true;
    stage.setAttribute('aria-hidden', 'true');
    stage.classList.add('is-entering-home');
    window.scrollTo({ top: 0, behavior: 'instant' });
    finishTimer = window.setTimeout(finishOpening, reduceMotion.matches ? 0 : 1500);
  }

  function finishOpening() {
    if (openingFinished) return;
    openingFinished = true;
    stage.hidden = true;
    finishTimer = 0;
  }

  function handlePointerMove(event) {
    if (reduceMotion.matches || event.pointerType !== 'mouse') return;
    pointerX = (event.clientX / window.innerWidth - 0.5) * 2;
    pointerY = (event.clientY / window.innerHeight - 0.5) * 2;
    scheduleRender();
  }

  function resetPointer() {
    pointerX = 0;
    pointerY = 0;
    scheduleRender();
  }

  function scrollToHome() {
    const scrollDistance = reduceMotion.matches
      ? stage.offsetHeight
      : stage.offsetHeight - window.innerHeight;
    const target = Math.max(0, window.scrollY + stage.getBoundingClientRect().top + scrollDistance);
    window.scrollTo({ top: target, behavior: reduceMotion.matches ? 'auto' : 'smooth' });
  }

  function resetOpeningScroll() {
    if (window.location.hash) {
      window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress, { passive: true });
  screen.addEventListener('pointermove', handlePointerMove, { passive: true });
  screen.addEventListener('pointerleave', resetPointer);
  scrollButton.addEventListener('click', scrollToHome);
  resetOpeningScroll();
  window.addEventListener('pagehide', () => {
    window.removeEventListener('scroll', updateProgress);
    window.removeEventListener('resize', updateProgress);
    screen.removeEventListener('pointermove', handlePointerMove);
    screen.removeEventListener('pointerleave', resetPointer);
    scrollButton.removeEventListener('click', scrollToHome);
    if (finishTimer) window.clearTimeout(finishTimer);
  }, { once: true });

  updateProgress();
} else {
  console.error('Opening page tidak dapat dimulai: #opening-stage tidak ditemukan.');
}
