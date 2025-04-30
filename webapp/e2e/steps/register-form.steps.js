const puppeteer = require('puppeteer');
const { defineFeature, loadFeature } = require('jest-cucumber');
const setDefaultOptions = require('expect-puppeteer').setDefaultOptions;
const feature = loadFeature('./features/register-form.feature');

let page;
let browser;

defineFeature(feature, test => {
  
  beforeAll(async () => {
    browser = process.env.GITHUB_ACTIONS
      ? await puppeteer.launch({headless: "new", args: ['--no-sandbox', '--disable-setuid-sandbox']})
      : await puppeteer.launch({ headless: false, slowMo: 100 });
    page = await browser.newPage();
    setDefaultOptions({ timeout: 10000 });

    await page
      .goto("http://localhost:3000/login", {
        waitUntil: "networkidle0",
      })
      .catch(() => {});
  });

  test('The user is not registered in the site', ({given, when, then}) => {
    let username;
    let password;
    let confirmPassword;

    given('An unregistered user', async () => {
      username = "testuser" + Math.random().toString(36).substring(7);
      password = "testpassword123";
      confirmPassword = "testpassword123";
      // Click en la pestaña de Signup
      await expect(page).toClick("/html/body/div/div/div[2]/div/div/div[1]/div/div/button[2]");
  
    });

    when('I fill the data in the form and press submit', async () => {
      await expect(page).toFill('/html/body/div/div/div[2]/div/div/div[2]/div/input', username);
      await expect(page).toFill('/html/body/div/div/div[2]/div/div/div[3]/div/input', password);
      await expect(page).toFill('/html/body/div/div/div[2]/div/div/div[4]/div/input', confirmPassword);
      await expect(page).toClick('/html/body/div/div/div[2]/div/div/button');
    });

    then('A confirmation message should be shown in the screen', async () => {
      await expect(page).toMatch('Registration successful! Please log in.');
    });

    /*
    // Test adicional: intentar iniciar sesión con el usuario registrado
    then('I should be able to login with the new account', async () => {
      // Click en la pestaña de Login
      await expect(page).toClick('[role="tab"]', { name: /login/i });
      
      // Llenar formulario de login
      await expect(page).toFill('[label="Username"]', username);
      await expect(page).toFill('[label="Password"]', password);
      await expect(page).toClick('[data-testid="login-button"]');

      // Verificar redirección al dashboard
      await expect(page).toMatch('Bienvenido');
    });
    */
  });

  afterAll(async () => {
    await browser.close();
  });

});