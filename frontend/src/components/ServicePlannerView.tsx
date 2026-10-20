import React, { useState } from 'react';
import { useVehicle } from '../context/VehicleContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  Wrench, 
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle, 
  Calendar, 
  Gauge, 
  History, 
  Clock
} from 'lucide-react';
import { ServiceItem } from '../types/vehicle';

export const ServicePlannerView: React.FC = () => {
  const { 
    services, 
    serviceHistory, 
    dailyRhythmKm,
    setSelectedServiceForModal,
    setIsPerformServiceModalOpen 
  } = useVehicle();
  const { t } = useLanguage();

  const [filter, setFilter] = useState<'all' | 'warning' | 'overdue'>('all');

  const filteredServices = services.filter(s => {
    if (filter === 'all') return true;
    if (filter === 'warning') return s.status === 'warning';
    if (filter === 'overdue') return s.status === 'overdue';
    return true;
  });

  const handleOpenServiceModal = (item: ServiceItem) => {
    setSelectedServiceForModal(item);
    setIsPerformServiceModalOpen(true);
  };

  return (
    <div className="p-3 sm:p-5 space-y-4 max-w-7xl mx-auto select-none">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold text-amber-autumn uppercase tracking-wider">
              {t('serviceSectionBadge')}
            </span>
            <span className="text-[10px] bg-carbon px-2 py-0.5 rounded-full border border-tea/50 text-text-secondary">
              {t('serviceSectionSub')}
            </span>
          </div>
          <h1 className="text-lg sm:text-xl font-extrabold text-text-primary tracking-tight">
            {t('serviceTitle')}
          </h1>
          <p className="text-xs text-text-secondary mt-0.5">
            {t('serviceSubtitle')}
          </p>
        </div>

        {/* Banner de Ritmo Diario de Uso */}
        <div className="p-2.5 rounded-2xl bg-carbon border border-tea/60 flex items-center gap-2.5 w-fit">
          <div className="w-8 h-8 rounded-xl bg-wood/20 border border-wood/40 flex items-center justify-center">
            <Gauge className="w-4 h-4 text-wood" />
          </div>
          <div>
            <span className="text-[9px] text-text-secondary font-semibold uppercase">{t('telemetryRhythm')}</span>
            <div className="text-xs font-extrabold text-text-primary">
              {dailyRhythmKm} <span className="text-[10px] font-normal text-amber-autumn">{t('kmPerDay')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros de Estado */}
      <div className="flex gap-1.5 text-xs">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1 rounded-xl font-bold transition-all text-xs ${
            filter === 'all'
              ? 'bg-amber-autumn text-river font-extrabold'
              : 'bg-carbon text-text-secondary hover:text-text-primary border border-tea/40'
          }`}
        >
          {t('filterAll')} ({services.length})
        </button>
        <button
          onClick={() => setFilter('warning')}
          className={`px-3 py-1 rounded-xl font-bold transition-all text-xs ${
            filter === 'warning'
              ? 'bg-amber-autumn text-river font-extrabold'
              : 'bg-carbon text-text-secondary hover:text-text-primary border border-tea/40'
          }`}
        >
          {t('filterWarning')} ({services.filter(s => s.status === 'warning').length})
        </button>
        <button
          onClick={() => setFilter('overdue')}
          className={`px-3 py-1 rounded-xl font-bold transition-all text-xs ${
            filter === 'overdue'
              ? 'bg-amber-autumn text-river font-extrabold'
              : 'bg-carbon text-text-secondary hover:text-text-primary border border-tea/40'
          }`}
        >
          {t('filterOverdue')} ({services.filter(s => s.status === 'overdue').length})
        </button>
      </div>

      {/* Grid de Tarjetas de Services */}
      <div className="grid grid-cols-1 gap-3">
        {filteredServices.map((item) => {
          const isOverdue = item.status === 'overdue';
          const isWarning = item.status === 'warning';

          return (
            <div
              key={item.id}
              className={`p-3.5 rounded-2xl bg-carbon border transition-all flex flex-col justify-between ${
                isOverdue
                  ? 'border-red-500/50 bg-red-950/10'
                  : isWarning
                  ? 'border-amber-autumn/60 shadow-amber-glow'
                  : 'border-tea/50 hover:border-tea'
              }`}
            >
              <div>
                {/* Cabecera del Item */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">
                    {item.category}
                  </span>

                  {isOverdue ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-400 bg-red-900/30 px-2 py-0.5 rounded-full border border-red-500/40">
                      <AlertCircle className="w-3 h-3" />
                      {t('statusOverdueRed')}
                    </span>
                  ) : isWarning ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-autumn bg-amber-autumn/20 px-2 py-0.5 rounded-full border border-amber-autumn/40">
                      <AlertTriangle className="w-3 h-3" />
                      {t('statusWarningAmber')}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/30 px-2 py-0.5 rounded-full border border-emerald-500/30">
                      <CheckCircle2 className="w-3 h-3" />
                      {t('statusOkGreen')}
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-extrabold text-text-primary mb-1">
                  {item.name}
                </h3>
                <p className="text-xs text-text-secondary mb-3">
                  {item.notes}
                </p>

                {/* Doble Medidor de Desgaste: Kilometraje vs Tiempo */}
                <div className="space-y-2 p-2.5 rounded-xl bg-river/60 border border-tea/30 mb-3">
                  {/* Desgaste por Kilometraje */}
                  <div>
                    <div className="flex justify-between text-[10px] mb-1">
                      <span className="text-text-secondary flex items-center gap-1">
                        <Gauge className="w-3 h-3 text-wood" />
                        {t('wearKmLabel')} ({item.intervalKm.toLocaleString('es-AR')} km)
                      </span>
                      <span className={`font-bold ${item.wearKmPercent >= 100 ? 'text-red-400' : 'text-text-primary'}`}>
                        {item.wearKmPercent}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-tea/60 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          item.wearKmPercent >= 100 ? 'bg-red-500' : 'bg-amber-autumn'
                        }`}
                        style={{ width: `${Math.min(100, item.wearKmPercent)}%` }}
                      />
                    </div>
                  </div>

                  {/* Desgaste por Tiempo Calendario */}
                  <div>
                    <div className="flex justify-between text-[10px] mb-1">
                      <span className="text-text-secondary flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-wood" />
                        {t('wearTimeLabel')} ({item.intervalDays} d)
                      </span>
                      <span className={`font-bold ${item.wearDaysPercent >= 100 ? 'text-red-400' : 'text-text-primary'}`}>
                        {item.wearDaysPercent}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-tea/60 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          item.wearDaysPercent >= 100 ? 'bg-red-500' : 'bg-wood'
                        }`}
                        style={{ width: `${Math.min(100, item.wearDaysPercent)}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Proyección predictiva inteligente */}
                <div className="text-xs text-text-secondary mb-3 p-2 rounded-xl bg-carbon-surface border border-tea/40 flex items-start gap-2">
                  <Clock className="w-3.5 h-3.5 text-amber-autumn shrink-0 mt-0.5" />
                  <div>
                    {isOverdue ? (
                      <span className="text-red-300 font-semibold text-[11px]">
                        {t('serviceOverdueDetail')}
                      </span>
                    ) : (
                      <span className="text-text-secondary text-[11px]">
                        {t('serviceProjectionPrefix')}<strong>{item.projectedDaysByRhythm}</strong> {t('serviceProjectionSuffix')} (~{item.remainingKm.toLocaleString('es-AR')} km).
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Botón Registrar Service Realizado */}
              <button
                onClick={() => handleOpenServiceModal(item)}
                className="w-full py-2 px-3 rounded-xl bg-carbon hover:bg-amber-autumn border border-amber-autumn text-amber-autumn hover:text-river font-bold text-xs transition-all flex items-center justify-center gap-1.5 pressable-card"
              >
                <Wrench className="w-3.5 h-3.5" />
                <span>{t('performServiceAction')}</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Bitácora Clínica de Talleres */}
      <div className="rounded-2xl bg-carbon border border-tea/60 p-3.5 shadow-card">
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-tea/40">
          <History className="w-4 h-4 text-amber-autumn" />
          <h2 className="text-xs font-bold text-text-primary uppercase tracking-wide">
            {t('serviceHistoryTitle')}
          </h2>
        </div>

        {serviceHistory.length === 0 ? (
          <div className="text-center py-5 text-text-secondary text-xs">
            {t('noHistoryYet')}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs min-w-[440px]">
              <thead>
                <tr className="border-b border-tea/50 text-[10px] uppercase tracking-wider text-text-secondary">
                  <th className="py-2 px-2.5 font-bold">{t('dateLabel')}</th>
                  <th className="py-2 px-2.5 font-bold">Service</th>
                  <th className="py-2 px-2.5 font-bold">Km</th>
                  <th className="py-2 px-2.5 font-bold">Costo ($)</th>
                  <th className="py-2 px-2.5 font-bold">{t('workshopLabel')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-tea/30 font-medium text-xs">
                {serviceHistory.map((slog) => (
                  <tr key={slog.id} className="hover:bg-river/40">
                    <td className="py-2.5 px-2.5 text-text-primary text-[11px]">
                      {slog.date}
                    </td>
                    <td className="py-2.5 px-2.5 font-bold text-amber-autumn text-xs">
                      {slog.serviceName}
                    </td>
                    <td className="py-2.5 px-2.5 text-text-primary font-mono text-[11px]">
                      {slog.odometer.toLocaleString('es-AR')}
                    </td>
                    <td className="py-2.5 px-2.5 text-text-primary font-bold">
                      ${slog.cost.toLocaleString('es-AR')}
                    </td>
                    <td className="py-2.5 px-2.5 text-text-secondary text-[11px]">
                      {slog.workshop}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
