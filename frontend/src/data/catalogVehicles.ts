import { CatalogVehicleModel } from '../types/vehicle';

export const CATALOG_VEHICLES: CatalogVehicleModel[] = [
  {
    id: 'catalog-sedan',
    category: 'sedan',
    categoryLabel: 'Sedán',
    brand: 'Toyota',
    model: 'Corolla 2.0 Dynamic Force',
    defaultFuelType: 'Nafta Súper',
    defaultTankCapacity: 50,
    defaultDistributionType: 'Cadena',
    defaultTransmission: 'Automática',
    model3dFile: 'sedan.glb',
    model3dPath: '/models/sedan.glb',
    specsSummary: '2.0L Dynamic Force · Confort y eficiencia aerodinámica',
    description: 'Sedán compacto/mediano de 3 volúmenes, excelente aerodinámica, bajo consumo urbano y estabilidad en autopista.'
  },
  {
    id: 'catalog-suv',
    category: 'suv',
    categoryLabel: 'SUV',
    brand: 'Toyota',
    model: 'RAV4 Hybrid AWD',
    defaultFuelType: 'Híbrido',
    defaultTankCapacity: 55,
    defaultDistributionType: 'Cadena',
    defaultTransmission: 'Automática',
    model3dFile: 'suv.glb',
    model3dPath: '/models/suv.glb',
    specsSummary: '2.5L Híbrido AWD · Despeje elevado y confort familiar',
    description: 'SUV versátil con postura de manejo elevada, tracción en las 4 ruedas y espacio amplio para viajes largos.'
  },
  {
    id: 'catalog-4x4',
    category: '4x4',
    categoryLabel: '4x4 / Pick-up',
    brand: 'Ford',
    model: 'Ranger Raptor 4x4 V6',
    defaultFuelType: 'Nafta Premium',
    defaultTankCapacity: 80,
    defaultDistributionType: 'Cadena',
    defaultTransmission: 'Automática',
    model3dFile: '4x4.glb',
    model3dPath: '/models/4x4.glb',
    specsSummary: '3.0L V6 Biturbo 4x4 · Suspensión Fox y chasis reforzado',
    description: 'Vehículo todoterreno de alto rendimiento con despeje superior, neumáticos All-Terrain y bloqueo de diferencial.'
  }
];
