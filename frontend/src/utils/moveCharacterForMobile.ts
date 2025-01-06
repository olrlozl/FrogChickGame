import { CharacterInfoInterface, CharacterPosition } from 'types/play';

export const moveCharacterForMobile = (
  prevPosition: CharacterPosition,
  nextPosition: { row: number; col: number },
  updateBoard: (
    prevPosition: CharacterPosition,
    nextPosition: { row: number; col: number },
    characterInfo: CharacterInfoInterface
  ) => void
) => {
  const characterData = (window as any).currentTouchData; // window에서 현재 터치한 캐릭터 정보 가져오기
  if (characterData) {
    try {
      const characterInfo = JSON.parse(characterData); // 데이터 파싱하여 캐릭터 정보 추출
      updateBoard(prevPosition, nextPosition, characterInfo); // 캐릭터 이동 처리
      (window as any).currentTouchData = null; // 터치 데이터 초기화
    } catch (error) {
      console.error('Error parsing touch data', error); // 데이터 파싱 중 에러 처리
    }
  }
};
