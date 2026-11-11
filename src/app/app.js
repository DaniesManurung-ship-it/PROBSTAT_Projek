import './navigation.js';
import { initTheme } from './theme.js';
import { createDiceScene } from '../visualization/three/dice-scene.js';
import { createDiceController } from '../features/dice/dice-controller.js';
import { createDiceExperiment } from '../features/experiment/dice-experiment.js';

export function initApp() {
  initTheme();

  const elements = {
    sceneContainer: document.querySelector('#dice-scene'),
    diceCount: document.querySelector('#dice-count'),
    targetSum: document.querySelector('#target-sum'),
    applyConfiguration: document.querySelector('#apply-dice-config'),
    configurationStatus: document.querySelector('#dice-config-status'),
    diceValues: document.querySelector('#dice-values'),
    sumValue: document.querySelector('#sum-value'),
    sampleGrid: document.querySelector('#sample-grid'),
    sampleHeading: document.querySelector('#sample-heading'),
    sampleCount: document.querySelector('#sample-count'),
    sampleExplanation: document.querySelector('#sample-explanation'),
    favorableLegend: document.querySelector('#favorable-legend'),
    question: document.querySelector('#dice-question'),
    answerFraction: document.querySelector('#answer-fraction'),
    answerPercent: document.querySelector('#answer-percent'),
    answerDescription: document.querySelector('#answer-description'),
    answerCount: document.querySelector('#answer-count'),
    answerBar: document.querySelector('#answer-bar'),
    rollDice: document.querySelector('#roll-dice'),
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
  const diceController = createDiceController({ scene, elements });

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
    experimentTarget: document.querySelector('#experiment-target'),
    hitTotalLabel: document.querySelector('#hit-total-label'),
  };

  const missingExperimentElements = Object.entries(experimentElements)
    .filter(([, element]) => !element);
  if (missingExperimentElements.length) {
    console.error('Elemen simulasi belum ditemukan:', missingExperimentElements.map(([name]) => name));
  } else {
    createDiceExperiment({
      scene,
      elements: experimentElements,
      getDiceConfiguration: diceController.getConfiguration,
      onDiceConfigurationChange: diceController.onConfigurationChange,
    });
  }

  window.addEventListener('pagehide', () => scene.dispose(), { once: true });
}
