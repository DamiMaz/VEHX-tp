import React, { useState } from 'react';
import { useVehicle } from '../context/VehicleContext';
import { useLanguage } from '../context/LanguageContext';
import { SAMPLE_RECEIPT_SVG } from '../data/seedData';
import { 
  X, 
  CheckCircle2, 
  Wrench, 
  UploadCloud, 
  FileText, 
  Image as ImageIcon, 
  ShieldCheck, 
  Eye 
} from 'lucide-react';

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

  const [cost, setCost] = useState<number>(selectedServiceForModal?.cost || 85000);
  const [workshop, setWorkshop] = useState<string>(selectedServiceForModal?.workshop || 'Taller Oficial Autorizado');
  const [invoiceNumber, setInvoiceNumber] = useState<string>(
    `FAC-000${Math.floor(1 + Math.random() * 9)}-00${Math.floor(10000 + Math.random() * 89999)}`
  );
  const [partsDetail, setPartsDetail] = useState<string>(
    'Repuestos originales según pauta del manual de fabricante'
  );
  const [notes, setNotes] = useState<string>(selectedServiceForModal?.notes || 'Mantenimiento preventivo completado según manual');
  
  // Comprobante de Service (archivo o comprobante digital oficial)
  const [receiptFileUrl, setReceiptFileUrl] = useState<string>(SAMPLE_RECEIPT_SVG);
  const [receiptFileName, setReceiptFileName] = useState<string>('Factura_Oficial_Service.svg');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  if (!isPerformServiceModalOpen || !selectedServiceForModal) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReceiptFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setReceiptFileUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performService(selectedServiceForModal.id, {
      cost,
      workshop,
      notes,
      invoiceNumber,
      partsDetail,
      receiptFileUrl,
      receiptFileName
    });
    setIsPerformServiceModalOpen(false);
    setSelectedServiceForModal(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm animate-fade-in select-none">
      <div className="relative w-full max-w-md bg-carbon border border-tea/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Cabecera */}
        <div className="flex items-center justify-between p-4 bg-carbon-surface border-b border-tea/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-autumn/15 flex items-center justify-center border border-amber-autumn/30">
              <Wrench className="w-4 h-4 text-amber-autumn" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-text-primary">{t('performServiceModalTitle')}</h2>
              <p className="text-[11px] text-amber-autumn font-semibold">{selectedServiceForModal.name}</p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsPerformServiceModalOpen(false);
              setSelectedServiceForModal(null);
            }}
            className="p-1.5 rounded-xl text-text-secondary hover:text-text-primary hover:bg-river/60"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3.5 text-xs overflow-y-auto flex-1">
          <div className="p-3 rounded-2xl bg-river/60 border border-tea/50 text-xs flex items-center justify-between">
            <span className="text-text-secondary">{t('currentServiceOdo')}</span>
            <span className="font-extrabold text-amber-autumn font-mono text-sm">
              {vehicle.currentOdometer.toLocaleString('es-AR')} {t('kmUnit')}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-text-primary block mb-1">
                {t('serviceCostLabel')} *
              </label>
              <input
                type="number"
                required
                value={cost}
                onChange={(e) => setCost(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-river border border-tea/60 text-text-primary font-bold text-sm focus:outline-none focus:border-amber-autumn font-mono"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-text-primary block mb-1">
                Número de Factura / Ticket *
              </label>
              <input
                type="text"
                required
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-river border border-tea/60 text-text-primary font-bold text-xs focus:outline-none focus:border-amber-autumn font-mono"
              />
            </div>
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
              Repuestos y Materiales Reemplazados
            </label>
            <input
              type="text"
              value={partsDetail}
              onChange={(e) => setPartsDetail(e.target.value)}
              placeholder="ej. 4 Bujías Iridio, Aceite 5W-30, Pastillas cerámicas"
              className="w-full px-3 py-2 rounded-xl bg-river border border-tea/60 text-text-primary text-xs focus:outline-none focus:border-amber-autumn"
            />
          </div>

          {/* Carga de Comprobante / Factura Digital */}
          <div className="p-3 rounded-2xl bg-river/50 border border-tea/50 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-extrabold text-amber-autumn uppercase tracking-wide flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                <span>Comprobante de Service (Para Venta)</span>
              </label>
              <span className="text-[9px] text-text-secondary">Foto o Factura PDF</span>
            </div>

            <div className="flex items-center gap-2">
              <label className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-carbon border border-dashed border-tea hover:border-amber-autumn text-text-secondary hover:text-amber-autumn cursor-pointer transition-all">
                <UploadCloud className="w-3.5 h-3.5" />
                <span className="text-[11px] font-bold truncate">Subir Comprobante / Foto</span>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {receiptFileUrl && (
                <button
                  type="button"
                  onClick={() => setIsPreviewOpen(true)}
                  className="px-3 py-2 rounded-xl bg-river border border-tea hover:border-amber-autumn text-text-primary font-bold text-[11px] flex items-center gap-1 shrink-0"
                >
                  <Eye className="w-3.5 h-3.5 text-amber-autumn" />
                  <span>Ver ({receiptFileName.slice(0, 10)}...)</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-semibold pt-0.5">
              <ShieldCheck className="w-3 h-3" />
              <span>Se archivará en la Billetera Virtual y en el Pasaporte de Venta</span>
            </div>
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

        {/* Modal de Previsualización del Comprobante */}
        {isPreviewOpen && (
          <div className="absolute inset-0 z-50 bg-black/90 p-4 flex flex-col justify-between items-center animate-fade-in">
            <div className="w-full flex justify-between items-center text-xs pb-2 border-b border-tea/50">
              <span className="font-extrabold text-text-primary">{receiptFileName}</span>
              <button
                type="button"
                onClick={() => setIsPreviewOpen(false)}
                className="p-1 rounded-lg text-text-secondary hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 w-full flex items-center justify-center p-2 overflow-auto">
              <img
                src={receiptFileUrl}
                alt="Comprobante"
                className="max-h-[60vh] max-w-full rounded-xl object-contain shadow-2xl border border-tea/40"
              />
            </div>
            <button
              type="button"
              onClick={() => setIsPreviewOpen(false)}
              className="w-full py-2 bg-amber-autumn text-river font-bold text-xs rounded-xl"
            >
              Cerrar Vista Previa
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
