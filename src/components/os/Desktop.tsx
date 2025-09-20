import React from 'react';
import { useOS } from '../../contexts/OSContext';
import { AppGrid } from './AppGrid';
import { WindowManager } from './WindowManager';
import { Taskbar } from './Taskbar';

export const Desktop: React.FC = () => {
  const { state } = useOS();

  return (
    <div className={`os-desktop ${state.theme === 'night' ? 'night-mode' : ''}`}>
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