import React, { useState } from 'react';
import { useVehicle } from '../context/VehicleContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  Radio, 
  Play, 
  Square, 
  Sliders, 
  RotateCcw, 
  Trash2, 
  Cpu, 
  Compass, 
  Sparkles,
  Gauge,
  Bluetooth,
  Activity,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

export const TelemetrySimulatorView: React.FC = () => {
  const { 
    telemetry, 
    vehicle, 
    dailyRhythmKm, 
    simulateTrip, 
    toggleLiveGps, 
    restoreDemoData, 
    clearDatabase,
    bluetoothStatus,
    isBluetoothConnected,
    connectedDeviceName,
    activeTripKm,
    connectBluetooth,
    disconnectBluetooth,
    setIsDailyTripsModalOpen
  } = useVehicle();
  const { t } = useLanguage();

  const [simKmInput, setSimKmInput] = useState<number>(35);

  const handleSimulateTrip = () => {
    simulateTrip(simKmInput);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 pb-20 lg:pb-8 space-y-4 select-none">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-extrabold text-amber-autumn uppercase tracking-wider">
              {t('telemetrySectionBadge')}
            </span>
            <span className="text-[9px] text-tea">•</span>
            <span className="text-[9px] bg-carbon px-2 py-0.5 rounded-full border border-tea/50 text-text-secondary font-mono">
              BLUETOOTH + DEAD RECKONING + RECORRIDOS DIARIOS
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-text-primary tracking-tight mt-0.5">
            {t('telemetryTitle')}
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
            {t('telemetrySubtitle')}
          </p>
        </div>

        {/* Acciones de Base de Datos Uniformes */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              if (window.confirm(t('resetConfirm'))) {
                restoreDemoData();
              }
            }}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 py-2 px-3.5 rounded-xl bg-carbon border border-tea hover:border-amber-autumn text-text-secondary hover:text-amber-autumn text-xs font-semibold transition-all whitespace-nowrap"
            title={t('restoreDemoDataBtn')}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t('restoreDemoDataBtn')}</span>
          </button>

          <button
            onClick={() => {
              if (window.confirm(t('clearDbConfirm'))) {
                clearDatabase();
              }
            }}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 py-2 px-3.5 rounded-xl bg-red-950/30 border border-red-500/40 hover:bg-red-900/40 text-red-300 text-xs font-semibold transition-all whitespace-nowrap"
            title={t('clearDbBtn')}
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{t('clearDbBtn')}</span>
          </button>
        </div>
      </div>

      {/* PANEL DESTACADO: TELEMETRÍA BLUETOOTH & PODÓMETRO VEHICULAR */}
      <div className="p-4 rounded-3xl bg-carbon border border-tea/60 shadow-card space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-2xl flex items-center justify-center border ${
              isBluetoothConnected
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                : 'bg-river border-tea/40 text-amber-autumn'
            }`}>
              <Bluetooth className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xs font-extrabold text-text-primary uppercase tracking-wide">
                  Conexión Bluetooth en Movimiento (Podómetro Vehicular)
                </h2>
                {isBluetoothConnected && (
                  <span className="inline-flex items-center gap-1 text-[9px] font-extrabold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-500/40">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    ACTIVO
                  </span>
                )}
              </div>
              <p className="text-[11px] text-text-secondary">
                Auto activo: <strong className="text-text-primary">{vehicle.brand} {vehicle.model}</strong> • BT: <strong className="text-amber-autumn font-mono">{vehicle.bluetoothDeviceName || 'Sin asignar'}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isBluetoothConnected ? (
              <button
                type="button"
                onClick={disconnectBluetooth}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-950/40 border border-red-500/50 text-red-300 font-bold text-xs hover:bg-red-900/50 transition-all"
              >
                <Square className="w-3 h-3 fill-current" />
                <span>Desconectar BT</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => connectBluetooth(vehicle.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs transition-all shadow-md"
              >
                <Bluetooth className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Conectar Bluetooth</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsDailyTripsModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-river hover:bg-carbon border border-tea text-amber-autumn font-extrabold text-xs transition-all"
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Ver Pestaña Flotante Diaria</span>
            </button>
          </div>
        </div>

        {isBluetoothConnected && (
          <div className="p-3 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 flex items-center justify-between text-xs">
            <span className="text-emerald-300 flex items-center gap-1.5 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Midiendo trayecto en movimiento: +{activeTripKm.toFixed(2)} km acumulados en la sesión actual
            </span>
            <span className="text-text-secondary text-[11px] font-mono">
              Se guardará al desconectar
            </span>
          </div>
        )}
      </div>

      {/* Tarjetas Principales de Telemetría */}
      <div className="grid grid-cols-1 gap-2.5">
        {/* Odómetro de Tablero vs Odómetro Virtual */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="p-3 rounded-2xl bg-carbon border border-tea/60 flex flex-col justify-between">
            <div className="flex items-center justify-between text-[10px] text-text-secondary mb-1">
              <span className="font-bold uppercase tracking-wider">{t('realOdoLabel')}</span>
              <Gauge className="w-3.5 h-3.5 text-wood" />
            </div>
            <div>
              <div className="text-lg sm:text-xl font-extrabold text-text-primary font-mono">
                {vehicle.currentOdometer.toLocaleString('es-AR')} <span className="text-xs font-normal text-text-secondary">{t('kmUnit')}</span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-carbon border border-amber-autumn/50 shadow-amber-glow flex flex-col justify-between">
            <div className="flex items-center justify-between text-[10px] text-amber-autumn mb-1">
              <span className="font-bold uppercase tracking-wider">{t('virtualOdoLabel')}</span>
              <Radio className="w-3.5 h-3.5 text-amber-autumn animate-pulse" />
            </div>
            <div>
              <div className="text-lg sm:text-xl font-extrabold text-amber-autumn font-mono">
                {Math.round(telemetry.simulatedOdometer).toLocaleString('es-AR')} <span className="text-xs font-normal text-text-secondary">{t('kmUnit')}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-carbon border border-tea/60 flex items-center justify-between text-xs">
          <div>
            <span className="text-text-secondary text-[11px] block">{t('alphaLabel')}</span>
            <strong className="text-amber-autumn text-sm font-mono">α = {telemetry.correctionFactorAlpha}</strong>
          </div>
          <div>
            <span className="text-text-secondary text-[11px] block">{t('lastCalibrationError')}</span>
            <strong className="text-text-primary text-sm font-mono">±{telemetry.calibrationErrorDeltaKm} km</strong>
          </div>
          <div>
            <span className="text-text-secondary text-[11px] block">{t('accumulatedKm')}</span>
            <strong className="text-text-primary text-sm font-mono">{telemetry.accumulatedTelemetryKm.toFixed(1)} km</strong>
          </div>
        </div>
      </div>

      {/* Controles de Simulación de Viajes */}
      <div className="space-y-3">
        {/* Panel 1: Simulador con Deslizador (Virtual Trip) */}
        <div className="p-4 rounded-2xl bg-carbon border border-tea/60 shadow-card space-y-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-amber-autumn" />
            <h2 className="text-xs font-bold text-text-primary uppercase tracking-wide">
              {t('simTripTitle')}
            </h2>
          </div>

          <div className="space-y-2 p-3 rounded-xl bg-river/60 border border-tea/40">
            <div className="flex justify-between items-center text-xs">
              <span className="text-text-secondary font-semibold">{t('simKmLabel')}:</span>
              <span className="text-sm font-extrabold text-amber-autumn font-mono">{simKmInput} km</span>
            </div>

            <input
              type="range"
              min="5"
              max="200"
              step="5"
              value={simKmInput}
              onChange={(e) => setSimKmInput(Number(e.target.value))}
              className="w-full accent-amber-autumn cursor-pointer"
            />
          </div>

          <button
            onClick={handleSimulateTrip}
            className="w-full py-2 px-3 rounded-xl bg-amber-autumn text-river font-extrabold text-xs hover:brightness-110 shadow-amber-glow transition-all flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('btnSimulateTrip')} (+{simKmInput} km)</span>
          </button>
        </div>

        {/* Panel 2: Web Geolocation API en Vivo */}
        <div className="p-4 rounded-2xl bg-carbon border border-tea/60 shadow-card space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-wood" />
              <h2 className="text-xs font-bold text-text-primary uppercase tracking-wide">
                {t('liveGpsTitle')}
              </h2>
            </div>
            {telemetry.isLiveGpsActive ? (
              <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-500/40">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                {t('gpsActiveBadge')}
              </span>
            ) : (
              <span className="text-[9px] font-bold text-text-secondary bg-river px-2 py-0.5 rounded-full border border-tea/40">
                {t('gpsInactiveBadge')}
              </span>
            )}
          </div>

          <button
            onClick={toggleLiveGps}
            className={`w-full py-2 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
              telemetry.isLiveGpsActive
                ? 'bg-red-950/40 border border-red-500/50 text-red-300 hover:bg-red-900/50'
                : 'bg-carbon border border-wood text-wood hover:bg-wood hover:text-river'
            }`}
          >
            {telemetry.isLiveGpsActive ? (
              <>
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>{t('btnStopGps')}</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{t('btnStartGps')}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
