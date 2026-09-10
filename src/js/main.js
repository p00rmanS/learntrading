import { initJournal } from './journal.js';
import { initRiskCalculator } from './riskCalculator.js';
import { initPlan } from './plan.js';
import { initQuiz } from './quiz.js';
import { initTheme } from './theme.js';
import { initProgress } from './progress.js';
import { initReader } from './reader.js';

document.addEventListener('DOMContentLoaded', () => {
  initJournal();
  initRiskCalculator();
  initPlan();
  initQuiz();
  initTheme();
  initProgress();
  initReader();
});
