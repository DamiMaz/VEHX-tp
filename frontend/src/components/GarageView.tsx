import React, { useState, useEffect } from 'react';
import { useVehicle } from '../context/VehicleContext';
import { useLanguage } from '../context/LanguageContext';
import { Car, Shield, Gauge, Edit3, Check, Layers } from 'lucide-react';
import { FuelType, DistributionType, TransmissionType } from '../types/vehicle';

export const GarageView: React.FC = () => {
  const { vehicles, selectedVehicleId, selectVehicle, vehicle, setVehicle, telemetry } = useVehicle();
  const { t } = useLanguage();

  const [isEditing, setIsEditing] = useState(false);
  const [brand, setBrand] = useState(vehicle.brand);
  const [model, setModel] = useState(vehicle.model);
  const [year, setYear] = useState(vehicle.year);
  const [plate, setPlate] = useState(vehicle.licensePlate);
  const [fuelType, setFuelType] = useState<FuelType>(vehicle.fuelType);
  const [tankCapacity, setTankCapacity] = useState(vehicle.tankCapacity);
  const [distributionType, setDistributionType] = useState<DistributionType>(vehicle.distributionType);
  const [transmission, setTransmission] = useState<TransmissionType>(vehicle.transmission);

  // Sincronizar estado local de edición cuando cambia el vehículo activo
  useEffect(() => {
    setBrand(vehicle.brand);
    setModel(vehicle.model);
    setYear(vehicle.year);
    setPlate(vehicle.licensePlate);
    setFuelType(vehicle.fuelType);
    setTankCapacity(vehicle.tankCapacity);
    setDistributionType(vehicle.distributionType);
    setTransmission(vehicle.transmission);
    setIsEditing(false);
  }, [vehicle]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setVehicle({
      ...vehicle,
      brand,
      model,
      year,
      licensePlate: plate,
      fuelType,
      tankCapacity,
      distributionType,
      transmission
    });
    setIsEditing(false);
  };

  return (
    <div className="p-3 sm:p-5 space-y-4 max-w-5xl mx-auto select-none">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold text-amber-autumn uppercase tracking-wider">
              {t('garageSectionBadge')}
            </span>
            <span className="text-[10px] bg-carbon px-2 py-0.5 rounded-full border border-tea/50 text-text-secondary">
              {t('garageSectionSub')}
            </span>
          </div>
          <h1 className="text-lg sm:text-xl font-extrabold text-text-primary tracking-tight">
            {t('garageTitle')}
          </h1>
          <p className="text-xs text-text-secondary mt-0.5">
            {t('garageSubtitle')}
          </p>
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-carbon border border-tea hover:border-amber-autumn text-amber-autumn text-xs font-bold transition-all w-fit"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>{isEditing ? t('cancelEditBtn') : t('editSpecsBtn')}</span>
        </button>
      </div>

      {/* SELECTOR DE VEHÍCULOS DEL GARAJE */}
      <div className="p-3 rounded-2xl bg-carbon border border-tea/50 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-amber-autumn" />
            <span className="text-xs font-extrabold text-text-primary uppercase tracking-wide">
              {t('garageSelectorTitle')}
            </span>
          </div>
          <span className="text-[10px] text-text-secondary">
            {vehicles.length} vehículos
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {vehicles.map((v) => {
            const isSelected = v.id === selectedVehicleId;
            return (
              <button
                key={v.id}
                onClick={() => selectVehicle(v.id)}
                className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-amber-autumn/15 border-amber-autumn shadow-amber-glow'
                    : 'bg-river/70 border-tea/40 hover:border-tea'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold text-text-secondary">
                    {v.brand}
                  </span>
                  {isSelected && (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-full text-[9px] font-extrabold bg-amber-autumn text-river">
                      <Check className="w-2.5 h-2.5" />
                      {t('activeVehicleTag')}
                    </span>
                  )}
                </div>

                <div className="text-xs font-extrabold text-text-primary truncate">
                  {v.model}
                </div>

                <div className="flex items-center justify-between mt-1 text-[10px] text-text-secondary font-mono">
                  <span>{v.licensePlate}</span>
                  <span>{v.currentOdometer.toLocaleString('es-AR')} km</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Formulario de Edición o Ficha Técnica */}
      {isEditing ? (
        <form onSubmit={handleSave} className="p-4 rounded-2xl bg-carbon border border-tea/60 space-y-3">
          <h2 className="text-xs font-bold text-text-primary uppercase tracking-wider">
            {t('editSpecsBtn')}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-text-secondary font-semibold block mb-1">{t('fieldBrand')}</label>
              <input
                type="text"
                value={brand}
                onChange={e => setBrand(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-river border border-tea/60 text-text-primary text-xs"
              />
            </div>
            <div>
              <label className="text-text-secondary font-semibold block mb-1">{t('fieldModel')}</label>
              <input
                type="text"
                value={model}
                onChange={e => setModel(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-river border border-tea/60 text-text-primary text-xs"
              />
            </div>
            <div>
              <label className="text-text-secondary font-semibold block mb-1">{t('fieldYear')}</label>
              <input
                type="number"
                value={year}
                onChange={e => setYear(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-river border border-tea/60 text-text-primary text-xs"
              />
            </div>
            <div>
              <label className="text-text-secondary font-semibold block mb-1">{t('fieldPlate')}</label>
              <input
                type="text"
                value={plate}
                onChange={e => setPlate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-river border border-tea/60 text-text-primary text-xs"
              />
            </div>
            <div>
              <label className="text-text-secondary font-semibold block mb-1">{t('fieldFuelType')}</label>
              <select
                value={fuelType}
                onChange={e => setFuelType(e.target.value as FuelType)}
                className="w-full px-3 py-2 rounded-xl bg-river border border-tea/60 text-text-primary text-xs"
              >
                <option value="Nafta Súper">Nafta Súper</option>
                <option value="Nafta Premium">Nafta Premium</option>
                <option value="Diésel">Diésel</option>
                <option value="GNC">GNC</option>
                <option value="Híbrido">Híbrido</option>
              </select>
            </div>
            <div>
              <label className="text-text-secondary font-semibold block mb-1">{t('fieldTankCapacity')}</label>
              <input
                type="number"
                value={tankCapacity}
                onChange={e => setTankCapacity(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-river border border-tea/60 text-text-primary text-xs"
              />
            </div>
            <div>
              <label className="text-text-secondary font-semibold block mb-1">{t('fieldDistributionType')}</label>
              <select
                value={distributionType}
                onChange={e => setDistributionType(e.target.value as DistributionType)}
                className="w-full px-3 py-2 rounded-xl bg-river border border-tea/60 text-text-primary text-xs"
              >
                <option value="Cadena">Cadena (120.000 km)</option>
                <option value="Correa">Correa Dentada (60.000 km)</option>
              </select>
            </div>
            <div>
              <label className="text-text-secondary font-semibold block mb-1">{t('fieldTransmission')}</label>
              <select
                value={transmission}
                onChange={e => setTransmission(e.target.value as TransmissionType)}
                className="w-full px-3 py-2 rounded-xl bg-river border border-tea/60 text-text-primary text-xs"
              >
                <option value="Manual">Manual</option>
                <option value="Automática">Automática</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-tea/40">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-3 py-1.5 rounded-xl text-xs text-text-secondary hover:text-text-primary"
            >
              {t('cancelEditBtn')}
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-xl bg-amber-autumn text-river font-bold text-xs hover:brightness-110 shadow-amber-glow"
            >
              {t('saveSpecsBtn')}
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-3">
          {/* Tarjeta Principal del Auto Seleccionado */}
          <div className="p-4 rounded-2xl bg-carbon border border-tea/60 shadow-card space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-river border border-tea flex items-center justify-center">
                <Car className="w-5 h-5 text-amber-autumn" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-text-primary">{vehicle.brand} {vehicle.model}</h2>
                <div className="flex items-center gap-2 text-xs text-text-secondary">
                  <span>{t('fieldYear')} {vehicle.year}</span>
                  <span>•</span>
                  <span className="font-mono bg-river px-2 py-0.5 rounded border border-tea/50 text-text-primary font-bold text-[10px]">
                    {vehicle.licensePlate}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-tea/40 text-xs">
              <div className="p-2.5 rounded-xl bg-river/60 border border-tea/30">
                <span className="text-text-secondary text-[10px] block">{t('fieldFuelType')}</span>
                <strong className="text-text-primary text-xs">{vehicle.fuelType}</strong>
              </div>
              <div className="p-2.5 rounded-xl bg-river/60 border border-tea/30">
                <span className="text-text-secondary text-[10px] block">{t('fieldTankCapacity')}</span>
                <strong className="text-text-primary text-xs">{vehicle.tankCapacity} L</strong>
              </div>
              <div className="p-2.5 rounded-xl bg-river/60 border border-tea/30">
                <span className="text-text-secondary text-[10px] block">{t('fieldDistributionType')}</span>
                <strong className="text-text-primary text-xs">{vehicle.distributionType}</strong>
              </div>
              <div className="p-2.5 rounded-xl bg-river/60 border border-tea/30">
                <span className="text-text-secondary text-[10px] block">{t('fieldTransmission')}</span>
                <strong className="text-text-primary text-xs">{vehicle.transmission}</strong>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-river/40 border border-tea/40 text-xs text-text-secondary space-y-1">
              <div className="flex justify-between">
                <span>{t('fieldVin')}:</span>
                <span className="font-mono text-text-primary">{vehicle.vin || '8AJBA3BE2N0194821'}</span>
              </div>
              <div className="flex justify-between">
                <span>{t('fieldInitialOdo')}:</span>
                <span className="text-text-primary font-semibold">{vehicle.initialOdometer.toLocaleString('es-AR')} {t('kmUnit')}</span>
              </div>
              <div className="flex justify-between">
                <span>{t('fieldCurrentOdo')}:</span>
                <span className="text-amber-autumn font-extrabold">{vehicle.currentOdometer.toLocaleString('es-AR')} {t('kmUnit')}</span>
              </div>
            </div>
          </div>

          {/* Tarjeta de Telemetría */}
          <div className="p-4 rounded-2xl bg-carbon border border-tea/60 shadow-card space-y-2">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-wood" />
              <h3 className="text-xs font-bold text-text-primary uppercase tracking-wide">
                {t('telemetryStatusTitle')}
              </h3>
            </div>
            <p className="text-[11px] text-text-secondary leading-relaxed">
              {t('telemetryStatusDesc')}
            </p>

            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              <div className="flex justify-between p-2 rounded-lg bg-river">
                <span className="text-text-secondary">{t('virtualOdometer')}:</span>
                <strong className="text-amber-autumn">{Math.round(telemetry.simulatedOdometer).toLocaleString('es-AR')} {t('kmUnit')}</strong>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-river">
                <span className="text-text-secondary">Alfa (α):</span>
                <strong className="text-text-primary">{telemetry.correctionFactorAlpha}</strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
