import React from 'react';
import { useVehicle } from '../context/VehicleContext';
import { useLanguage } from '../context/LanguageContext';
import { ChevronRight, Gauge, Layers, Sparkles } from 'lucide-react';

export const VehicleCard: React.FC = () => {
  const { vehicle, telemetry, setActiveTab } = useVehicle();
  const { t } = useLanguage();

  // Odómetro del vehículo formateado con separador de miles
  const currentKm = vehicle.currentOdometer.toLocaleString('es-AR');
  const virtualKm = Math.round(telemetry.simulatedOdometer).toLocaleString('es-AR');

  // Nombre completo y dinámico del vehículo seleccionado
  const fullVehicleName = `${vehicle.brand} ${vehicle.model}`;

  return (
    <div 
      onClick={() => setActiveTab('garage')}
      className="mx-4 mb-4 p-4 rounded-card bg-carbon border border-tea/60 hover:border-amber-autumn/60 shadow-card pressable-card cursor-pointer transition-all group"
      title={t('garageCardAccessPrompt')}
    >
      {/* Encabezado de la Tarjeta de Acceso al Garaje */}
      <div className="flex items-center justify-between mb-2 pb-2 border-b border-tea/30">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-md bg-amber-autumn/15 flex items-center justify-center">
            <Layers className="w-3 h-3 text-amber-autumn" />
          </div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-autumn">
            {t('garageCardBadge')}
          </span>
          <span className="text-[10px] text-tea">•</span>
          <span className="text-[10px] text-text-secondary font-semibold">
            {t('garageCardSelected')}
          </span>
        </div>

        {/* Chip de Estado "All Good" */}
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-autumn/15 text-amber-autumn border border-amber-autumn/30">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-autumn animate-amber-pulse" />
          {t('allGoodBadge')}
        </span>
      </div>

      <div className="flex items-center justify-between">
        {/* Lado Izquierdo: Miniatura del auto y Datos Dinámicos del Vehículo Seleccionado */}
        <div className="flex items-center gap-3">
          {/* Miniatura con ícono / silueta estilizada */}
          <div className="w-12 h-12 rounded-2xl bg-river border border-tea/60 flex items-center justify-center p-2 shadow-inner group-hover:border-amber-autumn/40 transition-colors">
            <svg viewBox="0 0 40 25" className="w-8 h-5 text-amber-autumn" fill="currentColor">
              <path d="M5 14L8 7C9 5 12 4 15 4H25C28 4 31 5 32 7L35 14C37 15 38 17 38 19V21C38 21.5 37.5 22 37 22H35C34.5 22 34 21.5 34 21V20H6V21C6 21.5 5.5 22 5 22H3C2.5 22 2 21.5 2 21V19C2 17 3 15 5 14ZM9.5 8L7.2 13H32.8L30.5 8C30 7 28.5 6 27 6H13C11.5 6 10 7 9.5 8ZM8 17C9.1 17 10 16.1 10 15C10 13.9 9.1 13 8 13C6.9 13 6 13.9 6 15C6 16.1 6.9 17 8 17ZM32 17C33.1 17 34 16.1 34 15C34 13.9 33.1 13 32 13C30.9 13 30 13.9 30 15C30 16.1 30.9 17 32 17Z" />
            </svg>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-extrabold text-text-primary tracking-tight group-hover:text-amber-autumn transition-colors">
                {fullVehicleName}
              </h2>
            </div>

            {/* Patente y Odómetro */}
            <div className="flex items-center gap-2 mt-1 text-xs text-text-secondary flex-wrap">
              <span className="font-mono bg-river px-1.5 py-0.5 rounded text-[10px] font-bold text-text-primary border border-tea/50">
                {vehicle.licensePlate}
              </span>
              <span className="text-tea">•</span>
              <div className="flex items-center gap-1">
                <Gauge className="w-3.5 h-3.5 text-wood" />
                <span className="font-semibold text-text-primary">{currentKm} {t('kmUnit')}</span>
              </div>
              <span className="text-tea">•</span>
              <span className="text-[10px] text-text-secondary/80">
                {t('virtualOdometer')}: {virtualKm} {t('kmUnit')}
              </span>
            </div>
          </div>
        </div>

        {/* Chevron de acceso al Garaje */}
        <div className="w-8 h-8 rounded-full bg-river/70 flex items-center justify-center text-text-secondary group-hover:text-amber-autumn group-hover:bg-river transition-all shrink-0 ml-2">
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>

      {/* Cue inferior de navegación */}
      <div className="mt-2.5 pt-2 border-t border-tea/20 flex items-center justify-between text-[10px] text-text-secondary">
        <span className="flex items-center gap-1 group-hover:text-amber-autumn transition-colors font-medium">
          <Sparkles className="w-3 h-3 text-amber-autumn" />
          {t('garageCardAccessPrompt')}
        </span>
        <span className="text-amber-autumn font-bold">→</span>
      </div>
    </div>
  );
};
