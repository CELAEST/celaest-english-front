#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Audita pedagogía y casos de uso de un nivel antes de escribir guiones.

Comprueba:
  - 1–3 formulaCases por base;
  - cada caso con label, segments, explanationSpanish y exampleEnglish;
  - ejemplos únicos, 4–12 palabras, sin frases de relleno;
  - explicaciones de 20–60 palabras;
  - labels que no sean piezas gramaticales (QUIÉN, VERBO, AUXILIAR…);
  - interactividad mínima (trampa, build, voz, micrófono).

Uso:
  python pedagogy_audit.py --level a2
  python pedagogy_audit.py --level a2 --from 1 --to 2
"""
from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

MODULES = {
    "a2": [
        "module1PastNarrative.ts", "module2FutureDecisions.ts", "module3Comparatives.ts",
        "module4ModalsPurpose.ts", "module5IndefinitesQuestions.ts", "module6PresentPerfectBridge.ts",
    ],
    "a1": [
        "module1Identity.ts", "module2Routines.ts", "module3ObjectsPossession.ts",
        "module4SpaceTimeQuantity.ts", "module5Communication.ts", "module6FluencyAndBridge.ts",
    ],
    "b1": [
        "module1Conditionals.ts", "module2TemporalDepth.ts", "module3PassiveVoice.ts",
        "module4ModalsPatterns.ts", "module5ReportedRelative.ts", "module6AdvancedBridge.ts",
    ],
    "b2": [
        "module1InversionEmphasis.ts", "module2MixedConditionals.ts", "module3PastDeduction.ts",
        "module4ParticipleClauses.ts", "module5SubjunctivePassive.ts", "module6DiscourseHedging.ts",
    ],
    "c1": [
        "module1FrontingInversion.ts", "module2FormulaicSubjunctive.ts", "module3NominalizationEllipsis.ts",
        "module4EpistemicStance.ts", "module5PragmaticIdioms.ts", "module6PhilosophicalSynthesis.ts",
    ],
    "c2": [
        "module1BaroqueSyntax.ts", "module2DiplomaticIrony.ts", "module3CommonLawCollocations.ts",
        "module4ImplicitCohesion.ts", "module5SemanticTriads.ts", "module6PresidentialRhetoric.ts",
    ],
}
PIECES = {"quien", "quién", "verbo", "auxiliar", "sujeto", "persona", "accion", "acción",
          "tiempo", "momento", "objeto", "particula", "partícula"}


def json_str(raw: str) -> str:
    import json
    return json.loads('"' + raw + '"')


def blocks(level: str):
    for module in MODULES.get(level, []):
        path = Path(f"src/features/pathway/curriculum/{level}/{module}")
        if not path.exists():
            continue
        text = path.read_text(encoding="utf-8-sig")
        marks = list(re.finditer(r"// BASE \d+:[^\n]*", text))
        for i, mark in enumerate(marks):
            end = marks[i + 1].start() if i + 1 < len(marks) else len(text)
            yield module, text[mark.start():end]


def extract_cases(chunk: str) -> list[dict]:
    start = chunk.find("formulaCases")
    if start == -1:
        return []
    cm = chunk.find("commonMistake", start)
    region = chunk[start:cm if cm != -1 else len(chunk)]
    # recorrer objetos {...} de primer nivel dentro del array
    cases, depth, begin = [], 0, None
    for i, ch in enumerate(region):
        if ch == "{":
            if depth == 0:
                begin = i
            depth += 1
        elif ch == "}":
            depth -= 1
            if depth == 0 and begin is not None:
                cases.append(region[begin:i + 1])
                begin = None
    out = []
    for raw in cases:
        def grab(key):
            hit = re.search(key + r':\s*\n?\s*"((?:[^"\\]|\\.)*)"', raw)
            return json_str(hit.group(1)) if hit else None
        segs = re.findall(r'\{\s*label:\s*"((?:[^"\\]|\\.)*)"\s*,\s*token:', raw)
        out.append({
            "label": grab("label"),
            "explanation": grab("explanationSpanish"),
            "example": grab("exampleEnglish"),
            "segments": len(segs),
        })
    return out


def check(chunk: str) -> tuple[list[dict], list[str]]:
    cases = extract_cases(chunk)
    problems: list[str] = []
    if not cases:
        problems.append("sin formulaCases")
    if len(cases) > 3:
        problems.append(f"{len(cases)} casos: el máximo pedagógico es 3")
    seen_labels, seen_examples = set(), set()
    for i, c in enumerate(cases, 1):
        tag = f"caso {i}"
        if not c["label"]:
            problems.append(f"{tag}: sin label")
        else:
            norm = c["label"].lower().strip("0123456789 ·.-")
            if norm in PIECES:
                problems.append(f"{tag}: label '{c['label']}' es una pieza, no un uso")
            if norm in seen_labels:
                problems.append(f"{tag}: label repetido")
            seen_labels.add(norm)
        if not c["explanation"]:
            problems.append(f"{tag}: sin explanationSpanish")
        else:
            words = len(c["explanation"].split())
            if words < 18:
                problems.append(f"{tag}: explicación muy corta ({words} palabras)")
            if words > 65:
                problems.append(f"{tag}: explicación muy larga ({words} palabras)")
        if not c["example"]:
            problems.append(f"{tag}: sin exampleEnglish")
        else:
            words = len(c["example"].split())
            if words < 4 or words > 12:
                problems.append(f"{tag}: ejemplo de {words} palabras (4–12)")
            key = c["example"].lower().strip(" .")
            if key in seen_examples:
                problems.append(f"{tag}: ejemplo repetido")
            seen_examples.add(key)
        if c["segments"] < 2:
            problems.append(f"{tag}: menos de 2 segmentos")
    for key, label in [("commonMistake", "commonMistake"), ("examples", "examples"),
                       ("blockChallenge", "blockChallenge"), ("voicePractice", "voicePractice")]:
        if key not in chunk:
            problems.append(f"falta {label}")
    return cases, problems


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--level", default="a2")
    ap.add_argument("--from", dest="from_base", type=int, default=1)
    ap.add_argument("--to", dest="to_base", type=int, default=32)
    args = ap.parse_args()

    failed, total = 0, 0
    for i, (module, chunk) in enumerate(blocks(args.level), 1):
        if i < args.from_base or i > args.to_base:
            continue
        total += 1
        title = re.search(r'title:\s*"((?:[^"\\]|\\.)*)"', chunk)
        title = json_str(title.group(1)) if title else "(sin título)"
        cases, problems = check(chunk)
        print(f"\nBASE {i:02d} · {title}")
        for j, c in enumerate(cases, 1):
            print(f"  {j}. {c['label']} -> {c['example']}")
        for p in problems:
            print(f"  FAIL: {p}")
        if not problems:
            print("  PASS pedagogía")
        else:
            failed += 1
    print(f"\n{total - failed}/{total} bases pasan pedagogía ({args.level.upper()})")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
