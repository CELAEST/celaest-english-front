# CELAEST Legal & Landing Reconciliations (Post-Decisions Protocol)

## 1. Decisiones Aplicadas y Blindadas
1. **Política de Reembolsos Estricta**:
   - Eliminada la promesa de "devolución de 30 días sin preguntas" de Precios y FAQ.
   - Alineado con la regla de pagos definitivos para software y código fuente de entrega y ejecución inmediata.
   - Reembolso admitido únicamente por defecto técnico demostrable no resuelto en 10 días hábiles.
2. **Entidad Legal**:
   - Domicilio en Colombia operando como CELAEST (marca y plataforma tecnológica en proceso de constitución).
   - Eliminadas referencias a corporaciones ficticias Delaware/Inc.
3. **Procesador de Pagos**:
   - Stripe exclusivamente (PCI-DSS Nivel 1 tokenizado).
   - Eliminadas referencias a Polar.sh o LemonSqueezy.
4. **Seguridad y Certificaciones**:
   - Se aclara que SOC 2 e ISO 27001 corresponden a los proveedores de infraestructura cloud (Cloudflare, Vercel, AWS).
   - CELAEST implementa cifrado TLS 1.3, AES-256 y hashing bcrypt en reposo.
5. **Google Analytics & Banner de Cookies**:
   - GA4 declarado honestamente con anonimización de IP y CERO cookies de rastreo publicitario de terceros.
   - Implementado CookieBanner (`src/components/ui/cookie-banner.tsx`) con Google Consent Mode v2 respetando opción 'essential'.
6. **Depuración de Enlaces Fantasma en Footer**:
   - Eliminados enlaces muertos/falsos ("Blog", "Carreras", "Kit de Prensa", "Socios", "Estado", "API").
   - Las 4 columnas ahora contienen únicamente rutas reales y funcionales (Producto, Plataforma, Soporte, Legal).
7. **Localización de Secciones**:
   - `legal-section-view.tsx` renderiza dinámicamente "SECTION" en inglés y "SECCIÓN" en español.
