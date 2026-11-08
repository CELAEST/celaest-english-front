#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Linter de calidad de guion Pathway: pedagogía, flujo del sistema, fluidez y casos de uso.

No reemplaza a `validate_profile.py` (contrato duro). Este linter busca que el guion sea
*bueno*, no solo válido:
  - pedagogía: cada caso explicado, trampa con ancla, ejemplos con fonética, sin redundancia;
  - flujo: pausas por rol, cues coherentes, inglés siempre precedido de español;
  - fluidez: frases respirables, sin símbolos que el TTS verbalice, sin números/MAYÚSCULAS;
  - casos de uso: UC-01…UC-10 cubiertos por ids concretos.

Uso:
  python guion_lint.py --profile src/features/pathway/speech/profiles/base_03.ts --cases 3
  python guion_lint.py --all
"""
from __future__ import annotations

import argparse
import re
import sys
import unicodedata
from difflib import SequenceMatcher
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from validate_profile import parse_profile, sanitize  # noqa: E402

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

FORBIDDEN = {
    "+": "se lee 'más' o se ignora: escribí 'más'",
    "/": "se lee 'o' o se corta: escribí la alternativa",
    "\\": "barra invertida",
    "&": "se lee 'y' o se corta: escribí 'y'",
    "#": "numeral",
    "*": "asterisco",
    "(": "paréntesis",
    ")": "paréntesis",
    "[": "corchete",
    "]": "corchete",
    '"': "comilla",
    "“": "comilla",
    "”": "comilla",
    "...": "puntos suspensivos: usar puntuación real + pauseAfterMs",
    "…": "puntos suspensivos: usar puntuación real + pauseAfterMs",
    "→": "flecha",
    "·": "punto medio",
    "✓": "check",
    "✗": "cruz",
    "✅": "emoji",
    "❌": "emoji",
}

UC_MAP = {
    "UC-01 Orientación (motor, 1.ª vez)": [],
    "UC-02 Fórmula": ["formula.rule"],
    "UC-02b Trampa": ["trap.intro", "trap.wrong", "trap.pivot", "trap.right", "trap.anchor"],
    "UC-02c Caza la trampa": ["trapcheck.intro", "trapcheck.error", "trapcheck.success"],
    "UC-03 Ejemplos": ["example.phonetic"],
    "UC-04 Preguntar (IA en vivo)": [],
    "UC-05 Build": ["build.transition", "build.intro"],
    "UC-06 Error build": ["build.error"],
    "UC-07 Acierto build": ["build.success"],
    "UC-08 Speaks": ["speak.lead", "speak.model", "speak.instruction"],
    "UC-09 Voz": ["voice.retry", "voice.not_heard", "mic.error"],
    "UC-10 Victoria": ["voice.victory"],
}

# Casos que no se pregrababan en el perfil: los resuelve el motor o la IA en vivo.
UC_EXTERNAL = {"UC-01 Orientación (motor, 1.ª vez)", "UC-04 Preguntar (IA en vivo)"}


def norm(text: str) -> str:
    t = unicodedata.normalize("NFD", text or "")
    t = "".join(c for c in t if unicodedata.category(c) != "Mn").lower()
    return re.sub(r"\s+", " ", re.sub(r"[^a-z0-9\s]", " ", t)).strip()


def words(text: str) -> list[str]:
    return norm(text).split()


def similarity(a: str, b: str) -> float:
    return SequenceMatcher(None, words(a), words(b)).ratio()


def lint(profile: dict, expected_cases: int | None = None) -> dict:
    ms = profile["moments"]
    base = profile["header"].get("baseId", profile["path"].stem)
    ids = [m["id"] for m in ms]
    by_id = {m["id"]: m for m in ms}
    cases = sorted({m["cue"].get("activeFormulaCaseIndex") for m in ms if "activeFormulaCaseIndex" in m["cue"]})
    n_cases = (max(cases) + 1) if cases else 1
    errors: list[str] = []
    warnings: list[str] = []

    def err(cat: str, msg: str) -> None:
        errors.append(f"{cat} · {msg}")

    def warn(cat: str, msg: str) -> None:
        warnings.append(f"{cat} · {msg}")

    # ---------- PEDAGOGÍA ----------
    if expected_cases is not None and n_cases != expected_cases:
        err("PED", f"el currículo declara {expected_cases} caso(s) y el guion explica {n_cases}")
    if n_cases > 1:
        for idx in range(n_cases):
            intro = [
                m for m in ms
                if m["cue"].get("activeFormulaCaseIndex") == idx and m["cue"].get("formulaRevealCount") == 1
            ]
            if not intro:
                err("PED", f"caso {idx + 1} sin intro en español")
                continue
            text = intro[0]["text"]
            if not re.search(r"\b(primer|segundo|tercer|cuarto|uso|caso)\b", text, re.I):
                warn("PED", f"{intro[0]['id']}: el caso {idx + 1} no se anuncia como uso/caso")
            if len(text.split()) > 30:
                warn("PED", f"{intro[0]['id']}: intro de caso con {len(text.split())} palabras (ideal ≤ 25)")
        rule = by_id.get("formula.rule")
        if rule and not re.search(r"uno por uno|una por una|casos|usos|parejas|veremos", rule["text"], re.I):
            warn("PED", "formula.rule no anuncia que hay varios casos")
    anchor = by_id.get("trap.anchor")
    if not anchor:
        err("PED", "falta trap.anchor (ancla mental)")
    elif not re.search(r"ancla|no dudar|record", anchor["text"], re.I):
        warn("PED", "trap.anchor no cierra con una imagen mental ('ancla', 'no dudar')")
    pivot = by_id.get("trap.pivot")
    if pivot and not re.search(r"sino|en su lugar|en inglés|más bien", pivot["text"], re.I):
        warn("PED", "trap.pivot no contrasta el error con la forma natural")
    phonetic = by_id.get("example.phonetic")
    if phonetic:
        if not phonetic.get("canonical"):
            err("PED", "example.phonetic sin canonical (el QA no tiene contra qué comparar)")
        if not re.search(r"uni[oó]n|se unen|se pega|enlaz|suena junto", phonetic["text"], re.I):
            warn("PED", "example.phonetic no explica la unión/linking")
    en_examples = [m for m in ms if m["beat"] == "EXAMPLES" and m["language"] == "en"]
    if len(en_examples) < 2:
        warn("PED", f"solo {len(en_examples)} ejemplo(s) en inglés (el contrato pide 2)")
    speak_model = by_id.get("speak.model")
    target = profile["header"].get("targetSentence", "")
    if speak_model and target and norm(speak_model["text"]) != norm(target):
        err("PED", f"speak.model ({speak_model['text']!r}) no coincide con targetSentence ({target!r})")

    # redundancia: pistas ES largas demasiado parecidas
    es_long = [m for m in ms if m["language"] == "es" and len(m["text"].split()) >= 9]
    for i, a in enumerate(es_long):
        for b in es_long[i + 1:]:
            sim = similarity(a["text"], b["text"])
            if sim >= 0.82:
                warn("PED", f"{a['id']} y {b['id']} se repiten ({sim:.0%})")

    # ---------- FLUIDEZ ----------
    for m in ms:
        mid, text = m["id"], m["text"]
        for token, why in FORBIDDEN.items():
            if token in text:
                (err if token in {"...", "…"} else warn)("FLU", f"{mid}: símbolo {token!r} ({why})")
        if not re.search(r"[.!?:]$", text.strip()):
            warn("FLU", f"{mid}: no termina en puntuación (el TTS no respira igual)")
        if re.search(r"[!?]{2,}", text):
            warn("FLU", f"{mid}: puntuación repetida")
        if re.search(r"\b[A-ZÁÉÍÓÚÑ]{3,}\b", text):
            warn("FLU", f"{mid}: palabra en MAYÚSCULAS (el TTS puede deletrearla)")
        if m["language"] == "es" and re.search(r"\d", text):
            warn("FLU", f"{mid}: número en dígitos; escribirlo como se dice")
        for sentence in re.split(r"(?<=[.!?])\s+", text.strip()):
            n = len(sentence.split())
            if n > 40:
                err("FLU", f"{mid}: oración de {n} palabras (máx. 40)")
            elif n > 28:
                warn("FLU", f"{mid}: oración de {n} palabras (ideal ≤ 28)")
        if len(text.split()) > 90:
            err("FLU", f"{mid}: pista de {len(text.split())} palabras; partir")
        elif len(text.split()) > 45:
            warn("FLU", f"{mid}: pista de {len(text.split())} palabras; revisar corte")
    lead = by_id.get("speak.lead")
    if lead and len(lead["text"].split()) > 12:
        warn("FLU", "speak.lead demasiado largo; debe ser una invitación corta")
    instruction = by_id.get("speak.instruction")
    if instruction and len(instruction["text"].split()) > 22:
        warn("FLU", "speak.instruction demasiado larga; el alumno ya está frente al micrófono")

    # ---------- FLUJO DEL SISTEMA ----------
    for i, m in enumerate(ms):
        nxt = ms[i + 1] if i + 1 < len(ms) else None
        pause = m.get("pause")
        if m["language"] == "en":
            if pause not in (380, 750):
                err("FLO", f"{m['id']}: pausa {pause} tras modelo inglés (esperado 750 o 380)")
        elif nxt and nxt["language"] == "en":
            # 380 solo cuando el inglés es el modelo de ESTA idea (mismo beat y mismo caso/ejemplo).
            same_idea = m["id"] == "speak.lead"
            if nxt["beat"] == m["beat"]:
                if m["beat"] == "EXAMPLES":
                    same_idea = m["cue"].get("activeExampleIndex") == nxt["cue"].get("activeExampleIndex")
                else:
                    same_idea = True
            expected = 380 if same_idea else 260
            if pause != expected:
                err("FLO", f"{m['id']}: pausa {pause} antes del modelo inglés (esperado {expected})")
        else:
            if pause != 260:
                err("FLO", f"{m['id']}: pausa {pause} de transición (esperado 260)")
        if m["language"] == "en":
            prev = ms[i - 1] if i > 0 else None
            if not prev or prev["language"] != "es":
                warn("FLO", f"{m['id']}: el inglés no viene precedido de un conector en español")
    # cues
    last_case = -1
    last_example = -1
    for m in ms:
        cue = m.get("cue", {})
        if "activeFormulaCaseIndex" in cue:
            if cue["activeFormulaCaseIndex"] < last_case:
                err("FLO", f"{m['id']}: activeFormulaCaseIndex retrocede")
            last_case = cue["activeFormulaCaseIndex"]
            if m["language"] == "en" and cue.get("formulaRevealCount") != 3:
                err("FLO", f"{m['id']}: modelo de fórmula sin formulaRevealCount 3")
            if m["language"] == "es" and m["id"].startswith("formula.case") and cue.get("formulaRevealCount") != 1:
                err("FLO", f"{m['id']}: intro de caso sin formulaRevealCount 1")
        if "activeExampleIndex" in cue:
            if cue["activeExampleIndex"] < last_example:
                err("FLO", f"{m['id']}: activeExampleIndex retrocede")
            last_example = cue["activeExampleIndex"]
    # ---------- CASOS DE USO ----------
    uc = {}
    for name, needed in UC_MAP.items():
        missing = [x for x in needed if x not in by_id]
        uc[name] = {"ok": not missing, "missing": missing}
    for name, state in uc.items():
        if not state["ok"]:
            err("UC", f"{name}: faltan {', '.join(state['missing'])}")

    return {
        "base": base,
        "errors": errors,
        "warnings": warnings,
        "uc": uc,
        "cases": n_cases,
        "stats": {
            "moments": len(ms),
            "es": sum(1 for m in ms if m["language"] == "es"),
            "en": sum(1 for m in ms if m["language"] == "en"),
            "words": sum(len(m["text"].split()) for m in ms),
        },
    }


def print_report(result: dict) -> None:
    print(f"\n=== GUION {result['base']} ===")
    print(f"{result['stats']['moments']} pistas · {result['stats']['es']} es / {result['stats']['en']} en · "
          f"{result['stats']['words']} palabras · {result['cases']} caso(s)")
    print("Cobertura de casos de uso:")
    for name, state in result["uc"].items():
        if name in UC_EXTERNAL and not state["missing"]:
            print(f"  N/A  {name}")
        else:
            print(f"  {'OK ' if state['ok'] else 'FALTA'} {name}" + (f" -> {state['missing']}" if not state["ok"] else ""))
    for e in result["errors"]:
        print(f"  ERROR {e}")
    for w in result["warnings"]:
        print(f"  WARN  {w}")
    print(f"\nGuion: {len(result['errors'])} error(es), {len(result['warnings'])} aviso(s)")


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--profile")
    ap.add_argument("--all", action="store_true")
    ap.add_argument("--profiles-dir", default="src/features/pathway/speech/profiles")
    ap.add_argument("--cases", type=int, default=None)
    args = ap.parse_args()

    paths = (
        sorted(Path(args.profiles_dir).glob("base_*.ts"))
        if args.all else ([Path(args.profile)] if args.profile else [])
    )
    if not paths:
        ap.error("pasá --profile o --all")

    bad = 0
    for p in paths:
        if not p.exists():
            print(f"no existe: {p}")
            bad += 1
            continue
        result = lint(parse_profile(p), args.cases if len(paths) == 1 else None)
        print_report(result)
        bad += 1 if result["errors"] else 0
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main())
