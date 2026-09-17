# Lección de Arquitectura: Memory Bank Multi-Word Flow & VideoOrb Positioning

1. **Estado en Modales de Lectura (ReadingWordModal)**:
   - Al agregar una palabra a Memory desde Reading, el estado `addedSuccess` quedaba bloqueado en `true` si el modal se reutilizaba para subsiguientes palabras sin resetearse.
   - Solución: Se introdujo un `useEffect` escuchando `wordData?.word` en [ReadingWordModal.tsx](file:///c:/Users/user/Music/celaest-english-front/src/features/reading/components/ReadingWordModal.tsx) que restablece `addedSuccess(false)`, `isAdding(false)` y `isTranslatingDirect(false)`.
   - Adicionalmente en [ReadingArticleReader.tsx](file:///c:/Users/user/Music/celaest-english-front/src/features/reading/components/ReadingArticleReader.tsx), se asignó `key={activeWordData?.word || "reading-modal"}` forzando un ciclo de vida limpio e instancia fresca por palabra seleccionada.

2. **Auto-selección Inteligente de Tab en MemoryView**:
   - Anteriormente, [MemoryView.tsx](file:///c:/Users/user/Music/celaest-english-front/src/features/memory/components/MemoryView.tsx) inicializaba siempre en `Speaking` (tab 0). Si el usuario tenía 0 tarjetas de Speaking pero 5 de Reading, la vista mostraba el Empty State como si no se hubieran guardado palabras.
   - Solución: Se integró un hook de detección automática con `hasAutoSelectedTabRef`. Si la categoría activa actual tiene 0 tarjetas pero otra (como Reading) tiene tarjetas (>0), se transiciona fluidamente a la pestaña poblada al cargar los datos. Si el usuario conmuta manualmente de pestaña, se respeta su preferencia explícita.

3. **Posicionamiento Responsivo de la Esfera VideoOrb**:
   - `lg:right-[260px]` forzaba a la esfera a meterse 260px hacia el centro-izquierda en pantallas de laptops y ventanas redimensionadas, colisionando con el título del Header y los tabs.
   - Solución: Se re-ancló al margen derecho con `right-4 sm:right-6 md:right-8 lg:right-12 xl:right-16` y dimensiones armónicas (`w-[120px] sm:w-[140px] md:w-[160px] lg:w-[180px]`), garantizando un aislamiento y margen perfecto respecto a los componentes de la izquierda en cualquier resolución.