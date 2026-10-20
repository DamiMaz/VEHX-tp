ROL
Actúa como diseñador UI/UX senior y desarrollador front-end. Diseña y construye la pantalla "Home" de una app móvil de servicio y cuidado de autos (seguimiento, mantenimiento, combustible y gastos), en formato iPhone (390×844), modo oscuro premium.

REFERENCIA VISUAL
Usa la imagen adjunta como guía de estructura, iconografía, jerarquía y estilo de tarjetas (esquinas muy redondeadas, superficies oscuras con borde sutil, iconos de línea, mucho aire). Reemplaza TODO el verde de la referencia por la paleta indicada abajo.

PALETA (obligatoria)
- River Styx      #13191F → fondo principal de la app
- Carbon Fibre    #2B2F2E → tarjetas, tiles y barra de navegación
- Afternoon Tea   #594C3D → bordes, divisores, pistas de barras de progreso, estados inactivos
- Tanned Wood     #906D4B → iconos secundarios, gráficos, acentos de apoyo
- Amber Autumn    #CA9C68 → acento principal: palabra destacada del título, botón principal, ítem activo, progreso, chips de estado, sparkline
Texto: usa un tono claro derivado de Amber (ej. #F2E6D6 para títulos, #B9AA97 para texto secundario) para garantizar contraste AA. No agregar otros colores de acento. Degradados permitidos solo entre tonos de esta paleta.

ESTRUCTURA DE LA PANTALLA (de arriba hacia abajo)
1. Barra superior: menú hamburguesa a la izquierda, campana de notificaciones a la derecha con punto indicador en Amber.
2. Título hero: "Your Car." en blanco cálido y "Smarter Every Drive." con "Smarter" en Amber. Subtítulo: "Track, manage and care for your vehicle in one place."
3. Hero de vehículo: SUV oscuro sobre carretera con montañas al atardecer, tonos entonados a la paleta (cielo en Afternoon Tea / Tanned Wood, vehículo en River Styx). Indicador de carrusel de 4 puntos (activo en Amber).
4. Tarjeta "My Vehicle": miniatura del auto, nombre "Urban X", chip de estado "All Good" (Amber con punto), kilometraje "12,480 km" y chevron a la derecha.
5. Cuatro tiles de acciones rápidas (icono de línea + etiqueta):
   - Health Check (icono pulso/ECG, Amber)
   - Fuel Tracker (surtidor, Tanned Wood)
   - Service Reminders (llave inglesa, Amber)
   - Expense Log (billetera, Tanned Wood)
6. Tarjeta "Next Service Due": "In 1,520 km · Engine Oil Change", barra de progreso (pista Afternoon Tea, relleno Amber ~70%) y botón "Book Now →" en Carbon Fibre con borde Amber.
7. Tres tarjetas métricas:
   - 15.4 Avg. Fuel km/L con mini sparkline en Amber
   - 42 hrs Drive Time This Month con mini gráfico de barras en Tanned Wood
   - 92 Drive Score con badge "Eco" y icono de hoja en Amber
8. Tab bar inferior: Home (activo, píldora Amber translúcida), Garage, Explore, Profile. Iconos de línea de 1.5 px.

SISTEMA DE DISEÑO
- Tipografía: sans geométrica moderna (Inter, Manrope o Plus Jakarta Sans). Título hero 28–32 px bold; métricas 24 px semibold; etiquetas 12–13 px.
- Radios: tarjetas 20–24 px, chips 999 px. Espaciado base de 8 px.
- Tarjetas: fondo #2B2F2E, borde 1 px #594C3D al 50 %, sombra suave interior y exterior.
- Iconografía: set de línea consistente (Lucide/Phosphor), trazo redondeado.
- Estados: hover/pressed con escala 0.97 y brillo Amber al 12 %.

ANIMACIÓN DEL VEHÍCULO (pantalla de muestra)
Hero principal:
1. Entrada (0–1.2 s): el auto entra desde la izquierda con ease-out (cubic-bezier .22,1,.36,1), desacelerando hasta quedar centrado; las ruedas giran acorde a la velocidad y frenan al detenerse.
2. Encendido (1.2–1.8 s): los faros se encienden con un fade de luz cálida Amber y un leve destello (glow) sobre el asfalto; el reflejo en la carrocería se desplaza de adelante hacia atrás.
3. Reposo en bucle: respiración sutil del auto (translateY ±2 px, 4 s, ease-in-out), parpadeo muy suave de los faros y partículas de polvo/bruma lentas.
4. Parallax: montañas, cielo y carretera en capas con distinta velocidad (fondo 0.2×, medio 0.5×, auto 1×) al hacer scroll o inclinar el dispositivo.
5. Carrusel (swipe): el auto saliente se desliza a la izquierda con desenfoque de movimiento leve y el entrante llega desde la derecha con el mismo easing; los puntos del indicador se estiran (de círculo a píldora Amber).
Micro-animaciones:
- Tarjeta "My Vehicle": la miniatura hace un pequeño "roll-in" al cargar y el chip "All Good" pulsa suavemente cada 3 s.
- Barra de progreso del servicio: se llena desde 0 hasta 70 % en 900 ms al aparecer.
- Sparkline y barras: se dibujan de izquierda a derecha en 700 ms con retraso escalonado.
- Contadores (12,480 km, 15.4, 42, 92): cuentan desde 0 hasta su valor en 800 ms.
- Aparición de tarjetas: fade-up escalonado de 60 ms entre elementos.
- Respetar prefers-reduced-motion: desactivar parallax y bucles, dejar solo fades.

ENTREGABLES
- Código front-end responsivo (HTML/CSS/JS o React + Tailwind) con variables CSS para la paleta y animaciones con CSS/Framer Motion o Lottie.
- Componentes reutilizables: StatCard, QuickActionTile, ServiceProgressCard, VehicleHero, TabBar.
- Accesibilidad: contraste mínimo AA, áreas táctiles de 44 px, etiquetas aria en iconos.