import React from 'react';
import { VehicleHero } from './VehicleHero';
import { VehicleCard } from './VehicleCard';
import { QuickActionTiles } from './QuickActionTiles';
import { NextServiceDueCard } from './NextServiceDueCard';
import { StatCardRow } from './StatCardRow';

export const HomeView: React.FC = () => {
  return (
    <div className="pb-20 max-w-lg mx-auto sm:max-w-2xl">
      {/* 1. Hero del Vehículo con silueta SUV animada, paisaje crepuscular y carrusel de 4 puntos */}
      <VehicleHero />

      {/* 2. Tarjeta "My Vehicle" */}
      <VehicleCard />

      {/* 3. Cuatro tiles de acciones rápidas */}
      <QuickActionTiles />

      {/* 4. Tarjeta "Next Service Due" con barra de progreso y botón Book Now */}
      <NextServiceDueCard />

      {/* 5. Tres tarjetas métricas (Avg Fuel km/L sparkline, Drive Time bars, Drive Score eco) */}
      <StatCardRow />
    </div>
  );
};
