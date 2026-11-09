import subprocess, glob

profiles = sorted(glob.glob("src/features/pathway/speech/profiles/c2/base_*.ts"))
print(f"Validating {len(profiles)} C2 profiles...")
failed = []
for p in profiles:
    res = subprocess.run(["python", ".agents/skills/pathway-speech-production/scripts/validate_profile.py", "--profile", p],
                         capture_output=True, text=True)
    if "PASS" not in res.stdout or res.returncode != 0:
        print(f"FAILED: {p}")
        print(res.stdout)
        print(res.stderr)
        failed.append(p)

if not failed:
    print(f"ALL {len(profiles)} C2 PROFILES PASS VALIDATION!")
else:
    print(f"{len(failed)} profiles failed validation.")

