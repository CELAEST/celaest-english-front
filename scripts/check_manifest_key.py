import json

with open("src/features/pathway/data/c2AudioManifest.json", "r", encoding="utf-8") as f:
    manifest = json.load(f)

for k, v in manifest.items():
    if "base_c2_04/trap.anchor" in v:
        print(f"Key in manifest: {repr(k)}")
        print(f"Value in manifest: {v}")

