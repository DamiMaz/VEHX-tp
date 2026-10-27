import React from 'react';
import { useVehicle } from '../context/VehicleContext';
import { useLanguage } from '../context/LanguageContext';
import { Leaf, Clock, Fuel } from 'lucide-react';

export const StatCardRow: React.FC = () => {
  const { processedFuelLogs } = useVehicle();
  const { t } = useLanguage();

  // Calcular rendimiento promedio reciente
  const recentLogsWithEfficiency = processedFuelLogs.filter(l => l.realEfficiencyKmPerL !== null);
  const avgEfficiency = recentLogsWithEfficiency.length > 0
    ? (recentLogsWithEfficiency.reduce((acc, l) => acc + (l.realEfficiencyKmPerL || 0), 0) / recentLogsWithEfficiency.length).toFixed(1)
    : '14.8';

  // Sparkline en Amber (puntos representativos de los últimos meses)
  const sparklinePoints = [10, 18, 14, 22, 19, 25, 23, 28];
  const maxPoint = Math.max(...sparklinePoints);
  const minPoint = Math.min(...sparklinePoints);
  const svgSparklinePath = sparklinePoints
    .map((val, idx) => {
      const x = (idx / (sparklinePoints.length - 1)) * 64;
      const y = 24 - ((val - minPoint) / (maxPoint - minPoint || 1)) * 20;
      return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');

  // Mini barras para Drive Time en Tanned Wood (#906D4B)
  const barHeights = [40, 65, 50, 85, 70, 95];

  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 select-none">
      {/* 1. Tarjeta Avg. Fuel km/L con sparkline Amber */}
      <div className="p-2.5 rounded-2xl bg-carbon border border-tea/50 hover:border-amber-autumn/40 transition-all flex flex-col justify-between min-h-[102px]">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[9px] font-bold text-text-secondary uppercase">
            {t('statFuelAvg')}
          </span>
          <Fuel className="w-3.5 h-3.5 text-amber-autumn" />
        </div>

        <div>
          <div className="text-base font-extrabold text-text-primary tracking-tight">
            {avgEfficiency}
          </div>
          <span className="text-[9px] text-text-secondary">{t('kmUnit')}/L</span>
        </div>

        {/* Mini Sparkline SVG en Amber Autumn */}
        <div className="mt-1.5 h-5 w-full">
          <svg viewBox="0 0 64 24" className="w-full h-full overflow-visible">
            <path
              d={svgSparklinePath}
              fill="none"
              stroke="#CA9C68"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle
              cx="64"
              cy={24 - ((sparklinePoints[sparklinePoints.length - 1] - minPoint) / (maxPoint - minPoint || 1)) * 20}
              r="2.5"
              fill="#CA9C68"
            />
          </svg>
        </div>
      </div>

      {/* 2. Tarjeta Drive Time This Month con mini bar chart Tanned Wood */}
      <div className="p-2.5 rounded-2xl bg-carbon border border-tea/50 hover:border-amber-autumn/40 transition-all flex flex-col justify-between min-h-[102px]">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[9px] font-bold text-text-secondary uppercase">
            {t('statDriveTime')}
          </span>
          <Clock className="w-3.5 h-3.5 text-wood" />
        </div>

        <div>
          <div className="text-base font-extrabold text-text-primary tracking-tight">
            42 <span className="text-[10px] font-normal text-text-secondary">{t('hrsUnit')}</span>
          </div>
          <span className="text-[9px] text-text-secondary">{t('statThisMonth')}</span>
        </div>

        {/* Mini Gráfico de Barras en Tanned Wood (#906D4B) */}
        <div className="mt-1.5 h-5 flex items-end justify-between gap-0.5 px-0.5">
          {barHeights.map((h, i) => (
            <div
              key={i}
              className="w-1.5 rounded-t bg-wood hover:bg-amber-autumn transition-all"
              style={{ height: `${h}%` }}
              title={`Semana ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* 3. Tarjeta Drive Score con badge Eco y hoja en Amber */}
      <div className="p-2.5 rounded-2xl bg-carbon border border-tea/50 hover:border-amber-autumn/40 transition-all flex flex-col justify-between min-h-[102px]">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[9px] font-bold text-text-secondary uppercase">
            {t('statDriveScore')}
          </span>
          <span className="inline-flex items-center gap-0.5 px-1 py-0.2 rounded-full text-[8px] font-bold bg-amber-autumn/20 text-amber-autumn border border-amber-autumn/30">
            <Leaf className="w-2.5 h-2.5 text-amber-autumn" />
            {t('statEco')}
          </span>
        </div>

        <div>
          <div className="text-base sm:text-lg font-extrabold text-text-primary tracking-tight">
            92
          </div>
          <span className="text-[9px] text-text-secondary">{t('statOverallScore')}</span>
        </div>

        {/* Indicador de barra de score */}
        <div className="mt-1.5 w-full bg-tea/60 h-1.5 rounded-full overflow-hidden">
          <div
            className="h-full bg-amber-autumn rounded-full shadow-amber-glow"
            style={{ width: '92%' }}
          />
        </div>
      </div>
    </div>
  );
};
