import React from 'react';
import { useVehicle } from '../context/VehicleContext';
import { useLanguage } from '../context/LanguageContext';
import { Home, Fuel, Wrench, Radio, Layers, LucideIcon } from 'lucide-react';
import { ActiveTab } from '../types/vehicle';

export const TabBar: React.FC = () => {
  const { activeTab, setActiveTab } = useVehicle();
  const { t } = useLanguage();

  const tabs: { id: ActiveTab; label: string; icon: LucideIcon }[] = [
    { id: 'home', label: t('tabHome'), icon: Home },
    { id: 'fuel', label: t('tabFuel'), icon: Fuel },
    { id: 'services', label: t('tabServices'), icon: Wrench },
    { id: 'telemetry', label: t('tabTelemetry'), icon: Radio },
    { id: 'garage', label: t('tabGarage'), icon: Layers },
  ];

  return (
    <nav className="sticky bottom-0 inset-x-0 z-40 bg-carbon/95 backdrop-blur-md border-t border-tea/50 px-2 py-1.5 select-none">
      <div className="grid grid-cols-5 gap-1 w-full max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-amber-autumn/20 text-amber-autumn font-bold shadow-inner border border-amber-autumn/30 scale-[1.02]'
                  : 'text-text-secondary hover:text-text-primary hover:bg-river/40'
              }`}
            >
              <Icon 
                className={`w-4 h-4 mb-0.5 ${isActive ? 'text-amber-autumn stroke-[2.2]' : 'text-text-secondary stroke-[1.75]'}`} 
              />
              <span className={`text-[10px] leading-tight truncate w-full text-center ${isActive ? 'text-amber-autumn font-extrabold' : 'text-text-secondary'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
