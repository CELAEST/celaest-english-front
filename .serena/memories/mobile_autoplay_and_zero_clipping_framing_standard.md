# Mobile Autoplay, Zero-Clipping Framing & Direct Q&A Flow Standard

1. **Auto-Play de la Clase**:
   - Al entrar a una base (`step === 'RULE'`), la clase se inicia automáticamente sin requerir que el alumno busque botones de inicio.
   - Controles de audio elegantes: botón circular play/pause minimalista con feedback de estado (`Pausar` / `Escuchar`).

2. **Zero-Clipping en el Robot 3D (`origin-top scale-[0.76] translate-y-6`)**:
   - El canvas WebGL se mantiene en pantalla completa (`absolute inset-0 h-full w-full`) preservando la relación de aspecto vertical de Three.js.
   - En la vista de ejemplos, el robot se transforma con CSS acelerado por GPU: `origin-top scale-[0.76] translate-y-6`.
   - Las antenas, visor cibernético, hombros y sudadera cuentan con margen superior despejado, eliminando cualquier corte de cabeza.

3. **Acceso Inmediato a Preguntar desde la Práctica (`PathwayLessonHeader`)**:
   - Cuando el alumno está practicando fichas (`2. Practica`) o hablando (`3. Habla`), la cabecera superior despliega el botón `[ 💬 Preguntar ]` en la esquina superior derecha.
   - Al tocarlo, entra de inmediato al mentor con el anexo de preguntas abierto (`initialOpenAsking = true`), permitiendo resolver dudas sin fricción.
