import './navigation.js';
import { createDiceScene } from '../visualization/three/dice-scene.js';
import { createDiceController } from '../features/dice/dice-controller.js';
import { createDiceExperiment } from '../features/experiment/dice-experiment.js';

export function initApp() {
  const elements = {
    sceneContainer: document.querySelector('#dice-scene'),
    dieAValue: document.querySelector('#die-a-value'),
    dieBValue: document.querySelector('#die-b-value'),
    sumValue: document.querySelector('#sum-value'),
    sampleGrid: document.querySelector('#sample-grid'),
    rollDice: document.querySelector('#roll-dice'),
    showFavorable: document.querySelector('#show-favorable'),
    stepLabel: document.querySelector('#step-label'),
    stepTitle: document.querySelector('#step-title'),
    stepDescription: document.querySelector('#step-description'),
    stepMath: document.querySelector('#step-math'),
    stepCounter: document.querySelector('#step-counter'),
    stepProgress: document.querySelector('#step-progress'),
    prevStep: document.querySelector('#prev-step'),
    nextStep: document.querySelector('#next-step'),
  };

  const missing = Object.entries(elements).filter(([, element]) => !element);
  if (missing.length) {
    console.error('Elemen HTML tidak ditemukan:', missing.map(([name]) => name));
    return;
  }

  const scene = createDiceScene(elements.sceneContainer);
  createDiceController({ scene, elements });

  const experimentElements = {
    trialCount: document.querySelector('#trial-count'),
    runExperiment: document.querySelector('#run-experiment'),
    resetExperiment: document.querySelector('#reset-experiment'),
    experimentStatus: document.querySelector('#experiment-status'),
    trialTotal: document.querySelector('#trial-total'),
    hitTotal: document.querySelector('#hit-total'),
    experimentalRate: document.querySelector('#experimental-rate'),
    theoreticalRate: document.querySelector('#theoretical-rate'),
    experimentBar: document.querySelector('#experiment-bar'),
    experimentInsight: document.querySelector('#experiment-insight'),
    frequencyChart: document.querySelector('#frequency-chart'),
  };

  const missingExperimentElements = Object.entries(experimentElements)
    .filter(([, element]) => !element);
  if (missingExperimentElements.length) {
    console.error('Elemen simulasi belum ditemukan:', missingExperimentElements.map(([name]) => name));
  } else {
    createDiceExperiment({ scene, elements: experimentElements });
  }

  window.addEventListener('pagehide', () => scene.dispose(), { once: true });
}
