# VOCABULARY BATCH SIZING & DATABASE CURATION BENCHMARK

## 1. Skill Activated: lexicon-curation-standard
- Enforces the 8-point automated Quality Gate (Word length/format, Spanish translation accuracy, IPA phonetic standards with acoustic stress marks, POS classification, Oxford definitions without boilerplate, natural contextual examples, CEFR level, Google TTS audio URL).
- Direct PostgreSQL table: `reading_vocabulary_cache`.

## 2. Benchmark Results on PostgreSQL (Batch Sizing Analysis)
Benchmark ejecutado contra PostgreSQL en vivo (`reading_vocabulary_cache`) con 10,779 entradas del léxico maestro:

| Tamaño de Lote (Chunk Size) | Latencia Total | Throughput (Velocidad) | Veredicto Operacional |
|---|---|---|---|
| **50 palabras** | 93.99 ms | 531.9 palabras/seg | Ineficiente (overhead de conexión/transacción) |
| **100 palabras** | 16.47 ms | 6,072.3 palabras/seg | Excelente para batches reactivos |
| **250 palabras** | 52.95 ms | 4,721.2 palabras/seg | Muy estable |
| **500 palabras** | 119.43 ms | 4,186.6 palabras/seg | Alta confiabilidad |
| **1,000 palabras (ÓPTIMO)** | **155.45 ms** | **6,433.0 palabras/seg** | **PUNTO DULCE (Máximo throughput sin saturación)** |
| **2,000 palabras** | 1,873.35 ms | 1,067.6 palabras/seg | Degradación por contención de bloqueos SQL y buffers |

### Regla de Oro para Iterar Vocabulario Masivo:
- **Para Inserción / Persistencia SQL**: Chunks de **1,000 palabras por transacción**. Permite persistir 10,000+ palabras en menos de 2.5 segundos.
- **Para Enriquecimiento con IA (LLM JSON Generation)**: Chunks de **15 a 25 palabras por prompt**. Evita el desbordamiento de tokens de salida (máx 2048/4096 tokens), garantiza latencia de 2 a 3 segundos y elimina errores de sintaxis JSON.

## 3. Estado de Certificación de la Base de Datos
- **Total Entradas Limpias en PostgreSQL**: **11,016 palabras**.
- **Filas Defectuosas (Violaciones de Calidad 1 a 8)**: **0**.
- **Tiempo de sincronización total**: **2.44 segundos**.
