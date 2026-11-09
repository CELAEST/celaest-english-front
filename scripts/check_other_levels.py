import glob, json

for level in ['b1', 'b2', 'c1']:
    reports = glob.glob(f".pathway_qa_base_{level}_*.json")
    print(f"=== LEVEL {level.upper()} QA REPORTS (found {len(reports)}) ===")
    revisar = []
    fallo = []
    for r in reports:
        try:
            data = json.load(open(r, "r", encoding="utf-8"))
            for item in data:
                if item.get("status") == "REVISAR":
                    revisar.append(f"{r}: {item.get('id')} ({item.get('ratio')})")
                elif item.get("status") == "FALLO":
                    fallo.append(f"{r}: {item.get('id')} ({item.get('ratio')})")
        except Exception:
            pass
    print(f"  REVISAR: {len(revisar)}")
    print(f"  FALLO: {len(fallo)}")
    if fallo:
        print("  Fallos:", fallo)

