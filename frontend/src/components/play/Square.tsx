import { CharacterInfoInterface, CharacterPosition } from 'types/play';
import { useTouchEndListener } from 'hooks/useTouchEndListener';
import { useDropForWeb } from 'hooks/useDropForWeb';
import Character from 'components/play/Character';
import 'styles/components/play/square.scss';

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
  useTouchEndListener(row, col, updateBoard);

  const { handleDrop, handleDragOver } = useDropForWeb(row, col, updateBoard);

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
