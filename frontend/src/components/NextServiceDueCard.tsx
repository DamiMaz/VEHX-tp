import React from 'react';
import { useVehicle } from '../context/VehicleContext';
import { useLanguage } from '../context/LanguageContext';
import { Wrench, Calendar, ArrowRight, AlertCircle } from 'lucide-react';

export const NextServiceDueCard: React.FC = () => {
  const { services, setActiveTab, setSelectedServiceForModal, setIsPerformServiceModalOpen } = useVehicle();
  const { t } = useLanguage();

  // Encontrar el service más prioritario (rojo primero, luego amarillo con menor remainingKm)
  const urgentService = [...services].sort((a, b) => {
    if (a.status === 'overdue' && b.status !== 'overdue') return -1;
    if (b.status === 'overdue' && a.status !== 'overdue') return 1;
    return a.remainingKm - b.remainingKm;
  })[0];

  if (!urgentService) return null;

  const isOverdue = urgentService.status === 'overdue';
  const progressPercent = Math.min(100, urgentService.wearTotalPercent);

  const handleActionClick = () => {
    setSelectedServiceForModal(urgentService);
    setIsPerformServiceModalOpen(true);
  };

  return (
    <div className="w-full h-full p-4 rounded-card bg-carbon border border-tea/60 shadow-card select-none flex flex-col justify-between">
      {/* Cabecera de la Tarjeta */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-amber-autumn/15 flex items-center justify-center">
            <Wrench className="w-3.5 h-3.5 text-amber-autumn" />
          </div>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-text-secondary">
            {t('nextServiceTitle')}
          </span>
        </div>

        {isOverdue && (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-autumn bg-amber-autumn/20 px-2 py-0.5 rounded-full border border-amber-autumn/40">
            <AlertCircle className="w-3 h-3" />
            {t('serviceOverdue')}
          </span>
        )}
      </div>

      {/* Título del Service y Próximo Vencimiento */}
      <div className="mb-3">
        <h3 className="text-sm sm:text-base font-extrabold text-text-primary">
          {isOverdue ? (
            <span>{t('serviceOverduePrefix')} {urgentService.name}</span>
          ) : (
            <span>{t('serviceInPrefix')} {urgentService.remainingKm.toLocaleString('es-AR')} {t('kmUnit')} · {urgentService.name}</span>
          )}
        </h3>
        <div className="flex items-center gap-2 text-xs text-text-secondary mt-0.5">
          <Calendar className="w-3.5 h-3.5 text-wood" />
          <span>
            {isOverdue 
              ? t('serviceOverdueDetail')
              : `${t('serviceProjectionPrefix')}${urgentService.projectedDaysByRhythm} ${t('serviceProjectionSuffix')}`}
          </span>
        </div>
      </div>

      {/* Barra de Progreso (Pista Afternoon Tea, Relleno Amber) */}
      <div className="space-y-1.5 mb-3.5">
        <div className="flex justify-between text-[11px] font-medium text-text-secondary">
          <span>{t('wearAccumulated')}</span>
          <span className="font-extrabold text-amber-autumn">{progressPercent}%</span>
        </div>
        <div className="w-full h-2 rounded-full bg-tea overflow-hidden">
          <div 
            className="h-full bg-amber-autumn rounded-full transition-all duration-700 ease-out shadow-amber-glow"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Botón de Acción: Book Now / Agendar Turno */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={() => setActiveTab('services')}
          className="text-xs font-semibold text-text-secondary hover:text-amber-autumn transition-colors"
        >
          {t('viewAllServices')} ({services.length})
        </button>

        <button
          onClick={handleActionClick}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-carbon border border-amber-autumn text-xs font-bold text-amber-autumn hover:bg-amber-autumn hover:text-river transition-all pressable-card shadow-sm"
        >
          <span>{t('bookNow')}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
