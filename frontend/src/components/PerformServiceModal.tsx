import React, { useState } from 'react';
import { useVehicle } from '../context/VehicleContext';
import { useLanguage } from '../context/LanguageContext';
import { X, CheckCircle2, Wrench } from 'lucide-react';

export const PerformServiceModal: React.FC = () => {
  const { 
    isPerformServiceModalOpen, 
    setIsPerformServiceModalOpen, 
    selectedServiceForModal, 
    setSelectedServiceForModal,
    performService,
    vehicle 
  } = useVehicle();
  const { t } = useLanguage();

  const [cost, setCost] = useState<number>(selectedServiceForModal?.cost || 95000);
  const [workshop, setWorkshop] = useState<string>(selectedServiceForModal?.workshop || 'Taller Autorizado');
  const [notes, setNotes] = useState<string>(selectedServiceForModal?.notes || 'Mantenimiento preventivo completado según manual');

  if (!isPerformServiceModalOpen || !selectedServiceForModal) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performService(selectedServiceForModal.id, {
      cost,
      workshop,
      notes
    });
    setIsPerformServiceModalOpen(false);
    setSelectedServiceForModal(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm animate-fade-in select-none">
      <div className="relative w-full max-w-sm bg-carbon border border-tea/80 rounded-3xl shadow-card overflow-hidden">
        {/* Cabecera */}
        <div className="flex items-center justify-between p-3.5 bg-carbon-surface border-b border-tea/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-autumn/15 flex items-center justify-center">
              <Wrench className="w-4 h-4 text-amber-autumn" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-text-primary">{t('performServiceModalTitle')}</h2>
              <p className="text-[10px] text-text-secondary">{selectedServiceForModal.name}</p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsPerformServiceModalOpen(false);
              setSelectedServiceForModal(null);
            }}
            className="p-1 rounded-xl text-text-secondary hover:text-text-primary hover:bg-river/60"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3 text-xs">
          <div className="p-2.5 rounded-2xl bg-river border border-tea/50 text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-text-secondary">{t('currentServiceOdo')}</span>
              <span className="font-bold text-text-primary">{vehicle.currentOdometer.toLocaleString('es-AR')} {t('kmUnit')}</span>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-text-primary block mb-1">
              {t('serviceCostLabel')} *
            </label>
            <input
              type="number"
              required
              value={cost}
              onChange={(e) => setCost(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl bg-river border border-tea/60 text-text-primary font-bold text-base focus:outline-none focus:border-amber-autumn"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-text-primary block mb-1">
              {t('serviceWorkshopLabel')} *
            </label>
            <input
              type="text"
              required
              value={workshop}
              onChange={(e) => setWorkshop(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-river border border-tea/60 text-text-primary text-xs focus:outline-none focus:border-amber-autumn"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-text-primary block mb-1">
              {t('serviceNotesLabel')}
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-river border border-tea/60 text-text-primary text-xs focus:outline-none focus:border-amber-autumn resize-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-tea/40">
            <button
              type="button"
              onClick={() => {
                setIsPerformServiceModalOpen(false);
                setSelectedServiceForModal(null);
              }}
              className="px-3 py-2 rounded-xl text-xs font-semibold text-text-secondary hover:text-text-primary"
            >
              {t('formCancel')}
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-autumn text-river font-extrabold text-xs hover:brightness-110 shadow-amber-glow transition-all"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{t('confirmServiceBtn')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
