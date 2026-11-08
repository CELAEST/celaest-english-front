import { chromium } from "playwright";

async function run() {
  const browser = await chromium.launch({ headless: true });
  
  // 1. Mobile viewport
  const mobileCtx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1",
  });
  const page = await mobileCtx.newPage();

  // Seed storage so we go straight to Base 09
  await page.goto("http://localhost:3001/pathway");
  await page.waitForTimeout(1500);

  // Take screenshot of mobile Base 01 first
  await page.screenshot({ path: "C:/Users/user/.gemini/antigravity/brain/c68f979d-e4ea-49de-91be-227201713d6d/verify_mobile_base01.png" });

  // Open curriculum sheet to jump to Base 09
  // The header or curriculum trigger:
  const baseButton = page.locator("button:has-text('Base 01')").first();
  if (await baseButton.isVisible()) {
    await baseButton.click();
    await page.waitForTimeout(500);
    // Find Base 09
    const base09Btn = page.locator("button:has-text('La Llave de Preguntas Directas')").first();
    if (await base09Btn.isVisible()) {
      await base09Btn.click();
      await page.waitForTimeout(1500);
    }
  }

  // Take screenshot of Base 09 Formula Case 1
  await page.screenshot({ path: "C:/Users/user/.gemini/antigravity/brain/c68f979d-e4ea-49de-91be-227201713d6d/verify_mobile_base09_case1.png" });

  // Switch to Case 2 on Base 09
  const case2Tab = page.locator("button:has-text('Does')").first();
  if (await case2Tab.isVisible()) {
    await case2Tab.click();
    await page.waitForTimeout(800);
    await page.screenshot({ path: "C:/Users/user/.gemini/antigravity/brain/c68f979d-e4ea-49de-91be-227201713d6d/verify_mobile_base09_case2.png" });
  }

  // Check CTA bar and ask button
  const ctaBtn = page.locator("button:has-text('Construir la Regla')").first();
  if (await ctaBtn.isVisible()) {
    console.log("Found CTA button 'Construir la Regla'");
  }

  // 2. Desktop viewport
  const desktopCtx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const pcPage = await desktopCtx.newPage();
  await pcPage.goto("http://localhost:3001/pathway");
  await pcPage.waitForTimeout(1500);
  await pcPage.screenshot({ path: "C:/Users/user/.gemini/antigravity/brain/c68f979d-e4ea-49de-91be-227201713d6d/verify_desktop_base.png" });

  await browser.close();
  console.log("Visual verification screenshots captured successfully.");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});

