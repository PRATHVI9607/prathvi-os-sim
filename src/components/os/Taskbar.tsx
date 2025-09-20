import React from 'react';
import { Sun, Moon, Wifi, Volume2 } from 'lucide-react';
import { useOS } from '../../contexts/OSContext';

export const Taskbar: React.FC = () => {
  const { state, dispatch } = useOS();

  const toggleTheme = () => {
    dispatch({ type: 'TOGGLE_THEME' });
  };

  return (
    <div className="os-taskbar os-glass">
      {/* Left side - OS logo */}
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
          P
        </div>
        
        {/* Running apps */}
        <div className="flex items-center gap-2">
          {state.openWindows.map((window) => (
            <button
              key={window.id}
              className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                state.activeWindow === window.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80'
              }`}
              onClick={() => {
                if (window.isMinimized) {
                  dispatch({ type: 'MINIMIZE_WINDOW', windowId: window.id });
                }
                dispatch({ type: 'SET_ACTIVE_WINDOW', windowId: window.id });
              }}
            >
              {window.title}
            </button>
          ))}
        </div>
      </div>

      {/* Right side - System tray */}
      <div className="flex items-center gap-4">
        {/* System indicators */}
        <div className="flex items-center gap-2 text-muted-foreground">
          <Wifi size={16} />
          <Volume2 size={16} />
        </div>
        
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-muted transition-colors"
          title={`Switch to ${state.theme === 'sky' ? 'Night' : 'Sky'} mode`}
        >
          {state.theme === 'sky' ? <Moon size={16} /> : <Sun size={16} />}
        </button>
        
        {/* Time */}
        <div className="text-sm font-medium text-foreground min-w-[3rem] text-right">
          {state.desktopTime}
        </div>
      </div>
    </div>
  );
};