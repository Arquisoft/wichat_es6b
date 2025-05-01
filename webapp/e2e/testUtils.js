async function clickLink(linkXPath, page) {
    const [link] = await page.$x(linkXPath);
    if (link) {
        await link.click();
    } else {
        throw new Error(`Cannot find link "${link}"`);
    }
}

async function loginUser(username, password, page) {
    await page
    .goto("http://localhost:3000/login", {
      waitUntil: "networkidle0",
    })
    .catch(() => {});

    await expect(page).toFill('input[id="usernameLoginw"]', username);
    await expect(page).toFill('input[id="passwordLoginw"]', password);

    await clickLink('//*[@id="root"]/div/div[1]');
}

module.exports = { clickLink, loginUser }; 