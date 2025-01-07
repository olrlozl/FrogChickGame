import { CharacterPosition } from 'types/play';

export const getPrevPosition = (
  parentSquare: HTMLElement
): CharacterPosition => {
  const rowMatch = parentSquare.className.match(/row-(\d+)/);
  const colMatch = parentSquare.className.match(/col-(\d+)/);

  if (rowMatch && colMatch) {
    const row = parseInt(rowMatch[1], 10);
    const col = parseInt(colMatch[1], 10);

    return { row, col };
  }

  return { row: null, col: null };
};
