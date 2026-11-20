import openingPage from './opening.html?raw';
import homePage from './home.html?raw';
import dicePage from './dice.html?raw';
import coinPage from './coin.html?raw';
import cardsPage from './cards.html?raw';
import ballsPage from './balls.html?raw';
import quizPage from './quiz.html?raw';
import solverPage from './solver.html?raw';
import distributionsPage from './distributions.html?raw';
import continuousPage from './continuous.html?raw';
import learningPage from './learning.html?raw';
import guidePage from './guide.html?raw';

const pageTemplates = [
  homePage,
  dicePage,
  coinPage,
  cardsPage,
  ballsPage,
  quizPage,
  solverPage,
  distributionsPage,
  continuousPage,
  learningPage,
  guidePage,
];

export function renderPages() {
  const openingRoot = document.querySelector('#opening-page');
  const pageRoot = document.querySelector('#page-content');

  if (!openingRoot || !pageRoot) {
    throw new Error('Elemen untuk memuat halaman tidak ditemukan.');
  }

  openingRoot.innerHTML = openingPage;
  pageRoot.replaceChildren();

  for (const pageTemplate of pageTemplates) {
    const template = document.createElement('template');
    template.innerHTML = pageTemplate;

    template.content.querySelectorAll('style').forEach((style) => {
      // Route setup moves page sections out of the mount point.
      document.head.append(style);
    });

    pageRoot.append(template.content);
  }
}
