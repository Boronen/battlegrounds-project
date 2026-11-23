import type { Page } from "@playwright/test";

export function testServer() {
  const url = process.env.PLATFORM_TEST_URL;
  if (!url)
    throw Error(
      "A PLATFORM_TEST_URL értéke egy elkülönített tesztpéldány legyen.",
    );
  return url;
}
export async function openPrivateMatch(host: Page, guest: Page) {
  const base = testServer();
  for (const page of [host, guest]) {
    const name = "ui" + crypto.randomUUID().slice(0, 12);
    await page.goto(base + "/#/regisztracio");
    await page.getByLabel("Felhasználónév").fill(name);
    await page.getByLabel("E-mail").fill(name + "@example.test");
    await page
      .getByLabel("Jelszó", { exact: true })
      .fill("Integration-password");
    await page.getByLabel("Jelszó ismét").fill("Integration-password");
    await page.getByRole("button", { name: "Fiók létrehozása" }).click();
    await page.getByRole("heading", { name: "Saját profil" }).waitFor();
    await page.getByRole("link", { name: "Online játék" }).click();
  }
  await host.getByRole("button", { name: "Privát szoba létrehozása" }).click();
  const heading = host.getByRole("heading", { name: /Szobakód:/ });
  const code = (await heading.innerText()).split(": ")[1];
  await guest.getByLabel("Meghívókód").fill(code);
  await guest.getByRole("button", { name: "Csatlakozás", exact: true }).click();
  for (const page of [host, guest])
    await page.getByRole("button", { name: "Készen állok" }).click();
  await host
    .getByRole("button", { name: "Meccs indítása", exact: true })
    .click();
  for (const page of [host, guest])
    await page.locator(".hero-offer").first().waitFor();
}
