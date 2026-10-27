import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { 
  Vehicle, 
  FuelLog, 
  ServiceItem, 
  ServiceLogRecord, 
  MonthlyMatrixRow, 
  TelemetryState,
  ActiveTab,
  ViewMode,
  BodyType,
  DailyTripRecord,
  DailyUsageSummary
} from '../types/vehicle';
import { 
  INITIAL_VEHICLE, 
  INITIAL_VEHICLES,
  INITIAL_FUEL_LOGS, 
  INITIAL_SERVICES, 
  INITIAL_SERVICE_LOGS,
  INITIAL_DAILY_TRIPS,
  SAMPLE_RECEIPT_SVG
} from '../data/seedData';
import { 
  calculateFuelLogs, 
  calculateDailyRhythm, 
  generateMonthlyMatrix, 
  evaluateServices 
} from '../utils/calculations';
import { api } from '../services/apiService';

interface VehicleContextType {
  vehicles: Vehicle[];
  selectedVehicleId: string;
  selectVehicle: (id: string) => void;
  vehicle: Vehicle;
  setVehicle: (vehicle: Vehicle | ((prev: Vehicle) => Vehicle)) => void;
  rawFuelLogs: FuelLog[];
  processedFuelLogs: FuelLog[];
  services: ServiceItem[];
  serviceHistory: ServiceLogRecord[];
  monthlyMatrix: MonthlyMatrixRow[];
  telemetry: TelemetryState;
  dailyRhythmKm: number;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;

  // Garaje: Navegación entre listado y detalle
  garageViewMode: 'list' | 'detail';
  setGarageViewMode: (mode: 'list' | 'detail') => void;
  openVehicleDetail: (vehicleId: string) => void;

  // Modales
  isAddFuelModalOpen: boolean;
  setIsAddFuelModalOpen: (open: boolean) => void;
  isPerformServiceModalOpen: boolean;
  setIsPerformServiceModalOpen: (open: boolean) => void;
  selectedServiceForModal: ServiceItem | null;
  setSelectedServiceForModal: (item: ServiceItem | null) => void;

  // Nuevos modales: Billetera Virtual, Catálogo de Services, Pestaña Flotante Diaria
  isServiceWalletModalOpen: boolean;
  setIsServiceWalletModalOpen: (open: boolean) => void;
  isAddServiceFromCatalogModalOpen: boolean;
  setIsAddServiceFromCatalogModalOpen: (open: boolean) => void;
  isDailyTripsModalOpen: boolean;
  setIsDailyTripsModalOpen: (open: boolean) => void;

  // Bluetooth y Telemetría en Movimiento (contador de km en vivo)
  bluetoothStatus: 'disconnected' | 'connecting' | 'connected';
  isBluetoothConnected: boolean;
  connectedVehicleId: string | null;
  connectedDeviceName: string | null;
  activeTripKm: number;
  activeTripStartTime: string | null;
  connectBluetooth: (vehicleId?: string, customDeviceName?: string) => Promise<boolean>;
  disconnectBluetooth: () => void;
  pairVehicleBluetooth: (vehicleId: string, deviceName: string) => void;

  // Recorridos diarios y resúmenes de km/día
  dailyTrips: DailyTripRecord[];
  dailyUsageSummaries: DailyUsageSummary[];
  addDailyTrip: (trip: Omit<DailyTripRecord, 'id'>) => void;

  // Acciones
  addVehicle: (vehicleData: Omit<Vehicle, 'id' | 'createdAt'>) => Vehicle;
  deleteVehicle: (id: string) => void;
  addFuelLog: (log: Omit<FuelLog, 'id' | 'vehicleId'>) => void;
  addServiceItem: (item: {
    name: string;
    category: any;
    intervalKm: number;
    intervalDays: number;
    lastServiceKm: number;
    lastServiceDate: string;
    cost?: number;
    workshop?: string;
    notes?: string;
  }) => void;
  deleteServiceItem: (serviceId: string) => void;
  performService: (serviceId: string, record: {
    cost: number;
    workshop: string;
    notes?: string;
    receiptFileUrl?: string;
    receiptFileName?: string;
    invoiceNumber?: string;
    partsDetail?: string;
  }) => void;
  simulateTrip: (km: number) => void;
  toggleLiveGps: () => void;
  restoreDemoData: () => void;
  clearDatabase: () => void;
}

const VehicleContext = createContext<VehicleContextType | undefined>(undefined);

const STORAGE_KEYS = {
  VEHICLES: 'vehx_vehicles_v2',
  SELECTED_VEHICLE_ID: 'vehx_selected_vehicle_id_v2',
  VEHICLE: 'autocare_vehicle_v2',
  FUEL_LOGS: 'autocare_fuel_logs_v2',
  SERVICES: 'autocare_services_v2',
  SERVICE_HISTORY: 'autocare_service_history_v2',
  TELEMETRY: 'autocare_telemetry_v2',
  VIEW_MODE: 'autocare_view_mode_v2',
  DAILY_TRIPS: 'vehx_daily_trips_v2',
};

function normalizeVehicle(v: any): Vehicle {
  let bodyType: BodyType = v.bodyType;
  if (!bodyType) {
    const str = `${v.brand || ''} ${v.model || ''}`.toLowerCase();
    if (str.includes('amarok') || str.includes('hilux') || str.includes('ranger') || str.includes('raptor') || str.includes('4x4')) {
      bodyType = '4x4';
    } else if (str.includes('rav4') || str.includes('suv') || str.includes('taos') || str.includes('compass') || str.includes('208')) {
      bodyType = 'suv';
    } else {
      bodyType = 'sedan';
    }
  }

  // Respeta has3dAnimation si viene definido; por defecto los 3 modelos soportados son 3D y 'other' es 2D
  const has3dAnimation = v.has3dAnimation !== undefined 
    ? Boolean(v.has3dAnimation) 
    : (bodyType === 'sedan' || bodyType === 'suv' || bodyType === '4x4');

  const model3dPath = has3dAnimation 
    ? (v.model3dPath || `/models/${bodyType === 'other' ? 'sedan' : bodyType}.glb`) 
    : undefined;

  const bluetoothDeviceName = v.bluetoothDeviceName || `${v.brand || 'Auto'}-BT_${(v.licensePlate || '001').replace(/\s+/g, '')}`;

  return {
    ...v,
    bodyType,
    has3dAnimation,
    model3dPath,
    bluetoothDeviceName
  };
}

export const VehicleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // 1. Lista de Vehículos del Garaje
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.VEHICLES);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(normalizeVehicle);
        }
      } catch {}
    }
    return INITIAL_VEHICLES.map(normalizeVehicle);
  });

  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SELECTED_VEHICLE_ID);
    return saved || INITIAL_VEHICLES[0].id;
  });

  // Vista activa dentro de Garaje: listado inicial o detalle con 3D
  const [garageViewMode, setGarageViewMode] = useState<'list' | 'detail'>('list');

  // Vehículo actualmente seleccionado
  const vehicle = useMemo(() => {
    return vehicles.find(v => v.id === selectedVehicleId) || vehicles[0] || INITIAL_VEHICLE;
  }, [vehicles, selectedVehicleId]);

  const setVehicle = (updatedVehicle: Vehicle | ((prev: Vehicle) => Vehicle)) => {
    setVehicles(prevVehicles => {
      const current = prevVehicles.find(v => v.id === selectedVehicleId) || prevVehicles[0];
      const resolved = typeof updatedVehicle === 'function' ? updatedVehicle(current) : updatedVehicle;
      return prevVehicles.map(v => v.id === resolved.id ? resolved : v);
    });
  };

  const selectVehicle = (id: string) => {
    if (vehicles.some(v => v.id === id)) {
      setSelectedVehicleId(id);
    }
  };

  const openVehicleDetail = (vehicleId: string) => {
    selectVehicle(vehicleId);
    setGarageViewMode('detail');
  };

  const addVehicle = (newVehicleData: Omit<Vehicle, 'id' | 'createdAt'>): Vehicle => {
    const newVehicle: Vehicle = {
      ...newVehicleData,
      id: `veh-${Date.now()}`,
      createdAt: new Date().toISOString()
    };

    const normalized = normalizeVehicle(newVehicle);
    setVehicles(prev => [...prev, normalized]);
    setSelectedVehicleId(normalized.id);
    setGarageViewMode('detail'); // Al registrar, se abre el detalle con la animación 3D

    api.createVehicle?.(normalized).catch(() => {
      console.log('Modo offline: vehículo guardado localmente.');
    });

    return normalized;
  };

  const deleteVehicle = (id: string) => {
    setVehicles(prev => {
      const filtered = prev.filter(v => v.id !== id);
      if (filtered.length > 0) {
        if (selectedVehicleId === id) {
          setSelectedVehicleId(filtered[0].id);
        }
        return filtered;
      }
      return [INITIAL_VEHICLE];
    });
    setGarageViewMode('list');
  };

  const [rawFuelLogs, setRawFuelLogs] = useState<FuelLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.FUEL_LOGS);
    return saved ? JSON.parse(saved) : INITIAL_FUEL_LOGS;
  });

  const [rawServices, setRawServices] = useState<ServiceItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SERVICES);
    return saved ? JSON.parse(saved) : INITIAL_SERVICES;
  });

  const [serviceHistory, setServiceHistory] = useState<ServiceLogRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SERVICE_HISTORY);
    return saved ? JSON.parse(saved) : INITIAL_SERVICE_LOGS;
  });

  const [dailyTrips, setDailyTrips] = useState<DailyTripRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DAILY_TRIPS);
    return saved ? JSON.parse(saved) : INITIAL_DAILY_TRIPS;
  });

  const [telemetry, setTelemetry] = useState<TelemetryState>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TELEMETRY);
    return saved ? JSON.parse(saved) : {
      simulatedOdometer: INITIAL_VEHICLE.currentOdometer + 45,
      dailyRhythmKm: 42.5,
      correctionFactorAlpha: 1.02,
      accumulatedTelemetryKm: 45,
      isLiveGpsActive: false,
      liveGpsLat: null,
      liveGpsLng: null,
      liveGpsSpeedKmh: null,
      lastSyncDate: new Date().toISOString(),
      calibrationErrorDeltaKm: 3.2
    };
  });

  // UI state
  const [activeTab, setActiveTabState] = useState<ActiveTab>(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const tabParam = urlParams.get('tab') as ActiveTab;
      if (tabParam && ['home', 'garage', 'fuel', 'services', 'telemetry'].includes(tabParam)) {
        return tabParam;
      }
      const hash = window.location.hash.replace('#', '') as ActiveTab;
      if (hash && ['home', 'garage', 'fuel', 'services', 'telemetry'].includes(hash)) {
        return hash;
      }
    }
    return 'home';
  });

  const setActiveTab = (tab: ActiveTab) => {
    setActiveTabState(tab);
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', `#${tab}`);
    }
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') as ActiveTab;
      if (hash && ['home', 'garage', 'fuel', 'services', 'telemetry'].includes(hash)) {
        setActiveTabState(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const viewParam = urlParams.get('view') as ViewMode;
      if (viewParam === 'mobile-sim' || viewParam === 'desktop-full') return viewParam;
    }
    const saved = localStorage.getItem(STORAGE_KEYS.VIEW_MODE);
    if (saved === 'desktop-full') return 'desktop-full';
    return 'desktop-full';
  });

  // Estados de Modales
  const [isAddFuelModalOpen, setIsAddFuelModalOpen] = useState(false);
  const [isPerformServiceModalOpen, setIsPerformServiceModalOpen] = useState(false);
  const [selectedServiceForModal, setSelectedServiceForModal] = useState<ServiceItem | null>(null);

  const [isServiceWalletModalOpen, setIsServiceWalletModalOpen] = useState(false);
  const [isAddServiceFromCatalogModalOpen, setIsAddServiceFromCatalogModalOpen] = useState(false);
  const [isDailyTripsModalOpen, setIsDailyTripsModalOpen] = useState(false);

  // Estados de Bluetooth y Medición tipo podómetro
  const [bluetoothStatus, setBluetoothStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const [connectedVehicleId, setConnectedVehicleId] = useState<string | null>(null);
  const [connectedDeviceName, setConnectedDeviceName] = useState<string | null>(null);
  const [activeTripKm, setActiveTripKm] = useState<number>(0);
  const [activeTripStartTime, setActiveTripStartTime] = useState<string | null>(null);

  const isBluetoothConnected = bluetoothStatus === 'connected';

  // Sincronización con LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(vehicles));
  }, [vehicles]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SELECTED_VEHICLE_ID, selectedVehicleId);
  }, [selectedVehicleId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.VEHICLE, JSON.stringify(vehicle));
  }, [vehicle]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FUEL_LOGS, JSON.stringify(rawFuelLogs));
  }, [rawFuelLogs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(rawServices));
  }, [rawServices]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SERVICE_HISTORY, JSON.stringify(serviceHistory));
  }, [serviceHistory]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DAILY_TRIPS, JSON.stringify(dailyTrips));
  }, [dailyTrips]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TELEMETRY, JSON.stringify(telemetry));
  }, [telemetry]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.VIEW_MODE, viewMode);
  }, [viewMode]);

  // Cálculos reactivos y memorizados
  const processedFuelLogs = useMemo(() => {
    return calculateFuelLogs(rawFuelLogs, vehicle);
  }, [rawFuelLogs, vehicle]);

  const dailyRhythmKm = useMemo(() => {
    return calculateDailyRhythm(processedFuelLogs, vehicle);
  }, [processedFuelLogs, vehicle]);

  const monthlyMatrix = useMemo(() => {
    return generateMonthlyMatrix(processedFuelLogs);
  }, [processedFuelLogs]);

  const effectiveOdometer = Math.max(vehicle.currentOdometer, Math.round(telemetry.simulatedOdometer));
  const evaluatedServices = useMemo(() => {
    return evaluateServices(rawServices, effectiveOdometer, dailyRhythmKm);
  }, [rawServices, effectiveOdometer, dailyRhythmKm]);

  useEffect(() => {
    setTelemetry(prev => ({
      ...prev,
      dailyRhythmKm
    }));
  }, [dailyRhythmKm]);

  // Agrupador de Recorridos Diarios (tipo podómetro de uso vehicular)
  const dailyUsageSummaries = useMemo<DailyUsageSummary[]>(() => {
    const vehicleTrips = dailyTrips.filter(t => t.vehicleId === vehicle.id);
    const byDate: Record<string, DailyTripRecord[]> = {};

    vehicleTrips.forEach(t => {
      if (!byDate[t.date]) byDate[t.date] = [];
      byDate[t.date].push(t);
    });

    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    
    // Asegurar que hoy siempre figure en la lista
    if (!byDate[todayStr]) {
      byDate[todayStr] = [];
    }

    const sortedDates = Object.keys(byDate).sort((a, b) => b.localeCompare(a));

    return sortedDates.map(dateStr => {
      const trips = byDate[dateStr];
      const totalKm = trips.reduce((sum, t) => sum + t.distanceKm, 0);
      const totalMinutes = trips.reduce((sum, t) => sum + t.durationMinutes, 0);

      let dayLabel = dateStr;
      if (dateStr === todayStr) {
        dayLabel = 'Hoy';
      } else {
        const parts = dateStr.split('-');
        const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
        dayLabel = `${days[d.getDay()]} ${parts[2]}/${parts[1]}`;
      }

      return {
        date: dateStr,
        dayLabel,
        totalKm: Math.round(totalKm * 10) / 10,
        tripsCount: trips.length,
        totalDurationMinutes: totalMinutes,
        trips: [...trips].sort((a, b) => b.startTime.localeCompare(a.startTime))
      };
    });
  }, [dailyTrips, vehicle.id]);

  // Manejo de Bluetooth y contador en movimiento
  const connectBluetooth = async (targetVehicleId?: string, customDeviceName?: string): Promise<boolean> => {
    const targetId = targetVehicleId || selectedVehicleId;
    const targetVeh = vehicles.find(v => v.id === targetId) || vehicle;
    const devName = customDeviceName || targetVeh.bluetoothDeviceName || `${targetVeh.brand}-BT_${targetVeh.licensePlate.replace(/\s+/g, '')}`;

    setBluetoothStatus('connecting');

    // Intentar invocar Web Bluetooth API si el navegador la soporta
    try {
      if (typeof navigator !== 'undefined' && 'bluetooth' in navigator) {
        // En navegadores compatibles, Web Bluetooth está disponible
      }
    } catch {
      // Continuar con emulación de telemetría por hardware Bluetooth
    }

    await new Promise(resolve => setTimeout(resolve, 600));

    setBluetoothStatus('connected');
    setConnectedVehicleId(targetId);
    setConnectedDeviceName(devName);
    setActiveTripKm(0);
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    setActiveTripStartTime(timeStr);

    return true;
  };

  const disconnectBluetooth = () => {
    if (bluetoothStatus !== 'connected') {
      setBluetoothStatus('disconnected');
      return;
    }

    const tripDistance = activeTripKm;
    const vehicleIdForTrip = connectedVehicleId || selectedVehicleId;
    const devName = connectedDeviceName || vehicle.bluetoothDeviceName || 'BT-Vehicular';

    const now = new Date();
    const endTimeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const todayStr = now.toISOString().split('T')[0];

    if (tripDistance > 0.05) {
      const newTrip: DailyTripRecord = {
        id: `trip-${Date.now()}`,
        vehicleId: vehicleIdForTrip,
        date: todayStr,
        startTime: activeTripStartTime || endTimeStr,
        endTime: endTimeStr,
        distanceKm: Math.round(tripDistance * 10) / 10,
        durationMinutes: Math.max(1, Math.round(tripDistance * 1.5)),
        avgSpeedKmh: 42,
        bluetoothDeviceName: devName
      };

      setDailyTrips(prev => [newTrip, ...prev]);

      const updatedOdo = Math.round(telemetry.simulatedOdometer);
      if (updatedOdo > vehicle.currentOdometer) {
        setVehicle(prev => ({ ...prev, currentOdometer: updatedOdo }));
      }
    }

    setBluetoothStatus('disconnected');
    setConnectedVehicleId(null);
    setConnectedDeviceName(null);
    setActiveTripKm(0);
    setActiveTripStartTime(null);
  };

  const pairVehicleBluetooth = (vehicleId: string, deviceName: string) => {
    setVehicles(prev => prev.map(v => {
      if (v.id !== vehicleId) return v;
      return {
        ...v,
        bluetoothDeviceName: deviceName.trim()
      };
    }));
  };

  const addDailyTrip = (tripData: Omit<DailyTripRecord, 'id'>) => {
    const newTrip: DailyTripRecord = {
      ...tripData,
      id: `trip-${Date.now()}`
    };
    setDailyTrips(prev => [newTrip, ...prev]);
  };

  // Acumulación automática mientras Bluetooth esté conectado (contador de movimiento continuo)
  useEffect(() => {
    if (bluetoothStatus !== 'connected') return;

    const interval = setInterval(() => {
      const deltaKm = 0.08; // ~50-60 km/h en intervalos
      setActiveTripKm(prev => Math.round((prev + deltaKm) * 100) / 100);
      setTelemetry(prev => ({
        ...prev,
        accumulatedTelemetryKm: Math.round((prev.accumulatedTelemetryKm + deltaKm) * 10) / 10,
        simulatedOdometer: Math.round((prev.simulatedOdometer + deltaKm) * 10) / 10,
        lastSyncDate: new Date().toISOString()
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, [bluetoothStatus]);

  // Acciones de Combustible y Services
  const addFuelLog = (newLogData: Omit<FuelLog, 'id' | 'vehicleId'>) => {
    const newLog: FuelLog = {
      ...newLogData,
      id: `fuel-${Date.now()}`,
      vehicleId: vehicle.id
    };

    const newOdometer = Math.max(vehicle.currentOdometer, newLog.odometer);
    if (newOdometer !== vehicle.currentOdometer) {
      setVehicle(prev => ({ ...prev, currentOdometer: newOdometer }));
    }

    setTelemetry(prev => {
      const error = newLog.odometer - prev.simulatedOdometer;
      const effectiveAccum = Math.max(15, prev.accumulatedTelemetryKm);
      const rawNewAlpha = prev.correctionFactorAlpha * (1 + (error / effectiveAccum));
      const clampedAlpha = Math.min(1.20, Math.max(0.85, Math.round(rawNewAlpha * 1000) / 1000));

      return {
        ...prev,
        simulatedOdometer: newLog.odometer,
        accumulatedTelemetryKm: 0,
        correctionFactorAlpha: clampedAlpha,
        calibrationErrorDeltaKm: Math.round(error * 10) / 10,
        lastSyncDate: new Date().toISOString()
      };
    });

    setRawFuelLogs(prev => [...prev, newLog]);
  };

  const addServiceItem = (newService: {
    name: string;
    category: any;
    intervalKm: number;
    intervalDays: number;
    lastServiceKm: number;
    lastServiceDate: string;
    cost?: number;
    workshop?: string;
    notes?: string;
  }) => {
    const newItem: ServiceItem = {
      id: `srv-${Date.now()}`,
      vehicleId: vehicle.id,
      name: newService.name,
      category: newService.category,
      intervalKm: newService.intervalKm,
      intervalDays: newService.intervalDays,
      lastServiceKm: newService.lastServiceKm,
      lastServiceDate: newService.lastServiceDate,
      cost: newService.cost || 60000,
      workshop: newService.workshop || 'Taller Autorizado',
      notes: newService.notes || 'Service incorporado al plan vehicular',
      wearKmPercent: 0,
      wearDaysPercent: 0,
      wearTotalPercent: 0,
      status: 'ok',
      remainingKm: newService.intervalKm,
      remainingDays: newService.intervalDays,
      projectedDaysByRhythm: Math.round(newService.intervalKm / (dailyRhythmKm || 42)),
      statusMessage: 'Service programado'
    };

    setRawServices(prev => [...prev, newItem]);
  };

  const deleteServiceItem = (serviceId: string) => {
    setRawServices(prev => prev.filter(s => s.id !== serviceId));
  };

  const performService = (serviceId: string, recordData: {
    cost: number;
    workshop: string;
    notes?: string;
    receiptFileUrl?: string;
    receiptFileName?: string;
    invoiceNumber?: string;
    partsDetail?: string;
  }) => {
    const targetService = evaluatedServices.find(s => s.id === serviceId);
    if (!targetService) return;

    const todayStr = new Date().toISOString().split('T')[0];
    const serviceOdo = Math.max(vehicle.currentOdometer, Math.round(telemetry.simulatedOdometer));

    setRawServices(prev => prev.map(s => {
      if (s.id !== serviceId) return s;
      return {
        ...s,
        lastServiceKm: serviceOdo,
        lastServiceDate: todayStr,
        cost: recordData.cost,
        workshop: recordData.workshop,
        notes: recordData.notes || s.notes
      };
    }));

    const logRecord: ServiceLogRecord = {
      id: `slog-${Date.now()}`,
      vehicleId: vehicle.id,
      serviceItemId: serviceId,
      serviceName: targetService.name,
      date: todayStr,
      odometer: serviceOdo,
      cost: recordData.cost,
      workshop: recordData.workshop,
      invoiceNumber: recordData.invoiceNumber || `FAC-${Math.floor(1000 + Math.random() * 9000)}-${Date.now().toString().slice(-4)}`,
      notes: recordData.notes,
      receiptFileUrl: recordData.receiptFileUrl || SAMPLE_RECEIPT_SVG,
      receiptFileName: recordData.receiptFileName || 'Comprobante_Service.svg',
      partsDetail: recordData.partsDetail,
      verifiedForSale: true
    };

    setServiceHistory(prev => [logRecord, ...prev]);
  };

  const simulateTrip = (km: number) => {
    if (km <= 0) return;
    setTelemetry(prev => {
      const addedKm = Math.round(km * prev.correctionFactorAlpha * 10) / 10;
      return {
        ...prev,
        accumulatedTelemetryKm: Math.round((prev.accumulatedTelemetryKm + km) * 10) / 10,
        simulatedOdometer: Math.round((prev.simulatedOdometer + addedKm) * 10) / 10,
        lastSyncDate: new Date().toISOString()
      };
    });

    // Registrar en los recorridos diarios del vehículo
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    addDailyTrip({
      vehicleId: vehicle.id,
      date: todayStr,
      startTime: timeStr,
      endTime: timeStr,
      distanceKm: Math.round(km * 10) / 10,
      durationMinutes: Math.max(2, Math.round(km * 1.4)),
      avgSpeedKmh: 45,
      bluetoothDeviceName: vehicle.bluetoothDeviceName || 'Simulador'
    });
  };

  // Web Geolocation API Tracker
  const [watchId, setWatchId] = useState<number | null>(null);
  const [prevPosition, setPrevPosition] = useState<{ lat: number; lng: number } | null>(null);

  const toggleLiveGps = () => {
    if (telemetry.isLiveGpsActive) {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
        setWatchId(null);
      }
      setTelemetry(prev => ({ ...prev, isLiveGpsActive: false, liveGpsSpeedKmh: null }));
    } else {
      if (!('geolocation' in navigator)) {
        alert('La Geolocation API no está soportada en este navegador.');
        return;
      }

      const id = navigator.geolocation.watchPosition(
        position => {
          const { latitude, longitude, speed } = position.coords;
          const speedKmh = speed ? Math.round(speed * 3.6) : 0;

          if (prevPosition) {
            const R = 6371; // km
            const dLat = (latitude - prevPosition.lat) * (Math.PI / 180);
            const dLng = (longitude - prevPosition.lng) * (Math.PI / 180);
            const a =
              Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(prevPosition.lat * (Math.PI / 180)) *
                Math.cos(latitude * (Math.PI / 180)) *
                Math.sin(dLng / 2) *
                Math.sin(dLng / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            const deltaKm = R * c;

            if (deltaKm > 0.05) {
              simulateTrip(deltaKm);
            }
          }

          setPrevPosition({ lat: latitude, lng: longitude });
          setTelemetry(prev => ({
            ...prev,
            isLiveGpsActive: true,
            liveGpsLat: latitude,
            liveGpsLng: longitude,
            liveGpsSpeedKmh: speedKmh
          }));
        },
        error => {
          console.warn('Error en Geolocation API:', error.message);
          setTelemetry(prev => ({ ...prev, isLiveGpsActive: false }));
        },
        { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
      );

      setWatchId(id);
    }
  };

  const restoreDemoData = () => {
    localStorage.removeItem(STORAGE_KEYS.VEHICLES);
    localStorage.removeItem(STORAGE_KEYS.SELECTED_VEHICLE_ID);
    localStorage.removeItem(STORAGE_KEYS.VEHICLE);
    localStorage.removeItem(STORAGE_KEYS.FUEL_LOGS);
    localStorage.removeItem(STORAGE_KEYS.SERVICES);
    localStorage.removeItem(STORAGE_KEYS.SERVICE_HISTORY);
    localStorage.removeItem(STORAGE_KEYS.TELEMETRY);
    localStorage.removeItem(STORAGE_KEYS.DAILY_TRIPS);

    setVehicles(INITIAL_VEHICLES.map(normalizeVehicle));
    setSelectedVehicleId(INITIAL_VEHICLES[0].id);
    setGarageViewMode('list');
    setRawFuelLogs(INITIAL_FUEL_LOGS);
    setRawServices(INITIAL_SERVICES);
    setServiceHistory(INITIAL_SERVICE_LOGS);
    setDailyTrips(INITIAL_DAILY_TRIPS);
    setBluetoothStatus('disconnected');
    setConnectedVehicleId(null);
    setConnectedDeviceName(null);
    setActiveTripKm(0);
    setTelemetry({
      simulatedOdometer: INITIAL_VEHICLES[0].currentOdometer + 45,
      dailyRhythmKm: 42.5,
      correctionFactorAlpha: 1.02,
      accumulatedTelemetryKm: 45,
      isLiveGpsActive: false,
      liveGpsLat: null,
      liveGpsLng: null,
      liveGpsSpeedKmh: null,
      lastSyncDate: new Date().toISOString(),
      calibrationErrorDeltaKm: 3.2
    });
  };

  const clearDatabase = () => {
    const emptyVehicle: Vehicle = {
      id: `veh-${Date.now()}`,
      brand: 'Mi Vehículo',
      model: 'Modelo Base',
      year: 2024,
      licensePlate: 'AA 000 AA',
      fuelType: 'Nafta Súper',
      tankCapacity: 50,
      distributionType: 'Correa',
      transmission: 'Manual',
      initialOdometer: 0,
      currentOdometer: 0,
      has3dAnimation: false,
      bluetoothDeviceName: 'MiAuto-BT',
      createdAt: new Date().toISOString()
    };

    setVehicles([emptyVehicle]);
    setSelectedVehicleId(emptyVehicle.id);
    setGarageViewMode('list');
    setRawFuelLogs([]);
    setRawServices([]);
    setServiceHistory([]);
    setDailyTrips([]);
    setBluetoothStatus('disconnected');
    setConnectedVehicleId(null);
    setConnectedDeviceName(null);
    setActiveTripKm(0);
    setTelemetry({
      simulatedOdometer: 0,
      dailyRhythmKm: 40,
      correctionFactorAlpha: 1.0,
      accumulatedTelemetryKm: 0,
      isLiveGpsActive: false,
      liveGpsLat: null,
      liveGpsLng: null,
      liveGpsSpeedKmh: null,
      lastSyncDate: new Date().toISOString(),
      calibrationErrorDeltaKm: 0
    });
  };

  return (
    <VehicleContext.Provider
      value={{
        vehicles,
        selectedVehicleId,
        selectVehicle,
        vehicle,
        setVehicle,
        rawFuelLogs,
        processedFuelLogs,
        services: evaluatedServices,
        serviceHistory,
        monthlyMatrix,
        telemetry,
        dailyRhythmKm,
        activeTab,
        setActiveTab,
        viewMode,
        setViewMode,
        garageViewMode,
        setGarageViewMode,
        openVehicleDetail,
        isAddFuelModalOpen,
        setIsAddFuelModalOpen,
        isPerformServiceModalOpen,
        setIsPerformServiceModalOpen,
        selectedServiceForModal,
        setSelectedServiceForModal,
        isServiceWalletModalOpen,
        setIsServiceWalletModalOpen,
        isAddServiceFromCatalogModalOpen,
        setIsAddServiceFromCatalogModalOpen,
        isDailyTripsModalOpen,
        setIsDailyTripsModalOpen,
        bluetoothStatus,
        isBluetoothConnected,
        connectedVehicleId,
        connectedDeviceName,
        activeTripKm,
        activeTripStartTime,
        connectBluetooth,
        disconnectBluetooth,
        pairVehicleBluetooth,
        dailyTrips,
        dailyUsageSummaries,
        addDailyTrip,
        addVehicle,
        deleteVehicle,
        addFuelLog,
        addServiceItem,
        deleteServiceItem,
        performService,
        simulateTrip,
        toggleLiveGps,
        restoreDemoData,
        clearDatabase
      }}
    >
      {children}
    </VehicleContext.Provider>
  );
};

export const useVehicle = () => {
  const context = useContext(VehicleContext);
  if (!context) {
    throw new Error('useVehicle debe ser utilizado dentro de un VehicleProvider');
  }
  return context;
};
