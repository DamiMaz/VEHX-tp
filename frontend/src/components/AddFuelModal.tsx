import React, { useState } from 'react';
import { useVehicle } from '../context/VehicleContext';
import { useLanguage } from '../context/LanguageContext';
import { X, Fuel, AlertCircle, Sparkles } from 'lucide-react';
import { RouteType } from '../types/vehicle';

export const AddFuelModal: React.FC = () => {
  const { 
    vehicle, 
    addFuelLog, 
    isAddFuelModalOpen, 
    setIsAddFuelModalOpen 
  } = useVehicle();
  const { t } = useLanguage();

  // Último odómetro registrado
  const lastOdometer = vehicle.currentOdometer;

  // Estados del formulario
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 16));
  const [odometer, setOdometer] = useState<number>(lastOdometer + 420);
  const [liters, setLiters] = useState<number>(38.5);
  const [totalCost, setTotalCost] = useState<number>(55825);
  const [costPerLiter, setCostPerLiter] = useState<number>(1450);
  const [isFullTank, setIsFullTank] = useState<boolean>(true);
  const [routeType, setRouteType] = useState<RouteType>('Mixto');
  const [fuelGrade, setFuelGrade] = useState<'Súper' | 'Premium'>('Súper');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Recalcular costo total cuando cambia litros o precio
  const handleLitersChange = (val: number) => {
    setLiters(val);
    if (costPerLiter > 0) {
      setTotalCost(Math.round(val * costPerLiter));
    }
  };

  const handlePricePerLiterChange = (val: number) => {
    setCostPerLiter(val);
    if (liters > 0) {
      setTotalCost(Math.round(liters * val));
    }
  };

  const handleTotalCostChange = (val: number) => {
    setTotalCost(val);
    if (liters > 0) {
      setCostPerLiter(Math.round((val / liters) * 100) / 100);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (odometer < lastOdometer) {
      setErrorMsg(t('errOdoLower'));
      return;
    }

    addFuelLog({
      date,
      odometer,
      liters,
      totalCost,
      costPerLiter,
      isFullTank,
      routeType,
      fuelGrade
    });

    setIsAddFuelModalOpen(false);
  };

  if (!isAddFuelModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm animate-fade-in select-none">
      <div className="relative w-full max-w-sm bg-carbon border border-tea/80 rounded-3xl shadow-card overflow-hidden">
        {/* Cabecera del Modal */}
        <div className="flex items-center justify-between p-3.5 bg-carbon-surface border-b border-tea/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-autumn/15 flex items-center justify-center">
              <Fuel className="w-4 h-4 text-amber-autumn" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-text-primary">{t('addFuelModalTitle')}</h2>
              <p className="text-[10px] text-text-secondary">{t('addFuelModalSubtitle')}</p>
            </div>
          </div>
          <button
            onClick={() => setIsAddFuelModalOpen(false)}
            className="p-1 rounded-xl text-text-secondary hover:text-text-primary hover:bg-river/60"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3 max-h-[78vh] overflow-y-auto text-xs">
          {errorMsg && (
            <div className="p-2.5 rounded-xl bg-red-950/40 border border-red-500/50 flex items-center gap-2 text-[11px] text-red-200">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Odómetro Actual con validación */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-[11px] font-semibold text-text-primary">
                {t('formOdometer')} *
              </label>
              <span className="text-[10px] text-text-secondary">
                Previo: <strong className="text-amber-autumn">{lastOdometer.toLocaleString('es-AR')} km</strong>
              </span>
            </div>
            <input
              type="number"
              required
              value={odometer}
              onChange={(e) => setOdometer(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl bg-river border border-tea/60 text-text-primary font-bold text-base focus:outline-none focus:border-amber-autumn"
            />
          </div>

          {/* Switch Crítico: ¿Tanque Lleno al 100%? */}
          <div className="p-2.5 rounded-2xl bg-river border border-tea/60 flex items-center justify-between">
            <div className="pr-2">
              <div className="text-[11px] font-bold text-text-primary">{t('formFullTankQ')}</div>
              <p className="text-[10px] text-text-secondary mt-0.5 leading-tight">
                {isFullTank ? t('formFullTankYes') : t('formFullTankNo')}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsFullTank(!isFullTank)}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 shrink-0 ${
                isFullTank ? 'bg-amber-autumn' : 'bg-tea'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-river shadow-md transform transition-transform ${
                  isFullTank ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Litros y Precio por Litro */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-semibold text-text-primary block mb-1">
                {t('formLiters')} *
              </label>
              <input
                type="number"
                step="0.1"
                required
                value={liters}
                onChange={(e) => handleLitersChange(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 rounded-xl bg-river border border-tea/60 text-text-primary font-semibold text-sm focus:outline-none focus:border-amber-autumn"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-text-primary block mb-1">
                {t('formCostPerLiter')}
              </label>
              <input
                type="number"
                step="1"
                value={costPerLiter}
                onChange={(e) => handlePricePerLiterChange(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 rounded-xl bg-river border border-tea/60 text-text-primary font-semibold text-sm focus:outline-none focus:border-amber-autumn"
              />
            </div>
          </div>

          {/* Gasto Total ($) */}
          <div>
            <label className="text-[11px] font-semibold text-text-primary block mb-1">
              {t('formTotalCost')} *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-text-secondary font-bold">$</span>
              <input
                type="number"
                required
                value={totalCost}
                onChange={(e) => handleTotalCostChange(Number(e.target.value))}
                className="w-full pl-6 pr-3 py-2 rounded-xl bg-river border border-tea/60 text-text-primary font-bold text-base focus:outline-none focus:border-amber-autumn"
              />
            </div>
          </div>

          {/* Tipo de Ruta & Grado de Combustible */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-semibold text-text-primary block mb-1">
                {t('formRouteType')}
              </label>
              <select
                value={routeType}
                onChange={(e) => setRouteType(e.target.value as RouteType)}
                className="w-full px-2 py-1.5 rounded-xl bg-river border border-tea/60 text-text-primary text-xs focus:outline-none focus:border-amber-autumn"
              >
                <option value="Ciudad">{t('routeCity')}</option>
                <option value="Ruta">{t('routeHighway')}</option>
                <option value="Mixto">{t('routeMixed')}</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-text-primary block mb-1">
                {t('formFuelGrade')}
              </label>
              <select
                value={fuelGrade}
                onChange={(e) => setFuelGrade(e.target.value as 'Súper' | 'Premium')}
                className="w-full px-2 py-1.5 rounded-xl bg-river border border-tea/60 text-text-primary text-xs focus:outline-none focus:border-amber-autumn"
              >
                <option value="Súper">Nafta Súper</option>
                <option value="Premium">Nafta Premium</option>
              </select>
            </div>
          </div>

          {/* Fecha y Hora */}
          <div>
            <label className="text-[11px] font-semibold text-text-primary block mb-1">
              {t('formDateTime')}
            </label>
            <input
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-xl bg-river border border-tea/60 text-text-primary text-xs focus:outline-none focus:border-amber-autumn"
            />
          </div>

          {/* Botones de Acción */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-tea/40">
            <button
              type="button"
              onClick={() => setIsAddFuelModalOpen(false)}
              className="px-3 py-2 rounded-xl text-xs font-semibold text-text-secondary hover:text-text-primary"
            >
              {t('formCancel')}
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-autumn text-river font-extrabold text-xs hover:brightness-110 shadow-amber-glow transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t('formSaveFuel')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
