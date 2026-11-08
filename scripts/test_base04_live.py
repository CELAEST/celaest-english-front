import asyncio
import base64
import json
import os
import sys
import time

sys.stdout.reconfigure(encoding="utf-8")

from playwright.async_api import async_playwright

def make_token():
    header = base64.urlsafe_b64encode(b'{"alg":"HS256","typ":"JWT"}').decode().rstrip("=")
    exp = int(time.time()) + 86400 * 365
    payload_data = {"sub": "u1", "user_id": "u1", "email": "student@celaest.com", "name": "Student", "exp": exp}
    payload = base64.urlsafe_b64encode(json.dumps(payload_data).encode()).decode().rstrip("=")
    return f"{header}.{payload}.signature"

async def test():
    token = make_token()
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(viewport={"width": 390, "height": 844}, is_mobile=True, has_touch=True)
        page = await context.new_page()

        # Intercept auth and profile
        await page.route("**/*profile*", lambda r: r.fulfill(
            status=200,
            content_type="application/json",
            body=json.dumps({
                "status": "success",
                "success": True,
                "data": {
                    "id": "u1",
                    "name": "Student",
                    "profession": "Professional",
                    "cefrLevel": "A1",
                    "onboardingCompleted": True,
                    "learningGoal": "Professional Fluency"
                }
            })
        ))

        await page.route("**/api/**", lambda r: r.fulfill(
            status=200,
            content_type="application/json",
            body=json.dumps({"status": "success", "data": {}})
        ))

        print("Navigating to onboarding to initialize domain storage...")
        await page.goto("http://localhost:3001/onboarding", wait_until="domcontentloaded")
        await page.wait_for_timeout(1000)

        # Inject session into origin localStorage
        await page.evaluate(f"""() => {{
            const uid = 'u1';
            localStorage.setItem('lingua_access_token', '{token}');
            localStorage.setItem('lingua_refresh_token', 'refresh_123');
            localStorage.setItem('lingua_auth_user', JSON.stringify({{
                id: uid,
                email: 'student@celaest.com',
                name: 'Student',
                onboardingCompleted: true
            }}));
            localStorage.setItem('lingua_onboarding_completed', 'true');
            localStorage.setItem('lingua_onboarding_completed_' + uid, 'true');
            localStorage.setItem('celaest_pathway_software_intro_seen', 'true');
            localStorage.setItem('celaest:user:u1:cefrLevel', 'A1');
            localStorage.setItem('celaest:cefrLevel', 'A1');
            localStorage.setItem('lingua_cefr_level', 'A1');
        }}""")

        print("Navigating to /pathway...")
        await page.goto("http://localhost:3001/pathway", wait_until="domcontentloaded")
        await page.wait_for_timeout(3000)

        print("Current URL:", page.url)

        # Open Base selector sheet
        print("Opening Base selector sheet...")
        base_selector = page.locator('button:has-text("BASE")').first
        if await base_selector.count() > 0:
            await base_selector.click()
            await page.wait_for_timeout(1000)

            # Click Base 04 specifically in the sheet
            base4_item = page.locator('button').filter(has_text="Base 04").first
            print("Clicking Base 04...")
            await base4_item.click()
            await page.wait_for_timeout(2000)

        # Switch to 1 Fórmula tab
        formula_tab = page.locator('button[role="tab"]:has-text("Fórmula"), button:has-text("Fórmula")').first
        if await formula_tab.count() > 0:
            await formula_tab.click()
            await page.wait_for_timeout(1000)

        # Screenshot Formula
        shot1 = "C:/Users/user/.gemini/antigravity/brain/c68f979d-e4ea-49de-91be-227201713d6d/base04_formula_shot.png"
        await page.screenshot(path=shot1)
        print("Formula screenshot saved:", shot1)

        # Jump to Reto (TRAP_CHECK) tab
        reto_tab = page.locator('button[role="tab"]:has-text("Reto"), button:has-text("Reto")').first
        if await reto_tab.count() > 0:
            print("Clicking Reto tab...")
            await reto_tab.click()
            await page.wait_for_timeout(1000)

            # Screenshot initial Reto
            shot2 = "C:/Users/user/.gemini/antigravity/brain/c68f979d-e4ea-49de-91be-227201713d6d/base04_reto_initial.png"
            await page.screenshot(path=shot2)
            print("Reto initial screenshot saved:", shot2)

            # Click correct option ("I am 25 years old" or the one marked with correct)
            # Find button containing "25 years old" or option B
            correct_opt = page.locator('button:has-text("I am 25 years old")').first
            if await correct_opt.count() == 0:
                correct_opt = page.locator('button:has-text("Elegir")').nth(1)

            print("Clicking correct option...")
            await correct_opt.click()
            await page.wait_for_timeout(1200)

            # Screenshot passed Reto
            shot3 = "C:/Users/user/.gemini/antigravity/brain/c68f979d-e4ea-49de-91be-227201713d6d/base04_reto_passed.png"
            await page.screenshot(path=shot3)
            print("Reto passed screenshot saved (verify no bottom text):", shot3)

        await browser.close()
        print("Test complete!")

if __name__ == "__main__":
    asyncio.run(test())
