import React from 'react';
import { useVehicle } from '../context/VehicleContext';
import { Bluetooth, Activity, Gauge, ChevronUp } from 'lucide-react';

export const DailyTripsFloatingButton: React.FC = () => {
  const { 
    isDailyTripsModalOpen, 
    setIsDailyTripsModalOpen, 
    bluetoothStatus, 
    connectedDeviceName, 
    activeTripKm,
    dailyUsageSummaries,
    vehicle 
  } = useVehicle();

  const isConnected = bluetoothStatus === 'connected';
  const isConnecting = bluetoothStatus === 'connecting';

  // Obtener los kilómetros acumulados hoy
  const todaySummary = dailyUsageSummaries.find(s => s.dayLabel === 'Hoy');
  const todayKm = (todaySummary?.totalKm || 0) + (isConnected ? activeTripKm : 0);

  return (
    <div className="fixed bottom-20 lg:bottom-6 right-4 z-40 animate-fade-in select-none">
      <button
        type="button"
        onClick={() => setIsDailyTripsModalOpen(!isDailyTripsModalOpen)}
        className={`group flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl border backdrop-blur-md transition-all shadow-xl hover:scale-105 ${
          isConnected
            ? 'bg-carbon/95 border-emerald-500/80 text-text-primary shadow-emerald-500/20 ring-1 ring-emerald-500/50'
            : isConnecting
            ? 'bg-carbon/95 border-amber-autumn/70 text-text-primary shadow-amber-glow animate-pulse'
            : 'bg-carbon/90 border-tea/60 text-text-secondary hover:text-text-primary hover:border-amber-autumn'
        }`}
        title="Ver Recorridos Diarios y Telemetría Bluetooth"
      >
        {/* Ícono de Bluetooth con indicador de pulso */}
        <div className="relative flex items-center justify-center">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
            isConnected
              ? 'bg-emerald-500/20 text-emerald-400'
              : isConnecting
              ? 'bg-amber-autumn/20 text-amber-autumn'
              : 'bg-river text-text-secondary group-hover:text-amber-autumn'
          }`}>
            <Bluetooth className="w-4 h-4 stroke-[2.5]" />
          </div>
          {isConnected && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
          )}
        </div>

        {/* Información compacta del Podómetro Vehicular */}
        <div className="text-left">
          <div className="flex items-center gap-1.5 leading-none">
            <span className="text-[9px] font-extrabold uppercase tracking-wider text-text-secondary">
              {isConnected ? 'BT Conectado' : 'Podómetro Vehicular'}
            </span>
            {isConnected && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
            )}
          </div>
          <div className="flex items-baseline gap-1 mt-1 leading-none">
            <span className="text-sm font-extrabold text-amber-autumn font-mono">
              {todayKm.toFixed(1)}
            </span>
            <span className="text-[10px] text-text-secondary font-semibold">km hoy</span>
            {isConnected && activeTripKm > 0 && (
              <span className="text-[9px] text-emerald-400 font-mono font-bold ml-1">
                (+{activeTripKm.toFixed(1)})
              </span>
            )}
          </div>
        </div>

        <ChevronUp className={`w-4 h-4 text-text-secondary group-hover:text-text-primary transition-transform ml-0.5 ${
          isDailyTripsModalOpen ? 'rotate-180' : ''
        }`} />
      </button>
    </div>
  );
};
