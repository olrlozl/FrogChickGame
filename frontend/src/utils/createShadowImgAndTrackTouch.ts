import { CharacterInfoInterface } from 'types/play';

export const createShadowImgAndTrackTouch = (
  e: React.TouchEvent<HTMLImageElement>,
  characterInfo: CharacterInfoInterface,
  imageSrc: string,
  dragShadowImgRef: React.RefObject<HTMLImageElement | null>
) => {
  const { characterOption, characterSize } = characterInfo;
  const touch = e.touches[0]; // 터치 이벤트에서 첫 번째 터치 정보 가져오기 (여러 손가락을 사용한 터치를 감지할 수 있기 때문)
  const characterData = JSON.stringify(characterInfo);

  (window as any).currentTouchData = characterData; // 터치한 캐릭터 정보를 window 객체에 저장
  (window as any).touchingPosition = { x: touch.clientX, y: touch.clientY }; // 현재 터치 위치를 window 객체에 저장 (터치 중 위치 추적에 사용)

  const dragShadowImg = document.createElement('img'); // 드래그 시 생성되는 캐릭터 이미지를 위한 img 요소 동적 생성
  dragShadowImg.src = imageSrc; // 터치한 캐릭터와 동일한 이미지 표시
  dragShadowImg.className = `character-img ${characterOption} ${characterSize}`; // 스타일 지정을 위한 클래스이름 적용
  dragShadowImg.style.position = 'absolute';
  dragShadowImg.style.pointerEvents = 'none'; // 쉐도우 이미지가 다른 요소와 상호작용하지 않도록 함
  dragShadowImg.style.zIndex = '1000';
  dragShadowImg.style.transform = 'translate(-50%, -50%)'; // 이미지의 중심을 기준으로 드래그
  dragShadowImg.style.left = `${touch.clientX}px`; // 터치 시작 시 쉐도우 이미지 위치 설정
  dragShadowImg.style.top = `${touch.clientY}px`;

  document.body.appendChild(dragShadowImg); // 쉐도우 이미지를 body에 추가하여 화면에 표시되게 함
  dragShadowImgRef.current = dragShadowImg; // 쉐도우 이미지의 참조 저장 (이후 위치 업데이트 및 제거에 사용)
};
