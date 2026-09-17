import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { KineticLuxuryText } from "../../workspace/components/KineticLuxuryText";
import {
  CognitiveMemoryBrainIcon,
  PrecisionOpenBookIcon,
  StudioVoiceMicIcon,
  TechnicalWritingQuillIcon,
  QuantumNeuralGaugeIcon,
} from "../../workspace/components/WorkspaceBespokeIcons";

export type SidenavArchetypeId =
  | "dock_kinetic"
  | "dual_rail"
  | "orbit_pebbles"
  | "studio_cockpit"
  | "swiss_editorial"
  | "bento_modular"
  | "cyber_acoustic"
  | "horizon_cockpit"
  | "neo_brutalist"
  | "liquid_mercury"
  | "accordion_tree"
  | "hairline_wireframe"
  | "dynamic_island_top"
  | "command_palette_hud"
  | "origami_accordion_fold"
  | "timeline_learning_journey"
  | "circular_corner_fan"
  | "stealth_blade_zero"
  | "horology_bezel"
  | "architectural_monolith"
  | "dieter_rams_ten"
  | "leica_rangefinder"
  | "japanese_sensu"
  | "teenage_engineering_tp7"
  | "bauhaus_geometry"
  | "apple_park_glass"
  | "braille_tactile_ridge"
  | "monocle_travel_column"
  | "polaroid_film_strip"
  | "astronomical_caliper"
  | "vacheron_guilloche"
  | "hasselblad_medium_format"
  | "kyoto_kintsugi"
  | "braun_et66_ledger"
  | "titanium_potentiometer"
  | "alvar_aalto_bentwood"
  | "helvetica_1957"
  | "zumthor_therme_slate"
  | "wim_crouwel_1968"
  | "vignelli_unigrid_1972"
  | "paul_rand_modernism"
  | "jil_sander_minimal"
  | "mies_nationalgalerie"
  | "braun_sk4_snow_white"
  | "otl_aicher_1972"
  | "gropius_fagus_werk"
  | "enzo_mari_autoprogettazione"
  | "sanaa_translucent_membrane";

export type SidenavCategory =
  | "all"
  | "pure_minimalism"
  | "floating"
  | "editorial"
  | "hardware"
  | "structural"
  | "pure_geometry"
  | "atelier_luxury";

interface ArchetypeMeta {
  id: SidenavArchetypeId;
  index: string;
  name: string;
  subtitle: string;
  silhouette: string;
  inspiration: string;
  description: string;
  accent: string;
  category: "pure_minimalism" | "floating" | "editorial" | "hardware" | "structural" | "pure_geometry" | "atelier_luxury";
  highlights: string[];
  material?: string;
  hairline?: string;
  opticalRatio?: string;
  physics?: string;
}

const ARCHETYPES: ArchetypeMeta[] = [
  {
    id: "dock_kinetic",
    index: "01",
    name: "The Floating Kinetic Dock",
    subtitle: "macOS Fluid Island · Magnificación Magnética",
    silhouette: "Cápsula Flotante con Física de Resortes",
    inspiration: "macOS Dock + Apple Dynamic Island + Raycast",
    category: "floating",
    description:
      "Una sola píldora de vidrio flotante que reacciona magnéticamente a la posición del cursor. Los iconos crecen con fluidez de 1.0x a 1.25x al pasar sobre ellos, con un fondo de luz líquida que se desliza suavemente detrás del elemento activo.",
    accent: "#38BDF8",
    highlights: [
      "Física de magnificación de iconos en hover (escala fluida)",
      "Cápsula de luz líquida que se desliza suavemente con resorte",
      "Isotipo ave en cápsula de cristal con halo respirable",
      "Perfil flotante con micro-menú contextual emergente",
    ],
  },
  {
    id: "dual_rail",
    index: "02",
    name: "The Linear Dual-Rail Split",
    subtitle: "Riel Doble · Drawer Deslizante de Inteligencia",
    silhouette: "Riel Estrecho (48px) + Panel Contextual (180px)",
    inspiration: "Linear App + Superhuman + Vercel Dashboard",
    category: "structural",
    description:
      "Arquitectura de riel dividido: una barra ultra-compacta de iconos con atajos rápidos y un cajón de cristal líquido que se desliza lateralmente para revelar detalles de nivel, sub-páginas y telemetría de aprendizaje.",
    accent: "#A27FF3",
    highlights: [
      "Separación estricta en 3 clusters: Core, Memoria y Sistema",
      "Láser de luz horizontal conectando la barra al espacio de trabajo",
      "Atajos grabados (⌘1–⌘5) en tipografía monospace ejecutiva",
      "Micro-cockpit inferior con medidor numérico de tiempo diario",
    ],
  },
  {
    id: "orbit_pebbles",
    index: "03",
    name: "The Radial Orbit Hub",
    subtitle: "Módulos Disconexos Flotantes · Cero Caja Continua",
    silhouette: "Islas Circulares Separadas en el Vacío",
    inspiration: "Cosmos Design + Apple Vision Pro Spatial",
    category: "floating",
    description:
      "Erradica por completo el concepto de 'caja vertical'. Cada herramienta es una piedra de cristal pulido ('pebble') flotando libremente en el vacío oscuro con su propia gravedad. Al pasar el cursor, un hilo de luz invisible las conecta.",
    accent: "#C084FC",
    highlights: [
      "Cero barra vertical: módulos circulares flotando independientemente",
      "Conexión de luz invisible que se ilumina con la estela del cursor",
      "Emblema superior dentro de una esfera de cristal líquido",
      "Avatar flotante con anillo orbital de frecuencia de audio",
    ],
  },
  {
    id: "studio_cockpit",
    index: "04",
    name: "The Studio Cockpit HUD",
    subtitle: "Hardware de Audio Táctil · Braun & Teenage Engineering",
    silhouette: "Consola de Hardware Industrial Oscuro",
    inspiration: "Teenage Engineering OP-1 + Braun Dieter Rams + SSL Studio",
    category: "hardware",
    description:
      "Inspirado en consolas de hardware musical de alta fidelidad: interruptores táctiles con retroiluminación ámbar/esmeralda, medidor de volumen VU en tiempo real para el micrófono y selector de nivel como potenciómetro analógico.",
    accent: "#F59E0B",
    highlights: [
      "Medidor VU de decibeles de voz en tiempo real en la cabecera",
      "Botones táctiles con click mecánico y luz LED posterior",
      "Indicadores de estado hardware: 'LIVE', '48kHz', 'SYNC'",
      "Fader vertical de nivel CEFR integrado junto al avatar",
    ],
  },
  {
    id: "swiss_editorial",
    index: "05",
    name: "The Swiss Typographic Column",
    subtitle: "Editorial Suizo · Tipografía Numérica Pura",
    silhouette: "Columna Editorial con Retícula Arquitectónica",
    inspiration: "Massimo Vignelli + Josef Müller-Brockmann + Monocle Magazine",
    category: "editorial",
    description:
      "Una obra maestra de diseño editorial suizo: prescinde de los iconos genéricos y utiliza índices numéricos matemáticos (01 / INTERVIEW, 02 / READING, 03 / WRITING). Una cruz de mira óptica (+) se alinea con precisión milimétrica al ítem activo.",
    accent: "#FFFFFF",
    highlights: [
      "Navegación tipográfica pura con índices numéricos suizos",
      "Mira óptica arquitectónica (+) que sigue al elemento activo",
      "Bisel de línea de corte de 0.5px inspirado en plano técnico",
      "Firma ejecutiva en Title Case con espaciado óptico milimétrico",
    ],
  },
  {
    id: "bento_modular",
    index: "06",
    name: "The Bento Morphing Island",
    subtitle: "3 Cardlets Modulares Independientes",
    silhouette: "Stack de 3 Módulos Bento Flotantes",
    inspiration: "Apple iOS Bento + Arc Browser Split + Vercel Cards",
    category: "structural",
    description:
      "En lugar de un monolito único, el Sidenav se divide en 3 bloques modulares ('cardlets') independientes: 1) Cardlet de Marca y Racha Diaria, 2) Cardlet de Navegación Core, y 3) Cardlet de Identidad Ejecutiva con recomendación de IA.",
    accent: "#34D399",
    highlights: [
      "3 bloques bento desacoplados con física de elevación independiente",
      "Bloque superior con contador de racha de días (🔥 4 días)",
      "Bloque central de navegación con pastilla deslizante",
      "Bloque inferior con tarjeta inteligente: 'Siguiente: 10 min Speaking'",
    ],
  },
  {
    id: "cyber_acoustic",
    index: "07",
    name: "The Cyber-Acoustic Monolith",
    subtitle: "Espina de Onda Sónica Vertical · Audio Telemetry Spine",
    silhouette: "Hoja Vertical Ultra-Estrecha con Columna de Frecuencias",
    inspiration: "Bang & Olufsen Sound Sculptures + Cyberpunk HUD",
    category: "hardware",
    description:
      "Una esbelta hoja vertical con un ecualizador acústico continuo de micro-filamentos grabado en su arista derecha. Al hablar o seleccionar un módulo, la espina sónica ondula orgánicamente mostrando la frecuencia de audio del usuario.",
    accent: "#06B6D4",
    highlights: [
      "Columna continua de filamentos acústicos en el borde lateral derecho",
      "Etiquetas de frecuencia sónica en el módulo activo ('140Hz // LIVE')",
      "Isotipo de ave con micro-ranuras acústicas en el plumaje",
      "Chip de telemetría de voz en tiempo real junto al avatar",
    ],
  },
  {
    id: "horizon_cockpit",
    index: "08",
    name: "The Horizontal Horizon Deck",
    subtitle: "Deck Flotante Horizontal · Máximo Espacio Lateral",
    silhouette: "Cápsula Flotante Horizontal en Base de Pantalla",
    inspiration: "Figma Floating Toolbar + Arc Command Deck + Apple Watch Ultra",
    category: "floating",
    description:
      "Reimagina radicalmente el paradigma eliminando la pared vertical: el Sidenav se transforma en una consola horizontal flotante ultra-ligera en la base de la pantalla, dejando el 100% del ancho del viewport libre para el aprendizaje.",
    accent: "#10B981",
    highlights: [
      "Disposición horizontal flotante que maximiza el ancho útil de lectura",
      "Conmutador segmentado horizontal de herramientas con pastilla de luz",
      "Lanzador rápido de práctica rápida '+ Daily Practice'",
      "Perfil compacto acoplado en el extremo derecho de la barra",
    ],
  },
  {
    id: "neo_brutalist",
    index: "09",
    name: "The Neo-Brutalist Titanium Frame",
    subtitle: "Alta Relojería Brutalista · Esquinas Biseladas a 45°",
    silhouette: "Marco Geométrico de Titanio con Cortes a 45 Grados",
    inspiration: "Tadao Ando Concrete Architecture + Balenciaga Digital + Virgil Abloh",
    category: "structural",
    description:
      "Diseño de ángulos puros y esquinas biseladas a 45°. Utiliza una retícula de plano técnico con coordenadas de navegación. El estado activo es un bloque blanco de alto contraste que salta instantáneamente con física de click mecánico seco.",
    accent: "#E2E8F0",
    highlights: [
      "Esquinas biseladas a 45° con líneas de plano técnico milimétricas",
      "Transición de estado activo instantánea (cero lag, click seco)",
      "Coordenadas de navegación técnica (SEC_01 // COORD: 24.12)",
      "Placa de identificación de usuario con número de registro CEFR",
    ],
  },
  {
    id: "liquid_mercury",
    index: "10",
    name: "The Liquid Mercury Droplet",
    subtitle: "Metal Líquido Orgánico · Tensión Superficial",
    silhouette: "Gota de Mercurio con Curvatura de 44px",
    inspiration: "Terminator T-1000 Fluid Metal + Apple Vision Pro Liquid Physics",
    category: "structural",
    description:
      "Inspirado en la tensión superficial del mercurio líquido: una cápsula ultra-orgánica de 44px de radio donde el indicador activo es una masa fluida de metal líquido que se estira elásticamente entre los módulos al hacer click.",
    accent: "#94A3B8",
    highlights: [
      "Indicador activo de metal líquido con deformación elástica orgánica",
      "Efecto de onda de gota expansiva al hacer click en cualquier herramienta",
      "Superficie especular que refleja sutilmente el contenido de la pantalla",
      "Avatar reflejado dentro de una gota flotante de mercurio",
    ],
  },
  {
    id: "accordion_tree",
    index: "11",
    name: "The Split-Level Nested Cockpit",
    subtitle: "Jerarquía de Árbol Modular · Sub-Módulos de Práctica",
    silhouette: "Cockpit Jerárquico Desplegable en 2 Niveles",
    inspiration: "Notion Workspace Tree + Obsidian Graph + Bloomberg Terminal",
    category: "structural",
    description:
      "Estructura modular en dos niveles: las categorías principales (Speaking, Reading, Writing) se despliegan para mostrar los submódulos específicos con barras de progreso individuales para cada ejercicio del día.",
    accent: "#8B5CF6",
    highlights: [
      "Submódulos específicos desplegables (Interview Sparring, Vocab Lab)",
      "Micro-barras de progreso individuales por ejercicio (60% completado)",
      "Líneas de conexión arquitectónica estilo diagrama de árbol",
      "Selector rápido de nivel CEFR integrado en la cabecera",
    ],
  },
  {
    id: "hairline_wireframe",
    index: "12",
    name: "The Obsidian Minimalist Hairline",
    subtitle: "100% Wireframe Vectorial · Cero Relleno Sólido",
    silhouette: "Estructura Pura de Líneas de 0.75px en el Vacío",
    inspiration: "Jony Ive LoveFrom + Porsche Design Line Art + Architectural Laser",
    category: "editorial",
    description:
      "Prescinde absolutamente de cualquier fondo sólido. Toda la estructura está dibujada exclusivamente con trazos vectoriales ultra-finos de 0.75px que se iluminan al pasar el cursor, creando una sensación de ligereza aeroespacial inigualable.",
    accent: "#F8FAFC",
    highlights: [
      "Cero fondos oscuros o rellenos: 100% líneas de luz sub-píxel de 0.75px",
      "Efecto de trazo láser que dibuja el contorno de la herramienta activa",
      "Iconografía lineal matemática de trazo continuo",
      "Perfil delimitado por un fino aro de luz flotante en la oscuridad",
    ],
  },
  {
    id: "dynamic_island_top",
    index: "13",
    name: "The Dynamic Island Floating Top-Bar",
    subtitle: "Isla Flotante Superior · Expansión Adaptativa",
    silhouette: "Cápsula Flotante en Cabecera Central del Viewport",
    inspiration: "Apple Dynamic Island + Tesla Touchscreen Cockpit + macOS Notch",
    category: "floating",
    description:
      "Reimagina la navegación eliminando los márgenes laterales por completo. Una cápsula flotante de vidrio oscuro anclada en el centro superior con telemetría viva de audio y racha diaria. Al interactuar, se despliega suavemente hacia abajo sin recortar el contenido lateral.",
    accent: "#38BDF8",
    highlights: [
      "Cero ocupación de laterales: libera el 100% del viewport para lectura y sparring",
      "Modo compacto en reposo con telemetría viva (48kHz audio + racha)",
      "Animación fluida de expansión elástica tipo Dynamic Island de Apple",
      "Acceso rápido por teclado (⌘K) integrado en la cápsula central",
    ],
  },
  {
    id: "command_palette_hud",
    index: "14",
    name: "The Raycast Command-First HUD",
    subtitle: "Lanzador de Comandos · Minimalismo para Power Users",
    silhouette: "Barra Flotante con Buscador Difuso y Chips de Atajos",
    inspiration: "Raycast + Linear Command Bar + Spotlight + Alfred",
    category: "hardware",
    description:
      "Diseñado para usuarios ejecutivos que prefieren la velocidad del teclado: una barra flotante de comandos con buscador difuso ('fuzzy jump'), atajos grabados y chips de herramientas activas con telemetría de latencia.",
    accent: "#F43F5E",
    highlights: [
      "Buscador difuso interactivo con animación de cursor parpadeante",
      "Chips de módulos con badge de atajo de teclado de alta visibilidad",
      "Micro-telemetría de latencia de red ('12ms // TURBO')",
      "Navegación instantánea a máxima velocidad sin apartar las manos del teclado",
    ],
  },
  {
    id: "origami_accordion_fold",
    index: "15",
    name: "The Kyoto Origami Folding Spine",
    subtitle: "Spine Plegable en 3 Planos · Tipografía Vertical Esculpida",
    silhouette: "Espina Estrecha de 36px con Pliegues Geométricos en Z",
    inspiration: "Japanese Origami Architecture + Leica Camera Craft + Aesop Packaging",
    category: "editorial",
    description:
      "Inspirado en el plegado de papel arquitectónico japonés: en reposo es una delgada espina de 36px con tipografía vertical grabada a 90° ('CELAEST · ORIGAMI'). Al interactuar, se desdobla en 3 planos escalonados con sombras de cristal ahumado.",
    accent: "#F59E0B",
    highlights: [
      "Tipografía vertical esculpida a 90° con espaciado óptico milimétrico",
      "Despliegue tridimensional en planos escalonados con sombras de lujo",
      "Materialidad táctil inspirada en acabado mate de cámara telemétrica",
      "Indicador de nivel CEFR grabado en relieve japonés",
    ],
  },
  {
    id: "timeline_learning_journey",
    index: "16",
    name: "The Chronological Fluency Spine",
    subtitle: "Cronología de Fluidez Diaria · Hitos Conectados por Láser",
    silhouette: "Eje Temporal Vertical con Nodos Celestiales y Fibra Óptica",
    inspiration: "Astronomical Orbit Maps + Rolex Submariner Bezel + GitHub Journey",
    category: "structural",
    description:
      "Sustituye la lista estática de secciones por una línea de tiempo pedagógica del día ejecutivo: los módulos se disponen como hitos secuenciales del día (07:30 Workspace, 12:30 Sparring, 18:30 Writing), unidos por un filamento de luz láser continuo.",
    accent: "#10B981",
    highlights: [
      "Filamento de fibra óptica vertical que une las estaciones de práctica diaria",
      "Nodos con halo respirable que indican la tarea completada del día",
      "Etiquetas horarias de rutina ejecutiva optimizada por neurociencia",
      "Avatar en la cúspide de la órbita diaria como punto de origen",
    ],
  },
  {
    id: "circular_corner_fan",
    index: "17",
    name: "The Radial Corner Aperture",
    subtitle: "Apertura Radial en Esquina · Dial de Precisión Mecánica",
    silhouette: "Cuadrante de Círculo en Ángulo Inferior con Graduación Angular",
    inspiration: "Leica Camera Aperture Ring + Dieter Rams Braun Dial + Panerai Watch Face",
    category: "hardware",
    description:
      "Anclado en el ángulo inferior izquierdo de la pantalla, se despliega como un cuarto de cuadrante de reloj suizo. Los 6 iconos se sitúan a lo largo del arco circular con marcas de grados (0° a 90°), ofreciendo una ergonomía periférica insuperable.",
    accent: "#A855F7",
    highlights: [
      "Arco curvo de 90 grados con graduación milimétrica grabada",
      "Iconos situados a lo largo de la trayectoria orbital del cuadrante",
      "Selector de aguja central tipo compás náutico de titanio",
      "Minimiza la intrusión visual y ofrece la máxima ergonomía de cursor",
    ],
  },
  {
    id: "stealth_blade_zero",
    index: "18",
    name: "The 0-Width Obsidian Blade",
    subtitle: "Espada Invisible de 0px · Borde Háptico Deslizante",
    silhouette: "Línea Láser de 2px en Reposo, Hoja de Cristal en Despliegue",
    inspiration: "Aston Martin Flush Handles + Japanese Katana Edge + Mies van der Rohe",
    category: "editorial",
    description:
      "La máxima expresión del minimalismo espacial: el Sidenav mide exactamente 0px de ancho en reposo, manifestándose solo como un fino hilo de luz de 2px con micro-muescas fluorescentes. Al acercar el cursor al borde, una hoja de obsidiana pulida se desliza silenciosamente sin empujar el layout.",
    accent: "#818CF8",
    highlights: [
      "0 píxeles de intrusión visual cuando no se interactúa (pantalla 100% limpia)",
      "Borde láser con micro-muescas fluorescentes que pulsan sutilmente",
      "Deslizamiento fluido con amortiguación de alta inercia (física de vacío)",
      "Tipografía de corte láser con halo de micro-contraste",
    ],
  },
  {
    id: "horology_bezel",
    index: "19",
    name: "The Haute Horlogerie Bezel",
    subtitle: "Alta Relojería Ginebrina · Acabado Guilloché & Segundero Sweep",
    silhouette: "Bisel de Titanio Cepillado con Índices Calados al Láser",
    inspiration: "Audemars Piguet Royal Oak + Patek Philippe Calatrava + Jaeger-LeCoultre",
    category: "editorial",
    description:
      "Inspirado en la alta relojería suiza: acabado en titanio mate con micro-estrías 'Côtes de Genève'. Los módulos no usan cajas ni iconos genéricos: son índices calados grabados al láser con manecilla segundera de barrido continuo (sweep seconds) que marca la sesión de práctica en micro-segundos.",
    accent: "#E2E8F0",
    highlights: [
      "Micro-filamentos de textura guilloché grabados en titanio carbón",
      "Indicador de estado como 'Complicación de Reserva de Marcha' (Power Reserve: 48h)",
      "Marcadores horarios calados con tipografía serif contemporánea suiza",
      "Cero gradientes de IA: puro contraste metálico satinado y tipografía nítida",
    ],
  },
  {
    id: "architectural_monolith",
    index: "20",
    name: "The Zumthor Monolith",
    subtitle: "Brutalismo Silencioso · Piedra Basalto & Hendiduras de Luz",
    silhouette: "Monolito de Piedra Negra con Hendiduras Ópticas de 1px",
    inspiration: "Peter Zumthor Therme Vals + John Pawson Minimalist Monasteries",
    category: "editorial",
    description:
      "Un monolito de piedra volcánica negra sin botones visibles. Los ítems de navegación son hendiduras de luz de 1px talladas en la piedra. Cuando el cursor se posa sobre una sección, una suave luz cálida (3000K tungsteno, no neon) emana desde el interior de la hendidura.",
    accent: "#FDE68A",
    highlights: [
      "Luz cálida de filamento de tungsteno (3000K, cero luz azul de IA)",
      "Tipografía con espaciado amplio 0.28em tallada en bajo relieve óptico",
      "Navegación puramente léxica: STUDIO, LEXICON, SPARRING, ARCHIVE",
      "Textura táctil de roca porosa con biselado milimétrico",
    ],
  },
  {
    id: "dieter_rams_ten",
    index: "21",
    name: "The Braun Vitsoe 606 System",
    subtitle: "Diseño Funcionalista Puro · Menos, pero mejor",
    silhouette: "Estructura de Riel de Aluminio con Módulos Desmontables",
    inspiration: "Dieter Rams Braun T3 Pocket Radio + Vitsoe 606 Shelving System",
    category: "hardware",
    description:
      "Menos, pero mejor ('Weniger, aber besser'). Una estructura de riel de aluminio anodizado donde cada sección es un módulo funcional con proporciones áureas (1:1.618). Utiliza la paleta original de Dieter Rams: gris aluminio, grafito mate y un único punto naranja funcional como interruptor.",
    accent: "#FF5500",
    highlights: [
      "Tipografía Akzidenz-Grotesk en proporciones funcionales matemáticas",
      "Único botón de acento táctil naranja (#FF5500) idéntico a calculadora Braun ET66",
      "Ranuras de ventilación acústicas perforadas con precisión milimétrica",
      "Cero transparencias ni desenfoques: 100% materialidad física y honestidad estructural",
    ],
  },
  {
    id: "leica_rangefinder",
    index: "22",
    name: "The Leica M Optical Rangefinder",
    subtitle: "Óptica Mecánica de Precisión · Telémetro de Doble Imagen",
    silhouette: "Cuerpo de Magnesio Negro con Moleteado Diamantado",
    inspiration: "Leica M11 Monochrom + Lentes Summicron-M 50mm + Anillo de Enfoque",
    category: "hardware",
    description:
      "Inspirado en la ingeniería mecánica de las cámaras Leica M telemétricas: moleteado diamantado en los bordes para agarre táctil, ventana de visor óptico superior con telémetro de doble imagen para enfocar la herramienta activa, y escala de profundidad de campo grabada en blanco y rojo.",
    accent: "#EF4444",
    highlights: [
      "Borde con textura moleteada diamantada de agarre táctil de alta fidelidad",
      "Visor telemétrico donde la herramienta seleccionada 'enfoca' alineando dos imágenes",
      "Escala numérica grabada en blanco y rojo Leica (f/1.4, f/2.8, f/5.6)",
      "Sensación de click mecánico seco de obturador de láminas de titanio",
    ],
  },
  {
    id: "japanese_sensu",
    index: "23",
    name: "The Kyoto Sensu Silk Ribbon",
    subtitle: "Cinta de Seda Flotante · Minimalismo Wabi-Sabi & Ma",
    silhouette: "Cinta Vertical Estrecha de 28px con Caligrafía Kanso",
    inspiration: "Kengo Kuma Wood Lattice + Kyoto Silk Ribbon + Muji Art Direction",
    category: "floating",
    description:
      "Inspirado en el concepto japonés de 'Ma' (el espacio vacío elocuente): una cinta vertical ultra-fina de 28px que cuelga como un marcador de libro de seda en una encuadernación de lujo. Los módulos aparecen espaciados por generosos intervalos de vacío contemplativo.",
    accent: "#E5E5E5",
    highlights: [
      "Ancho ultra-estrecho de 28px que maximiza la serenidad del espacio de trabajo",
      "Generosos intervalos de vacío contemplativo (Ma) entre herramientas",
      "Física pendular sutil con caída de gravedad natural",
      "Sello hanko carmesí grabado en la base con la insignia del alumno",
    ],
  },
  {
    id: "teenage_engineering_tp7",
    index: "24",
    name: "The TP-7 Magnetic Tape Reel",
    subtitle: "Grabador de Campo Analógico · Disco Giratorio Motorizado",
    silhouette: "Chasis de Aluminio Fresado con Rueda de Cinta Central",
    inspiration: "Teenage Engineering TP-7 Field Recorder + Nagra IV-S Reel-to-Reel",
    category: "hardware",
    description:
      "Inspirado en el grabador de campo TP-7: un chasis de aluminio pulido con un disco central motorizado con cinta magnética visible. Al reproducir o grabar voz en Speaking o Reading, el disco gira suavemente a 33 RPM. Los controles son balancines de volumen con textura de disco de vinilo.",
    accent: "#F97316",
    highlights: [
      "Disco central giratorio animado que rota a 33 RPM durante las sesiones",
      "Interruptor balancín 'ROCKER' de dos posiciones para alternar entre herramientas",
      "Contador de cinta analógica mecánica (REC 00:14:22)",
      "Chasis de aluminio cepillado con tornillos Torx visibles en las esquinas",
    ],
  },
  {
    id: "bauhaus_geometry",
    index: "25",
    name: "The CELAEST Constructivist Geometry",
    subtitle: "Geometría Pura · Acento Violeta Eléctrico CELAEST",
    silhouette: "Columna de Formas Puras en Equilibrio Asimétrico",
    inspiration: "CELAEST Design System + Geometría Constructivista",
    category: "pure_geometry",
    description:
      "Geometría constructivista rigurosa adaptada al ecosistema CELAEST: cada herramienta está asociada a una primitiva geométrica pura dibujada con línea de 1.5px. El bloque activo utiliza el gradiente violeta eléctrico característico del software (#7048e8), con alineación óptica fija y tipografía corporativa.",
    accent: "#7048e8",
    material: "Deep Space Glass & Violeta Eléctrico CELAEST",
    hairline: "1px Línea Arquitectónica Translúcida",
    opticalRatio: "Eje Óptico Fijo Centrado (72px a 248px)",
    physics: "Resorte Fluido Framer Motion (Stiffness 300, Damping 28)",
    highlights: [
      "Emblema oficial CELAEST vectorizado en badge violeta de 44px",
      "Primitivas geométricas matemáticas (○ □ △ ◇ ⬡ + ⊞) en trazo de 1.5px",
      "Eje óptico fijo: cero movimiento en X al abrir o cerrar el panel",
      "Gradiente violeta eléctrico característico de la plataforma",
    ],
  },
  {
    id: "apple_park_glass",
    index: "26",
    name: "The Cupertino Curved Glass Pavilion",
    subtitle: "Vidrio Curvo Arquitectónico · Refracción Óptica de 4K",
    silhouette: "Hoja de Vidrio Translúcido con Radio Continuo de 32px",
    inspiration: "Foster + Partners Apple Park Steve Jobs Theater + Vitsoe Cases",
    category: "pure_geometry",
    description:
      "Una lámina de vidrio ahumado monolítica ultra-delgada inspirada en los paneles de cristal curvo de 12 metros de Apple Park. Utiliza difuminado háptico multicapa (backdrop-blur-3xl), un bisel de refracción de 0.5px que refleja la luz ambiental y tipografía Apple SF Pro ultra-light.",
    accent: "#F8FAFC",
    highlights: [
      "Borde con biselado de lente cóncava que refracta sutilmente el fondo",
      "Tipografía font-extralight con máxima legibilidad a escala reducida",
      "Efecto de halo de luz líquida que viaja por el perímetro al interactuar",
      "Indicador de racha integrado como un anillo de cristal flotante",
    ],
  },
  {
    id: "braille_tactile_ridge",
    index: "27",
    name: "The Braille Tactile Micro-Ridge",
    subtitle: "Bajo Relieve Táctil · Micropuntos de Relieve Háptico",
    silhouette: "Columna de Cuero Negro Mate con Puntos Táctiles en Relieve",
    inspiration: "Bang & Olufsen Beosound Touch + High-End Embossed Editorial",
    category: "pure_geometry",
    description:
      "Diseñado para la sensación del tacto físico: una columna de textura mate con una cuadrícula de micropuntos en bajorrelieve. Al posar el cursor sobre una herramienta, los puntos correspondientes se 'levantan' ópticamente con una sombra hiper-realista como si fuera papel prensado a mano.",
    accent: "#D4D4D8",
    highlights: [
      "Matriz de micropuntos en relieve táctil (3x2 puntos por módulo)",
      "Efecto de prensado tipográfico ('letterpress deboss') que da profundidad física sin bordes",
      "Cero gradientes de color: todo el contraste se logra con sombras de bajo relieve",
      "Sensación táctil sorda de papel hecho a mano y cuero mineral",
    ],
  },
  {
    id: "monocle_travel_column",
    index: "28",
    name: "The Monocle Travel Journal",
    subtitle: "Editorial de Viajes Ejecutivo · Notas Marginales & Sello de Cera",
    silhouette: "Columna Editorial Estrecha con Glifos de Cuaderno de Campo",
    inspiration: "Monocle Magazine + Midori Traveler's Notebook + Rimowa Titanium",
    category: "pure_geometry",
    description:
      "La estética de un cuaderno de notas de un corresponsal internacional: una columna esbelta con glifos mínimos grabados, anotaciones en margen izquierdo ('LAT: 40.71° // NYC'), y un sello de certificación de horas de práctica en la base que parece estampado con tinta seca.",
    accent: "#FBBF24",
    highlights: [
      "Anotaciones marginales en tipografía monospace 8px alineadas al milímetro",
      "Sello de certificación de fluidez con fecha UTC y zona horaria ejecutiva",
      "Separadores de línea punteada estilo 'perforated notebook sheet'",
      "Micro-etiquetas de objetivo internacional: 'EN-US // C1 TARGET'",
    ],
  },
  {
    id: "polaroid_film_strip",
    index: "29",
    name: "The Analog Film Strip Reel",
    subtitle: "Tira de Película de 35mm · Fotogramas de Aprendizaje",
    silhouette: "Tira Vertical con Perforaciones de Arrastre de Película de 35mm",
    inspiration: "Hasselblad 500C Film Back + Kodak Tri-X 400 + Leica Negatives",
    category: "pure_geometry",
    description:
      "Inspirado en una tira de negativos de película de 35mm blanco y negro: el borde izquierdo cuenta con perforaciones cuadradas de arrastre de celuloide. Cada herramienta de CELAEST es un fotograma enmarcado con su número de cuadro ('EXP 01', 'EXP 02'). Al hacer click, el fotograma se ilumina como sobre una mesa de luz de fotógrafo.",
    accent: "#E2E8F0",
    highlights: [
      "Perforaciones de arrastre de celuloide de 35mm talladas a lo largo de la arista",
      "Números de fotograma grabados ('EXP 01/06', 'KODAK TRI-X')",
      "Efecto de mesa de luz: la herramienta activa pasa de negativo translúcido a blanco puro",
      "Tinta de emulsión fotográfica mate sobre fondo negro de haluro de plata",
    ],
  },
  {
    id: "astronomical_caliper",
    index: "30",
    name: "The Celestial Caliper Instrument",
    subtitle: "Instrumento Astronómico de Precisión · Nonio Milimétrico",
    silhouette: "Regla Graduada con Escala de Nonio de Doble Precisión",
    inspiration: "Nautical Sextant + Star Chart Cartography + Vernier Caliper Scale",
    category: "pure_geometry",
    description:
      "Un instrumento de navegación celeste: una regla de titanio con divisiones de escala vernier de 0.1mm. Al seleccionar un módulo, un cursor micrométrico con tornillo de ajuste fino se desliza por la escala marcando la coordenada exacta de la sesión.",
    accent: "#67E8F9",
    highlights: [
      "Escala graduada de nonio con marcas cada 1mm grabadas con láser",
      "Marcador deslizante micrométrico con retícula de ajuste fino",
      "Coordenadas estelares de sesión de práctica (RA 14h 29m // DEC +62°)",
      "Tacto de instrumento náutico de latón negro y titanio aeroespacial",
    ],
  },
  {
    id: "vacheron_guilloche",
    index: "31",
    name: "The Geneva Guilloché Atelier",
    subtitle: "Alta Relojería Suiza · Guilloché Clous de Paris en Oro Blanco",
    silhouette: "Bisel Octogonal Biselado con Esfera de Guilloché Torneada a Mano",
    inspiration: "Vacheron Constantin Overseas + Patek Philippe Calatrava + Audemars Piguet",
    category: "atelier_luxury",
    description:
      "La cúspide de la relojería artesanal ginebrina: un panel acabado con patrón Clous de Paris en guilloché torneado a mano con trazos de 0.25px. Marcadores de horas tipo Breguet tallados en metal blanco, manecilla azulada al fuego térmico y el Punzón de Ginebra grabado como sello de maestría.",
    accent: "#D4AF37",
    material: "Titanio Anthracite & Oro 24K",
    hairline: "0.25px Guilloché Clous de Paris",
    opticalRatio: "Octogonal 1:1.414 Proporción Áurea",
    physics: "Calibre 4100 Automático (28,800 vph)",
    highlights: [
      "Patrón Clous de Paris guilloché con relieve micrométrico de 0.25px",
      "Marcador de sesión como aguja azulada al fuego estilo Breguet",
      "Punzón de Ginebra (Geneva Seal) grabado con láser en la arista inferior",
      "Bisel exterior octogonal con pulido espejo y aristas satinadas a mano",
    ],
  },
  {
    id: "hasselblad_medium_format",
    index: "32",
    name: "The Gothenburg 6x6 Medium Format",
    subtitle: "Cámara de Medio Formato · Visor de Cristal Esmerilado de Cintura",
    silhouette: "Cuerpo Cúbico de Aleación de Magnesio con Retícula de Enfoque",
    inspiration: "Hasselblad 500C/M + Rolleiflex 2.8F + Zeiss Planar 80mm",
    category: "atelier_luxury",
    description:
      "Inspirado en el mítico visor de cintura de las cámaras Hasselblad: una pantalla cuadrada de cristal esmerilado con retícula milimétrica grabada al ácido. Cada herramienta se alinea con una cruz de enfoque óptico. Los diales laterales ajustan la apertura de sesión con clicks de diafragma metálico.",
    accent: "#A1A1AA",
    material: "Aleación de Magnesio & Cristal Esmerilado",
    hairline: "0.5px Retícula Grabada al Ácido",
    opticalRatio: "Formato Cuadrado Puro 6x6",
    physics: "Obturador Central de Láminas Compur (1/500s)",
    highlights: [
      "Visor superior de cintura con retícula de cristal esmerilado grabada al ácido",
      "Selector de herramientas con sensación de click de diafragma f/2.8 a f/22",
      "Chasis de aleación de magnesio satinado con escudo escandinavo",
      "Cruz central de enfoque telemétrico que alinea las coordenadas ópticas",
    ],
  },
  {
    id: "kyoto_kintsugi",
    index: "33",
    name: "The Kintsugi Gold Seam Monolith",
    subtitle: "Filosofía Wabi-Sabi · Fisura de Oro Líquido & Pizarra Volcánica",
    silhouette: "Monolito de Pizarra Mate Unida por una Vena de Oro Puro",
    inspiration: "Kintsugi Ceramic Repair + Tadao Ando Raw Concrete + Ryoan-ji Rock Garden",
    category: "atelier_luxury",
    description:
      "Enraizado en el arte japonés del Kintsugi: la belleza de lo imperfecto y lo reparado. Una columna monolítica de piedra basáltica negra mate atravesada verticalmente por una fina grieta de pan de oro líquido de 24 quilates. Los módulos habitan en los puntos de contacto de la veta dorada, creando un equilibrio asimétrico y silencioso.",
    accent: "#EAB308",
    material: "Basalto Volcánico & Pan de Oro 24K",
    hairline: "0.75px Fisura Orgánica Kintsugi",
    opticalRatio: "Asimetría Zen & Concepto Ma (間)",
    physics: "Gravedad Silenciosa / Cero Ruido Digital",
    highlights: [
      "Veta de oro líquido Kintsugi que conecta todas las herramientas en una línea orgánica",
      "Fondo de basalto volcánico oscuro mate con textura de piedra porosa natural",
      "Cero bordes sintéticos: el vacío espacial (Ma) guía la navegación",
      "Sello de laca urushi bermellón en la base con la insignia de maestría",
    ],
  },
  {
    id: "braun_et66_ledger",
    index: "34",
    name: "The Kronberg ET66 Calculator Ledger",
    subtitle: "Funcionalismo Industrial Braun · Dieter Rams & Dietrich Lubs",
    silhouette: "Consola de Botones Circulares Convexos con Código Cromático 1977",
    inspiration: "Braun ET66 Calculator (1977) + Apple iOS Calculator Origin + Vitsoe 606",
    category: "atelier_luxury",
    description:
      "El diseño icónico de Dietrich Lubs y Dieter Rams de 1977: botones circulares convexos de tacto esférico en tres tonos icónicos (gris basalto para módulos neutros, verde bosque para Workspace, y botón de acción en amarillo tráfico puro). Pantalla superior LCD de cristal líquido verde oliva con números de segmentos.",
    accent: "#F59E0B",
    material: "Plástico Termoformado Basalto & Vidrio TN LCD",
    hairline: "Tolerancia de Molde de Inyección 0.3mm",
    opticalRatio: "Retícula Circular Ortogonal 1977",
    physics: "Domo de Membrana Táctil con Clic Sordo",
    highlights: [
      "Teclas circulares convexas con concavidad física para la yema del dedo",
      "Paleta cromática histórica Braun: Gris Basalto, Oliva Drab y Amarillo Tráfico",
      "Pantalla superior estilo LCD TN vintage de 8 dígitos para telemetría diaria",
      "Estructura sin tornillos con carcasa deslizable de protección integral",
    ],
  },
  {
    id: "titanium_potentiometer",
    index: "35",
    name: "The Aerospace Titanium Potentiometer",
    subtitle: "Consola Lineal de Precisión · Fader Mecánico Deslizante de Titanio",
    silhouette: "Riel Lineal Vertical con Deslizador de Fader Físico PVD",
    inspiration: "Solid State Logic Master Fader + Rupert Neve 5088 + NASA Mission Control Console",
    category: "atelier_luxury",
    description:
      "La sensación física de un fader de mezcla analógico de estudio de masterización: un riel fresado en titanio aeroespacial con un deslizador anodizado negro mate. Al seleccionar una sección, el fader físico se mueve con gravedad magnética y encaja con un chasquido sordo en la muesca de decibelios grabada con láser.",
    accent: "#38BDF8",
    material: "Titanio Grado 5 PVD & Fibra Conductora",
    hairline: "Ranura de Tolerancia 50 Micras",
    opticalRatio: "Escala Logarítmica de Atenuación dB",
    physics: "Resistencia Viscosa de 100mm de Recorrido",
    highlights: [
      "Fader físico deslizante con cabezal de titanio PVD que se desplaza suavemente",
      "Escala lineal con marcas en decibelios (+10dB, 0dB, -5dB, -∞) grabadas con láser",
      "Micro-ranura de guía fresada con tolerancia de 50 micras",
      "Medidor VU lineal de 12 segmentos LED bicolores de respuesta ultrarrápida",
    ],
  },
  {
    id: "alvar_aalto_bentwood",
    index: "36",
    name: "The Scandinavian Bentwood Curve",
    subtitle: "Arquitectura Orgánica Finlandesa · Madera Curvada al Vapor & Lino",
    silhouette: "Cinta Curva Continua de Madera de Abedul con Perfil de Resonancia",
    inspiration: "Alvar Aalto Paimio Sanatorium + Artek Furniture + Marimekko Minimalism",
    category: "atelier_luxury",
    description:
      "Inspirado en la calidez táctil de la madera laminada curvada al vapor de Alvar Aalto: una silueta de líneas sinuosas y orgánicas con tonos cálidos de madera clara y texturas de lino natural. La iluminación ambiental es una temperatura cálida de 3000K, eliminando toda frialdad digital para crear una atmósfera de aprendizaje serena y humana.",
    accent: "#FDE68A",
    material: "Laminado de Abedul Finlandés & Hilado de Lino",
    hairline: "Arista Biselada Orgánica de 1.2mm",
    opticalRatio: "Curvatura Catagórica de Sanatorio Paimio",
    physics: "Flexión Elástica de Madera Viva / Calor 3000K",
    highlights: [
      "Curva sinuosa continua inspirada en el respaldo de la butaca Paimio de 1932",
      "Acabado de abedul natural con textura de veta de madera visible y lino",
      "Iluminación indirecta cálida de 3000K con sombra suave difusa",
      "Tipografía escandinava humanista con proporciones clásicas y amplio respiro",
    ],
  },
  {
    id: "helvetica_1957",
    index: "37",
    name: "The Zurich Helvetica 1957 Specimen",
    subtitle: "Tipografía Suiza Pura · Max Miedinger & Neue Haas Grotesk",
    silhouette: "Columna Asimétrica Tipográfica Sin Cajas Ni Bordes",
    inspiration: "Max Miedinger + Eduard Hoffmann + Josef Müller-Brockmann",
    category: "pure_minimalism",
    description:
      "La máxima pureza del diseño suizo: cero contenedores, cero bordes, cero sombras y cero degradados. La jerarquía se construye exclusivamente mediante espaciado, pesos tipográficos y una retícula matemática invisible. Un ejercicio radical de serenidad y legibilidad absoluta.",
    accent: "#FFFFFF",
    material: "Fondo Negro Carbón Mate & Tinta Blanca Pura",
    hairline: "0.5px Regla Horizontal Continua",
    opticalRatio: "Retícula Asimétrica de 8 Columnas",
    physics: "Cero Latencia / Transición Tipográfica Pura",
    highlights: [
      "Cero contenedores: los textos flotan en espacio negativo puro",
      "Transición activa exclusivamente por peso tipográfico y tick blanco",
      "Identificador superior con código de espécimen tipográfico 'HAAS 1957'",
      "Contraste óptico extremo con legibilidad clínica sin fatiga visual",
    ],
  },
  {
    id: "zumthor_therme_slate",
    index: "38",
    name: "The Peter Zumthor Therme Slate",
    subtitle: "Monolito Arquitectónico · Cuarcita de Vals & Luz Dorada",
    silhouette: "Monolito de Piedra Oscura con Hendidura Horizontal de Luz",
    inspiration: "Peter Zumthor Therme Vals + Swiss Alpine Architecture",
    category: "pure_minimalism",
    description:
      "Inspirado en los baños termales de Vals de Peter Zumthor: una columna de cuarcita oscura monolítica donde las herramientas se inscriben como nombres de estancias arquitectónicas. La herramienta activa se distingue por una sutil hendidura horizontal de luz dorada tenue (—), creando una atmósfera de concentración monástica.",
    accent: "#EAB308",
    material: "Cuarcita Gris Basalto & Hendidura Dorada Moteada",
    hairline: "0.5px Hendidura de Luz Horizontal",
    opticalRatio: "Estructura Monolítica de Bloque 1:3",
    physics: "Silencio Arquitectónico de Masa Pura",
    highlights: [
      "Cero cajas: las secciones se nombran como estancias (BRIEF, VAULT, VOICE, PAGES)",
      "Marcador de posición como línea horizontal de luz dorada tenue (—)",
      "Tipografía grabada a bajo relieve sin artefactos digitales",
      "Pie de página con etiqueta de habitante: 'OCCUPANT // A1 ELEMENTARY'",
    ],
  },
  {
    id: "wim_crouwel_1968",
    index: "39",
    name: "The Amsterdam Crouwel 1968 Grid",
    subtitle: "Modernismo Holandés Radical · Matriz Geométrica Total Design",
    silhouette: "Retícula Matemática Ortogonal con Glifos Angulares a 45°",
    inspiration: "Wim Crouwel + Stedelijk Museum Amsterdam + Total Design 1968",
    category: "pure_minimalism",
    description:
      "La estética de los carteles del Museo Stedelijk de Ámsterdam: una matriz matemática estricta donde cada glifo y número se construye sobre ángulos ortogonales y diagonales a 45°. El estado activo es un sólido bloque de pizarra fría con coordenadas milimétricas grabadas.",
    accent: "#94A3B8",
    material: "Esmalte Gris Pizarra Fría & Tinta de Serigrafía",
    hairline: "1px Retícula Matemática 45°",
    opticalRatio: "Matriz Cuadrada Ortogonal 24x24",
    physics: "Alineación Matemática Invariable",
    highlights: [
      "Glifos tipográficos generados bajo la retícula New Alphabet de 1967",
      "Indicadores de posición entre corchetes angulares: [ 01 ], [ 02 ]",
      "Coordenadas de cuadrícula cartográfica en el encabezado (GRID X:04 Y:12)",
      "Paleta monocromática de pizarra, carbón y tiza blanca mate",
    ],
  },
  {
    id: "vignelli_unigrid_1972",
    index: "40",
    name: "The Massimo Vignelli Unigrid",
    subtitle: "Diseño Racionalista · Metro de Nueva York & Sistema Unigrid",
    silhouette: "Estructura Modular Racionalista con Cinta de Acento Carmesí",
    inspiration: "Massimo Vignelli + 1972 New York Subway Graphic Standards Manual",
    category: "pure_minimalism",
    description:
      "La cúspide del diseño racionalista de Massimo Vignelli: estructura de información basada en su legendario Unigrid de 1972. Sin ornamentos, sin cajas superfluas; solo franjas horizontales de ritmo perfecto, numeración tipográfica clásica y una sobria barra bermellón mate para el estado activo.",
    accent: "#B91C1C",
    material: "Aluminio Negro Mate & Franja Carmesí Subcutánea",
    hairline: "1.5px Cinta Racionalista Unigrid",
    opticalRatio: "Módulo Modular Racionalista Vignelli 4:3",
    physics: "Geometría Funcional Rápida",
    highlights: [
      "Numeración encerrada en círculos minimalistas: (1), (2), (3)",
      "Franja de acento en carmesí mate sobrio sin gradientes ni resplandor",
      "Tipografía estándar Akzidenz con pesos rigurosamente contrastados",
      "Organización modular que guía la mirada con velocidad instantánea",
    ],
  },
  {
    id: "paul_rand_modernism",
    index: "41",
    name: "The Paul Rand Modernist Harmony",
    subtitle: "Modernismo Estadounidense · Proporción, Asimetría & Tono Tierra",
    silhouette: "Composición Geométrica Asimétrica en Tonalidades Neutras",
    inspiration: "Paul Rand Corporate Identities (IBM, Westinghouse, NeXT) + Bauhaus US",
    category: "pure_minimalism",
    description:
      "Inspirado en la filosofía de Paul Rand sobre la síntesis de forma y contenido: formas geométricas elementales combinadas con una paleta cálida de tonos tierra (crema cálido, siena tostado mate y negro basalto). Cero artificios tecnológicos: puro equilibrio de tensiones visuales.",
    accent: "#C2410C",
    material: "Papel Hecho a Mano & Pigmento de Siena Tostada",
    hairline: "1px Línea de Tensión Asimétrica",
    opticalRatio: "Equilibrio Dinámico Asimétrico",
    physics: "Gravedad Visual Proporcional",
    highlights: [
      "Paleta sofisticada de siena tostada mate, crema y grafito",
      "Iconografía primaria de recorte abstracto con balance visual",
      "Separadores de línea con muesca de equilibrio asimétrico",
      "Tipografía clásica americana con calidez humanista y gran respiro",
    ],
  },
  {
    id: "jil_sander_minimal",
    index: "42",
    name: "The Jil Sander Pure Cashmere",
    subtitle: "Minimalismo Textil de Lujo · Vacío Espacial & Aristas Vivas",
    silhouette: "Columna Ultra-Esbelta de Obsidiana con Tipografía en Susurro",
    inspiration: "Jil Sander Milan Flagship + Fabien Baron Editorial + Loro Piana Textures",
    category: "pure_minimalism",
    description:
      "El epítome del lujo silencioso de la moda de alta costura: una columna esbelta con proporciones hiper-alargadas, espaciado generoso entre palabras y tipografía ultra-fina que casi parece un susurro. Cero distracciones: el producto (el aprendizaje del estudiante) es lo único que importa.",
    accent: "#E2E8F0",
    material: "Seda Negra Mate & Fibra de Cachemira Oscura",
    hairline: "0.25px Línea Selvedge Japonesa",
    opticalRatio: "Proporción 1:4 Esbeltez Máxima",
    physics: "Susurro Silencioso / Caída de Tela Pesada",
    highlights: [
      "Espaciado vertical amplio con máximo respiro entre herramientas",
      "Tipografía ultra-light con tracking suavemente extendido",
      "Indicador activo como micro-punto de seda en blanco marfil",
      "Atmósfera de sastrería arquitectónica de alta gama",
    ],
  },
  {
    id: "mies_nationalgalerie",
    index: "43",
    name: "The Mies van der Rohe Steel Column",
    subtitle: "Modernismo Arquitectónico Radical · Viga I de Acero & Luz Estructural",
    silhouette: "Columna de Acero Pavonado Negro con Aristas Vivas y Regla Láser",
    inspiration: "Mies van der Rohe Neue Nationalgalerie Berlin (1968) + Seagram Building",
    category: "pure_minimalism",
    description:
      "La pureza constructiva del 'Menos es más': una columna estructural de acero pavonado negro mate con aristas vivas de 90°. Sin carcasas, sin adornos plásticos; únicamente la verdad del material, tipografía DIN de ingeniería alemana y una sutil línea blanca de 1px como indicador activo.",
    accent: "#FFFFFF",
    material: "Acero Laminado Pavonado & Pintura Mate Carbón",
    hairline: "0.5px Regla Láser Continua de Precisión",
    opticalRatio: "Retícula Universal Miesiana 1:2.4",
    physics: "Gravedad Monumental / Estabilidad Absoluta",
    highlights: [
      "Perfil de viga estructural de acero con aristas ortogonales vivas a 90°",
      "Tipografía DIN alemana de alta ingeniería con contraste nítido y cero fatiga",
      "Indicador activo mediante un fino trazo láser blanco de 0.5px que conecta el eje",
      "Pie con marca de forja berlinesa: 'MIES // NEUE NATIONALGALERIE 1968'",
    ],
  },
  {
    id: "braun_sk4_snow_white",
    index: "44",
    name: "The Braun SK4 Phonosuper 'Snow White'",
    subtitle: "Funcionalismo Alemán Puro · Acrílico Cristalino & Madera de Olmo",
    silhouette: "Monolito de Chapa Metálica Gris Claro con Tapa de Acrílico Óptico",
    inspiration: "Dieter Rams & Hans Gugelot (1956) + Vitsoe Industrial Archives",
    category: "pure_minimalism",
    description:
      "El legendario 'Ataúd de Blancanieves' de 1956: la primera vez que el acrílico transparente se usó como cubierta estructural. Una columna de chapa metálica blanca tiza con ranurado lineal vertical. El indicador activo es una aguja micrométrica en tono amarillo tráfico suave sobre una escala grabada.",
    accent: "#FBBF24",
    material: "Chapa de Acero Blanco Tiza & Acrílico Cristalino",
    hairline: "Ranurado Acústico de 1.2mm de Separación",
    opticalRatio: "Equilibrio Racional Rams-Gugelot 1956",
    physics: "Amortiguación Viscosa de Brazo Fonocaptor",
    highlights: [
      "Fondo blanco tiza mate con ranuras acústicas lineales de ventilación",
      "Aguja indicadora mecánica en amarillo tráfico mate sin sombras digitales",
      "Tipografía Akzidenz-Grotesk grabada directamente en la superficie metálica",
      "Pie de página con inscripción histórica: 'BRAUN AG // FRANKFURT 1956'",
    ],
  },
  {
    id: "otl_aicher_1972",
    index: "45",
    name: "The Otl Aicher Munich Olympic Grid",
    subtitle: "Sistema Pictográfico Universal · Geometría Estricta & Ángulos de 45°/90°",
    silhouette: "Cuadrícula Ortogonal Racionalista con Pictogramas Elementales",
    inspiration: "Otl Aicher München 1972 Corporate Identity + Hochschule für Gestaltung Ulm",
    category: "pure_minimalism",
    description:
      "El sistema de comunicación visual más influyente del siglo XX: creado por Otl Aicher para los Juegos de Múnich 1972. Cada herramienta está desprovista de adornos y definida por su función esencial en una cuadrícula modular rigurosa. El estado activo es un cuadrado negro sólido con contraste invertido.",
    accent: "#38BDF8",
    material: "Esmalte Mate Blanco Nieve & Pigmento Negro Humo",
    hairline: "1.5px Cuadrícula Geométrica Ortogonal",
    opticalRatio: "Matriz Matemática Cuadrada 16x16",
    physics: "Respuesta Instantánea de Sistema de Señalización",
    highlights: [
      "Pictogramas construidos bajo la retícula estricta de 45° y 90° de Ulm",
      "Bloque activo con inversión cromática neta sin desenfoques ni halos",
      "Tipografía Univers en pesos 55 y 65 con espaciado óptico milimétrico",
      "Encabezado con código de señalética internacional: 'MÜNCHEN 1972 // SYSTEM'",
    ],
  },
  {
    id: "gropius_fagus_werk",
    index: "46",
    name: "The Walter Gropius Fagus-Werk Curtain Wall",
    subtitle: "Arquitectura Pionera de Cristal · Esquinas Transparentes Sin Apoyos",
    silhouette: "Muro Cortina de Vidrio Estructural con Impostas Negras de Acero",
    inspiration: "Walter Gropius & Adolf Meyer Fagus-Werk (1911) + Patrimonio Mundial UNESCO",
    category: "pure_minimalism",
    description:
      "Inspirado en el primer edificio del Movimiento Moderno con esquinas de cristal flotantes: el Fagus-Werk de 1911. Una columna donde los soportes de carga se retiran hacia el interior, permitiendo que la navegación flote en una membrana transparente con delgadas impostas de hierro negro.",
    accent: "#94A3B8",
    material: "Hierro Forjado Negro & Vidrio Float Cristalino",
    hairline: "0.75px Impostas Horizontales de Vidrio",
    opticalRatio: "Volumetría Suspendida Sin Columnas Esquineras",
    physics: "Ligereza Estructural de Suspensión Aérea",
    highlights: [
      "Esquinas ópticamente desprovistas de marco: el texto flota libre en el espacio",
      "Delgadas impostas horizontales que marcan el ritmo arquitectónico del piso",
      "Estado activo marcado por una doble línea transversal de acero negro",
      "Pie con coordenadas de patrimonio arquitectónico: 'ALFELD // 1911 UNESCO'",
    ],
  },
  {
    id: "enzo_mari_autoprogettazione",
    index: "47",
    name: "The Enzo Mari Autoprogettazione 1974",
    subtitle: "Diseño Democrático Radical · Honestidad de Materiales & Trazos Crudos",
    silhouette: "Columna de Madera Negra Mate con Puntos de Anclaje Visibles",
    inspiration: "Enzo Mari Proposta per Autoprogettazione (Milano 1974) + Arte Programmata",
    category: "pure_minimalism",
    description:
      "La filosofía radical de Enzo Mari sobre el diseño no consumista: belleza pura nacida de la honestidad de la construcción. Tablones de corte recto negro mate con marcas de clavos de registro artesanal. El elemento activo se destaca con un sello tipográfico en bajo relieve.",
    accent: "#E2E8F0",
    material: "Madera de Pino Carbonizada & Clavos de Acero Crudo",
    hairline: "1.0px Trazo de Sierra de Carpintería",
    opticalRatio: "Sección Modular Estándar 1x4 Pulgadas",
    physics: "Materialidad Cruda / Cero Artificio Digital",
    highlights: [
      "Marcas circulares de clavos de registro estructural en los extremos",
      "Tipografía Helvetica cruda estampada como sello de taller artesanal",
      "Cero bordes pulidos artificiales: ritmo honesto de ensamblaje modular",
      "Pie de página con manifiesto de diseño: 'MARI // AUTOPROGETTAZIONE 1974'",
    ],
  },
  {
    id: "sanaa_translucent_membrane",
    index: "48",
    name: "The SANAA Translucent Membrane",
    subtitle: "Arquitectura Inmaterial Japonesa · Kazuyo Sejima & Ryue Nishizawa",
    silhouette: "Velo Ultra-Delgado Casi Imperceptible con Tipografía Suspendida",
    inspiration: "SANAA 21st Century Museum of Contemporary Art Kanazawa + Rolex Learning Center",
    category: "pure_minimalism",
    description:
      "El concepto de arquitectura efímera y desmaterializada de Kazuyo Sejima: una columna que se disuelve en el fondo oscuro mediante una membrana translúcida al 3% de opacidad. El texto flota sin peso en el espacio, y la herramienta activa se revela por un sutil cambio de luminosidad ambiental.",
    accent: "#F8FAFC",
    material: "Acrílico Esmerilado Satinado & Niebla Blanca",
    hairline: "0.2px Borde de Refracción Óptica",
    opticalRatio: "Disolución Perimétrica Infinita",
    physics: "Gravedad Cero / Desmaterialización Óptica",
    highlights: [
      "Membrana translúcida ultra-fina que elimina toda sensación de 'caja' o 'botón'",
      "Tipografía blanca etérea con contraste calibrado para lectura descansada",
      "Transición activa basada en pura radiación de luz blanca difusa (sin fondo duro)",
      "Pie de página zen con inscripción de arquitectura: 'SEJIMA // KANAZAWA'",
    ],
  },
];

const CELAEST_LOGO_VIEWBOX = { width: 380, height: 503 };
const CELAEST_LOGO_PATH_D =
  "M374.479 1.73333C374.479 4.53333 362.346 27.7333 355.813 37.3333C340.079 60.8 316.213 85.6 292.746 103.067C272.879 117.867 264.879 122.8 227.413 142.933C209.813 152.4 192.746 161.867 189.413 164.267C170.213 177.2 157.279 190.533 149.813 205.333L146.079 212.667L144.479 201.867C142.079 185.333 135.946 168.4 129.013 158.4C125.813 154 125.813 153.333 128.879 153.333C133.679 153.333 145.279 146.267 151.013 139.867C156.746 133.6 162.479 121.467 162.479 116C162.479 113.867 161.679 114 155.813 118C146.079 124.533 136.879 127.333 125.146 127.2C116.879 127.2 113.013 126.267 102.479 122.133C73.4127 110.533 61.0127 110.533 44.346 122C37.946 126.4 36.6127 126.8 26.346 127.067C17.4127 127.333 13.546 128.133 7.54603 130.933C-0.853972 134.8 -2.32064 137.333 3.54603 137.333C14.8794 137.333 37.4127 150.133 46.746 161.867C53.8127 170.667 59.4127 182.533 61.8127 194.133C64.346 206.267 64.346 229.867 61.6794 251.333C58.746 274 58.746 305.067 61.6794 320.667C66.0794 344.533 75.146 366.667 88.746 386.933C95.546 396.933 111.013 414.267 117.146 418.667L120.879 421.333L117.413 411.6C114.479 403.467 113.946 399.333 113.546 384L113.146 366L117.013 380.667C126.746 418.133 140.213 440.4 163.279 456.8C171.013 462.4 184.346 469.067 191.813 471.333C194.746 472.133 194.479 471.6 189.679 466.533C179.413 455.733 168.879 436.667 162.613 417.6C156.213 398.267 156.613 397.333 165.146 412.667C176.879 433.6 186.613 446.8 201.146 461.333C228.479 488.8 255.546 500.8 293.146 502.133L311.146 502.8L300.346 496.933C271.813 481.333 243.946 457.867 223.946 432.667C211.279 416.8 211.679 415.6 225.279 428.8C243.946 446.8 255.946 454 272.746 457.067L279.813 458.267L271.679 449.733C267.279 444.933 262.479 438.533 260.879 435.467C258.613 430.667 257.146 429.467 251.279 427.467C235.146 421.867 216.479 407.6 204.346 391.6C193.546 377.333 182.479 351.2 182.479 340C182.479 336.8 183.279 336.267 195.413 332.933C225.146 324.533 252.746 308.533 274.879 286.667C281.946 279.6 287.813 273.2 287.813 272.4C287.813 271.467 284.879 271.867 279.946 273.333C270.213 276.4 254.213 278.667 243.413 278.533L235.146 278.4L245.813 274.8C262.213 269.067 284.746 258.533 295.146 251.867C312.879 240.4 327.679 224.267 336.346 207.067C341.546 196.533 341.013 195.2 333.279 200.667C319.413 210.667 292.746 220.533 273.279 223.067C268.213 223.733 269.546 222.667 284.613 215.333C337.679 189.333 366.213 156.933 371.146 116.933L372.079 109.2L357.679 123.733C341.146 140.267 323.946 152.267 302.479 162.533C282.346 172 280.213 172 293.813 162.667C335.679 133.867 364.746 98.4 375.279 63.3333C378.346 52.8 378.879 48.9333 379.013 32C379.146 12 377.946 -7.91252e-06 375.679 -7.91252e-06C375.013 -7.91252e-06 374.479 0.799992 374.479 1.73333Z";

export const SidenavEvolutionMatrixShowcase: React.FC = () => {
  const [selectedId, setSelectedId] = useState<SidenavArchetypeId>("dock_kinetic");
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeNav, setActiveNav] = useState("interview");
  const [userName, setUserName] = useState("Esteban Perez");
  const [userLevel, setUserLevel] = useState("A1 Elementary");
  const [notification, setNotification] = useState<string | null>(null);
  const [kineticTrigger, setKineticTrigger] = useState(0);

  const activeArchetype: ArchetypeMeta = useMemo(
    () => ARCHETYPES.find((a) => a.id === selectedId) || ARCHETYPES[0],
    [selectedId],
  );

  const handleApplyToLiveSidebar = (archetype: ArchetypeMeta) => {
    setSelectedId(archetype.id);
    if (typeof window !== "undefined") {
      let mappedVariant = "atelier_minimalist";
      if (archetype.id === "dock_kinetic") mappedVariant = "atelier_minimalist";
      if (archetype.id === "dual_rail") mappedVariant = "precision_chrono";
      if (archetype.id === "orbit_pebbles") mappedVariant = "specular_glass";
      if (archetype.id === "studio_cockpit") mappedVariant = "acoustic_resonance";
      if (archetype.id === "swiss_editorial") mappedVariant = "swiss_editorial";
      if (archetype.id === "bento_modular") mappedVariant = "precision_chrono";
      if (archetype.id === "cyber_acoustic") mappedVariant = "acoustic_resonance";
      if (archetype.id === "horizon_cockpit") mappedVariant = "atelier_minimalist";
      if (archetype.id === "neo_brutalist") mappedVariant = "precision_chrono";
      if (archetype.id === "liquid_mercury") mappedVariant = "specular_glass";
      if (archetype.id === "accordion_tree") mappedVariant = "precision_chrono";
      if (archetype.id === "hairline_wireframe") mappedVariant = "atelier_minimalist";

      if (archetype.id === "dynamic_island_top") mappedVariant = "atelier_minimalist";
      if (archetype.id === "command_palette_hud") mappedVariant = "precision_chrono";
      if (archetype.id === "origami_accordion_fold") mappedVariant = "atelier_minimalist";
      if (archetype.id === "timeline_learning_journey") mappedVariant = "precision_chrono";
      if (archetype.id === "circular_corner_fan") mappedVariant = "specular_glass";
      if (archetype.id === "stealth_blade_zero") mappedVariant = "atelier_minimalist";

      if (archetype.id === "horology_bezel") mappedVariant = "precision_chrono";
      if (archetype.id === "architectural_monolith") mappedVariant = "architectural_monolith";
      if (archetype.id === "dieter_rams_ten") mappedVariant = "atelier_minimalist";
      if (archetype.id === "leica_rangefinder") mappedVariant = "precision_chrono";
      if (archetype.id === "japanese_sensu") mappedVariant = "atelier_minimalist";
      if (archetype.id === "teenage_engineering_tp7") mappedVariant = "acoustic_resonance";

      if (archetype.id === "bauhaus_geometry") mappedVariant = "bauhaus_geometry";
      if (archetype.id === "apple_park_glass") mappedVariant = "specular_glass";
      if (archetype.id === "braille_tactile_ridge") mappedVariant = "precision_chrono";
      if (archetype.id === "monocle_travel_column") mappedVariant = "atelier_minimalist";
      if (archetype.id === "polaroid_film_strip") mappedVariant = "precision_chrono";
      if (archetype.id === "astronomical_caliper") mappedVariant = "precision_chrono";

      if (archetype.id === "vacheron_guilloche") mappedVariant = "precision_chrono";
      if (archetype.id === "hasselblad_medium_format") mappedVariant = "precision_chrono";
      if (archetype.id === "kyoto_kintsugi") mappedVariant = "atelier_minimalist";
      if (archetype.id === "braun_et66_ledger") mappedVariant = "atelier_minimalist";
      if (archetype.id === "titanium_potentiometer") mappedVariant = "acoustic_resonance";
      if (archetype.id === "alvar_aalto_bentwood") mappedVariant = "atelier_minimalist";

      // Archetypes 37-48: Pure Minimalism & Architectural Monoliths
      if (archetype.id === "helvetica_1957") mappedVariant = "swiss_editorial";
      if (archetype.id === "zumthor_therme_slate") mappedVariant = "architectural_monolith";
      if (archetype.id === "wim_crouwel_1968") mappedVariant = "bauhaus_geometry";
      if (archetype.id === "vignelli_unigrid_1972") mappedVariant = "bauhaus_geometry";
      if (archetype.id === "paul_rand_modernism") mappedVariant = "bauhaus_geometry";
      if (archetype.id === "jil_sander_minimal") mappedVariant = "swiss_editorial";
      if (archetype.id === "mies_nationalgalerie") mappedVariant = "bauhaus_geometry";
      if (archetype.id === "braun_sk4_snow_white") mappedVariant = "bauhaus_geometry";
      if (archetype.id === "otl_aicher_1972") mappedVariant = "bauhaus_geometry";
      if (archetype.id === "gropius_fagus_werk") mappedVariant = "swiss_editorial";
      if (archetype.id === "enzo_mari_autoprogettazione") mappedVariant = "architectural_monolith";
      if (archetype.id === "sanaa_translucent_membrane") mappedVariant = "swiss_editorial";

      localStorage.setItem("celaest_sidenav_variant", mappedVariant);
      window.dispatchEvent(new CustomEvent("celaest:sidenav_variant_changed", { detail: mappedVariant }));
      setNotification(`¡Paradigma "${archetype.name}" activado en el Sidenav real!`);
      setTimeout(() => setNotification(null), 3500);
    }
  };

  const [selectedCategory, setSelectedCategory] = useState<SidenavCategory>("all");
  const [showGridOverlay, setShowGridOverlay] = useState(false);
  const [showSpecsOverlay, setShowSpecsOverlay] = useState(false);

  const filteredArchetypes = useMemo(() => {
    if (selectedCategory === "all") return ARCHETYPES;
    return ARCHETYPES.filter((a) => a.category === selectedCategory);
  }, [selectedCategory]);

  const navItems = [
    { id: "workspace", num: "01", label: "Workspace", shortcut: "⌘1", icon: <GridIcon /> },
    { id: "memory", num: "02", label: "Memory Vault", shortcut: "⌘2", icon: <CognitiveMemoryBrainIcon className="w-4 h-4" />, hasDot: true },
    { id: "interview", num: "03", label: "Interview", shortcut: "⌘3", icon: <StudioVoiceMicIcon className="w-4 h-4" /> },
    { id: "reading", num: "04", label: "Reading", shortcut: "⌘4", icon: <PrecisionOpenBookIcon className="w-4 h-4" /> },
    { id: "writing", num: "05", label: "Writing Studio", shortcut: "⌘5", icon: <TechnicalWritingQuillIcon className="w-4 h-4" /> },
    { id: "lab", num: "06", label: "Design Lab", shortcut: "⌘L", icon: <QuantumNeuralGaugeIcon className="w-4 h-4" /> },
  ];

  return (
    <section className="relative p-6 sm:p-10 rounded-3xl bg-[#04040A] border border-white/[0.07] hover:border-white/[0.12] transition-all duration-300 shadow-[0_24px_60px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.06)] flex flex-col space-y-10 select-none overflow-hidden">
      {/* Top Specular Hairline */}
      <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />

      {/* Applied Toast */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="w-full py-3 px-5 rounded-2xl bg-[#070913] border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between shadow-[0_0_30px_rgba(16,185,129,0.2)] relative z-30"
          >
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{notification}</span>
            </div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400/70">
              Live Sidenav Updated
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Section Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-white/[0.06] pb-6 z-10">
        <div className="flex flex-col space-y-1.5">
          <div className="flex items-center gap-2.5">
            <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">
              Innovation Matrix · 36 Archetypes
            </span>
            <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full bg-white/[0.04] text-white/60 border border-white/[0.08]">
              Obsessive Craft & Zero AI Clichés
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-light text-white tracking-tight">
            Sidenav Architectural Paradigms & Creative Explorations
          </h2>
          <p className="text-xs sm:text-sm font-light text-white/40 max-w-3xl leading-relaxed">
            Una colección de <strong>36 conceptos estructuralmente únicos</strong> centrados en detalles de alta gama y cero clichés de IA:
            geometría constructivista Bauhaus, pabellón de cristal curvo Apple Park, relieve háptico braille, cuaderno de viajes Monocle,
            tira de negativos analógicos 35mm, nonio astronómico, alta relojería ginebrina, monolitos de basalto Zumthor y columnas suizas puras.
          </p>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setKineticTrigger((p) => p + 1)}
            className="w-8 h-8 rounded-full bg-white/[0.03] border border-white/[0.08] hover:border-white/30 text-white/50 hover:text-white flex items-center justify-center transition-all cursor-pointer active:scale-95"
            title="Replay Kinetic Typography"
            aria-label="Replay kinetic typography"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
          </button>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono tracking-wider uppercase border transition-all cursor-pointer ${
              isExpanded
                ? "bg-white/[0.08] border-white/20 text-white"
                : "bg-white/[0.02] border border-white/[0.06] text-white/40 hover:text-white"
            }`}
          >
            {isExpanded ? "Vista: Expandida" : "Vista: Compacta"}
          </button>
        </div>
      </div>

      {/* Category Filter Tabs (Balanced: 6 in each of the 6 disciplines) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 z-10">
        {[
          { id: "all", label: `Todos (${ARCHETYPES.length})` },
          { id: "pure_minimalism", label: "Minimalismo & Monolitos Puros (12)" },
          { id: "editorial", label: "Editorial & Suizo (6)" },
          { id: "hardware", label: "Hardware & Mecánica (6)" },
          { id: "floating", label: "Flotantes & Docks (6)" },
          { id: "structural", label: "Estructuras & Bloques (6)" },
          { id: "pure_geometry", label: "Geometría & Craft (6)" },
          { id: "atelier_luxury", label: "Alta Relojería & Atelier (6)" },
        ].map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id as SidenavCategory)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? "bg-white/15 text-white border border-white/25 shadow-sm font-medium"
                  : "bg-white/[0.02] border border-white/[0.06] text-white/40 hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* 30 Radical Paradigms Selector Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 z-10">
        {filteredArchetypes.map((archetype) => {
          const isSelected = selectedId === archetype.id;
          return (
            <button
              key={archetype.id}
              type="button"
              onClick={() => setSelectedId(archetype.id)}
              className={`flex flex-col items-start p-3 rounded-2xl text-left transition-all duration-300 cursor-pointer relative group ${
                isSelected
                  ? "bg-[#080914] border border-white/25 shadow-[0_10px_30px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.08)] scale-[1.01]"
                  : "bg-white/[0.015] border border-white/[0.05] hover:border-white/12 hover:bg-white/[0.03]"
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1.5">
                <span className="text-[9.5px] font-mono uppercase tracking-widest text-white/30">
                  #{archetype.index}
                </span>
                {isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
                )}
              </div>

              <h4 className={`text-xs font-medium tracking-wide w-full leading-snug line-clamp-1 ${
                isSelected ? "text-white" : "text-white/70 group-hover:text-white"
              }`}>
                {archetype.name}
              </h4>

              <span className="text-[9.5px] font-mono text-white/30 mt-0.5 line-clamp-1">
                {archetype.silhouette.split(" ")[0]}
              </span>

              <div className="mt-2 pt-1.5 border-t border-white/[0.04] w-full flex items-center justify-between text-[9px]">
                <span className="font-mono text-white/30 truncate max-w-[70px]">{archetype.inspiration.split(" ")[0]}</span>
                <span className={`font-mono transition-colors ${isSelected ? "text-emerald-400" : "text-white/40"}`}>
                  {isSelected ? "Activo" : "Ver →"}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Interactive Stage: Render the Selected Radical Archetype at 1:1 Scale */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch z-10">
        {/* Left: Rendered Sidenav Canvas (7 cols) */}
        <div className="lg:col-span-7 flex flex-col p-6 sm:p-8 bg-[#020205] border border-white/[0.06] rounded-3xl relative overflow-hidden min-h-[620px] justify-center items-center">
          {/* Top Label & Precision Inspection Controls */}
          <div className="absolute top-4 left-6 right-6 flex items-center justify-between pb-3 border-b border-white/[0.05] z-20">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-white/50">
                Archetype {activeArchetype.index}: {activeArchetype.name}
              </span>
              <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                1:1 Scale
              </span>
            </div>

            {/* Precision Toggles: Grid, Specs */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setShowGridOverlay(!showGridOverlay)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-mono tracking-wider transition-all cursor-pointer flex items-center gap-1.5 border ${
                  showGridOverlay
                    ? "bg-white/15 text-white border-white/30 shadow-sm"
                    : "bg-white/[0.02] text-white/40 border-white/[0.06] hover:text-white"
                }`}
                title="Mostrar retícula suiza de precisión de 0.5px"
              >
                <span>+ Retícula 0.5px</span>
              </button>

              <button
                type="button"
                onClick={() => setShowSpecsOverlay(!showSpecsOverlay)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-mono tracking-wider transition-all cursor-pointer flex items-center gap-1.5 border ${
                  showSpecsOverlay
                    ? "bg-white/15 text-white border-white/30 shadow-sm"
                    : "bg-white/[0.02] text-white/40 border-white/[0.06] hover:text-white"
                }`}
                title="Mostrar especificaciones tipográficas y de material óptico"
              >
                <span>⌖ Specs Tipográficas</span>
              </button>
            </div>
          </div>

          {/* Swiss Architectural Grid Overlay */}
          {showGridOverlay && (
            <div className="absolute inset-0 pointer-events-none z-0">
              <div
                className="w-full h-full opacity-35"
                style={{
                  backgroundImage: `
                    linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px),
                    linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
                  `,
                  backgroundSize: "16px 16px, 16px 16px, 64px 64px, 64px 64px",
                }}
              />
              <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-red-500/25 pointer-events-none" />
              <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-red-500/25 pointer-events-none" />
            </div>
          )}

          {/* Floating Typographic & Material Specs Status Pill */}
          {showSpecsOverlay && (
            <div className="absolute bottom-4 left-6 right-6 p-2.5 rounded-2xl bg-black/90 border border-white/10 backdrop-blur-xl flex items-center justify-between z-20 text-[9.5px] font-mono text-white/70 shadow-2xl">
              <div className="flex items-center gap-3">
                <span className="text-white/40 uppercase">Hairline:</span>
                <span className="text-emerald-400 font-medium">{activeArchetype.hairline || "0.5px Sub-pixel Solid"}</span>
                <span className="text-white/20">|</span>
                <span className="text-white/40 uppercase">Material:</span>
                <span className="text-white">{activeArchetype.material || "Obsidian #030306 PVD"}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-white/40 uppercase">Geometría:</span>
                <span className="text-white">{activeArchetype.opticalRatio || "4px Rhythm · Golden Ratio"}</span>
                <span className="text-white/20">|</span>
                <span className="text-white/40 uppercase">Física:</span>
                <span className="text-amber-400">{activeArchetype.physics || "320 Stiff / 28 Damp"}</span>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* ARCHETYPE 1: THE MACOS KINETIC DOCK */}
          {/* ========================================================================= */}
          {selectedId === "dock_kinetic" && (
            <div className="my-auto py-8">
              <aside
                onMouseEnter={() => setIsExpanded(true)}
                onMouseLeave={() => setIsExpanded(false)}
                className={`flex flex-col justify-between bg-[#04040A]/95 border border-white/[0.09] rounded-[36px] py-4 px-2.5 shadow-[0_30px_90px_rgba(0,0,0,0.95),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-3xl transition-all duration-300 ease-out select-none h-[470px] relative ${
                  isExpanded ? "w-60 px-4" : "w-16"
                }`}
              >
                <div className="w-full flex items-center justify-center">
                  <div className="w-10 h-10 rounded-2xl bg-white/[0.03] border border-white/[0.08] text-white flex items-center justify-center shrink-0 shadow-inner p-2 cursor-pointer hover:scale-105 transition-transform">
                    <svg viewBox={`0 0 ${CELAEST_LOGO_VIEWBOX.width} ${CELAEST_LOGO_VIEWBOX.height}`} fill="none" className="w-full h-full text-white">
                      <path d={CELAEST_LOGO_PATH_D} fill="currentColor" />
                    </svg>
                  </div>
                  {isExpanded && (
                    <span className="ml-3 text-[13px] font-light text-white tracking-[0.24em] uppercase font-sans whitespace-nowrap">
                      CELAEST
                    </span>
                  )}
                </div>

                <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/[0.07] to-transparent my-1" />

                <nav className="flex flex-col w-full space-y-2">
                  {navItems.map((item) => {
                    const isActive = activeNav === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setActiveNav(item.id)}
                        className={`relative flex items-center w-full py-2.5 rounded-2xl transition-all duration-200 cursor-pointer group/dock ${
                          isExpanded ? "px-3 justify-start" : "justify-center"
                        } ${
                          isActive
                            ? "bg-white/[0.08] text-white border border-white/[0.12] shadow-[0_4px_16px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.1)] scale-[1.02]"
                            : "text-white/45 hover:text-white hover:bg-white/[0.03] hover:scale-105"
                        }`}
                      >
                        <div className={`flex items-center justify-center w-5 h-5 shrink-0 transition-transform ${isActive ? "text-white" : "text-inherit"}`}>
                          {item.icon}
                        </div>
                        {isExpanded && (
                          <span className={`ml-3 text-xs font-light tracking-wide truncate ${isActive ? "text-white" : "text-white/60"}`}>
                            {item.label}
                          </span>
                        )}
                        {item.hasDot && (
                          <div className={`w-1.5 h-1.5 rounded-full bg-[#A27FF3] shadow-[0_0_6px_#A27FF3] ${isExpanded ? "ml-auto" : "absolute top-2 right-2"}`} />
                        )}
                      </button>
                    );
                  })}
                </nav>

                <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/[0.07] to-transparent my-1" />

                <div className="flex items-center w-full py-1.5 px-2 cursor-pointer hover:bg-white/[0.03] rounded-2xl transition-colors">
                  <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 ring-1 ring-white/15">
                    <img src="/assets/avatar_executive_luxury.jpg" alt="Avatar" className="w-full h-full object-cover" />
                  </div>
                  {isExpanded && (
                    <div className="flex flex-col ml-3 text-left overflow-hidden">
                      <KineticLuxuryText text={userName} trigger={isExpanded || kineticTrigger} className="text-xs font-light text-white truncate" />
                      <span className="text-[10px] font-mono text-emerald-400 mt-0.5">{userLevel}</span>
                    </div>
                  )}
                </div>
              </aside>
            </div>
          )}

          {/* ========================================================================= */}
          {/* ARCHETYPE 2: THE LINEAR DUAL-RAIL SPLIT */}
          {/* ========================================================================= */}
          {selectedId === "dual_rail" && (
            <div className="my-auto py-8 flex items-stretch gap-2">
              <div className="w-14 bg-[#04040A] border border-white/[0.08] rounded-2xl py-3 px-1.5 flex flex-col justify-between items-center shadow-2xl">
                <div className="w-8 h-8 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-white p-1.5">
                  <svg viewBox={`0 0 ${CELAEST_LOGO_VIEWBOX.width} ${CELAEST_LOGO_VIEWBOX.height}`} fill="none" className="w-full h-full text-white">
                    <path d={CELAEST_LOGO_PATH_D} fill="currentColor" />
                  </svg>
                </div>

                <div className="flex flex-col space-y-2 w-full items-center">
                  {navItems.slice(0, 4).map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveNav(item.id)}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                        activeNav === item.id
                          ? "bg-white/10 text-white border border-white/15 shadow-md"
                          : "text-white/40 hover:text-white hover:bg-white/[0.03]"
                      }`}
                    >
                      {item.icon}
                    </button>
                  ))}
                </div>

                <div className="w-7 h-7 rounded-full overflow-hidden ring-1 ring-white/20">
                  <img src="/assets/avatar_executive_luxury.jpg" alt="A" className="w-full h-full object-cover" />
                </div>
              </div>

              <div className="w-56 bg-[#060710]/95 border border-white/[0.08] rounded-2xl p-4 flex flex-col justify-between shadow-2xl backdrop-blur-2xl">
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">Core Modules</span>
                    <span className="text-[9px] font-mono text-white/30">⌘K Jump</span>
                  </div>

                  <div className="flex flex-col space-y-1.5">
                    {navItems.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setActiveNav(item.id)}
                        className={`flex items-center justify-between w-full py-1.5 px-2.5 rounded-lg text-left transition-all ${
                          activeNav === item.id ? "bg-white/[0.08] text-white font-medium" : "text-white/50 hover:text-white hover:bg-white/[0.02]"
                        }`}
                      >
                        <span className="text-xs font-light">{item.label}</span>
                        <span className="text-[9px] font-mono text-white/30">{item.shortcut}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-white/[0.06] flex flex-col space-y-1">
                  <span className="text-[9px] font-mono text-white/30 uppercase">Today's Focus</span>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white font-light">18 / 20 min</span>
                    <span className="text-emerald-400 font-mono text-[10px]">90%</span>
                  </div>
                  <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="w-[90%] h-full bg-emerald-400 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* ARCHETYPE 3: THE RADIAL ORBIT HUB */}
          {/* ========================================================================= */}
          {selectedId === "orbit_pebbles" && (
            <div className="my-auto py-8 flex flex-col items-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#04040A] border border-white/[0.09] flex items-center justify-center text-white shadow-xl hover:scale-105 transition-transform cursor-pointer">
                <div className="w-6 h-6">
                  <svg viewBox={`0 0 ${CELAEST_LOGO_VIEWBOX.width} ${CELAEST_LOGO_VIEWBOX.height}`} fill="none" className="w-full h-full text-white">
                    <path d={CELAEST_LOGO_PATH_D} fill="currentColor" />
                  </svg>
                </div>
              </div>

              <div className="flex flex-col space-y-2 py-2">
                {navItems.map((item) => {
                  const isActive = activeNav === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveNav(item.id)}
                      className={`w-11 h-11 rounded-full flex items-center justify-center transition-all cursor-pointer relative group/orb ${
                        isActive
                          ? "bg-white/15 text-white border border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.2)] scale-110"
                          : "bg-[#04040A] text-white/40 border border-white/[0.06] hover:text-white hover:scale-105"
                      }`}
                      title={item.label}
                    >
                      {item.icon}
                      {item.hasDot && <span className="w-1.5 h-1.5 rounded-full bg-[#A27FF3] absolute top-1 right-1" />}
                    </button>
                  );
                })}
              </div>

              <div className="relative w-12 h-12 rounded-full bg-[#04040A] border border-white/[0.1] p-1 flex items-center justify-center shadow-xl hover:scale-105 transition-transform cursor-pointer">
                <div className="w-full h-full rounded-full overflow-hidden">
                  <img src="/assets/avatar_executive_luxury.jpg" alt="A" className="w-full h-full object-cover" />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 ring-2 ring-black" />
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* ARCHETYPE 4: THE STUDIO COCKPIT HUD */}
          {/* ========================================================================= */}
          {selectedId === "studio_cockpit" && (
            <div className="my-auto py-8">
              <aside className="w-64 bg-[#08090E] border border-white/[0.1] rounded-2xl p-4 flex flex-col justify-between shadow-2xl h-[480px]">
                <div className="flex flex-col space-y-3">
                  <div className="flex items-center justify-between border-b border-white/[0.08] pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b] animate-pulse" />
                      <span className="text-[11px] font-mono font-semibold tracking-wider text-white">CELAEST-01</span>
                    </div>
                    <span className="text-[9px] font-mono text-white/40">48kHz / RAW</span>
                  </div>

                  <div className="w-full p-2 rounded-lg bg-black/60 border border-white/[0.04] flex items-center justify-between">
                    <span className="text-[8.5px] font-mono text-white/30">MIC LEVEL</span>
                    <div className="flex items-center gap-1">
                      {[6, 12, 18, 24, 14, 8, 4].map((h, i) => (
                        <span key={i} className="w-1 bg-amber-400/80 rounded-sm" style={{ height: `${h}px` }} />
                      ))}
                    </div>
                  </div>

                  <nav className="flex flex-col space-y-1.5 pt-1">
                    {navItems.map((item) => {
                      const isActive = activeNav === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setActiveNav(item.id)}
                          className={`flex items-center justify-between w-full py-2 px-3 rounded-lg border transition-all cursor-pointer ${
                            isActive
                              ? "bg-white/[0.08] border-amber-500/50 text-white shadow-[0_0_15px_rgba(245,158,11,0.15)]"
                              : "bg-black/30 border-white/[0.04] text-white/40 hover:text-white hover:border-white/10"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            {item.icon}
                            <span className="text-xs font-mono">{item.label}</span>
                          </div>
                          <span className={`text-[9px] font-mono px-1 rounded ${isActive ? "bg-amber-500/20 text-amber-300" : "text-white/20"}`}>
                            {isActive ? "ACTIVE" : "STANDBY"}
                          </span>
                        </button>
                      );
                    })}
                  </nav>
                </div>

                <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-md overflow-hidden ring-1 ring-white/20">
                      <img src="/assets/avatar_executive_luxury.jpg" alt="A" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-xs font-mono text-white leading-none">{userName}</span>
                      <span className="text-[9px] font-mono text-amber-400 mt-1">VOL: 85% · {userLevel}</span>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          )}

          {/* ========================================================================= */}
          {/* ARCHETYPE 5: THE SWISS TYPOGRAPHIC COLUMN */}
          {/* ========================================================================= */}
          {selectedId === "swiss_editorial" && (
            <div className="my-auto py-8">
              <aside className="w-60 bg-[#030306] border border-white/[0.07] rounded-none p-5 flex flex-col justify-between h-[480px] text-left relative font-sans">
                <div className="flex flex-col space-y-4">
                  <div className="flex flex-col space-y-1 border-b border-white/[0.08] pb-3">
                    <span className="text-[9px] font-mono tracking-[0.3em] text-white/30 uppercase">
                      ARCHITECTURAL GRID / 01
                    </span>
                    <h1 className="text-base font-light tracking-[0.2em] text-white uppercase">
                      CELAEST
                    </h1>
                  </div>

                  <nav className="flex flex-col space-y-2.5 pt-2">
                    {navItems.map((item) => {
                      const isActive = activeNav === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setActiveNav(item.id)}
                          className={`flex items-center justify-between w-full py-1 text-left transition-all cursor-pointer ${
                            isActive ? "text-white" : "text-white/35 hover:text-white/70"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] font-mono text-white/30">{item.num}</span>
                            <span className={`text-xs tracking-wider uppercase font-light ${isActive ? "underline decoration-white/40 underline-offset-4 font-normal" : ""}`}>
                              {item.label}
                            </span>
                          </div>
                          {isActive && <span className="text-xs font-mono text-white/50">+</span>}
                        </button>
                      );
                    })}
                  </nav>
                </div>

                <div className="pt-4 border-t border-white/[0.08] flex flex-col space-y-1">
                  <span className="text-[9px] font-mono tracking-widest text-white/30 uppercase">USER IDENTIFIER</span>
                  <span className="text-xs font-light text-white tracking-wide">{userName}</span>
                  <span className="text-[10px] font-mono text-white/40">{userLevel} / VERIFIED</span>
                </div>
              </aside>
            </div>
          )}

          {/* ========================================================================= */}
          {/* ARCHETYPE 6: THE BENTO MORPHING ISLAND */}
          {/* ========================================================================= */}
          {selectedId === "bento_modular" && (
            <div className="my-auto py-8 flex flex-col space-y-3 w-60">
              <div className="p-3.5 rounded-2xl bg-[#060710] border border-white/[0.08] flex items-center justify-between shadow-xl">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-xl bg-white/[0.04] flex items-center justify-center text-white p-1">
                    <svg viewBox={`0 0 ${CELAEST_LOGO_VIEWBOX.width} ${CELAEST_LOGO_VIEWBOX.height}`} fill="none" className="w-full h-full text-white">
                      <path d={CELAEST_LOGO_PATH_D} fill="currentColor" />
                    </svg>
                  </div>
                  <span className="text-xs font-medium text-white tracking-wider">CELAEST</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">
                  🔥 4 Días
                </span>
              </div>

              <div className="p-2.5 rounded-2xl bg-[#04040A] border border-white/[0.07] flex flex-col space-y-1 shadow-xl">
                {navItems.map((item) => {
                  const isActive = activeNav === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveNav(item.id)}
                      className={`flex items-center justify-between w-full py-2 px-3 rounded-xl transition-all cursor-pointer ${
                        isActive
                          ? "bg-white/10 text-white font-medium border border-white/15 shadow-md"
                          : "text-white/45 hover:text-white hover:bg-white/[0.025]"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        {item.icon}
                        <span className="text-xs font-light">{item.label}</span>
                      </div>
                      {item.hasDot && <span className="w-1.5 h-1.5 rounded-full bg-[#A27FF3]" />}
                    </button>
                  );
                })}
              </div>

              <div className="p-3 rounded-2xl bg-[#060710] border border-white/[0.08] flex flex-col space-y-2 shadow-xl">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full overflow-hidden ring-1 ring-white/20 shrink-0">
                    <img src="/assets/avatar_executive_luxury.jpg" alt="A" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col text-left overflow-hidden">
                    <span className="text-xs font-light text-white truncate">{userName}</span>
                    <span className="text-[10px] font-mono text-emerald-400">{userLevel}</span>
                  </div>
                </div>
                <div className="p-2 rounded-xl bg-white/[0.02] border border-white/[0.04] text-[10px] text-white/50 flex items-center justify-between">
                  <span>Siguiente: 10m Interview</span>
                  <span className="text-emerald-400 font-mono">→</span>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* ARCHETYPE 7: THE CYBER-ACOUSTIC MONOLITH */}
          {/* ========================================================================= */}
          {selectedId === "cyber_acoustic" && (
            <div className="my-auto py-8">
              <aside className="w-64 bg-[#030408] border border-cyan-500/20 rounded-3xl p-4 flex flex-col justify-between shadow-[0_0_40px_rgba(6,182,212,0.12)] h-[480px] relative overflow-hidden">
                {/* Acoustic Spine on Right Edge */}
                <div className="absolute top-0 bottom-0 right-0 w-2.5 border-l border-cyan-500/20 bg-cyan-950/20 flex flex-col justify-around items-center py-4">
                  {Array.from({ length: 18 }).map((_, i) => (
                    <span
                      key={i}
                      className="w-1 bg-cyan-400/60 rounded-full animate-pulse"
                      style={{
                        height: `${Math.sin(i * 0.5) * 6 + 8}px`,
                        animationDuration: `${0.8 + (i % 4) * 0.2}s`,
                      }}
                    />
                  ))}
                </div>

                <div className="flex flex-col space-y-3 pr-3">
                  <div className="flex items-center gap-2.5 border-b border-cyan-500/20 pb-3">
                    <div className="w-8 h-8 rounded-xl bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                      <StudioVoiceMicIcon className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-mono font-semibold text-white tracking-widest">CELAEST // WAVE</span>
                      <span className="text-[9px] font-mono text-cyan-400/80">48kHz ACOUSTIC ENGINE</span>
                    </div>
                  </div>

                  <nav className="flex flex-col space-y-1 pt-1">
                    {navItems.map((item) => {
                      const isActive = activeNav === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setActiveNav(item.id)}
                          className={`flex items-center justify-between w-full py-2 px-3 rounded-xl transition-all cursor-pointer ${
                            isActive
                              ? "bg-cyan-500/15 border border-cyan-400/40 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                              : "text-zinc-400 hover:text-white hover:bg-white/[0.02]"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            {item.icon}
                            <span className="text-xs font-mono">{item.label}</span>
                          </div>
                          {isActive && <span className="text-[9px] font-mono text-cyan-400">140Hz</span>}
                        </button>
                      );
                    })}
                  </nav>
                </div>

                <div className="pr-3 pt-3 border-t border-cyan-500/20 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full overflow-hidden ring-1 ring-cyan-400/40 shrink-0">
                    <img src="/assets/avatar_executive_luxury.jpg" alt="A" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col text-left overflow-hidden">
                    <span className="text-xs font-mono text-white truncate">{userName}</span>
                    <span className="text-[9px] font-mono text-cyan-400 truncate">MIC: ACTIVE // {userLevel}</span>
                  </div>
                </div>
              </aside>
            </div>
          )}

          {/* ========================================================================= */}
          {/* ARCHETYPE 8: THE HORIZONTAL HORIZON DECK */}
          {/* ========================================================================= */}
          {selectedId === "horizon_cockpit" && (
            <div className="my-auto py-12 flex flex-col items-center space-y-6 w-full max-w-xl">
              <span className="text-[11px] font-mono text-white/40 uppercase tracking-widest">
                Consola Horizontal Desacoplada (Libera 100% del Ancho de Lectura)
              </span>

              {/* Floating Bottom Horizon Pill */}
              <div className="w-full py-3 px-5 rounded-full bg-[#05060D]/95 border border-white/12 shadow-[0_20px_60px_rgba(0,0,0,0.95)] backdrop-blur-2xl flex items-center justify-between gap-4">
                {/* Brand Pill */}
                <div className="flex items-center gap-2.5 shrink-0 pr-3 border-r border-white/10">
                  <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white p-1">
                    <svg viewBox={`0 0 ${CELAEST_LOGO_VIEWBOX.width} ${CELAEST_LOGO_VIEWBOX.height}`} fill="none" className="w-full h-full text-white">
                      <path d={CELAEST_LOGO_PATH_D} fill="currentColor" />
                    </svg>
                  </div>
                  <span className="text-xs font-semibold text-white tracking-widest">CELAEST</span>
                </div>

                {/* Horizontal Segmented Tabs */}
                <div className="flex items-center gap-1.5 flex-1 justify-center overflow-x-auto">
                  {navItems.map((item) => {
                    const isActive = activeNav === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setActiveNav(item.id)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs transition-all cursor-pointer whitespace-nowrap ${
                          isActive
                            ? "bg-white/15 text-white font-medium shadow-sm border border-white/20"
                            : "text-white/45 hover:text-white hover:bg-white/[0.04]"
                        }`}
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Profile Pill */}
                <div className="flex items-center gap-2.5 shrink-0 pl-3 border-l border-white/10 cursor-pointer">
                  <div className="w-7 h-7 rounded-full overflow-hidden ring-1 ring-emerald-400">
                    <img src="/assets/avatar_executive_luxury.jpg" alt="A" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-xs font-mono text-emerald-400">{userLevel}</span>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* ARCHETYPE 9: THE NEO-BRUTALIST TITANIUM FRAME */}
          {/* ========================================================================= */}
          {selectedId === "neo_brutalist" && (
            <div className="my-auto py-8">
              <aside className="w-64 bg-[#0A0B0E] border-2 border-white/20 p-5 flex flex-col justify-between h-[480px] shadow-2xl relative font-mono text-left">
                <div className="flex flex-col space-y-4">
                  {/* Technical Header */}
                  <div className="flex flex-col space-y-1 border-b-2 border-white/20 pb-3">
                    <span className="text-[9px] tracking-widest text-white/40">SYSTEM // SPEC_09</span>
                    <h1 className="text-sm font-bold tracking-widest text-white uppercase">
                      CELAEST.TITANIUM
                    </h1>
                  </div>

                  {/* Technical Grid Links with Instant Inverted Snap */}
                  <nav className="flex flex-col space-y-1.5 pt-1">
                    {navItems.map((item) => {
                      const isActive = activeNav === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setActiveNav(item.id)}
                          className={`flex items-center justify-between w-full py-2 px-3 text-xs tracking-wider transition-none cursor-pointer border ${
                            isActive
                              ? "bg-white text-black font-bold border-white"
                              : "bg-transparent text-white/50 border-white/10 hover:border-white/40 hover:text-white"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="text-[10px] opacity-60">[{item.num}]</span>
                            <span className="uppercase">{item.label}</span>
                          </div>
                          {isActive && <span className="text-[10px] font-bold">●</span>}
                        </button>
                      );
                    })}
                  </nav>
                </div>

                <div className="pt-3 border-t-2 border-white/20 flex flex-col space-y-1">
                  <span className="text-[9px] text-white/40">OPERATOR ID</span>
                  <span className="text-xs font-bold text-white uppercase">{userName}</span>
                  <span className="text-[10px] text-white/60">LVL: {userLevel} // STABLE</span>
                </div>
              </aside>
            </div>
          )}

          {/* ========================================================================= */}
          {/* ARCHETYPE 10: THE LIQUID MERCURY DROPLET */}
          {/* ========================================================================= */}
          {selectedId === "liquid_mercury" && (
            <div className="my-auto py-8">
              <aside className="w-60 bg-gradient-to-b from-[#0B0D14]/95 via-[#06070B]/98 to-[#020306] border border-white/20 rounded-[44px] p-5 flex flex-col justify-between h-[480px] shadow-[0_30px_90px_rgba(0,0,0,0.98),inset_0_1px_2px_rgba(255,255,255,0.3)] backdrop-blur-3xl relative">
                <div className="w-full flex items-center justify-center">
                  <div className="w-11 h-11 rounded-3xl bg-gradient-to-tr from-white/15 to-white/5 border border-white/30 flex items-center justify-center text-white shadow-[0_0_20px_rgba(255,255,255,0.15)] p-2.5">
                    <svg viewBox={`0 0 ${CELAEST_LOGO_VIEWBOX.width} ${CELAEST_LOGO_VIEWBOX.height}`} fill="none" className="w-full h-full text-white">
                      <path d={CELAEST_LOGO_PATH_D} fill="currentColor" />
                    </svg>
                  </div>
                </div>

                <nav className="flex flex-col space-y-2">
                  {navItems.map((item) => {
                    const isActive = activeNav === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setActiveNav(item.id)}
                        className={`flex items-center gap-3 py-2.5 px-4 rounded-3xl transition-all duration-300 cursor-pointer ${
                          isActive
                            ? "bg-gradient-to-r from-white/20 via-white/10 to-transparent text-white font-medium border border-white/30 shadow-[0_4px_20px_rgba(255,255,255,0.15)] scale-[1.03]"
                            : "text-white/45 hover:text-white hover:bg-white/[0.04]"
                        }`}
                      >
                        {item.icon}
                        <span className="text-xs font-light tracking-wide">{item.label}</span>
                      </button>
                    );
                  })}
                </nav>

                <div className="flex items-center gap-3 p-2 rounded-3xl bg-white/[0.03] border border-white/10">
                  <div className="w-8 h-8 rounded-full overflow-hidden ring-1 ring-white/30">
                    <img src="/assets/avatar_executive_luxury.jpg" alt="A" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col text-left overflow-hidden">
                    <span className="text-xs font-light text-white truncate">{userName}</span>
                    <span className="text-[10px] font-mono text-emerald-400">{userLevel}</span>
                  </div>
                </div>
              </aside>
            </div>
          )}

          {/* ========================================================================= */}
          {/* ARCHETYPE 11: THE SPLIT-LEVEL NESTED COCKPIT */}
          {/* ========================================================================= */}
          {selectedId === "accordion_tree" && (
            <div className="my-auto py-8">
              <aside className="w-64 bg-[#05060D] border border-white/[0.08] rounded-2xl p-4 flex flex-col justify-between h-[490px] shadow-2xl text-left font-sans">
                <div className="flex flex-col space-y-3">
                  <div className="flex items-center justify-between border-b border-white/[0.06] pb-2.5">
                    <span className="text-xs font-bold text-white tracking-widest uppercase">CELAEST WORKSPACE</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-violet-500/20 text-violet-300 border border-violet-500/30">
                      {userLevel}
                    </span>
                  </div>

                  {/* Nested Accordion Tree Links */}
                  <div className="flex flex-col space-y-2">
                    <div className="flex flex-col space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-white/80 px-2 py-1">
                        <span>PRACTICE SUITE</span>
                        <span className="text-white/40 text-[9px]">▼</span>
                      </div>
                      <div className="pl-3 border-l border-white/10 flex flex-col space-y-1">
                        <button
                          type="button"
                          onClick={() => setActiveNav("interview")}
                          className={`flex flex-col w-full p-1.5 rounded-lg text-left transition-all ${
                            activeNav === "interview" ? "bg-white/10 text-white" : "text-white/50 hover:text-white"
                          }`}
                        >
                          <span className="text-xs">AI Interview Sparring</span>
                          <span className="text-[9px] text-emerald-400 font-mono">80% Mastery</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveNav("reading")}
                          className={`flex flex-col w-full p-1.5 rounded-lg text-left transition-all ${
                            activeNav === "reading" ? "bg-white/10 text-white" : "text-white/50 hover:text-white"
                          }`}
                        >
                          <span className="text-xs">Precision Reading</span>
                          <span className="text-[9px] text-white/30 font-mono">4 Articles pending</span>
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col space-y-1 pt-1">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-white/80 px-2 py-1">
                        <span>COGNITIVE VAULT</span>
                      </div>
                      <div className="pl-3 border-l border-white/10 flex flex-col space-y-1">
                        <button
                          type="button"
                          onClick={() => setActiveNav("memory")}
                          className={`flex items-center justify-between w-full p-1.5 rounded-lg text-left transition-all ${
                            activeNav === "memory" ? "bg-white/10 text-white" : "text-white/50 hover:text-white"
                          }`}
                        >
                          <span className="text-xs">Memory Palace</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-[#A27FF3]" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
                  <span className="text-xs font-light text-white">{userName}</span>
                  <span className="text-[10px] font-mono text-emerald-400">SYNCED</span>
                </div>
              </aside>
            </div>
          )}

          {/* ========================================================================= */}
          {/* ARCHETYPE 12: THE OBSIDIAN MINIMALIST HAIRLINE */}
          {/* ========================================================================= */}
          {selectedId === "hairline_wireframe" && (
            <div className="my-auto py-8">
              <aside className="w-60 bg-transparent border border-white/20 p-5 flex flex-col justify-between h-[480px] text-left relative font-sans">
                {/* 100% Wireframe Vector Hairlines */}
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center justify-between border-b border-white/20 pb-3">
                    <span className="text-xs tracking-[0.25em] text-white uppercase font-light">CELAEST</span>
                    <span className="text-[9px] font-mono text-white/40">0.75px</span>
                  </div>

                  <nav className="flex flex-col space-y-2 pt-2">
                    {navItems.map((item) => {
                      const isActive = activeNav === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setActiveNav(item.id)}
                          className={`flex items-center justify-between w-full py-2 px-2.5 border transition-all cursor-pointer ${
                            isActive
                              ? "border-white text-white shadow-[0_0_12px_rgba(255,255,255,0.3)]"
                              : "border-transparent text-white/40 hover:text-white hover:border-white/20"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {item.icon}
                            <span className="text-xs font-light tracking-wide">{item.label}</span>
                          </div>
                          {isActive && <span className="w-1 h-1 bg-white" />}
                        </button>
                      );
                    })}
                  </nav>
                </div>

                <div className="pt-3 border-t border-white/20 flex items-center justify-between">
                  <span className="text-xs font-light text-white">{userName}</span>
                  <span className="text-[10px] font-mono text-white/40">{userLevel}</span>
                </div>
              </aside>
            </div>
          )}

          {/* ========================================================================= */}
          {/* ARCHETYPE 13: THE DYNAMIC ISLAND FLOATING TOP-BAR */}
          {/* ========================================================================= */}
          {selectedId === "dynamic_island_top" && (
            <div className="my-auto py-10 flex flex-col items-center space-y-6 w-full max-w-xl">
              <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
                Isla Flotante Superior Adaptativa (100% Márgenes Libres)
              </span>

              {/* Floating Dynamic Island Capsule */}
              <div className="w-full py-2.5 px-4 rounded-full bg-[#05060E]/95 border border-white/[0.12] shadow-[0_20px_50px_rgba(0,0,0,0.95)] backdrop-blur-3xl flex items-center justify-between gap-3">
                {/* Brand Island */}
                <div className="flex items-center gap-2 shrink-0 pr-3 border-r border-white/10">
                  <div className="w-7 h-7 rounded-full bg-white/[0.06] border border-white/15 flex items-center justify-center text-white p-1">
                    <svg viewBox={`0 0 ${CELAEST_LOGO_VIEWBOX.width} ${CELAEST_LOGO_VIEWBOX.height}`} fill="none" className="w-full h-full text-white">
                      <path d={CELAEST_LOGO_PATH_D} fill="currentColor" />
                    </svg>
                  </div>
                  <span className="text-xs font-semibold text-white tracking-widest hidden sm:inline">CELAEST</span>
                </div>

                {/* Floating Segmented Tools */}
                <nav className="flex items-center gap-1 overflow-x-auto py-0.5">
                  {navItems.map((item) => {
                    const isActive = activeNav === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setActiveNav(item.id)}
                        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs transition-all cursor-pointer whitespace-nowrap ${
                          isActive
                            ? "bg-white/15 text-white font-medium border border-white/20 shadow-sm"
                            : "text-white/45 hover:text-white hover:bg-white/[0.04]"
                        }`}
                      >
                        {item.icon}
                        <span className="hidden md:inline">{item.label}</span>
                        {item.hasDot && <span className="w-1.5 h-1.5 rounded-full bg-[#A27FF3]" />}
                      </button>
                    );
                  })}
                </nav>

                {/* Audio Status & Avatar */}
                <div className="flex items-center gap-2.5 shrink-0 pl-3 border-l border-white/10">
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="hidden sm:inline">48kHz</span>
                  </div>
                  <div className="w-7 h-7 rounded-full overflow-hidden ring-1 ring-white/20">
                    <img src="/assets/avatar_executive_luxury.jpg" alt="A" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>

              {/* Content viewport simulator showing full width */}
              <div className="w-full p-4 rounded-2xl bg-white/[0.015] border border-white/[0.05] flex flex-col space-y-2 text-center text-white/30 text-xs">
                <span className="font-mono text-[9px] uppercase tracking-wider text-emerald-400/80">Viewport 100% Unobstructed</span>
                <p className="font-light text-white/50 text-[11px]">
                  El lienzo de lectura y conversación aprovecha el ancho completo del monitor sin barras laterales permanentes.
                </p>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* ARCHETYPE 14: THE RAYCAST COMMAND-FIRST HUD */}
          {/* ========================================================================= */}
          {selectedId === "command_palette_hud" && (
            <div className="my-auto py-8 w-full max-w-md">
              <div className="bg-[#05060D] border border-white/[0.12] rounded-2xl shadow-[0_30px_90px_rgba(0,0,0,0.98)] p-4 flex flex-col space-y-3.5 backdrop-blur-2xl">
                {/* Search Input Bar */}
                <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08]">
                  <svg className="w-4 h-4 text-white/40 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span className="text-xs text-white font-light flex-1 flex items-center">
                    Jump to section or executive tool...
                    <span className="w-1.5 h-3.5 bg-rose-400 ml-1 animate-pulse" />
                  </span>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-white/60 border border-white/10">
                    ESC
                  </span>
                </div>

                {/* Quick Launch Action Chips */}
                <div className="flex flex-col space-y-1">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-white/30 px-1">
                    Direct Shortcuts
                  </span>
                  <div className="flex flex-col space-y-1">
                    {navItems.map((item) => {
                      const isActive = activeNav === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setActiveNav(item.id)}
                          className={`flex items-center justify-between w-full py-2 px-3 rounded-xl transition-all cursor-pointer ${
                            isActive
                              ? "bg-rose-500/15 border border-rose-500/30 text-rose-200 shadow-sm"
                              : "hover:bg-white/[0.03] text-white/50 hover:text-white"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            {item.icon}
                            <span className="text-xs font-light">{item.label}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {isActive && <span className="text-[9px] font-mono text-rose-400">ACTIVE</span>}
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/[0.06] text-white/50 border border-white/[0.06]">
                              {item.shortcut}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Telemetry Footer */}
                <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[9.5px] font-mono text-white/35">
                  <span className="text-rose-400">⚡ CELAEST TURBO // 12ms</span>
                  <span>{userName} · {userLevel}</span>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* ARCHETYPE 15: THE KYOTO ORIGAMI FOLDING SPINE */}
          {/* ========================================================================= */}
          {selectedId === "origami_accordion_fold" && (
            <div className="my-auto py-8 flex items-stretch gap-1">
              {/* Fold 1: The Narrow Spine (36px) */}
              <div className="w-10 bg-[#06070E] border-y border-l border-white/[0.09] rounded-l-2xl py-4 flex flex-col justify-between items-center shadow-2xl relative">
                <div className="w-6 h-6 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center p-1">
                  <svg viewBox={`0 0 ${CELAEST_LOGO_VIEWBOX.width} ${CELAEST_LOGO_VIEWBOX.height}`} fill="none" className="w-full h-full text-amber-400">
                    <path d={CELAEST_LOGO_PATH_D} fill="currentColor" />
                  </svg>
                </div>

                <div className="py-6 flex items-center justify-center">
                  <span className="text-[8.5px] font-mono tracking-[0.35em] text-white/40 uppercase rotate-90 whitespace-nowrap">
                    CELAEST · ORIGAMI
                  </span>
                </div>

                <span className="w-1.5 h-1.5 rounded-full bg-amber-400/80 animate-pulse" />
              </div>

              {/* Fold 2: Unfolded Layered Wing (200px) */}
              <aside className="w-56 bg-[#040409] border border-white/[0.09] rounded-r-2xl p-4 flex flex-col justify-between h-[480px] shadow-[20px_0_60px_rgba(0,0,0,0.9)] text-left">
                <div className="flex flex-col space-y-3">
                  <div className="border-b border-white/[0.06] pb-2 flex items-center justify-between">
                    <span className="text-[9px] font-mono uppercase tracking-widest text-amber-400/80">
                      Z-Fold Plane 02
                    </span>
                    <span className="text-[9px] font-mono text-white/30">Kyoto Craft</span>
                  </div>

                  <nav className="flex flex-col space-y-1.5">
                    {navItems.map((item) => {
                      const isActive = activeNav === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setActiveNav(item.id)}
                          className={`flex items-center justify-between w-full py-2 px-2.5 rounded-xl transition-all cursor-pointer ${
                            isActive
                              ? "bg-amber-500/15 border border-amber-500/30 text-amber-200 shadow-md font-medium"
                              : "text-white/40 hover:text-white hover:bg-white/[0.02]"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            {item.icon}
                            <span className="text-xs">{item.label}</span>
                          </div>
                          {isActive && <span className="text-[10px] font-mono text-amber-400">◀</span>}
                        </button>
                      );
                    })}
                  </nav>
                </div>

                <div className="pt-3 border-t border-white/[0.06] flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg overflow-hidden ring-1 ring-amber-400/40 shrink-0">
                    <img src="/assets/avatar_executive_luxury.jpg" alt="A" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col text-left overflow-hidden">
                    <span className="text-xs font-light text-white truncate">{userName}</span>
                    <span className="text-[9px] font-mono text-amber-400/80">{userLevel}</span>
                  </div>
                </div>
              </aside>
            </div>
          )}

          {/* ========================================================================= */}
          {/* ARCHETYPE 16: THE CHRONOLOGICAL FLUENCY SPINE */}
          {/* ========================================================================= */}
          {selectedId === "timeline_learning_journey" && (
            <div className="my-auto py-8">
              <aside className="w-64 bg-[#030409] border border-white/[0.08] rounded-3xl p-5 flex flex-col justify-between h-[490px] shadow-2xl relative text-left">
                <div className="flex flex-col space-y-4">
                  {/* Timeline Header */}
                  <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-xs font-mono font-semibold tracking-wider text-white">CHRONO ROUTE</span>
                    </div>
                    <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                      DAY 14
                    </span>
                  </div>

                  {/* Chronological Milestone Nodes */}
                  <div className="relative pl-5 flex flex-col space-y-3">
                    {/* Vertical Connecting Fiber-Optic Line */}
                    <div className="absolute left-[7px] top-2 bottom-2 w-[1.5px] bg-gradient-to-b from-emerald-400 via-violet-500 to-cyan-400" />

                    {[
                      { id: "workspace", time: "07:30", label: "Morning Briefing", done: true },
                      { id: "memory", time: "09:00", label: "Memory Vault Sync", done: true },
                      { id: "interview", time: "12:30", label: "AI Interview Sparring", active: true },
                      { id: "reading", time: "15:00", label: "Precision Reading", pending: true },
                      { id: "writing", time: "18:30", label: "Executive Writing", pending: true },
                      { id: "lab", time: "21:00", label: "Design Lab Review", pending: true },
                    ].map((step) => {
                      const isCurrent = activeNav === step.id;
                      return (
                        <button
                          key={step.id}
                          type="button"
                          onClick={() => setActiveNav(step.id)}
                          className={`relative flex items-start text-left w-full transition-all cursor-pointer group ${
                            isCurrent ? "scale-[1.02]" : "opacity-75 hover:opacity-100"
                          }`}
                        >
                          {/* Node Dot */}
                          <div
                            className={`absolute -left-5 top-1 w-3 h-3 rounded-full border-2 transition-all ${
                              isCurrent
                                ? "bg-emerald-400 border-white shadow-[0_0_10px_#34d399] scale-125"
                                : step.done
                                ? "bg-emerald-500/40 border-emerald-400"
                                : "bg-[#04040A] border-white/30"
                            }`}
                          />
                          <div className="flex flex-col ml-1">
                            <span className="text-[9px] font-mono text-white/35">{step.time}</span>
                            <span
                              className={`text-xs font-light tracking-wide ${
                                isCurrent ? "text-white font-medium underline underline-offset-4 decoration-emerald-400" : "text-white/60"
                              }`}
                            >
                              {step.label}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
                  <span className="text-xs font-light text-white">{userName}</span>
                  <span className="text-[10px] font-mono text-emerald-400">85% Goal</span>
                </div>
              </aside>
            </div>
          )}

          {/* ========================================================================= */}
          {/* ARCHETYPE 17: THE RADIAL CORNER APERTURE */}
          {/* ========================================================================= */}
          {selectedId === "circular_corner_fan" && (
            <div className="my-auto py-8 w-full max-w-sm flex flex-col items-center">
              <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-4">
                Apertura Angular de 90° (Ergonomía Esquina Inferior)
              </span>

              <div className="relative w-64 h-64 bg-[#05060E] border border-white/[0.1] rounded-3xl p-5 overflow-hidden shadow-2xl flex flex-col justify-between">
                {/* Curved Arc Laser Overlay */}
                <div className="absolute inset-0 pointer-events-none flex items-end justify-start p-4">
                  <div className="w-52 h-52 rounded-full border border-purple-500/20 border-dashed" />
                </div>

                {/* Top Header */}
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-2 z-10">
                  <span className="text-[9px] font-mono tracking-widest text-purple-400">RADIAL 90°</span>
                  <span className="text-[9px] font-mono text-white/30">APERTURE DIAL</span>
                </div>

                {/* Radial Items Arc in Corner */}
                <div className="grid grid-cols-3 gap-2.5 z-10 my-auto">
                  {navItems.map((item, idx) => {
                    const isActive = activeNav === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setActiveNav(item.id)}
                        className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border transition-all cursor-pointer ${
                          isActive
                            ? "bg-purple-500/20 border-purple-400/50 text-white shadow-[0_0_15px_rgba(168,85,247,0.2)] scale-105"
                            : "bg-white/[0.02] border-white/[0.05] text-white/40 hover:text-white hover:border-white/20"
                        }`}
                      >
                        <div className="mb-1">{item.icon}</div>
                        <span className="text-[9px] font-mono text-center truncate max-w-full">{item.label}</span>
                        <span className="text-[8px] font-mono text-white/25 mt-0.5">{idx * 18}°</span>
                      </button>
                    );
                  })}
                </div>

                {/* Center Pivot Indicator */}
                <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono text-white/40 z-10">
                  <span className="text-white">{userName}</span>
                  <span className="text-purple-400">{userLevel}</span>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* ARCHETYPE 18: THE 0-WIDTH OBSIDIAN BLADE */}
          {/* ========================================================================= */}
          {selectedId === "stealth_blade_zero" && (
            <div className="my-auto py-8 flex items-center gap-4">
              {/* Inactive Zero-Width Laser Line (2px) */}
              <div className="flex flex-col items-center space-y-2">
                <div className="w-[2px] h-72 bg-white/20 relative flex flex-col justify-around items-center">
                  <span className="w-1.5 h-3 rounded-full bg-indigo-400 animate-pulse" />
                  <span className="w-1.5 h-3 rounded-full bg-white/40" />
                  <span className="w-1.5 h-3 rounded-full bg-indigo-400 animate-pulse" />
                </div>
                <span className="text-[8px] font-mono text-white/30 uppercase rotate-90 mt-4">2px Idle</span>
              </div>

              {/* Deployed Obsidian Blade */}
              <aside className="w-56 bg-[#020306]/98 border border-white/[0.12] rounded-2xl p-4 flex flex-col justify-between h-[480px] shadow-[25px_0_60px_rgba(0,0,0,0.98)] backdrop-blur-3xl text-left">
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center justify-between border-b border-white/[0.08] pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-[0_0_8px_#818cf8]" />
                      <span className="text-xs font-mono tracking-widest text-white uppercase">STEALTH BLADE</span>
                    </div>
                    <span className="text-[9px] font-mono text-white/30">0-PX EDGE</span>
                  </div>

                  <nav className="flex flex-col space-y-1.5">
                    {navItems.map((item) => {
                      const isActive = activeNav === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setActiveNav(item.id)}
                          className={`flex items-center justify-between w-full py-2 px-2.5 rounded-xl transition-all cursor-pointer ${
                            isActive
                              ? "bg-white/[0.08] border border-white/20 text-white font-medium shadow-sm"
                              : "text-white/40 hover:text-white hover:bg-white/[0.02]"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            {item.icon}
                            <span className="text-xs">{item.label}</span>
                          </div>
                          {item.hasDot && <span className="w-1 h-1 rounded-full bg-indigo-400" />}
                        </button>
                      );
                    })}
                  </nav>
                </div>

                <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs font-light text-white">{userName}</span>
                    <span className="text-[9px] font-mono text-indigo-400">{userLevel}</span>
                  </div>
                  <span className="text-[9px] font-mono text-white/20">AUTO-HIDE</span>
                </div>
              </aside>
            </div>
          )}

          {/* ========================================================================= */}
          {/* ARCHETYPE 19: THE HAUTE HORLOGERIE BEZEL */}
          {/* ========================================================================= */}
          {selectedId === "horology_bezel" && (
            <div className="my-auto py-8">
              <aside className="w-64 bg-[#0A0C10] border border-white/20 rounded-2xl p-5 flex flex-col justify-between h-[490px] shadow-[0_25px_70px_rgba(0,0,0,0.95),inset_0_1px_0_rgba(255,255,255,0.15)] relative text-left">
                {/* Micro Guilloché texture simulation */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:8px_8px] rounded-2xl" />

                <div className="flex flex-col space-y-4 z-10">
                  <div className="flex flex-col space-y-1 border-b border-white/10 pb-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-mono tracking-[0.3em] text-white/50 uppercase">
                        GENÈVE · CAL. 2026
                      </span>
                      <span className="text-[9px] font-mono text-emerald-400">48H RESERVE</span>
                    </div>
                    <span className="text-sm font-serif italic text-white tracking-widest uppercase">
                      CELAEST
                    </span>
                  </div>

                  <nav className="flex flex-col space-y-2 pt-1">
                    {[
                      { id: "workspace", num: "I", label: "Workspace" },
                      { id: "memory", num: "II", label: "Memory Vault" },
                      { id: "interview", num: "III", label: "Interview" },
                      { id: "reading", num: "IV", label: "Reading" },
                      { id: "writing", num: "V", label: "Writing Studio" },
                      { id: "lab", num: "VI", label: "Design Lab" },
                    ].map((item) => {
                      const isActive = activeNav === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setActiveNav(item.id)}
                          className={`flex items-center justify-between w-full py-1.5 px-2.5 rounded-lg transition-all cursor-pointer ${
                            isActive
                              ? "bg-white/[0.08] text-white border border-white/20 shadow-sm"
                              : "text-white/40 hover:text-white/80 hover:bg-white/[0.02]"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className={`text-xs font-serif ${isActive ? "text-white font-bold" : "text-white/30"}`}>
                              {item.num}.
                            </span>
                            <span className="text-xs font-light tracking-wider uppercase font-sans">
                              {item.label}
                            </span>
                          </div>
                          {isActive && (
                            <div className="flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_#fff]" />
                              <span className="text-[8.5px] font-mono text-white/50">SWEEP</span>
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </nav>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs z-10">
                  <div className="flex flex-col">
                    <span className="font-light text-white">{userName}</span>
                    <span className="text-[9.5px] font-mono text-white/40">28,800 VPH · {userLevel}</span>
                  </div>
                  <span className="text-[10px] font-serif italic text-white/60">CHRONOMÈTRE</span>
                </div>
              </aside>
            </div>
          )}

          {/* ========================================================================= */}
          {/* ARCHETYPE 20: THE ZUMTHOR MONOLITH */}
          {/* ========================================================================= */}
          {selectedId === "architectural_monolith" && (
            <div className="my-auto py-8">
              <aside className="w-60 bg-[#07080A] border border-white/[0.05] p-6 flex flex-col justify-between h-[490px] shadow-[0_30px_90px_rgba(0,0,0,0.98)] text-left relative font-sans">
                <div className="flex flex-col space-y-6">
                  <div className="flex flex-col space-y-1 pb-4 border-b border-white/[0.04]">
                    <span className="text-[8.5px] font-mono tracking-[0.4em] text-white/30 uppercase">
                      MONOLITH // THERME
                    </span>
                    <span className="text-xs font-light tracking-[0.35em] text-white/80 uppercase">
                      CELAEST
                    </span>
                  </div>

                  <nav className="flex flex-col space-y-3">
                    {[
                      { id: "workspace", label: "BRIEF", sub: "01" },
                      { id: "memory", label: "VAULT", sub: "02" },
                      { id: "interview", label: "VOICE", sub: "03" },
                      { id: "reading", label: "PAGES", sub: "04" },
                      { id: "writing", label: "QUILL", sub: "05" },
                      { id: "lab", label: "FORGE", sub: "06" },
                    ].map((item) => {
                      const isActive = activeNav === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setActiveNav(item.id)}
                          className={`relative flex items-center justify-between w-full py-2 px-1 transition-all cursor-pointer group ${
                            isActive ? "text-amber-100" : "text-white/30 hover:text-white/60"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-[9px] font-mono opacity-40">{item.sub}</span>
                            <span className={`text-xs tracking-[0.28em] font-light ${isActive ? "font-normal" : ""}`}>
                              {item.label}
                            </span>
                          </div>

                          {isActive && (
                            <span className="w-3 h-[1.5px] bg-amber-200/90 shadow-[0_0_12px_rgba(253,230,138,0.6)]" />
                          )}
                        </button>
                      );
                    })}
                  </nav>
                </div>

                <div className="pt-4 border-t border-white/[0.04] flex flex-col space-y-1">
                  <span className="text-[8.5px] font-mono tracking-[0.25em] text-white/30 uppercase">OCCUPANT</span>
                  <span className="text-xs font-light text-white/90 tracking-wider">{userName}</span>
                  <span className="text-[9.5px] font-mono text-amber-200/60">{userLevel}</span>
                </div>
              </aside>
            </div>
          )}

          {/* ========================================================================= */}
          {/* ARCHETYPE 21: THE BRAUN VITSOE 606 SYSTEM */}
          {/* ========================================================================= */}
          {selectedId === "dieter_rams_ten" && (
            <div className="my-auto py-8">
              <aside className="w-64 bg-[#141518] border border-zinc-700/50 rounded-xl p-4 flex flex-col justify-between h-[490px] shadow-2xl text-left">
                <div className="flex flex-col space-y-3">
                  <div className="w-full flex items-center justify-between border-b border-zinc-700/40 pb-2.5">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 12 }).map((_, i) => (
                        <span key={i} className="w-1 h-1 rounded-full bg-zinc-600/70" />
                      ))}
                    </div>
                    <span className="text-[9px] font-mono tracking-widest text-zinc-400 uppercase">BRAUN · ET66</span>
                  </div>

                  <div className="flex items-center justify-between px-1">
                    <span className="text-sm font-semibold tracking-tight text-white">CELAEST</span>
                    <span className="text-[9px] font-mono text-zinc-400">606 SYSTEM</span>
                  </div>

                  <nav className="flex flex-col space-y-1.5 pt-1">
                    {navItems.map((item) => {
                      const isActive = activeNav === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setActiveNav(item.id)}
                          className={`flex items-center justify-between w-full py-2 px-3 rounded-lg border transition-all cursor-pointer ${
                            isActive
                              ? "bg-zinc-800/90 border-zinc-600 text-white shadow-sm"
                              : "bg-zinc-900/40 border-zinc-800/60 text-zinc-400 hover:text-white hover:border-zinc-700"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            {item.icon}
                            <span className="text-xs font-medium">{item.label}</span>
                          </div>

                          {isActive ? (
                            <span className="w-2.5 h-2.5 rounded-full bg-[#FF5500] shadow-[0_0_6px_#ff5500]" />
                          ) : (
                            <span className="w-2 h-2 rounded-full bg-zinc-700" />
                          )}
                        </button>
                      );
                    })}
                  </nav>
                </div>

                <div className="pt-3 border-t border-zinc-700/40 flex items-center justify-between text-xs">
                  <div className="flex flex-col">
                    <span className="font-medium text-white">{userName}</span>
                    <span className="text-[9px] font-mono text-zinc-400">{userLevel}</span>
                  </div>
                  <span className="text-[8.5px] font-mono uppercase text-zinc-500 tracking-wider">
                    Weniger, aber besser
                  </span>
                </div>
              </aside>
            </div>
          )}

          {/* ========================================================================= */}
          {/* ARCHETYPE 22: THE LEICA M OPTICAL RANGEFINDER */}
          {/* ========================================================================= */}
          {selectedId === "leica_rangefinder" && (
            <div className="my-auto py-8 flex items-stretch">
              <div className="w-3 bg-zinc-900 border-y border-l border-zinc-700/60 rounded-l-2xl flex flex-col justify-around items-center py-4 opacity-70">
                {Array.from({ length: 24 }).map((_, i) => (
                  <span key={i} className="w-1.5 h-[1.5px] bg-zinc-600" />
                ))}
              </div>

              <aside className="w-60 bg-[#090A0D] border border-zinc-700/60 rounded-r-2xl p-4 flex flex-col justify-between h-[490px] shadow-2xl text-left">
                <div className="flex flex-col space-y-3">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-red-600 flex items-center justify-center text-[8px] font-serif font-bold text-white shadow-sm">
                        L
                      </div>
                      <span className="text-xs font-mono font-semibold tracking-wider text-white">LEICA M11</span>
                    </div>
                    <span className="text-[9px] font-mono text-red-500 font-bold">50mm f/1.4</span>
                  </div>

                  <nav className="flex flex-col space-y-1.5 pt-1">
                    {[
                      { id: "workspace", f: "f/1.4", label: "Workspace" },
                      { id: "memory", f: "f/2.0", label: "Memory Vault" },
                      { id: "interview", f: "f/2.8", label: "Interview" },
                      { id: "reading", f: "f/4.0", label: "Reading" },
                      { id: "writing", f: "f/5.6", label: "Writing Studio" },
                      { id: "lab", f: "f/8.0", label: "Design Lab" },
                    ].map((item) => {
                      const isActive = activeNav === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setActiveNav(item.id)}
                          className={`flex items-center justify-between w-full py-2 px-2.5 rounded-lg border transition-all cursor-pointer ${
                            isActive
                              ? "bg-zinc-800/80 border-red-500/50 text-white shadow-sm"
                              : "bg-transparent border-transparent text-zinc-400 hover:text-white hover:bg-zinc-900/50"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className={`text-[10px] font-mono ${isActive ? "text-red-500 font-bold" : "text-zinc-600"}`}>
                              {item.f}
                            </span>
                            <span className="text-xs font-light">{item.label}</span>
                          </div>
                          {isActive && <span className="text-[9px] font-mono text-white/50">FOCUS ⌖</span>}
                        </button>
                      );
                    })}
                  </nav>
                </div>

                <div className="pt-3 border-t border-zinc-800 flex items-center justify-between text-xs">
                  <div className="flex flex-col">
                    <span className="font-light text-white">{userName}</span>
                    <span className="text-[9px] font-mono text-zinc-500">{userLevel}</span>
                  </div>
                  <span className="text-[9px] font-mono text-red-500">WETZLAR</span>
                </div>
              </aside>
            </div>
          )}

          {/* ========================================================================= */}
          {/* ARCHETYPE 23: THE KYOTO SENSU SILK RIBBON */}
          {/* ========================================================================= */}
          {selectedId === "japanese_sensu" && (
            <div className="my-auto py-8 flex flex-col items-center">
              <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-4">
                Cinta de Seda Flotante de 28px · Filosofía Ma (間)
              </span>

              <aside className="w-12 bg-[#05060A]/95 border-x border-white/[0.08] py-5 px-1 flex flex-col justify-between items-center h-[490px] shadow-[0_20px_60px_rgba(0,0,0,0.9)] relative backdrop-blur-xl">
                <div className="w-2 h-2 rounded-full bg-white/40 mb-2" />

                <nav className="flex flex-col space-y-5 my-auto items-center">
                  {[
                    { id: "workspace", symbol: "間", label: "Workspace" },
                    { id: "memory", symbol: "記", label: "Memory" },
                    { id: "interview", symbol: "話", label: "Speaking" },
                    { id: "reading", symbol: "読", label: "Reading" },
                    { id: "writing", symbol: "書", label: "Writing" },
                    { id: "lab", symbol: "創", label: "Lab" },
                  ].map((item) => {
                    const isActive = activeNav === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setActiveNav(item.id)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer relative ${
                          isActive
                            ? "bg-white text-black font-medium shadow-[0_0_12px_rgba(255,255,255,0.4)] scale-110"
                            : "text-white/40 hover:text-white hover:bg-white/[0.04]"
                        }`}
                        title={item.label}
                      >
                        <span className="text-[11px] font-sans">{item.symbol}</span>
                      </button>
                    );
                  })}
                </nav>

                <div className="w-6 h-6 rounded-md bg-red-700/80 border border-red-500/50 flex items-center justify-center text-[10px] font-bold text-white shadow-inner cursor-pointer" title={`${userName} (${userLevel})`}>
                  印
                </div>
              </aside>
            </div>
          )}

          {/* ========================================================================= */}
          {/* ARCHETYPE 24: THE TP-7 MAGNETIC TAPE REEL */}
          {/* ========================================================================= */}
          {selectedId === "teenage_engineering_tp7" && (
            <div className="my-auto py-8">
              <aside className="w-64 bg-[#0F1014] border border-zinc-600/40 rounded-3xl p-5 flex flex-col justify-between h-[490px] shadow-2xl relative text-left">
                <div className="absolute top-3 left-3 w-1.5 h-1.5 rounded-full border border-zinc-600 flex items-center justify-center text-[6px] text-zinc-500">✕</div>
                <div className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full border border-zinc-600 flex items-center justify-center text-[6px] text-zinc-500">✕</div>
                <div className="absolute bottom-3 left-3 w-1.5 h-1.5 rounded-full border border-zinc-600 flex items-center justify-center text-[6px] text-zinc-500">✕</div>
                <div className="absolute bottom-3 right-3 w-1.5 h-1.5 rounded-full border border-zinc-600 flex items-center justify-center text-[6px] text-zinc-500">✕</div>

                <div className="flex flex-col space-y-3 pt-2">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                    <span className="text-[10px] font-mono font-bold text-white tracking-widest">TP-7 // REEL</span>
                    <span className="text-[9px] font-mono text-orange-400 bg-orange-500/10 px-1.5 py-0.5 rounded border border-orange-500/20">
                      REC 00:14:28
                    </span>
                  </div>

                  <div className="w-full p-2.5 rounded-2xl bg-black/60 border border-zinc-800 flex items-center justify-center gap-4">
                    <div className="w-12 h-12 rounded-full border-2 border-zinc-500 border-dashed animate-spin [animation-duration:6s] flex items-center justify-center">
                      <div className="w-4 h-4 rounded-full bg-orange-500/80" />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-[9px] font-mono text-zinc-400">MOTOR // 33 RPM</span>
                      <span className="text-xs font-mono text-white">PCM 24-BIT</span>
                    </div>
                  </div>

                  <nav className="flex flex-col space-y-1 pt-1">
                    {navItems.map((item) => {
                      const isActive = activeNav === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setActiveNav(item.id)}
                          className={`flex items-center justify-between w-full py-1.5 px-3 rounded-lg border transition-all cursor-pointer ${
                            isActive
                              ? "bg-zinc-800 border-orange-500/60 text-white shadow-sm font-medium"
                              : "bg-transparent border-transparent text-zinc-400 hover:text-white hover:bg-zinc-900"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            {item.icon}
                            <span className="text-xs font-mono">{item.label}</span>
                          </div>
                          {isActive && <span className="text-[9px] font-mono text-orange-400">PLAY ▶</span>}
                        </button>
                      );
                    })}
                  </nav>
                </div>

                <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-xs font-mono">
                  <span className="text-white">{userName}</span>
                  <span className="text-orange-400">{userLevel}</span>
                </div>
              </aside>
            </div>
          )}

          {/* ========================================================================= */}
          {/* ARCHETYPE 25: THE CELAEST CONSTRUCTIVIST GEOMETRY */}
          {/* ========================================================================= */}
          {selectedId === "bauhaus_geometry" && (
            <div className="my-auto py-8">
              <aside className="w-64 bg-[#06060e] border border-white/[0.08] rounded-xl p-4 flex flex-col justify-between h-[490px] shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_35px_rgba(112,72,232,0.08)] relative text-left select-none">
                <div className="flex flex-col space-y-3">
                  <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7850e8] to-[#6038e0] flex items-center justify-center p-1.5 shadow-[0_0_15px_rgba(112,72,232,0.4)]">
                        <svg viewBox={`0 0 ${CELAEST_LOGO_VIEWBOX.width} ${CELAEST_LOGO_VIEWBOX.height}`} fill="none" className="w-full h-full text-white">
                          <path d={CELAEST_LOGO_PATH_D} fill="currentColor" />
                        </svg>
                      </div>
                      <div className="flex flex-col justify-center">
                        <span className="text-[8px] font-mono tracking-[0.28em] text-violet-300/70 uppercase leading-none">ENGLISH ENGINE</span>
                        <span className="text-xs font-bold tracking-[0.22em] text-white uppercase mt-1.5 leading-tight">CELAEST</span>
                      </div>
                    </div>
                  </div>

                  <nav className="flex flex-col space-y-1 pt-1">
                    {[
                      { id: "workspace", shape: "circle", label: "Workspace" },
                      { id: "memory", shape: "square", label: "Memory Vault" },
                      { id: "interview", shape: "triangle", label: "Interview" },
                      { id: "reading", shape: "diamond", label: "Reading" },
                      { id: "writing", shape: "hexagon", label: "Writing Studio" },
                      { id: "lab", shape: "cross", label: "Design Lab" },
                      { id: "settings", shape: "octagon", label: "Settings" },
                    ].map((item) => {
                      const isActive = activeNav === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setActiveNav(item.id)}
                          className={`flex items-center justify-between w-full py-2 px-3 rounded-lg transition-all cursor-pointer ${
                            isActive
                              ? "bg-gradient-to-r from-[#7048e8] to-[#6038e0] text-white font-medium shadow-[0_0_20px_rgba(112,72,232,0.35)]"
                              : "bg-transparent text-white/50 hover:text-white hover:bg-white/[0.04]"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-4 h-4 flex items-center justify-center">
                              {item.shape === "circle" && (
                                <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill={isActive ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5">
                                  <circle cx="8" cy="8" r="6" />
                                </svg>
                              )}
                              {item.shape === "square" && (
                                <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill={isActive ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5">
                                  <rect x="2" y="2" width="12" height="12" />
                                </svg>
                              )}
                              {item.shape === "triangle" && (
                                <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill={isActive ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5">
                                  <polygon points="8,2 14,14 2,14" />
                                </svg>
                              )}
                              {item.shape === "diamond" && (
                                <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill={isActive ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5">
                                  <polygon points="8,1 15,8 8,15 1,8" />
                                </svg>
                              )}
                              {item.shape === "hexagon" && (
                                <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill={isActive ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5">
                                  <polygon points="8,1 14,4.5 14,11.5 8,15 2,11.5 2,4.5" />
                                </svg>
                              )}
                              {item.shape === "cross" && (
                                <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" stroke="currentColor" strokeWidth={isActive ? "2.5" : "1.75"}>
                                  <path d="M8 2v12M2 8h12" />
                                </svg>
                              )}
                              {item.shape === "octagon" && (
                                <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill={isActive ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
                                  <polygon points="5.5,2 10.5,2 14,5.5 14,10.5 10.5,14 5.5,14 2,10.5 2,5.5" />
                                </svg>
                              )}
                            </span>
                            <span className="text-xs uppercase tracking-[0.14em] font-light">{item.label}</span>
                          </div>
                        </button>
                      );
                    })}
                  </nav>
                </div>

                <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs px-1.5 py-1">
                  <div className="flex flex-col text-left overflow-hidden pr-2">
                    <span className="font-semibold text-white uppercase tracking-wider text-xs truncate">{userName}</span>
                    <span className="text-[10px] font-mono text-zinc-400 mt-1.5 truncate">{userLevel}</span>
                  </div>
                  <span className="px-2.5 py-1 rounded text-[10px] font-mono tracking-widest text-zinc-400 uppercase">
                    [SALIR]
                  </span>
                </div>
              </aside>
            </div>
          )}

          {/* ========================================================================= */}
          {/* ARCHETYPE 26: THE CUPERTINO CURVED GLASS PAVILION */}
          {/* ========================================================================= */}
          {selectedId === "apple_park_glass" && (
            <div className="my-auto py-8">
              <aside className="w-64 bg-white/[0.03] border border-white/15 rounded-[32px] p-5 flex flex-col justify-between h-[490px] shadow-[0_25px_70px_rgba(0,0,0,0.85),inset_0_1px_1px_rgba(255,255,255,0.25)] relative text-left backdrop-blur-2xl">
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-2xl bg-white/[0.06] border border-white/20 flex items-center justify-center p-1.5 shadow-inner">
                        <svg viewBox={`0 0 ${CELAEST_LOGO_VIEWBOX.width} ${CELAEST_LOGO_VIEWBOX.height}`} fill="none" className="w-full h-full text-white">
                          <path d={CELAEST_LOGO_PATH_D} fill="currentColor" />
                        </svg>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest">Steve Jobs Theater</span>
                        <span className="text-xs font-light text-white tracking-widest uppercase">CELAEST GLASS</span>
                      </div>
                    </div>
                  </div>

                  <nav className="flex flex-col space-y-1.5 pt-1">
                    {navItems.map((item) => {
                      const isActive = activeNav === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setActiveNav(item.id)}
                          className={`flex items-center justify-between w-full py-2 px-3 rounded-2xl transition-all duration-200 cursor-pointer ${
                            isActive
                              ? "bg-white/15 border border-white/25 text-white font-normal shadow-[0_4px_20px_rgba(255,255,255,0.08),inset_0_1px_0_rgba(255,255,255,0.3)]"
                              : "bg-transparent border border-transparent text-white/45 hover:text-white hover:bg-white/[0.04]"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-white/60">{item.icon}</span>
                            <span className="text-xs font-light tracking-wide">{item.label}</span>
                          </div>
                          {isActive && <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_#ffffff]" />}
                        </button>
                      );
                    })}
                  </nav>
                </div>

                <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-white/10 border border-white/20 overflow-hidden flex items-center justify-center">
                      <span className="text-[10px] text-white font-light">EP</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-light text-white">{userName}</span>
                      <span className="text-[9px] font-mono text-white/40">{userLevel}</span>
                    </div>
                  </div>
                  <span className="text-[9px] font-mono text-white/30">4K LENS</span>
                </div>
              </aside>
            </div>
          )}

          {/* ========================================================================= */}
          {/* ARCHETYPE 27: THE BRAILLE TACTILE MICRO-RIDGE */}
          {/* ========================================================================= */}
          {selectedId === "braille_tactile_ridge" && (
            <div className="my-auto py-8">
              <aside className="w-64 bg-[#0B0C10] border border-zinc-800/80 rounded-2xl p-5 flex flex-col justify-between h-[490px] shadow-2xl relative text-left">
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-zinc-400" />
                      <span className="text-xs font-mono font-medium text-zinc-300 uppercase tracking-widest">TACTILE DEBOSS</span>
                    </div>
                    <span className="text-[9px] font-mono text-zinc-600">3×2 MATRIX</span>
                  </div>

                  <nav className="flex flex-col space-y-2 pt-1">
                    {navItems.map((item) => {
                      const isActive = activeNav === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setActiveNav(item.id)}
                          className={`flex items-center justify-between w-full py-2 px-3 rounded-xl transition-all cursor-pointer ${
                            isActive
                              ? "bg-zinc-900/90 border border-zinc-700 text-white shadow-inner"
                              : "bg-transparent border border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {/* 3x2 Tactile Braille Dot Grid */}
                            <div className="grid grid-cols-2 gap-1 p-1 rounded bg-black/40 border border-zinc-800">
                              {[0, 1, 2, 3, 4, 5].map((dotIndex) => (
                                <div
                                  key={dotIndex}
                                  className={`w-1 h-1 rounded-full transition-all ${
                                    isActive
                                      ? "bg-zinc-200 shadow-[0_1px_3px_rgba(255,255,255,0.8)] scale-110"
                                      : "bg-zinc-800 shadow-[inset_0_1px_1px_rgba(0,0,0,0.8)]"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-xs font-sans tracking-wide">{item.label}</span>
                          </div>
                          {isActive && <span className="text-[8.5px] font-mono text-zinc-400 uppercase">EMBOSS</span>}
                        </button>
                      );
                    })}
                  </nav>
                </div>

                <div className="pt-3 border-t border-zinc-800 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs text-zinc-300 font-light">{userName}</span>
                    <span className="text-[9px] font-mono text-zinc-500">{userLevel}</span>
                  </div>
                  <div className="px-2 py-0.5 rounded border border-zinc-700/60 text-[9px] font-mono text-zinc-400 shadow-inner">
                    BLIND SEAL
                  </div>
                </div>
              </aside>
            </div>
          )}

          {/* ========================================================================= */}
          {/* ARCHETYPE 28: THE MONOCLE TRAVEL JOURNAL */}
          {/* ========================================================================= */}
          {selectedId === "monocle_travel_column" && (
            <div className="my-auto py-8">
              <aside className="w-64 bg-[#0A0C11] border-r border-y border-white/[0.08] border-l-2 border-l-amber-500/60 rounded-r-2xl p-5 flex flex-col justify-between h-[490px] shadow-2xl relative text-left">
                <div className="flex flex-col space-y-4">
                  <div className="flex flex-col space-y-1 border-b border-dashed border-white/10 pb-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-mono text-amber-400 uppercase tracking-widest">DISPATCH // VOL. 28</span>
                      <span className="text-[9px] font-mono text-white/30">UTC 16:24</span>
                    </div>
                    <span className="text-xs font-serif italic text-white/90">CELAEST Field Correspondent</span>
                  </div>

                  <nav className="flex flex-col space-y-1 pt-1">
                    {navItems.map((item, idx) => {
                      const isActive = activeNav === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setActiveNav(item.id)}
                          className={`flex items-center justify-between w-full py-1.5 px-2 transition-all cursor-pointer ${
                            isActive
                              ? "text-amber-300 font-medium bg-amber-500/10 rounded-lg"
                              : "text-white/45 hover:text-white"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="text-[9px] font-mono text-white/30">{`0${idx + 1}`}</span>
                            <span className="text-xs font-serif tracking-wide">{item.label}</span>
                          </div>
                          {isActive && <span className="text-[9px] font-mono text-amber-400">§ ACT</span>}
                        </button>
                      );
                    })}
                  </nav>
                </div>

                <div className="pt-3 border-t border-dashed border-white/10 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs font-serif text-white">{userName}</span>
                    <span className="text-[9px] font-mono text-white/40">{userLevel} // NYC-TYO</span>
                  </div>
                  <div className="w-8 h-8 rounded-full border border-amber-500/40 flex items-center justify-center text-[7px] font-mono text-amber-400 uppercase text-center leading-none">
                    DIPL
                  </div>
                </div>
              </aside>
            </div>
          )}

          {/* ========================================================================= */}
          {/* ARCHETYPE 29: THE ANALOG FILM STRIP REEL */}
          {/* ========================================================================= */}
          {selectedId === "polaroid_film_strip" && (
            <div className="my-auto py-8 flex items-stretch">
              {/* 35mm Sprocket Holes */}
              <div className="w-5 bg-[#030305] border-y border-l border-zinc-800 rounded-l-xl flex flex-col justify-around items-center py-2">
                {Array.from({ length: 14 }).map((_, i) => (
                  <div key={i} className="w-2.5 h-3.5 rounded-[2px] bg-black border border-zinc-700/60 shadow-inner" />
                ))}
              </div>

              <aside className="w-60 bg-[#06070A] border border-zinc-800 rounded-r-xl p-4 flex flex-col justify-between h-[490px] shadow-2xl relative text-left">
                <div className="flex flex-col space-y-3">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                    <span className="text-[9px] font-mono uppercase text-zinc-400 tracking-widest">KODAK 400TX // 35MM</span>
                    <span className="text-[9px] font-mono text-zinc-600">SAFETY FILM</span>
                  </div>

                  <nav className="flex flex-col space-y-1.5 pt-1">
                    {navItems.map((item, idx) => {
                      const isActive = activeNav === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setActiveNav(item.id)}
                          className={`flex items-center justify-between w-full p-2 rounded border transition-all cursor-pointer ${
                            isActive
                              ? "bg-zinc-100 border-white text-black shadow-[0_0_20px_rgba(255,255,255,0.25)] font-medium"
                              : "bg-black/50 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className={`text-[8.5px] font-mono ${isActive ? "text-zinc-600" : "text-zinc-600"}`}>
                              EXP {`0${idx + 1}`}
                            </span>
                            <span className="text-xs font-mono">{item.label}</span>
                          </div>
                          {isActive && <span className="text-[8px] font-mono font-bold tracking-widest text-black">FRAME</span>}
                        </button>
                      );
                    })}
                  </nav>
                </div>

                <div className="pt-2.5 border-t border-zinc-800 flex items-center justify-between text-[9px] font-mono">
                  <span className="text-zinc-400">{userName}</span>
                  <span className="text-zinc-600">1/500s · f/5.6</span>
                </div>
              </aside>
            </div>
          )}

          {/* ========================================================================= */}
          {/* ARCHETYPE 30: THE CELESTIAL CALIPER INSTRUMENT */}
          {/* ========================================================================= */}
          {selectedId === "astronomical_caliper" && (
            <div className="my-auto py-8 flex items-stretch">
              {/* Vernier Millimeter Rule Track */}
              <div className="w-6 bg-[#06080E] border-y border-l border-cyan-500/30 rounded-l-xl flex flex-col justify-between items-end py-4 pr-1 text-[7px] font-mono text-cyan-400/50">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-1">
                    {i % 4 === 0 && <span>{i * 5}</span>}
                    <div className={`h-[1px] bg-cyan-400/40 ${i % 4 === 0 ? "w-2.5 bg-cyan-400" : "w-1.5"}`} />
                  </div>
                ))}
              </div>

              <aside className="w-60 bg-[#080B12] border border-cyan-500/30 rounded-r-xl p-4 flex flex-col justify-between h-[490px] shadow-2xl relative text-left">
                <div className="flex flex-col space-y-3">
                  <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2">
                    <span className="text-[9px] font-mono text-cyan-400 tracking-widest uppercase">CALIPER 0.1MM</span>
                    <span className="text-[8.5px] font-mono text-cyan-400/60">RA 14h 29m</span>
                  </div>

                  <nav className="flex flex-col space-y-1.5 pt-1">
                    {navItems.map((item) => {
                      const isActive = activeNav === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setActiveNav(item.id)}
                          className={`flex items-center justify-between w-full py-1.5 px-2.5 rounded-lg border transition-all cursor-pointer ${
                            isActive
                              ? "bg-cyan-950/60 border-cyan-400/70 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.15)] font-medium"
                              : "bg-transparent border-transparent text-cyan-400/40 hover:text-cyan-200 hover:bg-cyan-950/20"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="text-cyan-400/60 text-xs">⌖</span>
                            <span className="text-xs font-mono">{item.label}</span>
                          </div>
                          {isActive && <span className="text-[8.5px] font-mono text-cyan-400">LOCK</span>}
                        </button>
                      );
                    })}
                  </nav>
                </div>

                <div className="pt-2 border-t border-cyan-500/20 flex items-center justify-between text-xs font-mono">
                  <span className="text-cyan-300 text-[11px]">{userName}</span>
                  <span className="text-[9px] text-cyan-400/70">DEC +62°</span>
                </div>
              </aside>
            </div>
          )}

          {/* ========================================================================= */}
          {/* ARCHETYPE 31: THE GENEVA GUILLOCHÉ ATELIER */}
          {/* ========================================================================= */}
          {selectedId === "vacheron_guilloche" && (
            <div className="my-auto py-8">
              <aside className="w-64 bg-[#08090E] border border-amber-500/30 rounded-[28px] p-5 flex flex-col justify-between h-[490px] shadow-2xl relative text-left select-none overflow-hidden">
                {/* Guilloché micro barleycorn pattern background */}
                <div
                  className="absolute inset-0 opacity-15 pointer-events-none"
                  style={{
                    backgroundImage: `
                      radial-gradient(circle, rgba(212,175,55,0.4) 1px, transparent 1px)
                    `,
                    backgroundSize: "8px 8px",
                  }}
                />

                <div className="flex flex-col space-y-4 relative z-10">
                  <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3.5 h-3.5 rounded-full border border-amber-400/60 flex items-center justify-center text-[7px] text-amber-400 font-serif">
                        ⚓
                      </div>
                      <span className="text-xs font-serif tracking-[0.2em] text-amber-200 uppercase">GENÈVE ATELIER</span>
                    </div>
                    <span className="text-[9px] font-mono text-amber-400/60">CAL. 4100</span>
                  </div>

                  <nav className="flex flex-col space-y-1.5 pt-1">
                    {[
                      { id: "workspace", roman: "I", label: "Workspace" },
                      { id: "memory", roman: "II", label: "Memory Vault" },
                      { id: "interview", roman: "III", label: "Interview" },
                      { id: "reading", roman: "IV", label: "Reading" },
                      { id: "writing", roman: "V", label: "Writing Studio" },
                      { id: "lab", roman: "VI", label: "Design Lab" },
                    ].map((item) => {
                      const isActive = activeNav === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setActiveNav(item.id)}
                          className={`flex items-center justify-between w-full py-1.5 px-3 rounded-xl border transition-all cursor-pointer ${
                            isActive
                              ? "bg-gradient-to-r from-amber-500/15 to-transparent border-amber-500/40 text-amber-100 shadow-sm"
                              : "bg-transparent border-transparent text-white/40 hover:text-white/80 hover:bg-white/[0.02]"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className={`text-[10px] font-serif ${isActive ? "text-amber-400 font-bold" : "text-amber-400/40"}`}>
                              {item.roman}
                            </span>
                            <span className="text-xs font-serif tracking-wide">{item.label}</span>
                          </div>
                          {isActive && <div className="w-2 h-0.5 bg-blue-500 shadow-[0_0_6px_#3b82f6]" title="Aguja Azulada" />}
                        </button>
                      );
                    })}
                  </nav>
                </div>

                <div className="pt-3 border-t border-amber-500/20 flex items-center justify-between relative z-10">
                  <div className="flex flex-col">
                    <span className="text-xs font-serif text-amber-100">{userName}</span>
                    <span className="text-[9px] font-mono text-amber-400/50">{userLevel}</span>
                  </div>
                  <span className="text-[8.5px] font-serif text-amber-400 uppercase tracking-widest border border-amber-500/30 px-2 py-0.5 rounded-full">
                    POINÇON DE GENÈVE
                  </span>
                </div>
              </aside>
            </div>
          )}

          {/* ========================================================================= */}
          {/* ARCHETYPE 32: THE GOTHENBURG 6X6 MEDIUM FORMAT */}
          {/* ========================================================================= */}
          {selectedId === "hasselblad_medium_format" && (
            <div className="my-auto py-8">
              <aside className="w-64 bg-[#0E1015] border-2 border-zinc-700 rounded-3xl p-5 flex flex-col justify-between h-[490px] shadow-2xl relative text-left">
                {/* 6x6 Ground Glass Viewfinder simulation */}
                <div className="flex flex-col space-y-3">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-white tracking-widest">HASSELBLAD</span>
                      <span className="text-[8.5px] font-mono text-zinc-500">500C/M</span>
                    </div>
                    <span className="text-[9px] font-mono text-white/50">SWEDEN</span>
                  </div>

                  {/* Ground Glass Screen with Acid-Etched Crosshairs */}
                  <div className="w-full h-24 rounded-2xl bg-zinc-950/80 border border-zinc-800 relative flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-full h-[1px] bg-zinc-700/40" />
                      <div className="h-full w-[1px] bg-zinc-700/40 absolute" />
                      <div className="w-10 h-10 rounded-full border border-zinc-600/50 absolute" />
                    </div>
                    <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-wider relative z-10">
                      ZEISS PLANAR 80MM · F/2.8
                    </span>
                  </div>

                  <nav className="flex flex-col space-y-1 pt-1">
                    {[
                      { id: "workspace", aperture: "f/2.8", label: "Workspace" },
                      { id: "memory", aperture: "f/4.0", label: "Memory Vault" },
                      { id: "interview", aperture: "f/5.6", label: "Interview" },
                      { id: "reading", aperture: "f/8.0", label: "Reading" },
                      { id: "writing", aperture: "f/11", label: "Writing Studio" },
                      { id: "lab", aperture: "f/16", label: "Design Lab" },
                    ].map((item) => {
                      const isActive = activeNav === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setActiveNav(item.id)}
                          className={`flex items-center justify-between w-full py-1.5 px-2.5 rounded-lg border transition-all cursor-pointer ${
                            isActive
                              ? "bg-zinc-800 border-zinc-500 text-white shadow-sm font-medium"
                              : "bg-transparent border-transparent text-zinc-400 hover:text-white hover:bg-zinc-900"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className={`text-[9px] font-mono ${isActive ? "text-white font-bold" : "text-zinc-600"}`}>
                              {item.aperture}
                            </span>
                            <span className="text-xs font-mono">{item.label}</span>
                          </div>
                          {isActive && <span className="text-[8.5px] font-mono text-zinc-400">CLICK</span>}
                        </button>
                      );
                    })}
                  </nav>
                </div>

                <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-xs font-mono">
                  <span className="text-white">{userName}</span>
                  <span className="text-zinc-500">6×6 MAGNESIUM</span>
                </div>
              </aside>
            </div>
          )}

          {/* ========================================================================= */}
          {/* ARCHETYPE 33: THE KINTSUGI GOLD SEAM MONOLITH */}
          {/* ========================================================================= */}
          {selectedId === "kyoto_kintsugi" && (
            <div className="my-auto py-8">
              <aside className="w-60 bg-[#07080A] border border-stone-800/80 rounded-none p-5 flex flex-col justify-between h-[490px] shadow-2xl relative text-left select-none">
                {/* Organic Gold Vein Line */}
                <div className="absolute top-12 bottom-12 left-7 w-[1.5px] bg-gradient-to-b from-amber-400 via-amber-300 to-amber-500 opacity-60 pointer-events-none" />

                <div className="flex flex-col space-y-4 relative z-10">
                  <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                    <span className="text-[9px] font-mono text-amber-400 uppercase tracking-widest">KINTSUGI // 金継ぎ</span>
                    <span className="text-[9px] font-serif text-stone-500">WABI-SABI</span>
                  </div>

                  <nav className="flex flex-col space-y-3 pt-2">
                    {[
                      { id: "workspace", label: "Workspace" },
                      { id: "memory", label: "Memory Vault" },
                      { id: "interview", label: "Interview" },
                      { id: "reading", label: "Reading" },
                      { id: "writing", label: "Writing Studio" },
                      { id: "lab", label: "Design Lab" },
                    ].map((item) => {
                      const isActive = activeNav === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setActiveNav(item.id)}
                          className={`flex items-center gap-4 w-full py-1 text-left transition-all cursor-pointer ${
                            isActive ? "text-white" : "text-stone-500 hover:text-stone-300"
                          }`}
                        >
                          <div
                            className={`w-2.5 h-2.5 rounded-full border transition-all ${
                              isActive
                                ? "bg-amber-400 border-amber-300 shadow-[0_0_8px_#f59e0b] scale-125"
                                : "bg-stone-900 border-amber-500/40"
                            }`}
                          />
                          <span className={`text-xs font-light tracking-widest uppercase ${isActive ? "font-normal text-amber-100" : ""}`}>
                            {item.label}
                          </span>
                        </button>
                      );
                    })}
                  </nav>
                </div>

                <div className="pt-3 border-t border-stone-800 flex items-center justify-between relative z-10">
                  <div className="flex flex-col">
                    <span className="text-xs font-light text-stone-300">{userName}</span>
                    <span className="text-[9px] font-mono text-stone-500">{userLevel}</span>
                  </div>
                  <div className="w-6 h-6 rounded-sm bg-red-800/80 border border-red-500/40 flex items-center justify-center text-[10px] text-white font-serif">
                    金
                  </div>
                </div>
              </aside>
            </div>
          )}

          {/* ========================================================================= */}
          {/* ARCHETYPE 34: THE KRONBERG ET66 CALCULATOR LEDGER */}
          {/* ========================================================================= */}
          {selectedId === "braun_et66_ledger" && (
            <div className="my-auto py-8">
              <aside className="w-64 bg-[#141518] border border-zinc-700/60 rounded-[28px] p-5 flex flex-col justify-between h-[490px] shadow-2xl relative text-left">
                <div className="flex flex-col space-y-3.5">
                  {/* Vintage Olive TN LCD Screen */}
                  <div className="w-full p-2.5 rounded-xl bg-[#2D3328] border border-zinc-700 flex items-center justify-between shadow-inner">
                    <span className="text-[9px] font-mono text-lime-400/70 uppercase">CELAEST // BRAUN</span>
                    <span className="text-sm font-mono font-bold text-lime-400 tracking-wider">1977.06</span>
                  </div>

                  {/* Circular Convex Buttons */}
                  <nav className="flex flex-col space-y-1.5 pt-1">
                    {navItems.map((item, idx) => {
                      const isActive = activeNav === item.id;
                      const isFirst = idx === 0;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setActiveNav(item.id)}
                          className={`flex items-center justify-between w-full py-1.5 px-3 rounded-2xl border transition-all cursor-pointer ${
                            isActive
                              ? "bg-zinc-800 border-amber-500 text-white shadow-md"
                              : isFirst
                              ? "bg-[#232F24] border-zinc-700 text-zinc-300 hover:text-white"
                              : "bg-[#1E1F24] border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                                isActive
                                  ? "bg-amber-400 border-amber-300 shadow-[0_0_6px_#f59e0b]"
                                  : isFirst
                                  ? "bg-emerald-600 border-emerald-500"
                                  : "bg-zinc-700 border-zinc-600"
                              }`}
                            />
                            <span className="text-xs font-mono">{item.label}</span>
                          </div>
                          {isActive && <span className="text-[8.5px] font-mono text-amber-400 font-bold">ON</span>}
                        </button>
                      );
                    })}
                  </nav>
                </div>

                <div className="pt-2.5 border-t border-zinc-800 flex items-center justify-between text-xs font-mono">
                  <span className="text-white text-[11px]">{userName}</span>
                  <span className="text-[9px] font-mono text-zinc-500">TYPE ET66</span>
                </div>
              </aside>
            </div>
          )}

          {/* ========================================================================= */}
          {/* ARCHETYPE 35: THE AEROSPACE TITANIUM POTENTIOMETER */}
          {/* ========================================================================= */}
          {selectedId === "titanium_potentiometer" && (
            <div className="my-auto py-8 flex items-stretch">
              {/* Dual LED VU Meter */}
              <div className="w-5 bg-[#08090C] border-y border-l border-zinc-700/60 rounded-l-xl flex flex-col justify-around items-center py-4">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-1 rounded-[0.5px] ${
                      i < 2 ? "bg-red-500/70" : i < 5 ? "bg-amber-400/70" : "bg-emerald-400/70"
                    }`}
                  />
                ))}
              </div>

              <aside className="w-60 bg-[#0B0C10] border border-zinc-700/60 rounded-r-xl p-4 flex flex-col justify-between h-[490px] shadow-2xl relative text-left font-mono">
                <div className="flex flex-col space-y-3">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                    <span className="text-[9px] font-bold text-white tracking-widest uppercase">SSL MASTER FADER</span>
                    <span className="text-[9px] text-cyan-400">0dB UNITY</span>
                  </div>

                  <nav className="flex flex-col space-y-1.5 pt-1">
                    {[
                      { id: "workspace", db: "+10dB", label: "Workspace" },
                      { id: "memory", db: "+6dB", label: "Memory Vault" },
                      { id: "interview", db: "0dB", label: "Interview" },
                      { id: "reading", db: "-5dB", label: "Reading" },
                      { id: "writing", db: "-10dB", label: "Writing Studio" },
                      { id: "lab", db: "-∞", label: "Design Lab" },
                    ].map((item) => {
                      const isActive = activeNav === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setActiveNav(item.id)}
                          className={`flex items-center justify-between w-full py-1.5 px-2.5 rounded-lg border transition-all cursor-pointer ${
                            isActive
                              ? "bg-zinc-800 border-cyan-400/70 text-white shadow-sm font-medium"
                              : "bg-transparent border-transparent text-zinc-400 hover:text-white hover:bg-zinc-900"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className={`text-[8.5px] ${isActive ? "text-cyan-400 font-bold" : "text-zinc-600"}`}>
                              {item.db}
                            </span>
                            <span className="text-xs">{item.label}</span>
                          </div>
                          {isActive && (
                            <div className="w-4 h-2 bg-zinc-200 border border-black rounded-[1px] shadow-sm flex items-center justify-center">
                              <div className="w-full h-[1px] bg-red-600" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </nav>
                </div>

                <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-[9px]">
                  <span className="text-white">{userName}</span>
                  <span className="text-zinc-500">SN: TT-9042</span>
                </div>
              </aside>
            </div>
          )}

          {/* ========================================================================= */}
          {/* ARCHETYPE 36: THE SCANDINAVIAN BENTWOOD CURVE */}
          {/* ========================================================================= */}
          {selectedId === "alvar_aalto_bentwood" && (
            <div className="my-auto py-8">
              <aside className="w-64 bg-[#0D0B09] border border-amber-900/30 rounded-r-[36px] rounded-l-lg p-5 flex flex-col justify-between h-[490px] shadow-2xl relative text-left select-none">
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center justify-between border-b border-amber-900/30 pb-3">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-mono text-amber-300/60 uppercase tracking-widest">ARTEK 1932</span>
                      <span className="text-xs font-serif text-amber-100 tracking-wider">PAIMIO BENTWOOD</span>
                    </div>
                    <span className="text-[9px] font-mono text-amber-200/50">3000K</span>
                  </div>

                  <nav className="flex flex-col space-y-2 pt-1">
                    {navItems.map((item) => {
                      const isActive = activeNav === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setActiveNav(item.id)}
                          className={`flex items-center justify-between w-full py-2 px-3 rounded-full transition-all cursor-pointer ${
                            isActive
                              ? "bg-amber-200/15 border border-amber-300/30 text-amber-100 font-normal shadow-sm"
                              : "bg-transparent border border-transparent text-amber-200/40 hover:text-amber-100 hover:bg-amber-900/20"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-amber-200/60">{item.icon}</span>
                            <span className="text-xs font-serif tracking-wide">{item.label}</span>
                          </div>
                          {isActive && <div className="w-1.5 h-1.5 rounded-full bg-amber-300 shadow-[0_0_6px_#fde68a]" />}
                        </button>
                      );
                    })}
                  </nav>
                </div>

                <div className="pt-3 border-t border-amber-900/30 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs font-serif text-amber-100">{userName}</span>
                    <span className="text-[9px] font-mono text-amber-300/50">{userLevel}</span>
                  </div>
                  <span className="text-[8.5px] font-serif text-amber-300/70 tracking-wider">HELSINKI</span>
                </div>
              </aside>
            </div>
          )}

          {/* ========================================================================= */}
          {/* ARCHETYPE 37: THE ZURICH HELVETICA 1957 SPECIMEN */}
          {/* ========================================================================= */}
          {selectedId === "helvetica_1957" && (
            <div className="my-auto py-8">
              <aside className="w-60 bg-[#030305] border border-white/[0.06] rounded-none p-5 flex flex-col justify-between h-[490px] text-left relative font-sans select-none">
                <div className="flex flex-col space-y-5">
                  <div className="flex flex-col space-y-1.5 border-b border-white/[0.1] pb-3">
                    <span className="text-[8.5px] font-mono tracking-[0.3em] text-white/30 uppercase">
                      ZÜRICH // SPECIMEN 1957
                    </span>
                    <h1 className="text-sm font-normal tracking-[0.18em] text-white uppercase">
                      CELAEST
                    </h1>
                  </div>

                  <nav className="flex flex-col space-y-3 pt-1">
                    {navItems.map((item) => {
                      const isActive = activeNav === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setActiveNav(item.id)}
                          className={`flex items-center justify-between w-full py-1 text-left transition-all cursor-pointer ${
                            isActive
                              ? "text-white font-semibold"
                              : "text-white/35 hover:text-white/75 font-normal"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-[9.5px] font-mono text-white/30 tracking-tight">
                              {item.num}
                            </span>
                            <span className="text-xs uppercase tracking-[0.14em]">
                              {item.label}
                            </span>
                          </div>
                          {isActive && (
                            <span className="w-1.5 h-1.5 bg-white shrink-0 shadow-sm" />
                          )}
                        </button>
                      );
                    })}
                  </nav>
                </div>

                <div className="pt-4 border-t border-white/[0.1] flex flex-col space-y-1">
                  <span className="text-[8.5px] font-mono tracking-widest text-white/30 uppercase">
                    NEUE HAAS GROTESK
                  </span>
                  <span className="text-xs font-light text-white tracking-wide">{userName}</span>
                  <span className="text-[9.5px] font-mono text-white/40">{userLevel}</span>
                </div>
              </aside>
            </div>
          )}

          {/* ========================================================================= */}
          {/* ARCHETYPE 38: THE PETER ZUMTHOR THERME SLATE */}
          {/* ========================================================================= */}
          {selectedId === "zumthor_therme_slate" && (
            <div className="my-auto py-8">
              <aside className="w-60 bg-[#050608] border border-stone-800/80 rounded-none p-5 flex flex-col justify-between h-[490px] shadow-2xl text-left select-none font-sans">
                <div className="flex flex-col space-y-4">
                  <div className="flex flex-col space-y-1 border-b border-stone-800 pb-3">
                    <span className="text-[9px] font-mono text-amber-500/70 uppercase tracking-[0.25em]">
                      MONOLITH // THERME
                    </span>
                    <span className="text-xs font-light text-white tracking-[0.2em] uppercase">
                      CELAEST
                    </span>
                  </div>

                  <nav className="flex flex-col space-y-2.5 pt-2">
                    {[
                      { id: "workspace", num: "01", label: "BRIEF" },
                      { id: "memory", num: "02", label: "VAULT" },
                      { id: "interview", num: "03", label: "VOICE" },
                      { id: "reading", num: "04", label: "PAGES" },
                      { id: "writing", num: "05", label: "QUILL" },
                      { id: "lab", num: "06", label: "FORGE" },
                    ].map((item) => {
                      const isActive = activeNav === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setActiveNav(item.id)}
                          className={`flex items-center justify-between w-full py-1 text-left transition-all cursor-pointer ${
                            isActive
                              ? "text-amber-300 font-medium"
                              : "text-stone-500 hover:text-stone-300 font-light"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-[9.5px] font-mono opacity-40">{item.num}</span>
                            <span className="text-xs tracking-[0.18em] uppercase">
                              {item.label}
                            </span>
                          </div>
                          {isActive && (
                            <span className="text-amber-400 text-sm font-light leading-none">—</span>
                          )}
                        </button>
                      );
                    })}
                  </nav>
                </div>

                <div className="pt-3 border-t border-stone-800 flex flex-col space-y-1 text-left">
                  <span className="text-[8.5px] font-mono text-stone-600 uppercase tracking-widest">
                    OCCUPANT
                  </span>
                  <span className="text-xs font-light text-white truncate">{userName}</span>
                  <span className="text-[9px] font-mono text-amber-400/70">{userLevel}</span>
                </div>
              </aside>
            </div>
          )}

          {/* ========================================================================= */}
          {/* ARCHETYPE 39: THE AMSTERDAM CROUWEL 1968 GRID */}
          {/* ========================================================================= */}
          {selectedId === "wim_crouwel_1968" && (
            <div className="my-auto py-8">
              <aside className="w-60 bg-[#080A0F] border border-slate-700/50 rounded-none p-5 flex flex-col justify-between h-[490px] shadow-2xl text-left select-none font-mono">
                <div className="flex flex-col space-y-4">
                  <div className="flex flex-col space-y-1 border-b border-slate-700/60 pb-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] uppercase tracking-widest text-slate-400">
                        TOTAL DESIGN
                      </span>
                      <span className="text-[8.5px] text-slate-500">1968</span>
                    </div>
                    <span className="text-xs font-bold tracking-[0.2em] text-white uppercase">
                      GRID X:04 Y:12
                    </span>
                  </div>

                  <nav className="flex flex-col space-y-1.5 pt-1">
                    {navItems.map((item, idx) => {
                      const isActive = activeNav === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setActiveNav(item.id)}
                          className={`flex items-center justify-between w-full py-1.5 px-2.5 transition-all cursor-pointer ${
                            isActive
                              ? "bg-slate-800 text-white font-medium border-l-2 border-slate-400"
                              : "bg-transparent text-slate-500 hover:text-slate-300 hover:bg-white/[0.02]"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="text-[9px] opacity-50">{`[ 0${idx + 1} ]`}</span>
                            <span className="text-xs uppercase tracking-wider">{item.label}</span>
                          </div>
                          {isActive && (
                            <span className="text-[8px] tracking-widest text-slate-400">COORD</span>
                          )}
                        </button>
                      );
                    })}
                  </nav>
                </div>

                <div className="pt-3 border-t border-slate-700/60 flex flex-col space-y-1">
                  <span className="text-[8.5px] uppercase tracking-widest text-slate-500">
                    STEDELIJK MUSEUM // AMS
                  </span>
                  <span className="text-xs text-white truncate">{userName}</span>
                  <span className="text-[9px] text-slate-400">{userLevel}</span>
                </div>
              </aside>
            </div>
          )}

          {/* ========================================================================= */}
          {/* ARCHETYPE 40: THE MASSIMO VIGNELLI UNIGRID */}
          {/* ========================================================================= */}
          {selectedId === "vignelli_unigrid_1972" && (
            <div className="my-auto py-8">
              <aside className="w-60 bg-[#09090C] border-y-2 border-white/20 rounded-none p-5 flex flex-col justify-between h-[490px] shadow-2xl text-left select-none font-sans">
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center justify-between border-b-2 border-white pb-3">
                    <span className="text-xs font-bold tracking-[0.16em] text-white uppercase">
                      UNIGRID // 1972
                    </span>
                    <span className="w-4 h-4 rounded-full bg-[#991B1B] text-[9px] font-bold text-white flex items-center justify-center">
                      M
                    </span>
                  </div>

                  <nav className="flex flex-col space-y-1.5 pt-1">
                    {navItems.map((item, idx) => {
                      const isActive = activeNav === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setActiveNav(item.id)}
                          className={`flex items-center justify-between w-full py-2 px-2.5 transition-all cursor-pointer ${
                            isActive
                              ? "bg-[#991B1B] text-white font-medium shadow-sm"
                              : "bg-transparent text-white/45 hover:text-white hover:bg-white/[0.03]"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-4 h-4 rounded-full border border-current flex items-center justify-center text-[9px] font-mono shrink-0">
                              {idx + 1}
                            </span>
                            <span className="text-xs uppercase tracking-[0.12em] font-normal">
                              {item.label}
                            </span>
                          </div>
                          {isActive && (
                            <span className="text-[9px] font-mono tracking-widest text-white/80">LINE</span>
                          )}
                        </button>
                      );
                    })}
                  </nav>
                </div>

                <div className="pt-3 border-t-2 border-white flex flex-col space-y-1">
                  <span className="text-[8.5px] font-mono tracking-widest text-white/40 uppercase">
                    NYC STANDARDS MANUAL
                  </span>
                  <span className="text-xs font-bold text-white uppercase">{userName}</span>
                  <span className="text-[9px] font-mono text-white/50">{userLevel}</span>
                </div>
              </aside>
            </div>
          )}

          {/* ========================================================================= */}
          {/* ARCHETYPE 41: THE PAUL RAND MODERNIST HARMONY */}
          {/* ========================================================================= */}
          {selectedId === "paul_rand_modernism" && (
            <div className="my-auto py-8">
              <aside className="w-60 bg-[#0B0B0E] border-l-2 border-[#9A3412] rounded-none p-5 flex flex-col justify-between h-[490px] shadow-2xl text-left select-none font-sans">
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3.5 h-3.5 rounded-full bg-[#9A3412]" />
                      <span className="text-xs font-bold tracking-[0.15em] text-white uppercase">
                        RAND // 1960
                      </span>
                    </div>
                    <span className="text-[9px] font-mono text-stone-500">CORP</span>
                  </div>

                  <nav className="flex flex-col space-y-2 pt-1">
                    {navItems.map((item) => {
                      const isActive = activeNav === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setActiveNav(item.id)}
                          className={`flex items-center justify-between w-full py-1.5 px-2 transition-all cursor-pointer ${
                            isActive
                              ? "text-white font-medium border-l-2 border-[#9A3412] pl-3 -ml-[2px]"
                              : "text-stone-500 hover:text-stone-300 font-light"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] text-stone-600 font-mono">{item.num}</span>
                            <span className="text-xs uppercase tracking-[0.14em]">{item.label}</span>
                          </div>
                          {isActive && (
                            <span className="w-1.5 h-1.5 bg-[#9A3412]" />
                          )}
                        </button>
                      );
                    })}
                  </nav>
                </div>

                <div className="pt-3 border-t border-stone-800 flex flex-col space-y-1">
                  <span className="text-[8.5px] font-mono tracking-widest text-stone-500 uppercase">
                    FORM + CONTENT
                  </span>
                  <span className="text-xs font-medium text-stone-200">{userName}</span>
                  <span className="text-[9px] font-mono text-stone-500">{userLevel}</span>
                </div>
              </aside>
            </div>
          )}

          {/* ========================================================================= */}
          {/* ARCHETYPE 42: THE JIL SANDER PURE CASHMERE */}
          {/* ========================================================================= */}
          {selectedId === "jil_sander_minimal" && (
            <div className="my-auto py-8">
              <aside className="w-56 bg-[#020204] border-r border-white/[0.04] rounded-none p-5 flex flex-col justify-between h-[490px] text-left select-none font-sans">
                <div className="flex flex-col space-y-6">
                  <div className="flex flex-col space-y-1 border-b border-white/[0.04] pb-3">
                    <span className="text-[8px] font-light tracking-[0.35em] text-white/30 uppercase">
                      MILANO // AUTUMN
                    </span>
                    <span className="text-[11px] font-light tracking-[0.25em] text-white uppercase">
                      JIL SANDER
                    </span>
                  </div>

                  <nav className="flex flex-col space-y-4 pt-1">
                    {navItems.map((item) => {
                      const isActive = activeNav === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setActiveNav(item.id)}
                          className={`flex items-center justify-between w-full py-0.5 text-left transition-all cursor-pointer ${
                            isActive
                              ? "text-white font-normal"
                              : "text-white/30 hover:text-white/60 font-light"
                          }`}
                        >
                          <span className="text-[11px] uppercase tracking-[0.22em]">
                            {item.label}
                          </span>
                          {isActive && (
                            <span className="w-1 h-1 rounded-full bg-stone-200" />
                          )}
                        </button>
                      );
                    })}
                  </nav>
                </div>

                <div className="pt-4 border-t border-white/[0.04] flex flex-col space-y-1">
                  <span className="text-[8px] font-light tracking-[0.3em] text-white/20 uppercase">
                    OCCUPANT
                  </span>
                  <span className="text-xs font-light text-white/80 tracking-wide">{userName}</span>
                  <span className="text-[9px] font-mono text-white/30">{userLevel}</span>
                </div>
              </aside>
            </div>
          )}

          {/* ========================================================================= */}
          {/* ARCHETYPE 43: THE MIES VAN DER ROHE STEEL COLUMN */}
          {/* ========================================================================= */}
          {selectedId === "mies_nationalgalerie" && (
            <div className="my-auto py-8">
              <aside className="w-60 bg-[#070709] border-x border-white/20 rounded-none p-5 flex flex-col justify-between h-[490px] shadow-2xl text-left select-none font-sans">
                <div className="flex flex-col space-y-4">
                  <div className="flex flex-col space-y-1 border-b-2 border-white pb-3">
                    <span className="text-[8.5px] font-mono tracking-[0.3em] text-zinc-400 uppercase">
                      MIES // 1968
                    </span>
                    <span className="text-xs font-bold tracking-[0.2em] text-white uppercase">
                      NEUE NATIONALGALERIE
                    </span>
                  </div>

                  <nav className="flex flex-col space-y-2 pt-1">
                    {navItems.map((item) => {
                      const isActive = activeNav === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setActiveNav(item.id)}
                          className={`flex items-center justify-between w-full py-1.5 px-2 transition-all cursor-pointer ${
                            isActive
                              ? "text-white font-medium border-l-2 border-white pl-3 -ml-[2px]"
                              : "text-zinc-400 hover:text-white font-normal"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-[9.5px] font-mono opacity-50">{item.num}</span>
                            <span className="text-xs uppercase tracking-[0.15em]">{item.label}</span>
                          </div>
                          {isActive && <span className="w-1.5 h-1.5 bg-white shrink-0" />}
                        </button>
                      );
                    })}
                  </nav>
                </div>

                <div className="pt-3 border-t-2 border-white flex flex-col space-y-1">
                  <span className="text-[8.5px] font-mono tracking-widest text-zinc-400 uppercase">
                    BERLIN // STAHL
                  </span>
                  <span className="text-xs font-bold text-white uppercase">{userName}</span>
                  <span className="text-[9px] font-mono text-zinc-400">{userLevel}</span>
                </div>
              </aside>
            </div>
          )}

          {/* ========================================================================= */}
          {/* ARCHETYPE 44: THE BRAUN SK4 PHONOSUPER "SNOW WHITE" */}
          {/* ========================================================================= */}
          {selectedId === "braun_sk4_snow_white" && (
            <div className="my-auto py-8">
              <aside className="w-60 bg-[#0B0D11] border border-zinc-700/70 rounded-none p-5 flex flex-col justify-between h-[490px] shadow-2xl text-left select-none font-sans">
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center justify-between border-b border-zinc-700/60 pb-3">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-mono tracking-[0.25em] text-zinc-400 uppercase">
                        RAMS & GUGELOT
                      </span>
                      <span className="text-xs font-bold tracking-[0.18em] text-white uppercase">
                        BRAUN SK4
                      </span>
                    </div>
                    {/* Acrylic needle tone indicator */}
                    <div className="w-3 h-0.5 bg-amber-400 shadow-sm" />
                  </div>

                  <nav className="flex flex-col space-y-2 pt-1">
                    {navItems.map((item) => {
                      const isActive = activeNav === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setActiveNav(item.id)}
                          className={`flex items-center justify-between w-full py-1.5 px-2.5 transition-all cursor-pointer ${
                            isActive
                              ? "text-white font-medium border-l-2 border-amber-400 pl-3 -ml-[2px]"
                              : "text-zinc-400 hover:text-white font-light"
                          }`}
                        >
                          <span className="text-xs uppercase tracking-[0.16em]">{item.label}</span>
                          {isActive && (
                            <span className="text-[9px] font-mono text-amber-400 font-bold">33 RPM</span>
                          )}
                        </button>
                      );
                    })}
                  </nav>
                </div>

                <div className="pt-3 border-t border-zinc-700/60 flex flex-col space-y-1">
                  <span className="text-[8.5px] font-mono tracking-widest text-zinc-500 uppercase">
                    FRANKFURT // 1956
                  </span>
                  <span className="text-xs font-medium text-zinc-200">{userName}</span>
                  <span className="text-[9px] font-mono text-zinc-400">{userLevel}</span>
                </div>
              </aside>
            </div>
          )}

          {/* ========================================================================= */}
          {/* ARCHETYPE 45: THE OTL AICHER MUNICH OLYMPIC GRID */}
          {/* ========================================================================= */}
          {selectedId === "otl_aicher_1972" && (
            <div className="my-auto py-8">
              <aside className="w-60 bg-[#04060A] border-2 border-white rounded-none p-5 flex flex-col justify-between h-[490px] shadow-2xl text-left select-none font-sans">
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center justify-between border-b-2 border-white pb-3">
                    <span className="text-xs font-bold tracking-[0.2em] text-white uppercase">
                      MÜNCHEN 1972
                    </span>
                    <span className="w-4 h-4 bg-white text-black font-bold text-[9px] flex items-center justify-center font-mono">
                      72
                    </span>
                  </div>

                  <nav className="flex flex-col space-y-1.5 pt-1">
                    {navItems.map((item, idx) => {
                      const isActive = activeNav === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setActiveNav(item.id)}
                          className={`flex items-center justify-between w-full py-2 px-2.5 transition-all cursor-pointer ${
                            isActive
                              ? "bg-white text-black font-bold shadow-sm"
                              : "bg-transparent text-zinc-300 hover:text-white hover:bg-white/[0.04]"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-[9.5px] font-mono font-bold opacity-70">
                              {`0${idx + 1}`}
                            </span>
                            <span className="text-xs uppercase tracking-[0.14em]">{item.label}</span>
                          </div>
                          {isActive && (
                            <span className="text-[8.5px] font-mono tracking-widest uppercase font-bold">
                              SYS
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </nav>
                </div>

                <div className="pt-3 border-t-2 border-white flex flex-col space-y-1">
                  <span className="text-[8.5px] font-mono tracking-widest text-zinc-400 uppercase">
                    SYSTEM SIGNALETIK // ULM
                  </span>
                  <span className="text-xs font-bold text-white uppercase">{userName}</span>
                  <span className="text-[9px] font-mono text-zinc-300">{userLevel}</span>
                </div>
              </aside>
            </div>
          )}

          {/* ========================================================================= */}
          {/* ARCHETYPE 46: THE WALTER GROPIUS FAGUS-WERK CURTAIN WALL */}
          {/* ========================================================================= */}
          {selectedId === "gropius_fagus_werk" && (
            <div className="my-auto py-8">
              <aside className="w-60 bg-[#030406] border border-white/[0.1] rounded-none p-5 flex flex-col justify-between h-[490px] shadow-2xl text-left select-none font-sans">
                <div className="flex flex-col space-y-4">
                  <div className="flex flex-col space-y-1 border-b border-white/[0.1] pb-3">
                    <span className="text-[8.5px] font-mono tracking-[0.3em] text-zinc-400 uppercase">
                      GROPIUS & MEYER
                    </span>
                    <span className="text-xs font-normal tracking-[0.22em] text-white uppercase">
                      FAGUS-WERK 1911
                    </span>
                  </div>

                  <nav className="flex flex-col space-y-2.5 pt-1">
                    {navItems.map((item) => {
                      const isActive = activeNav === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setActiveNav(item.id)}
                          className={`flex items-center justify-between w-full py-1 text-left transition-all cursor-pointer ${
                            isActive
                              ? "text-white font-medium"
                              : "text-zinc-400 hover:text-white font-light"
                          }`}
                        >
                          <span className="text-xs uppercase tracking-[0.16em]">{item.label}</span>
                          {isActive && <span className="text-xs font-mono text-white/80">=</span>}
                        </button>
                      );
                    })}
                  </nav>
                </div>

                <div className="pt-3 border-t border-white/[0.1] flex flex-col space-y-1">
                  <span className="text-[8.5px] font-mono tracking-widest text-zinc-500 uppercase">
                    ALFELD // UNESCO
                  </span>
                  <span className="text-xs font-light text-white tracking-wide">{userName}</span>
                  <span className="text-[9px] font-mono text-zinc-400">{userLevel}</span>
                </div>
              </aside>
            </div>
          )}

          {/* ========================================================================= */}
          {/* ARCHETYPE 47: THE ENZO MARI AUTOPROGETTAZIONE 1974 */}
          {/* ========================================================================= */}
          {selectedId === "enzo_mari_autoprogettazione" && (
            <div className="my-auto py-8">
              <aside className="w-60 bg-[#090807] border-l-2 border-stone-600 rounded-none p-5 flex flex-col justify-between h-[490px] shadow-2xl text-left select-none font-sans">
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center justify-between border-b border-stone-700 pb-3">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-mono tracking-[0.2em] text-stone-400 uppercase">
                        ENZO MARI // MILANO
                      </span>
                      <span className="text-xs font-bold tracking-[0.15em] text-stone-100 uppercase">
                        AUTOPROGETTAZIONE
                      </span>
                    </div>
                    {/* Nailhead registration mark */}
                    <span className="text-stone-500 text-xs font-mono">+</span>
                  </div>

                  <nav className="flex flex-col space-y-2 pt-1">
                    {navItems.map((item) => {
                      const isActive = activeNav === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setActiveNav(item.id)}
                          className={`flex items-center justify-between w-full py-1.5 px-2 transition-all cursor-pointer ${
                            isActive
                              ? "text-stone-100 font-medium border border-stone-500 bg-stone-900/60"
                              : "text-stone-400 hover:text-stone-100 font-normal"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="text-[9px] font-mono opacity-50">{item.num}</span>
                            <span className="text-xs uppercase tracking-[0.14em]">{item.label}</span>
                          </div>
                          {isActive && <span className="text-[9px] font-mono text-stone-300">TAG</span>}
                        </button>
                      );
                    })}
                  </nav>
                </div>

                <div className="pt-3 border-t border-stone-700 flex flex-col space-y-1">
                  <span className="text-[8.5px] font-mono tracking-widest text-stone-500 uppercase">
                    PROPOSTA // 1974
                  </span>
                  <span className="text-xs font-medium text-stone-200">{userName}</span>
                  <span className="text-[9px] font-mono text-stone-400">{userLevel}</span>
                </div>
              </aside>
            </div>
          )}

          {/* ========================================================================= */}
          {/* ARCHETYPE 48: THE SANAA TRANSLUCENT MEMBRANE */}
          {/* ========================================================================= */}
          {selectedId === "sanaa_translucent_membrane" && (
            <div className="my-auto py-8">
              <aside className="w-60 bg-[#020305] border border-white/[0.08] rounded-none p-5 flex flex-col justify-between h-[490px] shadow-2xl text-left select-none font-sans">
                <div className="flex flex-col space-y-5">
                  <div className="flex flex-col space-y-1 border-b border-white/[0.06] pb-3">
                    <span className="text-[8px] font-light tracking-[0.35em] text-zinc-400 uppercase">
                      SEJIMA & NISHIZAWA
                    </span>
                    <span className="text-[11px] font-light tracking-[0.24em] text-white uppercase">
                      SANAA // KANAZAWA
                    </span>
                  </div>

                  <nav className="flex flex-col space-y-3 pt-1">
                    {navItems.map((item) => {
                      const isActive = activeNav === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setActiveNav(item.id)}
                          className={`flex items-center justify-between w-full py-1 text-left transition-all cursor-pointer ${
                            isActive
                              ? "text-white font-normal bg-white/[0.06] px-2.5 rounded-none"
                              : "text-zinc-400 hover:text-white font-light px-2.5"
                          }`}
                        >
                          <span className="text-[11px] uppercase tracking-[0.2em]">{item.label}</span>
                          {isActive && <span className="w-1 h-1 rounded-full bg-white shadow-sm" />}
                        </button>
                      );
                    })}
                  </nav>
                </div>

                <div className="pt-3 border-t border-white/[0.06] flex flex-col space-y-1">
                  <span className="text-[8px] font-light tracking-[0.3em] text-zinc-500 uppercase">
                    INMATERIAL MEMBRANE
                  </span>
                  <span className="text-xs font-light text-white/90">{userName}</span>
                  <span className="text-[9px] font-mono text-zinc-400">{userLevel}</span>
                </div>
              </aside>
            </div>
          )}
        </div>

        {/* Right: Architecture & Craft Breakdown (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6 p-6 sm:p-8 bg-[#020205] border border-white/[0.06] rounded-3xl relative">
          <div className="flex flex-col space-y-5">
            <div className="flex flex-col space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">
                Paradigma {activeArchetype.index} de {ARCHETYPES.length}
              </span>
              <h3 className="text-xl font-light text-white tracking-tight">
                {activeArchetype.name}
              </h3>
              <p className="text-xs font-light text-white/40 leading-relaxed">
                {activeArchetype.description}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex flex-col space-y-2">
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="text-white/40 uppercase">Silueta:</span>
                <span className="text-white/70 truncate max-w-[210px] text-right">{activeArchetype.silhouette}</span>
              </div>
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="text-white/40 uppercase">Referentes:</span>
                <span className="text-white/70 truncate max-w-[210px] text-right">{activeArchetype.inspiration}</span>
              </div>
              {activeArchetype.material && (
                <div className="flex items-center justify-between text-[10px] font-mono pt-1.5 border-t border-white/[0.04]">
                  <span className="text-white/40 uppercase">Material / PVD:</span>
                  <span className="text-emerald-400 truncate max-w-[210px] text-right">{activeArchetype.material}</span>
                </div>
              )}
              {activeArchetype.hairline && (
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="text-white/40 uppercase">Tolerancia Hairline:</span>
                  <span className="text-white/70">{activeArchetype.hairline}</span>
                </div>
              )}
              {activeArchetype.opticalRatio && (
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="text-white/40 uppercase">Relación Óptica:</span>
                  <span className="text-white/70">{activeArchetype.opticalRatio}</span>
                </div>
              )}
            </div>

            <div className="flex flex-col space-y-2 text-xs">
              <span className="text-[10px] font-mono uppercase tracking-widest text-white/30">
                Innovaciones Clave de este Paradigma:
              </span>
              {activeArchetype.highlights.map((h: string, i: number) => (
                <div key={i} className="flex items-start gap-2.5">
                  <span className="w-1 h-1 rounded-full bg-white/50 mt-1.5 shrink-0" />
                  <span className="text-white/70 font-light leading-relaxed">{h}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col space-y-2 p-3 rounded-2xl bg-black/40 border border-white/[0.05]">
              <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest">
                Personalizar Nombre
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="flex-1 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/10 text-white text-xs placeholder:text-white/20 focus:outline-none focus:border-white/30"
                />
                <input
                  type="text"
                  value={userLevel}
                  onChange={(e) => setUserLevel(e.target.value)}
                  className="w-28 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/10 text-white text-xs placeholder:text-white/20 focus:outline-none focus:border-white/30"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/[0.06] flex flex-col space-y-2">
            <button
              type="button"
              onClick={() => handleApplyToLiveSidebar(activeArchetype)}
              className="w-full py-3.5 px-6 rounded-2xl bg-white text-black font-medium text-xs tracking-wide hover:bg-white/90 active:scale-[0.99] transition-all cursor-pointer shadow-[0_0_30px_rgba(255,255,255,0.15)] flex items-center justify-center gap-2"
            >
              <span>Activar Paradigma "{activeArchetype.name}" en Sidenav Real</span>
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </button>
            <span className="text-[10px] text-center text-white/30 font-mono">
              Aplica instantáneamente esta configuración al sidebar principal de la aplicación
            </span>
          </div>
        </div>
      </div>

      {/* Side-by-Side Architectural Gallery (All Paradigms Together) */}
      <div className="flex flex-col space-y-3 pt-4 border-t border-white/[0.06] z-10">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">
            Galería Comparativa de los {ARCHETYPES.length} Paradigmas de Alta Precisión
          </span>
          <span className="text-[10px] font-mono text-white/30">Clic para previsualizar o activar</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {ARCHETYPES.map((a) => {
            const isSelected = selectedId === a.id;
            return (
              <div
                key={a.id}
                onClick={() => handleApplyToLiveSidebar(a)}
                className={`flex flex-col justify-between p-3.5 rounded-2xl transition-all duration-300 cursor-pointer group/card ${
                  isSelected
                    ? "bg-[#060712] border border-white/25 shadow-[0_8px_30px_rgba(0,0,0,0.85)]"
                    : "bg-white/[0.015] border border-white/[0.05] hover:border-white/12 hover:bg-white/[0.025]"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono text-white/40">#{a.index}</span>
                  {isSelected ? (
                    <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-full border border-emerald-500/20">
                      Activo
                    </span>
                  ) : (
                    <span className="text-[9px] font-mono text-white/30 group-hover/card:text-white/60">
                      Ver
                    </span>
                  )}
                </div>

                <span className="text-xs font-medium text-white line-clamp-1">{a.name}</span>
                <span className="text-[9px] font-mono text-white/30 line-clamp-1 mt-0.5">{a.silhouette.split(" ")[0]}</span>

                <div className="mt-2.5 pt-1.5 border-t border-white/[0.03] text-[9.5px] font-mono text-white/30 truncate">
                  {a.inspiration.split("+")[0].trim()}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const GridIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
  </svg>
);
