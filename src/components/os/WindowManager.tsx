import React, { useState, useRef, useCallback } from 'react';
import { X, Minimize, Maximize, Maximize2 } from 'lucide-react';
import { useOS, OSWindow } from '../../contexts/OSContext';

interface WindowProps {
  window: OSWindow;
}

export const Window: React.FC<WindowProps> = ({ window }) => {
  const { dispatch } = useOS();
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).closest('.window-header')) {
      e.preventDefault();
      setIsDragging(true);
      const rect = windowRef.current?.getBoundingClientRect();
      if (rect) {
        setDragOffset({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
      dispatch({ type: 'SET_ACTIVE_WINDOW', windowId: window.id });
    }
  }, [dispatch, window.id]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      const newX = e.clientX - dragOffset.x;
      const newY = Math.max(0, e.clientY - dragOffset.y);
      dispatch({
        type: 'MOVE_WINDOW',
        windowId: window.id,
        x: newX,
        y: newY,
      });
    }
  }, [isDragging, dragOffset, dispatch, window.id]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
  }, []);

  React.useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp]);

  if (window.isMinimized) {
    return null;
  }

  const WindowComponent = window.component;

  return (
    <div
      ref={windowRef}
      className="os-window os-glass select-none"
      style={{
        left: window.isMaximized ? 0 : window.x,
        top: window.isMaximized ? 0 : window.y,
        width: window.isMaximized ? '100vw' : window.width,
        height: window.isMaximized ? 'calc(100vh - 64px)' : window.height,
        zIndex: window.zIndex,
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Window Header */}
      <div className="window-header flex items-center justify-between p-3 border-b bg-background/50 rounded-t-lg cursor-move">
        <h3 className="text-sm font-medium text-foreground">{window.title}</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => dispatch({ type: 'MINIMIZE_WINDOW', windowId: window.id })}
            className="p-1 rounded hover:bg-muted transition-colors"
          >
            <Minimize size={14} />
          </button>
          <button
            onClick={() => dispatch({ type: 'MAXIMIZE_WINDOW', windowId: window.id })}
            className="p-1 rounded hover:bg-muted transition-colors"
          >
            {window.isMaximized ? <Maximize2 size={14} /> : <Maximize size={14} />}
          </button>
          <button
            onClick={() => dispatch({ type: 'CLOSE_WINDOW', windowId: window.id })}
            className="p-1 rounded hover:bg-destructive hover:text-destructive-foreground transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Window Content */}
      <div className="flex-1 overflow-hidden">
        <WindowComponent {...window.props} />
      </div>

      {/* Resize Handle */}
      {!window.isMaximized && (
        <div
          className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize opacity-50 hover:opacity-100"
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsResizing(true);
          }}
        >
          <div className="absolute bottom-1 right-1 w-2 h-2 border-r-2 border-b-2 border-muted-foreground"></div>
        </div>
      )}
    </div>
  );
};

export const WindowManager: React.FC = () => {
  const { state } = useOS();

  return (
    <div className="fixed inset-0 pointer-events-none">
      {state.openWindows.map((window) => (
        <div key={window.id} className="pointer-events-auto">
          <Window window={window} />
        </div>
      ))}
    </div>
  );
};