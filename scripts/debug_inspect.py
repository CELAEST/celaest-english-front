import asyncio
import base64
import json
import os
import sys
import time

sys.stdout.reconfigure(encoding="utf-8")
sys.path.insert(0, os.path.abspath("scripts"))

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

        page.on("console", lambda msg: print(f"PAGE LOG: {msg.text}"))

        # Intercept auth and profile across any host/port
        await page.route("**/*auth/login*", lambda r: r.fulfill(
            status=200,
            content_type="application/json",
            body=json.dumps({
                "success": True,
                "data": {
                    "access_token": token,
                    "refresh_token": "ref_123",
                    "user": {"id": "u1", "email": "student@celaest.com", "user_metadata": {"display_name": "Student"}}
                }
            })
        ))

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

        await page.goto("http://localhost:3001/onboarding")
        await page.wait_for_timeout(1000)

        # Trigger login via the UI
        email_input = page.locator('input[type="email"]')
        if await email_input.count() > 0:
            await email_input.fill("student@celaest.com")
            pwd_input = page.locator('input[type="password"]')
            if await pwd_input.count() > 0:
                await pwd_input.fill("Password123!")
            submit_btn = page.locator('button:has-text("Sign In"), button:has-text("Iniciar Sesión")').first
            await submit_btn.click()
            print("Clicked Sign In!")
            await page.wait_for_timeout(3500)

        print("Current URL after login:", page.url)

        # Navigate to pathway
        if not page.url.endswith("/pathway"):
            await page.goto("http://localhost:3001/pathway")
            await page.wait_for_timeout(3500)

        print("Final URL:", page.url)

        stage = page.locator('[data-testid="professor-3d-stage"]')
        if await stage.count() > 0:
            state = await stage.get_attribute("data-state")
            print(f"SUCCESS! Robot Stage Found! State: {state}")
        else:
            print("Stage not found.")

        screenshot_path = os.path.join("C:/Users/user/.gemini/antigravity/brain/c68f979d-e4ea-49de-91be-227201713d6d", "mobile_prod_base01_inside.png")
        await page.screenshot(path=screenshot_path)
        print("Screenshot saved to:", screenshot_path)

        await browser.close()

if __name__ == "__main__":
    asyncio.run(test())
