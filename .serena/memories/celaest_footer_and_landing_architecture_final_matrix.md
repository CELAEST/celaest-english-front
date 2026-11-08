# CELAEST Footer & Legal Compliance Architecture Matrix (Zero-Smoke & Anti-Redundancy Standard)

## 1. Centro de Cumplimiento & FAQ Editorial (`/legal/faq` y `/faq`)
- Siguiendo el estándar exacto de las políticas legales, el FAQ NO vive en la landing ni en un modal flotante.
- Es un documento editorial oficial accesible en `/legal/faq` (con alias canónico en `/faq`).
- Hereda el diseño editorial v1 aprobado:
  - Pestaña `06 FAQ` en la barra de navegación `LegalTabs`.
  - Índice lateral interactivo (Sticky TOC) con 5 secciones:
    1. Modelo de Suscripción, Assets y Entrega de Código
    2. Política de Reembolsos y Excepción por Código Fuente Inmediato
    3. Ejecución Local, Sandboxing y Conectividad Cloud
    4. Integración BYOK (Bring Your Own Key) y Credenciales Propias
    5. Seguridad, Aislamiento y Política de Cero-Entrenamiento
  - Tipografía limpia sin cajas, con líneas sutiles y callout violeta.

## 2. Depuración Radical del Footer (Cero Enlaces Rotos, Cero `mailto:` Redundantes)
Se eliminaron todos los enlaces ficticios que abrían clientes de correo (`mailto:`):
- Eliminado `Soluciones Enterprise` (mailto duplicado).
- Eliminado `Contacto Comercial` (mailto duplicado).
- Eliminado `Mesa de Ayuda` (mailto duplicado).
- Eliminado el modal emergente de FAQ.

### Matriz Limpia Resultante:
1. **PRODUCTO**:
   - `Catálogo de Assets` -> `${DASHBOARD_URL}/?tab=marketplace` (Pestaña nueva)
   - `Macros & Scripts` -> `/#products` (Smooth scroll nativo a productos)
   - `Planes & Precios` -> `/#pricing` (Smooth scroll nativo a precios)
2. **PLATAFORMA**:
   - `Arquitectura del Sistema` -> `/#architecture` (Smooth scroll nativo a arquitectura)
   - `Malla IA & Agentes` -> `/#platform` (Smooth scroll nativo a la malla IA)
   - `Seguridad & Aislamiento` -> `/#security` (Smooth scroll nativo a Particle Core)
3. **SOPORTE**:
   - `Preguntas Frecuentes` -> `/legal/faq` (Página editorial completa con TOC)
   - `Documentación Técnica` -> `${DASHBOARD_URL}/?tab=docs` (Pestaña nueva)
4. **LEGAL**:
   - `Términos de Servicio` -> `/legal/terms`
   - `Política de Privacidad` -> `/legal/privacy`
   - `Política de Reembolsos` -> `/legal/refunds`
   - `Acuerdo de Licencia` -> `/legal/license`
   - `Política de Cookies` -> `/legal/cookies`
5. **MARCA (BRAND)**:
   - Solo canales reales y activos: GitHub (`https://github.com/celaest`, 200 OK) y correo corporativo directo.

## 3. Estado de Certificación
- `tsc --noEmit`: 0 errores.
- `vitest`: 12/12 pruebas unitarias aprobadas.
- `next build`: 23/23 páginas estáticas compiladas limpiamente.
- Sincronizado en commit `191b811` en `feature/landing-v2` y `main`.
