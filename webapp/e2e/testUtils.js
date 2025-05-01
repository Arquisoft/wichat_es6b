async function loginUser(username, password, page) {
    try {
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

        if (!response.ok()) {
            throw new Error(`Error al cargar la página: ${response.status()}`);
        }

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

module.exports = { loginUser }; 