import React from 'react';
import { VehicleHero } from './VehicleHero';
import { VehicleCard } from './VehicleCard';
import { QuickActionTiles } from './QuickActionTiles';
import { NextServiceDueCard } from './NextServiceDueCard';
import { StatCardRow } from './StatCardRow';

export const HomeView: React.FC = () => {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 pb-20 lg:pb-8 space-y-4">
      {/* 1. Hero del Vehículo con visualizador 3D y switch 2D/3D */}
      <VehicleHero />

      {/* Grid para Tarjeta My Vehicle y Próximo Service en Desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 2. Tarjeta "My Vehicle" */}
        <VehicleCard />

        {/* 4. Tarjeta "Next Service Due" con barra de progreso y botón Book Now */}
        <NextServiceDueCard />
      </div>

      {/* 3. Cuatro tiles de acciones rápidas */}
      <QuickActionTiles />

      {/* 5. Tres tarjetas métricas (Avg Fuel km/L, Drive Time, Drive Score) */}
      <StatCardRow />
    </div>
  );
};
