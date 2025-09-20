import React, { useState } from 'react';
import { Monitor, User, Palette, Keyboard, Shield, Info } from 'lucide-react';
import { useOS } from '../../contexts/OSContext';

type SettingsCategory = 'display' | 'accounts' | 'appearance' | 'keyboard' | 'security' | 'about';

export const SettingsApp: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<SettingsCategory>('display');
  const { state, dispatch } = useOS();

  const categories = [
    { id: 'display' as const, name: 'Display', icon: Monitor },
    { id: 'accounts' as const, name: 'Accounts', icon: User },
    { id: 'appearance' as const, name: 'Appearance', icon: Palette },
    { id: 'keyboard' as const, name: 'Keyboard', icon: Keyboard },
    { id: 'security' as const, name: 'Security', icon: Shield },
    { id: 'about' as const, name: 'About', icon: Info },
  ];

  const renderContent = () => {
    switch (activeCategory) {
      case 'display':
        return (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold">Display Settings</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Resolution</label>
                <select className="w-full p-2 rounded border bg-input">
                  <option>1920 x 1080 (Recommended)</option>
                  <option>1366 x 768</option>
                  <option>1280 x 720</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Scale</label>
                <select className="w-full p-2 rounded border bg-input">
                  <option>100% (Recommended)</option>
                  <option>125%</option>
                  <option>150%</option>
                </select>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Night Light</span>
                <input type="checkbox" className="rounded" />
              </div>
            </div>
          </div>
        );

      case 'appearance':
        return (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold">Appearance</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Theme</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => state.theme !== 'sky' && dispatch({ type: 'TOGGLE_THEME' })}
                    className={`p-4 rounded border-2 transition-colors ${
                      state.theme === 'sky' 
                        ? 'border-primary bg-primary/10' 
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="w-full h-16 rounded mb-2 bg-gradient-to-br from-sky-300 to-sky-500"></div>
                    <div className="text-sm font-medium">Sky Mode</div>
                  </button>
                  
                  <button
                    onClick={() => state.theme !== 'night' && dispatch({ type: 'TOGGLE_THEME' })}
                    className={`p-4 rounded border-2 transition-colors ${
                      state.theme === 'night' 
                        ? 'border-primary bg-primary/10' 
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="w-full h-16 rounded mb-2 bg-gradient-to-br from-slate-800 to-slate-900"></div>
                    <div className="text-sm font-medium">Night Mode</div>
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Wallpaper</label>
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="aspect-video bg-muted rounded cursor-pointer hover:ring-2 hover:ring-primary">
                      <div className="w-full h-full rounded bg-gradient-to-br from-blue-400 to-purple-500"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'accounts':
        return (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold">User Accounts</h2>
            
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    U
                  </div>
                  <div>
                    <div className="font-medium">User</div>
                    <div className="text-sm text-muted-foreground">Administrator</div>
                  </div>
                </div>
              </div>
              
              <button className="w-full p-3 border border-dashed rounded-lg text-muted-foreground hover:border-primary transition-colors">
                Add New User
              </button>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold">Security & Privacy</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">File Encryption</div>
                  <div className="text-sm text-muted-foreground">Encrypt sensitive files</div>
                </div>
                <input type="checkbox" className="rounded" />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Two-Factor Authentication</div>
                  <div className="text-sm text-muted-foreground">Extra security for login</div>
                </div>
                <input type="checkbox" className="rounded" />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Sandbox Mode</div>
                  <div className="text-sm text-muted-foreground">Run apps in isolation</div>
                </div>
                <input type="checkbox" className="rounded" />
              </div>
            </div>
          </div>
        );

      case 'about':
        return (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold">About PrathviOS</h2>
            
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-2xl mx-auto mb-4">
                  P
                </div>
                <h3 className="text-xl font-bold">PrathviOS</h3>
                <p className="text-muted-foreground">Version 1.0.0</p>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Build:</span>
                  <span>2024.01.20</span>
                </div>
                <div className="flex justify-between">
                  <span>Kernel:</span>
                  <span>WebOS 1.0</span>
                </div>
                <div className="flex justify-between">
                  <span>Architecture:</span>
                  <span>Web-x64</span>
                </div>
                <div className="flex justify-between">
                  <span>Memory:</span>
                  <span>Available</span>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground text-center">
                  PrathviOS is a complete web-based operating system designed for modern browsers.
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold">Settings</h2>
            <p className="text-muted-foreground">Select a category from the sidebar.</p>
          </div>
        );
    }
  };

  return (
    <div className="flex h-full bg-background">
      {/* Sidebar */}
      <div className="w-64 border-r bg-muted/30">
        <div className="p-4">
          <h1 className="text-lg font-semibold">Settings</h1>
        </div>
        
        <div className="space-y-1 px-2">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  activeCategory === category.id
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted'
                }`}
              >
                <IconComponent size={18} />
                <span className="text-sm">{category.name}</span>
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 p-6 overflow-auto">
        {renderContent()}
      </div>
    </div>
  );
};