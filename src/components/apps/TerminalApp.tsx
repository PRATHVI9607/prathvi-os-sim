import React, { useState, useRef, useEffect } from 'react';

interface CommandHistory {
  command: string;
  output: string;
  timestamp: Date;
}

export const TerminalApp: React.FC = () => {
  const [history, setHistory] = useState<CommandHistory[]>([
    {
      command: '',
      output: 'PrathviOS Terminal v1.0.0\nType "help" for available commands.\n',
      timestamp: new Date(),
    },
  ]);
  const [currentCommand, setCurrentCommand] = useState('');
  const [currentPath, setCurrentPath] = useState('~/');
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  const commands = {
    help: () => `Available commands:
  help      - Show this help message
  clear     - Clear the terminal
  ls        - List directory contents
  cd        - Change directory
  pwd       - Print working directory
  mkdir     - Create directory
  cat       - Display file contents
  echo      - Display text
  date      - Show current date and time
  whoami    - Display current user
  uname     - System information
  prpm      - Package manager (prpm help for more info)`,
    
    clear: () => {
      setHistory([]);
      return '';
    },
    
    ls: () => `Documents/
Pictures/
Downloads/
Desktop/
README.txt
config.json
image.png`,
    
    pwd: () => currentPath,
    
    cd: (args: string[]) => {
      const dir = args[0] || '~';
      if (dir === '..') {
        const parts = currentPath.split('/');
        parts.pop();
        const newPath = parts.join('/') || '~/';
        setCurrentPath(newPath);
        return `Changed directory to ${newPath}`;
      } else if (dir === '~' || dir === '/') {
        setCurrentPath('~/');
        return 'Changed directory to ~/';
      } else {
        const newPath = currentPath === '~/' ? `~/${dir}` : `${currentPath}/${dir}`;
        setCurrentPath(newPath);
        return `Changed directory to ${newPath}`;
      }
    },
    
    mkdir: (args: string[]) => {
      if (!args[0]) return 'mkdir: missing directory name';
      return `Directory '${args[0]}' created`;
    },
    
    cat: (args: string[]) => {
      if (!args[0]) return 'cat: missing filename';
      if (args[0] === 'README.txt') {
        return `Welcome to PrathviOS!

This is a web-based operating system that runs entirely in your browser.
Features include:
- Desktop environment with window management
- File system with IndexedDB storage
- Command-line interface (PrathviShell)
- Built-in applications and productivity tools
- Package management system

Enjoy exploring PrathviOS!`;
      }
      return `cat: ${args[0]}: No such file or directory`;
    },
    
    echo: (args: string[]) => args.join(' '),
    
    date: () => new Date().toString(),
    
    whoami: () => 'user',
    
    uname: () => 'PrathviOS 1.0.0 (WebOS)',
    
    prpm: (args: string[]) => {
      if (!args[0] || args[0] === 'help') {
        return `PrathviOS Package Manager (prpm) v1.0.0

Usage: prpm <command> [options]

Commands:
  install <package>  - Install a package
  remove <package>   - Remove a package
  list              - List installed packages
  search <query>    - Search available packages
  update            - Update package list
  upgrade           - Upgrade all packages`;
      }
      
      switch (args[0]) {
        case 'list':
          return `Installed packages:
  prathvi-core      1.0.0
  prathvi-desktop   1.0.0
  prathvi-apps      1.0.0
  prathvi-terminal  1.0.0`;
        
        case 'install':
          if (!args[1]) return 'prpm: missing package name';
          return `Installing ${args[1]}...\nPackage ${args[1]} installed successfully.`;
        
        case 'search':
          if (!args[1]) return 'prpm: missing search query';
          return `Searching for "${args[1]}"...\nNo packages found matching "${args[1]}".`;
        
        default:
          return `prpm: unknown command '${args[0]}'. Type 'prpm help' for usage.`;
      }
    },
  };

  const executeCommand = (cmd: string) => {
    const parts = cmd.trim().split(' ');
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    if (command === '') return '';

    if (command in commands) {
      const commandFunc = commands[command as keyof typeof commands];
      return typeof commandFunc === 'function' ? commandFunc(args) : commandFunc;
    }

    return `prathvish: command not found: ${command}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCommand.trim()) return;

    const output = executeCommand(currentCommand);
    
    if (currentCommand.toLowerCase() !== 'clear') {
      setHistory(prev => [...prev, {
        command: currentCommand,
        output: output || '',
        timestamp: new Date(),
      }]);
    }

    setCurrentCommand('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      // Tab completion could be implemented here
    }
  };

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div 
      className="flex flex-col h-full bg-background text-foreground font-mono text-sm"
      onClick={() => inputRef.current?.focus()}
    >
      <div 
        ref={terminalRef}
        className="flex-1 overflow-auto p-4 cursor-text"
      >
        {history.map((entry, index) => (
          <div key={index} className="mb-2">
            {entry.command && (
              <div className="flex items-center text-primary">
                <span className="text-accent-foreground">user@prathvios</span>
                <span className="text-muted-foreground">:</span>
                <span className="text-primary">{currentPath}</span>
                <span className="text-muted-foreground">$ </span>
                <span>{entry.command}</span>
              </div>
            )}
            {entry.output && (
              <pre className="whitespace-pre-wrap text-foreground mt-1">
                {entry.output}
              </pre>
            )}
          </div>
        ))}
        
        {/* Current command line */}
        <form onSubmit={handleSubmit} className="flex items-center">
          <span className="text-accent-foreground">user@prathvios</span>
          <span className="text-muted-foreground">:</span>
          <span className="text-primary">{currentPath}</span>
          <span className="text-muted-foreground">$ </span>
          <input
            ref={inputRef}
            type="text"
            value={currentCommand}
            onChange={(e) => setCurrentCommand(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent outline-none text-foreground ml-1"
            autoComplete="off"
            spellCheck={false}
          />
        </form>
      </div>
    </div>
  );
};