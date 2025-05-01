async function loginUser(username, password, page) {
    await page
    .goto("http://localhost:3000/login", {
      waitUntil: "networkidle0",
    })
    .catch(() => {});

    await expect(page).toFill('input[id="usernameLoginw"]', username);
    await expect(page).toFill('input[id="passwordLoginw"]', password);
    await expect(page).toClick('button[id="botonLoginw"]')

     await expect(page).toMatchElement("button", { text: /jugar/i });
}

module.exports = {loginUser }; 