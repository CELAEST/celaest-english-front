# CELAEST Checkout & Modal UX Standard (Lingua Clean Standard)

1. **Zero Colored Pill Boxes (Antipatrón Prohibido)**:
   - NUNCA usar pastillas o cajas con fondo y borde coloreado (ej. `bg-emerald-500/10 border border-emerald-500/20` para "CIFRADO TLS 1.3" o estados).
   - Metadatos, etiquetas y seguridad DEBEN ser micro-tipografía flotante limpia (`text-[10px] font-mono tracking-[0.18em] uppercase text-white/40`), sin bordes ni fondos coloreados.

2. **Paso de Pago Seguro (Stripe Redirect)**:
   - NUNCA colocar campos falsos de tarjeta (número de tarjeta, expiración, CVC). El flujo redirige a Stripe Checkout.
   - Mostrar únicamente: importe claro a pagar, marcas admitidas en texto flotante limpio y botón principal de redirección. Cero cajas de color o pills redundantes.

3. **Paso de Activación (Pureza Absoluta & Cero Apeñuzcamiento)**:
   - NUNCA colocar la caja de clave de licencia corporativa ("no le pongas la licencia, déjalo limpio").
   - La pantalla de éxito debe respirar con generoso espacio negativo (espaciado vertical amplio `py-10 space-y-8`), ícono sutil, título de confirmación, mensaje conciso y un único botón principal ("Ir a Mis Activos"). Cero cajas anidadas.

4. **Zero Border Clutter**:
   - Eliminar bordes alrededor de cada sub-elemento. La elevación se logra mediante profundidad de lienzo (#09090B, #0D0D11) y sombras difusas.
