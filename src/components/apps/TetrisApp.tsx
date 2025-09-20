import React, { useState, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCw, ArrowDown } from 'lucide-react';

type TetrominoType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';

interface Piece {
  type: TetrominoType;
  shape: number[][];
  x: number;
  y: number;
}

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;

const TETROMINOES: Record<TetrominoType, number[][]> = {
  I: [[1, 1, 1, 1]],
  O: [[1, 1], [1, 1]],
  T: [[0, 1, 0], [1, 1, 1]],
  S: [[0, 1, 1], [1, 1, 0]],
  Z: [[1, 1, 0], [0, 1, 1]],
  J: [[1, 0, 0], [1, 1, 1]],
  L: [[0, 0, 1], [1, 1, 1]]
};

const COLORS: Record<TetrominoType, string> = {
  I: '#00f5ff',
  O: '#ffff00',
  T: '#800080',
  S: '#00ff00',
  Z: '#ff0000',
  J: '#0000ff',
  L: '#ff8c00'
};

export const TetrisApp: React.FC = () => {
  const [board, setBoard] = useState<(TetrominoType | null)[][]>(() =>
    Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(null))
  );
  const [currentPiece, setCurrentPiece] = useState<Piece | null>(null);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lines, setLines] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const createRandomPiece = (): Piece => {
    const types: TetrominoType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
    const type = types[Math.floor(Math.random() * types.length)];
    return {
      type,
      shape: TETROMINOES[type],
      x: Math.floor(BOARD_WIDTH / 2) - Math.floor(TETROMINOES[type][0].length / 2),
      y: 0
    };
  };

  const isValidPosition = (piece: Piece, deltaX = 0, deltaY = 0, newShape?: number[][]): boolean => {
    const shape = newShape || piece.shape;
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x]) {
          const newX = piece.x + x + deltaX;
          const newY = piece.y + y + deltaY;
          
          if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) {
            return false;
          }
          
          if (newY >= 0 && board[newY][newX]) {
            return false;
          }
        }
      }
    }
    return true;
  };

  const rotatePiece = (piece: Piece): number[][] => {
    const rotated = piece.shape[0].map((_, index) =>
      piece.shape.map(row => row[index]).reverse()
    );
    return rotated;
  };

  const placePiece = (piece: Piece) => {
    const newBoard = [...board];
    piece.shape.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell) {
          const boardY = piece.y + y;
          const boardX = piece.x + x;
          if (boardY >= 0) {
            newBoard[boardY][boardX] = piece.type;
          }
        }
      });
    });
    return newBoard;
  };

  const clearLines = (board: (TetrominoType | null)[][]): { newBoard: (TetrominoType | null)[][], linesCleared: number } => {
    const newBoard = board.filter(row => row.some(cell => cell === null));
    const linesCleared = BOARD_HEIGHT - newBoard.length;
    
    while (newBoard.length < BOARD_HEIGHT) {
      newBoard.unshift(Array(BOARD_WIDTH).fill(null));
    }
    
    return { newBoard, linesCleared };
  };

  const dropPiece = useCallback(() => {
    if (!currentPiece || gameOver) return;

    if (isValidPosition(currentPiece, 0, 1)) {
      setCurrentPiece(prev => prev ? { ...prev, y: prev.y + 1 } : null);
    } else {
      // Place piece
      const newBoard = placePiece(currentPiece);
      const { newBoard: clearedBoard, linesCleared } = clearLines(newBoard);
      
      setBoard(clearedBoard);
      setLines(prev => prev + linesCleared);
      setScore(prev => prev + linesCleared * 100 * level);
      
      // Create new piece
      const newPiece = createRandomPiece();
      if (isValidPosition(newPiece)) {
        setCurrentPiece(newPiece);
      } else {
        setGameOver(true);
        setIsPlaying(false);
      }
    }
  }, [currentPiece, board, gameOver, level]);

  const movePiece = (deltaX: number) => {
    if (!currentPiece || gameOver) return;
    
    if (isValidPosition(currentPiece, deltaX, 0)) {
      setCurrentPiece(prev => prev ? { ...prev, x: prev.x + deltaX } : null);
    }
  };

  const rotatePieceHandler = () => {
    if (!currentPiece || gameOver) return;
    
    const rotatedShape = rotatePiece(currentPiece);
    if (isValidPosition(currentPiece, 0, 0, rotatedShape)) {
      setCurrentPiece(prev => prev ? { ...prev, shape: rotatedShape } : null);
    }
  };

  const startGame = () => {
    setBoard(Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(null)));
    setCurrentPiece(createRandomPiece());
    setScore(0);
    setLevel(1);
    setLines(0);
    setIsPlaying(true);
    setGameOver(false);
  };

  const togglePause = () => {
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isPlaying || gameOver) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          movePiece(-1);
          break;
        case 'ArrowRight':
          movePiece(1);
          break;
        case 'ArrowDown':
          dropPiece();
          break;
        case 'ArrowUp':
        case ' ':
          rotatePieceHandler();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isPlaying, gameOver, dropPiece]);

  useEffect(() => {
    if (!isPlaying || gameOver) return;
    
    const interval = setInterval(() => {
      dropPiece();
    }, Math.max(50, 1000 - (level - 1) * 100));
    
    return () => clearInterval(interval);
  }, [isPlaying, gameOver, level, dropPiece]);

  useEffect(() => {
    setLevel(Math.floor(lines / 10) + 1);
  }, [lines]);

  const renderBoard = () => {
    const displayBoard = board.map(row => [...row]);
    
    // Add current piece to display board
    if (currentPiece) {
      currentPiece.shape.forEach((row, y) => {
        row.forEach((cell, x) => {
          if (cell) {
            const boardY = currentPiece.y + y;
            const boardX = currentPiece.x + x;
            if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
              displayBoard[boardY][boardX] = currentPiece.type;
            }
          }
        });
      });
    }
    
    return displayBoard;
  };

  return (
    <div className="flex h-full bg-background p-4">
      {/* Game Board */}
      <div className="flex-1 flex items-center justify-center">
        <div className="bg-muted/20 p-4 rounded-lg">
          <div 
            className="grid gap-0.5 border-2 border-border rounded"
            style={{ 
              gridTemplateColumns: `repeat(${BOARD_WIDTH}, 1fr)`,
              gridTemplateRows: `repeat(${BOARD_HEIGHT}, 1fr)`
            }}
          >
            {renderBoard().map((row, y) =>
              row.map((cell, x) => (
                <div
                  key={`${y}-${x}`}
                  className="w-6 h-6 border border-border/20"
                  style={{
                    backgroundColor: cell ? COLORS[cell] : 'transparent'
                  }}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Game Info and Controls */}
      <div className="w-64 ml-4 space-y-4">
        {/* Score */}
        <div className="bg-muted/30 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Score</h3>
          <div className="text-2xl font-mono">{score.toLocaleString()}</div>
          <div className="text-sm text-muted-foreground mt-2">
            Level: {level} | Lines: {lines}
          </div>
        </div>

        {/* Controls */}
        <div className="bg-muted/30 p-4 rounded-lg">
          <h3 className="font-semibold mb-3">Controls</h3>
          {!isPlaying && !gameOver && (
            <button
              onClick={startGame}
              className="w-full mb-2 p-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 flex items-center justify-center gap-2"
            >
              <Play size={16} />
              Start Game
            </button>
          )}
          
          {isPlaying && !gameOver && (
            <button
              onClick={togglePause}
              className="w-full mb-2 p-2 bg-secondary text-secondary-foreground rounded hover:bg-secondary/90 flex items-center justify-center gap-2"
            >
              <Pause size={16} />
              Pause
            </button>
          )}
          
          {gameOver && (
            <div className="text-center mb-4">
              <div className="text-lg font-semibold text-destructive mb-2">Game Over!</div>
              <button
                onClick={startGame}
                className="w-full p-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
              >
                Play Again
              </button>
            </div>
          )}
          
          <div className="text-xs text-muted-foreground space-y-1">
            <div>← → Move</div>
            <div>↓ Drop</div>
            <div>↑ / Space Rotate</div>
          </div>
        </div>

        {/* Game Instructions */}
        <div className="bg-muted/30 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">How to Play</h3>
          <div className="text-xs text-muted-foreground space-y-1">
            <p>Fill horizontal lines to clear them.</p>
            <p>Game speeds up as you progress.</p>
            <p>Don't let the pieces reach the top!</p>
          </div>
        </div>
      </div>
    </div>
  );
};