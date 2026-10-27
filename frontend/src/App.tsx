import React from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { VehicleProvider, useVehicle } from './context/VehicleContext';
import { HomeView } from './components/HomeView';
import { FuelMatrixView } from './components/FuelMatrixView';
import { ServicePlannerView } from './components/ServicePlannerView';
import { TelemetrySimulatorView } from './components/TelemetrySimulatorView';
import { GarageView } from './components/GarageView';
import { SimulatorFrame } from './components/SimulatorFrame';
import { AddFuelModal } from './components/AddFuelModal';
import { PerformServiceModal } from './components/PerformServiceModal';
import { DailyTripsFloatingButton } from './components/DailyTripsFloatingButton';
import { DailyTripsFloatingModal } from './components/DailyTripsFloatingModal';

const AppContent: React.FC = () => {
  const { activeTab } = useVehicle();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'home':
        return <HomeView />;
      case 'fuel':
        return <FuelMatrixView />;
      case 'services':
        return <ServicePlannerView />;
      case 'telemetry':
        return <TelemetrySimulatorView />;
      case 'garage':
        return <GarageView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0E1318] flex flex-col font-sans">
      <SimulatorFrame>
        {renderActiveView()}
      </SimulatorFrame>

      {/* Botón Flotante y Modal de Telemetría Diaria / Podómetro Vehicular */}
      <DailyTripsFloatingButton />
      <DailyTripsFloatingModal />

      {/* Modales Globales */}
      <AddFuelModal />
      <PerformServiceModal />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <LanguageProvider>
      <VehicleProvider>
        <AppContent />
      </VehicleProvider>
    </LanguageProvider>
  );
};

export default App;
