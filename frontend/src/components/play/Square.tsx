import { CharacterInfoInterface } from 'types/play';
import 'styles/components/play/square.scss';
import Character from 'components/play/Character';
import { useTouchEndListener } from 'hooks/useTouchEndListener';
import { moveCharacterToSquare } from 'utils/moveCharacterToSquare';
import { handleDropCharacter } from 'utils/handleDropCharacter';
import { useCharacterStore } from 'stores/CharacterStore';
import { CharacterPosition } from 'types/play';

interface SquareProps {
  row: number;
  col: number;
  characterInfo: CharacterInfoInterface | null;
  updateBoard: (
    prevPosition: CharacterPosition,
    nextPosition: { row: number; col: number },
    characterInfo: CharacterInfoInterface
  ) => void;
}

const Square = ({ row, col, characterInfo, updateBoard }: SquareProps) => {
  const { prevPosition, setSelectedCharacterKey, setPrevPosition } =
    useCharacterStore();

  const nextPosition = { row: row, col: col };

  // 모바일 환경
  const dropCharacter = () =>
    moveCharacterToSquare(prevPosition, nextPosition, updateBoard);

  useTouchEndListener(row, col, dropCharacter);

  // 웹 환경
  const handleDrop = (e: React.DragEvent<HTMLImageElement>) => {
    handleDropCharacter(e, prevPosition, nextPosition, updateBoard);
    setSelectedCharacterKey(null);
    setPrevPosition({ row: null, col: null });
  };

  const handleDragOver = (e: React.DragEvent<HTMLImageElement>) => {
    e.preventDefault();
  };

  return (
    <div
      className={`square row-${row} col-${col}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      {characterInfo && <Character characterInfo={characterInfo} />}
    </div>
  );
};

export default Square;
