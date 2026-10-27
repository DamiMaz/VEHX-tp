import React, { useState } from 'react';
import { useVehicle } from '../context/VehicleContext';
import { useLanguage } from '../context/LanguageContext';
import { CATALOG_VEHICLES } from '../data/catalogVehicles';
import { Vehicle3DViewer } from './Vehicle3DViewer';
import { FuelType, DistributionType, TransmissionType, BodyType, CatalogVehicleModel } from '../types/vehicle';
import { X, Check, Car, Sparkles, PlusCircle, AlertCircle, ShieldCheck } from 'lucide-react';

interface RegisterVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RegisterVehicleModal: React.FC<RegisterVehicleModalProps> = ({ isOpen, onClose }) => {
  const { addVehicle } = useVehicle();
  const { t } = useLanguage();

  // Modo: 'catalog' (elegir modelo del listado) o 'custom' (registro libre manual)
  const [mode, setMode] = useState<'catalog' | 'custom'>('catalog');
  const [selectedCatalogItem, setSelectedCatalogItem] = useState<CatalogVehicleModel>(CATALOG_VEHICLES[0]);

  // Campos de formulario (solamente el modelo viene dado o sugerido, las demás especificaciones se deben rellenar)
  const [brand, setBrand] = useState(CATALOG_VEHICLES[0].brand);
  const [model, setModel] = useState(CATALOG_VEHICLES[0].model);
  const [bodyType, setBodyType] = useState<BodyType>('sedan');
  const [year, setYear] = useState<number>(2024);
  const [licensePlate, setLicensePlate] = useState<string>('');
  const [fuelType, setFuelType] = useState<FuelType>(CATALOG_VEHICLES[0].defaultFuelType);
  const [tankCapacity, setTankCapacity] = useState<number>(CATALOG_VEHICLES[0].defaultTankCapacity);
  const [distributionType, setDistributionType] = useState<DistributionType>(CATALOG_VEHICLES[0].defaultDistributionType);
  const [transmission, setTransmission] = useState<TransmissionType>(CATALOG_VEHICLES[0].defaultTransmission);
  const [initialOdometer, setInitialOdometer] = useState<number>(0);
  const [vin, setVin] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  // Al seleccionar un modelo del catálogo:
  // "solamente el modelo las otras especificaciones se deberan rellenar"
  const handleSelectCatalog = (item: CatalogVehicleModel) => {
    setSelectedCatalogItem(item);
    setBrand(item.brand);
    setModel(item.model);
    setBodyType(item.category);
    // Sugerencias mecánicas predeterminadas que el usuario puede libremente modificar/completar
    setFuelType(item.defaultFuelType);
    setTankCapacity(item.defaultTankCapacity);
    setDistributionType(item.defaultDistributionType);
    setTransmission(item.defaultTransmission);
    setErrorMsg(null);
  };

  const handleSwitchToCustom = () => {
    setMode('custom');
    setBrand('');
    setModel('');
    setBodyType('other');
    setErrorMsg(null);
  };

  const handleSwitchToCatalog = () => {
    setMode('catalog');
    handleSelectCatalog(selectedCatalogItem);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!brand.trim()) {
      setErrorMsg('Debes especificar la marca del vehículo.');
      return;
    }

    if (!model.trim()) {
      setErrorMsg('Debes especificar el modelo del vehículo.');
      return;
    }

    if (!licensePlate.trim()) {
      setErrorMsg('Por favor ingresa la patente o dominio del vehículo.');
      return;
    }

    if (year < 1970 || year > 2027) {
      setErrorMsg('El año de fabricación debe estar entre 1970 y 2027.');
      return;
    }

    if (tankCapacity <= 0) {
      setErrorMsg('La capacidad del tanque debe ser mayor a 0 litros.');
      return;
    }

    if (initialOdometer < 0) {
      setErrorMsg('El kilometraje inicial no puede ser negativo.');
      return;
    }

    // Ruta de archivo 3D correspondiente y detección de animación 3D
    const has3dAnimation = mode === 'catalog' || bodyType !== 'other';
    const model3dPath = has3dAnimation 
      ? (mode === 'catalog' ? selectedCatalogItem.model3dPath : `/models/${bodyType}.glb`) 
      : undefined;

    const btDevice = `${brand.trim()}-BT_${licensePlate.trim().replace(/\s+/g, '')}`;

    addVehicle({
      brand: brand.trim(),
      model: model.trim(),
      year,
      licensePlate: licensePlate.trim().toUpperCase(),
      fuelType,
      tankCapacity,
      distributionType,
      transmission,
      initialOdometer,
      currentOdometer: initialOdometer,
      vin: vin.trim() || undefined,
      bodyType,
      has3dAnimation,
      model3dPath,
      bluetoothDeviceName: btDevice
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-fade-in select-none">
      <div className="relative w-full max-w-xl max-h-[92vh] flex flex-col rounded-3xl bg-carbon border border-tea/80 shadow-2xl overflow-hidden">
        
        {/* Cabecera del Modal */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-tea/50 bg-gradient-to-r from-river/90 to-carbon">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-autumn/15 border border-amber-autumn/40 flex items-center justify-center">
              <PlusCircle className="w-5 h-5 text-amber-autumn" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-extrabold text-text-primary tracking-tight">
                Registrar Nuevo Vehículo
              </h2>
              <p className="text-[11px] text-text-secondary">
                Modelos 3D predefinidos o registro personalizado
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-river/60 hover:bg-river text-text-secondary hover:text-text-primary border border-tea/40 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Contenido scrolleable */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          
          {/* Selector de Modo: Catálogo 3D vs Registro Libre */}
          <div className="flex rounded-xl bg-river p-1 border border-tea/50 gap-1">
            <button
              type="button"
              onClick={handleSwitchToCatalog}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                mode === 'catalog'
                  ? 'bg-amber-autumn text-river shadow-amber-glow'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Modelos del Catálogo 3D</span>
            </button>
            <button
              type="button"
              onClick={handleSwitchToCustom}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                mode === 'custom'
                  ? 'bg-amber-autumn text-river shadow-amber-glow'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <Car className="w-3.5 h-3.5" />
              <span>Otro Modelo (Personalizado)</span>
            </button>
          </div>

          {/* MODO CATÁLOGO: Tarjetas de los 3 Modelos y Visualizador 3D */}
          {mode === 'catalog' && (
            <div className="space-y-3">
              <div className="text-[11px] text-text-secondary">
                Selecciona uno de los 3 modelos con animación dimensional para el menú. 
                <strong className="text-amber-autumn"> Solamente el modelo queda asignado</strong>; las especificaciones de tu unidad se rellenan abajo.
              </div>

              {/* Grid de 3 modelos: Sedán, SUV, 4x4 */}
              <div className="grid grid-cols-3 gap-2">
                {CATALOG_VEHICLES.map((cat) => {
                  const isSelected = selectedCatalogItem.id === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleSelectCatalog(cat)}
                      className={`p-2 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'bg-amber-autumn/20 border-amber-autumn shadow-amber-glow ring-1 ring-amber-autumn'
                          : 'bg-river/70 border-tea/50 hover:border-tea'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-1">
                        <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-full bg-carbon text-amber-autumn border border-amber-autumn/30">
                          {cat.categoryLabel}
                        </span>
                        {isSelected && <Check className="w-3 h-3 text-amber-autumn" />}
                      </div>

                      <div className="text-[11px] font-extrabold text-text-primary leading-tight line-clamp-2">
                        {cat.brand} {cat.model}
                      </div>

                      <div className="text-[9px] text-text-secondary font-mono mt-1">
                        {cat.model3dFile}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Visualizador 3D interactivo en tiempo real del modelo seleccionado */}
              <div className="rounded-2xl border border-tea/60 overflow-hidden bg-river">
                <Vehicle3DViewer
                  bodyType={selectedCatalogItem.category}
                  model3dPath={selectedCatalogItem.model3dPath}
                  modelName={`${selectedCatalogItem.brand} ${selectedCatalogItem.model}`}
                  heightClass="h-44 sm:h-48"
                />
                <div className="p-2.5 bg-carbon/70 text-[11px] text-text-secondary flex items-start gap-2 border-t border-tea/30">
                  <ShieldCheck className="w-4 h-4 text-amber-autumn shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-text-primary">{selectedCatalogItem.specsSummary}</strong>. 
                    {selectedCatalogItem.description}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* MODO PERSONALIZADO: Indicación si su vehículo no está en el catálogo */}
          {mode === 'custom' && (
            <div className="p-3 rounded-2xl bg-river/60 border border-tea/50 text-xs text-text-secondary space-y-2">
              <div className="flex items-center gap-2 text-text-primary font-bold">
                <Car className="w-4 h-4 text-amber-autumn" />
                <span>Registro de Modelo Personalizado</span>
              </div>
              <p className="text-[11px] text-text-secondary leading-relaxed">
                Ingresa libremente la marca y modelo de tu vehículo. Puedes elegir la silueta 3D más cercana (Sedán, SUV o 4x4) para la animación en el menú.
              </p>
            </div>
          )}

          {/* Formulario de Especificaciones (obligatorias a rellenar por el usuario) */}
          <form id="vehicle-register-form" onSubmit={handleSubmit} className="space-y-3">
            
            {/* Mensaje de validación / error */}
            {errorMsg && (
              <div className="p-2.5 rounded-xl bg-red-950/40 border border-red-500/50 text-red-200 text-xs flex items-center gap-2 animate-shake">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="text-xs font-extrabold uppercase text-amber-autumn tracking-wider pt-1 flex items-center gap-1.5">
              <span>Especificaciones a Completar por el Usuario</span>
              <div className="flex-1 h-[1px] bg-tea/40 ml-2" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              
              {/* Marca */}
              <div>
                <label className="text-text-secondary font-semibold block mb-1">
                  Marca *
                </label>
                <input
                  type="text"
                  required
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="ej. Toyota, Ford, Volkswagen"
                  className="w-full px-3 py-2 rounded-xl bg-river border border-tea/60 text-text-primary text-xs focus:border-amber-autumn focus:outline-none"
                />
              </div>

              {/* Modelo */}
              <div>
                <label className="text-text-secondary font-semibold block mb-1">
                  Modelo *
                </label>
                <input
                  type="text"
                  required
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="ej. Corolla XEI, Taos, Ranger 4x4"
                  className="w-full px-3 py-2 rounded-xl bg-river border border-tea/60 text-text-primary text-xs focus:border-amber-autumn focus:outline-none"
                />
              </div>

              {/* Silueta 3D en caso de modo custom */}
              {mode === 'custom' && (
                <div>
                  <label className="text-text-secondary font-semibold block mb-1">
                    Silueta 3D para la Animación
                  </label>
                  <select
                    value={bodyType}
                    onChange={(e) => setBodyType(e.target.value as BodyType)}
                    className="w-full px-3 py-2 rounded-xl bg-river border border-tea/60 text-text-primary text-xs focus:border-amber-autumn focus:outline-none"
                  >
                    <option value="sedan">Sedán (Aerodinámico)</option>
                    <option value="suv">SUV (Todocamino)</option>
                    <option value="4x4">4x4 / Pick-up (Todoterreno)</option>
                    <option value="other">Otro / Estándar</option>
                  </select>
                </div>
              )}

              {/* Año */}
              <div>
                <label className="text-text-secondary font-semibold block mb-1">
                  Año de Fabricación *
                </label>
                <input
                  type="number"
                  min="1970"
                  max="2027"
                  required
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-river border border-tea/60 text-text-primary text-xs focus:border-amber-autumn focus:outline-none"
                />
              </div>

              {/* Patente / Placa */}
              <div>
                <label className="text-text-secondary font-semibold block mb-1">
                  Patente / Matrícula *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ej. AF 123 CD"
                  value={licensePlate}
                  onChange={(e) => setLicensePlate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-river border border-tea/60 text-text-primary font-mono font-bold text-xs focus:border-amber-autumn focus:outline-none uppercase"
                />
              </div>

              {/* Combustible Principal */}
              <div>
                <label className="text-text-secondary font-semibold block mb-1">
                  Combustible Principal *
                </label>
                <select
                  value={fuelType}
                  onChange={(e) => setFuelType(e.target.value as FuelType)}
                  className="w-full px-3 py-2 rounded-xl bg-river border border-tea/60 text-text-primary text-xs focus:border-amber-autumn focus:outline-none"
                >
                  <option value="Nafta Súper">Nafta Súper</option>
                  <option value="Nafta Premium">Nafta Premium</option>
                  <option value="Diésel">Diésel</option>
                  <option value="Híbrido">Híbrido</option>
                  <option value="GNC">GNC</option>
                </select>
              </div>

              {/* Capacidad del Tanque */}
              <div>
                <label className="text-text-secondary font-semibold block mb-1">
                  Capacidad de Tanque (Litros) *
                </label>
                <input
                  type="number"
                  min="20"
                  max="200"
                  required
                  value={tankCapacity}
                  onChange={(e) => setTankCapacity(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-river border border-tea/60 text-text-primary text-xs focus:border-amber-autumn focus:outline-none"
                />
              </div>

              {/* Tipo de Distribución */}
              <div>
                <label className="text-text-secondary font-semibold block mb-1">
                  Tipo de Distribución *
                </label>
                <select
                  value={distributionType}
                  onChange={(e) => setDistributionType(e.target.value as DistributionType)}
                  className="w-full px-3 py-2 rounded-xl bg-river border border-tea/60 text-text-primary text-xs focus:border-amber-autumn focus:outline-none"
                >
                  <option value="Cadena">Cadena (Intervalo 120.000 km)</option>
                  <option value="Correa">Correa Dentada (Intervalo 60.000 km)</option>
                </select>
              </div>

              {/* Transmisión */}
              <div>
                <label className="text-text-secondary font-semibold block mb-1">
                  Transmisión *
                </label>
                <select
                  value={transmission}
                  onChange={(e) => setTransmission(e.target.value as TransmissionType)}
                  className="w-full px-3 py-2 rounded-xl bg-river border border-tea/60 text-text-primary text-xs focus:border-amber-autumn focus:outline-none"
                >
                  <option value="Automática">Automática</option>
                  <option value="Manual">Manual</option>
                </select>
              </div>

              {/* Odómetro Inicial */}
              <div>
                <label className="text-text-secondary font-semibold block mb-1">
                  Odómetro Actual / Inicial (km) *
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={initialOdometer}
                  onChange={(e) => setInitialOdometer(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-river border border-tea/60 text-text-primary font-mono text-xs focus:border-amber-autumn focus:outline-none"
                />
              </div>

              {/* VIN / Chasis */}
              <div className="sm:col-span-2">
                <label className="text-text-secondary font-semibold block mb-1">
                  Número de Chasis (VIN) - Opcional
                </label>
                <input
                  type="text"
                  placeholder="ej. 8AJBA3BE2N0194821"
                  value={vin}
                  onChange={(e) => setVin(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-river border border-tea/60 text-text-primary font-mono text-xs focus:border-amber-autumn focus:outline-none uppercase"
                />
              </div>

            </div>
          </form>
        </div>

        {/* Barra Inferior de Acciones */}
        <div className="p-4 sm:p-5 border-t border-tea/50 bg-river/80 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-tea text-xs font-semibold text-text-secondary hover:text-text-primary transition-colors"
          >
            {t('formCancel') || 'Cancelar'}
          </button>

          <button
            type="submit"
            form="vehicle-register-form"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-autumn text-river font-extrabold text-xs hover:brightness-110 shadow-amber-glow transition-all"
          >
            <Check className="w-4 h-4" />
            <span>Guardar e Ingresar al Garaje</span>
          </button>
        </div>

      </div>
    </div>
  );
};
