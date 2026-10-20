import React from 'react';
import { useVehicle } from '../context/VehicleContext';
import { useLanguage } from '../context/LanguageContext';

export const VehicleHero: React.FC = () => {
  const { vehicles, selectedVehicleId, selectVehicle } = useVehicle();
  const { t } = useLanguage();

  const activeIndex = vehicles.findIndex(v => v.id === selectedVehicleId);
  const currentSlide = activeIndex >= 0 ? activeIndex : 0;

  return (
    <div className="relative pt-2 pb-4 px-4 overflow-hidden select-none">
      {/* 1. Título Hero Traducible */}
      <div className="text-center sm:text-left mb-3">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-text-primary leading-tight">
          {t('heroTitlePrefix')}{' '}
          <span className="text-amber-autumn">{t('heroTitleHighlight')}</span>{' '}
          {t('heroTitleSuffix')}
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary mt-1 font-normal">
          {t('heroSubtitle')}
        </p>
      </div>

      {/* 2. Escenario Ilustrado del Vehículo (Montañas al atardecer, carretera y SUV oscuro) */}
      <div className="relative w-full h-44 sm:h-52 rounded-3xl overflow-hidden bg-gradient-to-b from-[#2B2F2E] via-[#1B232B] to-[#13191F] border border-tea/40 shadow-inner flex flex-col justify-end">
        
        {/* Cielo crepuscular con tonos de Afternoon Tea y Tanned Wood */}
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-wood/40 via-tea/30 to-transparent pointer-events-none" />

        {/* Siluetas de Montañas de fondo */}
        <svg
          viewBox="0 0 500 150"
          className="absolute inset-x-0 bottom-10 w-full h-28 opacity-35 preserve-3d"
          preserveAspectRatio="none"
        >
          {/* Montañas lejanas */}
          <polygon
            points="0,150 40,85 110,120 180,60 270,110 360,50 440,105 500,80 500,150"
            fill="#594C3D"
          />
          {/* Montañas intermedias */}
          <polygon
            points="0,150 70,100 150,135 240,80 320,125 410,75 500,120 500,150"
            fill="#906D4B"
            opacity="0.6"
          />
        </svg>

        {/* Asfalto de la carretera */}
        <div className="absolute bottom-0 inset-x-0 h-14 bg-gradient-to-t from-[#13191F] to-[#2B2F2E]/80 border-t border-tea/30">
          {/* Línea central punteada en Tanned Wood tenue */}
          <div className="w-full h-[2px] mt-6 flex justify-between px-2 gap-4 opacity-40">
            <span className="flex-1 bg-wood/50 h-[2px]" />
            <span className="flex-1 bg-wood/50 h-[2px]" />
            <span className="flex-1 bg-wood/50 h-[2px]" />
            <span className="flex-1 bg-wood/50 h-[2px]" />
          </div>
        </div>

        {/* Haz de Luz Cálida de los Faros (Amber Headlights Glow) */}
        <div className="absolute bottom-6 right-2 sm:right-12 w-48 h-16 bg-gradient-to-r from-amber-autumn/40 via-amber-autumn/10 to-transparent blur-md rounded-full transform -rotate-6 pointer-events-none animate-headlights" />

        {/* Vehículo SVG Animado (Entrada + Respiración en bucle) */}
        <div className="relative z-10 w-full flex justify-center mb-1">
          <div className="animate-car-enter">
            <div className="animate-car-breathe">
              <svg
                width="270"
                height="92"
                viewBox="0 0 280 95"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="drop-shadow-[0_12px_18px_rgba(0,0,0,0.8)]"
              >
                {/* Sombra sobre el asfalto */}
                <ellipse cx="140" cy="88" rx="115" ry="5.5" fill="#000000" opacity="0.75" />

                {/* Carrocería SUV Principal (River Styx #13191F con reflejos Carbon #2B2F2E) */}
                <path
                  d="M25 65C30 50 48 48 68 46L95 28C110 21 160 21 185 28L215 44C235 46 250 52 255 65C258 72 254 76 248 76H32C26 76 22 72 25 65Z"
                  fill="#1B232B"
                  stroke="#594C3D"
                  strokeWidth="1.2"
                />

                {/* Cabina / Ventanillas */}
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

                {/* Parante B divisorio */}
                <line x1="145" y1="32" x2="145" y2="46" stroke="#2B2F2E" strokeWidth="2.5" />

                {/* Línea de Carrocería y Aerodinámica en Tanned Wood tenue */}
                <path d="M40 58C80 57 180 57 245 59" stroke="#906D4B" strokeWidth="1" strokeOpacity="0.5" />

                {/* Faros Delanteros Amber Autumn con destello de luz cálida */}
                <path
                  d="M242 55L254 58C255 60 252 64 246 64L240 60Z"
                  fill="#CA9C68"
                  className="filter drop-shadow-[0_0_8px_#CA9C68]"
                />
                <circle cx="251" cy="59" r="2.5" fill="#F2E6D6" />

                {/* Faros Traseros LED Rojizo/Amber */}
                <path
                  d="M26 56L33 58V63L27 62Z"
                  fill="#CA9C68"
                  opacity="0.85"
                />

                {/* Ruedas & Llantas con radios estilo Carbon Fibre */}
                {/* Rueda Trasera */}
                <g transform="translate(68, 73)">
                  <circle cx="0" cy="0" r="16.5" fill="#0E1318" stroke="#2B2F2E" strokeWidth="2" />
                  <circle cx="0" cy="0" r="10.5" fill="#2B2F2E" stroke="#594C3D" strokeWidth="1.5" />
                  <circle cx="0" cy="0" r="4.5" fill="#CA9C68" opacity="0.9" />
                  <line x1="0" y1="-9" x2="0" y2="9" stroke="#906D4B" strokeWidth="1" />
                  <line x1="-9" y1="0" x2="9" y2="0" stroke="#906D4B" strokeWidth="1" />
                </g>

                {/* Rueda Delantera */}
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
        </div>

        {/* 3. Indicador de Carrusel interactivo: cambia el vehículo activo en el Garaje */}
        <div className="relative z-20 flex justify-center items-center gap-2 pb-2.5">
          {vehicles.map((v, idx) => (
            <button
              key={v.id}
              onClick={() => selectVehicle(v.id)}
              className={`transition-all duration-300 rounded-full h-1.5 ${
                currentSlide === idx
                  ? 'w-6 bg-amber-autumn shadow-amber-glow'
                  : 'w-1.5 bg-tea/60 hover:bg-wood'
              }`}
              title={`${t('slideVehicle')} ${idx + 1}: ${v.brand} ${v.model}`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
