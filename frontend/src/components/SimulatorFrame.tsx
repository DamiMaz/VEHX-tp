import React, { ReactNode, useState, useRef, useEffect } from 'react';
import { useVehicle } from '../context/VehicleContext';
import { useLanguage, LanguageToggle } from '../context/LanguageContext';
import { TopHeader } from './TopHeader';
import { TabBar } from './TabBar';
import { ActiveTab } from '../types/vehicle';
import { 
  Wifi, 
  BatteryMedium, 
  Signal, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight,
  Smartphone
} from 'lucide-react';

interface SimulatorFrameProps {
  children: ReactNode;
}

const TAB_ORDER: ActiveTab[] = ['home', 'fuel', 'services', 'telemetry', 'garage'];

export const SimulatorFrame: React.FC<SimulatorFrameProps> = ({ children }) => {
  const { activeTab, setActiveTab, restoreDemoData } = useVehicle();
  const { t } = useLanguage();

  // Reloj en vivo o simulado para la barra de estado
  const [currentTime, setCurrentTime] = useState('09:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 30000);
    return () => clearInterval(timer);
  }, []);

  // Control de Deslizamiento (Swipe Gestures)
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const mouseStartXRef = useRef<number | null>(null);
  const mouseStartYRef = useRef<number | null>(null);
  const isMouseDownRef = useRef(false);

  const [slideAnimation, setSlideAnimation] = useState<'left' | 'right' | 'none'>('none');
  const [swipeNotice, setSwipeNotice] = useState<string | null>(null);

  const currentIndex = TAB_ORDER.indexOf(activeTab);

  const goToNextTab = () => {
    if (currentIndex < TAB_ORDER.length - 1) {
      setSlideAnimation('left');
      const nextTab = TAB_ORDER[currentIndex + 1];
      setActiveTab(nextTab);
      showSwipeFeedback(t('swipeLeftPrompt'));
    }
  };

  const goToPrevTab = () => {
    if (currentIndex > 0) {
      setSlideAnimation('right');
      const prevTab = TAB_ORDER[currentIndex - 1];
      setActiveTab(prevTab);
      showSwipeFeedback(t('swipeRightPrompt'));
    }
  };

  const showSwipeFeedback = (message: string) => {
    setSwipeNotice(message);
    setTimeout(() => {
      setSwipeNotice(null);
      setSlideAnimation('none');
    }, 700);
  };

  // Handlers Táctiles (Touch Events)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null || touchStartYRef.current === null) return;

    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;

    const diffX = touchEndX - touchStartXRef.current;
    const diffY = touchEndY - touchStartYRef.current;

    // Umbral horizontal > 45px y pendiente predominantemente horizontal
    if (Math.abs(diffX) > 45 && Math.abs(diffX) > Math.abs(diffY) * 1.25) {
      if (diffX < 0) {
        // Deslizó hacia la izquierda -> avanzar pantalla
        goToNextTab();
      } else {
        // Deslizó hacia la derecha -> retroceder pantalla
        goToPrevTab();
      }
    }

    touchStartXRef.current = null;
    touchStartYRef.current = null;
  };

  // Handlers Mouse Drag (para testear swipe con mouse en computadora)
  const handleMouseDown = (e: React.MouseEvent) => {
    // Solo clic izquierdo
    if (e.button !== 0) return;
    mouseStartXRef.current = e.clientX;
    mouseStartYRef.current = e.clientY;
    isMouseDownRef.current = true;
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isMouseDownRef.current || mouseStartXRef.current === null || mouseStartYRef.current === null) {
      isMouseDownRef.current = false;
      return;
    }

    const diffX = e.clientX - mouseStartXRef.current;
    const diffY = e.clientY - mouseStartYRef.current;

    if (Math.abs(diffX) > 45 && Math.abs(diffX) > Math.abs(diffY) * 1.25) {
      if (diffX < 0) {
        goToNextTab();
      } else {
        goToPrevTab();
      }
    }

    isMouseDownRef.current = false;
    mouseStartXRef.current = null;
    mouseStartYRef.current = null;
  };

  const handleMouseLeave = () => {
    isMouseDownRef.current = false;
    mouseStartXRef.current = null;
    mouseStartYRef.current = null;
  };

  return (
    <div className="min-h-screen bg-[#0E1318] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-river via-[#0C1014] to-[#080B0E] flex flex-col items-center justify-center p-2 sm:p-4 md:p-6 overflow-x-hidden select-none">
      
      {/* Barra Externa de Asistencia Demo (Escritorio / Tablet) */}
      <div className="w-full max-w-[420px] mb-3 flex items-center justify-between px-2 text-xs">
        <div className="flex items-center gap-1.5 bg-carbon/90 border border-tea/50 px-2.5 py-1 rounded-full text-text-secondary shadow-sm">
          <Smartphone className="w-3.5 h-3.5 text-amber-autumn animate-pulse" />
          <span className="font-bold text-text-primary">VEHX</span>
          <span className="text-[10px] text-amber-autumn font-semibold">• Demo Móvil</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Indicador de Swipe */}
          <div className="hidden sm:flex items-center gap-1 text-[11px] text-text-secondary bg-carbon/80 border border-tea/40 px-2.5 py-1 rounded-full">
            <ChevronLeft className="w-3 h-3 text-amber-autumn" />
            <span className="font-medium">{t('swipeHintPrompt')}</span>
            <ChevronRight className="w-3 h-3 text-amber-autumn" />
          </div>

          <LanguageToggle />
        </div>
      </div>

      {/* DISPOSITIVO MÓVIL IPHONE (390×844) */}
      <div className="relative w-[390px] h-[844px] max-w-full max-h-[94vh] bg-river rounded-[48px] shadow-[0_25px_70px_rgba(0,0,0,0.95),0_0_30px_rgba(202,156,104,0.18)] border-[8px] border-[#252B2E] ring-1 ring-tea/60 flex flex-col overflow-hidden transition-all duration-300">
        
        {/* Notch / Dynamic Island + Barra de Estado Superior */}
        <div className="relative z-50 pt-2.5 pb-1 px-7 bg-river flex items-center justify-between select-none">
          {/* Hora digital en vivo */}
          <span className="text-[12px] font-extrabold text-text-primary tracking-tight font-mono">
            {currentTime}
          </span>

          {/* Dynamic Island Apple Style */}
          <div className="w-24 h-5 bg-black rounded-full flex items-center justify-between px-2.5 border border-tea/40 shadow-inner">
            <span className="w-2.5 h-2.5 rounded-full bg-[#111] border border-tea/30 flex items-center justify-center">
              <span className="w-1 h-1 rounded-full bg-blue-900/40" />
            </span>
            <span className="w-2 h-2 rounded-full bg-amber-autumn/50 animate-amber-pulse" />
          </div>

          {/* Iconos de Estado (Señal 5G, Wifi, Batería) */}
          <div className="flex items-center gap-1.5 text-text-primary">
            <Signal className="w-3.5 h-3.5 text-text-primary" />
            <Wifi className="w-3.5 h-3.5 text-text-primary" />
            <BatteryMedium className="w-4 h-4 text-amber-autumn" />
          </div>
        </div>

        {/* Encabezado Principal de la Aplicación VEHX dentro del Móvil */}
        <TopHeader />

        {/* Notificación flotante de gesto Swipe */}
        {swipeNotice && (
          <div className="absolute top-28 inset-x-0 mx-auto w-max z-50 px-3 py-1 bg-amber-autumn text-river font-extrabold text-[11px] rounded-full shadow-amber-glow animate-fade-in pointer-events-none">
            {swipeNotice}
          </div>
        )}

        {/* Indicador de Pistas / Pantallas activas (Swipe Dots) */}
        <div className="relative z-20 flex justify-center items-center gap-1.5 py-1 bg-carbon/50 border-b border-tea/30 select-none">
          {TAB_ORDER.map((tab, idx) => {
            const isActive = tab === activeTab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`transition-all duration-300 rounded-full h-1 ${
                  isActive
                    ? 'w-5 bg-amber-autumn shadow-amber-glow'
                    : 'w-1.5 bg-tea/70 hover:bg-wood'
                }`}
                title={`Pantalla ${idx + 1}`}
                aria-label={`Pantalla ${idx + 1}`}
              />
            );
          })}
        </div>

        {/* Área de Pantallas con soporte para Gesto Deslizar (Swipe) */}
        <div 
          className="flex-1 overflow-y-auto overflow-x-hidden relative scroll-smooth cursor-grab active:cursor-grabbing"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          <div 
            className={`min-h-full transition-transform duration-300 ${
              slideAnimation === 'left' ? 'animate-slide-left' : slideAnimation === 'right' ? 'animate-slide-right' : ''
            }`}
          >
            {children}
          </div>
        </div>

        {/* Barra Inferior del iPhone: TabBar + Home Indicator */}
        <div className="relative z-40 bg-carbon">
          <TabBar />
          {/* iOS Home Indicator Bar */}
          <div className="w-full flex justify-center py-1.5 bg-carbon/95">
            <div className="w-32 h-1 bg-text-secondary/40 rounded-full" />
          </div>
        </div>
      </div>

      {/* Nota al pie del simulador */}
      <p className="text-[11px] text-text-secondary/70 mt-2.5 text-center max-w-sm">
        {t('mobileSimulatorNote')} • {t('swipeHintPrompt')}
      </p>
    </div>
  );
};
