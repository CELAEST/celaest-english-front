# Skill — Pedagogía Pathway (casos de uso, explicación e interactividad)

Esta skill existe para que una base no sea “una lista de temas” sino **una clase que enseña una
decisión**, la explica por casos y la hace practicar. Se aplica antes de escribir perfiles, guiones
o audio.

## 1. Leyes

1. **Una base = una competencia.** Si el título necesita “y” para abarcar dos decisiones
   distintas, son dos bases o hay que recortar.
2. **Un caso = una decisión comunicativa.** No es una pieza gramatical (“QUIÉN”, “AUXILIAR”,
   “VERBO”). Es una situación donde el estudiante elige entre formas: “cortés vs directo”,
   “plan vs decisión instantánea”, “sonido /t/ vs /d/ vs /ɪd/”.
3. **Cada caso se explica y se ejemplifica.** Sin `explanationSpanish` y `exampleEnglish` no es
   un caso: es una etiqueta.
4. **Máximo 3 casos por base.** 4+ casos saturan; si hay más, se agrupan por la misma decisión o
   se mueven a otra base.
5. **Cada caso tiene un ejemplo propio, natural y distinto.** No se repite la misma frase para
   dos casos; no se inventan frases raras para “cumplir”.
6. **La explicación dice cuándo y por qué, no solo qué.** Debe incluir el contraste (“con X, en
   cambio, Y”) y una señal para decidir.
7. **Nada de información por información.** Cada frase del guion debe enseñar, contrastar o hacer
   practicar. Datos curiosos, listas largas y reglas que no se usan se eliminan.
8. **La interactividad se diseña con el caso.** Cada caso debe aparecer en la fórmula, en la
   trampa o en el build; el estudiante tiene que **elegir**, no solo escuchar.
9. **Un solo camino correcto por interacción.** Si hay dos respuestas válidas, se aceptan ambas o
   se cambia la consigna. Un botón que no lleva a nada es un error de diseño.
10. **Primero se valida la estructura; después el audio.** Un MP3 perfecto de una clase
    incompleta sigue siendo una clase incompleta.

## 2. Cómo descubrir los casos

Para cada base:

1. Leer `title`, `focus`, `ruleTaglineSpanish`, `formulaSegments`, `commonMistake`, `examples`,
   `voicePractice`.
2. Escribir en una frase: **¿qué decisión tiene que tomar el estudiante?**
3. Listar situaciones reales donde esa decisión cambia la forma.
4. Agrupar situaciones que usan **la misma forma por la misma razón**.
5. Quedarse con 1–3 grupos. Cada grupo es un caso.
6. Verificar que los casos cubren el título y la trampa; si un uso importante no entra, la base
   está mal recortada.

**Prueba de fuego:** si no podés escribir “Caso 1: cuando…, usás…; Caso 2: cuando…, usás…”, no
son casos, son piezas.

## 3. Contrato de un caso

```ts
{
  label: "01 · Sonido /t/",                 // uso, no pieza
  segments: [                               // 2–3 piezas de ESE uso
    { label: "VERBO + -ED", token: "finished · worked", tone: "violet" },
    { label: "SONIDO", token: "/t/ sin sílaba extra", tone: "emerald" },
  ],
  explanationSpanish: "Cuando el verbo termina en sonido sordo (p, k, f, s, ch, sh), la -ed suena /t/. Se dice en un solo golpe, sin añadir sílaba.",
  exampleEnglish: "We finished the task on time.",
}
```

Reglas:
- `label`: “01 · …”, corto, orientado a la situación.
- `segments`: no repiten los 3 segmentos globales si no aplican; muestran la forma de ese caso.
- `explanationSpanish`: 2–3 frases; incluye señal de decisión y contraste.
- `exampleEnglish`: 4–10 palabras, natural, profesional, con la forma exacta del caso.

## 4. Estándar de explicación

Toda explicación responde:
1. **Cuándo** se usa (señal).
2. **Qué** cambia en la forma.
3. **Contraste** con la alternativa o con el error típico.

Prohibido:
- “Se usa para expresar…” sin decir cuándo.
- Repetir el título con otras palabras.
- Reglas inventadas o excepciones que la base no necesita.
- Más de 55 palabras por explicación.

## 5. Estándar de ejemplo

- 4–10 palabras.
- Una sola idea.
- Vocabulario A2 (o A1 reciclado), sin modismos.
- La forma del caso aparece **completa**.
- Distinto de los demás casos y de `voicePractice`.
- Si el ejemplo del currículo sirve, se usa; si no, se escribe uno mejor y se actualiza el
  currículo, no se fuerza el viejo.

## 6. Carga cognitiva

- Máx. **3 casos** y **3 ejemplos nuevos** por base.
- Máx. **550 palabras** de guion.
- Máx. **7 ítems nuevos** (palabras/estructuras) por base.
- Un solo contraste por caso.
- No adelantar temas de otra base.
- Si el tema trae 5 verbos, no se explican los 5: se eligen 3 representativos y se practica la
  decisión.

## 7. Contrato de interactividad

Cada base debe tener, como mínimo:

| Hook | Función | Regla |
|---|---|---|
| `trapcheck.intro` | Elegir la frase correcta | 2 opciones, 1 correcta |
| `trapcheck.error` | Feedback del error | Explica por qué, no solo “mal” |
| `trapcheck.success` | Confirmación | Refuerza la señal del caso |
| `build.intro/error/success` | Armar la frase | Fichas + 1 distractor máximo |
| `speak.model/instruction` | Repetir el modelo | Frase objetivo |
| `voice.retry/not_heard/victory` | Micrófono | Reintento claro, sin castigo |
| `mic.error` | Permiso | Salida alternativa |

Reglas:
- La opción incorrecta debe ser **el error real** de la base, no una frase absurda.
- El feedback nombra la señal (“faltó el auxiliar”, “la -ed suena /t/”), no solo “incorrecto”.
- El build usa la frase objetivo o un caso; nunca una frase que no se enseñó.
- Si el estudiante falla, puede reintentar; nunca queda trabado.
- La victoria refuerza **lo que hizo bien**, no es un “¡genial!” vacío.

## 8. Anti-patrones (rechazo automático)

- Casos que son piezas: “QUIÉN”, “VERBO”, “AUXILIAR”.
- Tres casos que en realidad son la misma decisión.
- Un caso sin ejemplo o con el ejemplo de otro caso.
- Ejemplos que el TTS no puede decir o que suenan a traducción literal.
- Explicaciones de 80 palabras que repiten el título.
- Meterse con “además”, “también podés”, “existen otros usos” para tapar que falta un caso.
- Más de 3 casos “para que no falte nada”.
- Interacciones donde las dos opciones son correctas o ninguna lo es.

## 9. Flujo obligatorio

1. **Auditoría de casos** (`pedagogy_audit.py`): 1–3 casos, campos completos, ejemplos únicos.
2. **Corregir currículo** (no el perfil): agregar/ajustar `formulaCases`.
3. **Perfil/guion**: cada caso con intro ES + modelo EN, badge, cue.
4. **Gates**: `validate_profile`, `curriculum_audit`, `guion_lint`, cobertura de hooks.
5. **Interactividad**: probar trapcheck, build, speak y voz; confirmar que no hay callejones.
6. **Recién ahí**: audio.

## 10. Ejemplo trabajado — A2 Base 1

Título: *El Pasado Simple Regular: La Terminación -ed y sus 3 Sonidos*.

Decisión: **cómo suena la -ed**. No es “QUIÉN + VERBO + TIEMPO”; son 3 sonidos:

| Caso | Señal | Ejemplo |
|---|---|---|
| 01 · /t/ | verbo termina en sonido sordo (p, k, f, s, ch, sh) | *We finished the task on time.* |
| 02 · /d/ | verbo termina en sonido sonoro (vocal, b, g, l, m, n, r, v, z) | *She called her client this morning.* |
| 03 · /ɪd/ | verbo termina en t o d | *We needed more time yesterday.* |

Trampa: *I work-ed yesterday.* → *I worked yesterday.* (dos sílabas donde va una).
Interactividad: el estudiante elige el sonido de una -ed; el build arma una frase con el sonido
elegido; la voz repite el ejemplo.

## 11. Checklist final

- [ ] 1–3 casos, cada uno una decisión.
- [ ] Cada caso con `label`, `segments`, `explanationSpanish`, `exampleEnglish`.
- [ ] Ejemplos únicos, 4–10 palabras, naturales.
- [ ] La trampa es el error real.
- [ ] Cada caso aparece en fórmula y al menos una interacción.
- [ ] 2 opciones por elección, 1 correcta.
- [ ] Feedback nombra la señal.
- [ ] Sin temas adelantados ni relleno.
- [ ] `pedagogy_audit.py` en verde antes de escribir el guion.
