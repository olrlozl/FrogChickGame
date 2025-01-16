import { CharacterInfoInterface, CharacterPosition } from 'types/play';
import { usePlayStore } from 'stores/playStore';
import { moveCharacterForWeb } from 'utils/moveCharacterForWeb';

export const useDropForWeb = (
  row: number,
  col: number,
  updateBoard: (
    prevPosition: CharacterPosition,
    nextPosition: { row: number; col: number },
    characterInfo: CharacterInfoInterface
  ) => void
) => {
  const { prevPosition, setSelectedCharacterKey, setPrevPosition } =
    usePlayStore();

  const handleDrop = (e: React.DragEvent<HTMLImageElement>) => {
    const nextPosition = { row, col };
    moveCharacterForWeb(e, prevPosition, nextPosition, updateBoard);
    setSelectedCharacterKey(null);
    setPrevPosition({ row: null, col: null });
  };

  const handleDragOver = (e: React.DragEvent<HTMLImageElement>) => {
    e.preventDefault();
  };

  return { handleDrop, handleDragOver };
};
