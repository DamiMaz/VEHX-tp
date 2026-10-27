import React, { useState } from 'react';
import { useVehicle } from '../context/VehicleContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  X, 
  CreditCard, 
  FileText, 
  ShieldCheck, 
  Printer, 
  CheckCircle2, 
  Download, 
  ExternalLink, 
  Calendar, 
  Wrench, 
  DollarSign, 
  Sparkles,
  Award,
  Car,
  Eye
} from 'lucide-react';

export const ServiceWalletModal: React.FC = () => {
  const { 
    isServiceWalletModalOpen, 
    setIsServiceWalletModalOpen, 
    vehicle, 
    serviceHistory, 
    services, 
    telemetry 
  } = useVehicle();
  const { t } = useLanguage();

  const [activeTab, setActiveTab] = useState<'wallet' | 'passport'>('wallet');
  const [selectedReceipt, setSelectedReceipt] = useState<{ url: string; name: string } | null>(null);

  if (!isServiceWalletModalOpen) return null;

  // Filtrar el historial perteneciente a este vehículo
  const vehicleHistory = serviceHistory.filter(s => s.vehicleId === vehicle.id);
  const totalInvested = vehicleHistory.reduce((acc, curr) => acc + curr.cost, 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fade-in select-none print:p-0 print:bg-white">
      <div className="relative w-full max-w-3xl max-h-[92vh] flex flex-col rounded-3xl bg-carbon border border-tea/80 shadow-2xl overflow-hidden print:max-h-none print:shadow-none print:border-none print:bg-white print:text-black">
        
        {/* Cabecera del Modal */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-tea/50 bg-gradient-to-r from-river to-carbon print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-autumn/15 border border-amber-autumn/40 flex items-center justify-center text-amber-autumn shadow-amber-glow">
              <CreditCard className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-extrabold text-text-primary tracking-tight">
                  Billetera Virtual & Pasaporte de Venta
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-autumn text-river font-mono">
                  {vehicle.licensePlate}
                </span>
              </div>
              <p className="text-[11px] text-text-secondary">
                {vehicle.brand} {vehicle.model} ({vehicle.year}) • Historial de comprobantes certificados
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsServiceWalletModalOpen(false)}
            className="p-1.5 rounded-xl bg-river/60 hover:bg-river text-text-secondary hover:text-text-primary border border-tea/40 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Switch de Pestañas: Billetera vs Pasaporte de Venta */}
        <div className="p-3 bg-river border-b border-tea/40 flex items-center justify-between gap-2 print:hidden">
          <div className="flex rounded-xl bg-carbon p-1 border border-tea/40 gap-1 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setActiveTab('wallet')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'wallet'
                  ? 'bg-amber-autumn text-river shadow-amber-glow font-extrabold'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Billetera de Comprobantes ({vehicleHistory.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('passport')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'passport'
                  ? 'bg-amber-autumn text-river shadow-amber-glow font-extrabold'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Pasaporte Certificado para Venta</span>
            </button>
          </div>

          {activeTab === 'passport' && (
            <button
              type="button"
              onClick={handlePrint}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-river hover:bg-carbon border border-tea text-text-primary text-xs font-bold transition-all"
            >
              <Printer className="w-3.5 h-3.5 text-amber-autumn" />
              <span>Imprimir / Exportar Reporte</span>
            </button>
          )}
        </div>

        {/* Contenido Dinámico */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 print:p-0 print:overflow-visible">
          
          {/* TAB 1: BILLETERA VIRTUAL DE COMPROBANTES */}
          {activeTab === 'wallet' && (
            <div className="space-y-4">
              
              {/* Tarjeta de Crédito / Wallet Digital del Auto */}
              <div className="relative rounded-3xl p-5 sm:p-6 overflow-hidden bg-gradient-to-br from-[#1C2530] via-[#161D26] to-[#0F141A] border border-amber-autumn/40 shadow-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-amber-autumn" />
                    <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-autumn font-mono">
                      AUTOCARE SERVICE WALLET PASS
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-text-secondary">
                    {vehicle.licensePlate}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div>
                    <span className="text-[10px] text-text-secondary uppercase font-semibold block">
                      Inversión Total en Mantenimiento
                    </span>
                    <div className="text-2xl font-extrabold text-text-primary font-mono mt-0.5">
                      ${totalInvested.toLocaleString('es-AR')}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-text-secondary uppercase font-semibold block">
                      Comprobantes Oficiales Guardados
                    </span>
                    <div className="text-2xl font-extrabold text-amber-autumn font-mono mt-0.5 flex items-center gap-1.5">
                      <FileText className="w-5 h-5 text-amber-autumn" />
                      <span>{vehicleHistory.length} Facturas</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-text-secondary uppercase font-semibold block">
                      Índice de Valorización
                    </span>
                    <div className="text-base font-extrabold text-emerald-400 mt-1 flex items-center gap-1">
                      <ShieldCheck className="w-4 h-4" />
                      <span>98% Confiabilidad Oficial</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-tea/30 flex items-center justify-between text-[11px] text-text-secondary">
                  <span>Vehículo: <strong>{vehicle.brand} {vehicle.model} ({vehicle.year})</strong></span>
                  <span className="font-mono">VIN: {vehicle.vin || '8AJBA3BE2N0194821'}</span>
                </div>
              </div>

              {/* Listado de Facturas y Comprobantes Adjuntos */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-extrabold uppercase text-text-primary tracking-wide flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-amber-autumn" />
                    <span>Bitácora de Comprobantes Digitales ({vehicleHistory.length})</span>
                  </h3>
                  <span className="text-[10px] text-text-secondary">
                    Hacer clic en "Ver Comprobante" para inspeccionar el documento
                  </span>
                </div>

                {vehicleHistory.length === 0 ? (
                  <div className="p-8 text-center rounded-2xl bg-river/40 border border-tea/40 text-text-secondary text-xs">
                    No hay comprobantes de service cargados aún para este vehículo.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {vehicleHistory.map((slog) => (
                      <div
                        key={slog.id}
                        className="p-4 rounded-2xl bg-carbon border border-tea/60 hover:border-tea transition-all space-y-2.5 flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="font-mono font-bold text-amber-autumn px-2 py-0.5 rounded bg-river border border-tea/40">
                              {slog.invoiceNumber || 'FAC-S/N'}
                            </span>
                            <span className="text-text-secondary flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-wood" />
                              {slog.date}
                            </span>
                          </div>

                          <h4 className="text-sm font-extrabold text-text-primary mt-2">
                            {slog.serviceName}
                          </h4>

                          <div className="text-[11px] text-text-secondary mt-1 space-y-0.5">
                            <div>Taller: <strong className="text-text-primary">{slog.workshop}</strong></div>
                            {slog.workshopCuit && (
                              <div className="font-mono text-[10px]">CUIT: {slog.workshopCuit}</div>
                            )}
                            {slog.partsDetail && (
                              <div className="text-text-secondary line-clamp-2">Repuestos: {slog.partsDetail}</div>
                            )}
                          </div>
                        </div>

                        <div className="pt-2 border-t border-tea/30 flex items-center justify-between">
                          <div>
                            <span className="text-[9px] text-text-secondary block">Odómetro / Monto</span>
                            <div className="text-xs font-extrabold text-text-primary font-mono">
                              {slog.odometer.toLocaleString('es-AR')} km • ${slog.cost.toLocaleString('es-AR')}
                            </div>
                          </div>

                          {slog.receiptFileUrl ? (
                            <button
                              type="button"
                              onClick={() => setSelectedReceipt({
                                url: slog.receiptFileUrl!,
                                name: slog.receiptFileName || slog.invoiceNumber || 'Comprobante'
                              })}
                              className="px-3 py-1.5 rounded-xl bg-amber-autumn/15 hover:bg-amber-autumn border border-amber-autumn/50 text-amber-autumn hover:text-river font-bold text-[11px] transition-all flex items-center gap-1.5"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Ver Comprobante</span>
                            </button>
                          ) : (
                            <span className="text-[10px] text-text-secondary italic">Sin adjunto</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: PASAPORTE CERTIFICADO PARA VENTA DEL AUTO */}
          {activeTab === 'passport' && (
            <div className="space-y-4 print:space-y-6">
              
              {/* Encabezado Formal del Pasaporte */}
              <div className="p-5 rounded-3xl bg-river/60 border border-tea/60 space-y-3 print:bg-transparent print:border-black print:p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-tea/40 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-amber-autumn" />
                      <span className="text-xs font-extrabold uppercase tracking-wider text-amber-autumn font-mono">
                        INFORME DE CERTIFICACIÓN PARA VENTA DEL VEHÍCULO
                      </span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-extrabold text-text-primary mt-1 print:text-black">
                      {vehicle.brand} {vehicle.model} ({vehicle.year})
                    </h3>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-text-secondary uppercase block print:text-gray-600">Dominio / Patente</span>
                    <span className="text-lg font-mono font-extrabold text-text-primary px-3 py-0.5 rounded-lg bg-carbon border border-tea print:border-black print:text-black">
                      {vehicle.licensePlate}
                    </span>
                  </div>
                </div>

                {/* Grid de Verificación Oficial de Integridad */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-carbon/80 border border-tea/40 print:border-gray-300">
                    <span className="text-[10px] text-text-secondary block">Odómetro Real Certificado</span>
                    <strong className="text-sm font-extrabold text-amber-autumn font-mono print:text-black">
                      {vehicle.currentOdometer.toLocaleString('es-AR')} km
                    </strong>
                  </div>

                  <div className="p-2.5 rounded-xl bg-carbon/80 border border-tea/40 print:border-gray-300">
                    <span className="text-[10px] text-text-secondary block">Verificación de Telemetría</span>
                    <strong className="text-xs font-extrabold text-emerald-400 print:text-green-800 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Odómetro Genuino
                    </strong>
                  </div>

                  <div className="p-2.5 rounded-xl bg-carbon/80 border border-tea/40 print:border-gray-300">
                    <span className="text-[10px] text-text-secondary block">Distribución</span>
                    <strong className="text-xs font-extrabold text-text-primary print:text-black">
                      {vehicle.distributionType}
                    </strong>
                  </div>

                  <div className="p-2.5 rounded-xl bg-carbon/80 border border-tea/40 print:border-gray-300">
                    <span className="text-[10px] text-text-secondary block">VIN / Chasis</span>
                    <strong className="text-[11px] font-mono font-extrabold text-text-primary print:text-black">
                      {vehicle.vin || '8AJBA3BE2N0194821'}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Estado Clínico Actual de Componentes Críticos */}
              <div className="p-4 rounded-2xl bg-carbon border border-tea/50 space-y-3 print:border-gray-300">
                <h4 className="text-xs font-extrabold uppercase text-text-primary tracking-wide print:text-black">
                  Estado Clínico de Componentes (Diagnóstico para el Comprador)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  {services.slice(0, 6).map(s => (
                    <div key={s.id} className="p-2.5 rounded-xl bg-river/60 border border-tea/30 print:border-gray-200">
                      <div className="flex items-center justify-between text-[11px] font-bold">
                        <span className="text-text-primary truncate print:text-black">{s.name}</span>
                        {s.status === 'ok' ? (
                          <span className="text-emerald-400 font-extrabold text-[10px] print:text-green-700">OK</span>
                        ) : (
                          <span className="text-amber-autumn font-extrabold text-[10px] print:text-amber-700">Atención</span>
                        )}
                      </div>
                      <span className="text-[10px] text-text-secondary block mt-0.5 print:text-gray-600">
                        {s.statusMessage}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tabla Formal de Mantenimientos Realizados con Comprobante Fiscal */}
              <div className="p-4 rounded-2xl bg-carbon border border-tea/50 space-y-2 print:border-gray-300">
                <div className="flex items-center justify-between pb-2 border-b border-tea/40">
                  <h4 className="text-xs font-extrabold uppercase text-text-primary tracking-wide print:text-black">
                    Historial Certificado con Comprobante Fiscal Adjunto
                  </h4>
                  <span className="text-[10px] text-text-secondary print:text-gray-600 font-mono">
                    Total Invertido: ${totalInvested.toLocaleString('es-AR')}
                  </span>
                </div>

                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-tea/40 text-[10px] uppercase text-text-secondary print:text-gray-600">
                      <th className="py-2 px-2">Fecha</th>
                      <th className="py-2 px-2">Service Realizado</th>
                      <th className="py-2 px-2">Kilometraje</th>
                      <th className="py-2 px-2">Taller</th>
                      <th className="py-2 px-2">N° Factura</th>
                      <th className="py-2 px-2 text-right">Monto</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-tea/20">
                    {vehicleHistory.map((slog) => (
                      <tr key={slog.id} className="hover:bg-river/40">
                        <td className="py-2.5 px-2 text-text-primary font-mono text-[11px] print:text-black">{slog.date}</td>
                        <td className="py-2.5 px-2 font-bold text-amber-autumn text-xs print:text-black">{slog.serviceName}</td>
                        <td className="py-2.5 px-2 text-text-primary font-mono text-[11px] print:text-black">{slog.odometer.toLocaleString('es-AR')} km</td>
                        <td className="py-2.5 px-2 text-text-secondary text-[11px] print:text-gray-700">{slog.workshop}</td>
                        <td className="py-2.5 px-2 text-emerald-400 font-mono text-[11px] print:text-green-800 font-bold">
                          {slog.invoiceNumber || 'FAC-OFICIAL'}
                        </td>
                        <td className="py-2.5 px-2 text-right font-bold text-text-primary print:text-black">
                          ${slog.cost.toLocaleString('es-AR')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Sello de Garantía para el Comprador */}
              <div className="p-3.5 rounded-2xl bg-emerald-950/20 border border-emerald-500/40 flex items-center justify-between text-xs print:border-green-600">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <div>
                    <span className="font-extrabold text-emerald-400 block">
                      Certificación Transparente de Mantenimiento Emitida por VEHX
                    </span>
                    <span className="text-[11px] text-text-secondary print:text-gray-600">
                      Todos los registros concuerdan con el odómetro y comprobantes fiscales declarados.
                    </span>
                  </div>
                </div>
                <div className="hidden sm:block text-right">
                  <span className="text-[10px] text-text-secondary block font-mono">FECHA EMISIÓN</span>
                  <span className="text-xs font-mono font-bold text-text-primary print:text-black">
                    {new Date().toISOString().split('T')[0]}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal de Lightbox para ver Comprobante / Factura en Grande */}
        {selectedReceipt && (
          <div className="fixed inset-0 z-50 bg-black/90 p-4 flex flex-col justify-between items-center animate-fade-in">
            <div className="w-full max-w-xl flex justify-between items-center text-xs pb-2 border-b border-tea/50">
              <span className="font-extrabold text-text-primary text-sm">{selectedReceipt.name}</span>
              <button
                type="button"
                onClick={() => setSelectedReceipt(null)}
                className="p-1 rounded-lg text-text-secondary hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 w-full max-w-xl flex items-center justify-center p-2 overflow-auto">
              <img
                src={selectedReceipt.url}
                alt="Comprobante de Service"
                className="max-h-[70vh] max-w-full rounded-2xl object-contain shadow-2xl border border-tea/40"
              />
            </div>
            <div className="w-full max-w-xl flex gap-2">
              <button
                type="button"
                onClick={() => setSelectedReceipt(null)}
                className="flex-1 py-2 bg-amber-autumn text-river font-bold text-xs rounded-xl hover:brightness-110"
              >
                Volver a la Billetera
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
