import React, { useState } from 'react';
import { Folder, File, Home, ArrowLeft, ArrowRight, Plus, Upload, Download } from 'lucide-react';

interface FileItem {
  id: string;
  name: string;
  type: 'folder' | 'file';
  size?: string;
  modified: string;
}

export const ExplorerApp: React.FC = () => {
  const [currentPath, setCurrentPath] = useState('/Home');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  
  // Mock file system data
  const [files] = useState<FileItem[]>([
    { id: '1', name: 'Documents', type: 'folder', modified: '2024-01-15' },
    { id: '2', name: 'Pictures', type: 'folder', modified: '2024-01-14' },
    { id: '3', name: 'Downloads', type: 'folder', modified: '2024-01-13' },
    { id: '4', name: 'Desktop', type: 'folder', modified: '2024-01-12' },
    { id: '5', name: 'README.txt', type: 'file', size: '2.4 KB', modified: '2024-01-10' },
    { id: '6', name: 'config.json', type: 'file', size: '1.2 KB', modified: '2024-01-09' },
    { id: '7', name: 'image.png', type: 'file', size: '245 KB', modified: '2024-01-08' },
  ]);

  const handleItemClick = (item: FileItem) => {
    if (item.type === 'folder') {
      setCurrentPath(`${currentPath}/${item.name}`);
    }
    setSelectedItems([item.id]);
  };

  const handleDoubleClick = (item: FileItem) => {
    if (item.type === 'folder') {
      setCurrentPath(`${currentPath}/${item.name}`);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Toolbar */}
      <div className="flex items-center gap-2 p-3 border-b bg-muted/50">
        <button className="p-2 hover:bg-muted rounded transition-colors">
          <ArrowLeft size={16} />
        </button>
        <button className="p-2 hover:bg-muted rounded transition-colors">
          <ArrowRight size={16} />
        </button>
        <button className="p-2 hover:bg-muted rounded transition-colors">
          <Home size={16} />
        </button>
        
        <div className="flex-1 mx-4">
          <input
            type="text"
            value={currentPath}
            onChange={(e) => setCurrentPath(e.target.value)}
            className="w-full px-3 py-1 rounded border bg-input text-sm"
          />
        </div>
        
        <button className="p-2 hover:bg-muted rounded transition-colors">
          <Plus size={16} />
        </button>
        <button className="p-2 hover:bg-muted rounded transition-colors">
          <Upload size={16} />
        </button>
        <button className="p-2 hover:bg-muted rounded transition-colors">
          <Download size={16} />
        </button>
      </div>

      {/* File List */}
      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-1 gap-1 p-2">
          {files.map((item) => (
            <div
              key={item.id}
              className={`flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-muted/50 transition-colors ${
                selectedItems.includes(item.id) ? 'bg-primary/20' : ''
              }`}
              onClick={() => handleItemClick(item)}
              onDoubleClick={() => handleDoubleClick(item)}
            >
              {item.type === 'folder' ? (
                <Folder size={20} className="text-primary" />
              ) : (
                <File size={20} className="text-muted-foreground" />
              )}
              <div className="flex-1">
                <div className="text-sm font-medium">{item.name}</div>
                <div className="text-xs text-muted-foreground">
                  {item.size && `${item.size} • `}Modified {item.modified}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between px-3 py-2 border-t bg-muted/50 text-xs text-muted-foreground">
        <span>{files.length} items</span>
        <span>{selectedItems.length} selected</span>
      </div>
    </div>
  );
};