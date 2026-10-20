# ROL Y OBJETIVO
Actúa como un Arquitecto de Software Senior y Desarrollador Full-Stack / Frontend especialista en UI/UX automotriz. Tu objetivo es construir una aplicación web interactiva, completa y funcional (Beta de testeo / MVP) para la "Gestión Integral de Vehículos, Control de Combustible (Nafta) y Mantenimiento Preventivo Bimodal".

La aplicación debe funcionar como una Single Page Application (SPA) o Progressive Web App (PWA) responsive (diseño adaptable a escritorio para análisis de matrices y a móvil para simular la carga en estaciones de servicio), con persistencia de datos en `localStorage` y datos de prueba precargados (Seed Data) para poder testear todas las fórmulas desde el segundo cero.

---

# 1. STACK TECNOLÓGICO REQUERIDO
- **Framework:** React (Vite / Next.js) con TypeScript o JavaScript moderno (ES6+).
- **Estilos:** Tailwind CSS (estética moderna tipo "Tablero Digital Automotriz", modo oscuro/claro, alto contraste, tarjetas limpias).
- **Iconografía:** Lucide React.
- **Gráficos:** Recharts o Chart.js (o gráficos SVG nativos limpios) para visualizar la evolución de consumo y gasto mensual.
- **Estado y Persistencia:** React State (`useState`, `useEffect`, `useMemo`) sincronizado automáticamente con `localStorage`. Incluir un botón "Restaurar Datos de Prueba (Demo)" y "Limpiar Base de Datos".

---

# 2. MÓDULOS Y FUNCIONALIDADES DEL SISTEMA

## Módulo 1: Garaje y Selector de Vehículo (Header Global)
- Permitir seleccionar el vehículo activo o agregar uno nuevo.
- **Campos del Vehículo:** ID, Marca, Modelo, Año, Patente, Tipo de Combustible (Nafta, Diésel, GNC, Híbrido), Capacidad del Tanque (Litros), Tipo de Distribución (Correa vs. Cadena), Odómetro Inicial (km), Odómetro Actual (km) y Fecha de Alta.

## Módulo 2: Registro Inteligente de Combustible (Cargas de Nafta)
Formulario ágil con validaciones estrictas:
- **Campos:** Fecha, Odómetro Actual (debe validar que sea estrictamente mayor al odómetro anterior), Litros Cargados, Costo Total (\$), Costo por Litro (calculado automáticamente o viceversa), Tipo de Ruta (Ciudad, Ruta, Mixto) y **Switch clave: "¿Tanque Lleno al 100%?"** (`isFullTank: boolean`).
- **Algoritmo de Consumo con Soporte de Cargas Parciales (CRÍTICO):**
  - Si `isFullTank === false`, la carga suma litros y dinero a la matriz mensual, pero su rendimiento individual queda en estado `"Acumulando (Carga Parcial)"`.
  - Si `isFullTank === true`, el sistema busca hacia atrás el último registro donde `isFullTank === true`, resta ambos odómetros ($\Delta \text{Km}$) y lo divide por la suma de los litros de la carga actual más todas las cargas parciales intermedias ($\sum \text{Litros}$). Así obtiene el rendimiento exacto en $\text{km/l}$ y $\text{l/100km}$.

## Módulo 3: Matriz Mensual de Rendimiento y Costos
Tabla avanzada y tarjetas de resumen agrupadas por `Mes/Año`:
- **Columnas de la Matriz:**
  1. Período (Mes/Año)
  2. Km Recorridos en el mes
  3. Litros Totales Consumidos
  4. Gasto Total en Combustible (\$)
  5. Costo promedio por Kilómetro (\$/km)
  6. Rendimiento Promedio (km/l)
  7. Variación porcentual de eficiencia vs. el mes anterior (con indicador visual verde/rojo si mejoró o empeoró el consumo).
  8. Diagnóstico automático: Si el rendimiento cae más de un 15% respecto al promedio histórico del auto, mostrar una alerta amarilla: *"Anomalía de consumo detectada: Revisar presión de neumáticos, filtro de aire o inyección"*.

## Módulo 4: Simulador de Telemetría y Ritmo Diario (API Web Geolocation + Simulador)
Como es una Beta Web de testeo, necesitamos una sección interactiva llamada **"Telemetría & Ritmo de Uso"**:
- Calcular automáticamente el **Ritmo Diario Histórico ($\text{km/día}$)** basado en las fechas y odómetros de las cargas de nafta.
- **Simulador de Movimiento / GPS:** Un panel de testeo donde el usuario pueda:
  1. Usar la **Web Geolocation API (`navigator.geolocation`)** para capturar un viaje en tiempo real o simular un trayecto con un deslizador ("Simular viaje de X km hoy").
  2. Este kilometraje virtual se suma a un **"Odómetro Estimado por Telemetría"**.
  3. Cuando el usuario registra una nueva carga de nafta real con el odómetro del tablero, el sistema recalibra automáticamente el odómetro estimado y muestra el margen de error de la telemetría.

## Módulo 5: Planificador de Services (Motor Preventivo Bimodal)
Sistema de semáforo (Verde = OK, Amarillo = Próximo a vencer, Rojo = Vencido) para ítems de mantenimiento configurados según el vehículo:
- **Ítems base:** Cambio de Aceite y Filtros (10.000 km o 365 días), Kit de Distribución (60.000 km o 1460 días si es correa / 120.000 km si es cadena), Rotación y Alineación (10.000 km o 180 días), Líquido de Frenos (40.000 km o 730 días), Pastillas de Freno (30.000 km).
- **Cálculo Dual (Lo que ocurra primero):**
  - `% Desgaste por Km` = `(Odómetro Actual - Odómetro Último Service) / Intervalo Km`
  - `% Desgaste por Tiempo` = `(Días desde Último Service) / Intervalo Días`
  - **Proyección Inteligente:** Usando el `Ritmo Diario (km/día)`, mostrar cuántos días exactos faltan para alcanzar el límite de kilómetros (ej. *"Al ritmo actual de 42 km/día, alcanzarás el límite de kilómetros en 18 días"*).
- Botón **"Registrar Service Realizado"** para reiniciar el contador de un ítem, guardando fecha, odómetro, costo y notas en el historial clínico del auto.

---

# 3. DATOS DE PRUEBA OBLIGATORIOS (SEED DATA)
Al iniciar la app por primera vez, carga automáticamente un vehículo de ejemplo (ej. *Toyota Corolla 2.0 XEI - 2022* o *VW Amarok / Peugeot 208*) con:
- **6 meses de historial de cargas de nafta** (incluyendo al menos 12 cargas: algunas de tanque lleno y un par de cargas parciales intermedias para demostrar que el algoritmo de agrupación funciona).
- **3 mantenimientos históricos cargados** de forma tal que hoy: 1 service esté en estado **Verde (OK)**, 1 esté en **Amarillo (Atención: faltan < 800 km)** y 1 esté en **Rojo (Vencido por tiempo o km)**.

---

# 4. ESTRUCTURA VISUAL (UI/UX)
Organiza la interfaz con una barra lateral (Sidebar en desktop / Bottom Nav en móvil) con 4 vistas claras:
1. **Dashboard General:** KPIs principales (Km/L promedio, \$/Km actual, Gasto del mes, Odómetro Estimado en vivo) + Alertas activas de Service + Botón de acción rápida "+ Cargar Nafta".
2. **Combustible y Matriz Mensual:** Formulario rápido de carga, Tabla de Matriz Mensual comparativa, Gráfico de evolución e Historial detallado carga por carga.
3. **Mantenimiento (Services):** Tarjetas con barras de progreso duales (Km vs. Tiempo), proyecciones según ritmo diario y bitácora de talleres.
4. **Simulador de Telemetría / Configuración:** Panel para probar el ritmo diario, simular viajes por GPS, ver la recalibración del odómetro y gestionar los datos de prueba.

Entrega el código completo, limpio, modular y listo para ejecutarse sin errores ni dependencias faltantes.