import React from 'react';
import { useVehicle } from '../context/VehicleContext';
import { useLanguage } from '../context/LanguageContext';
import { Vehicle3DViewer } from './Vehicle3DViewer';
import { Sparkles, Image as ImageIcon, ChevronLeft, ChevronRight, Box, ArrowUpRight } from 'lucide-react';

export const VehicleHero: React.FC = () => {
  const { vehicles, selectedVehicleId, selectVehicle, vehicle, setActiveTab } = useVehicle();
  const { t } = useLanguage();

  const activeIndex = vehicles.findIndex(v => v.id === selectedVehicleId);
  const currentSlide = activeIndex >= 0 ? activeIndex : 0;

  const handlePrevVehicle = () => {
    const prevIdx = (currentSlide - 1 + vehicles.length) % vehicles.length;
    selectVehicle(vehicles[prevIdx].id);
  };

  const handleNextVehicle = () => {
    const nextIdx = (currentSlide + 1) % vehicles.length;
    selectVehicle(vehicles[nextIdx].id);
  };

  // Determinar automáticamente si este vehículo tiene animación 3D o silueta 2D (sin selector dual)
  const is3DVehicle = vehicle.has3dAnimation !== false && Boolean(vehicle.model3dPath);

  return (
    <div className="relative pt-2 pb-4 px-4 overflow-hidden select-none">
      {/* 1. Título Hero e Identificador Automático de Modo */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-text-primary leading-tight">
            {t('heroTitlePrefix')}{' '}
            <span className="text-amber-autumn">{t('heroTitleHighlight')}</span>{' '}
            {t('heroTitleSuffix')}
          </h1>
          <p className="text-xs text-text-secondary mt-0.5 font-normal">
            {t('heroSubtitle')}
          </p>
        </div>

        {/* Badge Informativo según el Tipo de Vehículo Elegido */}
        <div className="shrink-0 pt-0.5">
          {is3DVehicle ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[10px] font-extrabold bg-amber-autumn/15 border border-amber-autumn/40 text-amber-autumn shadow-amber-glow">
              <Sparkles className="w-3 h-3 text-amber-autumn" />
              <span>Animación 3D</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[10px] font-bold bg-river border border-tea/50 text-text-secondary">
              <ImageIcon className="w-3 h-3 text-wood" />
              <span>Silueta 2D</span>
            </span>
          )}
        </div>
      </div>

      {/* 2. Escenario del Vehículo: Render 3D o Ilustración 2D según corresponda al vehículo elegido */}
      {is3DVehicle ? (
        <div className="relative group">
          {/* Visualizador WebGL 3D */}
          <Vehicle3DViewer
            bodyType={vehicle.bodyType || 'sedan'}
            model3dPath={vehicle.model3dPath}
            modelName={`${vehicle.brand} ${vehicle.model}`}
            heightClass="h-52 sm:h-64"
          />

          {/* Flecha Izquierda para cambiar de vehículo */}
          <button
            type="button"
            onClick={handlePrevVehicle}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-carbon/80 hover:bg-carbon text-text-secondary hover:text-amber-autumn border border-tea/50 backdrop-blur-md transition-all opacity-80 hover:opacity-100 hover:scale-110 shadow-lg z-20"
            title="Vehículo anterior"
            aria-label="Vehículo anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Flecha Derecha para cambiar de vehículo */}
          <button
            type="button"
            onClick={handleNextVehicle}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-carbon/80 hover:bg-carbon text-text-secondary hover:text-amber-autumn border border-tea/50 backdrop-blur-md transition-all opacity-80 hover:opacity-100 hover:scale-110 shadow-lg z-20"
            title="Vehículo siguiente"
            aria-label="Vehículo siguiente"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Barra inferior de estado del modelo 3D y selector de vehículos */}
          <div className="pt-2.5 px-1 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 overflow-x-auto max-w-[270px] pb-1">
                {vehicles.map((v) => {
                  const isSelected = v.id === selectedVehicleId;
                  const vHas3D = v.has3dAnimation !== false && Boolean(v.model3dPath);
                  return (
                    <button
                      key={v.id}
                      onClick={() => selectVehicle(v.id)}
                      className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1.5 whitespace-nowrap border shrink-0 ${
                        isSelected
                          ? 'bg-amber-autumn text-river border-amber-autumn shadow-amber-glow font-extrabold'
                          : 'bg-carbon/80 text-text-secondary border-tea/40 hover:text-text-primary hover:border-tea'
                      }`}
                    >
                      {vHas3D ? <Box className="w-3 h-3 shrink-0" /> : <ImageIcon className="w-3 h-3 shrink-0" />}
                      <span>{v.model.split(' ')[0]}</span>
                    </button>
                  );
                })}
              </div>

              {/* Enlace rápido para ver ficha completa en el Garaje */}
              <button
                onClick={() => setActiveTab('garage')}
                className="flex items-center gap-1 text-[11px] font-bold text-amber-autumn hover:underline shrink-0 whitespace-nowrap"
              >
                <span>Garaje</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative group">
          <div className="relative w-full h-52 sm:h-64 rounded-3xl overflow-hidden bg-gradient-to-b from-[#2B2F2E] via-[#1B232B] to-[#13191F] border border-tea/40 shadow-inner flex flex-col justify-between p-4">
            {/* Cielo crepuscular con tonos cálidos */}
            <div className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-wood/40 via-tea/30 to-transparent pointer-events-none" />

            {/* Siluetas de Montañas de fondo */}
            <svg
              viewBox="0 0 500 150"
              className="absolute inset-x-0 bottom-12 w-full h-28 opacity-35 preserve-3d"
              preserveAspectRatio="none"
            >
              <polygon
                points="0,150 40,85 110,120 180,60 270,110 360,50 440,105 500,80 500,150"
                fill="#594C3D"
              />
              <polygon
                points="0,150 70,100 150,135 240,80 320,125 410,75 500,120 500,150"
                fill="#906D4B"
                opacity="0.6"
              />
            </svg>

            {/* Asfalto de la carretera */}
            <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-[#13191F] to-[#2B2F2E]/80 border-t border-tea/30">
              <div className="w-full h-[2px] mt-7 flex justify-between px-2 gap-4 opacity-40">
                <span className="flex-1 bg-wood/50 h-[2px]" />
                <span className="flex-1 bg-wood/50 h-[2px]" />
                <span className="flex-1 bg-wood/50 h-[2px]" />
                <span className="flex-1 bg-wood/50 h-[2px]" />
              </div>
            </div>

            {/* Haz de Luz Cálida de los Faros */}
            <div className="absolute bottom-7 right-4 sm:right-16 w-52 h-16 bg-gradient-to-r from-amber-autumn/40 via-amber-autumn/10 to-transparent blur-md rounded-full transform -rotate-6 pointer-events-none animate-headlights" />

            {/* Encabezado con datos del auto 2D */}
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase text-wood tracking-wider">
                  Silueta 2D Ilustrada
                </span>
                <h3 className="text-base font-extrabold text-text-primary">
                  {vehicle.brand} {vehicle.model}
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded-lg font-mono text-[11px] font-bold bg-carbon/90 border border-tea/50 text-amber-autumn">
                {vehicle.licensePlate}
              </span>
            </div>

            {/* Vehículo SVG Ilustrado */}
            <div className="relative z-10 w-full flex justify-center my-auto">
              <div className="animate-car-breathe">
                <svg
                  width="280"
                  height="96"
                  viewBox="0 0 280 95"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="drop-shadow-[0_12px_18px_rgba(0,0,0,0.8)]"
                >
                  <ellipse cx="140" cy="88" rx="115" ry="5.5" fill="#000000" opacity="0.75" />
                  <path
                    d="M25 65C30 50 48 48 68 46L95 28C110 21 160 21 185 28L215 44C235 46 250 52 255 65C258 72 254 76 248 76H32C26 76 22 72 25 65Z"
                    fill="#1B232B"
                    stroke="#594C3D"
                    strokeWidth="1.2"
                  />
                  <path
                    d="M98 32L75 46H180L172 32H102Z"
                    fill="#13191F"
                    stroke="#594C3D"
                    strokeWidth="0.8"
                  />
                  <path
                    d="M185 33L192 46H212L194 33H185Z"
                    fill="#13191F"
                    stroke="#594C3D"
                    strokeWidth="0.8"
                  />
                  <path
                    d="M245 60L258 63L256 68L243 65Z"
                    fill="#CA9C68"
                    opacity="0.85"
                  />
                  <g transform="translate(68, 73)">
                    <circle cx="0" cy="0" r="16.5" fill="#0E1318" stroke="#2B2F2E" strokeWidth="2" />
                    <circle cx="0" cy="0" r="10.5" fill="#2B2F2E" stroke="#594C3D" strokeWidth="1.5" />
                    <circle cx="0" cy="0" r="4.5" fill="#CA9C68" opacity="0.9" />
                    <line x1="0" y1="-9" x2="0" y2="9" stroke="#906D4B" strokeWidth="1" />
                    <line x1="-9" y1="0" x2="9" y2="0" stroke="#906D4B" strokeWidth="1" />
                  </g>
                  <g transform="translate(205, 73)">
                    <circle cx="0" cy="0" r="16.5" fill="#0E1318" stroke="#2B2F2E" strokeWidth="2" />
                    <circle cx="0" cy="0" r="10.5" fill="#2B2F2E" stroke="#594C3D" strokeWidth="1.5" />
                    <circle cx="0" cy="0" r="4.5" fill="#CA9C68" opacity="0.9" />
                    <line x1="0" y1="-9" x2="0" y2="9" stroke="#906D4B" strokeWidth="1" />
                    <line x1="-9" y1="0" x2="9" y2="0" stroke="#906D4B" strokeWidth="1" />
                  </g>
                </svg>
              </div>
            </div>

            {/* Flecha Izquierda para cambiar de vehículo */}
            <button
              type="button"
              onClick={handlePrevVehicle}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-carbon/80 hover:bg-carbon text-text-secondary hover:text-amber-autumn border border-tea/50 backdrop-blur-md transition-all opacity-80 hover:opacity-100 hover:scale-110 shadow-lg z-20"
              title="Vehículo anterior"
              aria-label="Vehículo anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Flecha Derecha para cambiar de vehículo */}
            <button
              type="button"
              onClick={handleNextVehicle}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-carbon/80 hover:bg-carbon text-text-secondary hover:text-amber-autumn border border-tea/50 backdrop-blur-md transition-all opacity-80 hover:opacity-100 hover:scale-110 shadow-lg z-20"
              title="Vehículo siguiente"
              aria-label="Vehículo siguiente"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Enlace al garaje */}
            <div className="relative z-10 flex items-center justify-between text-[11px] pt-1">
              <span className="text-text-secondary font-mono">
                {vehicle.currentOdometer.toLocaleString('es-AR')} km • {vehicle.fuelType}
              </span>
              <button
                onClick={() => setActiveTab('garage')}
                className="flex items-center gap-1 font-bold text-amber-autumn hover:underline"
              >
                <span>Garaje</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Selector de vehículos */}
          <div className="pt-2.5 px-1 flex items-center gap-1.5 overflow-x-auto max-w-full pb-1">
            {vehicles.map((v) => {
              const isSelected = v.id === selectedVehicleId;
              const vHas3D = v.has3dAnimation !== false && Boolean(v.model3dPath);
              return (
                <button
                  key={v.id}
                  onClick={() => selectVehicle(v.id)}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1.5 whitespace-nowrap border shrink-0 ${
                    isSelected
                      ? 'bg-amber-autumn text-river border-amber-autumn shadow-amber-glow font-extrabold'
                      : 'bg-carbon/80 text-text-secondary border-tea/40 hover:text-text-primary hover:border-tea'
                  }`}
                >
                  {vHas3D ? <Box className="w-3 h-3 shrink-0" /> : <ImageIcon className="w-3 h-3 shrink-0" />}
                  <span>{v.model.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
