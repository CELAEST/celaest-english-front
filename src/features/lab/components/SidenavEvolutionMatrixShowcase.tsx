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
  | "teenage_engineering_tp7";

export type SidenavCategory = "all" | "floating" | "editorial" | "hardware" | "structural";

interface ArchetypeMeta {
  id: SidenavArchetypeId;
  index: string;
  name: string;
  subtitle: string;
  silhouette: string;
  inspiration: string;
  description: string;
  accent: string;
  category: "floating" | "editorial" | "hardware" | "structural";
  highlights: string[];
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
      if (archetype.id === "swiss_editorial") mappedVariant = "atelier_minimalist";
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
      if (archetype.id === "architectural_monolith") mappedVariant = "atelier_minimalist";
      if (archetype.id === "dieter_rams_ten") mappedVariant = "atelier_minimalist";
      if (archetype.id === "leica_rangefinder") mappedVariant = "precision_chrono";
      if (archetype.id === "japanese_sensu") mappedVariant = "atelier_minimalist";
      if (archetype.id === "teenage_engineering_tp7") mappedVariant = "acoustic_resonance";

      localStorage.setItem("celaest_sidenav_variant", mappedVariant);
      window.dispatchEvent(new CustomEvent("celaest:sidenav_variant_changed", { detail: mappedVariant }));
      setNotification(`¡Paradigma "${archetype.name}" activado en el Sidenav real!`);
      setTimeout(() => setNotification(null), 3500);
    }
  };

  const [selectedCategory, setSelectedCategory] = useState<SidenavCategory>("all");

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
              Innovation Matrix · 24 Archetypes
            </span>
            <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full bg-white/[0.04] text-white/60 border border-white/[0.08]">
              Pure Craft & Precision
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-light text-white tracking-tight">
            Sidenav Architectural Paradigms & Creative Explorations
          </h2>
          <p className="text-xs sm:text-sm font-light text-white/40 max-w-3xl leading-relaxed">
            Una colección de <strong>24 conceptos estructuralmente únicos</strong> centrados en detalles de alta gama y cero clichés de IA:
            alta relojería ginebrina, monolitos de basalto de Peter Zumthor, el sistema Vitsoe 606 de Dieter Rams,
            telémetros ópticos Leica M, cintas de seda Kyoto, grabadores analógicos TP-7, columnas suizas puras,
            docks magnéticos y rieles modulares divididos.
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
                : "bg-white/[0.02] border-white/[0.06] text-white/40 hover:text-white"
            }`}
          >
            {isExpanded ? "Vista: Expandida" : "Vista: Compacta"}
          </button>
        </div>
      </div>

      {/* Category Filter Tabs (Balanced: 6 in each of the 4 disciplines) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 z-10">
        {[
          { id: "all", label: "Todos (24)" },
          { id: "editorial", label: "Editorial & Suizo (6)" },
          { id: "hardware", label: "Hardware & Mecánica (6)" },
          { id: "floating", label: "Flotantes & Docks (6)" },
          { id: "structural", label: "Estructuras & Bloques (6)" },
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

      {/* 24 Radical Paradigms Selector Grid */}
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
        <div className="lg:col-span-7 flex flex-col p-6 sm:p-8 bg-[#020205] border border-white/[0.06] rounded-3xl relative overflow-hidden min-h-[580px] justify-center items-center">
          {/* Top Label */}
          <div className="absolute top-4 left-6 right-6 flex items-center justify-between pb-3 border-b border-white/[0.05] z-10">
            <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">
              Archetype {activeArchetype.index}: {activeArchetype.name}
            </span>
            <span className="text-[10px] font-mono text-white/30">
              {activeArchetype.silhouette}
            </span>
          </div>

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
        </div>

        {/* Right: Architecture & Craft Breakdown (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6 p-6 sm:p-8 bg-[#020205] border border-white/[0.06] rounded-3xl relative">
          <div className="flex flex-col space-y-5">
            <div className="flex flex-col space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">
                Paradigma {activeArchetype.index} de 24
              </span>
              <h3 className="text-xl font-light text-white tracking-tight">
                {activeArchetype.name}
              </h3>
              <p className="text-xs font-light text-white/40 leading-relaxed">
                {activeArchetype.description}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex flex-col space-y-1.5">
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="text-white/40 uppercase">Silueta:</span>
                <span className="text-white/70">{activeArchetype.silhouette}</span>
              </div>
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="text-white/40 uppercase">Referentes:</span>
                <span className="text-white/70">{activeArchetype.inspiration}</span>
              </div>
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

      {/* Side-by-Side Architectural Gallery (All 24 Paradigms Together) */}
      <div className="flex flex-col space-y-3 pt-4 border-t border-white/[0.06] z-10">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">
            Galería Comparativa de los 24 Paradigmas
          </span>
          <span className="text-[10px] font-mono text-white/30">Clic para cambiar de concepto</span>
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
