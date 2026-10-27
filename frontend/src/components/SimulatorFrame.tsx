import React, { ReactNode, useState, useRef } from 'react';
import { useVehicle } from '../context/VehicleContext';
import { useLanguage } from '../context/LanguageContext';
import { TopHeader } from './TopHeader';
import { TabBar } from './TabBar';
import { ActiveTab } from '../types/vehicle';

interface SimulatorFrameProps {
  children: ReactNode;
}

const TAB_ORDER: ActiveTab[] = ['home', 'fuel', 'services', 'telemetry', 'garage'];

export const SimulatorFrame: React.FC<SimulatorFrameProps> = ({ children }) => {
  const { activeTab, setActiveTab, viewMode } = useVehicle();
  const { t } = useLanguage();

  const isFull = viewMode === 'desktop-full';

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
        goToNextTab();
      } else {
        goToPrevTab();
      }
    }

    touchStartXRef.current = null;
    touchStartYRef.current = null;
  };

  // Handlers Mouse Drag (para swipe con ratón)
  const handleMouseDown = (e: React.MouseEvent) => {
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
    <div className={`min-h-screen flex flex-col text-text-primary selection:bg-amber-autumn selection:text-river ${
      isFull ? 'bg-river w-full' : 'bg-[#0A0D10] items-center justify-center'
    }`}>
      {/* Contenedor Adaptable: Pantalla Completa Web o Modo Móvil */}
      <div className={`w-full min-h-screen bg-river flex flex-col relative transition-all duration-300 ${
        isFull
          ? 'w-full'
          : 'max-w-[430px] mx-auto shadow-[0_0_60px_rgba(0,0,0,0.85)] border-x border-tea/30'
      }`}>
        
        {/* Encabezado Superior Sticky */}
        <TopHeader />

        {/* Notificación flotante de gesto Swipe */}
        {swipeNotice && (
          <div className="absolute top-16 inset-x-0 mx-auto w-max z-50 px-3 py-1 bg-amber-autumn text-river font-extrabold text-[11px] rounded-full shadow-amber-glow animate-fade-in pointer-events-none">
            {swipeNotice}
          </div>
        )}

        {/* Área Central de Vistas */}
        <main 
          className="flex-1 w-full overflow-y-auto overflow-x-hidden relative scroll-smooth cursor-grab active:cursor-grabbing focus:outline-none"
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
        </main>

        {/* Barra de Navegación Inferior (TabBar - visible en móvil/tablet o en simulación móvil) */}
        <div className={isFull ? 'lg:hidden' : 'block'}>
          <TabBar />
        </div>
      </div>
    </div>
  );
};
