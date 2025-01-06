import { useState } from 'react';
import { CharacterInfoInterface, CharacterPosition } from 'types/play';

export const useBoard = () => {
  const [board, setBoard] = useState<(CharacterInfoInterface | null)[][]>(
    Array(3)
      .fill(null)
      .map(() => Array(3).fill(null))
  );

  const updateBoard = (
    prevPosition: CharacterPosition = {
      row: null,
      col: null,
    },
    nextPosition: { row: number; col: number },
    characterInfo: CharacterInfoInterface
  ) => {
    setBoard((prevBoard) => {
      const updatedBoard = prevBoard.map((col) => [...col]);

      if (prevPosition.col !== null && prevPosition.row !== null) {
        updatedBoard[prevPosition.col][prevPosition.row] = null;
      }

      updatedBoard[nextPosition.col][nextPosition.row] = characterInfo;
      return updatedBoard;
    });
  };

  return { board, updateBoard };
};
