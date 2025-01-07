import { CharacterPosition } from 'types/play';

export const updatePrevPosition = (
  target: HTMLElement,
  setPrevPosition: (position: CharacterPosition) => void
) => {
  const parentSquare = target.closest('.square');

  if (parentSquare) {
    const rowMatch = parentSquare.className.match(/row-(\d+)/);
    const colMatch = parentSquare.className.match(/col-(\d+)/);

    if (rowMatch && colMatch) {
      const row = parseInt(rowMatch[1], 10);
      const col = parseInt(colMatch[1], 10);
      setPrevPosition({ row, col });
    }
  }
};
