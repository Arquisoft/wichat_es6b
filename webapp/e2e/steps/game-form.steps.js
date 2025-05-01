// const puppeteer = require('puppeteer');
// const { defineFeature, loadFeature } = require('jest-cucumber');
// const setDefaultOptions = require('expect-puppeteer').setDefaultOptions;
// const { loginUser } = require('../testUtils');
// const feature = loadFeature('./features/game-form.feature');

// let page;
// let browser;
// const APP_URL = process.env.APP_URL || 'http://localhost:3000';

// defineFeature(feature, test => {
  
//   beforeAll(async () => {
//     try {
//       console.log('Iniciando browser...');
//       browser = process.env.GITHUB_ACTIONS
//         ? await puppeteer.launch({headless: "new", args: ['--no-sandbox', '--disable-setuid-sandbox']})
//         : await puppeteer.launch({ 
//             headless: false, 
//             slowMo: 100,
//             args: ['--no-sandbox', '--disable-setuid-sandbox']
//           });
//       page = await browser.newPage();
//       setDefaultOptions({ timeout: 60000 });

//       console.log('Iniciando login...');
//       await loginUser('testuser', 'testpassword', page);
//       await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 60000 });

//       console.log('Navegando a la página del juego...');
//       await page.goto(`${APP_URL}/game`, { 
//         waitUntil: "networkidle0",
//         timeout: 60000 
//       });
      
//       console.log('Setup completado');
//     } catch (error) {
//       console.error('Error en beforeAll:', error);
//       throw error;
//     }
//   }, 60000); // Timeout específico para beforeAll

//   test('Answering a question correctly', ({given, when, then}) => {
//     given('A question', async () => {
//       // Esperar a que la pregunta esté cargada
//       await page.waitForSelector('[data-testid="question-container"]');
//     });

//     when('I click on the correct answer button', async () => {
//       // Encontrar el botón de la respuesta correcta
//       const correctButton = await page.$('[data-testid="correct-answer-button"]');
//       await correctButton.click();
//     });

//     then('The button turns green', async () => {
//       // Esperar a que el botón cambie de color
//       await page.waitForSelector('[data-testid="correct-answer-button"].correct');
//     });
//   });

//   test('Answering a question incorrectly', ({given, when, then}) => {
//     given('A question', async () => {
//       // Esperar a que la pregunta esté cargada
//       await page.waitForSelector('[data-testid="question-container"]');
//     });

//     when('I click on an incorrect answer button', async () => {
//       // Encontrar un botón de respuesta incorrecta
//       const incorrectButton = await page.$('[data-testid="incorrect-answer-button"]');
//       await incorrectButton.click();
//     });

//     then('The button turns red && the correct answer turns green', async () => {
//       // Esperar a que los botones cambien de color
//       await page.waitForSelector('[data-testid="incorrect-answer-button"].incorrect');
//       await page.waitForSelector('[data-testid="correct-answer-button"].correct');
//     });
//   });

//   afterAll(async () => {
//     if (browser) {
//       await browser.close();
//     }
//   });
// });