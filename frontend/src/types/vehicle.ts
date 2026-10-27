// Domain Types for Vehicle Management, Fuel Logs, Services & Telemetry

export type FuelType = 'Nafta Súper' | 'Nafta Premium' | 'Diésel' | 'GNC' | 'Híbrido';
export type TransmissionType = 'Manual' | 'Automática';
export type DistributionType = 'Correa' | 'Cadena';
export type RouteType = 'Ciudad' | 'Ruta' | 'Mixto';
export type BodyType = 'sedan' | 'suv' | '4x4' | 'other';

export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  licensePlate: string;
  fuelType: FuelType;
  tankCapacity: number; // Litros
  distributionType: DistributionType;
  initialOdometer: number; // km
  currentOdometer: number; // km (odómetro real de tablero)
  transmission: TransmissionType;
  vin?: string;
  bodyType?: BodyType;
  model3dPath?: string;
  has3dAnimation?: boolean; // Indica si cuenta con modelo/animación 3D o silueta 2D
  bluetoothDeviceName?: string; // Nombre del dispositivo BT vinculado (ej. Toyota-BT-4821)
  bluetoothDeviceId?: string; // ID / UUID de Bluetooth
  createdAt: string;
}

export interface CatalogVehicleModel {
  id: string;
  category: BodyType;
  categoryLabel: string;
  brand: string;
  model: string;
  defaultFuelType: FuelType;
  defaultTankCapacity: number;
  defaultDistributionType: DistributionType;
  defaultTransmission: TransmissionType;
  model3dFile: string;
  model3dPath: string;
  specsSummary: string;
  description: string;
}

export interface FuelLog {
  id: string;
  vehicleId: string;
  date: string; // ISO String (YYYY-MM-DDTHH:mm)
  odometer: number; // km
  liters: number;
  totalCost: number; // $
  costPerLiter: number; // $/L
  isFullTank: boolean; // ¿Tanque Lleno 100%?
  routeType: RouteType;
  fuelGrade?: 'Súper' | 'Premium';
  ticketPhotoUrl?: string;

  // Campos calculados por el motor matemático:
  tripDistance?: number; // Δkm desde la carga anterior
  realEfficiencyKmPerL?: number | null; // km/L (null si es carga parcial acumulando)
  consumptionLPer100Km?: number | null; // L/100km
  costPerKm?: number; // $/km
  calculationNote?: string; // e.g. "Cálculo consolidado con 2 cargas previas" o "Acumulando (Carga Parcial)"
}

export type ServiceStatus = 'ok' | 'warning' | 'overdue';

export interface ServiceItem {
  id: string;
  vehicleId: string;
  name: string; // e.g. "Cambio de Aceite y Filtros", "Kit de Distribución"
  category: 'Aceite' | 'Distribución' | 'Frenos' | 'Neumáticos' | 'General';
  intervalKm: number;
  intervalDays: number;
  lastServiceKm: number;
  lastServiceDate: string; // ISO YYYY-MM-DD
  suggestedNextKm?: number;
  suggestedNextDate?: string;
  cost?: number;
  workshop?: string;
  notes?: string;

  // Calculados dinámicamente:
  wearKmPercent: number; // % desgaste por odómetro
  wearDaysPercent: number; // % desgaste por tiempo calendario
  wearTotalPercent: number; // max(wearKmPercent, wearDaysPercent)
  status: ServiceStatus;
  remainingKm: number;
  remainingDays: number;
  projectedDaysByRhythm: number; // Basado en el ritmo de km/día
  statusMessage: string;
}

export interface ServiceLogRecord {
  id: string;
  vehicleId: string;
  serviceItemId: string;
  serviceName: string;
  date: string;
  odometer: number;
  cost: number;
  workshop: string;
  invoiceNumber?: string;
  notes?: string;
  receiptFileUrl?: string; // Comprobante o foto de la factura (Data URL / URL)
  receiptFileName?: string;
  partsDetail?: string; // Repuestos utilizados
  workshopCuit?: string; // CUIT fiscal del taller
  verifiedForSale?: boolean; // Sello de verificación para la venta
}

export interface DailyTripRecord {
  id: string;
  vehicleId: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  distanceKm: number;
  durationMinutes: number;
  avgSpeedKmh: number;
  bluetoothDeviceName?: string;
}

export interface DailyUsageSummary {
  date: string; // YYYY-MM-DD
  dayLabel: string; // "Hoy", "Ayer", "Lun 20", etc.
  totalKm: number;
  tripsCount: number;
  totalDurationMinutes: number;
  trips: DailyTripRecord[];
}

export interface MonthlyMatrixRow {
  periodKey: string; // "2026-04"
  monthName: string; // "Abril 2026"
  year: number;
  monthIndex: number; // 0-11
  totalDistanceKm: number;
  totalLiters: number;
  logsCount: number;
  fullTanksCount: number;
  partialTanksCount: number;
  totalCost: number;
  avgCostPerKm: number; // $/km
  avgEfficiencyKmPerL: number; // km/L
  consumptionLPer100Km: number; // L/100km
  efficiencyChangePercent: number | null; // % vs mes anterior (+ mejora, - empeora)
  hasAnomalyAlert: boolean; // Si cae > 15% vs promedio histórico
  anomalyMessage?: string;
}

export interface TelemetryState {
  simulatedOdometer: number; // Odómetro virtual en vivo
  dailyRhythmKm: number; // Promedio histórico km/día
  correctionFactorAlpha: number; // Factor α de autocalibración (ej. 1.02)
  accumulatedTelemetryKm: number; // Km virtuales acumulados desde última nafta
  isLiveGpsActive: boolean;
  liveGpsLat: number | null;
  liveGpsLng: number | null;
  liveGpsSpeedKmh: number | null;
  lastSyncDate: string;
  calibrationErrorDeltaKm: number; // Margen de error en última calibración
}

export type ActiveTab = 'home' | 'garage' | 'fuel' | 'services' | 'telemetry';
export type ViewMode = 'mobile-sim' | 'desktop-full';
