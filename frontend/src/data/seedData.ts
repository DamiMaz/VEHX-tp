import { Vehicle, FuelLog, ServiceItem, ServiceLogRecord, DailyTripRecord } from '../types/vehicle';

export const INITIAL_VEHICLES: Vehicle[] = [
  {
    id: 'veh-001',
    brand: 'Toyota',
    model: 'Corolla 2.0 Dynamic Force XEI',
    year: 2022,
    licensePlate: 'AF 842 XP',
    fuelType: 'Nafta Súper',
    tankCapacity: 50,
    distributionType: 'Cadena',
    transmission: 'Automática',
    initialOdometer: 10000,
    currentOdometer: 17480,
    vin: '8AJBA3BE2N0194821',
    bodyType: 'sedan',
    model3dPath: '/models/sedan.glb',
    has3dAnimation: true,
    bluetoothDeviceName: 'Toyota-BT_4821',
    bluetoothDeviceId: 'bt-toyota-001',
    createdAt: '2026-04-01T08:00:00.000Z',
  },
  {
    id: 'veh-002',
    brand: 'Volkswagen',
    model: 'Amarok V6 Extreme 4x4',
    year: 2023,
    licensePlate: 'AG 319 KT',
    fuelType: 'Diésel',
    tankCapacity: 80,
    distributionType: 'Correa',
    transmission: 'Automática',
    initialOdometer: 5000,
    currentOdometer: 28350,
    vin: '8AWBA4BE3N0283419',
    bodyType: '4x4',
    model3dPath: '/models/4x4.glb',
    has3dAnimation: true,
    bluetoothDeviceName: 'Amarok-Sync_319',
    bluetoothDeviceId: 'bt-amarok-002',
    createdAt: '2026-02-15T08:00:00.000Z',
  },
  {
    id: 'veh-003',
    brand: 'Toyota',
    model: 'RAV4 Hybrid Limited AWD',
    year: 2023,
    licensePlate: 'AF 620 HY',
    fuelType: 'Híbrido',
    tankCapacity: 55,
    distributionType: 'Cadena',
    transmission: 'Automática',
    initialOdometer: 8000,
    currentOdometer: 22400,
    vin: '8AJBA2BE1N0391823',
    bodyType: 'suv',
    model3dPath: '/models/suv.glb',
    has3dAnimation: true,
    bluetoothDeviceName: 'RAV4-CarPlay_620',
    bluetoothDeviceId: 'bt-rav4-003',
    createdAt: '2026-01-10T08:00:00.000Z',
  },
  {
    id: 'veh-004',
    brand: 'Ford',
    model: 'Ranger Raptor 4x4 V6',
    year: 2024,
    licensePlate: 'AG 550 RP',
    fuelType: 'Nafta Premium',
    tankCapacity: 80,
    distributionType: 'Cadena',
    transmission: 'Automática',
    initialOdometer: 1200,
    currentOdometer: 8900,
    vin: '8AJBA5BE4N0410982',
    bodyType: '4x4',
    model3dPath: '/models/4x4.glb',
    has3dAnimation: true,
    bluetoothDeviceName: 'Ford-SYNC4_Raptor',
    bluetoothDeviceId: 'bt-raptor-004',
    createdAt: '2026-05-20T08:00:00.000Z',
  },
  {
    id: 'veh-005',
    brand: 'Fiat',
    model: 'Cronos 1.3 GSE Drive',
    year: 2023,
    licensePlate: 'AF 912 ZZ',
    fuelType: 'Nafta Súper',
    tankCapacity: 48,
    distributionType: 'Cadena',
    transmission: 'Manual',
    initialOdometer: 12000,
    currentOdometer: 21500,
    vin: '8APBA1BE9N0128491',
    bodyType: 'other',
    has3dAnimation: false, // Vehículo con ficha 2D (sin modelo 3D)
    bluetoothDeviceName: 'Fiat-Uconnect_912',
    bluetoothDeviceId: 'bt-fiat-005',
    createdAt: '2026-03-10T08:00:00.000Z',
  }
];

export const INITIAL_VEHICLE: Vehicle = INITIAL_VEHICLES[0];

// 6 Meses de cargas de combustible (Mayo 2026 a Octubre 2026) con >= 12 cargas, incluyendo parciales
export const INITIAL_FUEL_LOGS: FuelLog[] = [
  // MAYO 2026 (Mes 1: Cargas llenas base)
  {
    id: 'fuel-01',
    vehicleId: 'veh-001',
    date: '2026-05-04T08:30:00',
    odometer: 10450,
    liters: 38.5,
    totalCost: 46200,
    costPerLiter: 1200,
    isFullTank: true,
    routeType: 'Mixto',
    fuelGrade: 'Súper'
  },
  {
    id: 'fuel-02',
    vehicleId: 'veh-001',
    date: '2026-05-18T19:15:00',
    odometer: 10920,
    liters: 40.2,
    totalCost: 48240,
    costPerLiter: 1200,
    isFullTank: true,
    routeType: 'Ciudad',
    fuelGrade: 'Súper'
  },

  // JUNIO 2026 (Mes 2: Demostración de Carga Parcial intermedia)
  {
    id: 'fuel-03',
    vehicleId: 'veh-001',
    date: '2026-06-02T09:00:00',
    odometer: 11390,
    liters: 41.0,
    totalCost: 51250,
    costPerLiter: 1250,
    isFullTank: true,
    routeType: 'Ruta',
    fuelGrade: 'Súper'
  },
  {
    id: 'fuel-04',
    vehicleId: 'veh-001',
    date: '2026-06-14T17:45:00',
    odometer: 11620,
    liters: 15.0, // CARGA PARCIAL ($18.750)
    totalCost: 18750,
    costPerLiter: 1250,
    isFullTank: false, // ¡Carga Parcial sin llenar tanque!
    routeType: 'Ciudad',
    fuelGrade: 'Súper'
  },
  {
    id: 'fuel-05',
    vehicleId: 'veh-001',
    date: '2026-06-25T14:10:00',
    odometer: 12100,
    liters: 28.5, // LLENADO COMPLETO: Absorbe los 15L anteriores para calcular rendimiento exacto
    totalCost: 35625,
    costPerLiter: 1250,
    isFullTank: true,
    routeType: 'Mixto',
    fuelGrade: 'Súper'
  },

  // JULIO 2026 (Mes 3: Buen rendimiento en vacaciones de invierno / autopista)
  {
    id: 'fuel-06',
    vehicleId: 'veh-001',
    date: '2026-07-08T08:20:00',
    odometer: 12650,
    liters: 44.0,
    totalCost: 57200,
    costPerLiter: 1300,
    isFullTank: true,
    routeType: 'Ruta',
    fuelGrade: 'Súper'
  },
  {
    id: 'fuel-07',
    vehicleId: 'veh-001',
    date: '2026-07-22T18:30:00',
    odometer: 13220,
    liters: 43.5,
    totalCost: 56550,
    costPerLiter: 1300,
    isFullTank: true,
    routeType: 'Mixto',
    fuelGrade: 'Súper'
  },

  // AGOSTO 2026 (Mes 4: Otra Carga Parcial intermedia y consolidación)
  {
    id: 'fuel-08',
    vehicleId: 'veh-001',
    date: '2026-08-05T12:00:00',
    odometer: 13800,
    liters: 45.0,
    totalCost: 60750,
    costPerLiter: 1350,
    isFullTank: true,
    routeType: 'Ciudad',
    fuelGrade: 'Súper'
  },
  {
    id: 'fuel-09',
    vehicleId: 'veh-001',
    date: '2026-08-16T16:20:00',
    odometer: 14040,
    liters: 18.0, // CARGA PARCIAL
    totalCost: 24300,
    costPerLiter: 1350,
    isFullTank: false,
    routeType: 'Ciudad',
    fuelGrade: 'Súper'
  },
  {
    id: 'fuel-10',
    vehicleId: 'veh-001',
    date: '2026-08-28T20:10:00',
    odometer: 14550,
    liters: 39.0, // LLENADO COMPLETO: Liquida el tramo acumulado
    totalCost: 52650,
    costPerLiter: 1350,
    isFullTank: true,
    routeType: 'Mixto',
    fuelGrade: 'Súper'
  },

  // SEPTIEMBRE 2026 (Mes 5: Detección de merma / anomalía de consumo por presión baja de neumáticos)
  {
    id: 'fuel-11',
    vehicleId: 'veh-001',
    date: '2026-09-10T10:40:00',
    odometer: 15150,
    liters: 48.0,
    totalCost: 67200,
    costPerLiter: 1400,
    isFullTank: true,
    routeType: 'Ciudad',
    fuelGrade: 'Súper'
  },
  {
    id: 'fuel-12',
    vehicleId: 'veh-001',
    date: '2026-09-24T19:00:00',
    odometer: 15720,
    liters: 50.5, // Mayor consumo (caída > 15% km/l)
    totalCost: 70700,
    costPerLiter: 1400,
    isFullTank: true,
    routeType: 'Ciudad',
    fuelGrade: 'Súper'
  },

  // OCTUBRE 2026 (Mes 6: Mes actual - últimas cargas)
  {
    id: 'fuel-13',
    vehicleId: 'veh-001',
    date: '2026-10-02T08:15:00',
    odometer: 16350,
    liters: 45.2,
    totalCost: 65540,
    costPerLiter: 1450,
    isFullTank: true,
    routeType: 'Mixto',
    fuelGrade: 'Premium'
  },
  {
    id: 'fuel-14',
    vehicleId: 'veh-001',
    date: '2026-10-10T18:40:00',
    odometer: 17100,
    liters: 49.0,
    totalCost: 71050,
    costPerLiter: 1450,
    isFullTank: true,
    routeType: 'Mixto',
    fuelGrade: 'Premium'
  }
];

// 3 Mantenimientos Históricos con estados Verde, Amarillo y Rojo:
// Odómetro actual: 17.480 km.
export const INITIAL_SERVICES: ServiceItem[] = [
  // 1. VERDE (OK): Kit de Distribución (por cadena 120.000 km o 1825 días) -> Desgaste muy bajo (~14%)
  {
    id: 'srv-01',
    vehicleId: 'veh-001',
    name: 'Kit de Distribución (Cadena)',
    category: 'Distribución',
    intervalKm: 120000,
    intervalDays: 1825, // 5 años
    lastServiceKm: 0,
    lastServiceDate: '2024-01-15',
    cost: 185000,
    workshop: 'Concesionario Oficial Toyota',
    notes: 'Inspección de tensor hidráulico y guía de cadena',
    wearKmPercent: 15,
    wearDaysPercent: 18,
    wearTotalPercent: 18,
    status: 'ok',
    remainingKm: 102520,
    remainingDays: 820,
    projectedDaysByRhythm: 2440,
    statusMessage: 'Distribución por cadena en estado impecable'
  },

  // 2. AMARILLO (ATENCIÓN / PRÓXIMO): Cambio de Aceite y Filtros
  // Intervalo 10.000 km o 365 días. Último service en 10.000 km (2025-11-20).
  // Recorrido actual: 17.480 km -> Pasaron 7.480 km. Quedan 2.520 km o menos si ajustamos a 10.000 km,
  // Para que falten exactamente < 800 km: pongamos último service en 8.200 km -> Pasaron 9.280 km, ¡faltan 720 km! (< 800 km umbral de alerta)
  {
    id: 'srv-02',
    vehicleId: 'veh-001',
    name: 'Cambio de Aceite Sintético 0W-20 & Filtros',
    category: 'Aceite',
    intervalKm: 10000,
    intervalDays: 365,
    lastServiceKm: 8200,
    lastServiceDate: '2026-02-10',
    cost: 94000,
    workshop: 'Lubricentro Box Rápido',
    notes: 'Aceite Toyota Motor Oil 0W-20 Sintético + Filtro original Denso',
    wearKmPercent: 93,
    wearDaysPercent: 67,
    wearTotalPercent: 93,
    status: 'warning',
    remainingKm: 720, // < 800 km -> Alerta Amarilla
    remainingDays: 120,
    projectedDaysByRhythm: 17, // 720 km / ~42 km/día = 17 días
    statusMessage: 'Próximo a vencer en 720 km (~17 días al ritmo actual)'
  },

  // 3. ROJO (VENCIDO): Líquido de Frenos / Pastillas
  // Intervalo 40.000 km o 730 días (2 años). Último cambio en 2024-08-01 (> 800 días, vencido por tiempo)
  {
    id: 'srv-03',
    vehicleId: 'veh-001',
    name: 'Purga y Reemplazo de Líquido de Frenos DOT 4',
    category: 'Frenos',
    intervalKm: 40000,
    intervalDays: 730, // 2 años
    lastServiceKm: 2000,
    lastServiceDate: '2024-06-15', // Hace más de 850 días -> Vencido por degradación higroscópica
    cost: 58000,
    workshop: 'Taller Especializado Frenos Centro',
    notes: 'Comprobar punto de ebullición y humedad > 3.5%',
    wearKmPercent: 39,
    wearDaysPercent: 116,
    wearTotalPercent: 116,
    status: 'overdue', // Rojo
    remainingKm: 24520,
    remainingDays: 0,
    projectedDaysByRhythm: 0,
    statusMessage: 'VENCIDO por tiempo (+120 días). Riesgo de ebullición por humedad'
  }
];

export const SAMPLE_RECEIPT_SVG = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="520" viewBox="0 0 400 520" fill="none"><rect width="400" height="520" rx="16" fill="%23FFFFFF"/><path d="M20 20H380V500H20V20Z" stroke="%23CBD5E1" stroke-width="2" stroke-dasharray="6 6"/><text x="40" y="65" font-family="Arial" font-size="18" font-weight="bold" fill="%230F172A">COMPROBANTE FISCAL OFICIAL</text><text x="40" y="88" font-family="Arial" font-size="12" fill="%2364748B">TALLER MECÁNICO Y LUBRICENTRO AUTORIZADO</text><line x1="40" y1="105" x2="360" y2="105" stroke="%2394A3B8" stroke-width="1.5"/><text x="40" y="135" font-family="Arial" font-size="13" font-weight="bold" fill="%231E293B">FACTURA: FAC-0004-0019283</text><text x="40" y="158" font-family="Arial" font-size="11" fill="%23475569">Fecha: 10/02/2026 · CUIT: 30-71492819-3</text><text x="40" y="180" font-family="Arial" font-size="11" fill="%23475569">Vehículo: Toyota Corolla 2.0 (AF 842 XP)</text><text x="40" y="202" font-family="Arial" font-size="11" fill="%23475569">Odómetro verificado: 8.200 km</text><rect x="40" y="225" width="320" height="160" rx="10" fill="%23F8FAFC" stroke="%23E2E8F0"/><text x="55" y="255" font-family="Arial" font-size="12" font-weight="bold" fill="%230F172A">Detalle de Trabajos y Repuestos:</text><text x="55" y="285" font-family="Arial" font-size="11" fill="%23334155">• Aceite Sintético 0W-20 (4.5 L) - $48.000</text><text x="55" y="315" font-family="Arial" font-size="11" fill="%23334155">• Filtro de Aceite original Denso - $16.000</text><text x="55" y="345" font-family="Arial" font-size="11" fill="%23334155">• Filtro de Aire Motor + Mano de Obra - $24.000</text><text x="210" y="420" font-family="Arial" font-size="17" font-weight="bold" fill="%230F172A">TOTAL: $88.000</text><rect x="40" y="445" width="180" height="34" rx="8" fill="%23ECFDF5" stroke="%2310B981"/><text x="52" y="467" font-family="Arial" font-size="11" font-weight="bold" fill="%23047857">✓ SERVICE CERTIFICADO</text></svg>';

export const INITIAL_SERVICE_LOGS: ServiceLogRecord[] = [
  {
    id: 'slog-01',
    vehicleId: 'veh-001',
    serviceItemId: 'srv-02',
    serviceName: 'Cambio de Aceite Sintético & Filtros',
    date: '2026-02-10',
    odometer: 8200,
    cost: 88000,
    workshop: 'Lubricentro Box Rápido',
    invoiceNumber: 'FAC-0004-0019283',
    notes: 'Filtro de aire y habitáculo cambiados preventivamente',
    receiptFileUrl: SAMPLE_RECEIPT_SVG,
    receiptFileName: 'Factura_Service_8200km.svg',
    partsDetail: 'Aceite sintético 0W-20 Denso, Filtro de aire, Filtro de cabina',
    workshopCuit: '30-71492819-3',
    verifiedForSale: true
  },
  {
    id: 'slog-02',
    vehicleId: 'veh-001',
    serviceItemId: 'srv-03',
    serviceName: 'Revisión General y Purga DOT 4',
    date: '2024-06-15',
    odometer: 2000,
    cost: 45000,
    workshop: 'Taller Especializado Frenos Centro',
    invoiceNumber: 'FAC-0001-0008472',
    notes: 'Primer chequeo oficial de fluidos',
    receiptFileUrl: SAMPLE_RECEIPT_SVG,
    receiptFileName: 'Factura_Frenos_2000km.svg',
    partsDetail: 'Líquido de frenos Bosch DOT 4',
    workshopCuit: '30-68194012-7',
    verifiedForSale: true
  }
];

export const INITIAL_DAILY_TRIPS: DailyTripRecord[] = [
  {
    id: 'trip-01',
    vehicleId: 'veh-001',
    date: '2026-10-24',
    startTime: '08:15',
    endTime: '08:52',
    distanceKm: 22.4,
    durationMinutes: 37,
    avgSpeedKmh: 36,
    bluetoothDeviceName: 'Toyota-BT_4821'
  },
  {
    id: 'trip-02',
    vehicleId: 'veh-001',
    date: '2026-10-24',
    startTime: '18:20',
    endTime: '19:05',
    distanceKm: 24.1,
    durationMinutes: 45,
    avgSpeedKmh: 32,
    bluetoothDeviceName: 'Toyota-BT_4821'
  },
  {
    id: 'trip-03',
    vehicleId: 'veh-001',
    date: '2026-10-23',
    startTime: '09:00',
    endTime: '09:40',
    distanceKm: 18.5,
    durationMinutes: 40,
    avgSpeedKmh: 28,
    bluetoothDeviceName: 'Toyota-BT_4821'
  },
  {
    id: 'trip-04',
    vehicleId: 'veh-001',
    date: '2026-10-23',
    startTime: '13:10',
    endTime: '13:45',
    distanceKm: 15.2,
    durationMinutes: 35,
    avgSpeedKmh: 26,
    bluetoothDeviceName: 'Toyota-BT_4821'
  },
  {
    id: 'trip-05',
    vehicleId: 'veh-001',
    date: '2026-10-22',
    startTime: '07:45',
    endTime: '08:30',
    distanceKm: 32.0,
    durationMinutes: 45,
    avgSpeedKmh: 43,
    bluetoothDeviceName: 'Toyota-BT_4821'
  },
  {
    id: 'trip-06',
    vehicleId: 'veh-001',
    date: '2026-10-21',
    startTime: '10:00',
    endTime: '11:15',
    distanceKm: 46.8,
    durationMinutes: 75,
    avgSpeedKmh: 37,
    bluetoothDeviceName: 'Toyota-BT_4821'
  },
  {
    id: 'trip-07',
    vehicleId: 'veh-001',
    date: '2026-10-20',
    startTime: '08:30',
    endTime: '09:10',
    distanceKm: 21.0,
    durationMinutes: 40,
    avgSpeedKmh: 31,
    bluetoothDeviceName: 'Toyota-BT_4821'
  },
  {
    id: 'trip-08',
    vehicleId: 'veh-001',
    date: '2026-10-19',
    startTime: '14:00',
    endTime: '15:20',
    distanceKm: 52.4,
    durationMinutes: 80,
    avgSpeedKmh: 39,
    bluetoothDeviceName: 'Toyota-BT_4821'
  }
];
