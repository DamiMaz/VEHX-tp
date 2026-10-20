import React from 'react';
import { useVehicle } from '../context/VehicleContext';
import { useLanguage } from '../context/LanguageContext';
import { Activity, Fuel, Wrench, Wallet } from 'lucide-react';

export const QuickActionTiles: React.FC = () => {
  const { setActiveTab, setIsAddFuelModalOpen } = useVehicle();
  const { t } = useLanguage();

  const tiles = [
    {
      id: 'health',
      label: t('quickHealth'),
      icon: Activity,
      iconColor: 'text-amber-autumn',
      bgColor: 'bg-amber-autumn/10',
      borderColor: 'border-amber-autumn/30',
      action: () => setActiveTab('telemetry')
    },
    {
      id: 'fuel',
      label: t('quickFuel'),
      icon: Fuel,
      iconColor: 'text-wood',
      bgColor: 'bg-wood/10',
      borderColor: 'border-wood/30',
      action: () => setIsAddFuelModalOpen(true)
    },
    {
      id: 'services',
      label: t('quickServices'),
      icon: Wrench,
      iconColor: 'text-amber-autumn',
      bgColor: 'bg-amber-autumn/10',
      borderColor: 'border-amber-autumn/30',
      action: () => setActiveTab('services')
    },
    {
      id: 'expenses',
      label: t('quickExpenses'),
      icon: Wallet,
      iconColor: 'text-wood',
      bgColor: 'bg-wood/10',
      borderColor: 'border-wood/30',
      action: () => setActiveTab('fuel')
    }
  ];

  return (
    <div className="grid grid-cols-4 gap-2 mx-4 mb-4 select-none">
      {tiles.map((tile) => {
        const Icon = tile.icon;
        return (
          <button
            key={tile.id}
            onClick={tile.action}
            className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-carbon border border-tea/50 hover:border-amber-autumn/40 transition-all pressable-card group focus:outline-none"
          >
            <div className={`w-10 h-10 rounded-xl ${tile.bgColor} border ${tile.borderColor} flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform`}>
              <Icon className={`w-4 h-4 ${tile.iconColor}`} strokeWidth={1.8} />
            </div>
            <span className="text-[10px] font-semibold text-text-primary text-center leading-tight">
              {tile.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};
