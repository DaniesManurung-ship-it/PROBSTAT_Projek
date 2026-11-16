export function initBrandMotion() {
  const brandName = document.querySelector('.brand-name');
  if (!brandName) return;

  brandName.querySelectorAll('.brand-line').forEach((line) => {
    const text = line.textContent;
    const letters = [...text].map((letter, index) => {
      const span = document.createElement('span');
      span.className = 'brand-letter';
      span.textContent = letter;
      span.style.setProperty('--letter-index', String(index));
      return span;
    });

    line.replaceChildren(...letters);
  });
}
