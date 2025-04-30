const puppeteer = require('puppeteer');
const { defineFeature, loadFeature } = require('jest-cucumber');
const setDefaultOptions = require('expect-puppeteer').setDefaultOptions;
const feature = loadFeature('./features/register-form.feature');

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
    setDefaultOptions({ timeout: 10000 });

    await page
      .goto(`${APP_URL}`, {
        waitUntil: "networkidle0",
      })
      .catch((error) => {
        console.error('Error navigating to app:', error);
      });
  });

  test('The user is not registered in the site', ({given, when, then}) => {
    let username;
    let password;
    let confirmPassword;

    given('An unregistered user', async () => {
      username = "testuser" + Math.random().toString(36).substring(7);
      password = "testpassword123";
      confirmPassword = "testpassword123";
      
      // Click en la pestaña de Signup usando evaluate con XPath
      await page.waitForFunction(xpath => {
        const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        return element !== null;
      }, {}, '//*[@id="root"]/div/div[2]/div/div/div[1]/div/div/button[2]');
      
      await page.evaluate(xpath => {
        const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (element) element.click();
      }, '//*[@id="root"]/div/div[2]/div/div/div[1]/div/div/button[2]');
    });

    when('I fill the data in the form and press submit', async () => {
      // Esperar a que los campos del formulario estén visibles
      await expect(page).toFill('input[id="usernameAWA"]', username);
      await expect(page).toFill('input[id="passwordAWA"]', password);
      await expect(page).toFill('input[id="passwordConfirmAWA"]', confirmPassword);
      await expect(page).toClick('button[id="botonAWA"]')
    });

    then('A confirmation message should be shown in the screen', async () => {
      // Esperar a que aparezca el mensaje de confirmación
      await page.waitForFunction(xpath => {
        const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        return element !== null;
      }, {}, '//div[contains(text(), "Registration successful")]');
      
      // Verificar el mensaje de confirmación
      const confirmationExists = await page.evaluate(xpath => {
        const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        return element !== null;
      }, '//div[contains(text(), "Registration successful")]');
      
      expect(confirmationExists).toBe(true);
    });

    
  });

  afterAll(async () => {
    await browser.close();
  });
});