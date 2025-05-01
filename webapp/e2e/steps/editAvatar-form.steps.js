const puppeteer = require('puppeteer');
const { defineFeature, loadFeature } = require('jest-cucumber');
const setDefaultOptions = require('expect-puppeteer').setDefaultOptions;
const feature = loadFeature('./features/editAvatar-form.feature');
const { loginUser, registerUser } = require('../testUtils');

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

    // Configurar timeouts
    await page.setDefaultNavigationTimeout(60000);
    await page.setDefaultTimeout(60000);

    username = "testuser" + Math.random().toString(36).substring(7);
    await registerUser(username,"testpassword123",page);
    await loginUser(username,"testpassword123",page);
    
    // Esperar a que la página esté lista antes de navegar
    await page.waitForFunction(() => document.readyState === 'complete');
    
    // Navegar a la página de edición de avatar
    const response = await page.goto(`${APP_URL}`, {
      waitUntil: "networkidle0",
      timeout: 60000
    });

    if (!response.ok()) {
      throw new Error(`Error al cargar la página: ${response.status()}`);
    }

    // Esperar a que la página esté completamente cargada
    await page.waitForFunction(() => document.readyState === 'complete');
  });

  test('Change the avatar', ({ given, when, then }) => {
    given('A registered user', async () => {
      // El usuario ya está logueado gracias a loginUser en beforeAll
    });

    when('I change the avatar', async () => {
      // Esperar a que los botones estén disponibles
      await page.waitForSelector('[data-testid="pulpo-button"]', { timeout: 60000 });
      await page.waitForSelector('[data-testid="confirm-button"]', { timeout: 60000 });
      
      // Hacer clic en los botones
      await page.click('[data-testid="pulpo-button"]');
      await page.click('[data-testid="confirm-button"]');
    });

    then('Shows a confirm message', async () => {
      // Esperar a que aparezca el mensaje de confirmación
      await page.waitForSelector('.MuiSnackbar-root', { 
        visible: true,
        timeout: 60000 
      });

      const errorMessage = await page.evaluate(() => {
        const snackbarMessage = document.querySelector('.MuiSnackbarContent-message');
        const snackbarRoot = document.querySelector('.MuiSnackbar-root');
        
        if (snackbarMessage) return snackbarMessage.textContent;
        if (snackbarRoot) return snackbarRoot.textContent;
        
        return document.body.innerText;
      });

      expect(errorMessage).toContain('Avatar cambiado con éxito');

      // Verificar la imagen del avatar
      const imgSrc = await page.$eval('[data-testid="avatar-img"]', img => img.src);
      expect(imgSrc).toBe('http://localhost:3000/icono_cactus.png');
    });
  });

  afterAll(async () => {
    await browser.close();
  });
});

