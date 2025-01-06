import { CharacterInfoInterface, CharacterPosition } from 'types/play';
import { usePlayStore } from 'stores/playStore';
import { moveCharacterForMobile } from 'utils/moveCharacterForMobile';
import { useEffect } from 'react';

export const useTouchEndListener = (
  row: number,
  col: number,
  updateBoard: (
    prevPosition: CharacterPosition,
    nextPosition: { row: number; col: number },
    characterInfo: CharacterInfoInterface
  ) => void
) => {
  const { prevPosition } = usePlayStore();
  const nextPosition = { row, col };

  const checkIfWithinBounds = (
    bounds: DOMRect | undefined,
    touchingPosition: { x: number; y: number }
  ) =>
    bounds &&
    touchingPosition &&
    touchingPosition.x >= bounds.left &&
    touchingPosition.x <= bounds.right &&
    touchingPosition.y >= bounds.top &&
    touchingPosition.y <= bounds.bottom;

  useEffect(() => {
    const handleDropAttempt = () => {
      const squareElement = document.querySelector(
        `.square.row-${row}.col-${col}`
      );

      if (!squareElement) return;

      const bounds = squareElement.getBoundingClientRect(); // DOM 요소 square의 크기와 위치

      const touchingPosition = (window as any).touchingPosition; // 현재 터치 중인 위치 정보

      if (checkIfWithinBounds(bounds, touchingPosition)) {
        moveCharacterForMobile(prevPosition, nextPosition, updateBoard);
      }
    };

    // 터치 이벤트 리스너 등록 (`character-touch-end` 이벤트 발생 시 handleDropAttempt 함수 실행)
    window.addEventListener('character-touch-end', handleDropAttempt);

    // 컴포넌트가 언마운트될 때 이벤트 리스너 제거
    return () => {
      window.removeEventListener('character-touch-end', handleDropAttempt);
    };
  }, [row, col, prevPosition]);
};
