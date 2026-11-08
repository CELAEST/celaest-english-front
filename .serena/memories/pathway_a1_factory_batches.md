# Fábrica A1 por lotes — estado y operación

## Herramientas nuevas (en la skill)
```bash
python .agents/skills/pathway-speech-production/scripts/pathway.py plan
python .agents/skills/pathway-speech-production/scripts/curriculum_audit.py --all --existing
python .agents/skills/pathway-speech-production/scripts/pathway.py close --base base_06
python .agents/skills/pathway-speech-production/scripts/pathway.py batch --from 06 --to 11
```
- `plan`: las 32 bases con casos, pistas, audio, registro y cierre.
- `curriculum_audit`: fidelidad al payload (título, casos, ejemplos, trampa, voz objetivo).
- `close`: idempotente; agrega import, array y `CLOSED_BASES`.
- `batch`: construye en serie, se detiene en la primera roja, cierra cada base y corre tests al final.

## Lote 1 — bases 06–11 (Módulo 2: Rutinas)
- Perfiles escritos por 3 subagentes (2 bases cada uno) y revisados centralmente.
- `validate_profile --all`: PASS 11 perfiles, 0 colisiones.
- `curriculum_audit --all --existing`: 11/11 fieles.
- `guion`: 0 errores en 06–11.
- Audio: lanzado el 7 nov ~18:43 con `batch --from 06 --to 11`; log
  `.pathway_batch_06_11.log`; reportes `.pathway_reports/base_0N.md`.
- Al cerrar cada base, `batch` la registra y la agrega a `CLOSED_BASES`; al final corre
  `tsc` + `vitest`.

## Plan de lotes restante
1. 06–11 (en curso)
2. 12–17 (Módulo 3: objetos y posesión)
3. 18–23 (Módulo 4: espacio, tiempo, cantidad)
4. 24–28 (Módulo 5: comunicación)
5. 29–32 (Módulo 6: fluidez y puente a A2)

## Reglas de operación
- Los agentes escriben perfiles y validan; **nunca** generan audio ni tocan registro/CLOSED.
- Una sola GPU: un lote de 5–6 bases por noche (~40–60 min por base).
- Si un lote se detiene, leer el log y `.pathway_reports/<base>.md`; corregir y relanzar desde esa base.
- Revisar muestras humanas al día siguiente (fórmula, trampa, speak, victoria) y `plan`.
- Los textos de boilerplate deben variar por base; el validador global detecta colisiones.


## GPU gratis (Colab/Kaggle)
- Bundle: `.agents/skills/pathway-speech-production/cloud/prepare_bundle.py` → `pathway_cloud_bundle.zip` (~1.5 MB, 17 perfiles + ref + scripts).
- Notebook: `cloud/pathway_colab.ipynb`; correr `cloud/run_cloud.py --from NN --to NN` (2–3 bases por sesión T4).
- Importador: `cloud/import_cloud_audio.py --zip salida.zip` → copia, manifiesto, QA, close, tests.
- `gen_base.py --manifest-only` reconstruye el manifiesto sin GPU ni Whisper.
- El clic de “Run” en Colab/Kaggle lo tiene que dar el usuario; no hay forma de automatizar su cuenta.
