const puppeteer = require('puppeteer');
const { defineFeature, loadFeature } = require('jest-cucumber');
const setDefaultOptions = require('expect-puppeteer').setDefaultOptions;
const feature = loadFeature('./features/register-form.feature');

let page;
let browser;
const APP_URL = process.env.APP_URL || 'http://localhost:3000/login';
let username = "testuser" + Math.random().toString(36).substring(7);
let password = "testpassword123";
let confirmPassword = "testpassword123";

defineFeature(feature, test => {
  
  beforeAll(async () => {
    browser = process.env.GITHUB_ACTIONS
      ? await puppeteer.launch({headless: "new",slowMo:100 , args: ['--no-sandbox', '--disable-setuid-sandbox']})
      : await puppeteer.launch({ 
          headless: "new", 
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
    

    given('An unregistered user', async () => {
      
      
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
    then('I should be able to login with the new account', async () => {
      // Click en la pestaña de Login
      await page.waitForFunction(xpath => {
        const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        return element !== null;
      }, {}, '//*[@id="root"]/div/div[2]/div/div/div[1]/div/div/button[1]');
      
      await page.evaluate(xpath => {
        const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (element) element.click();
      }, '//*[@id="root"]/div/div[2]/div/div/div[1]/div/div/button[1]');

      // Rellenar formulario de login
      await expect(page).toFill('input[id="usernameLoginw"]', username);
      await expect(page).toFill('input[id="passwordLoginw"]', password);
      await expect(page).toClick('button[id="botonLoginw"]');

      // Esperar a que aparezca el dashboard
      await page.waitForFunction(xpath => {
        const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        return element !== null;
      }, {}, '//button[contains(text(), "Jugar")]');

      // Verificar que estamos en el dashboard
      const isDashboard = await page.evaluate(xpath => {
        const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        return element !== null;
      }, '//button[contains(text(), "Jugar")]');
      
      expect(isDashboard).toBe(true);
    });
    then('I should be able to see the ranking', async () => {
      // Click en el botón de Rankings
      await page.waitForFunction(xpath => {
        const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        return element !== null;
      }, {}, '//a[contains(text(), "Ranking")]');
      
      await page.evaluate(xpath => {
        const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (element) element.click();
      }, '//a[contains(text(), "Ranking")]');

      // Esperar a que aparezca el título del ranking
      await page.waitForFunction(xpath => {
        const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        return element !== null;
      }, {}, '//h3[contains(text(), "Ranking de Jugadores")]');

      // Verificar que estamos en la página de ranking
      const isRankingPage = await page.evaluate(xpath => {
        const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        return element !== null;
      }, '//h3[contains(text(), "Ranking de Jugadores")]');
      
      expect(isRankingPage).toBe(true);

      // Click en el botón de Volver
      await page.waitForFunction(xpath => {
        const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        return element !== null;
      }, {}, '//button[contains(text(), "Volver Atrás")]');
      
      await page.evaluate(xpath => {
          const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
          if (element) element.click();
      }, '//button[contains(text(), "Volver Atrás")]');

    });

    then('I should be able to see the history', async () => {
      // Click en el botón de Rankings
      await page.waitForFunction(xpath => {
        const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        return element !== null;
      }, {}, '//button[contains(text(), "Ver mi perfil")]');
      
      await page.evaluate(xpath => {
        const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (element) element.click();
      }, '//button[contains(text(), "Ver mi perfil")]');

      // Esperar a que aparezca el título del ranking
      await page.waitForFunction(xpath => {
        const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        return element !== null;
      }, {}, '//h5[contains(text(), "Estadísticas Generales")]');

      // Verificar que estamos en la página de ranking
      const isRankingPage = await page.evaluate(xpath => {
        const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        return element !== null;
      }, '//h5[contains(text(), "Estadísticas Generales")]');
      
      expect(isRankingPage).toBe(true);

    });
  
  });
  test('The user tries to register with an existing username', ({given, when, then}) => {
    given('An existing username', async () => {
      await page.goto(`${APP_URL}`, {
        waitUntil: "networkidle0",
      });
      // Click en la pestaña de Signup
      await page.waitForFunction(xpath => {
        const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        return element !== null;
      }, {}, '//*[@id="root"]/div/div[2]/div/div/div[1]/div/div/button[2]');
      
      await page.evaluate(xpath => {
        const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (element) element.click();
      }, '//*[@id="root"]/div/div[2]/div/div/div[1]/div/div/button[2]');
    });

    when('I fill the form with an existing username', async () => {
      // Usar el mismo username que ya se registró
      await expect(page).toFill('input[id="usernameAWA"]', username);
      await expect(page).toFill('input[id="passwordAWA"]', password);
      await expect(page).toFill('input[id="passwordConfirmAWA"]', confirmPassword);
      await expect(page).toClick('button[id="botonAWA"]');
    });

    then('An error message should be shown', async () => {
      // Esperar y verificar el mensaje de error
      await page.waitForFunction(xpath => {
        const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        return element !== null;
      }, {}, '//div[contains(text(), "Error: Username already exists")]');
      
      const errorExists = await page.evaluate(xpath => {
        const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        return element !== null;
      }, '//div[contains(text(), "Error: Username already exists")]');
      
      expect(errorExists).toBe(true);
    });
  });
  test('Login fails with non-existent username', ({given, when, then}) => {
    const nonExistentUser = "nonexistent_" + Math.random().toString(36).substring(7);

    given('A non-existent username', async () => {
      // Navigate to login page
      await page.goto(`${APP_URL}`, {
        waitUntil: "networkidle0",
      });

      // Ensure we're on login tab
      await page.waitForFunction(xpath => {
        const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        return element !== null;
      }, {}, '//*[@id="root"]/div/div[2]/div/div/div[1]/div/div/button[1]');
      
      await page.evaluate(xpath => {
        const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (element) element.click();
      }, '//*[@id="root"]/div/div[2]/div/div/div[1]/div/div/button[1]');
    });

    when('I try to login with invalid credentials', async () => {
      // Try to login with non-existent user
      await expect(page).toFill('input[id="usernameLoginw"]', nonExistentUser);
      await expect(page).toFill('input[id="passwordLoginw"]', "anypassword123");
      await expect(page).toClick('button[id="botonLoginw"]');
    });

    then('A login error message should be shown', async () => {
      // Wait for and verify error message
      await page.waitForFunction(xpath => {
        const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        return element !== null;
      }, {}, '//div[contains(text(), "Error: Invalid credentials")]');
      
      const errorExists = await page.evaluate(xpath => {
        const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        return element !== null;
      }, '//div[contains(text(), "Error: Invalid credentials")]');
      
      expect(errorExists).toBe(true);
    });
  });

  afterAll(async () => {
    await browser.close();
  });
});