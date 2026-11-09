# A2 · Base 02 — Guion para revisión

**Título:** Los Verbos Irregulares de Oro: Went, Saw, Had y Made
**Decisión que enseña:** usar la raíz irregular correcta, sin agregar -ed, con la misma forma para todas las personas.
**Frase objetivo:** *I went to the office yesterday.*
**Casos:** 1 · **Interacciones:** trampa, elección, build, voz.

## Por qué un solo caso

No son cinco casos por cinco verbos: es **una sola decisión**. El estudiante tiene que reconocer
que un irregular no lleva -ed y que su forma no cambia con la persona. Meter “went, saw, had,
made, took” como cinco casos sería una lista, no una clase. Se eligen cuatro verbos de oro como
ejemplos, pero se enseña una sola regla.

| Caso | Señal | Ejemplo |
|---|---|---|
| 01 · Forma única para todas las personas | el verbo es irregular y el momento ya está dicho | *I went to the office early.* |

**Trampa:** *I goed to the office yesterday.* → *I went to the office yesterday.*
**Por qué:** agregar -ed a un irregular rompe la forma; el pasado ya está en la raíz.

## Guion

| # | id | beat | idioma | texto | cue / pausa |
|---:|---|---|---|---|---|
| 1 | welcome | DIALOG | es | Bienvenido a tu clase de irregulares. Hoy no vas a memorizar una lista enorme: vas a entender por qué estos verbos no llevan -ed y cómo usarlos con cualquier persona. | — |
| 2 | why | DIALOG | es | En español, fui ya es irregular. En inglés, go cambia a went, see a saw y have a had. Si decís goed, el oído nativo lo detecta al instante. | — |
| 3 | why.promise | DIALOG | es | Al final vas a contar lo que hiciste ayer con cuatro irregulares de oro, sin agregar -ed y sin cambiar la forma según la persona. | — |
| 4 | formula.rule | FORMULA | es | Esta regla tiene un solo caso. El irregular cambia su raíz y esa misma forma sirve para I, he, she, we y they. El momento pasado se marca con la frase o con el contexto. | reveal 1 · caso 0 |
| 5 | formula.case1.intro | FORMULA | es | Caso único: forma irregular para todas las personas. Mirá: I went, he went, we went. La forma no cambia. | reveal 1 · caso 0 |
| 6 | formula.case1.model | FORMULA | en | I went to the office early. | reveal 3 · caso 0 |
| 7 | trap.intro | TRAP | es | Mirá la alerta roja. El error típico es agregar -ed a un verbo que ya es irregular. Escuchá. | fase 0 |
| 8 | trap.wrong | TRAP | en | I goed to the office yesterday. | fase 1 |
| 9 | trap.pivot | TRAP | es | En su lugar, go se transforma en went. No se le agrega nada: la raíz ya trae el pasado. | fase 1 |
| 10 | trap.right | TRAP | en | I went to the office yesterday. | fase 2 |
| 11 | trap.anchor | TRAP | es | Ancla: si el verbo es irregular, no le agregues -ed. Aprendé su forma y usala con todas las personas. | fase 2 |
| 12 | trapcheck.intro | TRAP_CHECK | es | Ahora elegís vos. En pantalla hay dos frases: tocá la que un nativo diría de verdad. | 2 opciones |
| 13 | trapcheck.error | TRAP_CHECK | es | Esa frase agregó -ed a un irregular. Go cambia a went, sin terminación extra. | — |
| 14 | trapcheck.success | TRAP_CHECK | es | Exacto. Usaste went, la misma forma para todas las personas. Ahora escuchá dos ejemplos reales. | — |
| 15 | example.office | EXAMPLES | en | I went to the office early. | — |
| 16 | example.phonetic | EXAMPLES | es | Fijate en went: se dice en un solo golpe, con /uént/. No digas go-ed. | canonical |
| 17 | example.report | EXAMPLES | en | We saw the report yesterday. | — |
| 18 | build.transition | BUILD | es | Si algo no te cierra, tocá Preguntar. Ahora armá la frase. | 260 |
| 19 | build.intro | BUILD | es | Ordená las fichas de izquierda a derecha hasta completar la frase en pasado. | — |
| 20 | build.error | BUILD | es | Empezá por I, seguí con went y cerrá con to the office yesterday. El verbo no lleva -ed. | — |
| 21 | build.success | BUILD | es | Muy bien. Usaste went sin -ed y la frase quedó completa. Ahora tu voz. | — |
| 22 | speak.lead | SPEAK | es | Escuchá cómo lo digo yo: | 380 |
| 23 | speak.model | SPEAK | en | I went to the office yesterday. | — |
| 24 | speak.instruction | SPEAK | es | Ahora encendé tu micrófono y repetí la frase completa. | — |
| 25 | voice.retry | VOICE | es | Casi lo tenés. Escuchá otra vez y repetí sin prisa. | — |
| 26 | voice.not_heard | VOICE | es | No logré escucharte. Acercate al micrófono y repetí la frase conmigo. | — |
| 27 | voice.victory | VOICE | es | Excelente. Dijiste went sin -ed y la frase fluyó. Base conquistada. | — |
| 28 | mic.error | VOICE | es | Tu micrófono no arrancó. Autorizá el permiso o seguí en modo silencioso. | — |
| 29 | bridge | BRIDGE | es | En Reading vas a encontrar estos irregulares en historias y correos. Toca el botón para practicar. | — |

## Interactividad

- **Trampa (elección):** “I goed to the office yesterday.” vs “I went to the office yesterday.”
- **Build:** *I went to the office yesterday.* Fichas: I / went / to / the / office / yesterday + distractor *goed*.
- **Voz:** *I went to the office yesterday.*
- **Caso en pantalla:** un solo par intro ES + modelo EN, badge “CASO ÚNICO”.

## Checklist

- [x] 1 caso: una sola decisión, no una lista de verbos.
- [x] Explicación con señal y contraste.
- [x] Ejemplo propio y trampa real.
- [x] Interacciones con una sola respuesta correcta.
- [x] Sin adelantar otros pasados irregulares.
- [ ] Revisión del usuario antes de perfil/audio.
