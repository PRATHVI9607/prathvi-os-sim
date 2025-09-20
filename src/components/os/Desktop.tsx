import React from 'react';
import { useOS } from '../../contexts/OSContext';
import { AppGrid } from './AppGrid';
import { WindowManager } from './WindowManager';
import { Taskbar } from './Taskbar';

const SkyElements: React.FC = () => (
  <>
    <div className="cloud cloud-1"></div>
    <div className="cloud cloud-2"></div>
    <div className="cloud cloud-3"></div>
  </>
);

const NightElements: React.FC = () => {
  const stars = Array.from({ length: 50 }, (_, i) => (
    <div
      key={i}
      className="star"
      style={{
        top: `${Math.random() * 80}%`,
        left: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 3}s`,
      }}
    />
  ));
  
  return <>{stars}</>;
};

export const Desktop: React.FC = () => {
  const { state } = useOS();
  const themeClass = state.theme === 'sky' ? 'sky-background' : 'night-background night-mode';

  return (
    <div className={`os-desktop ${themeClass}`}>
      {state.theme === 'sky' ? <SkyElements /> : <NightElements />}
      
      {/* Desktop Background - Click to deselect windows */}
      <div className="absolute inset-0 z-0" />
      
      {/* App Grid */}
      <AppGrid />
      
      {/* Window Manager */}
      <WindowManager />
      
      {/* Taskbar */}
      <Taskbar />
    </div>
  );
};