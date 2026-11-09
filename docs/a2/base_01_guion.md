# A2 · Base 01 — Guion para revisión

**Título:** El Pasado Simple Regular: La Terminación -ed y sus 3 Sonidos
**Decisión que enseña:** cómo suena la -ed según el sonido final del verbo.
**Frase objetivo:** *Yesterday we finished on time.*
**Casos:** 3 · **Interacciones:** trampa, elección, build, voz.

## Casos (ya en el currículo)

| Caso | Señal | Ejemplo |
|---|---|---|
| 01 · Sonido /t/ | verbo termina en sonido sordo (p, k, f, s, ch, sh) | *We finished the task on time.* |
| 02 · Sonido /d/ | verbo termina en sonido sonoro (vocal, b, g, l, m, n, r, v, z) | *She called her client this morning.* |
| 03 · Sonido /ɪd/ | verbo termina en t o d | *We needed more time yesterday.* |

**Trampa:** *I work-ed yesterday.* → *I worked yesterday.*
**Por qué:** separar la -ed en dos sílabas cuando debe ser un solo golpe /uórkt/.

## Guion

| # | id | beat | idioma | texto | cue / pausa |
|---:|---|---|---|---|---|
| 1 | welcome | DIALOG | es | Bienvenido a tu clase de pasado. Hoy no vas a memorizar una lista: vas a decidir cómo suena la terminación -ed en tres situaciones reales. Toca Comenzar Clase. | — |
| 2 | why | DIALOG | es | En español el pasado vive en una sola palabra: terminé. En inglés agregás -ed, pero esa terminación tiene tres sonidos distintos. Si la decís siempre igual, suena extranjero. | — |
| 3 | why.promise | DIALOG | es | Al final vas a escuchar una terminación y saber si suena /t/, /d/ o /id/ sin pensarlo. Y vas a decirlo en una frase completa. | — |
| 4 | formula.rule | FORMULA | es | La regla tiene tres casos. El sonido depende de cómo termina el verbo, no de la persona. Los vemos uno por uno. | — |
| 5 | formula.case1.intro | FORMULA | es | Caso uno: sonido /t/. Si el verbo termina en un sonido sordo como p, k, f, s, ch o sh, la -ed suena /t/. No agregues una sílaba. | reveal 1 · caso 0 |
| 6 | formula.case1.model | FORMULA | en | We finished the task on time. | reveal 3 · caso 0 |
| 7 | formula.case2.intro | FORMULA | es | Caso dos: sonido /d/. Si el verbo termina en un sonido sonoro como una vocal, b, g, l, m, n, r, v o z, la -ed suena /d/. Tampoco se pronuncia la e. | reveal 1 · caso 1 |
| 8 | formula.case2.model | FORMULA | en | She called her client this morning. | reveal 3 · caso 1 |
| 9 | formula.case3.intro | FORMULA | es | Caso tres: sonido /id/. Si el verbo termina en t o d, la -ed agrega una sílaba. Es el único caso donde la e se pronuncia. | reveal 1 · caso 2 |
| 10 | formula.case3.model | FORMULA | en | We needed more time yesterday. | reveal 3 · caso 2 |
| 11 | trap.intro | TRAP | es | Mirá la alerta roja. El error más común es separar la -ed como si fuera una sílaba extra: work-ed. Escuchá. | fase 0 |
| 12 | trap.wrong | TRAP | en | I work-ed yesterday. | fase 1 |
| 13 | trap.pivot | TRAP | es | En su lugar, worked se dice en un solo golpe, con /t/ final. | fase 1 |
| 14 | trap.right | TRAP | en | I worked yesterday. | fase 2 |
| 15 | trap.anchor | TRAP | es | Ancla: la -ed nunca crea una sílaba nueva, salvo después de t o d. | fase 2 |
| 16 | trapcheck.intro | TRAP_CHECK | es | Ahora elegís vos. En pantalla hay dos frases: tocá la que un nativo diría de verdad. | 2 opciones |
| 17 | trapcheck.error | TRAP_CHECK | es | Esa frase separa la -ed en dos sílabas. Recordá: worked suena /uórkt/, en un solo golpe. | — |
| 18 | trapcheck.success | TRAP_CHECK | es | Exacto. Una sola sílaba y el sonido /t/ al final. Ahora escuchá dos ejemplos reales. | — |
| 19 | example.finish | EXAMPLES | en | Yesterday we finished the task on time. | — |
| 20 | example.phonetic | EXAMPLES | es | Fijate en finished: fínisht, con /t/ al final y sin sílaba extra. | canonical |
| 21 | example.call | EXAMPLES | en | She called her client this morning. | — |
| 22 | build.transition | BUILD | es | Si algo no te cierra, tocá Preguntar. Ahora armá la frase. | 260 |
| 23 | build.intro | BUILD | es | Ordená las fichas de izquierda a derecha hasta completar la frase en pasado. | — |
| 24 | build.error | BUILD | es | Empezá por Yesterday, seguí con we y el verbo en pasado finished. La frase cierra con on time. | — |
| 25 | build.success | BUILD | es | Muy bien. La -ed quedó en un solo golpe y la frase suena natural. Ahora tu voz. | — |
| 26 | speak.lead | SPEAK | es | Escuchá cómo lo digo yo: | 380 |
| 27 | speak.model | SPEAK | en | Yesterday we finished on time. | — |
| 28 | speak.instruction | SPEAK | es | Ahora encendé tu micrófono y repetí la frase completa. | — |
| 29 | voice.retry | VOICE | es | Casi lo tenés. Escuchá otra vez y repetí sin prisa. | — |
| 30 | voice.not_heard | VOICE | es | No logré escucharte. Acercate al micrófono y repetí la frase conmigo. | — |
| 31 | voice.victory | VOICE | es | Excelente. La -ed sonó /t/ y la frase fluyó. Base conquistada. | — |
| 32 | mic.error | VOICE | es | Tu micrófono no arrancó. Autorizá el permiso o seguí en modo silencioso. | — |
| 33 | bridge | BRIDGE | es | En Reading vas a encontrar estas terminaciones en historias y correos. Toca el botón para practicar. | — |

## Interactividad

- **Trampa (elección):** “I work-ed yesterday.” vs “I worked yesterday.” La incorrecta es el error real; el feedback nombra la sílaba extra.
- **Build:** *Yesterday we finished the task on time.* Fichas: Yesterday / we / finished / the / task / on / time + distractor *finish*.
- **Voz:** *Yesterday we finished on time.*
- **Casos en pantalla:** cada caso tiene su par intro ES + modelo EN y su badge “CASO X DE 3”.

## Checklist

- [x] 3 casos, cada uno una decisión de sonido.
- [x] Cada caso con explicación y ejemplo propio.
- [x] Trampa = error real, no inventado.
- [x] Cada caso aparece en fórmula y en un ejemplo.
- [x] Una sola respuesta correcta por elección.
- [x] Sin temas de otra base.
- [ ] Revisión del usuario antes de perfil/audio.
