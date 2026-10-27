import React, { useState, useMemo } from 'react';
import { useVehicle } from '../context/VehicleContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  SERVICE_CATEGORIES, 
  ALL_CATALOG_SERVICES, 
  CatalogServiceItem 
} from '../data/serviceCatalog';
import { 
  X, 
  Search, 
  Plus, 
  Check, 
  Wrench, 
  Calendar, 
  Gauge, 
  DollarSign, 
  ShieldCheck, 
  ChevronRight,
  ArrowLeft
} from 'lucide-react';

export const AddServiceFromCatalogModal: React.FC = () => {
  const { 
    isAddServiceFromCatalogModalOpen, 
    setIsAddServiceFromCatalogModalOpen, 
    vehicle, 
    addServiceItem 
  } = useVehicle();
  const { t } = useLanguage();

  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedService, setSelectedService] = useState<CatalogServiceItem | null>(null);

  // Campos de configuración para el service a agregar
  const [customName, setCustomName] = useState<string>('');
  const [intervalKm, setIntervalKm] = useState<number>(10000);
  const [intervalDays, setIntervalDays] = useState<number>(365);
  const [lastServiceKm, setLastServiceKm] = useState<number>(vehicle.currentOdometer);
  const [lastServiceDate, setLastServiceDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [cost, setCost] = useState<number>(65000);
  const [workshop, setWorkshop] = useState<string>('Taller Oficial');
  const [notes, setNotes] = useState<string>('');

  if (!isAddServiceFromCatalogModalOpen) return null;

  const handleSelectService = (item: CatalogServiceItem) => {
    setSelectedService(item);
    setCustomName(item.name);
    setIntervalKm(item.defaultIntervalKm);
    setIntervalDays(item.defaultIntervalDays);
    setLastServiceKm(vehicle.currentOdometer);
    setCost(item.defaultCost);
    setNotes(item.description);
  };

  const filteredServices = useMemo(() => {
    return ALL_CATALOG_SERVICES.filter(s => {
      const matchCat = selectedCategory === 'Todas' || s.category === selectedCategory;
      const matchQuery = !searchQuery.trim() || 
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [selectedCategory, searchQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService) return;

    // Normalizar categoría de acuerdo a la interfaz ServiceItem ('Aceite' | 'Distribución' | 'Frenos' | 'Neumáticos' | 'General')
    let normalizedCategory: 'Aceite' | 'Distribución' | 'Frenos' | 'Neumáticos' | 'General' = 'General';
    const catLower = selectedService.category.toLowerCase();
    const nameLower = customName.toLowerCase();

    if (catLower.includes('lubricación') || nameLower.includes('aceite')) {
      normalizedCategory = 'Aceite';
    } else if (nameLower.includes('distribución') || nameLower.includes('correa') || nameLower.includes('cadena')) {
      normalizedCategory = 'Distribución';
    } else if (catLower.includes('frenos') || nameLower.includes('pastillas') || nameLower.includes('disco')) {
      normalizedCategory = 'Frenos';
    } else if (catLower.includes('suspensión') || nameLower.includes('neumático') || nameLower.includes('alineación')) {
      normalizedCategory = 'Neumáticos';
    }

    addServiceItem({
      name: customName.trim(),
      category: normalizedCategory,
      intervalKm,
      intervalDays,
      lastServiceKm,
      lastServiceDate,
      cost,
      workshop,
      notes
    });

    setIsAddServiceFromCatalogModalOpen(false);
    setSelectedService(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-2xl max-h-[92vh] flex flex-col rounded-3xl bg-carbon border border-tea/80 shadow-2xl overflow-hidden">
        
        {/* Cabecera */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-tea/50 bg-gradient-to-r from-river to-carbon">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-autumn/15 border border-amber-autumn/40 flex items-center justify-center text-amber-autumn shadow-amber-glow">
              <Wrench className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-text-primary tracking-tight">
                Catálogo Oficial de Servicios (service_list.txt)
              </h2>
              <p className="text-[11px] text-text-secondary">
                Agregar nuevo mantenimiento para {vehicle.brand} {vehicle.model}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setIsAddServiceFromCatalogModalOpen(false);
              setSelectedService(null);
            }}
            className="p-1.5 rounded-xl bg-river/60 hover:bg-river text-text-secondary hover:text-text-primary border border-tea/40 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Contenido Dinámico: Catálogo o Formulario de Configuración */}
        {!selectedService ? (
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5">
            {/* Buscador */}
            <div className="relative">
              <Search className="w-4 h-4 text-text-secondary absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar servicio (ej. bujías, pastillas, aceite, bomba de agua, alineación)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-river border border-tea/60 text-text-primary text-xs focus:outline-none focus:border-amber-autumn placeholder:text-text-secondary"
              />
            </div>

            {/* Selector de Categorías Horizontal */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
              <button
                type="button"
                onClick={() => setSelectedCategory('Todas')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border shrink-0 ${
                  selectedCategory === 'Todas'
                    ? 'bg-amber-autumn text-river border-amber-autumn shadow-amber-glow font-extrabold'
                    : 'bg-river text-text-secondary border-tea/40 hover:text-text-primary'
                }`}
              >
                Todas ({ALL_CATALOG_SERVICES.length})
              </button>
              {SERVICE_CATEGORIES.map(cat => (
                <button
                  key={cat.category}
                  type="button"
                  onClick={() => setSelectedCategory(cat.category)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border shrink-0 ${
                    selectedCategory === cat.category
                      ? 'bg-amber-autumn text-river border-amber-autumn shadow-amber-glow font-extrabold'
                      : 'bg-river text-text-secondary border-tea/40 hover:text-text-primary'
                  }`}
                >
                  {cat.category} ({cat.services.length})
                </button>
              ))}
            </div>

            {/* Listado de Servicios del Catálogo */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-text-secondary">
                <span>Servicios Disponibles ({filteredServices.length})</span>
                <span className="text-[10px]">Toca un servicio para configurar sus intervalos</span>
              </div>

              <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
                {filteredServices.map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectService(item)}
                    className="w-full p-3 rounded-2xl bg-river/70 border border-tea/50 hover:border-amber-autumn/80 hover:bg-river text-left transition-all flex items-center justify-between gap-3 group"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-carbon text-amber-autumn border border-amber-autumn/30 font-mono">
                          {item.category}
                        </span>
                        <span className="text-[10px] text-text-secondary font-mono">
                          {item.defaultIntervalKm.toLocaleString('es-AR')} km / {item.defaultIntervalDays} d
                        </span>
                      </div>
                      <div className="text-xs font-extrabold text-text-primary group-hover:text-amber-autumn transition-colors">
                        {item.name}
                      </div>
                      <p className="text-[11px] text-text-secondary line-clamp-1">
                        {item.description}
                      </p>
                    </div>

                    <div className="shrink-0 flex items-center gap-2 text-text-secondary group-hover:text-amber-autumn">
                      <span className="text-xs font-bold text-text-primary font-mono hidden sm:inline">
                        ~${item.defaultCost.toLocaleString('es-AR')}
                      </span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Formulario de Configuración del Service Seleccionado */
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5">
            <button
              type="button"
              onClick={() => setSelectedService(null)}
              className="flex items-center gap-1.5 text-xs font-bold text-amber-autumn hover:underline pb-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Volver al Catálogo de Servicios</span>
            </button>

            <div className="p-3.5 rounded-2xl bg-river/70 border border-tea/60 space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-amber-autumn font-mono">
                {selectedService.category}
              </span>
              <h3 className="text-sm font-extrabold text-text-primary">
                Configuración del Servicio: {selectedService.name}
              </h3>
              <p className="text-[11px] text-text-secondary">
                {selectedService.description}
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] font-semibold text-text-primary block mb-1">
                  Nombre del Servicio *
                </label>
                <input
                  type="text"
                  required
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-river border border-tea/60 text-text-primary font-bold text-xs focus:outline-none focus:border-amber-autumn"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-text-primary block mb-1">
                    Intervalo en Kilómetros (km) *
                  </label>
                  <input
                    type="number"
                    min="1000"
                    step="500"
                    required
                    value={intervalKm}
                    onChange={(e) => setIntervalKm(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-river border border-tea/60 text-text-primary font-mono font-bold text-xs focus:outline-none focus:border-amber-autumn"
                  />
                  <span className="text-[10px] text-text-secondary mt-0.5 block">
                    Sugerido por manual: {selectedService.defaultIntervalKm.toLocaleString('es-AR')} km
                  </span>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-text-primary block mb-1">
                    Intervalo en Tiempo (Días) *
                  </label>
                  <input
                    type="number"
                    min="30"
                    step="15"
                    required
                    value={intervalDays}
                    onChange={(e) => setIntervalDays(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-river border border-tea/60 text-text-primary font-mono font-bold text-xs focus:outline-none focus:border-amber-autumn"
                  />
                  <span className="text-[10px] text-text-secondary mt-0.5 block">
                    {Math.round(intervalDays / 30)} meses aprox ({selectedService.defaultIntervalDays} d)
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-text-primary block mb-1">
                    Último Odómetro Realizado (km) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={lastServiceKm}
                    onChange={(e) => setLastServiceKm(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-river border border-tea/60 text-text-primary font-mono text-xs focus:outline-none focus:border-amber-autumn"
                  />
                  <span className="text-[10px] text-text-secondary mt-0.5 block">
                    Odómetro actual del auto: {vehicle.currentOdometer.toLocaleString('es-AR')} km
                  </span>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-text-primary block mb-1">
                    Última Fecha Realizada *
                  </label>
                  <input
                    type="date"
                    required
                    value={lastServiceDate}
                    onChange={(e) => setLastServiceDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-river border border-tea/60 text-text-primary text-xs focus:outline-none focus:border-amber-autumn"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-text-primary block mb-1">
                    Costo Estimado de Realización ($)
                  </label>
                  <input
                    type="number"
                    value={cost}
                    onChange={(e) => setCost(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-river border border-tea/60 text-text-primary font-mono text-xs focus:outline-none focus:border-amber-autumn"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-text-primary block mb-1">
                    Taller o Lubricentro de Referencia
                  </label>
                  <input
                    type="text"
                    value={workshop}
                    onChange={(e) => setWorkshop(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-river border border-tea/60 text-text-primary text-xs focus:outline-none focus:border-amber-autumn"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-text-primary block mb-1">
                  Observaciones o Especificación Técnica
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-river border border-tea/60 text-text-primary text-xs focus:outline-none focus:border-amber-autumn resize-none"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-tea/40 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedService(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-text-secondary hover:text-text-primary"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-autumn text-river font-extrabold text-xs hover:brightness-110 shadow-amber-glow transition-all"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Incorporar Service al Plan del Auto</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
