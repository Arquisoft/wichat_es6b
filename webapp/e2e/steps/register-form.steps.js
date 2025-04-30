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
      
      // Click en la pestaña de Signup - using proper XPath
      await page.waitForXPath('//*[@id="root"]/div/div[2]/div/div/button');
      const signupTabElement = await page.$x('//*[@id="root"]/div/div[2]/div/div/button');
      await signupTabElement[0].click();
    });

    when('I fill the data in the form and press submit', async () => {
      // Wait for form fields to be visible after tab change
      await page.waitForXPath('//input[@placeholder="Username" or @name="username"]');
      
      // Get references to form elements using XPath
      const [usernameInput] = await page.$x('//input[@placeholder="Username" or @name="username"]');
      const [passwordInput] = await page.$x('//input[@placeholder="Password" or @name="password"]');
      const [confirmPasswordInput] = await page.$x('//input[@placeholder="Confirm Password" or @name="confirmPassword"]');
      const [submitButton] = await page.$x('//button[@type="submit"]');
      
      // Fill in the form fields
      await usernameInput.type(username);
      await passwordInput.type(password);
      await confirmPasswordInput.type(confirmPassword);
      
      // Submit the form
      await submitButton.click();
    });

    then('A confirmation message should be shown in the screen', async () => {
      // Wait for the confirmation message to appear
      await page.waitForXPath('//div[contains(text(), "Registration successful")]');
      
      // Verify the confirmation message
      const confirmationElements = await page.$x('//div[contains(text(), "Registration successful")]');
      expect(confirmationElements.length).toBeGreaterThan(0);
    });

    /*
    // Test adicional: intentar iniciar sesión con el usuario registrado
    then('I should be able to login with the new account', async () => {
      // Click en la pestaña de Login
      const [loginTab] = await page.$x('//button[contains(text(), "Login")]');
      await loginTab.click();
      
      // Wait for form fields to be visible
      await page.waitForXPath('//input[@placeholder="Username" or @name="username"]');
      
      // Get references to login form elements
      const [usernameInput] = await page.$x('//input[@placeholder="Username" or @name="username"]');
      const [passwordInput] = await page.$x('//input[@placeholder="Password" or @name="password"]');
      const [loginButton] = await page.$x('//button[@type="submit"]');
      
      // Fill in login credentials
      await usernameInput.type(username);
      await passwordInput.type(password);
      
      // Submit login form
      await loginButton.click();
      
      // Verify redirection to dashboard
      await page.waitForXPath('//div[contains(text(), "Bienvenido")]');
      const welcomeElements = await page.$x('//div[contains(text(), "Bienvenido")]');
      expect(welcomeElements.length).toBeGreaterThan(0);
    });
    */
  });

  afterAll(async () => {
    await browser.close();
  });
});