import React, { useState, useEffect } from 'react';
import { useVehicle } from '../context/VehicleContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  Car, 
  Shield, 
  Gauge, 
  Edit3, 
  Check, 
  Layers, 
  Plus, 
  Sparkles, 
  Box, 
  Info, 
  CheckCircle2, 
  Trash2, 
  ArrowLeft, 
  Bluetooth, 
  Image as ImageIcon,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { FuelType, DistributionType, TransmissionType, BodyType } from '../types/vehicle';
import { RegisterVehicleModal } from './RegisterVehicleModal';
import { Vehicle3DViewer } from './Vehicle3DViewer';

export const GarageView: React.FC = () => {
  const { 
    vehicles, 
    selectedVehicleId, 
    selectVehicle, 
    vehicle, 
    setVehicle, 
    deleteVehicle,
    garageViewMode, 
    setGarageViewMode, 
    openVehicleDetail,
    telemetry,
    pairVehicleBluetooth,
    setIsDailyTripsModalOpen
  } = useVehicle();
  const { t } = useLanguage();

  const [isEditing, setIsEditing] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  // Campos de formulario para edición
  const [brand, setBrand] = useState(vehicle.brand);
  const [model, setModel] = useState(vehicle.model);
  const [bodyType, setBodyType] = useState<BodyType>(vehicle.bodyType || 'sedan');
  const [year, setYear] = useState(vehicle.year);
  const [plate, setPlate] = useState(vehicle.licensePlate);
  const [fuelType, setFuelType] = useState<FuelType>(vehicle.fuelType);
  const [tankCapacity, setTankCapacity] = useState(vehicle.tankCapacity);
  const [distributionType, setDistributionType] = useState<DistributionType>(vehicle.distributionType);
  const [transmission, setTransmission] = useState<TransmissionType>(vehicle.transmission);
  const [bluetoothDeviceName, setBluetoothDeviceName] = useState<string>(vehicle.bluetoothDeviceName || '');
  const [has3dAnimation, setHas3dAnimation] = useState<boolean>(vehicle.has3dAnimation !== false);

  // Sincronizar estado local al cambiar de vehículo
  useEffect(() => {
    setBrand(vehicle.brand);
    setModel(vehicle.model);
    setBodyType(vehicle.bodyType || 'sedan');
    setYear(vehicle.year);
    setPlate(vehicle.licensePlate);
    setFuelType(vehicle.fuelType);
    setTankCapacity(vehicle.tankCapacity);
    setDistributionType(vehicle.distributionType);
    setTransmission(vehicle.transmission);
    setBluetoothDeviceName(vehicle.bluetoothDeviceName || '');
    setHas3dAnimation(vehicle.has3dAnimation !== false);
    setIsEditing(false);
  }, [vehicle]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedPath = has3dAnimation 
      ? `/models/${bodyType === 'other' ? 'sedan' : bodyType}.glb` 
      : undefined;

    setVehicle({
      ...vehicle,
      brand,
      model,
      bodyType,
      has3dAnimation,
      model3dPath: updatedPath,
      year,
      licensePlate: plate,
      fuelType,
      tankCapacity,
      distributionType,
      transmission,
      bluetoothDeviceName: bluetoothDeviceName.trim()
    });

    setIsEditing(false);
  };

  const handleDeleteVehiclePrompt = (e: React.MouseEvent, id: string, name: string) => {
    e.stopPropagation();
    if (vehicles.length <= 1) {
      alert('Debes conservar al menos un vehículo en tu garaje.');
      return;
    }

    if (window.confirm(`¿Estás seguro de eliminar el vehículo "${name}" de tu Garaje? Se eliminarán también sus configuraciones asociadas.`)) {
      deleteVehicle(id);
    }
  };

  const getModelLabel = (type?: string) => {
    switch (type) {
      case 'suv': return 'SUV';
      case '4x4': return '4x4';
      default: return 'Sedán';
    }
  };

  const isVehicle3D = vehicle.has3dAnimation !== false && Boolean(vehicle.model3dPath);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 pb-20 lg:pb-8 space-y-4 select-none">
      
      {/* =========================================================================
          MODO 1: LISTADO DE VEHÍCULOS PROPIOS (VISTA PRINCIPAL DEL GARAJE)
          ========================================================================= */}
      {garageViewMode === 'list' && (
        <div className="space-y-4 animate-fade-in">
          {/* Encabezado del Listado */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-extrabold text-amber-autumn uppercase tracking-wider">
                  {t('garageSectionBadge')}
                </span>
                <span className="text-[9px] text-tea">•</span>
                <span className="text-[9px] bg-carbon px-2 py-0.5 rounded-full border border-tea/50 text-text-secondary font-mono">
                  MIS VEHÍCULOS PROPIOS ({vehicles.length})
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-text-primary tracking-tight mt-0.5">
                Vehículos en tu Garaje
              </h1>
              <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
                Selecciona un vehículo de la lista para ingresar a sus detalles y ver su animación 3D.
              </p>
            </div>

            {/* Botón Registrar Nuevo Vehículo */}
            <button
              onClick={() => setIsRegisterModalOpen(true)}
              className="flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl bg-amber-autumn text-river text-xs font-extrabold hover:brightness-110 shadow-amber-glow transition-all whitespace-nowrap shrink-0"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>{t('registerVehicleBtn')}</span>
            </button>
          </div>

          {/* Listado en Tarjetas de Vehículos Propios */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {vehicles.map((v) => {
              const isSelected = v.id === selectedVehicleId;
              const has3D = v.has3dAnimation !== false && Boolean(v.model3dPath);

              return (
                <div
                  key={v.id}
                  onClick={() => openVehicleDetail(v.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group hover:scale-[1.01] ${
                    isSelected
                      ? 'bg-carbon border-amber-autumn shadow-amber-glow ring-1 ring-amber-autumn/50'
                      : 'bg-carbon/80 border-tea/50 hover:border-tea hover:bg-carbon'
                  }`}
                >
                  <div>
                    {/* Fila Superior: Marca, Modelo, Insignias y Botón Borrar */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border ${
                          isSelected
                            ? 'bg-amber-autumn/15 border-amber-autumn/40 text-amber-autumn'
                            : 'bg-river border-tea/40 text-text-secondary'
                        }`}>
                          <Car className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-bold text-text-secondary">
                              {v.brand} ({v.year})
                            </span>
                            {isSelected && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-full text-[9px] font-extrabold bg-amber-autumn text-river shrink-0">
                                <Check className="w-2.5 h-2.5 stroke-[2.5]" />
                                ACTIVO
                              </span>
                            )}
                          </div>
                          <h3 className="text-sm font-extrabold text-text-primary group-hover:text-amber-autumn transition-colors">
                            {v.model}
                          </h3>
                        </div>
                      </div>

                      {/* Botón Borrar Vehículo */}
                      <button
                        type="button"
                        onClick={(e) => handleDeleteVehiclePrompt(e, v.id, `${v.brand} ${v.model}`)}
                        className="p-1.5 rounded-xl text-text-secondary hover:text-red-400 hover:bg-red-950/30 transition-colors"
                        title="Borrar vehículo del garaje"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Especificaciones Rápidas */}
                    <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-river/60 border border-tea/30 text-[11px] my-2">
                      <div>
                        <span className="text-[9px] text-text-secondary block">Odómetro</span>
                        <strong className="text-text-primary font-mono">{v.currentOdometer.toLocaleString('es-AR')} km</strong>
                      </div>
                      <div>
                        <span className="text-[9px] text-text-secondary block">Combustible</span>
                        <strong className="text-text-primary truncate block">{v.fuelType}</strong>
                      </div>
                      <div>
                        <span className="text-[9px] text-text-secondary block">Transmisión</span>
                        <strong className="text-text-primary">{v.transmission}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Fila Inferior: Patente, Bluetooth y Botón de Ingreso al Detalle */}
                  <div className="pt-2 border-t border-tea/30 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-river border border-tea/40 text-text-primary">
                        {v.licensePlate}
                      </span>
                      {has3D ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-amber-autumn bg-carbon/90 px-2 py-0.5 rounded-full border border-amber-autumn/30">
                          <Sparkles className="w-3 h-3 text-amber-autumn" />
                          <span>Animación 3D</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-text-secondary bg-river px-2 py-0.5 rounded-full border border-tea/40">
                          <ImageIcon className="w-3 h-3 text-wood" />
                          <span>Silueta 2D</span>
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => openVehicleDetail(v.id)}
                      className="inline-flex items-center gap-1 text-xs font-extrabold text-amber-autumn group-hover:translate-x-0.5 transition-transform shrink-0"
                    >
                      <span>Entrar y Ver Detalles</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================================
          MODO 2: DETALLES DEL VEHÍCULO Y ANIMACIÓN 3D
          ========================================================================= */}
      {garageViewMode === 'detail' && (
        <div className="space-y-4 animate-fade-in">
          
          {/* Barra de Navegación para volver al listado */}
          <div className="flex items-center justify-between pb-2 border-b border-tea/40">
            <button
              type="button"
              onClick={() => setGarageViewMode('list')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-carbon border border-tea/60 hover:border-amber-autumn text-text-secondary hover:text-amber-autumn text-xs font-bold transition-all shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>← Volver al Listado de Vehículos</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-carbon border border-tea hover:border-amber-autumn text-amber-autumn text-xs font-bold transition-all"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{isEditing ? t('cancelEditBtn') : t('editSpecsBtn')}</span>
              </button>

              <button
                type="button"
                onClick={(e) => handleDeleteVehiclePrompt(e, vehicle.id, `${vehicle.brand} ${vehicle.model}`)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-950/30 border border-red-500/40 hover:bg-red-900/40 text-red-300 text-xs font-semibold transition-all"
                title="Eliminar este vehículo del garaje"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Eliminar</span>
              </button>
            </div>
          </div>

          {/* Tarjeta Principal y Render 3D / 2D al Entrar */}
          {!isEditing && (
            <div className="space-y-3">
              {/* Visualizador 3D Turntable si el auto cuenta con animación */}
              {isVehicle3D ? (
                <div className="space-y-2">
                  <div className="p-3 rounded-2xl bg-carbon border border-tea/50 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-autumn" />
                        <h3 className="text-xs font-extrabold text-text-primary uppercase tracking-wide">
                          Animación 3D Dimensional en Movimiento (360°)
                        </h3>
                      </div>
                      <p className="text-[11px] text-text-secondary mt-0.5">
                        {vehicle.brand} {vehicle.model} • Renderizado WebGL en tiempo real
                      </p>
                    </div>

                    <span className="text-[10px] font-mono text-amber-autumn bg-river px-2.5 py-1 rounded-lg border border-tea/40 font-bold">
                      {vehicle.model3dPath?.split('/').pop() || 'sedan.glb'}
                    </span>
                  </div>

                  <div className="relative rounded-3xl overflow-hidden border border-tea/60 bg-river shadow-card">
                    <Vehicle3DViewer
                      bodyType={vehicle.bodyType || 'sedan'}
                      model3dPath={vehicle.model3dPath}
                      modelName={`${vehicle.brand} ${vehicle.model}`}
                      heightClass="h-60 sm:h-80"
                    />
                    <div className="p-2.5 bg-carbon/80 backdrop-blur-sm border-t border-tea/30 flex items-center justify-between text-[10px] text-text-secondary">
                      <span className="flex items-center gap-1.5 text-text-primary font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        Modelo glTF Binary Activo • Rotación 360° interactiva
                      </span>
                      <span className="font-mono text-amber-autumn">
                        {getModelLabel(vehicle.bodyType)} 3D
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                /* Ficha 2D Ilustrada en caso de ser un auto sin animación 3D */
                <div className="p-4 rounded-3xl bg-river/80 border border-tea/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-wood" />
                      <h3 className="text-xs font-extrabold text-text-primary uppercase tracking-wide">
                        Vehículo con Silueta Técnica 2D
                      </h3>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-carbon border border-tea/40 text-text-secondary">
                      Sin animación 3D
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary">
                    Este vehículo está configurado con gráficos 2D. Puedes habilitar un render 3D pulsando "Editar Ficha".
                  </p>
                </div>
              )}

              {/* Ficha Técnica Detallada del Vehículo */}
              <div className="p-4 rounded-3xl bg-carbon border border-tea/60 shadow-card space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-river border border-tea flex items-center justify-center text-amber-autumn">
                    <Car className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-extrabold text-text-primary">
                      {vehicle.brand} {vehicle.model}
                    </h2>
                    <div className="flex items-center gap-2 text-xs text-text-secondary flex-wrap mt-0.5">
                      <span>Año {vehicle.year}</span>
                      <span>•</span>
                      <span className="font-mono bg-river px-2 py-0.5 rounded border border-tea/50 text-text-primary font-bold text-[11px]">
                        {vehicle.licensePlate}
                      </span>
                      <span>•</span>
                      <span className="text-amber-autumn font-bold text-[11px]">
                        {vehicle.fuelType}
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
                    <strong className="text-text-primary text-xs">{vehicle.tankCapacity} Litros</strong>
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

                <div className="p-3 rounded-xl bg-river/40 border border-tea/40 text-xs text-text-secondary space-y-1.5">
                  <div className="flex justify-between">
                    <span>{t('fieldVin')}:</span>
                    <span className="font-mono text-text-primary font-bold">{vehicle.vin || '8AJBA3BE2N0194821'}</span>
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

              {/* SECCIÓN DE CONEXIÓN BLUETOOTH DEL AUTO PROPIO */}
              <div className="p-4 rounded-3xl bg-carbon border border-tea/60 shadow-card space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bluetooth className="w-4 h-4 text-amber-autumn" />
                    <h3 className="text-xs font-extrabold uppercase text-text-primary tracking-wide">
                      Conexión Bluetooth para Telemetría en Movimiento
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsDailyTripsModalOpen(true)}
                    className="text-[11px] font-bold text-amber-autumn hover:underline"
                  >
                    Ver Podómetro & Recorridos Diarios →
                  </button>
                </div>

                <p className="text-[11px] text-text-secondary leading-relaxed">
                  Configura el Bluetooth propio de este auto ({vehicle.brand} {vehicle.model}). Cada vez que tu dispositivo se conecte, el sistema registrará los kilómetros diarios de movimiento hasta la desconexión.
                </p>

                <div className="p-3 rounded-2xl bg-river/60 border border-tea/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="text-[10px] text-text-secondary block">Dispositivo Bluetooth Asociado:</span>
                    <strong className="text-sm font-mono font-extrabold text-amber-autumn">
                      {vehicle.bluetoothDeviceName || 'Sin dispositivo vinculado'}
                    </strong>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsDailyTripsModalOpen(true)}
                      className="px-3.5 py-1.5 rounded-xl bg-amber-autumn text-river font-bold text-xs hover:brightness-110 shadow-amber-glow"
                    >
                      Abrir Telemetría Flotante
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Formulario de Edición de Especificaciones */}
          {isEditing && (
            <form onSubmit={handleSave} className="p-4 sm:p-5 rounded-3xl bg-carbon border border-tea/60 space-y-3.5 animate-fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-tea/40">
                <h2 className="text-xs font-extrabold text-text-primary uppercase tracking-wider">
                  Editar Especificaciones del Vehículo
                </h2>
                <span className="text-[10px] text-amber-autumn font-bold">
                  Configura silueta 3D/2D y Bluetooth
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-text-secondary font-semibold block mb-1">{t('fieldBrand')} *</label>
                  <input
                    type="text"
                    required
                    value={brand}
                    onChange={e => setBrand(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-river border border-tea/60 text-text-primary text-xs"
                  />
                </div>

                <div>
                  <label className="text-text-secondary font-semibold block mb-1">{t('fieldModel')} *</label>
                  <input
                    type="text"
                    required
                    value={model}
                    onChange={e => setModel(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-river border border-tea/60 text-text-primary text-xs"
                  />
                </div>

                {/* Opción de Animación 3D vs 2D */}
                <div>
                  <label className="text-text-secondary font-semibold block mb-1">
                    Tipo de Visualización para el Menú y Garaje
                  </label>
                  <select
                    value={has3dAnimation ? bodyType : '2d'}
                    onChange={e => {
                      const val = e.target.value;
                      if (val === '2d') {
                        setHas3dAnimation(false);
                      } else {
                        setHas3dAnimation(true);
                        setBodyType(val as BodyType);
                      }
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-river border border-tea/60 text-text-primary text-xs font-bold text-amber-autumn"
                  >
                    <option value="sedan">Animación 3D: Sedán (Corolla 2.0 · sedan.glb)</option>
                    <option value="suv">Animación 3D: SUV (RAV4 Hybrid · suv.glb)</option>
                    <option value="4x4">Animación 3D: 4x4 Pick-Up (Ranger Raptor · 4x4.glb)</option>
                    <option value="2d">Silueta 2D Ilustrada (Sin animación 3D)</option>
                  </select>
                </div>

                {/* Bluetooth Propio */}
                <div>
                  <label className="text-text-secondary font-semibold block mb-1">
                    Nombre del Bluetooth de este Vehículo
                  </label>
                  <input
                    type="text"
                    value={bluetoothDeviceName}
                    onChange={e => setBluetoothDeviceName(e.target.value)}
                    placeholder="ej. Toyota-BT_4821"
                    className="w-full px-3 py-2 rounded-xl bg-river border border-tea/60 text-text-primary font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="text-text-secondary font-semibold block mb-1">{t('fieldYear')} *</label>
                  <input
                    type="number"
                    value={year}
                    onChange={e => setYear(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-river border border-tea/60 text-text-primary text-xs"
                  />
                </div>

                <div>
                  <label className="text-text-secondary font-semibold block mb-1">{t('fieldPlate')} *</label>
                  <input
                    type="text"
                    value={plate}
                    onChange={e => setPlate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-river border border-tea/60 text-text-primary font-mono text-xs uppercase"
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
                  className="px-3.5 py-1.5 rounded-xl text-xs text-text-secondary hover:text-text-primary"
                >
                  {t('cancelEditBtn')}
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-amber-autumn text-river font-extrabold text-xs hover:brightness-110 shadow-amber-glow"
                >
                  {t('saveSpecsBtn')}
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Modal de Registro de Nuevo Vehículo */}
      <RegisterVehicleModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
      />
    </div>
  );
};
