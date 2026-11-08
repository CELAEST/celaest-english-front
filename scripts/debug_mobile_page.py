import asyncio
import base64
import json
import os
import sys
import time
from playwright.async_api import async_playwright

def build_valid_jwt():
    header = base64.urlsafe_b64encode(b'{"alg":"HS256","typ":"JWT"}').decode().rstrip("=")
    payload_data = {
        "sub": "user-123",
        "user_id": "user-123",
        "email": "test@example.com",
        "name": "Student",
        "exp": int(time.time()) + 86400 * 30
    }
    payload = base64.urlsafe_b64encode(json.dumps(payload_data).encode()).decode().rstrip("=")
    return f"{header}.{payload}.validsignature"

async def main():
    token = build_valid_jwt()
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            viewport={"width": 390, "height": 844},
            is_mobile=True,
            has_touch=True,
            device_scale_factor=2
        )
        page = await context.new_page()

        page.on("console", lambda m: print(f"[{m.type.upper()}] {m.text}"))
        page.on("pageerror", lambda e: print(f"[PAGE ERROR] {e}"))
        page.on("requestfailed", lambda req: print(f"[REQ FAILED] {req.url} -> {req.failure}"))
        page.on("response", lambda res: print(f"[RES] {res.status} {res.url} [{res.headers.get('content-type', '')}]") if ".js" in res.url or ".ts" in res.url or ".tsx" in res.url else None)

        await page.route("**/api/v1/**", lambda r: r.fulfill(
            status=200,
            content_type="application/json",
            body=json.dumps({"status": "success", "data": {"id": "user-123", "name": "Student", "profession": "Professional", "cefrLevel": "A1", "learningGoal": "Professional Fluency", "onboardingCompleted": True}})
        ))

        await page.add_init_script(f"""() => {{
            const uid = 'user-123';
            localStorage.setItem('lingua_access_token', '{token}');
            localStorage.setItem('lingua_refresh_token', 'refresh_token_123');
            localStorage.setItem('lingua_auth_user', JSON.stringify({{ id: uid, name: 'Student', email: 'test@example.com', onboardingCompleted: true }}));
            localStorage.setItem('lingua_onboarding_completed', 'true');
            localStorage.setItem('lingua_onboarding_completed_' + uid, 'true');
            localStorage.setItem('lingua_user_level', 'A1');
            localStorage.setItem('celaest:active_profession', 'Professional');
        }}""")

        token = "dev_mock_token_no_dots"
        await page.goto("http://localhost:3001/")
        await page.evaluate(f"""() => {{
            const uid = 'user-123';
            localStorage.setItem('lingua_access_token', '{token}');
            localStorage.setItem('lingua_refresh_token', '{token}');
            localStorage.setItem('lingua_auth_user', JSON.stringify({{ id: uid, name: 'Student', email: 'test@example.com', onboardingCompleted: true }}));
            localStorage.setItem('lingua_onboarding_completed', 'true');
            localStorage.setItem('lingua_onboarding_completed_' + uid, 'true');
            localStorage.setItem('lingua_onboarding_completed_test@example.com', 'true');
            localStorage.setItem('lingua_user_level', 'A1');
            localStorage.setItem('celaest:active_profession', 'Professional');
        }}""")

        print("Navigating to /pathway ...")
        await page.goto("http://localhost:3001/pathway")
        await page.wait_for_timeout(3500)

        stage = page.locator('[data-testid="professor-3d-stage"]')
        print("Stage count:", await stage.count())
        if await stage.count() > 0:
            print("Initial Data-state:", await stage.get_attribute("data-state"))

        # Switch to Base 03
        node_dropdown = page.locator('button:has-text("BASE 01")').first
        if await node_dropdown.count() > 0:
            print("Opening node selector...")
            await node_dropdown.click()
            await page.wait_for_timeout(1000)
            base03_item = page.get_by_text("Base 03").first
            if await base03_item.count() > 0:
                print("Selecting Base 03...")
                await base03_item.click()
                await page.wait_for_timeout(2500)
                await page.screenshot(path="C:/Users/user/.gemini/antigravity/brain/c68f979d-e4ea-49de-91be-227201713d6d/mobile_debug_base03.png")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
