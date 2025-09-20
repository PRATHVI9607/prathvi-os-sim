import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// OS State Types
export interface OSWindow {
  id: string;
  title: string;
  component: React.ComponentType<any>;
  props?: any;
  x: number;
  y: number;
  width: number;
  height: number;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
}

export interface OSApp {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  component: React.ComponentType<any>;
  category: 'system' | 'productivity' | 'developer' | 'media' | 'games';
}

export interface OSState {
  theme: 'sky' | 'night';
  openWindows: OSWindow[];
  installedApps: OSApp[];
  activeWindow: string | null;
  desktopTime: string;
  notifications: Array<{ id: string; message: string; type: 'info' | 'warning' | 'error' }>;
  zIndexCounter: number;
}

// Actions
type OSAction =
  | { type: 'TOGGLE_THEME' }
  | { type: 'OPEN_APP'; app: OSApp; windowProps?: Partial<OSWindow> }
  | { type: 'CLOSE_WINDOW'; windowId: string }
  | { type: 'MINIMIZE_WINDOW'; windowId: string }
  | { type: 'MAXIMIZE_WINDOW'; windowId: string }
  | { type: 'SET_ACTIVE_WINDOW'; windowId: string }
  | { type: 'MOVE_WINDOW'; windowId: string; x: number; y: number }
  | { type: 'RESIZE_WINDOW'; windowId: string; width: number; height: number }
  | { type: 'UPDATE_TIME'; time: string }
  | { type: 'ADD_NOTIFICATION'; notification: { message: string; type: 'info' | 'warning' | 'error' } };

// Initial state
const initialState: OSState = {
  theme: 'sky',
  openWindows: [],
  installedApps: [],
  activeWindow: null,
  desktopTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  notifications: [],
  zIndexCounter: 1000,
};

// Reducer
function osReducer(state: OSState, action: OSAction): OSState {
  switch (action.type) {
    case 'TOGGLE_THEME':
      return { ...state, theme: state.theme === 'sky' ? 'night' : 'sky' };

    case 'OPEN_APP':
      const newWindow: OSWindow = {
        id: `${action.app.id}-${Date.now()}`,
        title: action.app.name,
        component: action.app.component,
        x: Math.random() * 200 + 100,
        y: Math.random() * 100 + 100,
        width: 800,
        height: 600,
        isMinimized: false,
        isMaximized: false,
        zIndex: state.zIndexCounter + 1,
        ...action.windowProps,
      };
      return {
        ...state,
        openWindows: [...state.openWindows, newWindow],
        activeWindow: newWindow.id,
        zIndexCounter: state.zIndexCounter + 1,
      };

    case 'CLOSE_WINDOW':
      return {
        ...state,
        openWindows: state.openWindows.filter(w => w.id !== action.windowId),
        activeWindow: state.activeWindow === action.windowId ? null : state.activeWindow,
      };

    case 'MINIMIZE_WINDOW':
      return {
        ...state,
        openWindows: state.openWindows.map(w =>
          w.id === action.windowId ? { ...w, isMinimized: !w.isMinimized } : w
        ),
      };

    case 'MAXIMIZE_WINDOW':
      return {
        ...state,
        openWindows: state.openWindows.map(w =>
          w.id === action.windowId ? { ...w, isMaximized: !w.isMaximized } : w
        ),
      };

    case 'SET_ACTIVE_WINDOW':
      return {
        ...state,
        activeWindow: action.windowId,
        openWindows: state.openWindows.map(w =>
          w.id === action.windowId ? { ...w, zIndex: state.zIndexCounter + 1 } : w
        ),
        zIndexCounter: state.zIndexCounter + 1,
      };

    case 'MOVE_WINDOW':
      return {
        ...state,
        openWindows: state.openWindows.map(w =>
          w.id === action.windowId ? { ...w, x: action.x, y: action.y } : w
        ),
      };

    case 'RESIZE_WINDOW':
      return {
        ...state,
        openWindows: state.openWindows.map(w =>
          w.id === action.windowId ? { ...w, width: action.width, height: action.height } : w
        ),
      };

    case 'UPDATE_TIME':
      return { ...state, desktopTime: action.time };

    case 'ADD_NOTIFICATION':
      const notification = {
        id: Date.now().toString(),
        ...action.notification,
      };
      return {
        ...state,
        notifications: [...state.notifications, notification],
      };

    default:
      return state;
  }
}

// Context
const OSContext = createContext<{
  state: OSState;
  dispatch: React.Dispatch<OSAction>;
} | null>(null);

export const OSProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(osReducer, initialState);

  // Update time every minute
  React.useEffect(() => {
    const interval = setInterval(() => {
      dispatch({
        type: 'UPDATE_TIME',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <OSContext.Provider value={{ state, dispatch }}>
      {children}
    </OSContext.Provider>
  );
};

export const useOS = () => {
  const context = useContext(OSContext);
  if (!context) {
    throw new Error('useOS must be used within OSProvider');
  }
  return context;
};