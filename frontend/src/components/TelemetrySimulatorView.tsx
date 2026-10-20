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
  Gauge
} from 'lucide-react';

export const TelemetrySimulatorView: React.FC = () => {
  const { 
    telemetry, 
    vehicle, 
    dailyRhythmKm, 
    simulateTrip, 
    toggleLiveGps, 
    restoreDemoData, 
    clearDatabase 
  } = useVehicle();
  const { t } = useLanguage();

  const [simKmInput, setSimKmInput] = useState<number>(35);

  const handleSimulateTrip = () => {
    simulateTrip(simKmInput);
  };

  return (
    <div className="p-3 sm:p-5 space-y-4 max-w-7xl mx-auto select-none">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold text-amber-autumn uppercase tracking-wider">
              {t('telemetrySectionBadge')}
            </span>
            <span className="text-[10px] bg-carbon px-2 py-0.5 rounded-full border border-tea/50 text-text-secondary">
              {t('telemetrySectionSub')}
            </span>
          </div>
          <h1 className="text-lg sm:text-xl font-extrabold text-text-primary tracking-tight">
            {t('telemetryTitle')}
          </h1>
          <p className="text-xs text-text-secondary mt-0.5">
            {t('telemetrySubtitle')}
          </p>
        </div>

        {/* Acciones de Base de Datos */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (window.confirm(t('resetConfirm'))) {
                restoreDemoData();
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-carbon border border-tea hover:border-amber-autumn text-text-secondary hover:text-amber-autumn text-xs font-semibold transition-all"
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
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-950/30 border border-red-500/40 hover:bg-red-900/40 text-red-300 text-xs font-semibold transition-all"
            title={t('clearDbBtn')}
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{t('clearDbBtn')}</span>
          </button>
        </div>
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
              <div className="text-lg sm:text-xl font-extrabold text-text-primary">
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
              <div className="text-lg sm:text-xl font-extrabold text-amber-autumn">
                {Math.round(telemetry.simulatedOdometer).toLocaleString('es-AR')} <span className="text-xs font-normal text-text-secondary">{t('kmUnit')}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-carbon border border-tea/60 flex items-center justify-between text-xs">
          <div>
            <span className="text-text-secondary text-[11px] block">{t('alphaLabel')}</span>
            <strong className="text-amber-autumn text-sm">α = {telemetry.correctionFactorAlpha}</strong>
          </div>
          <div>
            <span className="text-text-secondary text-[11px] block">{t('lastCalibrationError')}</span>
            <strong className="text-text-primary text-sm">±{telemetry.calibrationErrorDeltaKm} km</strong>
          </div>
          <div>
            <span className="text-text-secondary text-[11px] block">{t('accumulatedKm')}</span>
            <strong className="text-text-primary text-sm">{telemetry.accumulatedTelemetryKm.toFixed(1)} km</strong>
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
              <span className="text-sm font-extrabold text-amber-autumn">{simKmInput} km</span>
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
