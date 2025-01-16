import { CharacterInfoInterface, CharacterPosition } from 'types/play';

export const moveCharacterForWeb = (
  e: React.DragEvent<HTMLDivElement>,
  prevPosition: CharacterPosition,
  nextPosition: { row: number; col: number },
  updateBoard: (
    prevPosition: CharacterPosition,
    nextPosition: { row: number; col: number },
    characterInfo: CharacterInfoInterface
  ) => void
) => {
  e.preventDefault();

  try {
    const characterData = e.dataTransfer.getData('text/plain');

    if (characterData) {
      const characterInfo = JSON.parse(characterData);
      updateBoard(prevPosition, nextPosition, characterInfo);
    }

    e.dataTransfer.clearData();
  } catch (error) {
    console.error('Error parsing drag data', error);
  }
};
