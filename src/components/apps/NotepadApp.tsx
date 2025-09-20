import React, { useState, useRef } from 'react';
import { Save, FolderOpen, FileText, Download, Upload, Search, RotateCcw, RotateCw } from 'lucide-react';

export const NotepadApp: React.FC = () => {
  const [content, setContent] = useState('Welcome to PrathviPad!\n\nThis is a simple text editor built into PrathviOS. You can:\n- Write and edit text\n- Save your documents\n- Use markdown formatting\n- Search and replace text\n\nStart typing to begin...');
  const [fileName, setFileName] = useState('Untitled.txt');
  const [isModified, setIsModified] = useState(false);
  const [showFind, setShowFind] = useState(false);
  const [findText, setFindText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setIsModified(true);
  };

  const handleSave = () => {
    // In a real OS, this would save to the VFS
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
    setIsModified(false);
  };

  const handleOpen = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.txt,.md,.js,.ts,.json,.css,.html';
    input.onchange = (e: any) => {
      const file = e.target?.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const text = e.target?.result as string;
          setContent(text);
          setFileName(file.name);
          setIsModified(false);
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleFind = () => {
    if (!findText || !textareaRef.current) return;
    
    const textarea = textareaRef.current;
    const text = textarea.value;
    const index = text.toLowerCase().indexOf(findText.toLowerCase());
    
    if (index !== -1) {
      textarea.focus();
      textarea.setSelectionRange(index, index + findText.length);
    }
  };

  const getWordCount = () => {
    return content.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const getLineCount = () => {
    return content.split('\n').length;
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Menu Bar */}
      <div className="flex items-center gap-2 p-2 border-b bg-muted/30">
        <button
          onClick={handleOpen}
          className="flex items-center gap-1 px-3 py-1.5 rounded hover:bg-muted transition-colors text-sm"
          title="Open File"
        >
          <FolderOpen size={16} />
          <span>Open</span>
        </button>
        
        <button
          onClick={handleSave}
          className="flex items-center gap-1 px-3 py-1.5 rounded hover:bg-muted transition-colors text-sm"
          title="Save File"
        >
          <Save size={16} />
          <span>Save</span>
        </button>
        
        <div className="w-px h-6 bg-border mx-2"></div>
        
        <button
          onClick={() => setShowFind(!showFind)}
          className="flex items-center gap-1 px-3 py-1.5 rounded hover:bg-muted transition-colors text-sm"
          title="Find Text"
        >
          <Search size={16} />
          <span>Find</span>
        </button>
        
        <div className="flex-1"></div>
        
        {/* File name */}
        <div className="flex items-center gap-2 text-sm">
          <FileText size={16} />
          <input
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            className="bg-transparent border-none outline-none font-medium min-w-0"
            style={{ width: `${fileName.length + 1}ch` }}
          />
          {isModified && <span className="text-muted-foreground">•</span>}
        </div>
      </div>

      {/* Find Bar */}
      {showFind && (
        <div className="flex items-center gap-2 p-2 border-b bg-muted/20">
          <input
            type="text"
            placeholder="Find..."
            value={findText}
            onChange={(e) => setFindText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleFind()}
            className="flex-1 px-2 py-1 rounded border bg-input text-sm"
          />
          <button
            onClick={handleFind}
            className="px-3 py-1 rounded hover:bg-muted transition-colors text-sm"
          >
            Find
          </button>
          <button
            onClick={() => setShowFind(false)}
            className="px-2 py-1 rounded hover:bg-muted transition-colors text-sm"
          >
            ×
          </button>
        </div>
      )}

      {/* Text Editor */}
      <div className="flex-1 relative">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleContentChange}
          className="w-full h-full p-4 bg-transparent border-none outline-none resize-none font-mono text-sm leading-relaxed"
          placeholder="Start typing..."
          spellCheck={false}
        />
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between px-4 py-2 border-t bg-muted/30 text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          <span>Lines: {getLineCount()}</span>
          <span>Words: {getWordCount()}</span>
          <span>Characters: {content.length}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <span>Plain Text</span>
          <span>•</span>
          <span>UTF-8</span>
        </div>
      </div>
    </div>
  );
};