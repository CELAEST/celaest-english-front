import asyncio
import base64
import json
import os
import sys
import time
from playwright.async_api import async_playwright

sys.stdout.reconfigure(encoding="utf-8")

ARTIFACT_DIR = "C:/Users/user/.gemini/antigravity/brain/c68f979d-e4ea-49de-91be-227201713d6d"

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
            user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1",
            is_mobile=True,
            has_touch=True,
            device_scale_factor=2,
        )

        page = await context.new_page()

        # Intercept backend API requests so offline/dev Playwright doesn't get 401 unauthorized redirect
        await page.route("**/user/profile**", lambda route: route.fulfill(
            status=200,
            content_type="application/json",
            body=json.dumps({
                "status": "success",
                "data": {
                    "id": "user-123",
                    "name": "Student",
                    "profession": "Professional",
                    "cefrLevel": "A1",
                    "learningGoal": "Professional Fluency"
                }
            })
        ))

        await page.route("**/auth/**", lambda route: route.fulfill(
            status=200,
            content_type="application/json",
            body=json.dumps({"status": "success", "data": {"token": token}})
        ))

        # 1. Set credentials in origin before navigation
        await page.add_init_script(f"""() => {{
            const uid = 'user-123';
            const userObj = {{ id: uid, name: 'Student', email: 'test@example.com', onboardingCompleted: true }};
            localStorage.setItem('lingua_access_token', '{token}');
            localStorage.setItem('lingua_refresh_token', 'refresh_token_123');
            localStorage.setItem('lingua_auth_user', JSON.stringify(userObj));
            localStorage.setItem('lingua_onboarding_completed', 'true');
            localStorage.setItem('lingua_onboarding_completed_' + uid, 'true');
            localStorage.setItem('lingua_onboarding_completed_test@example.com', 'true');
            localStorage.setItem('lingua_user_level', 'A1');
            localStorage.setItem('celaest:active_profession', 'Professional');
        }}""")

        # 2. Navigate directly to /pathway
        print("Navigating to http://localhost:3001/pathway ...")
        await page.goto("http://localhost:3001/pathway")
        await page.wait_for_timeout(3500)

        # 3. Check for stage
        stage = page.locator('[data-testid="professor-3d-stage"]')
        if await stage.count() > 0:
            initial_state = await stage.get_attribute("data-state")
            print(f"SUCCESS: Robot Stage Found! Initial state: {initial_state}")
        else:
            print("Checking stage selector...")
            current_url = page.url
            print("Current URL:", current_url)

        path_initial = os.path.join(ARTIFACT_DIR, "mobile_prod_base01_inside.png")
        await page.screenshot(path=path_initial)
        print(f"Screenshot saved to: {path_initial}")

        # 4. Look for play / comenzar clase button
        play_btn = page.locator('button:has-text("Comenzar Clase"), button:has-text("Clase"), button[aria-label="Dictar clase"], button[aria-label="Comenzar clase"]').first
        if await play_btn.count() > 0:
            btn_text = await play_btn.text_content()
            print(f"Found class action button: '{btn_text}', clicking to start lecture...")
            await play_btn.click()
            await page.wait_for_timeout(2000)

            state_after = await stage.get_attribute("data-state") if await stage.count() > 0 else "unknown"
            print(f"State after starting lecture: {state_after}")

            path_speaking = os.path.join(ARTIFACT_DIR, "mobile_prod_base01_speaking.png")
            await page.screenshot(path=path_speaking)
            print(f"Speaking Screenshot saved to: {path_speaking}")

        await browser.close()
        print("Mobile verification complete!")

if __name__ == "__main__":
    asyncio.run(main())
