#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Verifica que un perfil sea FIEL al currículo, no solo válido.

Compara contra el bloque de `curriculum/a1/moduleN*.ts`:
  título · cantidad de formulaCases · ejemplo de cada caso · trampa (wrong/correct)
  · ejemplos · frase objetivo de voz.

Uso:
  python curriculum_audit.py --base base_06
  python curriculum_audit.py --all
"""
from __future__ import annotations

import argparse
import re
import sys
import unicodedata
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from validate_profile import parse_profile  # noqa: E402

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

MODULES = {
    "a1": [
        "module1Identity.ts", "module2Routines.ts", "module3ObjectsPossession.ts",
        "module4SpaceTimeQuantity.ts", "module5Communication.ts", "module6FluencyAndBridge.ts",
    ],
    "a2": [
        "module1PastNarrative.ts", "module2FutureDecisions.ts", "module3Comparatives.ts",
        "module4ModalsPurpose.ts", "module5IndefinitesQuestions.ts", "module6PresentPerfectBridge.ts",
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
PROFILES = Path("src/features/pathway/speech/profiles")


def norm(text: str) -> str:
    t = unicodedata.normalize("NFD", text or "")
    t = "".join(c for c in t if unicodedata.category(c) != "Mn").lower()
    t = t.replace("’", "'").replace("‘", "'").replace("“", '"').replace("”", '"')
    return re.sub(r"\s+", " ", re.sub(r"[^a-z0-9' ]", " ", t)).strip()


def json_string(raw: str) -> str:
    import json

    return json.loads('"' + raw + '"')


def curriculum_blocks(level: str = "a1") -> list[dict]:
    blocks: list[dict] = []
    root = Path(f"src/features/pathway/curriculum/{level}")
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
                return json_string(hit.group(1)) if hit else None

            title = grab(r'title:\s*"((?:[^"\\]|\\.)*)"')
            cases = re.findall(r'exampleEnglish:\s*"((?:[^"\\]|\\.)*)"', chunk)
            examples = re.findall(r'\benglish:\s*"((?:[^"\\]|\\.)*)"', chunk)
            blocks.append({
                "title": title,
                "cases": [json_string(c) for c in cases],
                "wrong": grab(r'wrong:\s*"((?:[^"\\]|\\.)*)"'),
                "correct": grab(r'correct:\s*"((?:[^"\\]|\\.)*)"'),
                "examples": [json_string(e) for e in examples],
                "voice": grab(r'sentenceEnglish:\s*"((?:[^"\\]|\\.)*)"'),
                "module": module,
            })
    return blocks


def audit(base: str, block: dict, level: str = "a1") -> list[str]:
    errors: list[str] = []
    if level != "a1":
        name = base.replace(f"base_{level}_", "base_")
        path = PROFILES / level / f"{name}.ts"
    else:
        path = PROFILES / f"{base}.ts"
    if not path.exists():
        return [f"falta el perfil {path}"]
    profile = parse_profile(path)
    moments = profile["moments"]
    by_id = {m["id"]: m for m in moments}

    if norm(profile["header"].get("title", "")) != norm(block["title"] or ""):
        errors.append(f"título: perfil {profile['header'].get('title')!r} != currículo {block['title']!r}")

    cases = sorted({
        m["cue"].get("activeFormulaCaseIndex")
        for m in moments
        if "activeFormulaCaseIndex" in m["cue"]
    })
    n_cases = (max(cases) + 1) if cases else 1
    if n_cases != len(block["cases"]):
        errors.append(f"casos: perfil {n_cases} != currículo {len(block['cases'])}")

    for i, expected in enumerate(block["cases"]):
        model_id = f"formula.case{i + 1}.model"
        model = by_id.get(model_id) or (by_id.get("formula.model") if i == 0 else None)
        # Se acepta el ejemplo del caso, la forma correcta de la trampa o un ejemplo del bloque:
        # algunas bases certificadas ilustran el caso con la frase objetivo.
        allowed = {norm(expected), norm(block["correct"] or "")} | {norm(e) for e in block["examples"]}
        if not model:
            errors.append(f"falta {model_id}")
        elif norm(model["text"]) not in allowed:
            errors.append(f"{model_id}: {model['text']!r} no está en el currículo ({expected!r})")

    if block["wrong"]:
        if not by_id.get("trap.wrong"):
            errors.append("falta trap.wrong")
        elif norm(by_id["trap.wrong"]["text"]) != norm(block["wrong"]):
            errors.append(f"trap.wrong: {by_id['trap.wrong']['text']!r} != {block['wrong']!r}")
    if block["correct"]:
        if not by_id.get("trap.right"):
            errors.append("falta trap.right")
        elif norm(by_id["trap.right"]["text"]) != norm(block["correct"]):
            errors.append(f"trap.right: {by_id['trap.right']['text']!r} != {block['correct']!r}")

    en_texts = {norm(m["text"]) for m in moments if m["language"] == "en"}
    for example in block["examples"]:
        if norm(example) not in en_texts:
            errors.append(f"ejemplo del currículo ausente en pistas EN: {example!r}")

    voice = block["voice"]
    if voice:
        speak = by_id.get("speak.model")
        target = profile["header"].get("targetSentence", "")
        if not speak:
            errors.append("falta speak.model")
        elif norm(speak["text"]) != norm(voice):
            errors.append(f"speak.model: {speak['text']!r} != voz del currículo {voice!r}")
        if norm(target) != norm(voice):
            errors.append(f"targetSentence: {target!r} != voz del currículo {voice!r}")

    return errors


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--level", default="a1", choices=["a1", "a2", "b1", "b2", "c1", "c2"])
    ap.add_argument("--base")
    ap.add_argument("--all", action="store_true")
    ap.add_argument("--existing", action="store_true", help="solo perfiles que ya existen")
    args = ap.parse_args()
    blocks = curriculum_blocks(args.level)
    prefix = "base" if args.level == "a1" else f"base_{args.level}"
    def profile_path(i: int) -> Path:
        name = f"base_{i:02d}.ts" if args.level == "a1" else f"base_{i:02d}.ts"
        return (PROFILES / args.level / name) if args.level != "a1" else (PROFILES / name)
    if args.base:
        n = int(re.search(r"(\d+)$", args.base).group(1))
        targets = [(args.base, blocks[n - 1])]
    elif args.all:
        targets = []
        for i, b in enumerate(blocks, 1):
            base = f"base_{i:02d}" if args.level == "a1" else f"base_{args.level}_{i:02d}"
            if args.existing and not profile_path(i).exists():
                continue
            targets.append((base, b))
    else:
        ap.error("pasá --base base_0N o --all")

    failed = 0
    for base, block in targets:
        errors = audit(base, block, args.level)
        if errors:
            failed += 1
            print(f"FAIL {base} ({block['module']})")
            for e in errors:
                print(f"  - {e}")
        else:
            print(f"PASS {base} · {block['title']}")
    print(f"\n{len(targets) - failed}/{len(targets)} perfiles fieles al currículo")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
