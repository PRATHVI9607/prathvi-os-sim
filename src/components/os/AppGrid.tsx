import React from 'react';
import { 
  Search, Terminal, Settings, FileText, Calculator, Camera, 
  Image, MessageCircle, ArrowUp, Package, Calendar, Mail, 
  Presentation, StickyNote, Code, Wrench, Database, Globe, 
  Music, Video, Gamepad2, Shield, HelpCircle, Clipboard, Share
} from 'lucide-react';
import { useOS } from '../../contexts/OSContext';
import { ExplorerApp } from '../apps/ExplorerApp';
import { TerminalApp } from '../apps/TerminalApp';
import { SettingsApp } from '../apps/SettingsApp';
import { CalculatorApp } from '../apps/CalculatorApp';
import { NotepadApp } from '../apps/NotepadApp';
import { TetrisApp } from '../apps/TetrisApp';

// App components (we'll create these)
const WebcamApp = () => <div className="p-4">Camera & Video Recorder</div>;
const PhotosApp = () => <div className="p-4">Gallery & Photos</div>;
const SocialApp = () => <div className="p-4">Social & Messaging</div>;
const UpdaterApp = () => <div className="p-4">System Updater</div>;
const PackagesApp = () => <div className="p-4">Package Manager</div>;
const CalendarApp = () => <div className="p-4">Calendar & Events</div>;
const MailApp = () => <div className="p-4">Mail Client</div>;
const SlidesApp = () => <div className="p-4">PrathviSlides - Presentations</div>;
const NotesApp = () => <div className="p-4">Notes & Tasks</div>;
const CodeEditorApp = () => <div className="p-4">Code Editor</div>;
const APITesterApp = () => <div className="p-4">API Tester</div>;
const DBViewerApp = () => <div className="p-4">Database Viewer</div>;
const NetworkToolsApp = () => <div className="p-4">Network Tools</div>;
const BrowserApp = () => <div className="p-4">Prathvi Browser</div>;
const MusicApp = () => <div className="p-4">Music Player</div>;
const VideoApp = () => <div className="p-4">Video Player</div>;
const ChessApp = () => <div className="p-4">Chess Game</div>;
const MinesweeperApp = () => <div className="p-4">Minesweeper</div>;
const ClipboardApp = () => <div className="p-4">Clipboard Manager</div>;
const BackupApp = () => <div className="p-4">Backup & Restore</div>;

// Define all system apps
const systemApps = [
  { id: 'explorer', name: 'Explorer', icon: Search, component: ExplorerApp, category: 'system' as const },
  { id: 'terminal', name: 'Terminal', icon: Terminal, component: TerminalApp, category: 'system' as const },
  { id: 'settings', name: 'Settings', icon: Settings, component: SettingsApp, category: 'system' as const },
  { id: 'notepad', name: 'Notepad', icon: FileText, component: NotepadApp, category: 'productivity' as const },
  { id: 'calculator', name: 'Calculator', icon: Calculator, component: CalculatorApp, category: 'productivity' as const },
  { id: 'webcam', name: 'Webcam', icon: Camera, component: WebcamApp, category: 'media' as const },
  { id: 'photos', name: 'Photos', icon: Image, component: PhotosApp, category: 'media' as const },
  { id: 'social', name: 'Social', icon: MessageCircle, component: SocialApp, category: 'productivity' as const },
  { id: 'updater', name: 'Updater', icon: ArrowUp, component: UpdaterApp, category: 'system' as const },
  { id: 'packages', name: 'Packages', icon: Package, component: PackagesApp, category: 'system' as const },
  { id: 'calendar', name: 'Calendar', icon: Calendar, component: CalendarApp, category: 'productivity' as const },
  { id: 'mail', name: 'Mail', icon: Mail, component: MailApp, category: 'productivity' as const },
  { id: 'slides', name: 'Slides', icon: Presentation, component: SlidesApp, category: 'productivity' as const },
  { id: 'notes', name: 'Notes', icon: StickyNote, component: NotesApp, category: 'productivity' as const },
  { id: 'code-editor', name: 'Code Editor', icon: Code, component: CodeEditorApp, category: 'developer' as const },
  { id: 'api-tester', name: 'API Tester', icon: Wrench, component: APITesterApp, category: 'developer' as const },
  { id: 'db-viewer', name: 'DB Viewer', icon: Database, component: DBViewerApp, category: 'developer' as const },
  { id: 'network-tools', name: 'Network Tools', icon: Globe, component: NetworkToolsApp, category: 'developer' as const },
  { id: 'browser', name: 'Browser', icon: Globe, component: BrowserApp, category: 'productivity' as const },
  { id: 'music', name: 'Music', icon: Music, component: MusicApp, category: 'media' as const },
  { id: 'video', name: 'Video', icon: Video, component: VideoApp, category: 'media' as const },
  { id: 'tetris', name: 'Tetris', icon: Gamepad2, component: TetrisApp, category: 'games' as const },
  { id: 'chess', name: 'Chess', icon: Shield, component: ChessApp, category: 'games' as const },
  { id: 'minesweeper', name: 'Minesweeper', icon: HelpCircle, component: MinesweeperApp, category: 'games' as const },
  { id: 'clipboard', name: 'Clipboard', icon: Clipboard, component: ClipboardApp, category: 'system' as const },
  { id: 'backup', name: 'Backup', icon: Share, component: BackupApp, category: 'system' as const },
];

export const AppGrid: React.FC = () => {
  const { dispatch } = useOS();

  const handleAppClick = (app: typeof systemApps[0]) => {
    dispatch({ type: 'OPEN_APP', app });
  };

  return (
    <div className="flex-1 p-8 overflow-auto">
      <div className="grid grid-cols-9 gap-6 max-w-6xl mx-auto">
        {systemApps.map((app) => {
          const IconComponent = app.icon;
          return (
            <div
              key={app.id}
              className="os-app-icon"
              onClick={() => handleAppClick(app)}
            >
              <IconComponent size={32} className="text-foreground mb-2" />
              <span className="text-xs text-foreground font-medium text-center">
                {app.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};