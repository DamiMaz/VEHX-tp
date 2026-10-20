import React, { useState } from 'react';
import { useVehicle } from '../context/VehicleContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  Fuel, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Plus, 
  DollarSign, 
  Gauge, 
  CheckCircle2
} from 'lucide-react';

export const FuelMatrixView: React.FC = () => {
  const { 
    monthlyMatrix, 
    processedFuelLogs, 
    setIsAddFuelModalOpen 
  } = useVehicle();
  const { t, language } = useLanguage();

  const [activeSubTab, setActiveSubTab] = useState<'matrix' | 'history'>('matrix');

  // Totales acumulados
  const totalSpend = monthlyMatrix.reduce((acc, m) => acc + m.totalCost, 0);
  const totalKm = monthlyMatrix.reduce((acc, m) => acc + m.totalDistanceKm, 0);
  const totalLiters = monthlyMatrix.reduce((acc, m) => acc + m.totalLiters, 0);
  const avgEfficiencyGlobal = totalLiters > 0 ? (totalKm / totalLiters).toFixed(2) : '0';
  const avgCostPerKmGlobal = totalKm > 0 ? (totalSpend / totalKm).toFixed(2) : '0';

  return (
    <div className="p-3 sm:p-5 space-y-4 max-w-7xl mx-auto select-none">
      {/* Encabezado de la Sección */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold text-amber-autumn uppercase tracking-wider">
              {t('fuelSectionBadge')}
            </span>
            <span className="text-[10px] bg-carbon px-2 py-0.5 rounded-full border border-tea/50 text-text-secondary">
              {t('fuelSectionSub')}
            </span>
          </div>
          <h1 className="text-lg sm:text-xl font-extrabold text-text-primary tracking-tight">
            {t('fuelTitle')}
          </h1>
          <p className="text-xs text-text-secondary mt-0.5">
            {t('fuelSubtitle')}
          </p>
        </div>

        <button
          onClick={() => setIsAddFuelModalOpen(true)}
          className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-autumn text-river font-extrabold text-xs hover:brightness-110 shadow-amber-glow transition-all w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>{t('newFuelBtn')}</span>
        </button>
      </div>

      {/* 4 KPIs de Alto Nivel */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="p-3 rounded-2xl bg-carbon border border-tea/50">
          <div className="flex items-center justify-between text-[11px] text-text-secondary mb-1">
            <span>{t('kpiTotalSpend')}</span>
            <DollarSign className="w-3.5 h-3.5 text-amber-autumn" />
          </div>
          <div className="text-lg font-extrabold text-text-primary">
            ${totalSpend.toLocaleString('es-AR')}
          </div>
          <span className="text-[10px] text-text-secondary">
            {t('kpiMonthsAnalyzed', { count: monthlyMatrix.length })}
          </span>
        </div>

        <div className="p-3 rounded-2xl bg-carbon border border-tea/50">
          <div className="flex items-center justify-between text-[11px] text-text-secondary mb-1">
            <span>{t('kpiAvgEfficiency')}</span>
            <Gauge className="w-3.5 h-3.5 text-wood" />
          </div>
          <div className="text-lg font-extrabold text-amber-autumn">
            {avgEfficiencyGlobal} <span className="text-xs font-normal text-text-secondary">{t('kmUnit')}/L</span>
          </div>
          <span className="text-[10px] text-text-secondary">
            ~{(100 / parseFloat(avgEfficiencyGlobal || '1')).toFixed(1)} L/100km
          </span>
        </div>

        <div className="p-3 rounded-2xl bg-carbon border border-tea/50">
          <div className="flex items-center justify-between text-[11px] text-text-secondary mb-1">
            <span>{t('kpiCostPerKm')}</span>
            <DollarSign className="w-3.5 h-3.5 text-amber-autumn" />
          </div>
          <div className="text-lg font-extrabold text-text-primary">
            ${avgCostPerKmGlobal} <span className="text-xs font-normal text-text-secondary">/{t('kmUnit')}</span>
          </div>
          <span className="text-[10px] text-text-secondary">{t('kpiDirectCost')}</span>
        </div>

        <div className="p-3 rounded-2xl bg-carbon border border-tea/50">
          <div className="flex items-center justify-between text-[11px] text-text-secondary mb-1">
            <span>{t('kpiTotalLiters')}</span>
            <Fuel className="w-3.5 h-3.5 text-wood" />
          </div>
          <div className="text-lg font-extrabold text-text-primary">
            {totalKm.toLocaleString('es-AR')} <span className="text-xs font-normal text-text-secondary">{t('kmUnit')}</span>
          </div>
          <span className="text-[10px] text-text-secondary">
            {totalLiters.toFixed(1)} L ({processedFuelLogs.length} cargas)
          </span>
        </div>
      </div>

      {/* Selector de Sub-Vistas */}
      <div className="flex border-b border-tea/40 gap-3 text-xs">
        <button
          onClick={() => setActiveSubTab('matrix')}
          className={`pb-2 font-bold transition-all border-b-2 ${
            activeSubTab === 'matrix'
              ? 'border-amber-autumn text-amber-autumn'
              : 'border-transparent text-text-secondary hover:text-text-primary'
          }`}
        >
          {t('tabMonthlyMatrix')} ({monthlyMatrix.length})
        </button>
        <button
          onClick={() => setActiveSubTab('history')}
          className={`pb-2 font-bold transition-all border-b-2 ${
            activeSubTab === 'history'
              ? 'border-amber-autumn text-amber-autumn'
              : 'border-transparent text-text-secondary hover:text-text-primary'
          }`}
        >
          {t('tabFuelHistory')} ({processedFuelLogs.length})
        </button>
      </div>

      {/* Sub-Vista 1: Matriz Mensual */}
      {activeSubTab === 'matrix' && (
        <div className="space-y-3">
          <div className="rounded-2xl bg-carbon border border-tea/60 overflow-hidden shadow-card">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs min-w-[500px]">
                <thead>
                  <tr className="bg-carbon-surface border-b border-tea text-[10px] uppercase tracking-wider text-text-secondary">
                    <th className="py-2.5 px-3 font-bold">{t('tableMonth')}</th>
                    <th className="py-2.5 px-3 font-bold">{t('tableDistance')}</th>
                    <th className="py-2.5 px-3 font-bold">{t('tableLiters')}</th>
                    <th className="py-2.5 px-3 font-bold">{t('tableSpend')}</th>
                    <th className="py-2.5 px-3 font-bold">{t('tableEfficiency')}</th>
                    <th className="py-2.5 px-3 font-bold">{t('tableDiagnostic')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-tea/40 font-medium text-xs">
                  {monthlyMatrix.map((row) => (
                    <tr 
                      key={row.periodKey} 
                      className={`hover:bg-river/40 transition-colors ${
                        row.hasAnomalyAlert ? 'bg-amber-autumn/5' : ''
                      }`}
                    >
                      <td className="py-2.5 px-3 font-bold text-text-primary">
                        {row.monthName}
                      </td>
                      <td className="py-2.5 px-3 text-text-primary font-mono text-[11px]">
                        {row.totalDistanceKm.toLocaleString('es-AR')} km
                      </td>
                      <td className="py-2.5 px-3 text-text-secondary">
                        {row.totalLiters} L
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-text-primary">
                        ${row.totalCost.toLocaleString('es-AR')}
                      </td>
                      <td className="py-2.5 px-3 font-extrabold text-amber-autumn">
                        {row.avgEfficiencyKmPerL} km/L
                      </td>
                      <td className="py-2.5 px-3">
                        {row.hasAnomalyAlert ? (
                          <span className="inline-flex items-center gap-1 text-amber-autumn text-[10px] font-bold bg-amber-autumn/15 px-2 py-0.5 rounded-full border border-amber-autumn/30">
                            <AlertTriangle className="w-3 h-3" />
                            {t('statusHigh')}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-bold bg-emerald-950/30 px-2 py-0.5 rounded-full border border-emerald-500/30">
                            <CheckCircle2 className="w-3 h-3" />
                            {t('statusOptimal')}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Gráfico Visual de Evolución de Consumo */}
          <div className="p-3.5 rounded-2xl bg-carbon border border-tea/60">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-text-secondary mb-2">
              {t('kpiAvgEfficiency')} (km/L)
            </h3>
            <div className="h-32 flex items-end justify-between gap-1.5 pt-4 pb-1 px-1 border-b border-tea/40">
              {monthlyMatrix.map((m) => {
                const heightPercent = Math.min(100, Math.max(25, (m.avgEfficiencyKmPerL / 16) * 100));
                return (
                  <div key={m.periodKey} className="flex-1 flex flex-col items-center gap-1 group">
                    <span className="text-[10px] font-extrabold text-amber-autumn">
                      {m.avgEfficiencyKmPerL}
                    </span>
                    <div className="w-full max-w-[36px] bg-tea/40 rounded-t-lg h-24 flex items-end overflow-hidden">
                      <div
                        className="w-full bg-gradient-to-t from-wood to-amber-autumn rounded-t-lg transition-all duration-700 shadow-amber-glow"
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>
                    <span className="text-[9px] text-text-secondary truncate max-w-[48px] text-center">
                      {m.monthName.split(' ')[0]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Sub-Vista 2: Historial Carga a Carga */}
      {activeSubTab === 'history' && (
        <div className="space-y-3">
          <div className="p-3 rounded-2xl bg-carbon border border-tea/60 flex items-start gap-2.5">
            <Fuel className="w-4 h-4 text-amber-autumn shrink-0 mt-0.5" />
            <div className="text-[11px] text-text-secondary leading-relaxed">
              <strong className="text-text-primary">Regla Cargas Parciales:</strong> Al registrar una <em>Carga Parcial</em> (tanque no lleno), su rendimiento inmediato se acumula para no distorsionar las métricas hasta el siguiente llenado completo.
            </div>
          </div>

          <div className="rounded-2xl bg-carbon border border-tea/60 overflow-hidden shadow-card">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs min-w-[500px]">
                <thead>
                  <tr className="bg-carbon-surface border-b border-tea text-[10px] uppercase tracking-wider text-text-secondary">
                    <th className="py-2.5 px-3 font-bold">{t('ticketDate')}</th>
                    <th className="py-2.5 px-3 font-bold">Odómetro</th>
                    <th className="py-2.5 px-3 font-bold">Litros</th>
                    <th className="py-2.5 px-3 font-bold">{t('tableSpend')}</th>
                    <th className="py-2.5 px-3 font-bold">Tipo</th>
                    <th className="py-2.5 px-3 font-bold">{t('tableEfficiency')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-tea/40 font-medium text-xs">
                  {[...processedFuelLogs].reverse().map((log) => (
                    <tr key={log.id} className="hover:bg-river/40 transition-colors">
                      <td className="py-2.5 px-3 text-text-primary text-[11px]">
                        {new Date(log.date).toLocaleDateString(language === 'en' ? 'en-US' : 'es-AR', { day: '2-digit', month: 'short' })}
                      </td>
                      <td className="py-2.5 px-3 font-bold text-text-primary font-mono text-[11px]">
                        {log.odometer.toLocaleString('es-AR')} km
                      </td>
                      <td className="py-2.5 px-3 text-text-secondary">
                        {log.liters.toFixed(1)} L
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-text-primary">
                        ${log.totalCost.toLocaleString('es-AR')}
                      </td>
                      <td className="py-2.5 px-3">
                        {log.isFullTank ? (
                          <span className="inline-flex items-center px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-amber-autumn/20 text-amber-autumn border border-amber-autumn/30">
                            {t('fullTankBadge')}
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-wood/20 text-wood border border-wood/30">
                            {t('partialTankBadge')}
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 font-bold">
                        {log.realEfficiencyKmPerL !== null ? (
                          <span className="text-amber-autumn">
                            {log.realEfficiencyKmPerL} km/L
                          </span>
                        ) : (
                          <span className="text-text-secondary/70 italic text-[10px]">
                            {t('partialNote')}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
