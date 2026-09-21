# Lección de Arquitectura: Persistencia de Onboarding y Verificación Resiliente de Claves AI

1. **Persistencia por Usuario (Zero-Amnesia)**:
   - El estado de compleción de onboarding nunca debe depender de una única clave global volátil.
   - Debe almacenarse con scope de usuario (`lingua_onboarding_completed_${userId}`) tanto en localStorage como en base de datos PostgreSQL (`users.onboarding_completed`).
   - Los eventos de sesión como 401, caducidad de token o logout limpian tokens de acceso y refresco, pero JAMÁS deben borrar el historial o compleción diagnóstica del usuario.
   - En `useCurrentUser`, si el perfil remoto está en estado de carga o el backend tiene latencia, `onboardingCompleted` debe resolver contra el estado persistido por usuario y nunca degradarse a `false`.

2. **Verificación No Bloqueante en Claves Activas**:
   - Cuando el usuario hace clic en "Continuar con clave activa", ya posee una clave almacenada en su dispositivo. El probe HTTP en vivo no debe ser bloqueante ante restricciones de red/CORS de navegadores móviles.
   - Para claves nuevas, los errores de fetch causados por CORS u offline deben tratarse como advertencia no bloqueante (modo directo en dispositivo) en vez de atrapar al usuario en un bucle sin salida.