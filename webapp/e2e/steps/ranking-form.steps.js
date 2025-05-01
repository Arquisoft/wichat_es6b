const puppeteer = require('puppeteer');
const { defineFeature, loadFeature } = require('jest-cucumber');
const setDefaultOptions = require('expect-puppeteer').setDefaultOptions;
const feature = loadFeature('./features/ranking-form.feature'); 
const { loginUser, registerUser } = require('../testUtils');

let page;
let browser;
const APP_URL = process.env.APP_URL || 'http://localhost:3000/ranking';

defineFeature(feature, test => {
  
  beforeAll(async () => {
    browser = process.env.GITHUB_ACTIONS
      ? await puppeteer.launch({headless: "new", args: ['--no-sandbox', '--disable-setuid-sandbox']})
      : await puppeteer.launch({ 
          headless: false, 
          slowMo: 100,
          args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
    page = await browser.newPage();
    setDefaultOptions({ timeout: 100000 });

    let username = "testuser" + Math.random().toString(36).substring(7);
    await registerUser(username,"testpassword123",page);
    await loginUser(username,"testpassword123",page);
    await page
      .goto(`${APP_URL}`, {
        waitUntil: "networkidle0",
      })
      .catch((error) => {
        console.error('Error navigating to app:', error);
      });
     

  });



  test('Enter the ranking', ({given, when, then}) => {
    given('A registered user', async () => {
    });

    when('I enter the ranking', async () => {
    });

    then('The ranking appears', async () => {
        const pageContent = await page.content();
  
        await expect(pageContent).toMatch(/Ranking de Jugadores/i);
    });
  });

  afterAll(async () => {
    if (browser) {
      await browser.close();
    }
  });
});