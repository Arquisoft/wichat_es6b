const puppeteer = require('puppeteer');
const { defineFeature, loadFeature } = require('jest-cucumber');
const setDefaultOptions = require('expect-puppeteer').setDefaultOptions;
const feature = loadFeature('./features/editAvatar-form.feature');
const { loginUser } = require('../testUtils');

let page;
let browser;
const APP_URL = process.env.APP_URL || 'http://localhost:3000/profile/edit';

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

    await loginUser("testuserreg","testpassword123",page);
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
  });
  test('Change the avatar', ({ given, when, then }) => {

    given('A registered user', async () => {
    
    });

    when('I change the avatar', async () => {
        await page.click('[data-testid="pulpo-button"]');
        await page.click('[data-testid="confirm-button"]');
    });

    then('Shows a confirm message', async () => {
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
      expect(errorMessage).toContain('Avatar cambiado con éxito');

      const imgSrc = await page.$eval('[data-testid="avatar-img"]', img => img.src);
        expect(imgSrc).toBe('http://localhost:3000/icono_cactus.png');
    });
  });


  afterAll(async () => {
    await browser.close();
  });
});