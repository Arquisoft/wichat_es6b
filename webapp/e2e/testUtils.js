async function loginUser(username, password, page) {
    try {
        console.log("Entra loginUser");
           
        // Configurar timeout más largo para la navegación
        await page.setDefaultNavigationTimeout(60000);
        await page.setDefaultTimeout(60000);

        // Esperar a que la página esté lista antes de navegar
        await page.waitForFunction(() => document.readyState === 'complete');

        // Intentar navegar a la página de login
        const response = await page.goto("http://localhost:3000/login", {
            waitUntil: "networkidle0",
            timeout: 60000
        });


        await page.waitForFunction(xpath => {
        const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        return element !== null;
      }, {}, '//*[@id="root"]/div/div[2]/div/div/div[1]/div/div/button[1]');
      
      await page.evaluate(xpath => {
        const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (element) element.click();
      }, '//*[@id="root"]/div/div[2]/div/div/div[1]/div/div/button[1]');

        // Esperar a que los elementos estén disponibles
        await page.waitForSelector('input[id="usernameLoginw"]', { timeout: 60000 });
        await page.waitForSelector('input[id="passwordLoginw"]', { timeout: 60000 });
        await page.waitForSelector('button[id="botonLoginw"]', { timeout: 60000 });

        // Rellenar el formulario
        await page.type('input[id="usernameLoginw"]', username);
        await page.type('input[id="passwordLoginw"]', password);
        
        // Hacer clic y esperar a la navegación
        const navigationPromise = page.waitForNavigation({ 
            waitUntil: 'networkidle0', 
            timeout: 60000 
        });
        await page.click('button[id="botonLoginw"]');
        await navigationPromise;

        // Esperar a que aparezcan los botones del dashboard
        await page.waitForSelector("button", { text: /jugar/i, timeout: 60000 });
        
        // Esperar a que la página esté completamente cargada
        await page.waitForFunction(() => document.readyState === 'complete');
    } catch (error) {
        console.error('Error en loginUser:', error);
        throw error;
    }
}

async function registerUser(username, password, page) {
  try {
      console.log("🔄 Iniciando registro de usuario...");
      // Configurar timeout más largo para la navegación
      await page.setDefaultNavigationTimeout(60000);
      await page.setDefaultTimeout(60000);

      // Intentar navegar a la página de login
      const response = await page.goto("http://localhost:3000/login", {
          waitUntil: "networkidle0",
          timeout: 60000
      });

      if (!response.ok()) {
          throw new Error(`Error al cargar la página: ${response.status()}`);
      }

      console.log("✅ Página de login cargada");

      // Hacer clic en la pestaña de Signup
      await page.waitForFunction(xpath => {
        const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        return element !== null;
      }, {}, '//*[@id="root"]/div/div[2]/div/div/div[1]/div/div/button[2]');
      
      await page.evaluate(xpath => {
        const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (element) element.click();
      }, '//*[@id="root"]/div/div[2]/div/div/div[1]/div/div/button[2]');

      console.log("✅ Cambiado a pestaña de registro");

      // Esperar a que los elementos estén disponibles
      await page.waitForSelector('input[id="usernameAWA"]', { timeout: 60000 });
      await page.waitForSelector('input[id="passwordAWA"]', { timeout: 60000 });
      await page.waitForSelector('input[id="passwordConfirmAWA"]', { timeout: 60000 });
      await page.waitForSelector('button[id="botonAWA"]', { timeout: 60000 });

      // Rellenar el formulario
      await page.type('input[id="usernameAWA"]', username);
      await page.type('input[id="passwordAWA"]', password);
      await page.type('input[id="passwordConfirmAWA"]', password);

      console.log("✅ Formulario rellenado");

      // Hacer clic en el botón de registro y esperar el mensaje
      await Promise.all([
          page.click('button[id="botonAWA"]'),
          page.waitForFunction(() => {
              return document.body.innerText.includes("Registration successful! Please log in.");
          }, { timeout: 60000 }),
      ]);

      console.log("✅ Registro completado");


      // Hacer clic en la pestaña de Login
      await page.waitForFunction(xpath => {
        const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        return element !== null;
      }, {}, '//*[@id="root"]/div/div[2]/div/div/div[1]/div/div/button[1]');
      
      await page.evaluate(xpath => {
        const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (element) element.click();
      }, '//*[@id="root"]/div/div[2]/div/div/div[1]/div/div/button[1]');

      console.log("✅ Volviendo a pestaña de login");

      // Esperar a que los campos de login estén disponibles
      await page.waitForSelector('input[id="usernameLoginw"]', { timeout: 60000 });
      await page.waitForSelector('input[id="passwordLoginw"]', { timeout: 60000 });

      console.log("✅ Registro completado y listo para login");
      
  } catch (error) {
      console.error('❌ Error en registerUser:', error);
      throw error;
  }
}

module.exports = { loginUser, registerUser }; 