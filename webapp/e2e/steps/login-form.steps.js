const puppeteer = require('puppeteer');
const { defineFeature, loadFeature } = require('jest-cucumber');
const setDefaultOptions = require('expect-puppeteer').setDefaultOptions;
const feature = loadFeature('./features/login-form.feature');

let page;
let browser;
const APP_URL = process.env.APP_URL || 'http://localhost:3000/login';

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

    await page
      .goto(`${APP_URL}`, {
        waitUntil: "networkidle0",
      })
      .catch((error) => {
        console.error('Error navigating to app:', error);
      });
  });

  test('The user is already registered in the site', ({given, when, then}) => {
    let username;
    let password;

    given('A registered user', async () => {
      username = "testuserregistered";
      password = "testpassword123"; 
    });

    when('I fill the data in the form and press login', async () => {
      // Esperar a que los campos del formulario estén visibles
      await expect(page).toFill('input[id="usernameLoginw"]', username);
      await expect(page).toFill('input[id="passwordLoginw"]', password);
      await expect(page).toClick('//*[@id="root"]/div/div[1]')
    });

    then('Dashboard page should be shown in the screen', async () => {
      // Esperar a que aparezca la página Dashboard
        await  expect(page).toMatchElement("button",{text : "JUGAR"}); 
        await  expect(page).toMatchElement("button",{text : "VER RANKINGS"}); 
        await  expect(page).toMatchElement("button",{text : "VER MI PERFIL"});  
    });

    
  });

  afterAll(async () => {
    await browser.close();
  });
});