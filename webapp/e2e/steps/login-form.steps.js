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

  beforeEach(async () => {
  await page.goto(`${APP_URL}`, { waitUntil: 'networkidle0' });
  await page.waitForSelector('input[id="usernameLoginw"]');
  });

  test('The user is already registered in the site', ({ given, when, then }) => {
    let username;
    let password;

    given('A registered user', async () => {
      username = "testuserreg";
      password = "testpassword123";
    });

    when('I fill the data in the form and press login', async () => {
      await expect(page).toFill('input[id="usernameLoginw"]', username);
      await expect(page).toFill('input[id="passwordLoginw"]', password);
      await expect(page).toClick('button[id="botonLoginw"]')
    });

    then('Dashboard page should be shown in the screen', async () => {
     await expect(page).toMatchElement("button", { text: /jugar/i });
      await expect(page).toMatchElement("button", { text: /VER RANKINGS/i });
      await expect(page).toMatchElement("button", { text: /VER MI PERFIL/i });
    });
  });


    test('The user is not registered in the site', ({ given, when, then }) => {
    let username;
    let password;

    given('A unregistered user', async () => {
      username = "testuserunregistered";
      password = "testpassword123";
    });

    when('I fill the data in the form and press login', async () => {
      await expect(page).toFill('input[id="usernameLoginw"]', username);
      await expect(page).toFill('input[id="passwordLoginw"]', password);
      await expect(page).toClick('button[id="botonLoginw"]')
    });

    then('An error message is shown', async () => {
      await page.waitForSelector('.MuiSnackbar-root', { 
        visible: true,
        timeout: 5000 
      });
       const errorMessage = await page.evaluate(() => {
        // Buscar en diferentes lugares donde podría estar el mensaje
        const snackbarMessage = document.querySelector('.MuiSnackbarContent-message');
        const snackbarRoot = document.querySelector('.MuiSnackbar-root');
        
        if (snackbarMessage) return snackbarMessage.textContent;
        if (snackbarRoot) return snackbarRoot.textContent;
        
        // Si no encontramos el mensaje en los lugares esperados, buscar en todo el DOM
        return document.body.innerText;
      });

      // Verificar que el mensaje contiene el texto esperado
      expect(errorMessage).toContain('Invalid credentials');
    });
  });


  afterAll(async () => {
    await browser.close();
  });
});