#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Audita la estructura de un nivel (por defecto A2) antes de escribir guiones.

Revisa, base por base:
  - que exista al menos un formulaCase y que cada caso tenga label, explicación y ejemplo;
  - que haya 2+ ejemplos, commonMistake, blockChallenge y voicePractice;
  - que los casos no estén duplicados;
  - que la cantidad de casos sea coherente con los usos que anuncia la regla.

Uso:
  python a2_audit.py
  python a2_audit.py --level a2 --verbose
"""
from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

LEVELS = {
    "a1": "a1",
    "a2": "a2",
    "b1": "b1",
}
MODULES = {
    "a2": [
        "module1PastNarrative.ts",
        "module2FutureDecisions.ts",
        "module3Comparatives.ts",
        "module4ModalsPurpose.ts",
        "module5IndefinitesQuestions.ts",
        "module6PresentPerfectBridge.ts",
    ],
    "a1": [
        "module1Identity.ts", "module2Routines.ts", "module3ObjectsPossession.ts",
        "module4SpaceTimeQuantity.ts", "module5Communication.ts", "module6FluencyAndBridge.ts",
    ],
}


def json_str(raw: str) -> str:
    import json
    return json.loads('"' + raw + '"')


def parse_blocks(level: str) -> list[dict]:
    root = Path(f"src/features/pathway/curriculum/{level}")
    blocks: list[dict] = []
    for module in MODULES.get(level, []):
        path = root / module
        if not path.exists():
            continue
        text = path.read_text(encoding="utf-8-sig")
        marks = list(re.finditer(r"// BASE \d+:[^\n]*", text))
        for i, mark in enumerate(marks):
            end = marks[i + 1].start() if i + 1 < len(marks) else len(text)
            chunk = text[mark.start():end]

            def grab(pattern: str) -> str | None:
                hit = re.search(pattern, chunk)
                return json_str(hit.group(1)) if hit else None

            cm = chunk.find("commonMistake")
            fc = chunk.find("formulaCases")
            has_cases = fc != -1
            cases_start = fc if has_cases else 0
            cases_part = chunk[cases_start:cm] if (cm != -1 and has_cases) else (chunk[cases_start:] if has_cases else "")
            labels = re.findall(r'label:\s*"((?:[^"\\]|\\.)*)"', cases_part)
            case_examples = re.findall(r'exampleEnglish:\s*"((?:[^"\\]|\\.)*)"', cases_part)
            case_expl = re.findall(r'explanationSpanish:\s*\n?\s*"((?:[^"\\]|\\.)*)"', cases_part)
            seg_tokens = re.findall(r'token:\s*"((?:[^"\\]|\\.)*)"', cases_part)
            examples_part = chunk[cm:] if cm != -1 else chunk
            examples = [json_str(x) for x in re.findall(r'\benglish:\s*"((?:[^"\\]|\\.)*)"', examples_part)]
            blocks.append({
                "module": module,
                "title": grab(r'title:\s*"((?:[^"\\]|\\.)*)"'),
                "tagline": grab(r'ruleTaglineSpanish:\s*\n?\s*"((?:[^"\\]|\\.)*)"'),
                "has_cases": "formulaCases" in chunk,
                "labels": [json_str(x) for x in labels] if "formulaCases" in chunk else [],
                "case_examples": [json_str(x) for x in case_examples],
                "case_explanations": [json_str(x) for x in case_expl],
                "tokens": [json_str(x) for x in seg_tokens],
                "examples": examples,
                "wrong": grab(r'wrong:\s*"((?:[^"\\]|\\.)*)"'),
                "correct": grab(r'correct:\s*"((?:[^"\\]|\\.)*)"'),
                "voice": grab(r'sentenceEnglish:\s*"((?:[^"\\]|\\.)*)"'),
                "has_challenge": "blockChallenge" in chunk,
                "has_bridge": "bridgeModule" in chunk,
            })
    return blocks


def audit(block: dict) -> list[str]:
    problems: list[str] = []
    n = len(block["labels"])
    if not block["has_cases"]:
        problems.append("SIN formulaCases: la fórmula solo tiene segmentos, no casos de uso")
    elif n == 0:
        problems.append("formulaCases vacío")
    if len(block["case_examples"]) < n:
        problems.append(f"{n} casos pero {len(block['case_examples'])} ejemplos")
    if len(block["case_explanations"]) < n:
        problems.append(f"{n} casos pero {len(block['case_explanations'])} explicaciones")
    if len(set(block["labels"])) != n:
        problems.append("labels de caso duplicados")
    if len(block["examples"]) < 2:
        problems.append(f"solo {len(block['examples'])} ejemplo(s) de bloque")
    if not block["wrong"] or not block["correct"]:
        problems.append("commonMistake incompleto")
    if not block["voice"]:
        problems.append("sin voicePractice")
    if not block["has_challenge"]:
        problems.append("sin blockChallenge")
    if not block["has_bridge"]:
        problems.append("sin bridgeModule")
    # Heurística: la regla anuncia varios usos pero solo hay un caso.
    tag = (block["tagline"] or "").lower()
    if n == 1 and any(k in tag for k in (" vs ", " y ", " o ", "según", "depende")):
        problems.append("la regla anuncia varios usos y solo hay 1 caso")
    return problems


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--level", default="a2")
    ap.add_argument("--verbose", action="store_true")
    args = ap.parse_args()
    blocks = parse_blocks(args.level)
    if not blocks:
        print(f"No encontré bases para {args.level}")
        return 1

    failed = 0
    for i, b in enumerate(blocks, 1):
        problems = audit(b)
        if problems:
            failed += 1
        print(f"\nBASE {i:02d} · {b['title']}  [{b['module']}]")
        print(f"  casos: {len(b['labels'])} · ejemplos: {len(b['examples'])}")
        for j, label in enumerate(b["labels"]):
            ex = b["case_examples"][j] if j < len(b["case_examples"]) else "—"
            print(f"    {j + 1}. {label} -> {ex}")
        if args.verbose:
            print(f"  tagline: {b['tagline']}")
            print(f"  examples: {b['examples']}")
        for p in problems:
            print(f"  WARN: {p}")

    print(f"\n{len(blocks) - failed}/{len(blocks)} bases estructuralmente completas")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
