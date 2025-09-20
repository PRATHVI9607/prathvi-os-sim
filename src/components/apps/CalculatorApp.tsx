import React, { useState } from 'react';
import { Delete } from 'lucide-react';

export const CalculatorApp: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(num);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const performOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      let result = 0;

      switch (operation) {
        case '+':
          result = currentValue + inputValue;
          break;
        case '-':
          result = currentValue - inputValue;
          break;
        case '×':
          result = currentValue * inputValue;
          break;
        case '÷':
          result = inputValue !== 0 ? currentValue / inputValue : 0;
          break;
        case '=':
          result = inputValue;
          break;
        default:
          return;
      }

      setDisplay(String(result));
      setPreviousValue(result);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = () => {
    performOperation('=');
    setOperation(null);
    setPreviousValue(null);
    setWaitingForOperand(true);
  };

  const buttons = [
    { label: 'C', onClick: clear, type: 'function' },
    { label: '±', onClick: () => setDisplay(String(-parseFloat(display))), type: 'function' },
    { label: '%', onClick: () => setDisplay(String(parseFloat(display) / 100)), type: 'function' },
    { label: '÷', onClick: () => performOperation('÷'), type: 'operator' },
    
    { label: '7', onClick: () => inputNumber('7'), type: 'number' },
    { label: '8', onClick: () => inputNumber('8'), type: 'number' },
    { label: '9', onClick: () => inputNumber('9'), type: 'number' },
    { label: '×', onClick: () => performOperation('×'), type: 'operator' },
    
    { label: '4', onClick: () => inputNumber('4'), type: 'number' },
    { label: '5', onClick: () => inputNumber('5'), type: 'number' },
    { label: '6', onClick: () => inputNumber('6'), type: 'number' },
    { label: '-', onClick: () => performOperation('-'), type: 'operator' },
    
    { label: '1', onClick: () => inputNumber('1'), type: 'number' },
    { label: '2', onClick: () => inputNumber('2'), type: 'number' },
    { label: '3', onClick: () => inputNumber('3'), type: 'number' },
    { label: '+', onClick: () => performOperation('+'), type: 'operator' },
    
    { label: '0', onClick: () => inputNumber('0'), type: 'number', span: 2 },
    { label: '.', onClick: inputDecimal, type: 'number' },
    { label: '=', onClick: calculate, type: 'equals' },
  ];

  return (
    <div className="flex flex-col h-full bg-background p-4 max-w-xs mx-auto">
      {/* Display */}
      <div className="mb-4">
        <div className="bg-muted/50 rounded-lg p-4 text-right">
          <div className="text-3xl font-mono text-foreground overflow-hidden">
            {display}
          </div>
        </div>
      </div>

      {/* Buttons Grid */}
      <div className="grid grid-cols-4 gap-2 flex-1">
        {buttons.map((button, index) => (
          <button
            key={index}
            onClick={button.onClick}
            className={`
              rounded-lg font-semibold transition-all duration-150 hover:scale-105 active:scale-95
              ${button.span === 2 ? 'col-span-2' : ''}
              ${
                button.type === 'number' 
                  ? 'bg-muted text-foreground hover:bg-muted/80' 
                  : button.type === 'operator'
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                  : button.type === 'equals'
                  ? 'bg-accent text-accent-foreground hover:bg-accent/90'
                  : 'bg-muted/50 text-muted-foreground hover:bg-muted/70'
              }
              h-12 text-lg
            `}
          >
            {button.label}
          </button>
        ))}
      </div>

      {/* Memory/History area (placeholder) */}
      <div className="mt-4 text-xs text-muted-foreground text-center">
        PrathviCalc v1.0
      </div>
    </div>
  );
};