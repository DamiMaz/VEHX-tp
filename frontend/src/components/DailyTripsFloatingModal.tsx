import React, { useState } from 'react';
import { useVehicle } from '../context/VehicleContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  X, 
  Bluetooth, 
  Activity, 
  Car, 
  Calendar, 
  Clock, 
  Zap, 
  CheckCircle2, 
  Play, 
  Square, 
  Plus, 
  Gauge, 
  Flame, 
  Compass,
  ArrowRight
} from 'lucide-react';

export const DailyTripsFloatingModal: React.FC = () => {
  const { 
    isDailyTripsModalOpen, 
    setIsDailyTripsModalOpen, 
    vehicles, 
    selectedVehicleId, 
    selectVehicle, 
    vehicle,
    bluetoothStatus, 
    isBluetoothConnected, 
    connectedVehicleId, 
    connectedDeviceName, 
    activeTripKm,
    activeTripStartTime,
    connectBluetooth, 
    disconnectBluetooth, 
    pairVehicleBluetooth,
    dailyUsageSummaries,
    simulateTrip,
    dailyRhythmKm
  } = useVehicle();
  const { t } = useLanguage();

  const [customBtInput, setCustomBtInput] = useState<string>(vehicle.bluetoothDeviceName || '');
  const [isEditingBt, setIsEditingBt] = useState(false);
  const [selectedDayTab, setSelectedDayTab] = useState<string>('Hoy');

  if (!isDailyTripsModalOpen) return null;

  const isCurrentCarConnected = isBluetoothConnected && connectedVehicleId === vehicle.id;

  const handlePairSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (customBtInput.trim()) {
      pairVehicleBluetooth(vehicle.id, customBtInput.trim());
      setIsEditingBt(false);
    }
  };

  const todaySummary = dailyUsageSummaries.find(s => s.dayLabel === 'Hoy');
  const todayTotalKm = (todaySummary?.totalKm || 0) + (isBluetoothConnected ? activeTripKm : 0);
  const dailyTargetKm = dailyRhythmKm || 42;
  const progressPercent = Math.min(100, Math.round((todayTotalKm / dailyTargetKm) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-2xl max-h-[92vh] flex flex-col rounded-3xl bg-carbon border border-tea/80 shadow-2xl overflow-hidden">
        
        {/* Cabecera del Panel Flotante */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-tea/50 bg-gradient-to-r from-river to-carbon">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border transition-all ${
              isBluetoothConnected 
                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400 shadow-emerald-500/20' 
                : 'bg-amber-autumn/15 border-amber-autumn/40 text-amber-autumn'
            }`}>
              <Bluetooth className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-extrabold text-text-primary tracking-tight">
                  Telemetría & Podómetro Vehicular
                </h2>
                {isBluetoothConnected ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    EN MOVIMIENTO
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-river text-text-secondary border border-tea/40">
                    DESCONECTADO
                  </span>
                )}
              </div>
              <p className="text-[11px] text-text-secondary">
                Monitoreo de kilómetros diarios por Bluetooth similar a un contador de pasos
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsDailyTripsModalOpen(false)}
            className="p-1.5 rounded-xl bg-river/60 hover:bg-river text-text-secondary hover:text-text-primary border border-tea/40 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Contenido scrolleable */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          
          {/* SECTOR 1: GESTIÓN DE BLUETOOTH POR VEHÍCULO */}
          <div className="p-4 rounded-2xl bg-river/70 border border-tea/50 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Car className="w-4 h-4 text-amber-autumn" />
                <span className="text-xs font-extrabold uppercase text-text-primary tracking-wide">
                  Vehículo & Dispositivo Bluetooth
                </span>
              </div>
              <span className="text-[10px] text-text-secondary font-mono">
                {vehicles.length} vehículos registrados
              </span>
            </div>

            {/* Selector de Auto (si tiene varios autos) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {vehicles.map(v => {
                const isSelected = v.id === selectedVehicleId;
                const isConn = isBluetoothConnected && connectedVehicleId === v.id;
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => {
                      selectVehicle(v.id);
                      setCustomBtInput(v.bluetoothDeviceName || '');
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-amber-autumn/15 border-amber-autumn ring-1 ring-amber-autumn'
                        : 'bg-carbon/70 border-tea/40 hover:border-tea'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold text-text-secondary truncate">
                        {v.brand}
                      </span>
                      {isConn && (
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      )}
                    </div>
                    <div className="text-xs font-extrabold text-text-primary truncate">
                      {v.model.split(' ')[0]}
                    </div>
                    <div className="text-[9px] text-amber-autumn font-mono truncate mt-1">
                      {v.bluetoothDeviceName || 'Sin BT'}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Configuración del Bluetooth del Auto Seleccionado */}
            <div className="p-3 rounded-xl bg-carbon/90 border border-tea/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] text-text-secondary block font-semibold">
                  Bluetooth asignado a: <strong className="text-text-primary">{vehicle.brand} {vehicle.model} ({vehicle.licensePlate})</strong>
                </span>
                {isEditingBt ? (
                  <form onSubmit={handlePairSave} className="flex items-center gap-2 mt-1.5">
                    <input
                      type="text"
                      value={customBtInput}
                      onChange={e => setCustomBtInput(e.target.value)}
                      placeholder="ej. Toyota-BT_4821 o OBD2-V6"
                      className="px-2.5 py-1 text-xs rounded-lg bg-river border border-tea text-text-primary font-mono focus:outline-none focus:border-amber-autumn"
                    />
                    <button
                      type="submit"
                      className="px-2.5 py-1 text-xs font-bold bg-amber-autumn text-river rounded-lg hover:brightness-110"
                    >
                      Guardar
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditingBt(false)}
                      className="text-xs text-text-secondary hover:text-text-primary"
                    >
                      Cancelar
                    </button>
                  </form>
                ) : (
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-sm font-extrabold text-amber-autumn font-mono">
                      {vehicle.bluetoothDeviceName || 'No vinculado'}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setCustomBtInput(vehicle.bluetoothDeviceName || '');
                        setIsEditingBt(true);
                      }}
                      className="text-[10px] text-text-secondary hover:text-amber-autumn underline"
                    >
                      (Cambiar BT)
                    </button>
                  </div>
                )}
              </div>

              {/* Botón Principal Conectar / Desconectar */}
              <div className="shrink-0">
                {isBluetoothConnected ? (
                  <button
                    type="button"
                    onClick={disconnectBluetooth}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-red-950/40 border border-red-500/60 hover:bg-red-900/50 text-red-300 font-extrabold text-xs transition-all shadow-md"
                  >
                    <Square className="w-3.5 h-3.5 fill-current" />
                    <span>Desconectar Bluetooth (Finalizar Viaje)</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => connectBluetooth(vehicle.id)}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs transition-all shadow-emerald-600/30 shadow-lg hover:scale-[1.02]"
                  >
                    <Bluetooth className="w-4 h-4 stroke-[2.5]" />
                    <span>Conectar Bluetooth ({vehicle.bluetoothDeviceName || 'Auto'})</span>
                  </button>
                )}
              </div>
            </div>

            {/* Telemetría en Vivo de la Sesión Bluetooth */}
            {isBluetoothConnected && (
              <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/40 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <span className="font-extrabold text-emerald-400">
                      Sesión Activa con {connectedDeviceName}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-text-secondary">
                    Inicio: {activeTripStartTime || 'En curso'}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center pt-1">
                  <div className="p-2 rounded-lg bg-carbon/80">
                    <span className="text-[10px] text-text-secondary block">Distancia Tramo</span>
                    <strong className="text-base font-extrabold text-emerald-400 font-mono">
                      {activeTripKm.toFixed(2)} km
                    </strong>
                  </div>
                  <div className="p-2 rounded-lg bg-carbon/80">
                    <span className="text-[10px] text-text-secondary block">Velocidad Estimada</span>
                    <strong className="text-base font-extrabold text-text-primary font-mono">
                      ~48 km/h
                    </strong>
                  </div>
                  <div className="p-2 rounded-lg bg-carbon/80">
                    <span className="text-[10px] text-text-secondary block">Odómetro en Vivo</span>
                    <strong className="text-base font-extrabold text-amber-autumn font-mono">
                      {Math.round(vehicle.currentOdometer + activeTripKm).toLocaleString('es-AR')} km
                    </strong>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 pt-1 text-[11px]">
                  <span className="text-text-secondary">
                    El podómetro acumula automáticamente cada kilómetro de uso vehicular.
                  </span>
                  <button
                    type="button"
                    onClick={() => simulateTrip(2.5)}
                    className="px-2.5 py-1 rounded-lg bg-emerald-500/30 hover:bg-emerald-500/50 text-emerald-300 font-bold text-[10px] transition-all shrink-0"
                  >
                    +2.5 km en movimiento
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* SECTOR 2: CONTADOR DE PASOS / KILÓMETROS DIARIOS */}
          <div className="p-4 rounded-2xl bg-carbon border border-tea/60 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Gauge className="w-4 h-4 text-amber-autumn" />
                <h3 className="text-xs font-extrabold uppercase text-text-primary tracking-wide">
                  Contador de Kilómetros Diarios
                </h3>
              </div>
              <span className="text-[10px] font-semibold text-text-secondary">
                Meta sugerida: <strong className="text-amber-autumn">{dailyTargetKm} km/día</strong>
              </span>
            </div>

            {/* Tarjeta de Progreso Diario estilo Podómetro */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-river to-carbon border border-tea/50 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {/* Anillo de Progreso */}
                <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-tea/30"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className={progressPercent >= 100 ? 'text-emerald-400' : 'text-amber-autumn'}
                      strokeDasharray={`${progressPercent}, 100`}
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center text-center">
                    <span className="text-sm font-extrabold text-text-primary leading-none">
                      {progressPercent}%
                    </span>
                    <span className="text-[8px] text-text-secondary uppercase">de meta</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">
                    Recorrido de Hoy ({vehicle.brand} {vehicle.model})
                  </span>
                  <div className="flex items-baseline gap-1.5 mt-0.5">
                    <span className="text-2xl sm:text-3xl font-extrabold text-amber-autumn font-mono">
                      {todayTotalKm.toFixed(1)}
                    </span>
                    <span className="text-xs font-semibold text-text-secondary">kilómetros</span>
                  </div>
                  <p className="text-[11px] text-text-secondary mt-1">
                    {todayTotalKm >= dailyTargetKm ? (
                      <span className="text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> ¡Meta de uso diario completada!
                      </span>
                    ) : (
                      <span>Te faltan ~{(dailyTargetKm - todayTotalKm).toFixed(1)} km para tu promedio diario.</span>
                    )}
                  </p>
                </div>
              </div>

              {/* Botón para inyectar recorrido simulado */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => simulateTrip(10)}
                  className="px-3 py-2 rounded-xl bg-river border border-tea/50 hover:border-amber-autumn text-text-primary text-xs font-bold transition-all flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5 text-amber-autumn" />
                  <span>+10 km</span>
                </button>
                <button
                  type="button"
                  onClick={() => simulateTrip(25)}
                  className="px-3 py-2 rounded-xl bg-amber-autumn text-river text-xs font-extrabold hover:brightness-110 shadow-amber-glow transition-all flex items-center gap-1"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>+25 km</span>
                </button>
              </div>
            </div>

            {/* Gráfico de Barras de Kilómetros por Día (Últimos días) */}
            <div className="space-y-2 pt-2 border-t border-tea/40">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-text-secondary">Historial de Kilómetros por Día</span>
                <span className="text-[10px] text-tea">Promedio: {dailyTargetKm} km/día</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {dailyUsageSummaries.slice(0, 8).map(sum => {
                  const isToday = sum.dayLabel === 'Hoy';
                  const km = isToday ? todayTotalKm : sum.totalKm;
                  const ratio = Math.min(100, Math.round((km / dailyTargetKm) * 100));

                  return (
                    <div
                      key={sum.date}
                      className={`p-2.5 rounded-xl border text-left flex flex-col justify-between ${
                        isToday
                          ? 'bg-amber-autumn/15 border-amber-autumn shadow-amber-glow'
                          : 'bg-river/60 border-tea/40'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] text-text-secondary">
                        <span className="font-bold">{sum.dayLabel}</span>
                        <span className="font-mono">{sum.tripsCount} {sum.tripsCount === 1 ? 'viaje' : 'viajes'}</span>
                      </div>

                      <div className="my-1.5">
                        <div className="text-base font-extrabold text-text-primary font-mono">
                          {km.toFixed(1)} <span className="text-[10px] font-normal text-text-secondary">km</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-tea/40 overflow-hidden mt-1">
                          <div
                            className={`h-full rounded-full ${ratio >= 100 ? 'bg-emerald-400' : 'bg-amber-autumn'}`}
                            style={{ width: `${ratio}%` }}
                          />
                        </div>
                      </div>

                      <span className="text-[9px] text-text-secondary font-mono">
                        {sum.totalDurationMinutes} min al volante
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* SECTOR 3: LISTADO DETALLADO DE VIAJES DEL AUTO */}
          <div className="p-4 rounded-2xl bg-carbon border border-tea/60 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-wood" />
                <h3 className="text-xs font-extrabold uppercase text-text-primary tracking-wide">
                  Tramos Registrados por Conexión Bluetooth
                </h3>
              </div>
              <span className="text-[10px] text-text-secondary">
                Odómetro del auto sincronizado
              </span>
            </div>

            {dailyUsageSummaries.length === 0 ? (
              <div className="text-center py-6 text-xs text-text-secondary">
                No hay viajes registrados aún. Conecta el Bluetooth o simula un recorrido.
              </div>
            ) : (
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {dailyUsageSummaries.flatMap(s => s.trips).slice(0, 10).map((trip) => (
                  <div
                    key={trip.id}
                    className="p-2.5 rounded-xl bg-river/60 border border-tea/30 flex items-center justify-between text-xs hover:border-tea transition-all"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-carbon border border-tea/40 flex items-center justify-center shrink-0">
                        <Bluetooth className="w-4 h-4 text-amber-autumn" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-text-primary">
                            {trip.date} • {trip.startTime} - {trip.endTime}
                          </span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-carbon text-text-secondary font-mono">
                            {trip.bluetoothDeviceName || 'BT'}
                          </span>
                        </div>
                        <span className="text-[10px] text-text-secondary">
                          Duración: {trip.durationMinutes} min • Velocidad prom: ~{trip.avgSpeedKmh} km/h
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-sm font-extrabold text-amber-autumn font-mono">
                        +{trip.distanceKm.toFixed(1)} km
                      </div>
                      <span className="text-[9px] text-emerald-400 font-semibold flex items-center justify-end gap-1">
                        <CheckCircle2 className="w-2.5 h-2.5" /> Registrado
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Pie del modal */}
        <div className="p-3 bg-carbon-surface border-t border-tea/50 flex items-center justify-between text-[11px] text-text-secondary">
          <span>
            Cada vez que tu vehículo esté conectado por Bluetooth, el sistema acumula telemetría hasta la desconexión.
          </span>
          <button
            onClick={() => setIsDailyTripsModalOpen(false)}
            className="px-4 py-1.5 rounded-xl bg-carbon hover:bg-river border border-tea text-text-primary font-bold text-xs"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
