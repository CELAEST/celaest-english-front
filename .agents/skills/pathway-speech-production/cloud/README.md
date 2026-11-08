# Generar audio de Pathway en una GPU gratis (Colab / Kaggle)

Este bundle permite generar las pistas de una o varias bases con **la misma voz, el mismo modelo y
los mismos parámetros** que en la PC local, usando una GPU prestada. No cambia la calidad.

## Qué incluye

- `scripts/gen_base.py`, `validate_profile.py` (dependencias de generación)
- `src/features/pathway/speech/profiles/base_*.ts` (todos los perfiles actuales)
- `src/features/pathway/speech/types.ts`
- `src/features/pathway/data/a1AudioManifest.json`
- `ref_larga.wav` (tu voz de referencia)
- `cloud/run_cloud.py` (orquestador)

## Google Colab (paso a paso)

1. Entrá a <https://colab.research.google.com> → **New notebook**.
2. `Runtime` → **Change runtime type** → **T4 GPU** → Save.
3. Celda 1:
   ```python
   !pip -q install chatterbox-tts faster-whisper
   ```
4. Celda 2 (subí el ZIP que armaste en tu PC):
   ```python
   from google.colab import files
   files.upload()  # elegí pathway_cloud_bundle.zip
   !unzip -q pathway_cloud_bundle.zip
   ```
5. Celda 3 (generar; ajustá el rango):
   ```python
   !cd pathway_cloud && python cloud/run_cloud.py --from 06 --to 08 --qa-model small
   ```
6. Celda 4 (descargar resultado):
   ```python
   from google.colab import files
   files.download('/content/pathway_cloud/pathway_cloud_out.zip')
   ```

**Consejo**: montá Drive y cacheá el modelo para no descargarlo en cada sesión:
```python
from google.colab import drive
drive.mount('/content/drive')
import os
os.environ['HF_HOME'] = '/content/drive/MyDrive/hf_cache'
```

## Kaggle (30 h/semana gratis)

1. Subí `pathway_cloud_bundle.zip` como **dataset privado**.
2. Creá un notebook con **GPU T4** y agregá el dataset.
3. Ejecutá:
   ```python
   !cp -r /kaggle/input/tu-dataset/pathway_cloud_bundle.zip .
   !unzip -q pathway_cloud_bundle.zip
   !cd pathway_cloud && python cloud/run_cloud.py --from 06 --to 11
   ```
4. Descargá `/kaggle/working/pathway_cloud/pathway_cloud_out.zip` desde el panel de Output.

## Volver a tu PC

Con el ZIP descargado, desde la raíz del repo:

```bash
python .agents/skills/pathway-speech-production/cloud/import_cloud_audio.py \
  --zip "C:\Users\user\Downloads\pathway_cloud_out.zip"
```

El importador:
1. copia los MP3 a `public/audio/pathway/a1/base_XX/`,
2. reconstruye el manifiesto,
3. re-mide el QA con Whisper,
4. registra y cierra cada base,
5. corre `tsc` + `vitest`.

## Reglas y límites

- **Una sola sesión a la vez**. No corras dos notebooks generando a la vez.
- Las sesiones gratuitas se cortan (~9–12 h). El script se puede relanzar: reutiliza lo ya generado
  si conservás la carpeta de salida (Drive) o volvés a subir el ZIP con los MP3.
- El modelo se descarga la primera vez (~2 GB). Con `HF_HOME` en Drive se reutiliza.
- La calidad es idéntica a la local: mismo `exaggeration`, `cfg_weight`, `temperature`, referencia y
  gate de QA (ratio ≥ 0.95 + true peak).
- Si una base falla, `run_cloud.py` corta y deja el reporte `.pathway_qa_base_XX.json` dentro del ZIP
  para diagnosticar.

## Automatizar todo con la API de Kaggle (sin navegador)

Setup **una sola vez**:

1. `pip install kaggle`
2. Kaggle → Account → **Create New API Token** → guardá `kaggle.json` en `~/.kaggle/kaggle.json`
3. Verificá tu teléfono en Kaggle (requisito para GPU gratis).

Después, un solo comando hace todo:

```bash
python .agents/skills/pathway-speech-production/cloud/kaggle_batch.py --from 12 --to 17
```

Ese comando:
1. arma el bundle,
2. lo sube/versiona como dataset privado,
3. lanza un kernel con GPU + internet,
4. espera a que termine,
5. descarga `pathway_cloud_out.zip`,
6. lo importa a tu repo (copia, manifiesto, QA, cierre y tests).

Con `--dry-run` ves qué haría sin subir nada. Con `--no-import` solo descarga el ZIP.

**No uses Playwright para Colab**: hay que guardar tu contraseña de Google, pelear con 2FA/captcha
y la cuenta puede quedar marcada. La API de Kaggle es oficial y hace lo mismo sin navegador.

## GitHub como fuente (opcional)

Si subís el repo a GitHub, el kernel puede clonarlo en vez de usar el dataset. Para este flujo no
hace falta: el bundle ya incluye perfiles, scripts y voz. GitHub Actions podría disparar
`kaggle_batch.py` con un secret, pero el comando local ya deja todo en un paso.
