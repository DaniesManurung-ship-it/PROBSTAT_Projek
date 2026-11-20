import './styles/base.css';
import { renderPages } from './pages/render-pages.js';

renderPages();

// Load the remaining styles after page styles to preserve their cascade order.
await import('./styles/main.css');
await import('./styles/stitch-theme.css');
await import('./features/opening/opening.css');
await import('./pages/home.js');
await import('./features/opening/opening.js');

const { initApp } = await import('./app/app.js');
initApp();

await import('./features/coin/coin-lab.js');
await import('./features/cards/cards-lab.js');
await import('./features/balls/balls-lab.js');
await import('./features/solver/probability-solver.js');
await import('./features/solver/guided-learning.js');
await import('./features/quiz/quiz-system.js');
await import('./features/distributions/distributions-controller.js');
await import('./features/distributions/continuous/continuous-controller.js');
