import { useBoard } from 'hooks/useBoard';
import Square from './Square';
import 'styles/components/play/board.scss';

const Board = () => {
  const { board, updateBoard } = useBoard();

  return (
    <div className="board">
      {board.map((col, colIndex) => (
        <div className="board-col" key={colIndex}>
          {col.map((square, rowIndex) => (
            <Square
              key={`${rowIndex}-${colIndex}`}
              row={rowIndex}
              col={colIndex}
              characterInfo={square}
              updateBoard={updateBoard}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Board;
