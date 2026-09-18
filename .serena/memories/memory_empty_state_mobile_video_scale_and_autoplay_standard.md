# CELAEST Standard: Memory Empty State Mobile Video Vertical Optical Centering

## Calibración Espacial del Video Empty State (`MemoryEmptyState.tsx`)
1. **Compensación de Gravedad Visual**:
   - Debido a que la ilustración 3D dentro del archivo `cards.mp4` está situada en la mitad inferior de su lienzo, mantener `translate-y-0` provocaba que las tarjetas quedaran muy pegadas a los botones inferiores y dejaran un gran vacío superior.
   - Se aplicó una elevación de compensación óptica: `-translate-y-10 xs:-translate-y-12 sm:-translate-y-12 lg:-translate-y-14 xl:-translate-y-16`.
   - Con esto, la distancia superior hacia las pestañas (`Speaking / Reading / Writing`) y la distancia inferior hacia los botones de acción (`Review other categories / Start Practice Session`) quedan perfectamente equilibradas (~75px - 80px en ambos lados).
2. **Escala y Autoplay**:
   - Escala fluida `scale-[1.46] xs:scale-[1.52] sm:scale-100 origin-center`.
   - Autoplay continuo en mobile (`< 768px`) con interacción hover en desktop.
