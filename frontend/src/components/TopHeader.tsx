import React, { useState } from 'react';
import { useVehicle } from '../context/VehicleContext';
import { useLanguage, LanguageToggle } from '../context/LanguageContext';
import { 
  Bell, 
  Menu, 
  RotateCcw, 
  Car, 
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  X,
  Layers
} from 'lucide-react';

export const TopHeader: React.FC = () => {
  const { 
    vehicle, 
    restoreDemoData, 
    services, 
    setActiveTab, 
    setIsAddFuelModalOpen 
  } = useVehicle();

  const { t } = useLanguage();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Alertas activas de services (amarillo o rojo)
  const activeAlerts = services.filter(s => s.status !== 'ok');

  return (
    <header className="relative z-30 bg-carbon border-b border-tea/50 px-3 py-2.5 sm:px-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Lado Izquierdo: Menú & Marca VEHX */}
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-1.5 rounded-xl text-text-secondary hover:text-amber-autumn hover:bg-river/60 transition-colors focus:outline-none"
            title={t('menuTitle')}
            aria-label={t('menuTitle')}
          >
            <Menu className="w-5 h-5" />
          </button>

          <div 
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-autumn/15 border border-amber-autumn/40 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Car className="w-4 h-4 text-amber-autumn" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-extrabold tracking-wider text-text-primary">VEHX</span>
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-autumn/20 text-amber-autumn border border-amber-autumn/30">
                  {t('betaBadge')}
                </span>
              </div>
              <p className="text-[10px] text-text-secondary truncate max-w-[130px] sm:max-w-[190px] font-medium">
                {vehicle.brand} {vehicle.model.split(' ')[0]} ({vehicle.licensePlate})
              </p>
            </div>
          </div>
        </div>

        {/* Lado Derecho: Idioma (ES | EN), Botones Rápidos & Notificaciones */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Selector de Idioma Español / Inglés */}
          <LanguageToggle />

          {/* Botón rápido "+ Cargar Nafta" */}
          <button
            onClick={() => setIsAddFuelModalOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-autumn text-river font-extrabold text-[11px] hover:brightness-110 transition-all shadow-amber-glow"
            title={t('addFuelQuickBtn')}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('addFuelQuickBtn')}</span>
          </button>

          {/* Botón Restaurar Demo */}
          <button
            onClick={() => {
              if (window.confirm(t('resetConfirm'))) {
                restoreDemoData();
              }
            }}
            title={t('resetDemoBtn')}
            className="hidden md:flex items-center gap-1 px-2 py-1.5 rounded-xl text-[11px] text-text-secondary hover:text-amber-autumn hover:bg-river/60 border border-tea/30 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t('resetDemoBtn')}</span>
          </button>

          {/* Campana de Notificaciones con indicador Amber */}
          <div className="relative">
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="relative p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-river/60 transition-colors"
              title={t('notifications')}
              aria-label={t('notifications')}
            >
              <Bell className="w-4 h-4 text-text-primary" />
              {activeAlerts.length > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-amber-autumn ring-2 ring-carbon animate-amber-pulse" />
              )}
            </button>

            {/* Modal flotante de notificaciones */}
            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-carbon border border-tea/80 rounded-2xl shadow-card p-3.5 z-50 animate-fade-in">
                <div className="flex items-center justify-between pb-2.5 border-b border-tea/40">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-amber-autumn" />
                    <span className="text-xs font-bold text-text-primary">{t('notifications')}</span>
                  </div>
                  <button 
                    onClick={() => setIsNotifOpen(false)}
                    className="text-text-secondary hover:text-text-primary p-0.5"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="mt-2.5 space-y-2 max-h-64 overflow-y-auto">
                  {activeAlerts.length === 0 ? (
                    <div className="text-center py-5 text-text-secondary text-xs">
                      <CheckCircle2 className="w-7 h-7 mx-auto text-amber-autumn mb-1.5 opacity-80" />
                      {t('noAlerts')}
                    </div>
                  ) : (
                    activeAlerts.map(alert => (
                      <div 
                        key={alert.id}
                        onClick={() => {
                          setActiveTab('services');
                          setIsNotifOpen(false);
                        }}
                        className="cursor-pointer p-2.5 rounded-xl bg-river/80 border border-tea/50 hover:border-amber-autumn/50 transition-all flex items-start gap-2.5 text-left"
                      >
                        <AlertTriangle className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${
                          alert.status === 'overdue' ? 'text-amber-autumn' : 'text-wood'
                        }`} />
                        <div>
                          <div className="text-xs font-bold text-text-primary">{alert.name}</div>
                          <div className="text-[10px] text-text-secondary mt-0.5">{alert.statusMessage}</div>
                          <span className="inline-block mt-1 text-[10px] font-semibold text-amber-autumn">
                            {t('viewInServices')}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Menú Lateral Desplegable Rápido */}
      {isMenuOpen && (
        <div className="absolute top-full left-3 mt-1.5 w-60 bg-carbon border border-tea/80 rounded-2xl shadow-card p-2.5 z-50 animate-fade-in">
          <div className="text-[10px] font-bold text-text-secondary px-2 py-1 uppercase tracking-wider">
            {t('quickNav')}
          </div>
          <div className="space-y-1 mt-1 text-xs font-semibold">
            <button 
              onClick={() => { setActiveTab('home'); setIsMenuOpen(false); }}
              className="w-full text-left px-3 py-2 rounded-xl text-text-primary hover:bg-river/70 hover:text-amber-autumn transition-all"
            >
              {t('tabHome')} (Dashboard)
            </button>
            <button 
              onClick={() => { setActiveTab('fuel'); setIsMenuOpen(false); }}
              className="w-full text-left px-3 py-2 rounded-xl text-text-primary hover:bg-river/70 hover:text-amber-autumn transition-all"
            >
              {t('tabFuel')}
            </button>
            <button 
              onClick={() => { setActiveTab('services'); setIsMenuOpen(false); }}
              className="w-full text-left px-3 py-2 rounded-xl text-text-primary hover:bg-river/70 hover:text-amber-autumn transition-all"
            >
              {t('tabServices')}
            </button>
            <button 
              onClick={() => { setActiveTab('telemetry'); setIsMenuOpen(false); }}
              className="w-full text-left px-3 py-2 rounded-xl text-text-primary hover:bg-river/70 hover:text-amber-autumn transition-all"
            >
              {t('tabTelemetry')}
            </button>
            <button 
              onClick={() => { setActiveTab('garage'); setIsMenuOpen(false); }}
              className="w-full text-left px-3 py-2 rounded-xl text-text-primary hover:bg-river/70 hover:text-amber-autumn transition-all flex items-center justify-between"
            >
              <span>{t('tabGarage')}</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-autumn/20 text-amber-autumn font-mono">
                {vehicle.licensePlate}
              </span>
            </button>
          </div>
          <div className="pt-2 mt-2 border-t border-tea/30 space-y-1">
            <button
              onClick={() => { 
                if (window.confirm(t('resetConfirm'))) {
                  restoreDemoData();
                  setIsMenuOpen(false);
                }
              }}
              className="w-full text-left px-3 py-1.5 rounded-xl text-[11px] text-text-secondary hover:text-amber-autumn hover:bg-river/40 flex items-center gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              {t('resetDemoBtn')}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
