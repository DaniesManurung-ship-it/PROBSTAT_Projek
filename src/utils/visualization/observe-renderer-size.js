export function observeRendererSize(container, renderer, camera) {
  function resize() {
    const { width, height } = container.getBoundingClientRect();
    if (width < 1 || height < 1) return;

    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    if (renderer.getPixelRatio() !== pixelRatio) {
      renderer.setPixelRatio(pixelRatio);
    }

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(Math.round(width), Math.round(height), false);
  }

  const observer = new ResizeObserver(resize);
  observer.observe(container);
  window.addEventListener('resize', resize);
  resize();

  return () => {
    observer.disconnect();
    window.removeEventListener('resize', resize);
  };
}
