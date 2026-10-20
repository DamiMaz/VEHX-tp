import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { 
  Vehicle, 
  FuelLog, 
  ServiceItem, 
  ServiceLogRecord, 
  MonthlyMatrixRow, 
  TelemetryState,
  ActiveTab,
  ViewMode
} from '../types/vehicle';
import { 
  INITIAL_VEHICLE, 
  INITIAL_VEHICLES,
  INITIAL_FUEL_LOGS, 
  INITIAL_SERVICES, 
  INITIAL_SERVICE_LOGS 
} from '../data/seedData';
import { 
  calculateFuelLogs, 
  calculateDailyRhythm, 
  generateMonthlyMatrix, 
  evaluateServices 
} from '../utils/calculations';

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
  isAddFuelModalOpen: boolean;
  setIsAddFuelModalOpen: (open: boolean) => void;
  isPerformServiceModalOpen: boolean;
  setIsPerformServiceModalOpen: (open: boolean) => void;
  selectedServiceForModal: ServiceItem | null;
  setSelectedServiceForModal: (item: ServiceItem | null) => void;

  // Acciones
  addFuelLog: (log: Omit<FuelLog, 'id' | 'vehicleId'>) => void;
  performService: (serviceId: string, record: { cost: number; workshop: string; notes?: string }) => void;
  simulateTrip: (km: number) => void;
  toggleLiveGps: () => void;
  restoreDemoData: () => void;
  clearDatabase: () => void;
}

const VehicleContext = createContext<VehicleContextType | undefined>(undefined);

const STORAGE_KEYS = {
  VEHICLES: 'vehx_vehicles_v1',
  SELECTED_VEHICLE_ID: 'vehx_selected_vehicle_id_v1',
  VEHICLE: 'autocare_vehicle_v1',
  FUEL_LOGS: 'autocare_fuel_logs_v1',
  SERVICES: 'autocare_services_v1',
  SERVICE_HISTORY: 'autocare_service_history_v1',
  TELEMETRY: 'autocare_telemetry_v1',
  VIEW_MODE: 'autocare_view_mode_v1',
};

export const VehicleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // 1. Lista de Vehículos del Garaje
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.VEHICLES);
    return saved ? JSON.parse(saved) : INITIAL_VEHICLES;
  });

  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SELECTED_VEHICLE_ID);
    return saved || INITIAL_VEHICLES[0].id;
  });

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

  // UI state - Siempre en mobile-sim para la demo móvil
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [viewMode, setViewMode] = useState<ViewMode>('mobile-sim');
  const [isAddFuelModalOpen, setIsAddFuelModalOpen] = useState(false);
  const [isPerformServiceModalOpen, setIsPerformServiceModalOpen] = useState(false);
  const [selectedServiceForModal, setSelectedServiceForModal] = useState<ServiceItem | null>(null);

  // Sincronización LocalStorage
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

  // Evaluamos los services usando el odómetro más alto (el estimado por telemetría si es mayor al de tablero)
  const effectiveOdometer = Math.max(vehicle.currentOdometer, telemetry.simulatedOdometer);
  const evaluatedServices = useMemo(() => {
    return evaluateServices(rawServices, effectiveOdometer, dailyRhythmKm);
  }, [rawServices, effectiveOdometer, dailyRhythmKm]);

  // Mantener actualizado el ritmo en telemetría
  useEffect(() => {
    setTelemetry(prev => ({
      ...prev,
      dailyRhythmKm
    }));
  }, [dailyRhythmKm]);

  // Acciones
  const addFuelLog = (newLogData: Omit<FuelLog, 'id' | 'vehicleId'>) => {
    const newLog: FuelLog = {
      ...newLogData,
      id: `fuel-${Date.now()}`,
      vehicleId: vehicle.id
    };

    // Actualizar odómetro del vehículo si es mayor
    const newOdometer = Math.max(vehicle.currentOdometer, newLog.odometer);
    if (newOdometer !== vehicle.currentOdometer) {
      setVehicle(prev => ({ ...prev, currentOdometer: newOdometer }));
    }

    // Pipeline de Autocalibración del Odómetro Virtual con el Odómetro Real del Tablero
    setTelemetry(prev => {
      const error = newLog.odometer - prev.simulatedOdometer;
      const effectiveAccum = Math.max(15, prev.accumulatedTelemetryKm);
      // Ajuste proporcional de alfa
      const rawNewAlpha = prev.correctionFactorAlpha * (1 + (error / effectiveAccum));
      const clampedAlpha = Math.min(1.20, Math.max(0.85, Math.round(rawNewAlpha * 1000) / 1000));

      return {
        ...prev,
        simulatedOdometer: newLog.odometer, // Se alinea exactamente al odómetro real cargado
        accumulatedTelemetryKm: 0, // Reinicia el contador de kilómetros virtuales hasta la próxima carga
        correctionFactorAlpha: clampedAlpha,
        calibrationErrorDeltaKm: Math.round(error * 10) / 10,
        lastSyncDate: new Date().toISOString()
      };
    });

    setRawFuelLogs(prev => [...prev, newLog]);
  };

  const performService = (serviceId: string, recordData: { cost: number; workshop: string; notes?: string }) => {
    const targetService = evaluatedServices.find(s => s.id === serviceId);
    if (!targetService) return;

    const todayStr = new Date().toISOString().split('T')[0];
    const serviceOdo = Math.max(vehicle.currentOdometer, telemetry.simulatedOdometer);

    // Actualizar el ítem de service
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

    // Registrar en la bitácora histórica
    const logRecord: ServiceLogRecord = {
      id: `slog-${Date.now()}`,
      vehicleId: vehicle.id,
      serviceItemId: serviceId,
      serviceName: targetService.name,
      date: todayStr,
      odometer: serviceOdo,
      cost: recordData.cost,
      workshop: recordData.workshop,
      invoiceNumber: `FAC-${Math.floor(1000 + Math.random() * 9000)}-${Date.now().toString().slice(-4)}`,
      notes: recordData.notes
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
            // Calcular distancia Haversine en km
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

            if (deltaKm > 0.05) { // Filtrar ruido GPS menor a 50 metros
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

    setVehicles(INITIAL_VEHICLES);
    setSelectedVehicleId(INITIAL_VEHICLES[0].id);
    setRawFuelLogs(INITIAL_FUEL_LOGS);
    setRawServices(INITIAL_SERVICES);
    setServiceHistory(INITIAL_SERVICE_LOGS);
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
      createdAt: new Date().toISOString()
    };

    setVehicles([emptyVehicle]);
    setSelectedVehicleId(emptyVehicle.id);
    setRawFuelLogs([]);
    setRawServices([]);
    setServiceHistory([]);
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
        isAddFuelModalOpen,
        setIsAddFuelModalOpen,
        isPerformServiceModalOpen,
        setIsPerformServiceModalOpen,
        selectedServiceForModal,
        setSelectedServiceForModal,
        addFuelLog,
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
