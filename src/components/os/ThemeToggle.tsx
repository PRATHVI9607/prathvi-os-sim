import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useOS } from '../../contexts/OSContext';
import { Button } from '../ui/button';

export const ThemeToggle: React.FC = () => {
  const { state, dispatch } = useOS();

  const handleToggle = () => {
    dispatch({ type: 'TOGGLE_THEME' });
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleToggle}
      className="h-8 w-8 p-0 hover:bg-foreground/10"
    >
      {state.theme === 'sky' ? (
        <Moon size={16} className="text-foreground" />
      ) : (
        <Sun size={16} className="text-foreground" />
      )}
    </Button>
  );
};