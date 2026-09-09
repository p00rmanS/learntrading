import { initJournal } from './journal.js';
import { initRiskCalculator } from './riskCalculator.js';
import { initPlan } from './plan.js';
import { initQuiz } from './quiz.js';

document.addEventListener('DOMContentLoaded', () => {
  initJournal();
  initRiskCalculator();
  initPlan();
  initQuiz();
});
